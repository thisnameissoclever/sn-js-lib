//defer classes/GlideWindow.js
var GlideWindow = Class.create(GwtObservable, {
    DEFAULT_BODY: "<center> Loading... <br/><img src='images/ajax-loader.gifx' alt='Loading...' /></center>",
    FORWARD_EVENTS: {
        "mouseover" : true,
        "mouseout" : true,
        "mousemove" : true,
        "click" : true,
        "dblclick" : true,
        "keyup" : true,
        "mouseenter" : true,
        "mouseleave" : true
    },
    initialize: function(id, readOnly) {
        this.id = id;
        this.window = null;
        this.windowClass = "drag_section_picker";
        this.zIndex = 1;
        this.position = "absolute";
        this.padding = 3;
        this.container = null;
        this._readOnly = readOnly;
        this.preferences = new Object();
        this.titleHTML = null;
        this.elementToFocus = null;
        this.offsetLeft = 0;
        this.offsetTop = 0;
        this.gd = null;
        this.shim = null;
        this.valid = true;
        this.closeDecoration = null;
        this._draw(id);
        this.initDecorations();
        this.headerWrap = false;
    },
    addDecoration: function(decorationElement, leftSide) {
        if (leftSide) {
            var ld = this.leftDecorations;
            ld.style.display = "block";
            if (ld.hasChildNodes()) {
                ld.insertBefore(decorationElement, ld.childNodes[0].nextSibling);
            } else {
                ld.appendChild(decorationElement);
            }
        } else {
            if  (this.rightDecorations) {
                var rd = this.rightDecorations;
                if (rd.hasChildNodes()) {
                    rd.insertBefore(decorationElement, rd.childNodes[0]);
                } else {
                    rd.appendChild(decorationElement);
                }
            }
            else {
        }
        }
    },
    addFunctionDecoration: function(imgSrc, imgAlt, func, side) {
        var span = cel('span');
        var img = cel("img", span);
        img.id = 'popup_close_image';
        img.height = "12"
        img.width = "13"
        if (ie5)
            img.style.cursor = 'hand';
        else
            img.style.cursor = 'pointer';
        img.src = imgSrc;
        img.alt = new GwtMessage().getMessage(imgAlt);
        img.gWindow = this;
        img.onclick = func;
        this.addDecoration(span, side);
        img = null;
        return span;
    },
    clearLeftDecorations: function() {
        clearNodes(this.leftDecorations);
    },
    clearRightDecorations: function() {
        clearNodes(this.rightDecorations);
    },
    dragging: function(me, x, y) {
        this.fireEvent("dragging", this);
        me.draggable.style.left = x + 'px';
        me.draggable.style.top = y + 'px';
        this._setShimBounds(x, y, "", "");
    },
    destroy: function() {
        this.fireEvent("beforeclose", this);
        if (this.container) {
            var parent = this.container.parentNode;
            parent.removeChild(this.container);
        } else {
            var gWindow = this.getWindowDOM();
            var parent = gWindow.parentNode;
            parent.removeChild(gWindow);
        }
        this.setShim(false);
        if (isMSIE)
            this.container.outerHTML = '';
        this.release();
        this.valid = false;
        this.closeDecoration = null;
    },
    getAbsoluteRect: function(addScroll) {
        return getBounds(this.getWindowDOM(), addScroll);
    },
    getBody: function() {
        return this.body;
    },
    getContainer: function() {
        var obj;
        if (this.container) {
            obj = this.container;
        } else {
            obj = this.getWindowDOM();
        }
        return obj;
    },
    getClassName: function() {
        return this.getWindowDOM().className;
    },
    getDecorations: function(left) {
        if (left)
            return this.leftDecorations;
        return this.rightDecorations;
    },
    getDescribingXML : function() {
        var section = document.createElement("section");
        section.setAttribute("name", this.getID());
        var preferences = this.getPreferences();
        for(var name in preferences) {
            var p = document.createElement("preference");
            var v = preferences[name];
            p.setAttribute("name", name);
            if (typeof v == 'object') {
                if (typeof v.join == "function") {
                    v = v.join(",");
                } else if (typeof v.toString == "function") {
                    v = v.toString();
                }
            }
            if (v)
                p.setAttribute("value", v);
            section.appendChild(p);
        }
        return section;
    },
    getDescribingText : function() {
        var gxml = document.createElement("gxml");
        var x = this.getDescribingXML();
        gxml.appendChild(x);
        return gxml.innerHTML;
    },
    getHeader: function() {
        return this.header;
    },
    getID: function() {
        return this.id;
    },
    getPosition: function() {
        return this.position;
    },
    getPreferences : function() {
        return this.preferences;
    },
    getPreference : function(id) {
        return this.preferences[id];
    },
    getTitle: function() {
        return this.title;
    },
    locate: function(domElement) {
        while (domElement.parentNode) {
            domElement = domElement.parentNode;
            if (domElement.gWindow)
                return domElement.gWindow;
        }
        alert('GlideWindow.locate: window not found');
        return null;
    },
    get: function(id) {
        if (!id || !gel('window.' + id))
            return this;
        return gel('window.' + id).gWindow;
    },
    getWindowDOM: function() {
        return this.window;
    },
    getZIndex: function() {
        return this.zIndex;
    },
    initDecorations: function() {
        if (!this.isReadOnly()) {
            this.closeDecoration = this.addFunctionDecoration("images/x.gifx", 'Close', this._onCloseClicked.bind(this));
        }
    },
    removeCloseDecoration: function() {
        if (this.closeDecoration)
            this.closeDecoration.parentNode.removeChild(this.closeDecoration);
        this.closeDecoration = null;
    },
    showCloseOnMouseOver: function() {
        Event.observe(this.window, "mouseover", this.showCloseButton.bind(this));
        Event.observe(this.window, "mouseout", this.hideCloseButton.bind(this));
        this.hideCloseButton();
    },
    showCloseButton: function() {
        if (this.closeDecoration)
            this.closeDecoration.style.visibility="visible";
    },
    hideCloseButton: function() {
        if (this.closeDecoration)
            this.closeDecoration.style.visibility="hidden";
    },
    insert: function(element, beforeElement, invisible) {
        var id = this.getID();
        element = $(element);
        var div = $(id);
        if (!div) {
            var div = cel("div");
            div.name = div.id = id;
            div.gWindow = this;
            div.setAttribute("dragpart", id);
            div.style.position = this.getPosition();
            div.style.zIndex = this.getZIndex();
            div.style.left = this.offsetLeft + "px";
            div.style.top = this.offsetTop + "px";
            div.appendChild(this.getWindowDOM());
            if (invisible)
                div.style.visibility = "hidden";
            if (beforeElement)
                element.insertBefore(div, beforeElement);
            else
                element.appendChild(div);
            this.container = div;
            this._enableDragging(div);
        }
    },
    isActive: function() {
        return this.active;
    },
    isReadOnly: function() {
        return this._readOnly;
    },
    isValid: function() {
        return this.valid;
    },
    moveTo: function(x, y) {
        var o = this.getContainer();
        o.style.left = x + 'px';
        o.style.top = y + 'px';
        this._setShimBounds(x, y, "", "");
    },
    release: function() {
        this.window.gWindow = null;
        this.window = null;
        this.container = null;
        this.body = null;
        if (this.gd)
            this.gd.destroy();
        this.title = null;
        this.header = null;
        this.shim = null;
        this.rightDecorations = null;
        this.leftDecorations = null;
    },
    removePreference: function(name, value) {
        delete this.preferences[name];
    },
    render: function() {
        var id = this.getID();
        var description = this.getDescribingText();
        var ajax = new GlideAjax("RenderInfo");
        ajax.addParam("sysparm_value", description);
        ajax.addParam("sysparm_name", id);
        ajax.getXML(this._bodyRendered.bind(this));
    },
    invisible: function() {
        var e = this.getContainer();
        e.style.visibility = "hidden";
    },
    visible: function() {
        var e = this.getContainer();
        e.style.visibility = "visible";
    },
    setAlt: function(alt) {
        this.window.title = alt;
    },
    setEscapedBody: function(body) {
        if (!body)
            return;
        body = body.replace(/\t/g, "");
        body = body.replace(/\r/g, "");
        body = body.replace(/\n+/g, "\n");
        body = body.replace(/%27/g, "'");
        body = body.replace(/%3c/g, "<");
        body = body.replace(/%3e/g, ">");
        body = body.replace(/&amp;/g, "&");
        this.setBody(body, true);
    },
    setBody: function(html, noEvaluate, setAlt) {
        this.body.innerHTML = "";
        if (typeof html == 'string') {
            var showBody = true;
            if (html.length == 0)
                showBody = false;
            this.showBody(showBody);
            html = this._substituteGet(html);
            html = this._fixBrowserTags(html);
            this.body.innerHTML = html;
            if (setAlt)
                this.setBodyAlt(html);
            if (!noEvaluate)
                this._evalScripts(html);
        } else {
            this.body.appendChild(html);
        }
        var prefs = this.body.getElementsByTagName("renderpreference");
        if (prefs.length > 0) {
            for(var i = 0; i < prefs.length; i++) {
                var pref = prefs[i];
                var name = pref.getAttribute("name");
                var valu = pref.getAttribute("value");
                this.setPreference(name, valu);
                if (name == "title")
                    this.setTitle(valu);
            }
        }
        var decorations = this.body.getElementsByTagName("decoration");
        if (decorations.length > 0) {
            for (var x = 0; x < decorations.length; x++) {
                var thisDecoration = new GlideDecoration(decorations[x]);
                thisDecoration.attach(this);
            }
        }
        if (this.elementToFocus) {
            if (gel(this.elementToFocus)) {
                self.focus();
                gel(this.elementToFocus).focus();
            }
        }
        this._shimResize();
    },
    showBody: function(show) {
        if (this.divMode)
            var tr = this.body;
        else
            var tr = this.body.parentNode.parentNode;
        if (show)
            tr.style.display = "";
        else
            tr.style.display = "none";
    },
    setBodyAlt: function(alt) {
        this.body.title = alt;
    },
    setClassName: function(className) {
        this.windowClass = className;
        if (this.getWindowDOM())
            this.getWindowDOM().className = className;
    },
    setColor: function(color) {
        this.windowBackground = color;
        if (this.getBody())
            this.getBody().parentNode.style.backgroundColor = color;
    },
    setFocus: function(id) {
        this.elementToFocus = id;
    },
    setFont: function(family, size, fontUnit, weight) {
        this.setFontSize(size, fontUnit);
        this.setStyle("fontFamily", family);
        this.setFontWeight(weight);
    },
    setFontSize: function(size, fontUnit) {
        if (!fontUnit)
            fontUnit = "pt";
        this.setStyle("fontSize", size + fontUnit);
    },
    setFontWeight: function(weight) {
        this.setStyle("fontWeight", weight);
    },
    setStyle: function(name, value) {
        if (!value)
            return;
        this.getTitle().style[name] = value;
        this.getBody().style[name] = value;
    },
    setHeaderClassName: function(className) {
        this.getHeader().className = className;
    },
    setHeaderColor: function(background) {
        this.header.style.backgroundColor = background;
    },
    setHeaderColors: function(color, background) {
        this.setHeaderColor(background);
        this.title.style.color = color;
    },
    setOpacity: function(opacity) {
        if (this.divMode) {
            var element = this.getBody().parentNode;
            element.style.filter = "alpha(opacity=" + (opacity * 100) + ")";
            element.style.MozOpacity = opacity + "";
            element.style.opacity = opacity + "";
            element.style.opacity = opacity;
        }
    },
    setPreferences : function(preferences) {
        this.preferences = preferences;
    },
    setPreference: function(name, value) {
        if (typeof(value) == 'string') {
            value = value.replace(/</g, "&lt;");
            value = value.replace(/>/g, "&gt;");
        }
        this.preferences[name] = value;
    },
    setPosition: function (name) {
        if (this.getContainer() != this.getWindowDOM())
            this.getContainer().style.position = name;
        this.position = name;
    },
    setReadOnly: function(r) {
        this._readOnly = r;
    },
    setWidth: function(width) {
        this.setSize(width, "");
    },
    getWidth: function() {
        if (this.window)
            return this.window.clientWidth;
        else
            return;
    },
    setSize: function(w, h) {
        var obj = this.getContainer();
        var bo = this.getBody();
        var setWidth = w;
        if (!isNaN(setWidth))
            setWidth = setWidth + 'px';
        if (h && !isNaN(h))
            var setHeight = h + 'px';
        bo.style.width = setWidth;
        obj.style.width = setWidth;
        if (h)
            obj.style.height = setHeight;
        if (obj != this.window)
            this.window.style.width = setWidth;
        this._setShimBounds("", "", w, h);
    },
    adjustBodySize: function() {
        var obj = this.getContainer();
        var bo = this.getBody();
        var h = obj.clientHeight;
        if ((h - this.header.clientHeight) > 0) {
            var headerClientHeight = h - this.header.clientHeight;
            bo.style.height = headerClientHeight + 'px';
        }
        else
            bo.style.height = 0;
        this.window.style.width = obj.clientWidth + 'px';
        this.window.style.height = h + 'px';
    },
    removeBody: function() {
        var element = this.getBody();
        element = element.parentNode; // TD
        element = element.parentNode; // TR
        var tbody = element.parentNode;
        tbody.removeChild(element);
    },
    clearSpacing: function() {
        this.window.style.padding = "0px";
        this.body.style.padding = "0px";
        if (!this.divMode) {
            this.window.cellSpacing = 0;
            this.window.cellPadding = 0;
        }
    },
    setWindowActive: function() {
        this.setHeaderClassName("drag_section_header_active");
        this.active = true;
    },
    setWindowInactive: function() {
        this.setHeaderClassName("drag_section_header");
        this.active = false;
    },
    toggleActive: function() {
        if (this.active)
            this.setWindowInactive();
        else
            this.setWindowActive();
    },
    setHeaderWrap: function(wrap) {
        this.headerWrap = wrap;
        if (wrap)
            this.title.style.whiteSpace = "normal";
        else
            this.title.style.whiteSpace = "nowrap";
    },
    isHeaderWrap: function() {
        return this.headerWrap;
    },
    setShim: function(b) {
        if (!ie5)
            return;
        if (b == false) {
            if (this.shim) {
                var parent = this.shim.parentNode;
                parent.removeChild(this.shim);
            }
        } else {
            var iframeShim = cel("iframe");
            iframeShim.id = iframeShim.name = "iframeDragShim_" + this.id;
            iframeShim.src = "blank.do";
            iframeShim.style.position = "absolute";
            iframeShim.style.top = 0;
            iframeShim.style.left = 0;
            iframeShim.style.width = 0;
            iframeShim.style.height = 0;
            this.container.parentNode.appendChild(iframeShim);
            this.shim = iframeShim;
            var win = this.getWindowDOM();
            Event.observe(win, 'resize', this._shimResize.bind(this));
        }
    },
    setTitle: function(html) {
        if (typeof html == 'string')
            this.title.innerHTML = html;
        else {
            this.title.innerHTML = "";
            this.title.appendChild(html);
        }
    },
    setZIndex: function(i) {
        if (this.getContainer() != this.getWindowDOM())
            this.getContainer().style.zIndex = i;
        this.zIndex = i;
    },
    on: function(name, func) {
        if (this.FORWARD_EVENTS[name])
            this.forward(name, this.window, func);
        else
            GwtObservable.prototype.on.call(this, name, func);
        if (name == "dblclick") {
            if (isMSIE)
                this.window.style.cursor = "hand";
            else
                this.window.style.cursor = "pointer";
        }
    },
    _bodyRendered: function(request) {
        var xml = request.responseXML;
        var uid = xml.documentElement.getAttribute("sysparm_name");
        var newBody = xml.getElementsByTagName("html")[0];
        if (!this.body)
            return;
        if (newBody.xml) {
            xml = newBody.xml;
        } else if (window.XMLSerializer) {
            xml = (new XMLSerializer()).serializeToString(newBody);
        }
        if (!xml)
            return;
        this.setEscapedBody(xml);
        this._evalScripts(xml);
        this.fireEvent("bodyrendered", this);
    },
    _centerOnScreen: function(width, height) {
        var bounds = this.getAbsoluteRect();
        var viewport = new WindowSize();
        var w = viewport.width;
        var h = viewport.height;
        var windowWidth = (width? width : bounds.width);
        var windowHeight = (height? height: bounds.height);
        var scrollX = getScrollX();
        if (typeof scrollX == "undefined")
            scrollX = 0;
        var scrollY = this._getScrollTop();
        var leftX = parseInt((w / 2) - (windowWidth / 2)) + scrollX;
        var topY = parseInt((h / 2) - (windowHeight / 2)) + scrollY;
        if (topY < 0)
            topY = 0;
        if (leftX < 0)
            leftX = 0;
        if (this.container) {
            var headerSpacer = $(this.container.parentNode).select(".section_header_spacer");
            if (headerSpacer.length > 0) {
                headerSpacer = headerSpacer[0];
                if (topY < headerSpacer.offsetHeight)
                    topY = headerSpacer.offsetHeight;
            }
        }
        this.moveTo(leftX, topY);
    },
    _getScrollTop: function() {
        if (this.container.parentNode != document.body)
            return this.container.parentNode.scrollTop;
        return getScrollY();
    },
    _draw: function(id) {
        var e;
        if (this.divMode) {
            e = cel("DIV");
            e.style.overflow = "hidden";
            e.appendChild(this._drawTitle(id));
            e.appendChild(this._drawBody(id));
        } else {
            e = cel("TABLE");
            var dragTableBody = cel("TBODY");
            dragTableBody.appendChild(this._drawTitle(id));
            dragTableBody.appendChild(this._drawBody(id));
            e.appendChild(dragTableBody);
        }
        e.id = "window." + id;
        this.window = e;
        this.window.className = this.windowClass;
        this.window.gWindow = this;
    },
    _drawTitle: function(id) {
        if (!this.divMode) {
            var baseTR = cel("TR");
            baseTR.style.verticalAlign = "top";
            var baseTD = cel("TD");
        }
        var dragTableHeader = cel("TABLE");
        var dragTableHeaderBody = cel("TBODY");
        dragTableHeader.className = "drag_section_header";
        dragTableHeader.style.width = "100%";
        this.header = dragTableHeader;
        var dragTableHeaderTR = cel("TR");
        var leftDecorations = cel("TD");
        leftDecorations.style.display = "none";
        leftDecorations.style.top = "0px";
        leftDecorations.style.left = "0px";
        leftDecorations.style.verticalAlign = "top";
        leftDecorations.style.whiteSpace = "nowrap";
        this.leftDecorations = leftDecorations;
        dragTableHeaderTR.appendChild(leftDecorations);
        var dragTableHeaderTD = cel("TD");
        dragTableHeaderTD.className = "drag_section_movearea";
        dragTableHeaderTD.style.verticalAlign = "top";
        dragTableHeaderTD.id = id + "_header";
        this.title = dragTableHeaderTD;
        dragTableHeaderTR.appendChild(dragTableHeaderTD);
        var rightDecorations = cel("TD");
        rightDecorations.style.top = "0px";
        rightDecorations.style.right = "0px";
        rightDecorations.style.verticalAlign = "top";
        rightDecorations.style.whiteSpace = "nowrap";
        this.rightDecorations = rightDecorations;
        dragTableHeaderTR.appendChild(rightDecorations);
        dragTableHeaderBody.appendChild(dragTableHeaderTR);
        dragTableHeader.appendChild(dragTableHeaderBody);
        if (!this.divMode) {
            baseTD.appendChild(dragTableHeader);
            baseTR.appendChild(baseTD);
        }
        dragTableHeaderTD = null;
        dragTableHeaderTR = null;
        dragTableHeaderBody = null;
        dragTableHeader = null;
        leftDecorations = null;
        rightDecorations = null;
        if (!this.divMode)
            return baseTR;
        else
            return this.header;
    },
    _drawBody: function(id) {
        var e;
        if (this.divMode) {
            e = cel("DIV");
            this.body = e;
        } else {
            e = cel("TR");
            var dragTableTD = cel("TD");
            this.body = cel("SPAN");
            dragTableTD.appendChild(this.body);
            e.appendChild(dragTableTD);
        }
        this.body.id = "body_" + id;
        this.body.style.overflow = "auto";
        this.body.innerHTML = this.DEFAULT_BODY;
        this.body.gWindow = this;
        return e;
    },
    _enableDragging: function(element) {
        var id = element.getAttribute("dragpart");
        if (!id || this.isReadOnly() || this.getPreference('pinned'))
            return;
        var titlebar = gel(id + "_header");
        this.gd = new GwtDraggable(titlebar, element);
        if (typeof this.dragStart == "function")
            this.gd.setStart(this.dragStart.bind(this));
        if (typeof this.dragEnd == "function")
            this.gd.setEnd(this.dragEnd.bind(this));
        if (typeof this.dragging == "function")
            this.gd.setDrag(this.dragging.bind(this));
        titlebar = null;
    },
    _evalScripts: function(html) {
        html = this._substituteGet(html);
        var x = loadXML("<xml>" + html + "</xml>");
        if (x) {
            var scripts = x.getElementsByTagName("script");
            for(var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                var s = "";
                if (script.getAttribute("src")) {
                    var url = script.getAttribute("src");
                    var req = serverRequestWait(url);
                    s = req.responseText;
                } else {
                    s = getTextValue(script);
                    if (!s)
                        s = script.innerHTML;
                }
                if (s)
                    evalScript(s, true);
            }
        }
        if (!window.G_vmlCanvasManager)
            return;
        window.G_vmlCanvasManager.init_(document)
    },
    _fixBrowserTags: function(html) {
        if (!html)
            return html;
        var tags = [ "script", "a ", "div", "span" ];
        for(var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            html = html.replace(new RegExp('<' + tag + '([^>]*?)/>', 'img'), '<' + tag + '$1></' + tag + '>');
        }
        return html;
    },
    _onCloseClicked: function() {
        if (!this.fireEvent("closeconfirm", this))
            return false;
        var gWindow = $(this.window.gWindow);
        gWindow.destroy();
    },
    _setShimBounds: function(x, y, w, h) {
        if (x != "")
            this.cacheX = parseInt(x);
        if (y != "")
            this.cacheY = parseInt(y);
        if (w != "")
            this.cacheWidth = parseInt(w);
        if (h != "")
            this.cacheHeight = parseInt(h);
        if (!this.shim)
            return;
        if (x != "")
            this.shim.style.left = x + 'px';
        if (y != "")
            this.shim.style.top = y + 'px';
        if (w != "")
            this.shim.style.width = w + 'px';
        if (h != "")
            this.shim.style.height = h + 'px';
    },
    _shimResize: function() {
        if (!this.shim)
            return;
        var bounds = this.getAbsoluteRect();
        this._setShimBounds(bounds.left, bounds.top, bounds.width, bounds.height);
    },
    _substituteGet: function(html) {
        if (!html)
            return html;
        var reg = new RegExp(this.type() + ".get\\(", "g");
        var x = html.replace(reg, this.type() + ".prototype.get('" + this.getID() + "'");
        return x;
    },
    getLowerSpacing : function() {
        return "6px";
    },
    type : function() {
        return "GlideWindow";
    }
});
