//defer classes/ajax/DerivedFields.js
/**
* This object is used by the AJAXReferenceCompleter to clear and update fields.
*/
var DerivedFields = Class.create({
    initialize : function(elementName) {
        this.elementName = elementName;
    },
    clearRelated : function() {
        if (typeof(g_form) == 'undefined')
            return;
        var list = g_form.getDerivedFields(this.elementName);
        if (list == null)
            return;
        var prefix = this.elementName.split(".");
        prefix.shift();
        prefix = prefix.join(".");
        for (var i = 0; i < list.length; i++) {
            var elname = prefix + "." + list[i];
            g_form.clearValue(elname);
        }
    },
    updateRelated : function(key) {
        if (!key || typeof(g_form) == 'undefined')
            return;
        var list = g_form.getDerivedFields(this.elementName);
        if (list == null)
            return;
        var url = "xmlhttp.do?sysparm_processor=GetReferenceRecord" +
        "&sysparm_name=" + this.elementName +
        "&sysparm_value=" + key +
        "&sysparm_derived_fields=" + list.join(',');
        var args = new Array(this.elementName,list.join(','));
        serverRequest(url, refFieldChangeResponse, args);
    },
    toString: function() {
        return 'DerivedFields';
    }
});