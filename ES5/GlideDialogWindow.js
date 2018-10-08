//defer classes/GlideDialogWindow.js
var GlideDialogWindow = Class.create(GlideWindow, {
    BACKGROUND_COLOR: "#444444",
    DEFAULT_RENDERER: "RenderForm",
    WINDOW_INVISIBLE: 1,
    ZINDEX: 400,
    initialize: function(id, readOnly, width, height) {
        GlideWindow.prototype.initialize.call(this, id, readOnly);
        if (width) {
            this.setSize(width, height);
            this.adjustBodySize();
        }
        this.grayBackground = null;
        this.setTitle("Dialog");
        this.setDialog(id);
        this.parentElement = getFormContentParent();
        this.insert(this.parentElement);
        this._initDefaults();
        this.setShim(true);
    },
    destroy: function() {
        this._hideBackground();
        this.parentElement = null;
        GlideWindow.prototype.destroy.call(this);
    },
    insert: function(element) {
        this.setZIndex(this.ZINDEX);
        this._showBackground();
        GlideWindow.prototype.insert.call(this, element, "", this.WINDOW_INVISIBLE);
        this.onResize();
        this.visible();
    },
    setBody: function(html, noEvaluate, setAlt) {
        GlideWindow.prototype.setBody.call(this, html, noEvaluate, setAlt);
        if (typeof this.elementToFocus != 'undefined' && !this.elementToFocus) {
            self.focus();
            this.getWindowDOM().focus();
        }
        this.onResize();
    },
    setDialog: function(dialogName) {
        this.setPreference('table', dialogName);
    },
    onResize: function() {
        this._centerOnScreen();
    },
    _eventKeyUp: function(e) {
        e = getEvent(e);
        if (e.keyCode == 27)
            this.destroy();
    },
    hideBackground: function() {
        return this._hideBackground();
    },
    _hideBackground: function() {
        if (this.grayBackground)
            this.parentElement.removeChild(this.grayBackground);
        this.grayBackground = null;
    },
    _initDefaults: function() {
        this.setPreference('renderer', this.DEFAULT_RENDERER);
        this.setPreference('type', 'direct');
        if (!this.isReadOnly())
            Event.observe(this.getWindowDOM(), 'keyup', this._eventKeyUp.bind(this));
        Event.observe(this.getWindowDOM(), 'resize', this.onResize.bind(this));
    },
    _showBackground: function() {
        var w;
        var h;
        if (document.compatMode != 'BackCompat') {
            w = document.documentElement.scrollWidth;
            h = document.documentElement.scrollHeight;
        } else {
            w = this.parentElement.scrollWidth;
            h = this.parentElement.scrollHeight;
        }
        var viewHeight = getBrowserWindowHeight();
        var viewWidth = getBrowserWindowWidth();
        if (viewHeight > h)
            h = viewHeight;
        if (viewWidth > w)
            w = viewWidth;
        if (!gel('grayBackground')) {
            var gb = cel("div");
            gb.id = gb.name = "grayBackground";
            gb.style.top = gb.style.left = 0;
            gb.style.width = w + "px";
            gb.style.height = h + "px";
            gb.style.position = "absolute";
            gb.style.display = "block";
            gb.style.zIndex = this.ZINDEX - 1;
            gb.style.zIndex = this.getZIndex() - 1;
            gb.style.backgroundColor = this.BACKGROUND_COLOR;
            gb.style.opacity = 0.33;
            gb.style.filter = "alpha(opacity=33)";
            this.parentElement.appendChild(gb);
            this.grayBackground = gb;
        }
    },
    type : function() {
        return "GlideDialogWindow";
    }
});