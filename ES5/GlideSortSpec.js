var GlideSortSpec = Class.create();
GlideSortSpec.prototype = {
    initialize: function(name, ascending) {
        this.field = name;
        this.ascending = ascending;
    },
    getName: function() {
        return this.field;
    },
    isAscending: function() {
        return this.ascending;
    },
    z: null
};
function newQueryRow(name) {
    if (setup(name) == false)
        return null;
    var fDiv = getThing(currentTable,'gcond_filters');
    var section = fDiv.filterObject.addSection();
    return section.getQueryID();
}
function addSortSpec(name, fField, fOper) {
    if (setup(name) == false)
        return null;
    var fDiv = getThing(currentTable,'gcond_filters');
    fDiv.filterObject.addSortRow(fField, fOper);
    _frameChanged();
}
function addCondition(name) {
    if (setup(name) == false)
        return null;
    var fDiv = getThing(currentTable,'gcond_filters');
    fDiv.filterObject.addConditionRowToFirstSection();
    _frameChanged();
}
function addConditionSpec(name, queryID, field, oper, value, fDiv) {
    if (firstTable == null)
        firstTable = currentTable;
    if (setup(name) == false)
        return null;
    var divName = "gcond_filters";
    if(fDiv != null)
        divName = fDiv + "gcond_filters";
    var fDiv = getThing(currentTable, divName);
    var filter = fDiv.filterObject;
    if (filter == null)  {
        filter = new GlideFilter(currentTable, "");
        if (typeof field == "undefined")
            return;
    }
    var answer =  filter.addConditionRow(queryID, field, oper, value);
    _frameChanged();
    return answer;
}
function newSubRow(elBut) {
    var butTD = elBut.parentNode;
    var butTR = butTD.parentNode;
    var butTable = butTR.parentNode;
    butTable.conditionObject.addNewSubCondition();
    _frameChanged();
}
function findInArray(a, searchID) {
    for (var i = 0; i < a.length; i++) {
        var condition = a[i];
        if (condition.getID() == searchID)
            return i;
    }
    return null;
}
function celQuery(name, parent, queryID) {
    var e = cel(name);
    if (parent)
        parent.appendChild(e);
    e.queryID = queryID;
    return e;
}
function addTD(row, queryID) {
    var td = celQuery('td', row, queryID);
    td.valign = "top";
    td.style.verticalAlign="top";
    return td;
}
function runThisFilter(atag) {
    var filterObj = atag.parentNode.filterObject;
    var tableName = filterObj.getName();
    if (runFilterHandlers[tableName]) {
        var filter = getFilter(tableName);
        runFilterHandlers[tableName](tableName, filter);
        return;
    }
    var msg = new GwtMessage();
    var values = ['Running Filter', 'Running'];
    var answer = msg.getMessages(values);
    var runImg = atag.getElementsByTagName("img")[0];
    if(runImg.title == "Run Filter") {
        setImage(runImg, "images/loading_anim2.gifx");
        runImg.title = answer['Running Filter'] + "...";
        runImg.alt = answer['Running Filter'] + "...";
        runImg.nextSibling.nodeValue = answer['Running'] + "...";
    }
    filterObj.runFilter();
}
function buildURL(tableName, query) {
    var url = (tableName.split("."))[0] + "_list.do?sysparm_query=" + query;
    var view = gel('sysparm_view');
    if (view) {
        view = view.value;
        url += '&sysparm_view=' + view;
    }
    var refQuery = gel('sysparm_ref_list_query');
    if (refQuery)
        url += "&sysparm_ref_list_query=" + refQuery.value;
    var target = gel('sysparm_target');
    if (target) {
        target = target.value;
        url += '&sysparm_target=' + target;
        url += '&sysparm_stack=no';
        var e = gel("sysparm_reflist_pinned");
        if (e)
            url += '&sysparm_reflist_pinned=' + e.value;
    }
    return url;
}
function createCondFilter(tname, query, fieldName, restrictedFields, includeExtended) {
    noOps = false;
    noSort = false;
    noGroup = true;
    noConditionals = false;
    useTextareas = false;
    var filterObj = new GlideFilter(tname);
    if (restrictedFields) {
        filterObj.setRestrictedFields(restrictedFields);
        filterObj.setOnlyRestrictedFields(true);
    }
    filterObj.setIncludeExtended(includeExtended);
    filterObj.getDiv().initialQuery = query;
    filterObj.setQuery(query);
    g_form.registerHandler(fieldName, filterObj);
}