//include sys_report_condition.js
function addDateFields(tableName, fValue, isSort, isGroup, sort) {
    setup(tableName);
    var s = _createFilterSelect();
    if (!isSort)
        s.onchange =  function() {
            updateFields(tableName, this);
        };
    addFirstLevelFieldsWithoutRef(s, tableName, null, fValue, dateFilter);
    return s;
}
function addNumericFields(tableName, fValue, isSort, isGroup, sort) {
    setup(tableName);
    var s = _createFilterSelect();
    if (!isSort)
        s.onchange =  function() {
            updateFields(tableName, this);
        };
    addFirstLevelFieldsWithoutRef(s, tableName, null, fValue, numericFilter);
    return s;
}
function addStackFields(tableName, fValue, isSort, isGroup, sort) {
    setup(tableName);
    var s = _createFilterSelect();
    if (!isSort)
        s.onchange =  function() {
            updateFields(tableName, this);
        };
    addFirstLevelFieldsWithoutRef(s, tableName, null, fValue, stackFilter);
    return s;
}
function addTrendFields(tableName, fvalue) {
    return addFilteredFields(tableName, trendFilter, fvalue);
}
function addSumFields(tableName, fvalue) {
    return addFilteredFields(tableName, sumFilter, fvalue);
}
function trendFilter(item) {
    var name = item.getName();
    if (name.indexOf(".")  > -1 )
        return false;
    var type  = item.getType();
    if (dateTypes[type])
        return true;
    return false;
}
function sumFilter(item) {
    var name = item.getName();
    if (name.indexOf(".")  > -1 )
        return false;
    var type  = item.getType();
    if (numericTypes[type])
        return true;
    if (type == 'glide_duration' || type == 'timer')
        return true;
    return false;
}
function numericFilter(item) {
    var name = item.getName();
    if (name.indexOf(".")  > -1 )
        return false;
    var type  = item.getType();
    if (numericTypes[type])
        return true;
    return false;
}
function stackFilter(item) {
    var name = item.getName();
    if (name.indexOf(".")  > -1 )
        return false;
    var type  = item.getType();
    if (type == 'reference')
        return true;
    if (type == 'boolean')
        return true;
    var choice = item.getChoice();
    if (choice == 1 || choice == 3)
        return true;
    return false;
}
function dateFilter(item) {
    var name = item.getName();
    if (name.indexOf(".")  > -1 )
        return false;
    var type  = item.getType();
    if (dateTypes[type] || type == 'glide_duration')
        return true;
    var choice = item.getChoice();
    if (choice == 1 || choice == 3)
        return false;
    if (item.isNumber())
        return true;
    return false;
}
function addFilteredFields(tableName, filter, fvalue) {
    setup(tableName);
    var s = _createFilterSelect();
    addFirstLevelFieldsWithoutRef(s, tableName, null, fvalue, filter);
    return s;
}
function addFirstLevelFieldsWithoutRef(s, target, prefix, fValue, filterMethod) {
    var sgotShowRelated = gotShowRelated;
    var sshowRelated = showRelated;
    var sfilterExpanded = filterExpanded;
    gotShowRelated = false;
    showRelated = "no";
    filterExpanded = false;
    addFirstLevelFields(s, target, fValue, filterMethod);
    gotShowReleated = sgotShowRelated;
    showRelated = sshowRelated;
    filterExpanded = sfilterExpanded;
}
function addFirstLevelFieldsWithRef(s, target, prefix, fValue, filterMethod) {
    var sgotShowRelated = gotShowRelated;
    var sshowRelated = showRelated;
    gotShowRelated = false;
    showRelated = "yes";
    addFirstLevelFields(s, target, fValue, filterMethod);
    if (wantsNoneOption(gel('sysparm_type').value))
        addNoneOption(s);
    gotShowReleated = sgotShowRelated;
    showRelated = sshowRelated;
}
function groupFieldSelected(name, event) {
    if (setup(name) == false)
        return;
    name = currentTable;
    var select = event;  // browser bitching, can't we just all get along?
    var o = select.options[select.selectedIndex];
    var fieldName = o.value;
    name = name.split(".")[0];
    var idx = fieldName.indexOf("...");
    if (idx != -1) {
        var f = fieldName.substring(0, idx);
        var wantRelated = 'yes';
        if (fieldName == '...Remove Related Fields...')
            wantRelated = 'no';
        if (f != name)
            f = name + "." + f;
        f = f + ".";
        setPreference("filter.show_related", wantRelated);
        setTimeout( function() {
            addFirstLevelFieldsWithRef(select, f, f, '', reportGroupByFilter)
        }, 1);
    }
}
function getGroupFields(tableName, fValue) {
    setup(tableName);
    var s = cel('select');
    var sname = tableName.split(".")[0];
    if (fValue != null && fValue != '')
        sname = sname + "." + fValue;
    addFirstLevelFieldsWithRef(s, sname, null, fValue, reportGroupByFilter);
    return s;
}
function reportGroupByFilter(item) {
    if (item.canGroup())
        return true;
    if (item.isDate())
        return true;
    return false;
}
function reportNewRow(id) {
    var e = gel('gcond_filters');
    var filterObj = e.filterObject;
    filterObj.addConditionRowToFirstSection();
}
function reportNewSection(id) {
    var e = gel('gcond_filters');
    var filterObj = e.filterObject;
    filterObj.addConditionRow();
}