//defer classes/TemplateRecord.js
var TemplateRecord = Class.create({
    NAME: "name",
    VALUE: "value",
    ITEM: "item",
    DEPENDENT: "dependent",
    initialize: function(sysID) {
        this.sysID = sysID;
    },
    apply: function() {
        var ga = new GlideAjax('AjaxClientHelper');
        ga.addParam('sysparm_name','getValues');
        ga.addParam('sysparm_sys_id',this.sysID);
        ga.getXML(this._applyResponse.bind(this));
    },
    _applyResponse : function(response) {
        if (!response || !response.responseXML)
            return;
        this.template = response.responseXML;
        this.applyRecord();
    },
    applyRecord: function() {
        var fa = g_form.getEditableFields();
        var fao = new Object();
        for (var i = 0; i < fa.length; i++)
            fao[fa[i]] = fa[i];
        var items = this.template.getElementsByTagName(this.ITEM);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var name = item.getAttribute(this.NAME);
            if (!fao[name])
                continue;
            this.applyItem(name, item.getAttribute(this.VALUE));
        }
    },
    applyItem: function(element, value) {
        if (value == null || value == 'null')
            return;
        g_form.setTemplateValue(element, value);
    }
});
TemplateRecord.save = function(id) {
    var fields = g_form.getEditableFields();
    var f = g_form.getFormElement();
    addHidden(f, 'sysparm_template_editable', fields.join());
    gsftSubmit(id);
}/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


