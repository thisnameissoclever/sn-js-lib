//defer classes/ajax/AJAXReferenceChoice.js
/*
* Handles the client side updating of "choice type" reference fields which may
* potentially need to reset their list of choices if they A) have an advanced reference qualifier
* and B) you change one of those fields on the client side
*/
var AJAXReferenceChoice = Class.create(AJAXReferenceCompleter, {
    addSysParms: function() {
        var sp = "sysparm_processor=PickList" +
        "&sysparm_name=" + this.elementName +
        "&sysparm_timer=" + this.timer +
        "&sysparm_max=" + this.max +
        "&sysparm_chars=" + encodeText(this.searchChars);
        return sp;
    },
    ajaxRequest : function() {
        var url = "";
        url += this.addSysParms();
        url += this.addDependentValue();
        url += this.addRefQualValues();
        url += this.addTargetTable();
        url += this.addAdditionalValues();
        url += this.addAttributes("ac_");
        url += "&sysparm_max=250";
        serverRequestPost("xmlhttp.do", url, this.ajaxResponse.bind(this));
    },
    onBlur : function() {},
    onFocus : function() {},
    ajaxResponse: function(response) {
        if (!response.responseXML.documentElement) {
            this.isResolvingFlag = false;
            return;
        }
        var currentValue = this.element.value;
        this.element.options.length = 0;
        var items = response.responseXML.getElementsByTagName("item");
        var s = "";
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var id = item.getAttribute('value');
            var l = item.getAttribute('name');
            var selected = id == currentValue;
            addOption(this.element, id, l, selected) ;
        }
    }
});