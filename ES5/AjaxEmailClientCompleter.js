//defer classes/ajax/AJAXEmailClientCompleter.js
var g_key_delay = 250;
function acReferenceKeyDown(element, evt) {
    if (!element.ac)
        return true;
    return element.ac.keyDown(evt);
}
function acReferenceKeyPress(element, evt) {
    if (!element.ac)
        return true;
    var rv = element.ac.keyPress(evt);
    if (rv == false)
        evt.cancelBubble = true;
    return rv;
}
function acReferenceKeyUp(element, evt) {
    if (!element.ac)
        return true;
    return element.ac.keyUp(evt);
}
var AJAXEmailClientCompleter = Class.create(AJAXReferenceCompleter, {
    initialize: function(element, reference, dependentReference, refQualElements, targetTable, inputSpan) {
        AJAXCompleter.prototype.initialize.call(this, 'AC.' + reference, reference);
        this.className = "AJAXEmailClientCompleter";
        this.inputSpan = inputSpan;
        this.element = element;
        this.keyElement = gel(reference);
        this.setTargetTable(targetTable);
        this.additionalValues = {};
        this.element.ac = this;
        Event.observe(element, 'blur', this.onBlur.bind(this));
        Event.observe(element, 'focus', this.onFocus.bind(this));
        this.saveKeyValue = this.getKeyValue();
        this.currentDisplayValue = this.getDisplayValue();
        this.searchChars = "";
        this.rowCount = 0;
        this.ignoreFocusEvent = false;
        this.max = 0;
        this.cacheClear();
        this.hasFocus = true;
        this.clearDerivedFields = true;
        this.isResolvingFlag = false;
        var f = element.getAttribute("function");
        if (f)
            this.selectionCallBack = f;
    },
    isResolving: function() {
        return this.isResolvingFlag;
    },
    destroy: function() {
        this.element = null;
    },
    keyDown: function(evt) {
        var typedChar = getKeyCode(evt);
        if (typedChar == KEY_ARROWUP) {
            if( !this.selectPrevious())
                this.hideDropDown();
        } else if (typedChar == KEY_ARROWDOWN) {
            if (!this.isVisible()) {
                if (!this.isPopulated())
                    return;
                this.showDropDown();
            }
            this.selectNext();
        }
    },
    keyUp: function(evt) {
        var typedChar = getKeyCode(evt);
        if (!this.isDeleteKey(typedChar))
            return;
        this.clearTimeout();
        this.timer = setTimeout(this.ajaxRequest.bind(this), g_key_delay);
    },
    clearTimeout: function() {
        if (this.timer != null)
            clearTimeout(this.timer);
        this.timer = null;
    },
    keyPress: function(evt) {
        var evt = getEvent(evt);
        var typedChar = getKeyCode(evt);
        if (typedChar != KEY_ENTER && typedChar != KEY_RETURN)
            this.clearTimeout();
        if (this.isNavigation(typedChar))
            return true;
        if (!evt.shiftKey && (typedChar == KEY_ARROWDOWN || typedChar == KEY_ARROWUP))
            return false;
        if (this.isDeleteKey(typedChar))
            return true;
        if (typedChar == KEY_ENTER || typedChar == KEY_RETURN || typedChar == KEY_TAB) {
            if (this.hasDropDown() && this.select())
                this.clearTimeout();
            else
                this.onBlur();
            return false;
        }
        if (typedChar == this.KEY_ESC) {
            this.clearDropDown();
            return false;
        }
        this.timer = setTimeout(this.ajaxRequest.bind(this), g_key_delay);
        return true;
    },
    isNavigation: function(typedChar) {
        if (typedChar == this.KEY_LEFT)
            return true;
        if (typedChar == this.KEY_RIGHT)
            return true;
        if (typedChar == KEY_TAB && this.currentDisplayValue == "")
            return true;
    },
    isDeleteKey: function(typedChar) {
        if (typedChar == this.KEY_BACKSPACE || typedChar == this.KEY_DELETE)
            return true;
    },
    ajaxRequest: function() {
        var s = this.getDisplayValue();
        if (s.length == 0) {
            this.log("ajaxRequest returned no results");
            this.clearDropDown();
            this.searchChars = null;
            return;
        }
        if (s == "*")
            return;
        if (s == this.searchChars) {
            this.log("navigator key pressed");
            return;
        }
        this.searchChars = s;
        this.clearKeyValue();
        this.log("searching for characters '" + this.searchChars + "'");
        var xml = this.cacheGet(s);
        if (xml) {
            this.log("cached results found");
            this.processXML(xml);
            return;
        }
        if (this.cacheEmpty()) {
            this.log("cache is empty");
            this.clearDropDown();
            this.hideDropDown();
            return;
        }
        var url = "";
        url += this.addSysParms();
        url += this.addTargetTable();
        url += this.addAdditionalValues();
        url += this.addAttributes("ac_");
        this.isResolvingFlag = true;
        serverRequestPost("xmlhttp.do", url, this.ajaxResponse.bind(this));
    },
    ajaxResponse: function(response) {
        if (!response.responseXML.documentElement) {
            this.isResolvingFlag = false;
            return;
        }
        var xml = response.responseXML;
        var e = xml.documentElement;
        var timer = e.getAttribute("sysparm_timer");
        if (timer != this.timer)
            return;
        this.timer = null;
        this.clearDropDown();
        this.cachePut(this.searchChars, xml);
        this.processXML(xml);
        this.isResolvingFlag = false;
        if (this.onResolveCallback)
            this.onResolveCallback();
    },
    processXML: function(xml) {
        this.log("processing XML results");
        var e = xml.documentElement;
        this.rowCount = e.getAttribute('row_count');
        this.max = e.getAttribute('sysparm_max')
        var items = xml.getElementsByTagName("item");
        values = new Array();
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            var array = this.copyAttributes(item);
            array['XML'] = item;
            values[values.length] = array;
        }
        if (!this.hasFocus) {
            this.log("checking value without focus");
            this.ignoreFocusEvent = false;
            if ((values.length == 1) ||
                ((values.length > 1)
                    && (values[0]['label'] == this.getDisplayValue())
                    && (values[1]['label'] != this.getDisplayValue()))) {
                this.log("setting value without focus to " + values[0]['label'] + "->" + values[0]['name'])
                this.referenceSelect(values[0]['name'], values[0]['label']);
                var s = gel(this.inputSpan);
                s.innerHTML = s.innerHTML + '<span class="address" onclick="addressOnClick(event, this)" style="white-space:nowrap;" value="' + values[0]['name'] + '">' + values[0]['label'] + ';</span> ';
                this._clearDisplayValue();
                this.currentDisplayValue = "";
            } else {
                if (e.getAttribute('allow_invalid') != 'true')
                    this.setInvalid();
            }
            return;
        }
        this.createDropDown(values);
    },
    addSysParms: function() {
        var sp = "sysparm_processor=EmailClient" +
        "&sysparm_name=" + this.elementName +
        "&sysparm_timer=" + this.timer +
        "&sysparm_max=" + this.max +
        "&sysparm_chars=" + encodeText(this.searchChars);
        return sp;
    },
    addTargetTable: function() {
        var answer = "";
        if (this.getTargetTable()) {
            answer = "&sysparm_reference_target=" + this.getTargetTable();
        }
        return answer;
    },
    addAdditionalValues: function() {
        var answer = "";
        for (var n in this.additionalValues)
            answer += "&" + n + "=" + encodeText(this.additionalValues[n]);
        return answer;
    },
    addAttributes: function(prefix) {
        var answer = "";
        var attributes = this.element.attributes;
        for (var n = 0; n < attributes.length; n++) {
            var attr = attributes[n];
            var name = attr.nodeName;
            if (name.indexOf(prefix) != 0)
                continue;
            var v = attr.nodeValue;
            answer += "&" + name + "=" + v;
        }
        return answer;
    },
    copyAttributes: function(node) {
        var attributes = new Array();
        for (var n = 0; n < node.attributes.length; n++) {
            var attr = node.attributes[n];
            var name = attr.nodeName;
            var v = attr.nodeValue;
            attributes[name] = v;
        }
        return attributes;
    },
    createDropDown: function(foundStrings) {
        this.clearDropDown();
        for(var c = 0; c < foundStrings.length; c++) {
            var x = foundStrings[c];
            var child = this.createChild(x);
            child.acItem = x;
            this.appendItem(child);
            this.addMouseListeners(child);
        }
        if ( this.currentMenuCount ) {
            this.setDropDownSize();
            this.showDropDown();
            var height = this.dropDown.clientHeight;
            this.setHeight(height);
            this.firefoxBump();
        }
        if (this.isVisible() && this.isPopulated())
            this.selectNext();
    },
    select: function() {
        if (this.selectedItemNum < 0)
            return false;
        var o = this.getSelectedObject().acItem;
        this.referenceSelect(o['name'], o['label']);
        var s = gel(this.inputSpan);
        s.innerHTML = s.innerHTML + '<span class="address" onclick="addressOnClick(event, this)" style="white-space:nowrap;" value="' + o['name'] + '">' + o['label'] + ';</span> ';
        this.clearDropDown();
        this._clearDisplayValue();
        this.currentDisplayValue = "";
        return true;
    },
    _clearDisplayValue: function(v) {
        var e = this.getDisplayElement();
        e.value = "";
    },
    _setDisplayValue: function(v) {
        var e = this.getDisplayElement();
        if (e.value == v)
            return;
        e.value = v;
    },
    referenceSelectTimeout: function(sys_id, displayValue) {
        this.selectedID = sys_id;
        this.selectedDisplayValue = displayValue;
        setTimeout(this._referenceSelectTimeout.bind(this), 0);
    },
    _referenceSelectTimeout: function() {
        this.referenceSelect(this.selectedID, this.selectedDisplayValue);
    },
    referenceSelect: function(sys_id, displayValue) {
        this.log("referenceSelect called with a display value of " + displayValue);
        this._setDisplayValue(displayValue);
        var e = this.getKeyElement();
        if (e.value != sys_id) {
            e.value = sys_id;
            callOnChange(e);
        }
        this.searchChars = displayValue;
        this.currentDisplayValue = displayValue;
        this.clearInvalid();
        if (this.selectionCallBack && sys_id) {
            eval(this.selectionCallBack);
        }
    },
    createChild: function(item) {
        var div = cel(TAG_DIV);
        div.ac = this;
        div.acItem = item;
        var itemInRow = cel(TAG_SPAN, div);
        itemInRow.innerHTML = new String(item['label']).escapeHTML();
        return div;
    },
    addMouseListeners: function(element) {
        element.onmousedown = this.onMouseDown.bind(this, element);
        element.onmouseup = this.onMouseUp.bind(this, element);
        element.onmouseover = this.onMouseOver.bind(this, element);
        element.onmouseout = this.onMouseOut.bind(this, element);
    },
    onMouseUp: function(element) {
        this.select();
    },
    onMouseDown: function(element) {
        if (g_isInternetExplorer) {
            this.select();
            window.event.cancelBubble = true;
            window.event.returnValue = false;
            setTimeout(this.focus.bind(this), 50);
        }
        return false;
    },
    onMouseOut: function(element) {
        this.unsetSelection();
    },
    onMouseOver: function(element) {
        this.setSelection(element.acItemNumber)
    },
    focus: function() {
        this.element.focus();
    },
    setDropDownSize: function() {
        var ac = this;
        var e = this.element;
        var mLeft = grabOffsetLeft(e) + "px";
        var mTop =  grabOffsetTop(e) + (e.offsetHeight - 1) + "px";
        var mWidth = this.getWidth();
        this.log("width:" + mWidth);
        var dd = this.dropDown;
        if (dd.offsetWidth > parseInt(mWidth)) {
            mWidth = dd.offsetWidth;
            this.log("width:" + mWidth);
        }
        this.setTopLeft(dd.style, mTop, mLeft);
        this.setTopLeft(this.iFrame.style, mTop, mLeft);
        this.setWidth(mWidth);
    },
    setTopLeft: function (style, top, left) {
        style.left = left;
        style.top = top;
    },
    getWidth: function () {
        var field = this.element;
        if (g_isInternetExplorer)
            return field.offsetWidth - (this.menuBorderSize * 2);
        return field.clientWidth;
    },
    onFocus: function() {
        if (this.ignoreFocusEvent) {
            this.log("received focus event - ignored");
            return;
        }
        this.log("focus event");
        this.hasFocus = true;
        this.currentDisplayValue = this.getDisplayValue();
    },
    onBlur: function() {
        this.log("blur event");
        this.hasFocus = false;
        if (this.getDisplayValue().length == 0) {
            if (this.currentDisplayValue != "")
                this.referenceSelect("","");
        } else if (this.selectedItemNum > -1) {
            this.select()
        } else if ((this.getKeyValue() == "") || (this.currentDisplayValue != this.getDisplayValue())) {
            var refInvalid = true;
            if (this.isExactMatch()) {
                var o = this.getObject(0).acItem;
                this.referenceSelect(o['name'], o['label']);
                refInvalid = false;
            }
            if (refInvalid)
                this.setInvalid();
            if (refInvalid || !this.isPopulated()) {
                this.log("onBlur with no menu items requesting the reference for " + this.getDisplayValue());
                this.clearTimeout();
                this.searchChars = null;
                this.ignoreFocusEvent = true;
                this.timer = setTimeout(this.ajaxRequest.bind(this), 0);
            }
        }
        this.clearDropDown();
    },
    isExactMatch: function() {
        if (this.isPopulated()) {
            if (this.getMenuCount() == 1) {
                var o0 = this.getObject(0).acItem;
                if ((o0['label'] == this.getDisplayValue()))
                    return true;
                return false;
            }
            var o0 = this.getObject(0).acItem;
            var o1 = this.getObject(1).acItem;
            if ((o0['label'] == this.getDisplayValue()) && (o1['label'] != this.getDisplayValue()))
                return true;
        }
    },
    getDisplayValue: function() {
        return this.getDisplayElement().value;
    },
    getKeyValue: function() {
        return this.getKeyElement().value;
    },
    clearKeyValue: function() {
        this.referenceSelect("", this.getDisplayValue());
    },
    getKeyElement: function() {
        return this.keyElement;
    },
    getDisplayElement: function() {
        return this.element;
    },
    setResolveCallback: function(f) {
        this.onResolveCallback = f;
    },
    setAdditionalValue: function(name, value) {
        this.additionalValues[name] = value;
    },
    getTableName: function() {
        return this.elementName.split('.')[0];
    },
    setInvalid: function() {
        addClassName(this.getDisplayElement(), "ref_invalid");
        this.getDisplayElement().title = "Invalid reference";
    },
    clearInvalid: function() {
        removeClassName(this.getDisplayElement(), "ref_invalid");
        this.getDisplayElement().title = "";
    },
    firefoxBump: function() {
        var children = this.getMenuItems();
        for(var i = 0 ; i < children.length; i++) {
            if (children[i] && children[i].firstChild) {
                var dparentDivWidth = children[i].offsetWidth;
                var dchildSpanWidth = children[i].firstChild.offsetWidth;
                if (dchildSpanWidth > dparentDivWidth)
                    this.setWidth(dchildSpanWidth);
            }
        }
    },
    hasDropDown:function() {
        if (!this.dropDown)
            return false;
        return this.dropDown.childNodes.length > 0;
    },
    cachePut: function (name, value) {
        this.cache[name] = value;
    },
    cacheGet: function(name) {
        return this.cache[name];
    },
    cacheClear: function() {
        this.cache = new Object();
    },
    cacheEmpty: function() {
        var s = this.searchChars;
        while (s.length > 2) {
            s = s.substring(0, s.length - 1);
            var xml = this.cacheGet(s);
            if (!xml)
                continue;
            var e = xml.documentElement;
            var rowCount = e.getAttribute('row_count');
            if (rowCount == 0)
                return true;
            break; // done
        }
        return false;
    }
});