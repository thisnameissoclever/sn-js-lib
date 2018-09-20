/**
* Provide a GlideRecord-like interface into the list editor so that client scripts written
* against the 'save_with_form' list editing lists can be easily modified.
*
* insert, update and delete operations against this class are reflected in the editable list
* instead of being sent to the server.
*
* Currently, this implementation does not support addQuery since we have not implemented
* the client-side evaluation of query conditions in support of the addQuery operations.
* However, query() is still required before iterating thru the records of a save_with_form
* editable list.
*
* TODO: add client-side support for evaluating the query condition (like in ui_policy.js)
*/
var GlideListRecord = Class.create();
GlideListRecord.prototype = {
    initialized : false,
    initialize: function(glideList, tableName) {
        if (glideList)
            this.glideList = glideList;
        this.currentRow = -1;
        if (tableName)
            this.tableName = tableName;
        this.sysIds = [];
        this.displayValues = {};
        if (this.initialized == false)
            this._setIgnoreNames();
        else
            this._clearValues();
        this.initialized = true;
    },
    addQuery: function() {
        alert('GlideListRecord.addQuery is not currently supported');
    },
    deleteRecord: function() {
        var operation = this.glideList.getRecordOperation(this["sys_id"]);
        if (operation == "delete" || operation == "delete_pending")
            return;
        this.glideList.deleteRowToggle(this["sys_id"]);
    },
    get: function(id) {
        this._clearValues();
        this._initRows();
        for (var i = 0; i < this.sysIds.length; i++) {
            if (id == this.sysIds[i]) {
                this.sysIds = [id];
                this._loadRow(0);
                return true;
            }
        }
        this.sysIds = [];
        return false;
    },
    getEncodedQuery: function() {
        alert('GlideListRecord.addQuery is not currently supported');
    },
    getTableName: function() {
        return this.tableName;
    },
    gotoTop : function() {
        this.currentRow = -1;
    },
    hasNext: function() {
        return (this.currentRow + 1 < this.sysIds.length);
    },
    insert: function() {
        var values = {};
        var dspValues = {};
        for (var xname in this) {
            if (this.ignoreNames[xname])
                continue;
            values[xname] = this[xname];
        }
        for (var xname in this.displayValues)
            dspValues[xname] = this.displayValues[xname];
        this.glideList.addRowWithValues(values, dspValues);
    },
    next: function() {
        if (!this.hasNext())
            return false;
        this.currentRow++;
        this._loadRow(this.currentRow);
        return true;
    },
    query: function() {
        this._initRows();
        this.currentRow = -1;
        return;
    },
    setDisplayValue: function(fieldName, dsp) {
        this.displayValue[fieldName] = dsp;
    },
    update: function() {
        var sysId = this['sys_id'];
        var record = this.glideList.getRecord(sysId);
        if (!record)
            return;
        for (var xname in this) {
            if (this.ignoreNames[xname])
                continue;
            if (xname == 'sys_id')
                continue;
            var v = this[xname];
            var dsp = this.displayValues[xname];
            var field = record.getField(xname);
            if (!field)
                field = record.addField(xname);
            var changed = false;
            if (field.getValue() != v) {
                this.glideList.setValue(sysId, xname, v);
                changed = true;
            }
            if ((typeof dsp != 'undefined') && (field.getDisplayValue() != dsp)) {
                this.glideList.setDisplayValue(sysId, xname, dsp);
                changed = true;
            }
            if (changed)
                this.glideList.renderValue(sysId, xname);
        }
        this.glideList.saveValuesInForm();
    },
    _clearValues: function() {
        this.displayValues = {};
        for (var xname in this) {
            if (this.ignoreNames[xname] && this.ignoreNames[xname] == true)
                continue;
            delete this[xname];
        }
    },
    _initRows: function() {
        this.sysIds = [];
        for (var id in this.glideList.records) {
            if (id == '-1')
                continue;
            var record = this.glideList.records[id];
            if (record.operation == "delete" || record.operation == "delete_pending")
                continue;
            this.sysIds.push(id);
        }
    },
    _loadRow: function(ndx) {
        this._clearValues();
        if ((ndx < 0) || (ndx >= this.sysIds.length))
            return;
        var record = this.glideList.getRecord(this.sysIds[ndx]);
        if (!record)
            return;
        this['sys_id'] = this.sysIds[ndx];
        var fields = record.getFields();
        for (var fname in fields) {
            if (fname.indexOf('.') != -1)
                continue;
            var field = fields[fname];
            this[fname] = field.getValue();
            this.displayValues[fname] = field.getDisplayValue();
        }
    },
    _setIgnoreNames: function() {
        this.ignoreNames = [];
        for(var xname in this) {
            this.ignoreNames[xname] = true;
        }
    },
    z: 'GlideListRecord'
};