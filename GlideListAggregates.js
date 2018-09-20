/**
* Manage the aggregate values for GlideListEditor.js
*/
var GlideListAggregates = Class.create();
GlideListAggregates.prototype = {
    initialize: function(tableElementDOM) {
        this.aggregates = {};
        this.tableElementDOM = tableElementDOM;
        this._initAggregates();
    },
    /**
* Get the aggregate object for the specified field and type.
* Return null if there is no aggregate
*/
    getAggregate: function(fieldName, type) {
        var agg = this.aggregates[fieldName + ":" + type];
        if (!agg)
            return null;
        return agg;
    },
    /**
* Get the aggregate value for the specified field and type.
* Return null if there is no aggregate
*/
    getAggregateValue: function(fieldName, type) {
        var agg = this.aggregates[fieldName + ":" + type];
        if (!agg)
            return null;
        return agg.value;
    },
    /**
* Get the element (it is a span) that contains the aggregate for the specified
* field and type.  Return null if there is no aggregate
*/
    getAggregateElement: function(fieldName, type) {
        var agg = this.getAggregate(fieldName, type);
        if (!agg)
            return null;
        var td = this.tableElementDOM.rows[agg.rowNdx].cells[agg.colNdx];
        var spans = td.getElementsByTagName("SPAN");
        for (var spanNdx = 0; spanNdx < spans.length; spanNdx++) {
            var span = spans[spanNdx];
            if (!hasClassName(span, "aggregate_value"))
                continue;
            var aggtype = getAttributeValue(span, "aggregate_type");
            if (aggtype == type)
                return span;
        }
        return null;
    },
    /**
* Get the list of fields that have aggregates
*/
    getAggregateFields: function() {
        return this.aggregateFields;
    },
    /**
* Update the aggregates when a field value changes
*/
    updateAggregates: function(fieldName, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        this._updateAggregate(fieldName, "MIN", oldValue, newValue);
        this._updateAggregate(fieldName, "MAX", oldValue, newValue);
        this._updateAggregate(fieldName, "SUM", oldValue, newValue);
        this._updateAggregate(fieldName, "AVG", oldValue, newValue, 0);
    },
    /**
* Update the aggregates when a new field is added (such as an add row operation)
*/
    addToAggregates: function(fieldName, value) {
        if (value != "") {
            this._updateAggregate(fieldName, "MIN", null, value);
            this._updateAggregate(fieldName, "MAX", null, value);
            this._updateAggregate(fieldName, "SUM", null, value);
        }
        this._updateAggregate(fieldName, "AVG", null, value, 1);
    },
    /**
* Update the aggregates when a field is deleted (such as a delete row operation)
*/
    removeFromAggregates: function(fieldName, value) {
        if (value != "") {
            this._updateAggregate(fieldName, "MIN", value, null);
            this._updateAggregate(fieldName, "MAX", value, null);
            this._updateAggregate(fieldName, "SUM", value, null);
        }
        this._updateAggregate(fieldName, "AVG", value, null, -1);
    },
    /**
* Adjust our row indexes for the aggregates in response to a row being added/deleted from list
*/
    rowCountChanged: function(increment) {
        for (var k in this.aggregates)
            this.aggregates[k].rowNdx += increment;
    },
    /**
* Read in all of the aggregates that are on the list and save them in this.aggregates
*/
    _initAggregates: function() {
        var fields = {};
        this.aggregateRow = -1;
        this.aggregates = {};
        this.aggregateFields = [];
        for (var rowNdx = 0; rowNdx < this.tableElementDOM.rows.length; rowNdx++) {
            var row = this.tableElementDOM.rows[rowNdx];
            if (!hasClassName(row, "aggregate"))
                continue;
            for (var colNdx = 0; colNdx < row.cells.length; colNdx++) {
                var spans = row.cells[colNdx].getElementsByTagName("SPAN");
                for (var spanNdx = 0; spanNdx < spans.length; spanNdx++) {
                    var span = spans[spanNdx];
                    if (!hasClassName(span, "aggregate_value"))
                        continue;
                    var type = getAttributeValue(span, "aggregate_type");
                    if (!type)
                        continue;
                    var aggregate = {};
                    aggregate.type = type;
                    aggregate.count = getAttributeValue(span, "aggregate_count");
                    aggregate.value = getAttributeValue(span, "aggregate_value");
                    aggregate.rowNdx = rowNdx;
                    aggregate.colNdx = colNdx;
                    var fieldName = getAttributeValue(span, "aggregate_field");
                    this.aggregates[fieldName + ":" + type] = aggregate;
                    if (!fields[fieldName]) {
                        fields[fieldName] = true;
                        this.aggregateFields.push(fieldName);
                    }
                }
            }
        }
    },
    _updateAggregate: function(fieldName, type, oldValue, newValue, countChange) {
        var agg = this.getAggregate(fieldName, type);
        if (!agg)
            return;
        var aggValue = '';
        if (agg.type == "MIN")
            aggValue = this._updateAggregateMin(agg, oldValue, newValue);
        else if (agg.type == "MAX")
            aggValue = this._updateAggregateMax(agg, oldValue, newValue);
        else if (agg.type == "SUM")
            aggValue = this._updateAggregateTotal(agg, oldValue, newValue);
        else if (agg.type == "AVG")
            aggValue = this._updateAggregateAverage(agg, oldValue, newValue, countChange);
        this._setAggregate(agg, fieldName, type, aggValue, countChange);
    },
    _setAggregate: function(agg, fieldName, type, aggValue, countChange) {
        if (aggValue != null) {
            var aggSpan = this.getAggregateElement(fieldName, type);
            if (!aggSpan)
                return;
            agg.value = aggValue;
            setAttributeValue(aggSpan, "aggregate_value", agg.value);
            if ((type == "SUM") || (type == "AVG"))
                aggSpan.innerHTML = this._format(agg.value);
            else
                aggSpan.innerHTML = aggValue;
            if (countChange)
                setAttributeValue(aggSpan, "aggregate_count", agg.count);
        }
    },
    _updateAggregateMin: function(agg, oldValue, newValue) {
        if (agg.value == "?")
            return null;
        if ((newValue != null) && (newValue < agg.value))
            return newValue;
        if ((oldValue != null) && (oldValue == agg.value))
            return "?";
        return null;
    },
    _updateAggregateMax: function(agg, oldValue, newValue) {
        if (agg.value == "?")
            return null;
        if ((newValue != null) && (newValue > agg.value))
            return newValue;
        if ((oldValue != null) && (oldValue == agg.value))
            return "?";
        return null;
    },
    _updateAggregateTotal: function(agg, oldValue, newValue) {
        if (!oldValue || isNaN(oldValue))
            oldValue = '0';
        if (!newValue || isNaN(newValue))
            newValue = '0';
        if (isNaN(agg.value))
            return;
        oldValue = new Number(oldValue);
        newValue = new Number(newValue);
        var total = new Number(agg.value);
        total += (newValue - oldValue);
        total = parseFloat(total.toFixed(this._precision(agg.value, oldValue, newValue))); // Set to maximum required precision
        return total;
    },
    /* Calculate the precision require for the total */
    _precision: function(total, oldValue, newValue) {
        var len = Math.max (this._precisionLength(total),this._precisionLength(oldValue),this._precisionLength(newValue));
        return len;
    },
    /* calculate the precision for an individual value */
    _precisionLength: function(value) {
        value = parseFloat(value);
        var precisionLen = "";
        if (value.toString().indexOf(".") >= 0) {
            precisionLen = value.toString().substr(value.toString().indexOf(".")+1, value.toString().length);
        }
        return precisionLen.length;
    },
    _updateAggregateAverage: function(agg, oldValue, newValue, countChange) {
        if (!oldValue || isNaN(oldValue))
            oldValue = '0';
        if (!newValue || isNaN(newValue))
            newValue = '0';
        if (isNaN(agg.value) || isNaN(agg.count))
            return;
        agg.count = new Number(agg.count);
        var value = new Number(agg.value);
        var total = (value * agg.count);
        agg.count += countChange;
        if (!agg.count)
            return 0;
        oldValue = new Number(oldValue);
        newValue = new Number(newValue);
        total += (newValue - oldValue);
        return this._format(total / agg.count);
    },
    _format: function(num) {
        if (isNaN(num))
            return num;
        num = (parseInt((num + .005) * 100));
        return num / 100;
    },
    type: 'GlideListAggregate'
}