//include classes/ui/GlideBox.js
/**
* Primary class for displaying GlideBoxes. The GlideBox displays a fixed/absolutely positioned "box-like"
* HTML object within the web page. The box can be customized by the various API functions to include a footer,
* show different html in the body, and much more. This class should remain very high-level and only declare
* functions that can be re-used by all implementing objects.
*
* Example API:
*
*   var gb = new GlideBox();
*   gb.setTitle('My title');
*   gb.setBody('My content');
*   gb.render();
*
* Note: The constructor takes an optional parameter that will specify the unique element ID to use
* for the box if specified. If not specified, it will be auto-generated.
*
*
* Features of the Glide Box:
*   1) Data Cache
*        Objects can be stored in the box for reference by other components. This data is strictly private and can
*        only be retrieved by using the corresponding key.
*
*   2) Preferences
*        Preferences are similar to the data cache (key/value pairs); however, this information is passed to the
*        server in the form of <preference name="" value="" /> nodes within the [sysparm_value] data value. These
*        preferences can then be retrieved by the server to perform specific functionality.
*
*   2b) Parameters
*
*
*   3) Header Toolbar
*        The header toolbar is mandatory and shown on the top of the GlideBox. It is divided into three sections ...
*        the right, center, and left. Icons (or any other html decoration) can be added into all three seconds.
*
*   4) Footer Toolbar
*        A footer toolbar is not visible by default. It can be enabled at any time. The toolbar has capability to
*        show resize grips that allow resizing. Additionally, decorations can be added to the left and right as well
*        as direct injection into the footer toolbar body.
*
*   5) Sizing & Positioning
*        The API allows for full control of sizing and positioning the GlideBox. By default, the GlideBox will size
*        to fit the content specified by the body while still retaining a maximum width and height that allows for
*        window padding. The window will be centered on the screen before and after any adjustment of dynamic
*        content.
*
* For a full list of the public API available for this class please visit:
*   http://wiki.service-now.com/?
*
*
* Extending Classes:
*   GlideOverlay    - Extends GlideBox to provide modality support and masking.
*/
var g_glideBoxes = {};
var GlideBox = Class.create({
    MIN_HEIGHT_PX: 50,
    MIN_WIDTH_PX: 70, // This is stored here for faster access when resizing [ See theme_glide_box.css/.gb_mw ]
    MIN_WINDOW_PADDING_PX: 15, // This is the padding for the autoDimension'd window
    DRAGGING_WINDOW_PADDING: {
        TOP: 0,
        RIGHT: 4,
        BOTTOM: 4,
        LEFT: 0
    },
    POSITION_STYLE: Prototype.Browser.IE ? 'absolute' : 'fixed',
    QUIRKS_MODE: document.compatMode != 'CSS1Compat',
    initialize: function(elemId) {
        this._id = elemId || guid();
        this._dataCache = {};
        this._preferences = {};
        this._elemBox = $j(gb_BoxTemplate);
        this._elemBox.attr('id', this._id);
        this._elemFooter = $j('.gb_footer', this._elemBox); // TODO :: Fix GlideDraggable
        $j(document.body).append(this._elemBox);
        this.setDraggable(true);
        this.addToolbarCloseButton();
        this.setStyle({
            position:this.POSITION_STYLE
            });
        g_glideBoxes[this._id] = this;
    },
    getId: function() {
        return this._id;
    },
    getBoxElement: function() {
        return $(this._id);
    },
    getBoxWrapperElement: function() {
        return $(this._id).select('.gb_wrapper')[0];
    },
    getBoxJElement: function() {
        return this._elemBox;
    },
    isVisible: function() {
        return this._elemBox.is(':visible');
    },
    setOnClick: function(f) {
        this._elemBox.bind('click', f.bind(this));
    },
    setOnBeforeLoad: function(f) {
        this._onBeforeLoad = f;
    },
    setOnAfterLoad: function(f) {
        this._onAfterLoad = f;
    },
    setOnBeforeClose: function(f) {
        this._onBeforeClose = f;
    },
    setOnAfterClose: function(f) {
        this._onAfterClose = f;
    },
    setOnBeforeDrag: function(f) {
        this._onBeforeDrag = f;
    },
    setOnAfterDrag: function(f) {
        this._onAfterDrag = f;
    },
    setOnHeightAdjust: function(f) {
        this._onHeightAdjust = f;
    },
    setOnWidthAdjust: function(f) {
        this._onWidthAdjust = f;
    },
    setOnBeforeResize: function(f) {
        this._onBeforeResize = f;
    },
    setOnResizeEnd: function(f) {
        this._onResizeEnd = f;
    },
    addData: function(key, value) {
        this._dataCache[key] = value;
    },
    getData: function(key) {
        return this._dataCache[key];
    },
    getToolbar: function() {
        return this.getBoxElement().select('.gb_toolbar')[0];
    },
    addToolbarRow: function(html) {
        var thead = this.getBoxElement().select('.gb_table > thead')[0];
        var td = thead.insertRow(thead.rows.length).insertCell(0);
        td.className = 'gb_table_col_l1';
        td.innerHTML = html;
        return td;
    },
    setTitle: function(html) {
        this.getBoxElement().select('.gb_toolbar_text')[0].innerHTML = html;
    },
    removeToolbarDecoration: function(objSelector) {
        var e = this.getToolbar().select(objSelector);
        if (!e || e.length == 0)
            return;
        if (e[0].tagName.toLowerCase() == 'td')
            var td = e;
        else if (e[0].parentNode.tagName.toLowerCase() == 'td')
            var td = e[0].parentNode;
        else
            return;
        var tr = td.parentNode;
        for (var i = 0, l = tr.childNodes.length; i < l; i++) {
            if (tr.childNodes[i] == td) {
                tr.deleteCell(i);
                break;
            }
        }
    },
    addToolbarLeftDecoration: function(html, boolPrepend) {
        return this._addToolbarDecoration(html, boolPrepend || false, '.gb_toolbar_left');
    },
    addToolbarRightDecoration: function(html, boolPrepend) {
        return this._addToolbarDecoration(html, boolPrepend || false, '.gb_toolbar_right');
    },
    addToolbarCloseButton: function() {
        var arr = this.getBoxElement().select('.gb_close');
        if (arr.length == 1)
            return;
        this.addToolbarRightDecoration('<a class="gb_close" href="#"><span class="i16 i16_close2"></span></a>');
        this.setToolbarCloseOnClick(function(event) {
            this.close();
        }.bind(this));
    },
    removeToolbarCloseButton: function() {
        this.removeToolbarDecoration('.gb_close');
    },
    setToolbarCloseOnClick: function(f) {
        var arr = this.getBoxElement().select('.gb_close');
        if (arr.length == 0)
            return;
        arr[0].stopObserving('click');
        arr[0].observe('click', function(event) {
            f.call(this, event);
            event.stop();
        });
    },
    _addToolbarDecoration: function(html, boolPrepend, tableClassSelector) {
        var tr = this.getBoxElement().select(tableClassSelector + ' tr')[0];
        var td = tr.insertCell(boolPrepend ? 0 : -1);
        td.innerHTML = html
        return td;
    },
    getFooter: function() {
        return this._elemFooter;
    },
    showFooter: function() {
        this._elemFooter.show();
        this._isFooterVisible = true;
    },
    hideFooter: function() {
        this._elemFooter.hide();
        this._isFooterVisible = false;
    },
    showFooterResizeGrips: function() {
        if (!this._isFooterVisible)
            this.showFooter();
        if ($j('.i16_resize_grip_left', this._elemFooter).length == 1)
            return;
        $j('.gb_footer_left_resize', this._elemFooter).html('<span class="i16 i16_resize_grip_left" style="float:none;" />');
        $j('.gb_footer_right_resize', this._elemFooter).html('<span class="i16 i16_resize_grip_right" style="float:none;" />');
        this.leftResizeDragger = new GlideDraggable($j('.i16_resize_grip_left', this._elemFooter));
        this.leftResizeDragger.setHoverCursor('sw-resize');
        this.leftResizeDragger.setDragCursor('sw-resize');
        this.leftResizeDragger.setStartFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
            this._isLeftPositioned = this.convertToRightPosition();
            this._currentOffset = this._elemBox.offset(),
            this._currentOffsetRight = this._currentOffset.left + this.getWidth();
            var win = $j(window);
            this._maxWidth = this._currentOffsetRight - this.MIN_WINDOW_PADDING_PX - win.scrollLeft();
            this._maxHeight = win.height() - this.MIN_WINDOW_PADDING_PX - this._currentOffset.top + win.scrollTop();
            if (this._onBeforeResize)
                this._onBeforeResize();
        }.bind(this));
        this.leftResizeDragger.setDragFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
            this.setWidth(Math.min(this._maxWidth, (this._currentOffsetRight - pageCoords.x)));
            this.setHeight(Math.min(this._maxHeight, (pageCoords.y - this._currentOffset.top)));
        }.bind(this));
        this.leftResizeDragger.setEndFunction(function() {
            if (this._isLeftPositioned)
                this.convertToLeftPosition();
            this._isLeftPositioned = null;
            if (this._onResizeEnd)
                this._onResizeEnd();
        }.bind(this));
        this.rightResizeDragger = new GlideDraggable($j('.i16_resize_grip_right', this._elemFooter));
        this.rightResizeDragger.setHoverCursor('se-resize');
        this.rightResizeDragger.setDragCursor('se-resize');
        this.rightResizeDragger.setStartFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
            this._currentOffset = this._elemBox.offset();
            this._isRightPositioned = this.convertToLeftPosition();
            var win = $j(window);
            this._maxWidth = win.width() - this.MIN_WINDOW_PADDING_PX - this._currentOffset.left + win.scrollLeft();
            this._maxHeight = win.height() - this.MIN_WINDOW_PADDING_PX - this._currentOffset.top + win.scrollTop();
            if (this._onBeforeResize)
                this._onBeforeResize();
        }.bind(this));
        this.rightResizeDragger.setDragFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
            this.setWidth(Math.min(this._maxWidth, (pageCoords.x - this._currentOffset.left)));
            this.setHeight(Math.min(this._maxHeight, (pageCoords.y - this._currentOffset.top)));
        }.bind(this));
        this.rightResizeDragger.setEndFunction(function() {
            if (this._isRightPositioned)
                this.convertToRightPosition();
            this._isRightPositioned = null;
            if (this._onResizeEnd)
                this._onResizeEnd();
        }.bind(this));
    },
    hideFooterResizeGrips: function() {
        this.leftResizeDragger.destroy();
        this.rightResizeDragger.destroy();
        this.leftResizeDragger = null;
        this.rightResizeDragger = null;
        $j('.gb_footer_left_resize', this._elemFooter).html('');
        $j('.gb_footer_right_resize', this._elemFooter).html('');
    },
    getFooterContainer: function() {
        return $j('.gb_footer_body > div', this._elemFooter);
    },
    setFooter: function(html) {
        if (!this._isFooterVisible)
            this.showFooter();
        $j('.gb_footer_body > div', this._elemFooter).html(html);
    },
    prependFooterRow: function(html) {
        return this._addFooterRow(0, html);
    },
    appendFooterRow: function(html) {
        return this._addFooterRow(-1, html);
    },
    _addFooterRow: function(pos, html) {
        var foot = this.getBoxElement().select('.gb_table > tfoot')[0];
        var td = foot.insertRow(pos == -1 ? foot.rows.length : pos).insertCell(0);
        td.className = 'gb_table_col_l1';
        td.innerHTML = html;
        return td;
    },
    autoDimension: function() {
        this._scrollBarWidth = this._scrollBarWidth || getScrollBarWidthPx();
        var winDimensions = document.viewport.getDimensions();
        var pOffset = document.viewport.getScrollOffsets();
        var maxHeight = winDimensions.height - this.MIN_WINDOW_PADDING_PX - this.MIN_WINDOW_PADDING_PX - 5;
        var maxWidth = winDimensions.width - this.MIN_WINDOW_PADDING_PX - this.MIN_WINDOW_PADDING_PX - 5;
        var box = this.getBoxElement();
        var body = this.getBodyElement();
        var bodyWrapper = this.getBodyWrapperElement();
        var extraWidth = 0;
        box.setStyle({
            width:'',
            height:''
        });
        bodyWrapper.setStyle({
            width:'',
            height:''
        });
        body.setStyle({
            width:'',
            height:''
        });
        bodyWrapper.style.overflowY = 'hidden';
        this.positionLeft(-1999, -1999);
        body.style.width = (body.getWidth() + 1) + 'px';
        body.style.height = (body.getHeight() + 1) + 'px';
        var h = this.getHeight();
        var w = this.getWidth();
        if (h > maxHeight) {
            this.setHeight(maxHeight);
            extraWidth = this._scrollBarWidth;
        }
        else
            this.setHeight(h);
        if (w > maxWidth) {
            this.setWidth(maxWidth);
            this.setHeight(Math.min(maxHeight, h + this._scrollBarWidth));
        } else
            this.setWidth(w + extraWidth);
        bodyWrapper.setStyle({
            overflowY: ''
        });
    },
    center: function() {
        var winDimensions = document.viewport.getDimensions();
        var winScrollOffsets = document.viewport.getScrollOffsets();
        var winHeight = winDimensions.height;
        var winWidth = winDimensions.width;
        if (this.getStyle('position') == 'absolute') // Absolute
            this.positionLeft(winWidth/2 - this.getWidth()/2 + winScrollOffsets.left, winHeight/2 - this.getHeight()/2 + winScrollOffsets.top);
        else // Fixed
            this.positionLeft(winWidth/2 - this.getWidth()/2, winHeight/2 - this.getHeight()/2);
    },
    position: function(o) {
        this.setStyle(o);
    },
    setPosition: function(p) {
        this.setStyle({
            position: p
        });
    },
    positionLeft: function(left, top) {
        this.setStyle({
            left:parseInt(left, 10) + 'px',
            top:parseInt(top, 10) + 'px'
            });
    },
    positionRight: function(right, top) {
        this.setStyle({
            right:parseInt(right, 10) + 'px',
            top:parseInt(top,10) + 'px'
            });
    },
    convertToLeftPosition: function() {
        var r = this.getBoxElement().style.right;
        if (!r)
            return false;
        this.setStyle({
            right:null,
            left:(this._elemBox.offset().left -
                (this.getStyle('position') == 'fixed' ? $j(window).scrollLeft() : 0)) + 'px'
            });
        return true;
    },
    convertToRightPosition: function() {
        var l = this.getBoxElement().style.left;
        if (!l)
            return false;
        this.setStyle({
            left:null,
            right:($j(window).width() - parseInt(l, 10) - this.getWidth()) + 'px'
            });
        return true;
    },
    size: function(w, h) {
        if (w) this.setWidth(w);
        if (h) this.setHeight(h);
    },
    setWidth: function(w) {
        w = typeof w == 'string' ? parseInt(w, 10) : w;
        var box = this.getBoxElement();
        var wrapper = this.getBodyWrapperElement();
        var gbWrapper = box.select('.gb_wrapper')[0];
        var borderOffset = gbWrapper.measure('border-left') + gbWrapper.measure('border-right');
        var paddingOffset = wrapper.measure('padding-left') + wrapper.measure('padding-right');
        if (w < (this._minWidth || this.MIN_WIDTH_PX))
            w = this._minWidth || this.MIN_WIDTH_PX;
        var wrapperWidth = w - borderOffset - paddingOffset;
        if (this.QUIRKS_MODE && Prototype.Browser.IE)
            wrapperWidth += paddingOffset;
        wrapper.setStyle({
            width:wrapperWidth + 'px'
            });
        box.setStyle({
            width:w + 'px'
            });
        var table = box.select('.gb_table')[0];
        var tw = table.getWidth();
        var realWrapperWidth = wrapper.getWidth();
        if (realWrapperWidth < tw) {
            this._minWidth = tw;
            wrapper.setStyle({
                width:(tw - paddingOffset)+ 'px'
                });
        }
        if (this._onWidthAdjust)
            this._onWidthAdjust.call(this);
    },
    /**
* This function is distinguished because it requires setting the inner wrapper which is not intuitive.
*/
    setMinWidth: function(mw) {
        this._minWidth = mw = typeof mw == 'string' ? parseInt(mw, 10) : mw;
        this.getBodyWrapperElement().setStyle({
            minWidth:mw + 'px'
            });
    },
    setHeight: function(h) {
        h = typeof h == 'string' ? parseInt(h, 10) : h;
        var box = this.getBoxElement();
        var wrapper = this.getBodyWrapperElement();
        var body = this.getBodyElement();
        if (h < (this._minHeight || this.MIN_HEIGHT_PX))
            return;
        var wrapperHeight = h - (box.select('.gb_wrapper')[0].getHeight() - body.getHeight());
        if (this.QUIRKS_MODE && Prototype.Browser.IE)
            wrapperHeight += wrapper.measure('padding-top') + wrapper.measure('padding-bottom');
        if (wrapperHeight < 0)
            return;
        box.setStyle({
            height:h + 'px'
            });
        wrapper.setStyle({
            height:wrapperHeight + (this.QUIRKS_MODE ? 2 : 0) + (this.QUIRKS_MODE && Prototype.Browser.IE ? -2 : 0) + 'px'
            });
        if (this._onHeightAdjust)
            this._onHeightAdjust.call(this);
    },
    setMinHeight: function(mh) {
        this._minHeight = typeof mh == 'string' ? parseInt(mh, 10) : mh;
        this.getBoxElement().setStyle({
            minHeight: this._minHeight +'px'
            });
    },
    /**
* Sets a style for the primary GlideBox. Format for setStyle can use the following:
*
*  --> setStyle('display', 'none');
*  --> setStyle({display:'none', position:'absolute'});
*/
    setStyle: function(o, value) {
        if (typeof o == 'string')
            o = {
                o: value
            };
        else if (typeof o != 'object')
            o = {};
        this.getBoxElement().setStyle(o);
    },
    getWidth: function() {
        return this.getBoxElement().getWidth();
    },
    getHeight: function() {
        return this.getBoxElement().getHeight();
    },
    getStyle: function(s) {
        return this.getBoxElement().getStyle(s);
    },
    getOffset: function() {
        return this.getBoxElement().cumulativeOffset();
    },
    getBodyElement: function() {
        return this.getBoxElement().select('.gb_body')[0];
    },
    getBodyWrapperElement: function() {
        return this.getBoxElement().select('.gb_body_wrapper')[0];
    },
    setBody: function(html) {
        this.getBodyElement().innerHTML = html;
    },
    setBodyFromForm: function(template) {
        this.__onBeforeFormRender = function() {
            this.setBody(gb_LoadingBody);
            this.getBoxElement().setStyle({
                display:'block'
            });
            this.autoDimension();
            this.center();
            this.setPreference('renderer', 'RenderForm');
            this.setPreference('type', 'direct');
            this.setPreference('table', template);
            var ga = new GlideAjaxForm(template);
            ga.addParam('sysparm_value', this.getDescribingText());
            ga.addParam('sysparm_name', template);
            ga.getRenderedBodyText(this._bodyRendered.bind(this));
        };
    },
    _bodyRendered: function(s) {
        this.setBody(s);
        s.evalScripts(true);
        if (this._onAfterLoad)
            this._onAfterLoad.call(this);
        this.autoDimension();
        this.center();
    },
    setBodyPadding: function(pad) {
        this.getBodyWrapperElement().setStyle({
            padding: pad + (isNaN(pad) ? '' : 'px')
            });
    },
    setDraggable: function(b) {
        if (b) {
            this.toolbarDragger = new GlideDraggable(this.getToolbar(), this.getBoxElement());
            this.toolbarDragger.setHoverCursor('move');
            this.toolbarDragger.setStartFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
                var dimensions = document.viewport.getDimensions();
                this._minTop = this.DRAGGING_WINDOW_PADDING.TOP;
                this._minLeft = this.DRAGGING_WINDOW_PADDING.LEFT;
                this._maxTop = dimensions.height - this.getHeight() - this.DRAGGING_WINDOW_PADDING.BOTTOM;
                this._maxLeft = dimensions.width - this.getWidth() - this.DRAGGING_WINDOW_PADDING.RIGHT;
                if (this._onBeforeDrag)
                    this._onBeforeDrag.call(this, e, dragElem, pageCoords, shift, dragCoords);
            }.bind(this));
            this.toolbarDragger.setDragFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
                dragElem.style.left = Math.min(Math.max(this._minLeft, dragCoords.x), this._maxLeft) + 'px';
                dragElem.style.top = Math.min(Math.max(this._minTop, dragCoords.y), this._maxTop) + 'px';
            }.bind(this));
            this.toolbarDragger.setEndFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
                if (this._onAfterDrag)
                    this._onAfterDrag.call(this, e, dragElem, pageCoords, shift, dragCoords);
            }.bind(this));
        } else if (this.toolbarDragger) {
            this.toolbarDragger.destroy();
            this.toolbarDragger = null;
        }
    },
    /**
* The obj is an object that needs to specify one or more of the following properties:
*
* obj = {
*   TOP: #,
*   RIGHT: #,
*   BOTTOM: #,
*   LEFT: #
* }
*/
    setDraggingWindowPadding: function(obj) {
        this.DRAGGING_WINDOW_PADDING = Object.extend(this.DRAGGING_WINDOW_PADDING, obj || {});
    },
    isDraggable: function(b) {
        return this.toolbarDragger ? true : false;
    },
    setPreferences : function(preferences) {
        this._preferences = preferences;
    },
    setPreference: function(name, value) {
        if (typeof(value) == 'string') {
            value = value.replace(/</g, "&lt;");
            value = value.replace(/>/g, "&gt;");
        }
        this._preferences[name] = value;
    },
    getPreferences: function() {
        return this._preferences;
    },
    removePreference: function(name, value) {
        delete this.preferences[name];
    },
    getDescribingXML : function() {
        var section = document.createElement('section');
        section.setAttribute('name', this.getId());
        for (var name in this._preferences) {
            var p = document.createElement('preference');
            var v = this._preferences[name];
            p.setAttribute('name', name);
            if (typeof v == 'object') {
                if (typeof v.join == 'function') {
                    v = v.join(',');
                } else if (typeof v.toString == 'function') {
                    v = v.toString();
                }
            }
            if (v)
                p.setAttribute('value', v);
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
    render: function(fadeInTime) {
        if (this._onBeforeLoad)
            this._onBeforeLoad.call(this);
        if (this.__onBeforeFormRender) {
            this.__onBeforeFormRender.call(this);
            return;
        }
        if (fadeInTime)
            this._elemBox.fadeIn(parseInt(fadeInTime, 10));
        else
            this.getBoxElement().setStyle({
                display:'block'
            });
        if (this._onAfterLoad)
            this._onAfterLoad.call(this);
    },
    close: function(fadeOutTime) {
        if (this._onBeforeClose)
            this._onBeforeClose.call(this);
        if (!fadeOutTime && fadeOutTime !== 0)
            fadeOutTime = 200;
        if (fadeOutTime)
            this._elemBox.fadeOut(parseInt(fadeOutTime, 10), function() {
                this.remove();
            }.bind(this._elemBox) );
        else
            this._elemBox.remove();
        if (this._onAfterClose)
            this._onAfterClose.call(this);
        delete g_glideBoxes[this.getId()];
    },
    toString: function() {
        return 'GlideBox';
    }
});
GlideBox.get = function(objIdOrElem) {
    if (typeof objIdOrElem == 'string') {
        var o = g_glideBoxes[objIdOrElem];
        if (o)
            return o;
    }
    var box = $(objIdOrElem).up('.glide_box', 0);
    if (box)
        return g_glideBoxes[box.getAttribute('id')] || null;
    return null;
}
GlideBox.close = function(objIdOrElem, timeout) {
    var o = GlideBox.get(objIdOrElem);
    if (o)
        o.close(timeout);
    return false;
}
var gb_LoadingBody = '<div style="padding:6px 5px 5px 3px;"><span class="ia_loading"></span><span class="fontsmall" style="padding-left:6px;padding-top:4px;">Loading ...</span></div>';
var gb_ToolbarTemplate = '<table class="gb_toolbar"><tbody><tr><td class="gb_toolbar_col_l1"><table class="gb_toolbar_left gb_toolbar_decoration"><tr></tr></table></td><td class="gb_toolbar_col_l1 gb_toolbar_text"></td><td class="gb_toolbar_col_l1"><table class="gb_toolbar_right gb_toolbar_decoration"><tr></tr></table></td></tr></tbody></table><div class="gb_toolbar_bottom_border">&nbsp;</div>';
var gb_FooterTemplate = '<table class="gb_footer"><tbody><tr><td class="gb_footer_left_resize"></td><td class="gb_footer_body"><div></div></td><td class="gb_footer_right_resize"></td></tr></tbody></table>';
var gb_BodyTemplate = '<div class="gb_body_wrapper gb_mw"><div class="gb_body"></div></div>';
var gb_BoxTemplate = '<div class="glide_box gb_mw"><div class="gb_wrapper"><table class="gb_table"><thead><tr><td class="gb_table_col_l1" style="vertical-align:top;">' + gb_ToolbarTemplate + '</td></tr></thead><tbody><tr><td class="gb_table_col_l1">' + gb_BodyTemplate + '</td></tr></tbody><tfoot><tr><td class="gb_table_col_l1">' + gb_FooterTemplate + '</td></tr></tfoot></table></div></div>';
//include classes/ui/GlideOverlay.js
/**
* Class for displaying an overlay window. This overlay class has a variety of display options including ability
* to set the dialog box to be modal (this shows with a background expose mask), before open, and after close custom
* event handlers and more.
*/
var g_glideOverlays = {};
var GlideOverlay = Class.create(GlideBox, {
    initialize: function($super, overlayID) {
        $super(overlayID);
        var self = this;
        this.exposeMask = $j('#glide_expose_mask');
        if (this.exposeMask.length == 0) {
            this.exposeMask = $j('<div id="glide_expose_mask" class="glide_mask"></div>');
            $j(document.body).append(this.exposeMask);
        }
        this.setOnBeforeLoad(function() {
            GlideOverlay.cache['show'] = true;
            this.exposeMask.show();
        }.bind(this));
        this.setOnAfterClose(function() {
            if (this._isModal) {
                GlideOverlay.cache['show'] = false, self = this;
                this.exposeMask.fadeOut(100, function() {
                    if (GlideOverlay.cache['show'])
                        return self.exposeMask.show();
                    $j(this).css('filter', 'alpha(opacity=20)');
                });
            }
        }.bind(this));
        this.closeOnEscape(true);
        this.setModal(true);
    },
    setModal: function(b) {
        this._isModal = b;
    },
    isModal: function(b) {
        return this._isModal;
    },
    closeOnEscape: function(b) {
        if (!b && this._escapeCloseHandler) {
            $(document).stopObserving('keydown', this._escapeCloseHandler);
        } else if (b && !this._escapeCloseHandler) {
            this._escapeCloseHandler = function(event) {
                if (event.keyCode === Event.KEY_ESC)
                    this.close();
            }.bind(this);
            $(document).observe('keydown', this._escapeCloseHandler);
        }
    },
    close: function($super, timeout) {
        if (this._escapeCloseHandler);
        $(document).stopObserving('keydown', this._escapeCloseHandler);
        $super(timeout);
    },
    toString: function() {
        return 'GlideOverlay';
    }
});
GlideOverlay.cache = {};
GlideOverlay.get = function(objIdOrElem) {
    return GlideBox.get(objIdOrElem);
}
GlideOverlay.close = function(objIdOrElem, timeout) {
    return GlideBox.close(objIdOrElem, timeout);
}
//include classes/ui/GlideBoxFrame.js
/**
* A resizable, draggable GlideBox that contains an iframe for the body
*/
var GlideBoxFrame = Class.create(GlideBox, {
    initialize: function($super, id) {
        $super(id);
        this.showFooterResizeGrips();
        this.getBodyElement().setStyle({
            overflow:'hidden',
            padding:'0px'
        });
    },
    render: function($super, fadeInTime) {
        var s = '<span id="' + this.getId() + '_loading"><center>Loading... <br/><img src="images/ajax-loader.gifx" alt="Loading..." /></center></span>';
        s += '<iframe id="' + this.getId() + '_iframe" style="border:0px none;display:none;"></iframe>';
        this.setBody(s);
        this.setOnHeightAdjust(this._updateDimensions.bind(this));
        $super(fadeInTime);
        this._getIFrame().observe('load', this._iframeLoaded.bind(this));
    },
    setOnIFrameLoaded: function(f) {
        this._onIFrameLoaded = f;
    },
    loadFrame: function(url) {
        this._getIFrame().src = url;
    },
    _updateDimensions: function() {
        var body = this.getBodyElement();
        var iFrame = this._getIFrame();
        if (!iFrame)
            return;
        iFrame.setStyle({
            height: body.getHeight() + 'px',
            width: body.getWidth() + 'px'
            });
    },
    _iframeLoaded: function() {
        $(this.getId() + '_loading').hide();
        this._getIFrame().show();
        if (this._onIFrameLoaded) {
            var iframeDoc = this._getIFrameDocument();
            if (iframeDoc)
                this._onIFrameLoaded.call(this, iframeDoc);
        }
    },
    _getIFrame: function() {
        return $(this.getId() + '_iframe');
    },
    _getIFrameDocument: function() {
        var e = this._getIFrame();
        if (e && e.contentDocument)
            return e.contentDocument;
        e = document.frames[this.getId() + '_iframe'];
        if (e && e.document)
            return e.document;
        return null;
    },
    toString: function() {
        return 'GlideBoxFrame';
    }
});
//include classes/ui/Geography.js
var Point = Class.create();
Point.prototype = {
    initialize : function(x, y) {
        this.x = x;
        this.y = y;
    },
    getX : function() {
        return this.x;
    },
    getY : function() {
        return this.y;
    }
}
var Rectangle = Class.create();
Rectangle.prototype = {
    initialize : function(x, y, w, h) {
        this.tl = new Point(x, y);
        this.width = w;
        this.height = h;
    },
    getTopLeft : function() {
        return this.tl;
    },
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    }
}