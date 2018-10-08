//defer classes/GlidePane.js
/**
* Display a dialog that covers the entire window with some spacing around the dialog to make it look nice.
*
* To use:
*
*      var d = new GlidePane(title, tablename, [element, completionCallback])
*      d.render();
*
* 'element' is currently ignored and the Pane is displayed so that it covers the current window.
*/
var GlidePane = Class.create(GlidePaneForm, {
    DIALOG_FORM: "glide_pane",
    initialize: function(title, tableName, element, onCompletionCallback) {
        GlidePaneForm.prototype.initialize.call(this, title, tableName, element, onCompletionCallback);
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
        addHidden(f, 'sys_id', sysId);
        addHidden(f, 'sysparm_sys_id', sysId);
        this.isLoaded = true;
        for (id in this.parms)
            addHidden(f, id, this.parms[id]);
        f.submit();
    },
    type : function() {
        return "GlidePane";
    }
});