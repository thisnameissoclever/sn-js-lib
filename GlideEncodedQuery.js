var GlideEncodedQuery = Class.create();
GlideEncodedQuery.prototype = {
    initialize: function(name, query, callback) {
        this.callback = callback;
        this.name = name;
        this.encodedQuery = query;
    },
    parse: function() {
        this.reset(this.name, this.encodedQuery);
    },
    destroy: function() {
        for (var i=0; i< this.orderBy.length; i++)
            this.orderBy[i].destroy();
        for (var i=0; i< this.groupBy.length; i++)
            this.groupBy[i].destroy();
    },
    reset: function(name, query) {
        this.orderBy = new Array();
        this.groupBy = new Array();
        this.tableName = name;
        this.encodedQuery = query;
        this.terms = new Array();
        this.decode();
    },
    decode: function() {
        this.getEncodedParts();
    },
    getEncodedParts: function() {
        if (typeof g_filter_description !='undefined' && this.tableName == g_filter_description.getName() &&
            this.encodedQuery == g_filter_description.getFilter()) {
            this.partsXML = loadXML(g_filter_description.getParsedQuery());
            this.parseXML();
            return;
        }
        var ajax = new GlideAjax('QueryParseAjax');
        ajax.addParam('sysparm_chars', this.encodedQuery);
        ajax.addParam('sysparm_name', this.tableName);
        if (this.callback)
            ajax.getXML(this.getEncodedPartsResponse.bind(this));
        else {
            this.partsXML = ajax.getXMLWait();
            this.parseXML();
        }
    },
    getEncodedPartsResponse: function(response) {
        if (!response || !response.responseXML)
            this.callback();
        this.partsXML = response.responseXML;
        this.parseXML();
    },
    parseXML: function() {
        var items = this.partsXML.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var qp = new GlideQueryPart(item);
            if (qp.isGroupBy()) {
                this.addGroupBy(qp.getValue())
            } else if (qp.isOrderBy()) {
                this.addOrderBy(qp.getValue(), qp.isAscending());
            } else
                this.terms[this.terms.length] = qp;
        }
        if (this.callback)
            this.callback();
    },
    getXML: function() {
        return this.partsXML;
    },
    addGroupBy: function(groupBy) {
        this.groupBy[this.groupBy.length] = groupBy;
    },
    addOrderBy: function(orderBy, ascending) {
        this.orderBy[this.orderBy.length] = new GlideSortSpec(orderBy, ascending);
    },
    getTerms: function() {
        return this.terms;
    },
    getOrderBy: function() {
        return this.orderBy;
    },
    getGroupBy: function() {
        return this.groupBy;
    },
    z: null
};
var GlideQueryPart = Class.create();
GlideQueryPart.prototype = {
    initialize: function(item) {
        this.item = item;
        this.groupBy = false;
        this.orderBy = false;
        this.ascending = false;
        this.Goto = item.getAttribute("goto");
        this.EndQuery = item.getAttribute("endquery");
        this.NewQuery = item.getAttribute("newquery");
        this.OR = item.getAttribute("or");
        this.valid = true;
        this.extract();
    },
    destroy: function() {
        this.item = null;
    },
    isOR: function() {
        return this.OR == 'true';
    },
    isNewQuery: function() {
        return this.NewQuery == 'true';
    },
    isGoTo: function() {
        return this.Goto == 'true';
    },
    extract: function() {
        if (this.EndQuery == 'true') {
            this.valid = false;
            return;
        }
        this.operator = this.item.getAttribute("operator");
        this.value = this.item.getAttribute("value");
        this.field = this.item.getAttribute("field");
        if (this.operator == 'GROUPBY') {
            this.groupBy = true;
            return;
        }
        if (this.operator == 'ORDERBYDESC') {
            this.orderBy = true;
            this.ascending = false;
            return;
        }
        if (this.operator == 'ORDERBY') {
            this.orderBy = true;
            this.ascending = true;
            return;
        }
        for (i = 0; i < operators.length; i++) {
            if (this.operator == operators[i])
                break;
        }
        if (i == operators.length) {
            this.valid = false;
            return;
        }
    },
    getOperator: function() {
        this.operator.title = "Operator";
        return this.operator;
    },
    getField: function() {
        this.field.title = "Field";
        return this.field;
    },
    getValue: function() {
        this.value.title = "Value";
        return this.value;
    },
    isValid: function() {
        return this.valid;
    },
    isGroupBy: function() {
        return this.groupBy;
    },
    isOrderBy: function() {
        return this.orderBy;
    },
    isAscending: function() {
        return this.ascending;
    },
    z: null
};