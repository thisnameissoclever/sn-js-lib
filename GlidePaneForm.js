//defer classes/GlidePaneForm.js
/**
* Display a dialog that covers the entire window with some spacing around the dialog to make it look nice.
*
* To use:
*
*      var d = new GlidePaneForm(title, tablename, [element, completionCallback])
*      d.render();
*
* 'element' is currently ignored and the Pane is displayed so that it covers the current window.
*/
var GlidePaneForm = Class.create(GlideDialogForm, {
    WINDOW_BORDER: 2,       // width of GlideWindow border
    INSET_SPACING : 20,     // spacing around window within element
    DIALOG_FORM: "glide_pane_form",
    initialize: function(title, tableName, element, onCompletionCallback) {
        this.divMode = true;
        GlideDialogForm.prototype.initialize.call(this, title, tableName, onCompletionCallback, true);
        this.setClassName("glide_pane");
        this.setHeaderClassName("glide_pane_header");
        this.setColor("white");
        this.paneSize = this._getPaneSize();
        this.setSize(this.paneSize.width, this.paneSize.height);
        this.adjustBodySize();
        this.moveTo(this.paneSize.left, this.paneSize.top);
        this._createCloseButton();
        this.getBody().style.overflow = "hidden";
    },
    onResize: function() {
        return;
    },
    _getPaneSize: function(e) {
        var o = new WindowSize();
        var paneSize = {};
        paneSize.height = o.height - ((this.WINDOW_BORDER + this.INSET_SPACING) * 2);
        paneSize.width = o.width - ((this.WINDOW_BORDER + this.INSET_SPACING) * 2);
        if (paneSize.height < this.INSET_SPACING) {
            paneSize.height = o.height;
            paneSize.top = 0;
        } else {
            paneSize.top = this.INSET_SPACING + document.body.scrollTop;
        }
        if (paneSize.width < 0) {
            paneSize.width = o.width;
            paneSize.left = 0;
        } else {
            paneSize.left = this.INSET_SPACING + document.body.scrollLeft;
        }
        paneSize.headerHeight = this.getHeader().clientHeight;
        return paneSize;
    },
    _createCloseButton: function() {
        var img = cel("img");
        img.src = "images/x.gifx";
        img.alt = new GwtMessage().getMessage("Close");
        img.style.height = "12px";
        img.style.width = "13px";
        img.style.cursor = 'pointer';
        Event.observe(img, "click", this.destroy.bind(this));
        this.addDecoration(img);
    },
    _resizeDialog: function() {
        var h = this.paneSize.height - this.paneSize.headerHeight;
        var w =  this.paneSize.width;
        if (isMSIE) {
            h -= (this.WINDOW_BORDER * 2);
            w -= (this.WINDOW_BORDER * 2);
        }
        var e = $('dialog_frame');
        e.style.height = h + "px";
        e.style.width = w + "px";
    },
    type : function() {
        return "GlidePaneForm";
    }
});