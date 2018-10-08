//defer classes/GlideDialogForm.js
/**
* Display a form in a dialog window
*
* To use:
*       var d = new GlideDialogForm('dialog title', 'table_name_or_form_name', [callback on completion of submit])
*       d.setPreference('name', 'value');
*       d.render();
*
* Preferences:
*     Specify the query parameters that are passed to the form using 'setPreference'.  Any name/value pair that
*     you specify with setPreference will be sent along with the form POST when the dialog is rendered.
*
* addParm:
*     If you need to inject values into the form that you are displaying in the dialog, use 'addParm'.  Any
*    name/value pairs you add with addParm will be injected into the displayed form after it has been rendered
*    using hidden input fields.  Note that this is different than setPreference, which adds query parameters that
*    are sent with the POST request for the form.
*
* Callback function:
*     If you specify an onCompletionCallback function for the GlideDialogForm (or call setCompletionCallback before
*    rendering the dialog), then the specified function will be called after the form has been successfully
*     submitted and processed by the server-side.  The callback function will be called with the following
*    arguments:
*
*           callbackFunc(action_verb, sys_id, table, displayValue)
*
*     For example, for an insert, action_verb would be 'sysverb_insert' and sys_id would be the sys_id of the
*    newly inserted record.
*
*  width and height:
*    setDialogWidth(width) and setDialogHeight(height) will ensure that the dialog window displayed at these dimensions
*    regardless of the contents of the dialog.  If not specified, dialog is resized based on the contents.
*/
var GlideDialogForm = Class.create(GlideDialogWindow, {
    REFRESH_ID: "refresh_frame",
    CALLBACK_TARGET_FIELD: "glide_dialog_form_target",
    DIALOG_FORM: "glide_dialog_form",
    initialize: function(title, tableName, onCompletionCallback, readOnly) {
        this.parms = {};
        this.fieldIDSet = false;
        this.positionSet = false;
        this.dialogWidth = "";
        this.dialogHeight = "";
        this.additionalWidth = 17;
        this.additionalHeight = 17;
        this.centerOnResize = true;
        GlideDialogWindow.prototype.initialize.call(this, "FormDialog", readOnly);
        if (title)
            this.setTitle(title);
        this.setPreference('renderer', 'RenderForm');
        this.setPreference('table', this.DIALOG_FORM);
        this.setPreference('sysparm_nameofstack', 'formDialog'); // a named stack will be cleared (in RenderInfo.java)
        this.on("bodyrendered", this._onLoaded.bind(this));
        this.tableName = tableName;
        if (onCompletionCallback)
            this.setCompletionCallback(onCompletionCallback);
    },
    destroy: function() {
        this.un("bodyrendered");
        if (this.callbackField) {
            this.callbackField.onchange = null;
            rel(this.CALLBACK_TARGET_FIELD + "_" + this.tableName);
        }
        if (this.refreshField) {
            this.refreshField.onchange = null;
            rel(this.REFRESH_ID);
        }
        GlideDialogWindow.prototype.destroy.call(this);
    },
    _onLoaded: function() {
        var f = gel("dialog_form_poster");
        f.action = this.tableName + '.do';
        addHidden(f, 'sysparm_nameofstack', 'formDialog');
        addHidden(f, 'sysparm_titleless', 'true');
        addHidden(f, 'sysparm_is_dialog_form', 'true');
        var sysId = this.getPreference('sys_id');
        if (!sysId)
            sysId = '';
        var targetField = '';
        if (this.fieldIDSet)
            targetField = this.getPreference('sysparm_target_field');
        addHidden(f, 'sys_id', sysId);
        addHidden(f, 'sysparm_sys_id', sysId);
        addHidden(f, 'sysparm_goto_url', this.DIALOG_FORM + '.do?sysparm_pass2=true&sysparm_skipmsgs=true&sysparm_nameofstack=formDialog&sysparm_returned_sysid=$action:$sys_id:$display_value&sysparm_target_field=' + targetField);
        this.isLoaded = true;
        for (id in this.parms)
            addHidden(f, id, this.parms[id]);
        f.submit();
    },
    setLoadCallback: function(func) {
        this.loadCallback = func;
    },
    setX: function(x) {
        this.x = x;
        this.positionSet = true;
    },
    setY: function(y) {
        this.y = y;
        this.positionSet = true;
    },
    onResize: function() {
        this._centerOrPosition();
    },
    setDialogTitle: function(title) {
        this.setTitle(title);
    },
    setSysID: function(id) {
        this.setPreference('sys_id', id);
    },
    setFieldID: function(fid) {
        this.fieldIDSet = true;
        this.setPreference('sysparm_target_field', fid);
    },
    setType: function(type) {
        this.setPreference('type', type);
    },
    setMultiple: function(form) {
        this.setPreference('sys_id', '-2');
        this.addParm('sysparm_multiple_update', 'true');
        this.addParm('sys_action', 'sysverb_multiple_update')
        this.form = form;
    },
    setDialogSize: function(w, h) {
        this.setDialogWidth(w);
        this.setDialogHeight(h);
    },
    setDialogWidth: function(w) {
        this.dialogWidth = w;
    },
    setDialogHeight: function(h) {
        this.dialogHeight = h;
    },
    setDialogHeightMax: function(h) {
        this.dialogHeightMax = h;
    },
    setCenterOnResize: function(flag) {
        this.centerOnResize = flag;
    },
    addParm: function(parm, value) {
        this.parms[parm] = value;
    },
    render: function() {
        if (this.fieldIDSet == false)
            this.setRefresh();
        GlideDialogWindow.prototype.render.call(this);
    },
    setRefresh: function() {
        var r = gel(this.REFRESH_ID)
        if (r == null)
            this.initRefresh();
        this.setFieldID(this.REFRESH_ID);
    },
    setForm: function(form) {
        this.form = form
    },
    initRefresh: function() {
        this.refreshField = cel("input");
        this.refreshField.type = "hidden";
        this.refreshField.id = this.REFRESH_ID;
        this.refreshField.onchange = this.doRefresh.bind(this);
        document.body.appendChild(this.refreshField);
        return this.refreshField;
    },
    doRefresh: function() {
        var search = self.location.href;
        if (search.indexOf("sysparm_refresh") == -1) {
            if (search.indexOf("?") == -1)
                search += "?";
            else
                search += "&";
            search += "sysparm_refresh=refresh";
        }
        self.location.href = search;
    },
    setCompletionCallback: function(func) {
        this.onCompletionFunc = func;
        this.callbackField = cel("input");
        this.callbackField.type = "hidden";
        this.callbackField.id = this.CALLBACK_TARGET_FIELD + "_" + this.tableName;
        this.callbackField.onchange = this._completionCallback.bind(this);
        document.body.appendChild(this.callbackField);
        this.setFieldID(this.callbackField.id);
    },
    frameLoaded: function() {
        this._hideLoading();
        if (!this.isLoaded)
            return;
        this._resizeDialog();
        if (this.loadCallback)
            this.loadCallback(this._getIframeDocument());
    },
    _centerOrPosition: function() {
        if (!this.positionSet) {
            this._centerOnScreen();
            return;
        }
        this.moveTo(this.x, this.y);
    },
    _completionCallback: function() {
        var e = gel(this.CALLBACK_TARGET_FIELD + "_" + this.tableName);
        if (e) {
            var sysId;
            var action;
            var displayValue;
            var info = e.value.split(":");
            var sysId = info[0];
            if (info.length > 1)
                action = info[1];
            if (info.length > 2)
                displayValue = info[2].unescapeHTML();
            this.onCompletionFunc(info[0], info[1], this.tableName, displayValue);
        }
    },
    _resizeDialog: function() {
        var doc = this._getIframeDocument();
        if (!doc)
            return;
        var scrollable = this._getScrollable(doc.body);
        if (!this.dialogWidth)
            this.dialogWidth = scrollable.scrollWidth + this.additionalWidth;
        if (!this.dialogHeight)
            this.dialogHeight = scrollable.scrollHeight + this.additionalHeight;
        if (this.dialogHeightMax)
            this.dialogHeight = Math.min(this.dialogHeightMax, this.dialogHeight);
        var e = gel('dialog_frame');
        e.style.height = this.dialogHeight;
        e.style.width = this.dialogWidth;
        this._centerOrPosition();
    },
    _getScrollable: function(body) {
        for (var i=0; i<body.childNodes.length; i++) {
            if (body.childNodes[i].className == "section_header_content_no_scroll")
                return body.childNodes[i];
        }
        return body;
    },
    _hideLoading: function() {
        var l = gel('loadingSpan');
        if (l)
            l.style.display = 'none';
    },
    _getIframeDocument: function() {
        var e = gel('dialog_frame');
        if (e)
            if (e.contentDocument)
                return e.contentDocument;
        return document.frames['dialog_frame'].document;
    },
    type : function() {
        return "GlideDialogForm";
    }
});