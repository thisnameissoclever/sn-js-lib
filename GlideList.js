//include classes/GlideList.js
/**
* API for messing with a list
*
* Note: this is different than the GlideListEditor class that handles list editing
*
* There are a few ways to submit a form:
*    .action(element)
*           this submits the form based on an action (such as a button or list menu action)
*
*    .submit(additionalValues)
*           submit the form, with optional name=value pairs added to the form as hidden input fields
*
*    .redirect(table, parms)
*           do a window.location = url where the url is table_list.do?parms
*
* TODO: Combine this class with GlideListEditor so that we end up with one class that manages all list operations
*/
/*
* ----------------------------------------------------------------------------
* These are the static methods used to get a GlideList object for a list
* ----------------------------------------------------------------------------
*/
var GlideLists = {};
/*
* ----------------------------------------------------------------------------
* The GlideList class
* ----------------------------------------------------------------------------
*/
var GlideList = Class.create(GwtObservable,{
    IGNORED_NAMES: {
        sys_skiptext : true
    },
    initialize: function(form) {
        this.form = $(form);
        this.existingElements = {};
        this.listID = getAttributeValue(this.form, 'glide_list_id');
        GlideLists[this.listID] = this;
        this.lastChecked = null;
    },
    destroy: function() {
        this.form = null;
        this.existingElements = {};
        this.lastChecked = null;
    },
    /**
* @return is the list FORM a valid FORM for the list?
*/
    isValid: function() {
        if (this.form)
            return true;
        return false;
    },
    /**
* Get the sys_ids for the items that are checked in the list
*/
    getChecked: function() {
        var ids = [];
        var elements = this.form.getElementsByTagName("input");
        for (i = 0; i < elements.length; i++) {
            if (elements[i].type != "checkbox")
                continue;
            var v = elements[i];
            if (v.id.startsWith("ni:") && v.checked) {
                var id = v.id.substring(3);
                var skip = v.name.substring(0, 4);
                if (skip == "SKIP")
                    continue;
                if (id == "all")
                    continue;
                ids.push(id);
            }
        }
        this.checkedIds = ids.join(",");
        return this.checkedIds;
    },
    /**
* Get the element with the specified id for this list
*/
    getElement: function(id) {
        var e = this.form[id];
        if (e && typeof e.tagName == 'undefined') {
            e = e[0];
        }
        return e;
    },
    /**
* Get the value of an element with the specified id for this list
*/
    getValue: function(id) {
        var e = this.getElement(id);
        if (!e)
            return null;
        return Form.Element.getValue(e);
    },
    /**
* Get the value of an element with the specified id for this list as a number
*/
    getNumber: function(id) {
        var e = this.getElement(id);
        if (!e)
            return null;
        var num = parseInt(Form.Element.getValue(e), 10);
        if (isNaN(num))
            num = 0;
        return num;
    },
    /**
* Get all of the values for which the named element exists
* returning the found values in the passed in object 'parms'
*/
    getValues: function(/*{}*/ parms, /*[]*/ fields) {
        if (!fields)
            return;
        for (var i = 0; i < fields.length; i++) {
            var n = fields[i];
            var e = this.getElement(n);
            if (e)
                parms[n] = Form.Element.getValue(e);
        }
    },
    /**
* Set the value of an element with the specified id for this list
*
* Note: all this does is find the element and set its .value - it will not
* work for select elements
*/
    setValue: function(id, value) {
        var e = this.getElement(id);
        if (!e)
            return;
        e.value = value;
    },
    /**
* Execute a list action by setting up the form and submitting it
*/
    action: function(/*optional*/ element, /*optional*/ securityChecksComplete) {
        if (!this.isValid())
            return false;
        if (this._isSubmitted())
            return false;
        this.securityChecksComplete = securityChecksComplete;
        this._createForm();
        this.form.sys_action.value = "";
        if (element) {
            this._setAction(element);
        }
        if (this._runHandlers(element) === false) {
            this._cleanup();
            return false;
        }
        this._submitForm();
        this._cleanup();
        return false;
    },
    /**
* Submit the form, with optional name=value pairs added to the form as hidden input fields
*
* If method is specified, it is used as the form submit method
*/
    submit: function(/*optional {}*/ additionalValues, /*optional*/ method, /*optional*/ action, /*optional*/ target) {
        if (action)
            this.form.action = action;
        if (target)
            this.form.target = target;
        if (additionalValues) {
            this._createForm();
            for (var n in additionalValues)
                this.addToForm(n, additionalValues[n]);
        }
        this._submitForm(method);
        this._cleanup();
        return false;
    },
    /**
* Do a window.location = url where the url is table_list.do?parms
*/
    redirect: function(tableName, /*{}*/ parms) {
        var url = new GlideURL(tableName + '_list.do');
        for (var n in parms)
            url.addParam(n, parms[n]);
        var url = url.getURL();
        window.location = url;
    },
    /**
* Use the parameters to make an ajax call with an optional callback and arguments
*/
    ajax: function(/*{}*/parms, /*function*/callback, arguments) {
        var url = new GlideURL(this.form.action);
        if (parms) {
            for (var n in parms)
                url.addParam(n, parms[n]);
        }
        var postString = url.getQueryString();
        serverRequestPost(this.form.action, postString, callback, arguments);
    },
    /**
* Change the number of rows per page and redisplay the list
*/
    changeRowCount: function(rowSelect, userPrefName) {
        var parms = {};
        var rows = rowSelect.options[rowSelect.selectedIndex].value;
        parms[userPrefName] = rows;
        parms.sys_action = '';
        this.submit(parms);
    },
    /**
* Add a name=value pair to the form as a hidden input element
*/
    addToForm: function(n, v) {
        if (this.existingElements[n])
            this.existingElements[n].value = v;
        else {
            var opt = document.createElement('input');
            opt.type = "HIDDEN";
            opt.name = n;
            opt.id = n;
            opt.value = v;
            this.form.appendChild(opt);
            this.existingElements[n] = opt;
        }
    },
    /*
* ------------------------------------------------------------------------
* List query handling
* ------------------------------------------------------------------------
*/
    groupByChange: function(groupByElement) {
        var query = '';
        var queryElem = this.getElement('sysparm_query');
        if (queryElem)
            query = queryElem.value;
        this.query(query, groupByElement);
    },
    runQuery: function(queryString) {
        this.query(queryString, this.getElement('select_groupby'));
    },
    query: function(queryString, groupByElement) {
        if (groupByElement) {
            queryString = this.cleanQuery(queryString, false, true);
            if (groupByElement.value != '') {
                if (queryString != '')
                    queryString += '^';
                queryString += 'GROUPBY' + groupByElement.value;
            }
        }
        var tableName = this.getValue('sys_target').split('.')[0];
        var targetField = this.getValue('sysparm_target');
        var parms = {};
        parms.sysparm_query = queryString;
        parms.sysparm_view = this.getValue('sysparm_view');
        if (targetField)
            parms.sysparm_target = targetField;
        this.redirect(tableName, parms);
    },
    /**
* Remove the ORDERBY and/or GROUPBY terms within a query and return the cleaned result
*/
    cleanQuery: function(queryString, orderByFlag, groupByFlag) {
        if (!queryString)
            return "";
        var q = queryString.split('^');
        var clean = [];
        for (var i = 0; i < q.length; i++) {
            var term = q[i];
            if (orderByFlag && term.indexOf("ORDERBY") == 0)
                continue;
            if (groupByFlag && term.indexOf("GROUPBY") == 0)
                continue;
            clean.push(term);
        }
        return clean.join("^");
    },
    /*
* ------------------------------------------------------------------------
* List checkbox handling
* ------------------------------------------------------------------------
*/
    _getCheckboxes: function() {
        var cBoxes = [];
        var inputs = this.form.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (inputs[i].type == "checkbox" && inputs[i].name.substring(0, 3) == "ni:")
                cBoxes.push(input);
        }
        return cBoxes;
    },
    setAllCheckboxes: function(checkbox) {
        var cBoxes = this._getCheckboxes();
        for (var i = 0; i < cBoxes.length; i++)
            cBoxes[i].checked = checkbox.checked;
        this.lastChecked = null;
    },
    _setTheAllCheckbox: function(flag) {
        var checkbox = this.getElement("setall");
        if (checkbox)
            checkbox.checked = flag;
    },
    listCheckbox: function(checkbox, evt) {
        evt = getEvent(evt);
        if (!evt)
            return;
        var checking = checkbox.checked;
        if (!checking) {
            this._setTheAllCheckbox(false);
            this.lastChecked = null;
            return;
        }
        var cBoxes = this._getCheckboxes();
        if (evt.shiftKey && this.lastChecked != checkbox) {
            var start = -1;
            var end = -1;
            for (var i = 0; i < cBoxes.length; i++) {
                var cBox = cBoxes[i];
                if (cBox == this.lastChecked)
                    start = i;
                if (cBox == checkbox)
                    end = i;
            }
            if (start > end) {
                var t = start;
                start = end;
                end = t;
            }
            for (var i = start; i < end; i++) {
                cBoxes[i].checked = true;
            }
        }
        this.lastChecked = checkbox;
        var allChecked = true;
        for (var i = 0; i < cBoxes.length; i++) {
            if (!cBoxes[i].checked) {
                allChecked = false;
                break;
            }
        }
        if (allChecked)
            this._setTheAllCheckbox(true);
    },
    /**
* Prevent double submits
*/
    _isSubmitted: function() {
        return g_submitted;
    },
    /**
* Create a form from the elements in the div
*/
    _createForm: function() {
        this.existingElements = {};
        var inputs = this.form.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            this.existingElements[input.name] = input;
        }
        return;
    },
    /**
* We are done with the form - clean up
*/
    _cleanup: function() {
        this.existingElements = {};
    },
    /**
* Call each of the list submit handlers to allow them to make any
* modifications necessary for the form submission
*/
    _runHandlers: function(element) {
        this.getChecked();
        return this.fireEvent("list.handler", this, element);
    },
    /**
* Set the submit action for the form
*/
    _setAction: function(e) {
        if (e.getAttribute('gsft_id'))
            this.form.sys_action.value = e.getAttribute('gsft_id');
        else
            this.form.sys_action.value = e.id;
    },
    /**
* Submit the form
*/
    _submitForm: function(/*optional*/ method) {
        g_submitted = true;
        try {
            if (method)
                this.form.method = method;
            this.form.submit();
        } catch (ex) {
        }
    },
    type: 'GlideList'
});
GlideList.unload = function() {
    for (var id in GlideLists) {
        var list = GlideLists[id];
        list.destroy();
        GlideLists[id] = null;
    }
    GlideLists = {};
},
GlideList.getByListID = function(listID) {
    return GlideLists[listID];
},
GlideList.getByElement = function(element) {
    var e = $(element);
    if (!e)
        return null;
    var form = findParentByTag(element, 'form');
    var listID = getAttributeValue(form, 'glide_list_id');
    return GlideList.getByListID(listID);
},
GlideList.getByTableName = function(tableName) {
    var lists = [];
    for (var id in GlideLists) {
        if (id.startsWith(tableName))
            lists.push(GlideLists[id]);
    }
    return lists;
}
//include classes/GlideListHandlers.js
/**
* The GlideList handler classes are called when an action is performed on a list so that
* any special handling can be performed by the handlers
*/
var GlideListNewHandler = Class.create({
    initialize: function(/*GlideList*/ list) {
        list.on("list.handler", this.process.bind(this));
    },
    process: function(list, element) {
        if (element && element.id == "sysverb_new")
            list.addToForm("sys_id", "-1");
        return true;
    },
    type: 'GlideListNewHandler'
});
var GlideListChecksHandler = Class.create({
    initialize: function(/*GlideList*/ list) {
        list.on("list.handler", this.process.bind(this));
    },
    process: function(list, element) {
        var action = "";
        if (element)
            action = element.id;
        if (!action.startsWith("sysverb")) {
            var keys = ['No records selected', 'Delete the selected item?', 'Delete these', 'items?'];
            var msgs = new GwtMessage().getMessages(keys);
            if (list.checkedIds == '') {
                alert(msgs["No records selected"]);
                return false;
            }
            if (action == "delete_checked") {
                var items = list.checkedIds.split(",");
                if (items.length == 1) {
                    if (!confirm(msgs["Delete the selected item?"]))
                        return false;
                } else if (items.length > 0) {
                    if (!confirm(msgs["Delete these"] + " " + items.length + " " + msgs["items?"]))
                        return false;
                }
            }
        }
        list.addToForm('sysparm_checked_items', list.checkedIds);
        return true;
    },
    type: 'GlideListChecksHandler'
});
var GlideListSecurityHandler = Class.create({
    initialize: function(/*GlideList*/ list) {
        list.on("list.handler", this.process.bind(this));
    },
    process: function(list, element) {
        if (!list.securityCheckComplete && element && element.getAttribute('gsft_condition') == 'true') {
            var ax = new ActionSecurity();
            if (!ax.execute(list.form))
                return false;
        }
        if (list.securityCheckComplete && element && element.getAttribute('gsft_allow') && element.getAttribute('gsft_allow') != '')
            list.addToForm("sysparm_checked_items", element.getAttribute('gsft_allow'));
    },
    type: 'GlideListSecurityHandler'
});
//include classes/GlideListNavigator.js
/**
* All of the navigation handling for a list (including column sorting since that calls the partial
* page code to update the list rows)
*
* This is an extension of GlideList, but GlideList is getting too big, so I have split this code
* out.
*/
var PARTIAL_PAGE_MINIMAL_LIST = ["sysparm_query", "sysparm_current_row", "sysparm_report_list", "sysparm_report_id",
"sysparm_current_sort", "sysparm_referring_url", "sysparm_sys_id", "sys_target",
"sysparm_view", "sysparm_target", "sysparm_dependent", "sysparm_reference",
"sysparm_groupby","sysparm_ref_list_query", "sysparm_collection_relationship", "sysparm_group_id"];
var PARTIAL_PAGE_RELATED_LIST = ["sysparm_collection", "sysparm_collectionID", "sysparm_collection_key",
"sysparm_collection_related_file", "sysparm_collection_related_field", "sysparm_collection_label",
"sysparm_collection_hierarchical", "sysparm_collection_type", "sysparm_collection_connector",
"sysparm_list_edit_type", "sysparm_list_control_sys_id"];
var GlideListNavigator = Class.create({
    initialize: function(/*GlideList*/ list) {
        this.list = list;
        this.suppressFocus = false;
    },
    isRelatedList: function() {
        var relatedwidget = this.list.getValue('sys_is_related_list');
        if (relatedwidget == "true")
            return true;
        return false;
    },
    isReport: function() {
        var list = GlideList.getByListID('reportform');
        if (list)
            return true;
        return false;
    },
    columnSort: function(tableName, columnName, direction) {
        var parmDirection = 'sysparm_userpref.' + tableName + '.db.order.direction';
        var parmSort = 'sysparm_userpref.' + tableName + '.db.order';
        var currentSort = this.list.getElement(parmSort);
        if (currentSort)
            new Select(currentSort).selectValue(columnName);
        var parms = {};
        this.list.getValues(parms, PARTIAL_PAGE_MINIMAL_LIST);
        if (this.isRelatedList())
            this._addRelatedListValues(parms);
        else if (this.isReport()) {
            reportOnSubmit();
            this._addReportValues(parms, true);
            parms['sysparm_refresh'] = 'refresh';
        }
        parms[parmDirection] = direction;
        parms[parmSort] = columnName;
        parms['sysparm_current_row'] = '1';
        parms['sysparm_current_sort'] = columnName;
        this._fetchPartialPage(parms);
    },
    /**
* Navigate the list based on an action (sysverb_first, sysverb_previous, sysverb_next, sysverb_last)
*/
    navigateList: function(action, navName) {
        if (action == 'sysverb_first') {
            this._gotoRowNumber(1, navName);
            return;
        }
        var rowNum;
        this._determineRowInfo();
        if (action == 'sysverb_previous')
            rowNum = this.currentRowNum - this.rowsPerPage;
        else if (action == 'sysverb_next')
            rowNum = this.currentRowNum + this.rowsPerPage;
        else if (action == 'sysverb_last')
            rowNum = (this.totalRows + 1) - this.rowsPerPage;
        else
            rowNum = this.currentRowNum;
        rowNum = this._validateRowNum(rowNum);
        this._gotoRowNumber(rowNum, navName);
    },
    /**
* Navigate to a specific row, but validate that the row number is valid first
*/
    gotoRowNumber: function(rowNum, navName) {
        if (isNaN(rowNum))
            rowNum = 1;
        this._determineRowInfo();
        rowNum = this._validateRowNum(rowNum);
        this._gotoRowNumber(rowNum, navName);
    },
    _gotoRowNumber: function(rowNum, navName) {
        var parms = {};
        this.list.getValues(parms, PARTIAL_PAGE_MINIMAL_LIST);
        if (this.isRelatedList())
            this._addRelatedListValues(parms, false);
        else if (this.isReport())
            parms['sysparm_suppress_context'] = 'true';
        parms['sys_action'] = '';
        parms['sysparm_current_row'] = rowNum;
        this._fetchPartialPage(parms, navName);
    },
    /**
* _determineRowInfo must have been called prior to calling this method
*/
    _validateRowNum: function(rowNum) {
        if (rowNum < 1)
            rowNum = 1;
        if (rowNum > this.totalRows)
            rowNum = (this.totalRows - this.rowsPerPage) + 1;
        return rowNum;
    },
    _fetchPartialPage: function(/*{}*/ parms, navName) {
        var targetSpan = getPartialSpan(this.list.listID);
        if (!targetSpan)
            return;
        if (navName && !this.suppressFocus)
            self.location.hash = this.list.listID + "_hash";
        /* - Don't do this until we get the visuals correct, it does not look right yet
this.loadingDiv = cel("div");
this.loadingDiv.className = "partial_page_loading";
this.loadingDiv.style.height = this.list.form.offsetHeight;
this.loadingDiv.style.width = this.list.form.offsetWidth;
this.loadingDiv.style.top = grabOffsetTop(this.list.form);
this.loadingDiv.style.left = grabOffsetLeft(this.list.form);
document.body.appendChild(this.loadingDiv);
*/
        parms['partial_page'] = this.list.listID;
        CustomEvent.fireTop("request_start", document);
        this.list.ajax(parms, this._partialPageResponse.bind(this));
    },
    _partialPageResponse: function(response) {
        if (this.loadingDiv) {
            rel(this.loadingDiv);
            this.loadingDiv = null;
        }
        if (!response)
            return;
        var targetSpan = getPartialSpan(this.list.listID);
        if (!targetSpan)
            return;
        if (isMSIE)
            var scrollTop = document.body.scrollTop;
        var html = response.responseText;
        targetSpan.innerHTML = html;
        html.evalScripts();
        CustomEvent.fireTop("request_complete", document);
        CustomEvent.fire('partial.page.reload', targetSpan);
        if (isMSIE)
            document.body.scrollTop = scrollTop;
        this._synchNavControls();
    },
    /**
* Set the top nav control row values to match the bottom one since the bottom one was
* updated during the partial page refresh
*/
    _synchNavControls: function() {
        var value = this.list.getValue('sys_rownumbottom');
        this.list.setValue('sysparm_current_row', value);
        this.list.setValue('sys_rownum', value);
        var eBottom = gel(this.list.listID + "_nav_labelbottom");
        var eTop = gel(this.list.listID + "_nav_label");
        if (eBottom && eTop)
            eTop.innerHTML = eBottom.innerHTML;
        this._determineRowInfo();
        var nav = false;
        if (this.currentRowNum > 1)
            nav = true;
        this._setNavImg('nav_first', nav);
        this._setNavImg('nav_back', nav);
        nav = false;
        if (this.currentRowNum < (this.totalRows - this.rowsPerPage + 1))
            nav = true;
        this._setNavImg('nav_next', nav);
        this._setNavImg('nav_last', nav);
    },
    _setNavImg: function(name, flag) {
        name = this.list.listID + "_" + name;
        var e = this.list.getElement(name);
        if (!e)
            return;
        if (flag) {
            e.className = "pointerhand";
            if (e.src.indexOf("_dis.gifx") != -1) {
                var src = e.src.replace("_dis\.gifx", "\.gifx");
                e.src = src;
            }
        } else {
            e.className = "";
            if (e.src.indexOf("_dis.gifx") == -1) {
                var src = e.src.replace("\.gifx", "_dis\.gifx");
                e.src = src;
            }
        }
    },
    _addRelatedListValues: function(/*{}*/ parms) {
        this.list.getValues(parms, PARTIAL_PAGE_RELATED_LIST);
        parms['sys_hint_rownum'] = 'true';
        parms['sysparm_nostack'] = 'true';
        parms['sys_hint_nocache'] = 'true';
    },
    _addReportValues: function(/*{}*/ parms, removeOrderByFlag) {
        var view = this.list.getValue('sysparm_view');
        if (view)
            parms['sysparm_view'] = view;
        if (removeOrderByFlag) {
            var temp = this.list.getValue('sysparm_query');
            if (temp) {
                var terms = temp.value;
                if (terms) {
                    var clean = [];
                    var termarray = terms.split('^');
                    for (var i = 0; i < termarray.length; i++) {
                        var aterm = termarray[i];
                        if (aterm.indexOf('ORDERBY') >= 0)
                            clean.push(aterm);
                    }
                    parms['sysparm_query'] = clean.join('^');
                }
            }
        }
        parms['sysparm_suppress_context'] = 'true';
        parms['sys_hint_nocache'] = 'true';
    },
    /**
* Set this.currentRowNum, this.rowsPerPage and this.totalRows
*/
    _determineRowInfo: function() {
        this.totalRows = this.list.getNumber('sysparm_total_rows');
        this.currentRowNum = this.list.getNumber('sysparm_current_row');
        this.rowsPerPage = 20;
        var num = this.list.getNumber('maxrowsonscreen');
        if (num == 0)
            num = this.list.getNumber('perrows');
        if (num > 0)
            this.rowsPerPage = num;
    },
    setSuppressFocus: function(suppress) {
        this.suppressFocus = suppress;
    },
    type: 'GlideListNavigator'
});
//include functions_list.js
/**
* The functions used to act against a list - these are convience functions that have
* been moved from various places into this single place.
*/
function gsftListSubmit(control, securityCheckComplete) {
    return GlideList.getByElement(control).action(control, securityCheckComplete);
}
/*
* Our navigation widget is made of of img tags, which cannot be disabled.
* Instead, when we disable them, we set their src attribute to a greyed out version of the
* navigation button, but that doesn't in any way prevent the onclick handler from running.
* This routing through will tell the onclick handler not to navigate if we're they grey "disabled"
* version of the image.
*/
function isNavEnabled(e) {
    if (!e)
        e = window.event;
    var target = e.target ? e.target : e.srcElement;
    var targetClass = target.className;
    return targetClass == "pointerhand";
}
function submitRowNumber(event, listID, navName) {
    if (event != true && event.keyCode != 13)
        return;
    var rowNum = getSrcElement(event).value;
    var list = GlideList.getByListID(listID);
    var navigator = new GlideListNavigator(list);
    navigator.gotoRowNumber(rowNum, navName);
    return false;
}
function navigateList(action, listID, navName, suppressFocus) {
    var list = GlideList.getByListID(listID);
    var navigator = new GlideListNavigator(list);
    if (suppressFocus)
        navigator.setSuppressFocus(true);
    navigator.navigateList(action, navName);
}
/* ----------------------------------------------------------------------- **
STUFF BELOW HERE WILL BE REMOVED AS SOON AS THE LIST CONVERSION
IS COMPLETE
** ----------------------------------------------------------------------- */
function checkIfActuallyReport() {
    var list = gel('reportform_control');
    if (list)
        return true;
    return false;
}
function checkIfActuallyRelated(form) {
    var relatedwidget = form['sys_is_related_list'];
    if (relatedwidget) {
        var temp = relatedwidget.value;
        if (temp == 'true')
            return true;
    }
    return false;
}