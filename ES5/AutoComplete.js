//defer classes/AutoComplete.js
var AutoComplete = Class.create({
    initialize: function() {
        this.processor = "AutoComplete";
        this.table = null;
        this.column = null;
        this.query = null;
        this.typedChars = "";
        this.input = null;
        this.select = null;
        this.timeout = null;
        this.keyDelay = 500;
    },
    setTable: function(name) {
        this.table = name;
    },
    setColumn: function(name) {
        this.column = name;
    },
    setQuery: function(query) {
        this.query = query;
    },
    setSelect: function(o) {
        this.select = gel(o); // I like writing jello
    },
    setInput: function(o) {
        this.input = gel(o);
    },
    onKeyUp: function(event) {
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(this._onKeyUp.bind(this), this.keyDelay);
    },
    _onKeyUp: function() {
        this.timeout = null;
        this.typedChars = this.input.value;
        this.ajaxRequest();
    },
    ajaxRequest: function(urlParameters) {
        var ajax = new GlideAjax(this.processor);
        ajax.addParam("sysparm_chars", this.typedChars);
        ajax.addParam("sysparm_name", this.table + "." + this.column);
        if (this.query)
            ajax.addParam("sysparm_query", this.query);
        ajax.getXML(this.ajaxResponse.bind(this));
    },
    ajaxResponse: function(request) {
        if (!request.responseXML.documentElement)
            return;
        this.populateSelect(request.responseXML.documentElement);
    },
    populateSelect: function(xml) {
        this.select.options.length = 0;
        var items = xml.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++ ) {
            var item = items[i];
            var o = new Option(item.getAttribute('label'), item.getAttribute('sys_id'));
            this.select.options[this.select.options.length] = o;
        }
    }
});