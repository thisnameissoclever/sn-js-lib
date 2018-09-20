//include classes/GlideFilterDescription.js
var GlideFilterDescription = Class.create({
    initialize: function() {},
    choices: null,
    setParsedQuery: function(strVal) {
        this.parsedQuery = strVal;
    },
    getParsedQuery: function() {
        return this.parsedQuery;
    },
    setBaseLine: function(value) {
        this.baseLine = value;
    },
    getBaseLine: function() {
        return this.baseLine;
    },
    setMetaData: function(value) {
        this.metaData = value;
    },
    getMetaData: function() {
        return this.metaData;
    },
    setPreferenceParam: function(value) {
        this.preference = value;
    },
    getPreferenceParam: function() {
        return this.preference;
    },
    setExpanded: function(value) {
        this.expanded = value;
    },
    getExpanded: function() {
        return this.expanded;
    },
    setName: function(value) {
        this.name = value;
    },
    getName: function() {
        return this.name;
    },
    setFilter: function(value) {
        this.filter = value;
    },
    getFilter: function() {
        return this.filter;
    },
    setTableName: function(value) {
        this.tableName = value;
    },
    getTableName: function() {
        return this.tableName;
    },
    setPinned: function(value) {
        this.pinned = value;
    },
    getPinned: function() {
        return this.pinned;
    },
    setMainFilterTable: function(filterTable) {
        this.mainFilterTable = filterTable;
    },
    getMainFilterTable: function() {
        return this.mainFilterTable;
    },
    setPinnable: function(value) {
        this.pinnable = value;
    },
    getPinnable: function() {
        return this.pinnable;
    },
    setShowRelated: function(value) {
        this.showRelated = value;
    },
    getShowRelated: function() {
        return this.showRelated;
    },
    setChoiceListMap: function(value) {
        this.choiceList = value;
    },
    getChoiceList: function(table) {
        if (typeof this.choiceList == 'undefined')
            return null;
        return this.choiceList[table];
    }
});
//include classes/GlideFilterHandlers.js
var GlideFilterHandler = Class.create({
    initialize: function(tableName, item) {
        this.maxValues = 0;
        this.tableName = tableName;
        this.item = item;
    },
    destroy: function() {
        if (this.tr) {
            if (this.tr.operSel)
                this.tr.operSel.onchange = null;
            this.tr = null;
        }
        for (i = 0; i < this.inputCnt; i++) {
            this.inputs[i].onkeypress = null;
            this.inputs[i].onchange = null;
            this.inputs[i] = null;
        }
    },
    create: function(tr, values) {
        this.tr = tr;
        this._setup(values);
        this._init(values);
        this._build();
        if (this.listenForOperChange)
            this.tr.operSel.onchange = this._operOnChange.bind(this);
    },
    _setup: function(values) {
    },
    getTableName: function() {
        return this.tableName;
    },
    _init: function(values) {
        this._initValues(values);
        this._initInputs();
    },
    _initValues: function(values) {
        if (!values)
            this.values = [];
        else
            this.values = values.split("@");
        for (var i = this.values.length; i < this.maxValues; i++)
            this.values[i] = "";
    },
    _initInputs: function() {
        this.inputCnt = 0;
        this.inputs = [];
        for (var i = 0; i < this.maxValues; i++)
            this.inputs[i] = null;
    },
    _clearValues: function() {
        this.values = [];
        for (var i = 0; i < this.maxValues; i++)
            this.values[i] = "";
    },
    _isEmptyOper: function() {
        var op = this._getOperator();
        if (op == 'ISEMPTY' || op == 'ISNOTEMPTY' || op == 'ANYTHING') {
            this._clearValues();
            return true;
        }
        return false;
    },
    _getOperator: function() {
        return getSelectedOption(this.tr.operSel).value;
    },
    _getInputValue: function(el) {
        var value = "";
        if (el == null)
            return value;
        if ((el.tagName.toUpperCase() == "INPUT") || (el.tagName.toUpperCase() == "TEXTAREA"))
            return el.value;
        var options = el.options;
        if (el.multiple) {
            var vals = [];
            for (var i = 0; i < options.length; i++) {
                if (options[i].selected)
                    vals.push(options[i].value);
            }
            return vals.join(",");
        }
        return options[el.selectedIndex].value;
    },
    _addTextInput: function(type, td) {
        if (!td)
            td = this.tr.tdValue;
        var input = addTextInput(td, this.values[this.inputCnt], type);
        this.inputs[this.inputCnt] = input;
        this.inputCnt++;
        return input;
    },
    _addTextArea: function() {
        var input = addTextArea(this.tr.tdValue, this.values[this.inputCnt]);
        this.inputs[this.inputCnt] = input;
        this.inputCnt++;
        return input;
    },
    _addSelect: function(width, multi, size) {
        var s = _createFilterSelect(width, multi, size);
        this.tr.tdValue.appendChild(s);
        this.inputs[this.inputCnt] = s;
        this.inputCnt++;
        return s;
    },
    _operOnChange: function() {
        this.getValues();
        this._build();
    },
    _isTemplate: function() {
        var t = this.tr;
        while (t) {
            t = findParentByTag(t, 'table');
            if (t) {
                var id = t.id + '';
                if (id.indexOf('filters_table') != -1)
                    break;
            }
        }
        if (!t)
            return false;
        return t.getAttribute('gsft_template') == 'true';
    },
    getValues: function() {
        this._clearValues();
        if (this.inputCnt == 0)
            return "";
        for (var i = 0; i < this.maxValues; i++)
            this.values[i] = this._getInputValue(this.inputs[i]);
        if (this.inputCnt == 1)
            return this.values[0];
        else
            return this.values.join("@");
    }
});
var GlideFilterString = Class.create(GlideFilterHandler, {
    _setup: function(values) {
        this.maxValues = 2;
        this.listenForOperChange = true;
    },
    _build: function() {
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        if (this._getOperator() == 'IN') {
            var saveMe = useTextareas;
            useTextareas = true;
            var inp = this._addTextArea();
            inp.style.width= '20em';
            var v = this.values[this.inputCnt -1];
            if (this._isTemplate()) {
                inp.value = v;
            } else {
                if (v) {
                    if (isMSIE)
                        v = v.replace(/,/g, '\n\r');
                    else
                        v = v.replace(/,/g, '\n');
                    inp.value = v;
                }
            }
            useTextareas = saveMe;
        } else
            this._addTextInput();
        if (this._getOperator() == "BETWEEN") {
            var txt = document.createTextNode(" and ");
            this.tr.tdValue.appendChild(txt);
            this._addTextInput();
        }
    },
    _getInputValue: function(el) {
        if (el == null)
            return '';
        if (!(el.tagName.toUpperCase() == "TEXTAREA"))
            return GlideFilterHandler.prototype._getInputValue.call(this, el);
        var value = el.value + '';
        if (!this._isTemplate()) {
            value = value.replace(/[\n\t]/g, ',');
            value = value.replace(/\r/g, '');
        }
        return value;
    },
    _initValues: function(values) {
        this.values = [];
        if (values)
            this.values[0] = values;
    }
});
var GlideFilterDuration = Class.create(GlideFilterHandler, {
    _setup: function(values) {
        this.maxValues = 1;
        this.duration = new GlideDuration(values);
        this.listenForOperChange = true;
    },
    destroy: function() {
        if (this.tr)
            this.tr.tdValue.innerHTML = "";
        this.inputCnt = 0;
        GlideFilterHandler.prototype.destroy.call(this);
    },
    _initValues: function(values) {
        this.values = new Array();
        this.values[0] = this.duration.getDays();
        this.values[1] = this.duration.getHours();
        this.values[2] = this.duration.getMinutes();
        this.values[3] = this.duration.getSeconds();
        this.inputCnt = 4;
    },
    getValues: function() {
        this._clearValues();
        if (this.inputCnt == 0)
            return "";
        var answer = this.duration.getValue();
        this.values[0] = this.duration.getDays();
        this.values[1] = this.duration.getHours();
        this.values[2] = this.duration.getMinutes();
        this.values[3] = this.duration.getSeconds();
        return "javascript:gs.getDurationDate('" + answer + "')";
    },
    _build: function() {
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        this.inputCnt = 1;
        this.duration.buildHTML(this.tr.tdValue);
    }
});
var GlideFilterStringMulti = Class.create(GlideFilterString, {
    _setup: function(values) {
        this.maxValues = 1;
        this.listenForOperChange = true;
    },
    _build: function() {
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        this._addTextArea();
    }
});
var GlideFilterChoice = Class.create(GlideFilterHandler, {
    _setup: function(values) {
        this.maxValues = 1;
        this.listenForOperChange = true;
    },
    setChoices: function(choices) {
        this.choices = choices;
    },
    setWidth: function(width) {
        this.width = width;
    },
    setMulti: function(multi) {
        this.multi = multi;
    },
    setSize: function(size) {
        this.size = size;
    },
    _build: function() {
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        var s = this._addSelect(this.width, this.multi, this.size);
        this._fillSelect();
    },
    _fillSelect: function() {
        var vars = {};
        if (this.values[0]) {
            var valSplit = this.values[0].split(',');
            for (var i = 0; i < valSplit.length; i++) {
                vars[valSplit[i]] = true;
            }
        }
        var removeNone = false;
        var oper = this._getOperator();
        if ((oper == 'IN') || (oper == 'NOT IN'))
            removeNone = true;
        if (isMSIE && this.inputs[0].multiple) {
            var isIE6 = /MSIE 6/.test(navigator.userAgent);
            if (isIE6)
                this.inputs[0].focus();
        }
        for (var i = 0; i < this.choices.length; i++) {
            var option = this.choices[i];
            if (option[0] == '' && removeNone)
                continue;
            var selected = (vars[option[0]] != null);
            addOption(this.inputs[0], option[0], option[1], selected);
        }
    }
});
var GlideFilterChoiceDynamic = Class.create(GlideFilterChoice, {
    _setup: function(values) {
        this.size = 4;
        this.maxValues = 1;
        this.listenForOperChange = true;
    },
    setChoices: function(choices) {
        this.choices = choices;
    },
    _build: function() {
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        var oper = this._getOperator();
        if ((oper == 'LIKE') || (oper == 'STARTSWITH') || (oper == 'ENDSWITH') || (oper == 'NOT LIKE')) {
            if (this.prevOper && (this.prevOper != 'LIKE') && (this.prevOper != 'STARTSWITH') && (this.prevOper != 'ENDSWITH'))
                this._clearValues();
            this._addTextInput();
        } else if ((oper == 'IN') || (oper == 'NOT IN')) {
            this.multi = true;
            var s = this._addSelect(this.width, this.multi, this.size);
            if (!this.hasChoices) {
                s.disabled = true;
                this._getChoices();
            } else
                this._fillSelect();
        } else {
            this.multi = false;
            var s = this._addSelect(this.width, this.multi, 1);
            if (!this.hasChoices) {
                s.disabled = true;
                this._getChoices();
            } else
                this._fillSelect();
        }
        this.prevOper = oper;
    },
    _getChoices: function() {
        if (typeof g_filter_description != 'undefined' && g_filter_description.getChoiceList(this.tr.tableField) != null) {
            var response = loadXML(g_filter_description.getChoiceList(this.tr.tableField));
            this._addChoices(response);
        } else {
            var ajax = new GlideAjax('PickList');
            ajax.addParam('sysparm_chars', '*');
            ajax.addParam('sysparm_nomax', 'true');
            ajax.addParam('sysparm_name', this.tr.tableField);
            var response = ajax.getXMLWait();
            this._addChoices(response);
        }
    },
    _addChoices: function(xml) {
        var msg = new GwtMessage();
        var select = this.inputs[0];
        select.disabled = false;
        select.options.length = 0;
        this.choices = [];
        this.hasChoices = true;
        this.choices[0] = ['', msg.getMessage('-- None --')];
        if (!xml)
            return;
        var root = xml.documentElement;
        var dep = root.getAttribute("dependent");
        var items = xml.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var v = item.getAttribute("value");
            var l = item.getAttribute("label");
            var option = [v, l];
            this.choices.push(option);
        }
        if (dep != null) {
            this.choices = this.choices.sort(
                function(a,b) {
                    if ((a[1].toLowerCase()+"") < (b[1].toLowerCase()+"")) {
                        return -1;
                    }
                    if ((a[1].toLowerCase()+"") > (b[1].toLowerCase()+"")) {
                        return 1;
                    }
                    return 0;
                }
                );
            for (var i = 0; i < this.choices.length-1; i++) {
                if (this.choices[i][1] == this.choices[i+1][1])
                    i = this.amendLabel(i);
            }
        }
        this._fillSelect();
    },
    amendLabel: function(i) {
        var dupe = this.choices[i][1];
        while (i < this.choices.length && this.choices[i][1] == dupe) {
            var c = this.choices[i];
            c[1] = c[1] + " - " + c[0];
            i++;
        }
        return i-1;
    }
});
var GlideFilterCurrency = Class.create(GlideFilterString, {
    initialize: function(tableName, item) {
        GlideFilterHandler.prototype.initialize.call(this, tableName, item);
    },
    _setup: function(values) {
        this.maxValues = 1;
        this.id = this.tr.tableField + "." + guid();
        this.listenForOperChange = true;
    },
    _build: function() {
        GlideFilterString.prototype._build.call(this);
        var s = this._addSelect(60, false, 1);
        this._getCurrencies(s);
    },
    _getCurrencies: function(s) {
        var currencies = new Array();
        if (currencies.length != 0)
            return currencies;
        var ajax = new GlideAjax("CurrencyConverter");
        ajax.addParam("sysparm_name", "getCurrencies");
        ajax.getXMLAnswer(this._getCurrenciesResponse.bind(this), null, s);
    },
    _getCurrenciesResponse: function(answer, s) {
        var values = answer;
        var currencies = values.split(",");
        var cache = this._getCache();
        cache.put("currencies", values);
        for (var i = 0; i < currencies.length; i++)
            addOption(s, currencies[i], currencies[i]);
        this.currency_widget = s;
        this._parseValue();
    },
    _resolveFromCache:function() {
        var cache = this._getCache();
        var value = cache.get("currencies");
        if (value)
            return value.split(",");
        return [];
    },
    _getCache:function() {
        if (typeof(g_cache_currency) != "undefined")
            return g_cache_currency;
        g_cache_currency = new GlideClientCache(1);
        return g_cache_currency;
    },
    _parseValue: function() {
        if (this.inputs.length == 0)
            return;
        var v = this.inputs[0].value;
        if (!v)
            return;
        if (v.indexOf('javascript') < 0)
            return;
        var sa = v.split(';');
        var first = sa[0].split('\'');
        var currency = first[first.length - 1];
        var price = sa[sa.length - 1];
        var i = price.indexOf('\'');
        price = price.substring(0, i);
        this.inputs[0].value = price;
        var sel = new Select(this.currency_widget);
        sel.selectValue(currency);
    },
    getValues: function() {
        var v = GlideFilterString.prototype.getValues.call(this);
        var tn = this.item.table.tableName;
        var fn = this.item.name;
        return 'javascript:getCurrencyFilter(\'' + tn + '\',\'' + fn +'\', \'' + this.currency_widget.value + ';' + v + '\')';
    },
    destroy : function() {
        GlideFilterString.prototype.destroy.call(this);
        this.currency_widget = null;
    },
    z: null
});
g_filter_extension_map['currency'] = function(tableName, elementDef) {
    return new GlideFilterCurrency(tableName, elementDef)
};
g_filter_extension_map['price'] = g_filter_extension_map['currency'];
sysopers['price'] = sysopers['decimal'];
sysopers['currency'] = sysopers['decimal'];
numericTypes['price'] = 1;
numericTypes['currency'] = 1;
//include classes/GlideFilterReference.js
var GlideFilterReference = Class.create(GlideFilterHandler, {
    _setup: function(values) {
        this.maxValues = 1;
        this.id = this.tr.tableField + "." + guid();
        this.listenForOperChange = true;
    },
    _build: function() {
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        var input = this._addTextInput("hidden");
        input.id = this.id;
        input = this._addTextInput();
        input.id = "sys_display." + this.id;
        input.onfocus = this._onFocus.bind(this);
        input.onkeydown = this._onKeyDown.bindAsEventListener(this);
        input.onkeypress = this._onKeyPress.bindAsEventListener(this);
        input.onkeyup = this._onKeyUp.bindAsEventListener(this);
        input.autocomplete = "off";
        input.ac_columns = "";
        input.ac_order_by = "";
        setAttributeValue(input, 'autocomplete', 'off');
        var displayValue = gel('fancy.' + this.values[0]);
        if (displayValue && displayValue.value != '')
            this.inputs[1].value = displayValue.value;
        else if (this.values[0]) {
            this.inputs[1].value = this.values[0];
            this._resolveReference();
        }
        var view = gel('sysparm_view');
        if (view && (view.value == "sys_ref_list"))
            return;
        var image = createImage("images/reference_list.gifx", "Lookup using list", this, this._refListOpen);
        image.setAttribute("class", "filerTableAction")
        this.tr.tdValue.appendChild(image);
    },
    _refListOpen: function() {
        reflistOpen(this.id, this.item.getName(), this.item.getReference());
        return false;
    },
    getValues: function() {
        this._clearValues();
        if (this._isEmptyOper())
            return '';
        var oper = this._getOperator();
        var input = this.inputs[0];
        if (this.inputCnt == 2) {
            var userInput = this.inputs[1];
            var userInputVal = userInput.value;
            if (userInputVal != null && (userInputVal.indexOf("javascript:") > -1))
                input = userInput;
            else if (this.item.getType() != 'glide_list' && oper != '=' && oper != '!=') {
                input = userInput;
            }
        }
        if (input) {
            return input.value;
        } else
            return '';
    },
    _resolveReference: function() {
        if (this.values[0]) {
            var ajax = new GlideAjax("ResolveRef");
            ajax.addParam("sysparm_name", this.tr.tableField);
            ajax.addParam("sysparm_value", this.values[0]);
            ajax.getXML(this._resolveReferenceResponse.bind(this));
        }
    },
    _resolveReferenceResponse: function(request) {
        if (!request)
            return;
        var xml = request.responseXML;
        if (!xml)
            return;
        if (xml) {
            var items = xml.getElementsByTagName("item");
            if (items && items.length > 0 && items[0])
                this.inputs[1].value = items[0].getAttribute("label");
        }
    },
    _onFocus: function(evt) {
        if (!this.inputs[1].ac) {
            this.inputs[1].ac = new AJAXReferenceCompleter(this.inputs[1], this.id, '');
            this.inputs[1].ac.elementName = this.tr.tableField;
            this.inputs[1].ac.clearDerivedFields = true;
        }
    },
    _onKeyDown: function(evt) {
        return acReferenceKeyDown(this.inputs[1], evt);
    },
    _onKeyPress: function(evt) {
        return acReferenceKeyPress(this.inputs[1], evt);
    },
    _onKeyUp: function(evt) {
        return acReferenceKeyUp(this.inputs[1], evt);
    },
    z: null
});
//include classes/GlideFilterDate.js
var GlideFilterDate = Class.create(GlideFilterHandler, {
    SYS_DATE_FORMAT: "yyyy-MM-dd",
    SYS_TIME_FORMAT: "HH:mm:ss",
    SYS_DATE_TIME_FORMAT: "yyyy-MM-dd HH:mm:ss",
    _setup: function(values) {
        this.maxValues = 4;
        this.listenForOperChange = true;
        this.userDateFormat = g_user_date_format;
        this.userTimeFormat = g_user_date_time_format.substring(g_user_date_format.length + 1);
        this.userDateTimeFormat = g_user_date_time_format;
        this.id = "GwtGFD_" + guid();
        this.allowTime = this.item.isDateTime();
    },
    _build: function() {
        this.ANDMSG = new GwtMessage().getMessage('and');
        clearNodes(this.tr.tdValue);
        this.inputCnt = 0;
        if (this._isEmptyOper())
            return;
        var oper = this._getOperator();
        if (this.prevOper && (this.prevOper != oper))
            this._clearValues();
        switch (oper) {
            case 'ON':
            case 'NOTON':
                var val = this.values[0];
                if (val)
                    val += "@" + this.values[1] + "@" + this.values[2];
                this._addDateChoices("1", val, [0, 1, 2], false);
                break;
            case '<':
                var pos = 1;
                this._addDateChoices("1", this.values[0], [pos], this.allowTime, 'start');
                break;
            case '>':
                var pos = 3;
                this._addDateChoices("1", this.values[0], [pos], this.allowTime, 'end');
                break;
            case 'BETWEEN':
                this._addDateChoices("1", this.values[0], [1], this.allowTime, 'start');
                var span = cel("span", this.tr.tdValue);
                span.style.marginLeft = "3px";
                span.style.marginRight = "5px";
                span.innerHTML = this.ANDMSG;
                this._addDateChoices("2", this.values[1], [3], this.allowTime, 'end');
                break;
            case 'DATEPART':
                var trendOper = "EE";
                if (this.values[1]) {
                    var parts = this.values[1].split(",");
                    if (parts.length == 3)
                        trendOper = parts[2].substring(1, 3);
                }
                this._addDateSelect("1", sysvalues['calendar']['RELATIVE'], trendOper, [1]);
                this._addDateSelect("2", sysvalues['calendar']['DATEPART'], this.values[0], [0]);
                break;
            case '=':
            case '!=':
                this._addTextInput();
                break;
            case 'RELATIVE':
                this._addDateSelect("1", sysvalues['calendar']['RELATIVE'], this.values[0], [1]);
                var input = this._addTextInput();
                input.value = this.values[3];
                input.style.width = "30px";
                input.maxlength = 5;
                this._addDateSelect("2", sysvalues['calendar']['TRENDVALUES'], this.values[1], [1]);
                this._addDateSelect("3", sysvalues['calendar']['WHEN'], this.values[2], [1]);
                break;
            case 'SINCE':
                var s = this._addSelect(this.width, this.multi, this.size);
                s.style.marginRight = "3px";
                s.id = this.id + "_select_1";
                var base = new GlideRecord('cmdb_baseline');
                base.addOrderBy('name');
                base.query();
                while (base.next()) {
                    var selected = false;
                    var value = "javascript:getBaseFilter('" + base.name + "')";
                    if (value == this.values[0])
                        selected = true;
                    var o = addOption(s, value, base.name, selected);
                }
                break;
            case 'ANYTHING':
                break;
        }
        this.prevOper = oper;
    },
    getValues: function() {
        if (this.inputCnt == 0)
            return "";
        for (var i = 0; i < this.maxValues; i++)
            this.values[i] = this._getInputValue(this.inputs[i]);
        switch (this._getOperator()) {
            case 'ON':
            case 'NOTON':
                if (this.values[0].indexOf('@') != -1)
                    return this.values[0];
                var value = this._convertDate(this.values[0]);
                return value + "@" + this._getDateGenerate(value, 'start') + "@" + this._getDateGenerate(value, 'end');
            case '<':
                var value = this._convertDate(this.values[0]);
                return this._getDateGenerate(value, 'start');
            case '>':
                var value = this._convertDate(this.values[0]);
                return this._getDateGenerate(value, 'end');
            case 'BETWEEN':
                var start = this._convertDate(this.values[0]);
                start = this._getDateGenerate(start, 'start');
                var end = this._convertDate(this.values[1]);
                end = this._getDateGenerate(end, 'end');
                return start + "@" + end;
            case 'DATEPART':
                var trendOper = this.values[0];
                var datePart = this.values[1];
                var values = sysvalues['calendar']['DATEPART'];
                for (var i = 0; i < values.length; i++) {
                    if (datePart == values[i][0]) {
                        datePart = values[i][1];
                        break;
                    }
                }
                datePart = datePart.split(")")[0] + ",'" + trendOper + "')";
                return this.values[1] + "@" + datePart;
                break;
            case '=':
            case '!=':
                return this.values[0];
                break;
            case 'RELATIVE':
                return this.values[0] + "@" + this.values[2] + "@" + this.values[3] + "@" + this.values[1];
                break;
            case 'SINCE':
                return this.values[0];
                break;
            case 'ANYTHING':
                return "";
                break;
            default:
                if (this.inputCnt == 1)
                    return this.values[0];
                else
                    return this.values.join("@");
        }
    },
    _addDateSelect: function(id, values, matchValue, positions) {
        var map = new GwtMessage().getMessages(buildMap(values, 0));
        var s = this._addSelect(this.width, this.multi, this.size);
        s.style.marginRight = "3px";
        s.id = this.id + "_select_" + id;
        for (var i = 0; i < values.length; i++) {
            var option = values[i];
            var value = "";
            for (var pos = 0; pos < positions.length; pos++) {
                if (pos > 0)
                    value += "@";
                value += option[positions[pos]];
            }
            addOption(s, value, map[option[0]], value == matchValue);
        }
        return s;
    },
    _addDateChoices: function(id, matchValue, positions, allowTime, defaultTime) {
        var select = this._addDateSelect(id, sysvalues['calendar'], matchValue, positions);
        this._addDatePicker(id, select, matchValue, allowTime, defaultTime);
    },
    _addDatePicker: function(id, select, value, allowTime, defaultTime) {
        var found = (select.selectedIndex != -1);
        if ((select.selectedIndex == 0) && (value) && (value != select.options[0].value))
            found = false;
        if (!found) {
            value = this._getDateFromValue(value);
            addOption(select, value, value, true);
        }
        select.allowTime = allowTime;
        select.defaultTime = defaultTime;
        this._addCalendar(id);
    },
    _addCalendar: function(id) {
        var cal = cel("img", this.tr.tdValue);
        cal.id = "cal_" + id;
        cal.name = cal.id;
        cal.src = "images/small_calendar.gifx";
        cal.alt = new GwtMessage().getMessage('Choose date...');
        cal.onclick = this._calendarPopup.bind(this, id);
        cal.style.marginLeft = "2px";
        cal.className = "button";
        var input = addTextInput(this.tr.tdValue, "", "hidden");
        input.id = this.id + "_input_" + id;
        input.onchange = this._dateTimeComplete.bind(this, id);
    },
    _getDateFromValue: function(value) {
        var value = value.split("@")[0];
        var prefixString = "javascript:gs.dateGenerate(";
        if (value.indexOf(prefixString) == 0) {
            var parts = value.split("'");
            if (parts.length == 5) {
                value = parts[1];
                if (isDate(parts[3], this.SYS_TIME_FORMAT)) {
                    var dt = getDateFromFormat(parts[3], this.SYS_TIME_FORMAT);
                    value += " " + formatDate(new Date(dt), this.SYS_TIME_FORMAT);
                }
            }
        }
        if (isDate(value, this.SYS_DATE_TIME_FORMAT)) {
            var dt = getDateFromFormat(value, this.SYS_DATE_TIME_FORMAT);
            value = formatDate(new Date(dt), this.userDateTimeFormat);
        } else if (isDate(value, this.SYS_DATE_FORMAT)) {
            var dt = getDateFromFormat(value, this.SYS_DATE_FORMAT);
            value = formatDate(new Date(dt), this.userDateFormat);
        }
        return value;
    },
    _getDateGenerate: function(value, tag) {
        if (value.indexOf("javascript:") != -1)
            return value;
        if (isDate(value, this.SYS_DATE_TIME_FORMAT)) {
            var dt = getDateFromFormat(value, this.SYS_DATE_TIME_FORMAT);
            value = formatDate(new Date(dt), this.SYS_DATE_FORMAT);
            tag = formatDate(new Date(dt), this.SYS_TIME_FORMAT);
        }
        return "javascript:gs.dateGenerate('" + value + "','" + tag + "')";
    },
    _convertDate: function(value) {
        if (value.indexOf("javascript:") != -1)
            return value;
        if (isDate(value, this.userDateTimeFormat)) {
            var dt = getDateFromFormat(value, this.userDateTimeFormat);
            value = formatDate(new Date(dt), this.SYS_DATE_TIME_FORMAT);
        } else if (isDate(value, this.userDateFormat)) {
            var dt = getDateFromFormat(value, this.userDateFormat);
            value = formatDate(new Date(dt), this.SYS_DATE_FORMAT);
        }
        return value;
    },
    _calendarPopup: function(id) {
        var select = gel(this.id + "_select_" + id);
        var currentDate = '';
        if (select.value.indexOf('javascript') == -1)
            currentDate = select.value;
        var format;
        if (select.allowTime) {
            format = this.userDateTimeFormat;
            if (!isDate(currentDate, format)) {
                var dt = new Date();
                if (isDate(currentDate, this.userDateFormat))
                    dt = new Date(getDateFromFormat(currentDate, this.userDateFormat));
                if (select.defaultTime == 'end')
                    dt.setHours(23, 59, 59);
                else
                    dt.setHours(0, 0, 0);
                currentDate = formatDate(dt, this.userDateTimeFormat);
            }
        } else
            format = this.userDateFormat;
        var input = gel(this.id + "_input_" + id);
        input.value = currentDate;
        new GwtDateTimePicker(input.id, format, select.allowTime, select);
    },
    _dateTimeComplete: function(id) {
        var select = gel(this.id + "_select_" + id);
        var input = gel(this.id + "_input_" + id);
        var option = select.options[select.selectedIndex];
        var value = option.value;
        if (isDate(value, this.userDateFormat) || isDate(value, this.userDateTimeFormat)) {
            option.value = input.value;
            option.text = input.value;
        } else
            addOption(select, input.value, input.value, true);
    },
    type: 'GlideFilterDate'
});
//include classes/GlideFilter.js
MESSAGES_FILTER_BUTTONS = ['Run Filter', 'Run', 'Add AND Condition', 'Add OR Condition', 'and', 'or', 'Delete'];
MESSAGES_FILTER_MISC = ['Run Filter', 'Run', 'Order results by the following fields'];
var GlideFilter = Class.create();
GlideFilter.prototype = {
    FILTER_DIV: "gcond_filters",
    initialize: function(name, query, fDiv, runnable, synchronous) {
        this.synchronous = false;
        if (typeof synchronous != 'undefined')
            this.synchronous = synchronous;
        this.initMessageCache();
        this.maintainPlaceHolder = false;
        this.conditionsWanted = !noConditionals;
        this.opsWanted = !noOps;
        this.defaultPlaceHolder = true;
        this.runable = runnable;
        this.textAreasWanted = useTextareas;
        this.tableName = name;
        this.restrictedFields = null;
        this.onlyRestrictedFields = false;
        this.includeExtended = false;
        var divName = "gcond_filters";
        this.filterReadOnly = false;
        if(fDiv != null)
            divName = fDiv + "gcond_filters";
        this.fDiv = getThing(this.tableName, divName);
        if (this.fDiv.filterObject) // if there already was a filter object, destroy it before we replace it
            this.fDiv.filterObject.destroy();
        this.fDiv.filterObject = this;
        this.sections = new Array();
        this.reset();
        if (typeof query != "undefined") {
            if (this.synchronous)
                this.setQuery(query);
            else
                this.setQueryAsync(query);
        }
    },
    destroy: function() {
        if (this.fDiv) {
            this.fDiv.filterObject = null;
            this.fDiv = null;
        }
        this._clearSections();
    },
    _clearSections: function() {
        for (var i = 0; i < this.sections.length; i++)
            this.sections[i].destroy();
        if (this.sortSection)
            this.sortSection.destroy();
        this.sections = [];
        this.sortSection = null;
    },
    initMessageCache : function() {
        var msg = new GwtMessage();
        var all = new Object();
        for (key in sysvalues) {
            var values = sysvalues[key];
            var keys = buildMap(values, 0);
            for (var i =0; i < keys.length; i++)
                all[keys[i]] = 't';
        }
        for (key in sysopers) {
            var values = sysopers[key];
            var keys = buildMap(values, 1);
            for (var i =0; i < keys.length; i++)
                all[keys[i]] = 't';
        }
        var m = new Array();
        m = m.concat(MESSAGES_FILTER_BUTTONS, MESSAGES_FILTER_MISC, MESSAGES_CONDITION_RELATED_FILES);
        for (var i = 0; i < m.length; i++)
            all[m[i]] = 't';
        var send = new Array();
        for (key in all)
            send.push(key);
        map = msg.getMessages(send);
    },
    setRestrictedFields: function(fields) {
        if (!fields || fields == '')
            return;
        jslog("Received restricted fields " + fields);
        var fa = fields.split(",");
        if (fa.length == 0)
            return;
        this.restrictedFields = new Object();
        for (var i = 0; i < fa.length; i++)
            this.restrictedFields[fa[i]] = fa[i];
    },
    setOnlyRestrictedFields: function(only) {
        this.onlyRestrictedFields = only;
    },
    setIncludeExtended: function(include) {
        this.includeExtended = include;
    },
    filterFields: function(item) {
        if (!this.restrictedFields)
            return true;
        var name = item.getName();
        if (name.indexOf(".")  > -1 )
            return false;
        if (this.restrictedFields[name])
            return true;
        return false;
    },
    setQuery: function(query) {
        jslog("setQuery Synchronously:  " + query);
        this.glideQuery = new GlideEncodedQuery(this.tableName, query);
        this.glideQuery.parse();
        this.reset();
        this.build();
    },
    setQueryAsync: function(query) {
        jslog("setQuery Asynchronously:  " + query);
        this.glideQuery = new GlideEncodedQuery(this.tableName, query, this.setQueryCallback.bind(this));
        this.glideQuery.parse();
        this.queryProcessed = true;
    },
    setQueryCallback: function() {
        this.reset();
        this.build();
        if (this.getFilterReadOnly())
            this.setReadOnly(true);
    },
    setRunable: function(b) {
        this.runable = b;
    },
    isRunable: function() {
        return this.runable;
    },
    setDefaultPlaceHolder: function(b) {
        this.defaultPlaceHolder = b;
    },
    setMaintainPlaceHolder: function(b) {
        this.maintainPlaceHolder = true;
    },
    getMaintainPlaceHolder: function() {
        return this.maintainPlaceHolder;
    },
    setFilterReadOnly: function(b) {
        this.filterReadOnly = b;
    },
    getFilterReadOnly: function() {
        return this.filterReadOnly;
    },
    setRunCode: function(code) {
        this.runCode = code;
    },
    reset: function() {
        clearNodes(this.fDiv);
        this._clearSections();
    },
    getXML: function() {
        return this.glideQuery.getXML();
    },
    build: function() {
        this.queryProcessed = true;
        this.terms = this.glideQuery.getTerms();
        this.buildQuery();
        this.buildOrderBy();
    },
    buildOrderBy: function() {
        var orderArray = this.glideQuery.getOrderBy();
        if (orderArray.length == 0)
            return;
        for (var i = 0; i < orderArray.length; i++) {
            var order = orderArray[i];
            if (order.isAscending())
                this.addSortRow(order.getName(), 'ascending');
            else
                this.addSortRow(order.getName(), 'descending');
        }
    },
    buildQuery: function() {
        this._loadTablesForQuery();
        var queryID = '';
        var partCount = 0;
        var section = this.addSection();
        queryID = section.getQueryID();
        for (var i = 0; i < this.terms.length; i++) {
            var qp = this.terms[i];
            if (!qp.isValid())
                continue;
            partCount += 1;
            if (qp.isNewQuery()) {
                var section = this.addSection();
                queryID = section.getQueryID();
            }
            var field = qp.getField();
            var operator = qp.getOperator();
            var operands = qp.getValue();
            gotoPart = qp.isGoTo();
            if (qp.isOR()) {
                this.currentCondition.addNewSubCondition(field, operator, operands);
            } else {
                this.addConditionRow(queryID, field, operator, operands);
            }
        }
        if (partCount == 0 && this.defaultPlaceHolder)
            this.addConditionRow(queryID);
        gotoPart = false;
    },
    _loadTablesForQuery: function() {
        for (var i = 0; i < this.terms.length; i++) {
            var qp = this.terms[i];
            if (!qp.isValid())
                continue;
            var field = qp.getField();
            this._loadTablesForField(field);
        }
    },
    _loadTablesForField: function(fieldName) {
        if (!fieldName)
            return;
        var tableName = this.tableName.split(".")[0];
        var parts = fieldName.split(".");
        for (var i = 0; i < parts.length; i++) {
            var tableDef = loadFilterTableReference(tableName);
            if (!tableDef)
                return;
            var edef = tableDef.getElement(parts[i]);
            if (edef == null)
                return;
            if (!edef.isReference())
                return;
            tableName = edef.getReference();
        }
    },
    addSortRow: function(field, oper) {
        if (this.sortSection == null) {
            this.sortSection = new GlideSortSection(this);
        }
        this.sortSection.addField(field, oper);
        this.addRunButton();
    },
    addConditionRowToFirstSection: function() {
        if (this.sections.length == 0)
            this.addSection();
        var section = this.sections[0];
        this.addConditionRow(section.getQueryID());
    },
    addConditionRow: function(queryID, field, oper, value) {
        var section = null;
        if (queryID) {
            var i = findInArray(this.sections, queryID);
            if (i != null)
                section = this.sections[i];
        }
        if (!section)
            section = this.addSection();
        var condition = section.addCondition(true, field, oper, value);
        if (!condition)
            return null;
        this.currentCondition = condition;
        return condition.getRow();
    },
    addSection: function() {
        var section = new GlideFilterSection(this);
        queryID = section._setup(this.sortSection == null, this.sections.length == 0);
        this.sections[this.sections.length] = section;
        if (this.sections.length == 1)
            section.setFirst();
        if (this.sortSection != null) {
            var sortRow = this.sortSection.getSection().getRow();
            this.fDiv.insertBefore(section.getRow(), sortRow);
        }
        this.addRunButton();
        return section;
    },
    removeSection: function(queryID) {
        if (this.sortSection) {
            if (this.sortSection.getID() == queryID) {
                clearNodes(this.sortSection.getSection().getRow());
                this.fDiv.removeChild(this.sortSection.getSection().getRow());
                this.sortSection = null;
                this.addRunButton();
                return;
            }
        }
        var i = findInArray(this.sections, queryID);
        if (i == null)
            return;
        var section = this.sections[i];
        this.sections.splice(i, 1);
        clearNodes(section.getRow());
        this.fDiv.removeChild(section.getRow());
        if (i == 0) {
            if (this.sections.length > 0)
                this.sections[0].setFirst();
            else {
                if (this.defaultPlaceHolder)
                    this.addConditionRow(); // force the placeholder to be there
            }
        }
        this.addRunButton();
    },
    singleCondition: function() {
        if (this.sections.length > 1)
            return false;
        var section = this.sections[0];
        count = section.getConditionCount();
        if (count == 1)
            return true;
        return false;
    },
    runFilter: function() {
        var filter = getFilter(this.tableName, true);
        if (runFilterHandlers[this.tableName]) {
            runFilterHandlers[this.tableName](this.tableName, filter);
            return;
        }
        var url = buildURL(this.tableName, filter);
        window.location = url;
    },
    getName: function() {
        return this.tableName;
    },
    getDiv: function() {
        return this.fDiv;
    },
    getConditionsWanted: function() {
        return this.conditionsWanted;
    },
    getOpsWanted: function() {
        return this.opsWanted;
    },
    getTextAreasWanted: function() {
        return this.textAreasWanted;
    },
    isQueryProcessed: function() {
        return this.queryProcessed;
    },
    addRunButton: function() {
        if (!this.runable)
            return;
        var max = (this.sortSection == null)? this.sections.length-1:this.sections.length;
        for (var i = 0; i < max; i++) {
            var section = this.sections[i];
            section.removeRunButton();
        }
        var section = this.sortSection;
        if (section == null)
            section = this.sections[this.sections.length-1];
        section.addRunButton();
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        var parentElement = this.fDiv.parentNode;
        this._hideClass(parentElement, "filerTableAction", disabled);
        this._disableClass(parentElement, "filerTableSelect", disabled);
        this._disableClass(parentElement, "filerTableInput", disabled);
        this.setFilterReadOnly(disabled);
    },
    _disableClass: function(parentElement, className, disabled) {
        var elements = $(parentElement).select("." + className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = disabled;
        }
    },
    _hideClass: function(parentElement, className, hideIt) {
        var elements = $(parentElement).select("." + className);
        for (var i = 0; i < elements.length; i++) {
            if (hideIt)
                hideObject(elements[i]);
            else
                showObjectInline(elements[i]);
        }
    },
    getValue: function() {
        return getFilter(this.tableName, false);
    },
    z: null
};
var GlideFilterSection = Class.create();
GlideFilterSection.prototype = {
    PLACE_HOLDER_FIELD: "-- choose field --",
    initialize: function(filter) {
        this.filter = filter;
        this.sort = false;
        this.queryID = null;
        this.tdMessage = null;
        this.runRow = null;
        this.conditions = new Array();
        var msg = new GwtMessage();
        var values = MESSAGES_FILTER_MISC;
        this.answer = msg.getMessages(values);
    },
    destroy: function() {
        this.runRow = null;
        if (this.runCondition)
            this.runCondition.destroy();
        this.row.rowObject = null;
        this.row = null;
        this.table = null;
        this.tbody = null;
        for (var i=0; i<this.conditions.length; i++)
            this.conditions[i].destroy();
    },
    _setup: function(link, first) {
        this.queryID = 'QUERYPART' + guid();
        this.row = cel('tr');
        this.row.queryID = this.queryID;
        this.row.queryPart = 'true';
        this.row.rowObject = this;
        if (link)
            this.filter.getDiv().appendChild(this.row);
        var td = cel('td', this.row);
        td.style.verticalAlign="top";
        td.style.width = "100%";
        this.table = cel('table', td);
        this.table.cellSpacing = "0px";
        this.table.cellPadding = "1px";
        this.table.border = DEFAULT_BORDER;
        if (!this.filter.getConditionsWanted() || this.sort)
            this.table.className = "wide";
        this.tbody = cel('TBODY', this.table);
        this.tbody.id = this.queryID;
        this.tbody.name = this.queryID;
        if (this.sort)
            this.addSortHeader();
        else
            this.addConditionHeader(first);
        return this.queryID;
    },
    addSortHeader: function() {
        var tr = cel('tr', this.tbody);
        var td = cel('td', tr);
        td.style.verticalAlign="top";
        td.style.width = "100%";
        td.innerHTML = "<hr></hr><sup>" + this.answer['Order results by the following fields'] + "</sup>";
    },
    addConditionHeader: function(first) {
        var tr = cel('tr', this.tbody);
        var td = cel('td', tr);
        td.style.verticalAlign="top";
        td.style.width = "100%";
        this.sectionSep = td;
        if (first == true)
            td.style.display = 'none';
        else
            td.style.display = 'block';
        td.innerHTML = "<hr></hr>";
    },
    setFirst: function() {
        if (this.sectionSep)
            this.sectionSep.style.display = 'none';
    },
    addSortCondition: function() {
        var condition = new GlideSectionCondition(this, this.queryID);
        this.conditions[this.conditions.length] = condition;
        condition.setOrWanted(false);
        if (this.runRow == null)
            condition.build(this.tbody);
        else {
            condition.build(null);
            this.tbody.insertBefore(condition.getRow(), this.runRow);
        }
        return condition;
    },
    newPlaceHolder: function() {
        this.addPlaceHolder(true);
    },
    clearPlaceHolder: function() {
        if (!this.filter.getMaintainPlaceHolder())
            this.placeHolderCondition = null;
        else
            this.newPlaceHolder();
    },
    addPlaceHolder: function(wantOR) {
        this.placeHolderCondition = new GlideSectionCondition(this, this.queryID);
        this.conditions[this.conditions.length] = this.placeHolderCondition;
        this.placeHolderCondition.setPlaceHolder(true);
        this.placeHolderCondition.setOrWanted(true);
        if (this.runRow == null)
            this.placeHolderCondition.buildRow(this.tbody, this.PLACE_HOLDER_FIELD);
        else {
            this.placeHolderCondition.buildRow(null, this.PLACE_HOLDER_FIELD);
            this.tbody.insertBefore(this.placeHolderCondition.getRow(), this.runRow);
        }
    },
    addCondition: function(wantOR, field, oper, value) {
        if (this.filter.getMaintainPlaceHolder())
            return this.addConditionWithPlaceHolder(wantOR, field, oper, value);
        if (this.placeHolderCondition == null) {
            if (typeof field == "undefined" || field == '') {
                this.newPlaceHolder();
                return null;
            }
        }
        if (typeof field == "undefined")
            return null;
        var condition = new GlideSectionCondition(this, this.queryID);
        this.conditions[this.conditions.length] = condition;
        condition.setOrWanted(wantOR);
        if (this.runRow == null)
            condition.buildRow(this.tbody, field, oper, value);
        else {
            condition.buildRow(null, field, oper, value);
            this.tbody.insertBefore(condition.getRow(), this.runRow);
        }
        return condition;
    },
    addConditionWithPlaceHolder: function (wantOR, field, oper, value) {
        if (this.placeHolderCondition == null) {
            this.newPlaceHolder();
            if (typeof field == "undefined")
                return null;
        }
        if (typeof field == "undefined")
            return null;
        var condition = new GlideSectionCondition(this, this.queryID);
        this.conditions[this.conditions.length-1] = condition;
        this.conditions[this.conditions.length] = this.placeHolderCondition;
        condition.setOrWanted(wantOR);
        condition.buildRow(null, field, oper, value);
        this.tbody.insertBefore(condition.getRow(), this.placeHolderCondition.getRow());
        return condition;
    },
    addRunButton: function() {
        if (this.runRow != null)
            return;
        this.runCondition = new GlideSectionCondition(this, this.queryID);
        this.runCondition.build(this.tbody);
        this.runRow = this.runCondition.getRow();
        this.runRow.basePart = '';
        this.runCondition.setAsRunRow(this.PLACE_HOLDER_FIELD);
    },
    addRunButtonOLD: function() {
        if (this.runRow != null)
            return;
        trNew = celQuery('tr', this.tbody, this.queryID);
        this.runRow = trNew;
        var td = celQuery('td', trNew, this.queryID);
        td.style.width = "100%";
        td.colSpan = 99;
        td.style.textAlign="right";
        td.filterObject = this.filter;
        var image = "<a onclick='runThisFilter(this)'><IMG height='16' width='16' src='images/run.pngx' title='" + this.answer['Run Filter'] + "' alt='" + this.answer['Run Filter'] + "' BORDER='0' />" + this.answer['Run'] + "</a>";
        td.innerHTML = image;
    },
    removeRunButton: function() {
        if (this.runRow == null)
            return;
        this.tbody.removeChild(this.runRow);
        clearNodes(this.runRow);
        this.runRow = null;
    },
    getQueryID: function() {
        return this.queryID;
    },
    getID: function() {
        return this.queryID;
    },
    getRow: function() {
        return this.row;
    },
    getFilterTable: function() {
        return this.tbody;
    },
    setSort: function(b) {
        this.sort = b;
    },
    getName: function() {
        return this.filter.getName();
    },
    getFilter: function() {
        return this.filter;
    },
    getConditionCount: function() {
        return this.conditions.length;
    },
    firstCondition: function(condition) {
        return this.conditions[0] == condition;
    },
    removeCondition: function(id) {
        var i = findInArray(this.conditions, id);
        if (i == null)
            return;
        var condition = this.conditions[i];
        this.conditions.splice(i,1);
        var row = condition.getRow();
        clearNodes(row);
        this.tbody.removeChild(row);
        if (condition == this.placeHolderCondition)
            this.placeHolderCondition = null;
        if ((this.placeHolderCondition != null && this.conditions.length == 1) || this.conditions.length == 0) {
            this.filter.removeSection(this.queryID);
        } else if (i == 0)
            this.conditions[0].makeFirst();
    },
    z: null
};
var GlideSectionCondition = Class.create();
GlideSectionCondition.prototype = {
    initialize: function(section, queryID) {
        this.section = section;
        this.filter = section.getFilter();
        this.queryID = queryID;
        this.id = guid();
        this.wantOR = true;
        this.subConditions = new Array();
        this.field = null;
        this.oper = null;
        this.value = null;
    },
    destroy: function() {
        this.section = null;
        this.filter = null;
        this.row = null;
        this.tbody.conditionObject = null;
        this.tbody = null;
        this.conditionRow.destroy();
        this.actionRow = null;
        for (var i=0; i < this.subConditions.length; i++)
            this.subConditions[i].destroy();
    },
    build: function(parent) {
        trNew = celQuery('tr', parent, this.queryID);
        this.row = trNew;
        trNew.basePart = 'true';
        trNew.conditionObject = this;
        var td = celQuery('td', trNew, this.queryID);
        td.style.width = "100%";
        var table = celQuery('table', td, this.queryID);
        table.cellSpacing = "0px";
        table.cellPadding = "1px";
        table.border = DEFAULT_BORDER;
        if (!this.filter.getConditionsWanted())
            table.className = "wide";
        this.tbody = celQuery('TBODY', table, this.queryID);
        this.tbody.conditionObject = this;
        var first = this.section.firstCondition(this) && !this.isPlaceHolder();
        this.conditionRow = new GlideConditionRow(this, this.queryID, this.wantOR, first);
        var tr = this.conditionRow.getRow();
        this.tbody.appendChild(tr);
        this.actionRow = tr;
        tr.conditionObject = this;
    },
    buildRow: function(parent, field, oper, value) {
        this.field = field;
        this.oper = oper;
        this.value = value;
        this.build(parent);
        this.conditionRow.build(this.field, this.oper, this.value);
    },
    addNewSubCondition: function(field, oper, value) {
        if (field == null || typeof(field) == "undefined") {
            field = this.conditionRow.getField();
            oper = this.conditionRow.getOper();
        }
        var sub = new GlideSubCondition(this, this.queryID);
        sub.buildRow(this.tbody, field, oper, value);
        this.subConditions[this.subConditions.length] = sub;
        var select = sub.getFieldSelect();
        select.style.marginLeft = "10px";
    },
    addLeftButtons: function() {
        this.conditionRow.addLeftButtons();
    },
    getRow: function() {
        return this.row;
    },
    getBody: function() {
        return this.tbody;
    },
    getActionRow: function() {
        return this.actionRow;
    },
    setAsRunRow: function() {
        this.conditionRow.setAsRunRow();
    },
    setOrWanted: function(b) {
        this.wantOR = b;
    },
    remove: function() {
        this.section.removeCondition(this.id);
    },
    removeSub: function(id) {
        var i = findInArray(this.subConditions, id);
        if (i == null)
            return;
        var orc = this.subConditions[i];
        clearNodes(orc.getRow());
        this.tbody.removeChild(orc.getRow());
        this.subConditions.splice(i,1);
    },
    getID: function() {
        return this.id;
    },
    getFilter: function() {
        return this.filter;
    },
    isFirst: function() {
        return this.section.firstCondition(this);
    },
    makeFirst: function() {
        this.conditionRow.makeFirst();
    },
    getName: function() {
        return this.section.getName();
    },
    setPlaceHolder: function(b) {
        this.placeHolder = b;
    },
    isPlaceHolder: function() {
        return this.placeHolder;
    },
    clearPlaceHolder: function() {
        this.section.clearPlaceHolder();
    },
    z: null
};
var GlideSubCondition = Class.create();
GlideSubCondition.prototype = {
    initialize: function(condition, queryID) {
        this.condition = condition;
        this.filter = condition.getFilter();
        this.queryID = queryID;
        this.id = guid();
    },
    destroy: function() {
        this.filter = null;
        this.condition = null;
        if (this.row)
            this.row.destroy();
    },
    buildRow: function(parent, field, oper, value) {
        this.field = field;
        this.oper = oper;
        this.value = value;
        this.row = new GlideConditionRow(this.condition, queryID, false, false);
        var tr = this.row.getRow();
        parent.appendChild(tr);
        tr.conditionObject = this;
        this.row.build(field, oper, value)
    },
    getNameTD: function() {
        return this.row.getNameTD();
    },
    getFieldSelect: function() {
        return this.row.getFieldSelect();
    },
    getRow: function() {
        return this.row.getRow();
    },
    getID: function() {
        return this.id;
    },
    isPlaceHolder: function() {
        return this.condition.isPlaceHolder();
    },
    remove: function() {
        this.condition.removeSub(this.id);
    },
    z: null
};
var GlideConditionRow = Class.create();
GlideConditionRow.prototype = {
    initialize: function(condition, queryID, wantOr, first) {
        this.condition = condition;
        this.filter = condition.getFilter();
        this.first = first;
        this.wantOr = wantOr;
        this.tableName = this.condition.getName();
        this.queryID = queryID;
        var tr = celQuery('tr', null, queryID);
        tr.conditionObject = this.condition;
        tr.rowObject = this;
        this.row = tr;
        this.addAndOrTextCell();
        td = addTD(tr, queryID);
        this.tdName = td;
        td.id = "field";
        tr.tdField = td;
        td = addTD(tr, queryID);
        this.tdOper = td;
        td.id = "oper";
        tr.tdOper = td;
        if (!this.filter.getOpsWanted())
            td.style.display="none";
        td.style.width="99px"; // Safari needs this otherwise the width will be 0px resulting in the value cell sitting atop the oper cell
        td = addTD(tr, queryID);
        this.tdValue = td;
        td.id = "value";
        td.noWrap = true;
        tr.tdValue = td;
        if (this.filter.getTextAreasWanted())
            td.style.width="90%";
        this.addPlusImageCell();
        this.addRemoveButtonCell();
        var msg = new GwtMessage();
        var values = MESSAGES_FILTER_BUTTONS;
        this.answer = msg.getMessages(values);
    },
    destroy: function() {
        this.filter = null;
        this.condition = null;
        if (this.row.handler)
            this.row.handler.destroy();
        this.row.tdOper = null;
        this.row.tdValue = null;
        this.row.tdField = null;
        this.row.conditionObject = null;
        this.row.rowObject = null;
        this.row = null;
        this.tdOper = null;
        this.tdValue = null;
        this.tdName = null;
        if (this.fieldSelect) {
            this.fieldSelect.onchange = null;
            this.fieldSelect = null;
        }
        this.tdOrButton = null;
        this.tdRemoveButton.conditionObject = null;
        this.tdRemoveButton = null;
        this.tdAndOrText = null;
    },
    setAsRunRow: function(field) {
        this.build(field);
        this.tdName.style.visibility = 'hidden';
        this.tdOper.style.visibility = 'hidden';
        this.tdAndOrText.style.visibility = 'hidden';
        this.row.removeChild(this.tdValue);
        this.row.removeChild(this.tdOrButton);
        this.row.removeChild(this.tdRemoveButton);
        clearNodes(this.tdValue);
        clearNodes(this.tdOrButton);
        clearNodes(this.tdRemoveButton);
        var td = celQuery('td', this.row, this.queryID);
        td.style.width = "100%";
        td.filterObject = this.filter;
        var runCode = "runThisFilter(this);";
        if (this.filter.runCode)
            runCode = this.filter.runCode;
        var image = "<a onclick='" + runCode + "'><IMG height='16' width='16' src='images/run.pngx' title='" + this.answer['Run Filter'] + "' alt='" + this.answer['Run Filter'] + "' BORDER='0' />" + this.answer['Run'] + "</a>";
        td.innerHTML = image;
    },
    addAndOrTextCell: function() {
        var td = addTD(this.row, this.queryID);
        td.id="button";
        this.tdAndOrText = td;
        td.style.textAlign="right";
        if (!this.filter.getConditionsWanted())
            td.style.display="none";
    },
    addPlusImageCell: function() {
        var td = addTD(this.row, this.queryID);
        td.style.whiteSpace = "nowrap";
        td.id="button";
        this.tdOrButton = td;
        if (!this.filter.getConditionsWanted())
            td.style.display="none";
    },
    addRemoveButtonCell: function() {
        var td = addTD(this.row, this.queryID);
        td.id = "button";
        this.tdRemoveButton = td;
        td.conditionObject = this.condition;
        if (this.wantOr)
            td.hasOrButton = 'true';
    },
    build: function(field, oper, value) {
        this.field = field;
        this.oper = oper;
        this.value = value;
        var tableName = this.getName();
        var tds = this.row.getElementsByTagName("td");
        this.fieldSelect = _createFilterSelect();
        this.fieldSelect.onchange = this.fieldOnChange.bind(this);
        var sname = tableName.split(".")[0];
        if (this.field != null)
            sname = sname + "." + field;
        addFirstLevelFields(this.fieldSelect, sname, field, this.filter.filterFields.bind(this.filter), null, this.filter.getOpsWanted(), this.filter.onlyRestrictedFields);
        this.tdName.appendChild(this.fieldSelect);
        updateFields(tableName, this.fieldSelect, oper, value, this.filter.includeExtended);
        currentTable = tableName;
        this.addLeftButtons();
        seeIfItHasFilters(tableName);
        return tds;
    },
    fieldOnChange: function() {
        var b = this.condition.isPlaceHolder();
        this.condition.setPlaceHolder(false);
        updateFields(this.getName(), this.fieldSelect, null, null, this.filter.includeExtended);
        if (b) {
            this.condition.setPlaceHolder(false);
            this.showFields();
            this.condition.clearPlaceHolder();
            if (this.condition.isFirst())
                this.makeFirst();
        }
    },
    getNameTD: function() {
        return this.tdName;
    },
    getFieldSelect: function() {
        return this.fieldSelect;
    },
    getField: function() {
        return getSelectedOption(this.fieldSelect).value;
    },
    getOper: function() {
        var s = this.getOperSelect();
        return getSelectedOption(s).value;
    },
    getOperSelect: function() {
        return this.tdOper.getElementsByTagName("select")[0];
    },
    getValueInput: function() {
        return this.tdValue.getElementsByTagName("input")[0];
    },
    getRow: function() {
        return this.row;
    },
    getName: function() {
        return this.tableName;
    },
    showFields: function() {
        this.tdRemoveButton.style.visibility = 'visible';
        this.tdOrButton.style.visibility = 'visible';
        if (!this.first)
            this.tdAndOrText.style.visibility = 'visible';
        this.getOperSelect().disabled = false;
        var cel = this.getValueInput();
        if (cel)
            cel.disabled = false;
    },
    addLeftButtons: function() {
        if (this.wantOr) {
            tdAddOr = this.tdOrButton;
            var fDiv = this.filter.getDiv().id.split("gcond_filters",1);
            var onClick = "addConditionSpec('" + this.tableName + "','" + this.queryID + "','','','','" + fDiv + "')";
            var image = "<a><IMG onclick=" + onClick + " height='16' width='16' src='images/and_text.pngx' title='" + this.answer['Add AND Condition'] + "' alt='" + this.answer['Add AND Condition'] + "' BORDER='0' class='filerTableAction' /></a>";
            image += "<a><IMG onclick='newSubRow(this)' height='16' width='16' src='images/or_text.pngx' title='" + this.answer['Add OR Condition'] + "' alt='" + this.answer['Add OR Condition'] + "' BORDER='0' class='filerTableAction' /></a>";
            tdAddOr.innerHTML = image;
            if (this.condition.isPlaceHolder())
                tdAddOr.style.visibility = 'hidden';
        }
        var td = this.tdRemoveButton;
        var tdMessage = this.tdAndOrText;
        if (this.wantOr) {
            if (this.first || this.condition.isPlaceHolder()) {
                tdMessage.innerHTML = this.answer['and'];
                tdMessage.style.color = tdMessage.style.backgroundColor;
                tdMessage.style.visibility = 'hidden';
            } else
                tdMessage.innerHTML = this.answer['and'];
        } else if (td.parentNode.sortSpec != true)
            tdMessage.innerHTML = this.answer['or'];
        else
            tdMessage.style.display = 'none';
        tdMessage.style.width = DEFAULT_WIDTH;
        td.style.width = DEFAULT_WIDTH;
        var id = 'r' + guid();
        td.id = id;
        var js = "deleteFilterByID('" + this.getName() +"','" +id+ "');"
        var swap = 'images/closex_hover.gifx'
        var src = 'images/closex.gifx';
        td.innerHTML = '<a><IMG id="img_' + id + '" src="' + src  + '" alt="' + this.answer['Delete'] + '" title="' + this.answer['Delete'] + '" BORDER="0" onclick="'  + js +  '" class="filerTableAction" /></a>';
        td.childNodes[0].childNodes[0].onmouseover = swapImage("img_" + id, swap);
        td.childNodes[0].childNodes[0].onmouseout = swapImage("img_" + id, src);
        if (!this.condition.isPlaceHolder())
            return;
        if (!this.filter.defaultPlaceHolder)
            return;
        if (this.filter.getMaintainPlaceHolder() || this.filter.singleCondition())
            td.style.visibility = 'hidden';
    },
    makeFirst: function() {
        var tdMessage = this.tdAndOrText;
        tdMessage.innerHTML = '';
        tdMessage.innerHTML = this.answer['and'];
        tdMessage.style.color = tdMessage.style.backgroundColor;
        tdMessage.style.visibility = 'hidden';
        tdMessage.style.width = DEFAULT_WIDTH;
    },
    z: null
};
var GlideSortSection = Class.create();
GlideSortSection.prototype = {
    initialize: function(filter) {
        this.filter = filter;
        this.locateSection();
    },
    destroy: function() {
        this.filter = null;
        this.section = null;
        this.rowTable = null;
    },
    locateSection: function() {
        this.section = null;
        this.rowTable = null;
        var divRows = this.filter.getDiv().getElementsByTagName("tr");
        for (var i = 0; i < divRows.length; i++ ) {
            var rowTR = divRows[i];
            if (rowTR.sortRow == 'true') {
                this.section = rowTR.rowObject;
                this.rowTable = this.section.getFilterTable();
                this.queryID = this.section.getQueryID();
                break;
            }
        }
        if (!this.section) {
            section = new GlideFilterSection(this.filter);
            section.setSort(true);
            this.queryID = section._setup(true);
            this.section = section;
            this.rowTable = section.getFilterTable();
            this.section.getRow().sortRow = 'true';
        }
    },
    addField: function(field, oper) {
        this.locateSection();
        if (!oper)
            oper = "ascending";
        var condition = this.section.addSortCondition(false);
        var row = condition.getRow();
        row.sortSpec = true;
        row = condition.getActionRow();
        row.sortSpec = true;
        var tds = row.getElementsByTagName("td");
        var fSelect = addFields(this.getName(), field, true, this.includeExtended);
        var tdName = row.tdField;
        tdName.appendChild(fSelect);
        updateFields(this.getName(), fSelect, oper, null, this.includeExtended)
        condition.addLeftButtons();
        seeIfItHasFilters(this.getName());
    },
    getSection: function() {
        return this.section;
    },
    getName: function() {
        return this.filter.getName();
    },
    getID: function() {
        return this.queryID;
    },
    removeRunButton: function() {
        this.section.removeRunButton();
    },
    addRunButton: function() {
        this.section.addRunButton();
    },
    z: null
};