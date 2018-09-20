//defer classes/Select.js
/**
* Manage a <select> and its <option>s
*/
var Select = Class.create({
    initialize: function(select) {
        this.select = $(select);
    },
    addOption: function(value, label) {
        addOption(this.select, value, label);
    },
    addOptions: function(glideRecord, nameField, valueField) {
        if (!valueField)
            valueField = 'sys_id';
        if (!nameField)
            nameField = 'name';
        while (glideRecord.next())
            addOption(this.select, glideRecord[valueField], glideRecord[nameField]);
    },
    clear: function() {
        this.select.options.length = 0;
    },
    getSelect: function() {
        return this.select;
    },
    getValue: function() {
        return this.select.options[this.select.selectedIndex].value;
    },
    selectValue: function(value) {
        this.select.selectedIndex = -1;
        var options = this.select.options;
        for (oi = 0; oi < options.length; oi++) {
            var option = options[oi];
            var optval = option.value;
            if (optval != value)
                continue;
            option.selected = true;
            this.select.selectedIndex = oi;
        }
    },
    contains: function(value) {
        var options = this.select.options;
        for (oi = 0; oi < options.length; oi++) {
            if (options[oi].value == value)
                return true;
        }
        return false;
    },
    getClassName: function() {
        return "SelectList";
    }
});
function addOption(select, value, label, selected) {
    var o;
    if (select.multiple == true) {
        o = new Option(label, value, true, selected);
    } else
        o = new Option(label, value);
    select.options[select.options.length] = o;
    if (select.multiple != true && selected)
        select.selectedIndex = select.options.length - 1;
    return o;
}
function addOptionAt(select, value, label, idx) {
    for (var i = select.options.length; i > idx; i--) {
        var oldOption = select.options[i - 1];
        select.options[i] = new Option(oldOption.text, oldOption.value);
        if (oldOption.id)
            select.options[i].id = oldOption.id;
        if (oldOption.style.cssText)
            select.options[i].style.cssText = oldOption.style.cssText;
    }
    var o = new Option(label, value);
    select.options[idx] = o;
    return o;
}
function getSelectedOption(select) {
    if ((select.multiple == true) || (select.selectedIndex < 0))
        return null;
    return select.options[select.selectedIndex];
}