
/**
* API for messing with Version 2 Lists - one of these gets created for each list that is
* generated on a page.  To get a GlideList2 object for a list, use any of:
*
*       GlideList2.get(listID or element) - returns the GlideList2 object for the list based on the id or the list that contains the element
*
* Associated classes:
* -------------------
*       GlideList2Header
*       GlideList2Column
*       GlideList2Row
*       (static methods are in GlideList2Statics.js)
*
* Events:
* -------
*       list.loaded
*
*       hdrcell.click
*       hdrcell.contextmenu
*
*       cell.click
*       cell.dblclick
*       cell.contextmenu
*
*       row.checkbox
*       allchecked
*/
var GlideList2 = Class.create(GwtObservable, {
    initialize: function(listID, tableName, query) {
        GwtObservable.prototype.initialize.call(this);
        this.list = gel(listID);
        this.listID = listID;
        this.listName = listID;
        this.properties = "";
        GlideLists2[this.listID] = this;
        this.lastChecked = null;
        this.title = "";
        this.view = "";
        this.filter = "";
        this.parentTable = "";
        this.related = "";
        this.listControlID = "-1";
        this.orderBy = [];
        this.groupBy = [];
        this.sortBy = "";
        this.sortDir = "";
        this.refreshPage = false;
        this.firstRow = 1;
        this.lastRow = 20;
        this.rowsPerPage = 20;
        this.totalRows = 0;
        this.submitValues = {};
        this.fields = "";
        this.tableName = tableName;
        this.table = null;
        this.header = null;
        this.rows = null;
        this.referringURL = "";
        this.titleMenu = new GlideMenu(this.listID);
        this.headerMenu = new GlideMenu(this.listID);
        this.rowMenu = new GlideMenu(this.listID);
        this.userList = false;
        this.onclickFunc = this.click.bindAsEventListener(this);
        this.ondblclickFunc = this.dblClick.bindAsEventListener(this);
        this.oncontextmenuFunc = this.contextMenu.bindAsEventListener(this);
        this.printFunc = this.onPrint.bind(this);
        this._parseQuery(query, false, true);
    },
    destroy: function() {
        this.handlePrint(false);
        this._clear();
        this.list = null;
        this.titleMenu.destroy();
        this.titleMenu = null;
        this.headerMenu.destroy();
        this.headerMenu = null;
        this.rowMenu.destroy();
        this.rowMenu = null;
        this.form = null;
    },
    getQuery: function(/*{}*/ options) {
        options = options || {};
        var q = [];
        if (options.fixed || options.all) {
            var fq = this.submitValues['sysparm_fixed_query'];
            if (fq)
                q.push(fq);
        }
        if (this.filter)
            q.push(this.filter);
        if ((options.orderby || options.all) && this.orderBy.length > 0)
            q.push(this.orderBy.join('^'));
        if ((options.groupby || options.all) && this.groupBy.length > 0)
            q.push(this.groupBy.join('^'));
        return q.join('^');
    },
    getFixedQuery: function() {
        return this.submitValues['sysparm_fixed_query'] + '';
    },
    getGroupBy: function () {
        return this.groupBy.join(",");
    },
    getHeader: function() {
        if (!this.header)
            this._initRows();
        return this.header;
    },
    getHeaderCell: function(fieldName) {
        if (!this.header)
            this._initRows();
        if (!this.header)
            return null;
        return this.header.getCell(fieldName);
    },
    getRow: function(sysId) {
        if (!this.rows)
            this._initRows();
        return this.rows[sysId];
    },
    getCell: function(sysId, fieldName) {
        var row = this.getRow(sysId);
        return row.getCell(fieldName);
    },
    /**
* Get the sys_ids for the items that are checked in the list
*/
    getChecked: function() {
        var ids = [];
        var chks = this._getCheckboxes();
        for (var i = 0; i < chks.length; i++) {
            var chk = chks[i];
            if (chk.type != "checkbox")
                continue;
            if (!chk.checked)
                continue
            ids.push(getAttributeValue(chk, "sys_id"));
        }
        this.checkedIds = ids.join(",");
        return this.checkedIds;
    },
    /* -------------------------------------------------
*  EVENT HANDLING
* ------------------------------------------------- */
    loaded: function() {
        this._initList();
        if (this.fireEvent("list.loaded", this.table, this) === false)
            return false;
        if (CustomEvent.fire("list.loaded", this.table, this) === false)
            return false;
        return this.onLoad();
    },
    click: function(evt) {
        var element = this._getCellFromEvent(evt, "click");
        if (!element)
            return;
        return this.onClick(element, evt);
    },
    dblClick: function(evt) {
        var element = this._getCellFromEvent(evt, "dblclick");
        if (!element)
            return;
        return this.onDblClick(element, evt);
    },
    contextMenu: function(evt) {
        if (evt.ctrlKey)
            return;
        var element = this._getCellFromEvent(evt, "contextmenu");
        if (!element)
            return;
        return this.onRowContextMenu(element, evt);
    },
    clickTitle: function(evt) {
        if (this.titleMenu.isEmpty())
            return;
        var variables = {};
        variables['g_list'] = this;
        this.titleMenu.showContextMenu(getEvent(evt), "context_list_title", variables);
        Event.stop(evt);
        return false;
    },
    hdrCellClick: function(element, evt) {
        if (!this._isHdrCell(element))
            return;
        if (this.fireEvent("hdrcell.click", this, element, evt) === false) {
            Event.stop(evt);
            return false;
        }
        return this.onHdrCellClick(element, evt);
    },
    hdrCellContextMenu: function(element, evt) {
        if (evt.ctrlKey)
            return;
        if (!this._isHdrCell(element))
            return;
        if (this.fireEvent("hdrcell.contextmenu", this, element, evt) === false) {
            Event.stop(evt);
            return false;
        }
        return this.onHdrCellContextMenu(element, evt);
    },
    rowContextMenu: function(element, evt) {
        if (evt.ctrlKey)
            return;
        element = this._getCellFromEvent(evt);
        if (!element)
            return;
        if (this.fireEvent("cell.contextmenu", this, element, evt) === false) {
            Event.stop(evt);
            return false;
        }
        return this.onRowContextMenu(element, evt);
    },
    allChecked: function(chk) {
        var checked = chk.checked;
        if (this.fireEvent("all.checked", this, chk, checked) === false)
            return false;
        return this.onAllChecked(chk, checked);
    },
    rowChecked: function(chk, evt) {
        evt = getEvent(evt);
        var checked = chk.checked;
        if (this.fireEvent("row.checked", this, checked, evt) === false) {
            Event.stop(evt);
            return false;
        }
        return this.onRowChecked(chk, checked, evt);
    },
    handlePrint: function(flag) {
        if (flag)
            CustomEvent.observe("print", this.printFunc);
        else
            CustomEvent.un("print", this.printFunc);
    },
    onPrint: function(maxRows) {
        maxRows = parseInt(maxRows, 10);
        if (isNaN(maxRows) || maxRows < 1)
            maxRows = 5000;
        if (this.totalRows > parseInt(maxRows, 10)) {
            if (!confirm(new GwtMessage().getMessage("Printing large lists may affect system performance. Continue?")))
                return false;
        }
        var veryLargeNumber = "999999999";
        var features = "resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=yes,location=no";
        var href = window.location.href;
        var parts = href.split('?');
        var url = parts[0];
        href = [];
        if (parts.length > 1) {
            parts = parts[1].split("&");
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].startsWith("sysparm_query="))
                    continue;
                if (parts[i].startsWith("sysparm_media="))
                    continue;
                if (parts[i].startsWith("sysparm_stack="))
                    continue;
                href.push(parts[i]);
            }
        }
        href.push("sysparm_stack=no");
        href.push("sysparm_force_row_count=" + veryLargeNumber);
        href.push("sysparm_media=print");
        href.push("sysparm_query=" + this.getQuery({
            all : true
        }));
        win = window.open(url + "?" + href.join("&"), "Printer_friendly_format", features);
        win.focus();
        return false;
    },
    /* -------------------------------------------------
*  These are the methods that should be overridden
*  to change the behavior of a list
* ------------------------------------------------- */
    onLoad: function() {
        return;
    },
    onClick: function(element, evt) {
        return;
    },
    onDblClick: function(element, evt) {
        return;
    },
    onHdrCellClick: function(element, evt) {
        var sortable = (getAttributeValue(element, 'sortable') == "true");
        if (!sortable)
            return;
        var field = getAttributeValue(element, 'name');
        var dir = getAttributeValue(element, 'sort_dir');
        var type = getAttributeValue(element, 'glide_type');
        dir = this._toggleSortDir(dir, type);
        if (dir == "DESC")
            this.sortDescending(field);
        else
            this.sort(field);
        Event.stop(evt);
        return false;
    },
    onHdrCellContextMenu: function(element, evt) {
        if (this.headerMenu.isEmpty())
            return;
        var variables = {};
        variables['g_list'] = this;
        variables['g_fieldName'] = getAttributeValue(element, 'name');
        variables['g_fieldLabel'] = getAttributeValue(element, 'glide_label');
        variables['g_sysId'] = '';
        variables['rowSysId'] = '';
        this.headerMenu.showContextMenu(getEvent(evt), "context_list_header", variables);
        Event.stop(evt);
        return false;
    },
    onRowContextMenu: function(element, evt) {
        if (this.rowMenu.isEmpty())
            return;
        var variables = {};
        variables['g_list'] = this;
        variables['g_fieldName'] = this.fieldNames[element.cellIndex];
        variables['g_fieldLabel'] = getAttributeValue(element, 'glide_label');
        variables['g_sysId'] = getAttributeValue(element.parentNode, 'sys_id');
        variables['rowSysId'] = variables['g_sysId'];
        this.rowMenu.showContextMenu(getEvent(evt), "context_list_row", variables);
        Event.stop(evt);
        return false;
    },
    onAllChecked: function(chk, checked) {
        this.lastChecked = null;
        var chks = this._getCheckboxes();
        for (var i = 0; i < chks.length; i++)
            chks[i].checked = checked;
    },
    onRowChecked: function(chk, checked, evt) {
        var checking = chk.checked;
        if (!checking) {
            this._setTheAllCheckbox(false);
            this.lastChecked = null;
            return;
        }
        var cBoxes = this._getCheckboxes();
        if (evt.shiftKey && this.lastChecked != chk) {
            var start = -1;
            var end = -1;
            for (var i = 0; i < cBoxes.length; i++) {
                var cBox = cBoxes[i];
                if (cBox == this.lastChecked)
                    start = i;
                if (cBox == chk)
                    end = i;
            }
            if (start > -1 && end > -1) {
                if (start > end) {
                    var t = start;
                    start = end;
                    end = t;
                }
                for (var i = start; i < end; i++)
                    cBoxes[i].checked = true;
            }
        }
        this.lastChecked = chk;
        var allChecked = true;
        for (var i = 0; i < cBoxes.length; i++) {
            if (!cBoxes[i].checked) {
                allChecked = false;
                break;
            }
        }
        if (allChecked)
            this._setTheAllCheckbox(true);
        return false;
    },
    _getCheckboxes: function() {
        return document.getElementsByName('check_' + this.listID);
    },
    _setTheAllCheckbox: function(flag) {
        var chk = gel('allcheck_' + this.listID);
        if (!chk)
            return;
        chk.checked = flag;
    },
    _isHdrCell: function(element) {
        if (element.tagName.toLowerCase() != "th")
            return false;
        return element.id.startsWith("hdrcell_");
    },
    _isCell: function(element) {
        if (!element)
            return false;
        if (element.tagName.toLowerCase() != "td")
            return false;
        return hasClassName(element, "vt");
    },
    _getCellFromEvent: function(evt, eventName) {
        evt = getEvent(evt);
        var element = this._getSrcElement(evt);
        if (!element)
            return null;
        if (element.tagName.toLowerCase() != "td")
            element = findParentByTag(element, "td");
        if (!this._isCell(element))
            return null;
        if (this.fireEvent("cell." + eventName, element, evt) === false) {
            Event.stop(evt);
            return null;
        }
        return element;
    },
    _getSrcElement: function(evt) {
        if (evt)
            return getSrcElement(evt);
        return null;
    },
    setSubmitValue: function(n, v) {
        this.submitValues[n] = v;
    },
    getSubmitValue: function(n) {
        var v = this.submitValues[n];
        if (!v)
            return '';
        return v;
    },
    getOrderBy: function() {
        if (this.orderBy.length == 0)
            return "";
        var field = this.orderBy[0].substring(7);
        if (field.startsWith("DESC"))
            field = field.substring(4);
        return field;
    },
    getListName: function() {
        return this.listName;
    },
    setListName: function(n) {
        this.listName = n;
    },
    setUserList: function(b) {
        this.userList = b;
    },
    isUserList: function() {
        return this.userList;
    },
    getTitle: function() {
        if (!this.title)
            return this.tableName;
        return this.title;
    },
    setTitle: function(title) {
        this.title = title;
    },
    getView: function() {
        return this.view;
    },
    setView: function(view) {
        this.view = view;
    },
    setProperties: function(properties) {
        this.properties = properties;
    },
    getReferringURL: function() {
        return this.referringURL;
    },
    setReferringURL: function(url) {
        this.referringURL = url;
    },
    getTableName: function() {
        return this.tableName;
    },
    getParentTable: function() {
        if (!this.parentTable)
            return "";
        return this.parentTable;
    },
    getRelated: function() {
        return this.related;
    },
    setRelated: function(parentTable, related) {
        this.parentTable = parentTable;
        this.related = related;
    },
    getListControlID: function() {
        return this.listControlID;
    },
    setListControlID: function(id) {
        this.listControlID = id;
    },
    addFilter: function(filter) {
        if (this.filter)
            this.filter += "^";
        this.filter += filter;
    },
    setFilter: function(filter) {
        this._parseQuery(filter);
    },
    setFilterAndRefresh: function(filter) {
        this._parseQuery(filter, true, true);
        var parms = this._getRefreshParms(filter);
        this.refreshWithOrderBy(1, parms);
    },
    setDefaultFilter: function(filter) {
        this.setFilter(filter);
        var parms = this._getRefreshParms(filter, true);
        this.refresh(1, parms);
    },
    _getRefreshParms: function(/*string*/filter, /*boolean*/ setAsDefaultFlag) {
        var parms = {};
        var related = this.getRelated();
        if (related) {
            var parentSysId = this.getSubmitValue('sysparm_collectionID');
            var key = this.getParentTable() + "." + parentSysId + "." + related;
            var n = 'sysparm_list_filter';
            if (setAsDefaultFlag)
                n += '_default';
            parms[n] = key + "=" + filter;
        }
        return parms;
    },
    setOrderBy: function(orderBy) {
        if (!orderBy) {
            this.orderBy = [];
            return;
        }
        this.orderBy = orderBy.split('^');
        for (var i = 0; i < this.orderBy.length; i++) {
            if (!this.orderBy[i].startsWith('ORDERBY'))
                this.orderBy[i] = 'ORDERBY' + this.orderBy[i];
        }
    },
    setGroupBy: function(groupBy) {
        if (!groupBy) {
            this.groupBy = [];
            return;
        }
        this.groupBy = groupBy.split('^');
        for (var i = 0; i < this.groupBy.length; i++) {
            if (!this.groupBy[i].startsWith('GROUPBY'))
                this.groupBy[i] = 'GROUPBY' + this.groupBy[i];
        }
    },
    setFirstRow: function(rowNum) {
        if (isNaN(rowNum))
            this.firstRow = 1;
        else
            this.firstRow = parseInt(rowNum, 10);
    },
    setRowsPerPage: function(rows) {
        if (isNaN(rows))
            this.rowsPerPage = 20;
        else
            this.rowsPerPage = parseInt(rows, 10);
        var params = {};
        params['sysparm_userpref_rowcount'] = rows;
        this._refreshAjax(1, params);
    },
    setFields: function(fields) {
        this.fields = fields;
        this.fieldNdxs = {};
        this.fieldNames = [];
        this.fieldNames.push('');       // cell 0 is for a select box and decorations
        var names = this.fields.split(",");
        for (var i = 0; i < names.length; i++) {
            this.fieldNdxs[names[i]] = i + 1;
            this.fieldNames.push(names[i]);
        }
    },
    toggleList: function() {
        var collapsed = this.toggleListNoPref();
        var prefName = "collapse." + this.listName;
        if (collapsed)
            setPreference(prefName, 'true');
        else
            deletePreference(prefName);
        return !collapsed;
    },
    toggleListNoPref: function() {
        toggleDivDisplay(this.listID + "_collapsed");
        var listDiv = toggleDivDisplayAndReturn(this.listID + "_expanded");
        if (!listDiv)
            return false;
        return listDiv.style.display == "none";
    },
    showHideList: function(showFlag) {
        var e = gel(this.listID + "_expanded");
        if (!e)
            return;
        var shown = e.style.display != "none";
        if ((!shown && showFlag) || (shown && !showFlag))
            this.toggleList();
    },
    showHideGroups: function(showFlag) {
        var rows = this.table.rows;
        var len = rows.length;
        var listField = this.getGroupBy().substring(7);
        var groups = new Array();
        for (var i = 0; i < len; i++) {
            var aRow = rows[i];
            if (getAttributeValue(aRow, "group_row") != "true")
                continue;
            var id = aRow.id;
            var value = id.substring(5 + this.listID.length);
            groups.push(value);
            var shown = getAttributeValue(aRow, "collapsed") != "true";
            if ((!shown && showFlag) || (shown && !showFlag))
                this._toggleGroup(this.table, aRow);
        }
        var expImg = gel(this.listID + '_expand_groups');
        var colImg = gel(this.listID + '_collapse_groups');
        if (!expImg || !colImg)
            return;
        if (showFlag) {
            colImg.style.display = "inline";
            expImg.style.display = "none";
        } else {
            expImg.style.display = "inline";
            colImg.style.display = "none";
        }
        this._sendGroupPreference(listField, showFlag, true, groups);
    },
    toggleGroup: function(el) {
        var row = findParentByTag(el, "TR");
        if (!row)
            return;
        var table = findParentByTag(row, "TABLE");
        if (!table)
            return;
        var shown = this._toggleGroup(table, row);
        var id = row.id;
        var value = id.substring(5 + this.listID.length);
        var colmn = row.getAttribute('groupField');
        var tmp = this.listID;
        this.listID = this.listID + '_' + colmn;  // save the list with the sort column in the sys_user_preference table
        this._sendGroupPreference(value, shown);
        this.listID = tmp;
        return shown;
    },
    _toggleGroup: function(table, row) {
        var shown = getAttributeValue(row, "collapsed") != "true";
        shown = !shown;
        this._showHideGroup(table, row, shown);
        return shown;
    },
    _showHideGroup: function(table, row, showFlag) {
        var collapsed = !showFlag;
        this._showHideImage(row.id + "_group_toggle_image", showFlag);
        setAttributeValue(row, "collapsed", collapsed + '');
        var rows = table.rows;
        var len = rows.length;
        for (var i = row.rowIndex + 1; i < len; i++) {
            var aRow = rows[i];
            if (getAttributeValue(aRow, "group_row") == "true")
                break;
            if (collapsed)
                aRow.style.display = "none";
            else
                aRow.style.display = "";
        }
        _frameChanged();
    },
    _showHideImage: function(id, show) {
        var img = $(id);
        if (!img)
            return;
        if (show)
            img.src = "images/list_v2_heir_reveal.gifx";
        else
            img.src = "images/list_v2_heir_hide.gifx";
    },
    _sendGroupPreference: function(groupValue, showFlag, allFlag, groups) {
        var ajax = new GlideAjax("AJAXListGrouping");
        ajax.addParam("list_id", this.listID);
        ajax.addParam("expanded", showFlag + '');
        ajax.addParam("value", groupValue);
        ajax.addParam("all", allFlag);
        if (groups)
            ajax.addParam("groups", groups)
        ajax.getXML();
    },
    toggleHierarchy: function(img, rowId, parentTable, parentSysId) {
        var row = gel(rowId);
        if (!row)
            return;
        if (getAttributeValue(row, "hierarchical") == "not_loaded") {
            setAttributeValue(row, "hierarchical", "loaded");
            this._showHideImage(img, true);
            this._showHideHierarchy(row, true);
            this.loadList(row.firstChild, parentTable, parentSysId, "list2_hierarchical.xml", "hierarchical");
            return;
        }
        var shown = getAttributeValue(row, "collapsed") != "true";
        shown = !shown;
        this._showHideImage(img, shown);
        this._showHideHierarchy(row, shown);
        return shown;
    },
    _showHideHierarchy: function(row, showFlag) {
        var collapsed = !showFlag;
        setAttributeValue(row, "collapsed", collapsed + '');
        if (collapsed)
            row.style.display = "none";
        else
            row.style.display = "";
    },
    loadList: function(el, parentTable, parentSysId, template, listCss) {
        var ajax = new GlideAjax("AJAXCachedJellyRunner", "AJAXCachedJellyRunner.do");
        ajax.addParam("template", template);
        ajax.addParam('sysparm_collection', parentTable);
        ajax.addParam('sysparm_sys_id', parentSysId);
        ajax.addParam('sysparm_view', this.getView());
        ajax.addParam('sysparm_cache_prefix', "hier:" + parentTable);
        ajax.addParam('sysparm_cache_flags', 'list');
        if (listCss)
            ajax.addParam('sysparm_list_css', listCss);
        ajax.addParam('sys_hint_nocache', 'true');
        ajax.addParam('sysparm_stack', 'no');
        ajax.addParam('twoPhase', 'true');
        el.innerHTML = GlideList2.LOADING_MSG;
        ajax.getXML(this._loadListResponse.bind(this), null, [el, parentSysId]);
    },
    _loadListResponse: function(response, args) {
        var el = args[0];
        var parentSysId = args[1];
        var html = this._getListBody(response.responseText);
        el.innerHTML = html;
        html.evalScripts(true);
        var tabs = new GlideTabs2('tabs2_list_' + parentSysId, el, 0, 'tabs2_hier');
        tabs.activate();
    },
    /* -------------------------------------------------
*  Form submit support
* ------------------------------------------------- */
    /**
* Submit an action for a specific sys_id
*/
    actionWithSysId: function(actionId, actionName, sysId) {
        this._action(actionId, actionName, [sysId]);
    },
    /**
* Submit an action for the checked items
*/
    action: function(actionId, actionName, /*optional*/ allowedCheckedIds) {
        this._action(actionId, actionName, allowedCheckedIds);
    },
    _action: function(actionId, actionName, ids) {
        if (this._isSubmitted())
            return false;
        if (!ids)
            this.getChecked();
        else
            this.checkedIds = ids;
        this._createForm();
        this.addToForm('sysparm_referring_url', this.referringURL);
        this.addToForm('sysparm_query', this.getQuery({
            groupby: true
        }));
        this.addToForm('sysparm_view', this.getView());
        if (actionId)
            this.addToForm('sys_action', actionId);
        else
            this.addToForm('sys_action', actionName);
        if (ids != null)
            this.addToForm('sysparm_checked_items', ids);
        else
            this.addToForm('sysparm_checked_items', this.checkedIds);
        if (this._runHandlers(actionId, actionName) === false) {
            this._cleanup();
            return false;
        }
        this._submitForm();
        this._cleanup();
        return false;
    },
    /**
* Add a name=value pair to the form as a hidden input element
*/
    addToForm: function(n, v) {
        this.formElements[n] = v;
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
        this.formElements = {};
        this.formElements['sys_target'] = this.tableName;
        this.formElements['sys_action'] = '';
        this.formElements['sys_is_list'] = 'true';
        this.formElements['sysparm_checked_items'] = this.checkedIds;
        if (typeof g_ck != 'undefined' && g_ck != "")
            this.formElements['sysparm_ck'] = g_ck;
        this.form = gel("form_" + this.listID);
        if (this.form)
            rel(this.form);
        this.form = cel("form", this.list);
        this.form.id = "form_" + this.listID;
        this.form.method = "POST";
        this.form.action = this.tableName + "_list.do";
        return;
    },
    /**
* Call each of the list submit handlers to allow them to make any
* modifications necessary for the form submission
*/
    _runHandlers: function(actionId, actionName) {
        return CustomEvent.fire("list.handler", this, actionId, actionName);
    },
    submit: function(/*{}*/ parms) {
        if (this._isSubmitted())
            return false;
        this._createForm();
        this.addToForm('sysparm_query', this.getQuery({
            groupby: true
        }));
        for (var n in parms)
            this.addToForm(n, parms[n]);
        this._submitForm();
        this._cleanup();
        return false;
    },
    /**
* Submit the form
*/
    _submitForm: function(/*optional*/ method) {
        for (var n in this.submitValues)
            this.addToForm(n, this.submitValues[n]);
        for (var n in this.formElements) {
            var v = this.formElements[n];
            if (!v)
                v = '';
            var opt = document.createElement('input');
            opt.type = "HIDDEN";
            opt.name = n;
            opt.id = n;
            opt.value = v;
            this.form.appendChild(opt);
        }
        g_list = this;
        g_submitted = true;
        try {
            if (method)
                this.form.method = method;
            this.form.submit();
        } catch (ex) {
        }
    },
    /**
* We are done with the form - clean up
*/
    _cleanup: function() {
        this.formElements = {};
    },
    /* -------------------------------------------------
*  AJAX Calls
* ------------------------------------------------- */
    sort: function(field) {
        this._sort(field, "");
    },
    sortDescending: function(field) {
        this._sort(field, "DESC");
    },
    refresh: function(/*optional*/ firstRow, /*{} optional*/ additionalParms) {
        this._refresh(firstRow, additionalParms, false);
    },
    refreshWithOrderBy: function(/*optional*/ firstRow, /*{} optional*/ additionalParms) {
        this._refresh(firstRow, additionalParms, true);
    },
    _refresh: function(/*optional*/ firstRow, /*{} optional*/ additionalParms, /*boolean*/includeOrderBy) {
        if (this.refreshPage)
            this._refreshPage(firstRow, additionalParms, includeOrderBy);
        else
            this._refreshAjax(firstRow, additionalParms, includeOrderBy);
    },
    _refreshPage: function(/*optional*/ firstRow, /*{} optional*/ additionalParms, /*boolean*/includeOrderBy) {
        var url = new GlideURL(this.tableName + "_list.do");
        url.addParam('sysparm_query', this.getQuery({
            orderby: includeOrderBy,
            groupby : true
        }));
        url.addParam('sysparm_view', this.view);
        var q = this.submitValues['sysparm_fixed_query'];
        if (q)
            url.addParam('sysparm_fixed_query', q);
        var css = this.submitValues['sysparm_list_css'];
        if (css)
            url.addParam('sysparm_list_css', css);
        var s = url.getURL(additionalParms);
        window.location.href = s;
        this._showLoading();
    },
    _refreshAjax: function(/*optional*/ firstRow, /*{} optional*/ additionalParms, /*boolean*/includeOrderBy) {
        this._showLoading();
        if (typeof firstRow != "undefined")
            this.firstRow = this._validateFirstRow(firstRow);
        var ajax = new GlideAjax('', this.tableName + '_list.do');
        for (var n in this.submitValues)
            ajax.addParam(n, this.submitValues[n]);
        var query = this.getQuery({
            orderby: includeOrderBy,
            groupby : true
        });
        ajax.addParam('sysparm_view', this.view);
        ajax.addParam('sysparm_query', query);
        ajax.addParam('sysparm_first_row', this.firstRow);
        ajax.addParam('sysparm_properties', this.properties);
        ajax.addParam('sysparm_refresh', 'true');
        ajax.addParam('sys_hint_nocache', 'true');
        ajax.addParam('sysparm_stack', 'no');
        ajax.getXML(this._refreshResponse.bind(this), additionalParms);
    },
    _refreshResponse: function(response) {
        this._hideLoading();
        var e = gel(this.listID);
        var html = this._getListBody(response.responseText);
        e.innerHTML = html;
        this._initList();
        html.evalScripts(true);
        this.fireEvent('partial.page.reload', this.table, this);
        CustomEvent.fire('partial.page.reload', this.table, this);
    },
    _getListBody: function(text) {
        var startPos = text.indexOf(GlideList2.LIST_BODY_START);
        if (startPos == -1)
            return "";
        startPos += GlideList2.LIST_BODY_START.length;
        var endPos = text.indexOf(GlideList2.LIST_BODY_END);
        if (startPos == -1 || endPos == -1 || startPos >= endPos)
            return "";
        return text.substring(startPos, endPos);
    },
    _sort: function(field, dir) {
        var parms = {};
        this.setOrderBy(dir + field);
        parms['sysparm_userpref.' + this.tableName + '.db.order'] = field;
        parms['sysparm_userpref.' + this.tableName + '.db.order.direction'] = dir;
        this._refreshAjax(1, parms);
    },
    _setRowCounts: function() {
        this.firstRow = this._getAttributeInt(this.table, "first_row", 1);
        this.lastRow = this._getAttributeInt(this.table, "last_row", 0);
        this.rowsPerPage = this._getAttributeInt(this.table, "rows_per_page", 20);
        this.totalRows = this._getAttributeInt(this.table, "total_rows", 0);
        var e = gel(this.listID + "_collapsed_title");
        if (!e)
            return;
        if (this.totalRows == 0)
            e.innerHTML = this.getTitle();
        else
            e.innerHTML = this.getTitle() + " (" + this.totalRows + ")";
    },
    _clear: function() {
        this.lastChecked = null;
        this.table = null;
        if (this.header)
            this.header.destroy();
        if (this.rows) {
            for (var id in this.rows)
                this.rows[id].destroy();
        }
        this.header = null;
        this.rows = null;
        if (this.loadingDiv)
            this.loadingDiv = null;
    },
    _getAttributeInt: function(e, n, defaultValue) {
        if (!e)
            return defaultValue;
        var v = getAttributeValue(e, n);
        if (isNaN(v))
            return defaultValue;
        return parseInt(v, 10);
    },
    _initList: function() {
        this.table = gel(this.listID + "_table");
        this.table.onclick = this.onclickFunc;
        this.table.ondblclick = this.ondblclickFunc;
        this.table.oncontextmenu = this.oncontextmenuFunc;
        this._initRows();
        this._updateQuery();
        this._setRowCounts();
        this._setSortIndicator();
    },
    _initRows: function() {
        this.rows = {};
        this.header = null;
        if (!this.table)
            return;
        for (var i = 0; i < this.table.rows.length; i++) {
            var row = this.table.rows[i];
            if (row.id == ("hdr_" + this.listID))
                this.header = new GlideList2Header(this, row);
            else if (row.id)
                this.rows[row.id] = new GlideList2Row(this, row);
        }
    },
    _parseQuery: function(queryString, /*boolean*/ saveOrderBy, /*boolean*/ saveGroupBy) {
        var q = queryString.split('^');
        var filter = [];
        var orderBy = [];
        var groupBy = [];
        for (var i = 0; i < q.length; i++) {
            var term = q[i];
            if (term == "EQ")
                continue;
            if (term.indexOf("ORDERBY") == 0) {
                if (saveOrderBy)
                    orderBy.push(term);
                continue;
            }
            if (term.indexOf("GROUPBY") == 0) {
                if (saveGroupBy)
                    groupBy.push(term);
                continue;
            }
            filter.push(term);
        }
        this.filter = filter.join("^");
        if (saveOrderBy)
            this.setOrderBy(orderBy.join('^'));
        if (saveGroupBy)
            this.setGroupBy(groupBy.join('^'));
    },
    _updateQuery: function() {
        var q = getAttributeValue(this.table, 'query');
        if (!q)
            q = "";
        this._parseQuery(q);
    },
    _setSortIndicator: function() {
        this.sortBy = getAttributeValue(this.table, 'sort');
        if (!this.sortBy)
            return;
        if (this.sortBy.startsWith(this.tableName + "."))
            this.sortBy = this.sortBy.substring(this.tableName.length + 1);
        this.sortDir = getAttributeValue(this.table, 'sort_dir');
        if (!this.sortDir)
            this.sortDir = "";
        var e = this.getHeaderCell(this.sortBy);
        if (!e)
            return;
        setAttributeValue(e, "sort_dir", this.sortDir);
        e = gel("hdrimg_" + this.listID + "." + this.sortBy);
        if (!e)
            return;
        if (this.sortDir == "ASC")
            e.src = "images/move_up.gifx";
        else
            e.src = "images/move_down.gifx";
    },
    _toggleSortDir: function(dir, type) {
        if (dir == "ASC")
            return "DESC";
        if (dir == "DESC")
            return "ASC";
        if (dateTypes[type])
            return "DESC";
        return "ASC";
    },
    _validateFirstRow: function(row) {
        if (isNaN(row))
            return 1;
        row = parseInt(row, 10);
        if (row > this.totalRows)
            row = (this.totalRows - this.rowsPerPage) + 1;
        if (row < 1)
            row = 1;
        return row;
    },
    _showLoading: function() {
        var e = gel(this.listID + "_list");
        if (!e)
            return;
        var b = getBounds(e, false);
        if (!this.loadingDiv) {
            this.loadingDiv = cel("div");
            addChild(this.loadingDiv);
        }
        this.loadingDiv.className = "list_loading";
        this.loadingDiv.style.top = b.top;
        this.loadingDiv.style.left = b.left;
        this.loadingDiv.style.width = b.width;
        this.loadingDiv.style.height = b.height;
        showObject(this.loadingDiv);
    },
    _hideLoading: function() {
        if (!this.loadingDiv)
            return;
        hideObject(this.loadingDiv);
    },
    type: 'GlideList2'
});
var GlideList2Row = Class.create(GwtObservable, {
    initialize: function(/*Glide2List*/ list, tr) {
        GwtObservable.prototype.initialize.call(this);
        this.list = list;
        this.tr = tr;
    },
    destroy: function() {
        this.list = null;
        this.tr = null;
    },
    getCell: function(fieldName) {
        var ndx = this.list.fieldNdxs[fieldName];
        if (ndx == null)
            return null;
        return this.tr.cells[ndx];
    },
    type: 'GlideList2Row'
});
var GlideList2Header = Class.create(GlideList2Row, {
    initialize: function(/*Glide2List*/ list, tr) {
        GlideList2Row.prototype.initialize.call(this, list, tr);
    },
    type: 'GlideList2Header'
});
/**
* These are the static methods used to get a GlideList2 object for a list id or list element
*/
var GlideLists2 = {};
GlideList2.LIST_BODY_START = "<!--LIST_BODY_START-->";
GlideList2.LIST_BODY_END = "<!--LIST_BODY_END-->";
GlideList2.LOADING_MSG = "Loading...<img src='images/ajax-loader.gifx' alt='Loading...' style='padding-left: 2px;' />";
GlideList2.unload = function() {
    for (var id in GlideLists2) {
        var list = GlideLists2[id];
        list.destroy();
        GlideLists2[id] = null;
    }
    g_list = null;
    GlideLists2 = {};
    CustomEvent.un("print.grouped.headers", GlideList2.breakGroupHeader);
}
GlideList2.get = function(idOrElement) {
    if (typeof idOrElement == 'string')
        return GlideLists2[idOrElement];
    return GlideList2._getByElement(idOrElement);
}
GlideList2.getByName = function(name) {
    for (var id in GlideLists2) {
        var list = GlideLists2[id];
        if (list.getListName() == name)
            return list;
    }
    return null;
}
GlideList2._getByElement = function(element) {
    var e = $(element);
    if (!e)
        return null;
    var div;
    do {
        div = findParentByTag(element, 'div');
        if (!div)
            break;
        var type = getAttributeValue("type");
        if (type == "list_div")
            break;
    } while (div);
    if (!div)
        return null;
    return GlideLists2[div.id];
}
GlideList2.breakGroupHeader = function(checkedFlag) {
    var breakStyle = "auto";
    if (checkedFlag)
        breakStyle = "always";
    var tds =   document.getElementsByTagName("td");
    var len = tds.length;
    var first = true;
    for (var i = 0; i < len; i++) {
        var td = tds[i];
        if (getAttributeValue(td, "group_row_td") != "true")
            continue;
        if (first)
            first = false;
        else
            td.style.pageBreakBefore = breakStyle;
    }
    return false;
}
GlideList2.toggleAll = function(expandFlag) {
    for (var id in GlideLists2) {
        var list = GlideLists2[id];
        list.showHideList(expandFlag);
    }
}
/**
* The GlideList2 handler classes are called when an action is performed on a list so that
* any special handling can be performed by the handlers
*/
var GlideList2NewHandler = Class.create();
GlideList2NewHandler.prototype = {
    initialize: function() {
        CustomEvent.observe("list.handler", this.process.bind(this));
    },
    process: function(list, actionId, actionName) {
        if (actionName == "sysverb_new")
            list.addToForm("sys_id", "-1");
        return true;
    },
    type: 'GlideList2NewHandler'
};
var GlideList2ChecksHandler = Class.create();
GlideList2ChecksHandler.prototype = {
    initialize: function() {
        CustomEvent.observe("list.handler", this.process.bind(this));
    },
    process: function(list, actionId, actionName) {
        if (!actionName.startsWith("sysverb")) {
            var keys = ['No records selected', 'Delete the selected item?', 'Delete these', 'items?'];
            var msgs = new GwtMessage().getMessages(keys);
            if (list.checkedIds == '') {
                alert(msgs["No records selected"]);
                return false;
            }
            if (actionName == "delete_checked") {
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
    type: 'GlideList2ChecksHandler'
};
var GlideList2SecurityHandler = Class.create();
GlideList2SecurityHandler.prototype = {
    initialize: function() {
        CustomEvent.observe("list.handler", this.process.bind(this));
    },
    process: function(list, actionId, actionName) {
        var element = null;
        if (actionId)
            element = $(actionId);
        if (!element)
            element = $(actionName);
        if (element) {
            var gsftc = element.getAttribute('gsft_condition');
            if (gsftc != null && gsftc != 'true')
                return;
        }
        var sysIds = list.checkedIds;
        var ajax = new GlideAjax("AJAXActionSecurity");
        ajax.addParam("sys_target", list.getTableName());
        ajax.addParam("sys_action", actionId);
        ajax.addParam("sysparm_checked_items", sysIds);
        var xml = ajax.getXMLWait();
        var answer = {};
        var root = xml.getElementsByTagName("action_" + actionId)[0];
        var keys = root.childNodes;
        var validIds = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var id = key.getAttribute('sys_id');
            if (key.getAttribute('can_execute') == 'true')
                validIds.push(id);
        }
        if (validIds.length == sysIds.length)
            return true;
        if (validIds.length == 0) {
            var m = 'Security does not allow the execution of that action against the specified record';
            if (validIds.length > 1)
                m = m + 's';
            alert(m);
            return false;
        }
        var sysIds = sysIds.split(',');
        if (validIds.length != sysIds.length) {
            var m = 'Security allows the execution of that action against ' + validIds.length + ' of ' + sysIds.length + ' records. Proceed?';
            list.addToForm('sysparm_checked_items', validIds.join(','));
            return confirm(m);
        }
        return true;
    },
    type: 'GlideList2SecurityHandler'
};
/**
* A List Widget is a component that is associated with, but decoupled from, a list in that it can tell
* the list to do things and gets told when the list has been loaded/reloaded so that it can update itself
* to reflect the list changes.
*
* A widget is identified by a unique ID, typically a GUID that gets generated when the widget is
* being rendered.
*/
var GlideListWidget = Class.create();
GlideListWidget.prototype = {
    initialize: function(widgetID, listID) {
        this.widgetID = widgetID;
        this.listID = listID;
        GlideListWidgets[this.widgetID] = this;
        CustomEvent.observe('list.loaded', this.refresh.bind(this));
        CustomEvent.observe('partial.page.reload', this.refreshPartial.bind(this));
    },
    refresh: function(listTable, /*GlideList2*/ list) {
        if (list.listID != this.listID)
            return;
        this._refresh(listTable, list, true);
    },
    refreshPartial: function(listTable, /*GlideList2*/ list) {
        if (!list)
            return;
        if (list.listID != this.listID)
            return;
        this._refresh(listTable, list, false);
    },
    _refresh: function(listTable, /*GlideList2*/ list, /*boolean*/ isInitialLoad) {
    },
    _getElement: function(n) {
        return gel(this.widgetID + "_" + n);
    },
    _getValue: function(n) {
        var e = this._getElement(n);
        if (!e)
            return "";
        return e.value;
    },
    _setValue: function(n, v) {
        var e = this._getElement(n);
        if (!e)
            return;
        e.value = v;
    },
    _setInner: function(n, v) {
        var e = this._getElement(n);
        if (!e)
            return;
        e.innerHTML = v;
    },
    type: 'GlideListWidget'
}
var GlideListWidgets = {};
GlideListWidget.get = function(id) {
    return GlideListWidgets[id];
}

/**
* Manages a VCR widget associated with a list
*/
var GlideWidgetVCR = Class.create(GlideListWidget, {
    initialize: function(widgetID, listID) {
        GlideListWidget.prototype.initialize.call(this, widgetID, listID);
        this.backAllowed = false;
        this.nextAllowed = false;
        CustomEvent.observe("list_v2.orderby.update", this._updateOrderBy.bind(this));
    },
    gotoAction: function(action) {
        if (!this.backAllowed && ((action == 'first') || (action == 'back')))
            return;
        if (!this.nextAllowed && ((action == 'next') || (action == 'last')))
            return;
        var list = GlideList2.get(this.listID);
        var row;
        if (action == 'first')
            row = 1;
        else if (action == 'back')
            row = list.firstRow - list.rowsPerPage;
        else if (action == 'next')
            row = list.firstRow + list.rowsPerPage;
        else if (action == 'last')
            row = (list.totalRows + 1) - list.rowsPerPage;
        else
            return;
        list._refreshAjax(row, {}, true);
    },
    gotoRow: function(evt, row) {
        evt = getEvent(evt);
        if (!evt || evt.keyCode != 13)
            return;
        Event.stop(evt);
        if (isNaN(row))
            row = 1;
        var list = GlideList2.get(this.listID);
        list._refreshAjax(row, {}, true);
        return false;
    },
    _refresh: function(listTable, /*GlideList2*/ list) {
        if (list.totalRows == 0) {
            this._setVisible(false);
            return;
        }
        this._setVisible(true);
        this.backAllowed = (list.firstRow > 1);
        this.nextAllowed = (list.lastRow < list.totalRows);
        this._setRowNumbers(list);
        this._setAction('first', list, this.backAllowed);
        this._setAction('back', list, this.backAllowed);
        this._setAction('next', list, this.nextAllowed);
        this._setAction('last', list, this.nextAllowed);
    },
    _setRowNumbers: function(list) {
        this._setValue('first_row', list.firstRow);
        this._setInner('last_row', list.lastRow);
        this._setInner('total_rows', list.totalRows);
    },
    _setAction: function(n, list, flag) {
        var img = this._getElement(n);
        if (!img)
            return;
        if (flag) {
            addClassName(img, "pointerhand");
            this._removeDis(img);
        } else {
            removeClassName(img, "pointerhand");
            this._addDis(img);
        }
    },
    _removeDis: function(img) {
        var src = img.src;
        if (src.indexOf('_dis.gifx') != -1)
            img.src = src.replace(/\_dis\.gifx/i, ".gifx");
    },
    _addDis: function(img) {
        var src = img.src;
        if (src.indexOf('_dis.gifx') == -1)
            img.src = src.replace(/\.gifx/i, "_dis.gifx");
    },
    _setVisible: function(flag) {
        var e = this._getElement('widget');
        if (!e)
            return;
        if (flag)
            showObjectInline(e);
        else
            hideObject(e);
    },
    _updateOrderBy: function(orderBy){
        var list = GlideList2.get(this.listID);
        list.setOrderBy(orderBy);
    },
    type: 'GlideWidgetVCR'
});
/**
* Manages a Filter widget associated with a list
*/
var GlideWidgetFilter = Class.create(GlideListWidget, {
    initialize: function(widgetID, listID,  listName, query, pinned) {
        GlideListWidget.prototype.initialize.call(this, widgetID, listID);
        this.query = query;
        this.listName = listName;
        this.pinned = pinned;
        this.pinned = (pinned == 'true');
        this.openOnRefresh = false;
    },
    setMessages: function(msgs) {
        this.msgs = msgs;
    },
    setOpenOnRefresh: function() {
        this.openOnRefresh = true;
    },
    toggleFilter: function() {
        var e = this._getFilterDiv();
        if (!e)
            return;
        if (e.getAttribute('gsft_empty') == 'true') {
            this._loadFilter(e);
            return;
        }
        var showFlag = e.style.display == "none";
        this._filterDisplay(showFlag);
    },
    togglePin: function() {
        this.pinned = !this.pinned;
        if (this.pinned)
            setPreference('filter.pinned.' + this.listName, 'true');
        else
            deletePreference('filter.pinned.' + this.listName);
        this._setPinned(this.pinned);
    },
    _setPinned: function() {
        var e = gel(this.listName + "_pin");
        if (!e)
            return;
        if (this.pinned) {
            e.src = "images/pinned.png";
            e.alt = this.msgs["Unpin the filters"];
            e.title = this.msgs["Unpin the filters"];
            e.className = "toolbarImgActive";
        } else {
            e.src = "images/unpinned.png";
            e.alt = this.msgs["Pin the filters"];
            e.title = this.msgs["Pin the filters"];
            e.className = "toolbarImgDisabled";
        }
    },
    isPinned: function() {
        return this.pinned;
    },
    _refresh: function(listTable, /*GlideList2*/ list) {
        this._updateBreadcrumbs();
        if (!this.isPinned()) {
            this._filterDisplay(false);
            if (this.openOnRefresh)
                this.toggleFilter();
        }
        this.openOnRefresh = false;
        var query = list.getQuery({
            orderby: true
        });
        if (query == this.query)
            return;
        var filter = getThing(list.tableName, list.listID + "gcond_filters");
        if (filter && filter.filterObject) // if there already was a filter object, destroy it before we replace it
            filter.filterObject.setQueryAsync(query);
        this.query = query;
    },
    _updateBreadcrumbs: function() {
        var bc = gel(this.listID + "_breadcrumb");
        if (!bc)
            return;
        var bc_hidden = gel(this.listID + "_breadcrumb_hidden");
        if (!bc_hidden)
            return;
        if (!bc_hidden.innerHTML)// somehow this is called an extra time with blank html see PRB459401
            return;
        bc.innerHTML = bc_hidden.innerHTML;
        bc_hidden.innerHTML = "";
    },
    _filterDisplay: function(showFlag) {
        var e = this._getFilterDiv();
        if (!e)
            return;
        if (showFlag)
            showObject(e);
        else
            hideObject(e);
        e = gel(this.listID + "_filter_toggle_image");
        if (!e)
            return;
        if (showFlag) {
            e.src = "images/list_v2_filter_hide.gifx";
        } else {
            e.src = "images/list_v2_filter_reveal.gifx";
        }
        e.alt = this.msgs["Show / hide filter"];
    },
    _loadFilter: function(targetDiv) {
        this._filterDisplay(true);
        targetDiv.setAttribute('gsft_empty', 'false');
        var list = GlideList2.get(this.listID);
        var ajax = new GlideAjax("AJAXJellyRunner", "AJAXJellyRunner.do");
        ajax.addParam("template", "list2_filter_partial.xml");
        ajax.addParam("sysparm_widget_id", this.widgetID);
        ajax.addParam("sysparm_list_id", this.listID);
        ajax.addParam("sysparm_list_name", this.listName);
        ajax.addParam("sysparm_query_encoded", list.getQuery({
            groupby: true
        }));
        ajax.addParam("sysparm_table", list.getTableName());
        try {
            if(getTopWindow().Table.isCached(list.getTableName(), null))
                ajax.addParam("sysparm_want_metadata", "false");
            else
                ajax.addParam("sysparm_want_metadata", "true");
        } catch(e) {
            ajax.addParam("sysparm_want_metadata", "true");
        }
        var related = list.getRelated();
        if (related)
            ajax.addParam("sysparm_is_related_list", "true");
        ajax.addParam("sysparm_filter_pinned", this.pinned);
        list = null;
        ajax.getXML(this._loadFiltersResponse.bind(this), null, targetDiv);
    },
    _loadFiltersResponse: function(response, targetDiv) {
        var html = response.responseText;
        targetDiv.innerHTML = html;
        html.evalScripts(true);
        this._setPinned();
        var n = targetDiv.id.substring(0, targetDiv.id.length - "filterdiv".length);
        columnsGet(n);
        refreshFilter(n);
        _frameChanged();
    },
    _getFilterDiv: function() {
        return gel(this.listName + "filterdiv");
    },
    type: 'GlideWidgetFilter'
});
/**
* Manages the select list of actions for a list
*/
var GlideWidgetActions = Class.create(GlideListWidget, {
    initialize: function(widgetID, listID, ofText) {
        GlideListWidget.prototype.initialize.call(this, widgetID, listID);
        this.ofText = ofText;
        this.securityActions = {};
    },
    _refresh: function(listTable, /*GlideList2*/ list) {
        this.securityActions = {};
        list._setTheAllCheckbox(false);
    },
    /**
* Determine which of the checked ids each of the actions can run against.
*
* When the list option select box is opened, for each list action (actually, those that
* have a 'gsft_is_action' attribute of 'true') a determination is made as to which of the
* checked sys_ids the action can be run against, based on security.  The gsft_check_condition
* attribute is set to false if we can determine that the action is valid for all sys_ids.
* It is set to true if we must ask the server if the action is valid for each sys_id.
*
* If an action is not valid for all of the checked sys_ids, then the label for that action
* is changed to:
*
*       gsft_base_label (x of y)
*
* where gsft_base_label is an attribute of the action option.
*/
    actionCheck: function(select) {
        if (select.getAttribute('gsft_sec_check') == 'true')
            return;
        select.setAttribute('gsft_sec_check', 'true');
        var actions = [];
        var sysIds = [];
        var list = GlideList2.get(this.listID);
        var checkedIds = list.getChecked();
        if (checkedIds)
            sysIds = checkedIds.split(",");
        var options = select.options;
        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            if (getAttributeValue(opt, 'gsft_is_action') != 'true')
                continue;
            if (this._checkAction(opt, sysIds))
                actions.push(opt);
        }
        if (actions.length > 0) {
            var actionIds = [];
            for (var i = 0; i < actions.length; i++)
                actionIds.push(actions[i].id);
            this._canExecute(actionIds, sysIds, list.tableName);
            for (var i = 0; i < actions.length; i++) {
                var opt = actions[i];
                var validIds = this.securityActions[opt.id];
                opt.style.color = "";
                if (!validIds || (validIds.length == 0)) {
                    opt.style.color = '#777';
                    opt.disabled = true;
                } else if (validIds.length == sysIds.length)
                    opt.disabled = false;
                else {
                    opt.disabled = false;
                    opt.innerHTML = getAttributeValue(opt, 'gsft_base_label') + ' (' + validIds.length + ' ' + this.ofText + ' ' + sysIds.length + ')';
                    opt.setAttribute('gsft_allow', validIds.join(','));
                }
            }
        }
        select.focus(); // IE6 closes the select when it is changed - focus reopens it
    },
    _checkAction: function(opt, /*[]*/ sysIds) {
        if (sysIds.length == 0) {
            opt.disabled = true;
            opt.style.color = '#777';
            return false;
        }
        if (getAttributeValue(opt, 'gsft_check_condition') != 'true') {
            opt.disabled = false;
            opt.style.color = '';
            return false;
        }
        return true;
    },
    _canExecute: function(actionIds, sysIds, tableName) {
        var ajax = new GlideAjax("AJAXActionSecurity");
        ajax.addParam("sys_target", tableName);
        ajax.addParam("sys_action", actionIds.join(","));
        ajax.addParam("sysparm_checked_items", sysIds.join(','));
        var xml = ajax.getXMLWait();
        var answer = {};
        for (var n = 0; n < actionIds.length; n++) {
            var actionId = actionIds[n];
            var root = xml.getElementsByTagName("action_" + actionId)[0];
            var keys = root.childNodes;
            this.securityActions[actionId] = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var id = key.getAttribute('sys_id');
                if (key.getAttribute('can_execute') == 'true')
                    this.securityActions[actionId].push(id);
            }
        }
    },
    /**
* Run the selected action unless it is not actionable (value == '' or id == 'ignore)
*/
    runAction: function(select) {
        var opt = getSelectedOption(select);
        if (!opt)
            return false;
        if (opt.id == 'ignore' || !opt.value)
            return false;
        if (opt.disabled)
            return false;
        var list = GlideList2.get(this.listID);
        if (!list)
            return false;
        var id = opt.id;
        var name = getAttributeValue(opt, 'action_name');
        if (!name)
            name = id;
        if (getAttributeValue(opt, 'client') == 'true') {
            g_list = list;
            var href = getAttributeValue(opt, 'href');
            eval(href);
            g_list = null;
        } else {
            var ids = opt.getAttribute('gsft_allow');
            list.action(id, name, ids);
        }
        return false;
    },
    type: 'GlideWidgetActions'
});
/**
* Manages a Goto/Search widget associated with a list
*/
var GlideWidgetSearch = Class.create(GlideListWidget, {
    initialize: function(widgetID, listID, focusOnRefresh, gotoMsg, searchMsg) {
        GlideListWidget.prototype.initialize.call(this, widgetID, listID);
        this.gotoMsg = gotoMsg;
        this.searchMsg = searchMsg;
        this.field = "";
        this.focusOnRefresh = (focusOnRefresh == 'true');
    },
    _refresh: function(listTable, /*GlideList2*/ list, /*boolean*/ isInitialLoad) {
        var field = list.sortBy;
        if (!field)
            field = 'zztextsearchyy';
        this._setSelect(field);
        this._setTitle();
        this._clearText();
        if (this.focusOnRefresh) {
            var e = this._getElement("text");
            try {
                e.focus();
            }
            catch(er){}
        }
    },
    searchKeyPress: function(evt) {
        evt = getEvent(evt);
        if (!evt || evt.keyCode != 13)
            return;
        Event.stop(evt);
        return this.search();
    },
    search: function() {
        var select = new Select(this._getElement('select'));
        var field = select.getValue();
        var value = this._getValue("text");
        var list = GlideList2.get(this.listID);
        var parms = {};
        parms['sysparm_goto_query'] = value;
        parms['sysparm_goto_field'] = field;
        parms['sys_target'] = list.tableName;
        parms['sysparm_userpref.' + list.tableName + '.db.order'] = field;
        parms['sysparm_query'] = list.getQuery({
            groupby: true
        });
        CustomEvent.fire('list_v2.orderby.update', field);
        this._clearText();
        list.refresh(1, parms);
        return false;
    },
    setTitle: function() {
        this._setTitle();
    },
    _clearText: function() {
        this._setValue('text', '');
    },
    _setSelect: function(field) {
        var select = new Select(this._getElement('select'));
        if (select.contains(field))
            select.selectValue(field);
    },
    _setTitle: function() {
        var opt = getSelectedOption(this._getElement('select'));
        if (!opt) {
            this._setInner('title', this.gotoMsg)
            return;
        }
        if (opt.value == 'zztextsearchyy')
            this._setInner('title', this.searchMsg);
        else
            this._setInner('title', this.gotoMsg);
    },
    type: 'GlideWidgetSearch'
});
/**
* Hides the specified elements when the list has no rows
*/
var GlideWidgetHideOnEmpty = Class.create(GlideListWidget, {
    /**
* ids - comma-separated list of element ids to hide
*        ids should be specified without listID prefix
*        for example,
*           ids = "span1,span2"
*
*        would hide <listID>_span1 and <listID>_span2
*/
    initialize: function(widgetID, listID, ids) {
        GlideListWidget.prototype.initialize.call(this, widgetID, listID);
        this.ids = ids.split(',');
    },
    _refresh: function() {
        var list = GlideList2.get(this.listID);
        var empty = (list.totalRows == 0);
        for (var i = 0; i < this.ids.length; i++) {
            if (empty)
                hide(this.listID + "_" + this.ids[i]);
            else
                show(this.listID + "_" + this.ids[i]);
        }
    },
    type: 'GlideWidgetHideOnEmpty'
});
/**
* Filter utility support for GlideList2 lists
*
* @author jay.berlin
*/
function runFilterV2Lists(name, filter) {
    var list = GlideList2.get(name);
    if (!list) {
        list = GlideList2.getByName(name);
    }
    if (list)
        list.setFilterAndRefresh(filter);
}
GlideList2.saveFilter = function(listID, listName) {
    var list = GlideList2.get(listID);
    var siname = gel('save_filter_name');
    if (!siname || !siname.value || siname.value.length <= 0) {
        var msg = new GwtMessage().getMessage("Enter a name to use for saving the filter");
        alert(msg);
        siname.focus();
        return;
    }
    var filter = getFilter(listName);
    var visibility = getFilterVisibility();
    var groupBy = list.getGroupBy();
    if (groupBy)
        filter += "^" + groupBy;
    var parms = {};
    parms['filter_visible'] = visibility;
    parms['save_filter_query'] = filter;
    parms['save_filter_name'] = siname.value;
    parms['sys_target'] = list.getTableName();
    parms['sys_action'] = 'sysverb_save_filter';
    list.submit(parms);
}
GlideList2.setDefaultFilter = function(listID, listName) {
    var filter = getFilter(listName, false);
    GlideList2.get(listID).setDefaultFilter(filter);
}
var refreshRateProperty = "60";
var refreshLabelRate = (refreshRateProperty != null && refreshRateProperty > 0? refreshRateProperty : 60);
var refreshLabelTimer = null;
var g_label_status = initLabelStatus();
CustomEvent.observe('nav.loaded', refreshLabels);
function initLabelStatus() {
    var answer = new Object();
    answer.loading = false;
    answer.error_count = 0; // number of sequential errors (not total errors)
    return answer;
}
function refreshLabels() {
    var labelList = new Array();
    var divTags = document.getElementsByTagName('div');
    if (divTags) {
        for(var c=0;c != divTags.length; ++c) {
            var divTag = divTags[c];
            var label = divTag.sclabel || divTag.getAttribute('sclabel');
            if (label && label == 'true') {
                var id = divTag.appid || divTag.getAttribute('appid');
                labelList.push(id);
            }
        }
    }
    startRefresh(labelList);
}
function clearLabelRefresh() {
    if (refreshLabelTimer == null)
        return;
    clearTimeout(refreshLabelTimer);
    refreshLabelTimer = null;
}
function startRefresh(labelRefresh) {
    clearLabelRefresh();
    if (labelRefresh.length < 1)
        return;
    if (labelsGetRequest(labelRefresh))
        refreshLabelTimer = setTimeout(refreshLabels, refreshLabelRate * 1000);
}
function labelsGetRequest(labelIds) {
    if (g_label_status.loading) // if we're already loading, don't send another transaction
        return true; // we'll try again later
    if (g_label_status.error_count > 3) { // if we errored 3 times in a row, we're done until somebody refreshes the navigator
        jslog('Stopped label fetch due to excessive error counts');
        return false; // we're done (stop polling)
    }
    g_label_status.loading = true;
    var aj = new GlideAjax("LabelsAjax");
    aj.addParam("sysparm_value", labelIds.join(","));
    aj.addParam("sysparm_type", 'get');
    aj.getXML(labelsGetResponse);
    return true;
}
function labelsGetResponse(request) {
    g_label_status.loading = false;
    if (request.status == 200)
        g_label_status.error_count = 0;
    else
        g_label_status.error_count += 1;
    if (!request.responseXML)
        return;
    var labels = request.responseXML.getElementsByTagName("label");
    if (labels && labels.length > 0 ) {
        for (var i = 0; i < labels.length; i++) {
            var labelEntry = labels[i];
            updateMenuItems(labelEntry);
        }
    }
}
function updateMenuItems(labelElement) {
    var appid = labelElement.getAttribute("id");
    var divElem = gel('div.' + appid)
    var tds = divElem.getElementsByTagName("td");
    var appTD = tds[0];
    var notRead = 0;
    var span = gel(appid);
    var table = cel("table");
    var tbody = cel("tbody", table);
    var label;
    var items = labelElement.getElementsByTagName("item");
    if (items && items.length > 0 ) {
        for (var i=0; i < items.length; i++) {
            label = items[i].getAttribute("label");
            var lid = items[i].getAttribute("name");
            var style = items[i].getAttribute("style");
            var read = items[i].getAttribute("read");
            if ("true" != read)
                notRead++;
            var url = items[i].getAttribute("url");
            var title = items[i].getAttribute("title");
            var image = items[i].getAttribute("image");
            createLabelMod(tbody, style, lid, url, title, image, appid);
        }
    }
    updateLabelReadCount(appTD, notRead);
    clearNodes(span)
    span.appendChild(table);
    table = null;
}
function createLabelMod(parent, style, id, url, title, image, appid) {
    var tr = cel("tr", parent);
    if (image == "images/s.gifx")
        image = "images/scroll_rt.gifx";
    var img;
    if (image == null || image == '')
        img = '<img style="width:16px; cursor:hand" src="images/icons/remove.gifx" alt="Click me to remove the label entry" onmouseover="this.src = \'images/closex_hover.gifx\'" onmouseout="this.src = \'images/icons/remove.gifx\'" src="images/icons/remove.gifx"/>';
    else
        img = "<img style='width:16px' src='"+image+"' alt='' />";
    var tdimg = cel("td", tr);
    tdimg.style.width = "16px";
    var tdhtml;
    if (image == 'images/scroll_rt.gifx')
        tdhtml = img;
    else
        tdhtml = '<a onclick="removeLabel(\'' + appid + '\',\'' + id + '\');" onmouseover="this.src = \'images/closex_hover.gifx\'" onmouseout="this.src = \'images/icons/remove.gifx\'" title="Click me to remove the label entry">' + img+'</a>';
    tdimg.innerHTML = tdhtml;
    var td = cel("td", tr);
    var html = '<a class="menulabel" style="' + style + '" id= "' + id + '"';
    html += ' onclick="setAppLink(event);" target="gsft_main" href="' + url +'">'+ title +'</a>';
    td.innerHTML = html;
    tr = null;
    tdimg = null;
    td = null;
}
function updateLabelReadCount(appTD, notRead) {
    var inner = appTD.innerHTML;
    var term = '</H2>';
    var paren = inner.indexOf("</H2>");
    if (paren < 0) {
        paren = inner.indexOf("</h2");
        term = '</h2>';
    }
    if (paren > -1 ) {
        inner = inner.substring(0, paren);
        paren--;
        var c = inner.substring(paren,paren+1);
        if (c == ')') {
            while (paren > 0 && c != '(') {
                paren--;
                c = inner.substring(paren,paren+1)
            }
            if (paren > 0 ) {
                inner = inner.substring(0, paren);
            }
        }
        inner = trim(inner);
        if (notRead > 0)
            inner = inner + ' (' + notRead + ')';
        inner = inner + term;
        clearNodes(appTD);
        appTD.innerHTML = inner;
    }
}
function doAssignLabel(tableName, label, sysId) {
    var form = getFormByTableName(tableName);
    if (sysId == null || !sysId) {
        if (!populateParmQuery(form, '', 'NULL'))
            return false;
    } else {
        addInput(form, 'HIDDEN', 'sysparm_checked_items', sysId); // only one
    }
    if (!label && typeof option != 'undefined' && option.getAttribute("gsft_base_label"))
        label = option.getAttribute("gsft_base_label");
    addInput(form, 'HIDDEN', 'sys_action', 'java:com.glide.labels.LabelActions');
    addInput(form, 'HIDDEN', 'sys_action_type', 'assign_label');
    addInput(form, 'HIDDEN', 'sysparm_label_picked', label);
    form.submit();
}
function doRemoveLabel(tableName, label, sysId) {
    var form = getFormByTableName(tableName);
    if (sysId == null || !sysId) {
        if (!populateParmQuery(form, '', 'NULL'))
            return false;
    } else {
        addInput(form, 'HIDDEN', 'sysparm_checked_items', sysId); // only one
    }
    if (!label && typeof option != 'undefined' && option.getAttribute("gsft_base_label"))
        label = option.getAttribute("gsft_base_label");
    addInput(form, 'HIDDEN', 'sys_action', 'java:com.glide.labels.LabelActions');
    addInput(form, 'HIDDEN', 'sys_action_type', 'remove_label');
    addInput(form, 'HIDDEN', 'sysparm_label_picked', label);
    form.submit();
}
function newLabelPrompt(tableName) {
    var keys = ["Please enter the name for the new label", "New label"];
    var msgs = new GwtMessage().getMessages(keys);
    gsftPrompt(msgs["New label"], msgs["Please enter the name for the new label"], function(labelName) {
        doAssignLabel(tableName, labelName, null)
    } );
}
function newLabel(tableName, sysID, /*optional*/ callback) {
    var keys = ["Please enter the name for the new label", "New label"];
    var msgs = new GwtMessage().getMessages(keys);
    if (!callback)
        gsftPrompt(msgs["New label"], msgs["Please enter the name for the new label"],  function(labelName) {
            newLabelRequest(tableName, labelName, sysID)
            } );
    else
        gsftPrompt(msgs["New label"], msgs["Please enter the name for the new label"],  callback);
}
function newLabelRequest(tableName, labelName, sysID) {
    if (labelName == null)
        return;
    var viewName;
    var view = gel('sysparm_view');
    if (view != null)
        viewName = view.value;
    assignLabel(labelName, tableName, sysID, viewName);
}
/**
* Assign a label to one or more sysIDs
*
* @param labelName - name of label to assign
* @param tableName - name of table for the sysID(s)
* @param sysID     - comma-separated list of sysIDs to assign label to
* @param viewName  - name of the view for the label assignment
*/
function assignLabel(labelName, tableName, sysId, viewName) {
    var url = new GlideAjax("LabelsAjax");
    url.addParam("sysparm_name", tableName);
    url.addParam("sysparm_value", sysId);
    url.addParam("sysparm_chars", labelName);
    url.addParam("sysparm_type", "create");
    if (viewName)
        url.addParam("sysparm_view", viewName);
    url.getXML(refreshNav);
}
/**
* Remove one or more labels and refresh the navigator menu application when done to reflect
* the changes
*
* @param appid - the sys_id of the application that represents the label (if blank, then the navigator menu is refreshed
*                   instead of just refreshing one application)
* @param labelid - comma-separated list of label_entry sys_ids to remove
*/
function removeLabel(appid, labelid) {
    var aj = new GlideAjax("LabelsAjax");
    aj.addParam("sysparm_name", appid);
    aj.addParam("sysparm_value", labelid);
    aj.addParam("sysparm_type", 'delete');
    aj.getXML(removeLabelResponse);
}
/**
* Remove one or more labels by name from a list of sys_ids and refresh the navigator menu
* application when done to reflect the changes
*
* @param labelName - name of the label to remove
* @param sysId - comma-separated list of sys_ids to remove the label from
*/
function removeLabelByName(labelName, sysId) {
    var aj = new GlideAjax("LabelsAjax");
    aj.addParam("sysparm_name", labelName);
    aj.addParam("sysparm_value", sysId);
    aj.addParam("sysparm_type", 'removeByName');
    aj.getXML(refreshNav);
}
function removeLabelResponse(response, args) {
    var labelId = response.responseXML.documentElement.getAttribute("sysparm_name");
    if (!labelId)
        refreshNav();
    else {
        var labelIds = new Array();
        labelIds.push(labelId);
        labelsGetRequest(labelIds);
    }
}
var g_currency_list = ['currency_as_entered','currency_session','currency_reference'];
function currencyToggle() {
    currencyIncrement();
    currencyDisplay();
}
function currencyDisplay() {
    var active = g_currency_list.indexOf(g_currency_display);
    for (var i = 0; i < g_currency_list.length; i++) {
        var list = getCurrencyList(g_currency_list[i]);
        toggleCurrencyList(list, i == active);
    }
}
function currencyIncrement() {
    var active = g_currency_list.indexOf(g_currency_display);
    active = ++active % g_currency_list.length;
    g_currency_display = g_currency_list[active];
    setPreference('currency_display', g_currency_display);
}
function toggleCurrencyList(list, active) {
    var disp = active ? '' : 'none';
    for (var i = 0; i < list.length;i++)
        list[i].style.display = disp;
}
function getCurrencyList(name) {
    return $(document.body).select("." + name);
}
function currencyURL(table, field) {
    return 'sysparm_query=table=' + table + '^field=' + field + '^id=$sys_id';
}
function editPrice(table, field) {
    var url = 'fx_price.do?' + currencyURL(table, field) + '^parent=NULL';
    checkSaveURL(table, url);
}
function editCurrency(table, field) {
    var url = 'fx_currency_instance.do?' + currencyURL(table, field);
    checkSaveURL(table, url);
}

/**
* API for dealing with the list when doing List Editing
*
* Also supports when the list is in 'save_with_form' mode and manages
* the serialization and deserialization of the modified list data as part of g_form
* (g_form MUST exist in this case).
*
* TODO: Combine this class with GlideList so that there is one class managing all aspects of the list
*/
var GlideListEditor = Class.create();
GlideListEditor.prototype = {
    PROCESSOR: 'com.glide.ui_list_edit.AJAXListEdit',
    MSGS: [
    'Delete', 'Mark deleted', 'Undelete', 'New row'
    ],
    initialize: function(tableElementDOM) {
        this.msgs = new GwtMessage().getMessages(this.MSGS);
        this.errorMsg = "";
        this.tableName = getAttributeValue(tableElementDOM, "glide_table");
        this.tableLabel = getAttributeValue(tableElementDOM, "glide_table");
        this.tableElementDOM = tableElementDOM; // table DOM element
        this.records = {};                      // data that we know about in the table (saved edits, etc.)
        this.generatedSysId = null;
        this.markDirty = false;                 // flag indicating if we should mark modified cells with the dirty indicator or not
        this._initTable();
        this.initRows();
        this._load();
    },
    initRows: function(tableElementDOM) {
        if (tableElementDOM)
            this.tableElementDOM = tableElementDOM;
        this._getSysIdToRowMapping();
        this._getAggregates();
    },
    /* --------------------------------------------------------------------
*  Record/field management
* ------------------------------------------------------------------ */
    /**
* Get a GlideRecord that interacts with this list.  When performing
* GlideRecord operations such as insert, delete and update the list
* will be updated with the requests instead of saving the data at
* the server.  Query is not supported at this time.
*
* initGlideRecord is called to get all of the data for the list
* asynchronously and getGlideRecord is called to return a GlideRecord
* like class that is used to iterate the list data and performs inserts,
* updates and deletes to the list.
*/
    initGlideRecord: function(callback) {
        this.getValuesFromQuery(this.tableName, this.query, this.fields, callback);
    },
    getGlideRecord: function() {
        return new GlideListRecord(this);
    },
    /**
* Get the value of a field within a record
*
* Note: if we have not modified the field yet, the value is not known.
*/
    getValue: function(sysId, fieldName) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return "";
        return field.getValue();
    },
    /**
* Get the display value of a field within a record (value and displayValue are used to control
* what is used at the server to update the field.  If value is set, then setValue() is used.
* If displayValue is set, setDisplayValue() is used.  Display values are used for dates and times
* so that the server will properly convert the entered date/time based on the user's time zone.)
*
* Note: if we have not modified the field yet, the value is not known.
*/
    getDisplayValue: function(sysId, fieldName) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return "";
        return field.getDisplayValue();
    },
    getRenderValue: function(sysId, fieldName) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return "";
        return field.getRenderValue();
    },
    /**
* Is the field within a record writable based on security
*/
    isWritable: function(sysId, fieldName) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return false;
        return field.isWritable();
    },
    setValue: function(sysId, fieldName, value) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return null;
        var oldValue = field.getValue();
        this._callOnChange(sysId, fieldName, oldValue, value);
        field.setValue(value);
        this.aggregates.updateAggregates(fieldName, oldValue, value);
        return field;
    },
    setDisplayValue: function(sysId, fieldName, value) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return null;
        var oldValue = field.getDisplayValue();
        this._callOnChange(sysId, fieldName, oldValue, value);
        field.setDisplayValue(value);
        this.aggregates.updateAggregates(fieldName, oldValue, value);
        return field;
    },
    setRenderValue: function(sysId, fieldName, value) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return null;
        field.setRenderValue(value);
        return field;
    },
    /**
* Determine if we can write to all of the specified fields of the specified record
*/
    checkSecurity: function(id, fields) {
        var record = this.records[id];
        if (!record)
            return false;
        return this._canWriteToFields(record, fields);
    },
    /**
* Render a value in the correct cell for a sysId and field.
*
* If you specify 'valueToDisplay'
*     then that will be be used
*
* If you have called setRenderValue on the field
*    then the render value will be used
*
* If you have called setDisplayValue on the field
*    then the display value will be used
*
* If you have called setValue on the field
*    then the value will be used
*
* Otherwise, the field's first non-blank value will be used (in order of render, display, value)
*/
    renderValue: function(sysId, fieldName, valueToDisplay) {
        var dspValue = "";
        if (typeof valueToDisplay != "undefined")
            dspValue = valueToDisplay;
        else
            var dspValue = this._getValueToRender(sysId, fieldName);
        var e = this.getCell(sysId, this.tableName + "." + fieldName);
        if (!e)
            return;
        e.innerHTML = "";
        if (typeof e.innerText != 'undefined')
            e.innerText = dspValue;
        else
            e.textContent = dspValue;
        var field = this._getField(sysId, fieldName);
        if (this.markDirty && field && (field.isValueSet() || field.isDisplayValueSet()))
            addClassName(e, 'list_edit_dirty');
    },
    /* --------------------------------------------------------------------
*   List aggregation methods
* ------------------------------------------------------------------ */
    /**
* Get an aggregate for a field (such as 'SUM', 'AVG', 'MIN' or 'MAX')
*
* Returns null if there is no aggregate for the field
*/
    getAggregate: function(fieldName, type) {
        return this.aggregates.getAggregateValue(fieldName, type);
    },
    /* --------------------------------------------------------------------
*   List editing management methods
* ------------------------------------------------------------------ */
    /**
* Apply any previous updates/adds/deletes to the list so that the changes are persisted
* on the list (called after a list refresh)
*/
    applyUpdates: function() {
        for (var id in this.records) {
            var record = this.records[id];
            if (record.operation == "add") {
                if (!this.sysIdsToRows[id])
                    this._addRowWithRecord(record);
                else
                    this._updateRowWithRecord(record);
            } else if (record.operation == "update") {
                this._updateRowWithRecord(record);
            } else if (record.operation == "delete") {
                this._updateRowWithRecord(record);
                this._deleteRowWithRecord(record);
            } else if (record.operation == "delete_pending") {
                this._updateRowWithRecord(record);
                this._deleteRowWithRecord(record);
            }
        }
    },
    /**
* Get number of records in the list
*/
    getRowCount: function() {
        var count = this.rowCount;
        for (var id in this.records) {
            var record = this.records[id];
            if (record.operation == "add")
                count++;
            else if ((record.operation == "delete") || (record.operation == "delete_pending"))
                count--;
        }
        return count;
    },
    /**
* Get number of records in the list
*/
    getDeletedRowCount: function() {
        var count = 0;
        for (var id in this.records) {
            var record = this.records[id];
            if ((record.operation == "delete") || (record.operation == "delete_pending"))
                count++;
        }
        return count;
    },
    /**
* Get number of records in the list
*/
    getAddedRowCount: function() {
        var count = 0;
        for (var id in this.records) {
            var record = this.records[id];
            if (record.operation == "add")
                count++;
        }
        return count;
    },
    /**
* Return an array of sysIds for each of the rows that are currently displayed
* on the list.
*/
    getSysIds: function() {
        return this.sysIds;
    },
    /**
* Return an array of fields that are displayed on the list (without the leading tableName. prefix)
*/
    getFieldNames: function() {
        return this.fields;
    },
    /**
* Return the TD element for a sysId and fully-qualified field name (field name is
* table.field_name and can be dot-walked field name)
*/
    getCell: function(sysId, fieldName) {
        var col = this.headersByName[fieldName];
        if (!col)
            return null;
        var row = this.getRow(sysId);
        if (!row)
            return null;
        return row.cells[col];
    },
    getRecord: function(sysId) {
        return this.records[sysId];
    },
    getRecordOperation: function(sysId) {
        var r = this.getRecord(sysId);
        if (r)
            return r.operation;
        return "";
    },
    getRow: function(sysId) {
        var row = this.sysIdsToRows[sysId];
        if (!row)
            return null;
        return this.tableElementDOM.rows[row];
    },
    /**
* Get the last error message associated with any AJAX calls for the list
*/
    getError: function() {
        return this.errorMsg;
    },
    /**
* Return the field name based on a column index
*/
    getNameFromColumn: function(ndx) {
        return this.headers[ndx];
    },
    /**
* Add a new row to the list
* Get the default values and security settings for a new record from the server for
* the first row being added (we can reuse that information for any additional rows as needed)
*/
    addRow: function() {
        if (this.ajax) {
            this.rowsToAdd++;
            return;
        }
        this.addRowWithValues({}, {});
    },
    /**
* Add a new row to the list and set any specified values/display values that are supplied
* and set the rest of the values to their default value.
*/
    addRowWithValues: function(/*{}*/ values, /*{}*/ displayValues) {
        g_form.fieldChanged("new_row", true);
        this.records["-1"] = null;
        this.getValues(this.tableName, ["-1"], this.fields, this._addRow.bind(this, values, displayValues));
    },
    /**
* Toggle the delete state of a record
*/
    deleteRowToggle: function(sysId) {
        var img = gel('delete_row_' + sysId);
        var record = this.records[sysId];
        if (record && record.operation == "delete_pending")
            return;
        if (!record)
            record = this._addRecord(sysId, "delete_pending");
        g_form.fieldChanged("delete_row", true);
        if (record.operation == "delete") {
            this._undeleteRow(record);
            if (img) {
                img.src = "images/delete_row.gifx";
                img.alt = this.msgs['Mark deleted'];
                img.title = this.msgs['Mark deleted'];
            }
            var tr = this.getRow(sysId);
            if (tr)
                this._removeClassFromRow(tr, "list_delete");
        } else if (record.operation == "add") {
            var row = this.sysIdsToRows[sysId];
            this.tableElementDOM.deleteRow(row);
            delete this.records[sysId];
            this._getSysIdToRowMapping();
            this.aggregates.rowCountChanged(-1);
            this._removeFromAggregates(record);
            this.saveValuesInForm();
        } else {
            record.operation = "delete_pending";
            this.saveValuesInForm();
            if (img) {
                img.src = "images/loading_anim2.gifx";
                img.alt = new GwtMessage().getMessage('Loading...');
            }
            var tr = this.getRow(sysId);
            if (tr)
                this._addClassToRow(tr, "list_delete");
            this.getValues(this.tableName, [sysId], this.aggregates.getAggregateFields(), this._deleteRow.bind(this, sysId));
        }
    },
    /* --------------------------------------------------------------------
*  Serialization/deserialization methods
* ------------------------------------------------------------------ */
    /**
* Save the data that we know about in an xml island in the associated form
*/
    saveValuesInForm: function() {
        addHidden(this._getForm(), this._getXmlIslandName(), this.serialize());
    },
    /**
* Save the data that has changed in an xml island in the associated form
*/
    saveUpdatesInForm: function() {
        addHidden(this._getForm(), this._getXmlIslandName(), this.serializeModified());
    },
    /**
* Serialize all fields that we have values into an xml document
*/
    serialize: function() {
        var ids = [];
        for (var id in this.records)
            ids.push(id);
        return this._serialize(ids, true);
    },
    /*
* Serialize records where fields are updated into an xml document
*/
    serializeModified: function() {
        var ids = [];
        for (var id in this.records) {
            var record = this.records[id];
            if ((record.operation == "add") || (record.operation == "delete") || (record.oepration == "delete_pending")) {
                ids.push(id);
                continue;
            }
            var fields = this.records[id].getFields();
            for (var n in fields) {
                var field = fields[n];
                if (field.isModified()) {
                    ids.push(id);
                    break;
                }
            }
        }
        return this._serialize(ids, false);
    },
    /*
* Serialize records where all fields are writable into an xml document
*/
    serializeWritable: function() {
        var ids = [];
        for (var id in this.records) {
            var fields = this.records[id].getFields();
            var fieldsArr = [];
            for (var n in fields)
                fieldsArr.push(n);
            if (this.checkSecurity(id, fieldsArr))
                ids.push(id);
        }
        return this._serialize(ids, false);
    },
    deserialize: function(xml) {
        var items = xml.getElementsByTagName("record");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var sysId = item.getAttribute("sys_id");
            var record = this.records[sysId];
            if (!record) {
                record = this._addRecord(sysId, item.getAttribute("operation"));
            }
            var fields = item.getElementsByTagName("field");
            for (var j = 0; j < fields.length; j++) {
                var fieldItem = fields[j];
                var n = fieldItem.getAttribute("name");
                var field = record.addField(n);
                field.deserialize(fieldItem);
            }
        }
    },
    clearModified: function() {
        for (var id in this.records)
            this.records[id].clearModified();
    },
    _deleteRow: function(sysId) {
        var record = this.records[sysId];
        if (!record)
            return;
        record.operation = "delete";
        this._deleteRowWithRecord(record);
        this.saveValuesInForm();
    },
    _deleteRowWithRecord: function(record) {
        var sysId = record.sysId;
        var img = gel("delete_row_" + sysId);
        if (img) {
            img.src = "images/undelete_row.gifx";
            img.alt = this.msgs['Undelete'];
            img.title = this.msgs['Undelete'];
        }
        var row = this.getRow(sysId);
        if ((row) && (!hasClassName(row, "list_delete")))
            this._addClassToRow(row, "list_delete");
        this._removeFromAggregates(record);
    },
    _undeleteRow: function(record) {
        record.operation = "update";
        this._addToAggregates(record);
        this.saveValuesInForm();
    },
    _addRow: function(values, displayValues) {
        this._addRecord(null, null, values, displayValues);
    },
    _addRow0: function(record, values, displayValues) {
        this._setDefaults(record);
        for (var v in values) {
            var field = record.addField(v);
            field.setValue(values[v]);
        }
        for (var v in displayValues) {
            var field = record.addField(v);
            field.setDisplayValue(displayValues[v]);
        }
        this._addRowWithRecord(record);
        this.saveValuesInForm();
    },
    _addRowWithRecord: function(record) {
        var rows = this.tableElementDOM.rows;
        var row = rows[this.lastRow];
        var cellCnt = 0;
        for (var i = 0; i < row.cells.length; i++)
            cellCnt += row.cells[i].colSpan;
        var className = "";
        this.lastRow++;
        var tr = this.tableElementDOM.insertRow(this.lastRow);
        tr.id = record.sysId;
        if ((tr.rowIndex % 2) == 0)
            className = "list_even";
        else
            className = "list_odd";
        tr.className = className;
        for (var i = 0; i < cellCnt; i++) {
            var td = tr.insertCell(i);
            if (i == 0) {
                if (this.version == 1)
                    this._addDeleteIcon(td, record, 'item_action');
                else
                    this._addIcons(td, record, 'list_decoration', className);
            } else if ((this.version == 1) && (i == 1)) {
                this._addNewRowIcon(td, record, 'item_action');
            } else {
                td.innerHTML = "&nbsp;";
                var fname = this.getNameFromColumn(i);
                if (fname) {
                    addClassName(td, "vt");
                    addClassName(td, "list_edit_dirty");
                    setAttributeValue(tr,'sys_id', record.sysId);
                    var element = TableElement.get(fname);
                    if (element && (element.getChoice() == "0") && g_form.isNumeric(element.getType()))
                        td.style.textAlign = "right";
                }
            }
        }
        this._addClassToRow(tr, "list_add");
        this._getSysIdToRowMapping();
        var fields = record.getFields();
        for (var n in fields)
            this.renderValue(record.sysId, n);
        this.aggregates.rowCountChanged(1);
        this._addToAggregates(record);
    },
    _addDeleteIcon: function(e, record, className) {
        e.innerHTML = '<img id="delete_row_"' + record.sysId + '" src="images/delete_row.gifx" width="12" height="12" ' +
        'class="clsshort button" ' +
        'alt="' + this.msgs['Delete'] + '" ' +
        'title="' + this.msgs['Delete'] + '" ' +
        'onclick="editListWithFormDeleteRow(this, \'' + record.sysId + '\',\'' + this.listID + '\');" ></img>' +
        '<img src="images/s.gifx" alt="" width="0" height="16" class="clsshort button"></img>';
        e.className = className;
    },
    _addNewRowIcon: function(e, record, className) {
        e.innerHTML = '<img src="images/new_row.gifx" width="12" height="12" class="clsshort button" ' +
        'alt="' + this.msgs['New row'] + '"' +
        'title="' + this.msgs['New row'] + '"' +
        '></img>';
        e.className = className;
    },
    _addSpacerIcon: function(e) {
        e.innerHTML = '<img src="images/s.gifx" alt="" width="0" height="16" class="clsshort button" />';
    },
    _addIcons: function(td, record, className, rowClassName) {
        var table = cel("table", td);
        table.cellSpacing = 0;
        table.cellPadding = 0;
        var tr = table.insertRow(0);
        tr.className = rowClassName;
        var td = tr.insertCell(0);
        this._addDeleteIcon(td, record, className);
        td = tr.insertCell(1);
        this._addSpacerIcon(td);
        var td = tr.insertCell(1);
        var span = cel("span", td);
        this._addNewRowIcon(span, record, className);
    },
    /**
* Modified cells get a background image and in IE setting the background attribute
* implies a background color (even if it is transparent) which overrides the TR background
* color.  So we have to set the background color (via a class) on each TD of the row as well
* as the row itself.  The two methods below handle doing all of that work.
*/
    _addClassToRow: function(tr, className) {
        addClassName(tr, className);
        var cells = tr.cells;
        for (var i = 2; i < cells.length; i++)
            addClassName(cells[i], className);
    },
    _removeClassFromRow: function(tr, className) {
        removeClassName(tr, className);
        var cells = tr.cells;
        for (var i = 0; i < cells.length; i++)
            removeClassName(cells[i], className);
    },
    /**
* Add a new record to the list
*
* sysId - if not specified, generate one
* operation - if specified, set it in the record
*/
    _addRecord: function(sysId, operation, values, displayValues) {
        if (!sysId)
            this._generateId(values, displayValues);
        else {
            record = this._addRecord0(sysId, operation, values, displayValues, false);
            return record;
        }
    },
    _addRecord0: function(sysId, operation, values, displayValues, add) {
        record = new GwtListEditRecord(sysId);
        if (operation)
            record.setOperation(operation);
        this.records[sysId] = record;
        if (add)
            this._addRow0(record, values, displayValues);
        else
            return record;
    },
    _generateId: function(values, displayValues) {
        if (this.generatedSysId != null) {
            this._addRecord0(this.generatedSysId, "add", values, displayValues, true);
            return;
        }
        this.ajax = true;
        var aj = new GlideAjax("GlideSystemAjax");
        aj.addParam("sysparm_name", "newGuid");
        aj.getXMLAnswer(this._generateIdResponse.bind(this), null, [values, displayValues]);
    },
    _generateIdResponse: function(answer, args) {
        this.ajax = false;
        var sysId = answer;
        var operation = "add";
        setDefaults = true;
        this._addRecord0(sysId, operation, args[0], args[1], true);
    },
    /**
* Set the default values for a record, if they are available
*/
    _setDefaults: function(record) {
        var defaults = this.records["-1"];
        if (!defaults)
            return;
        var fields = defaults.getFields();
        for (var n in fields) {
            var defaultField = fields[n];
            var f = record.addField(n);
            f.setLabel(defaultField.getLabel());
            f.setInitialValues(defaultField.getValue(), defaultField.getDisplayValue());
            f.setWritable(defaultField.isWritable());
            f.setMandatory(defaultField.isMandatory());
        }
    },
    /**
* Render any updates for a record
*/
    _updateRowWithRecord: function(record) {
        var fields = record.getFields();
        for (var n in fields) {
            this.renderValue(record.sysId, n);
            var field = fields[n];
            if (field.isDisplayValueSet())
                this.aggregates.updateAggregates(n, field.getOriginalDisplay(), field.getDisplayValue());
            else if (field.isValueSet())
                this.aggregates.updateAggregates(n, field.getOriginalValue(), field.getValue());
        }
    },
    /**
* Add the record values to the aggregates
*/
    _addToAggregates: function(record) {
        var fields = record.getFields();
        for (var n in fields) {
            var field = fields[n];
            var value = field.getValue();
            if (field.isDisplayValueSet())
                value = field.getDisplayValue();
            this.aggregates.addToAggregates(n, value);
        }
    },
    /**
* Remove the record values from the aggregates
*/
    _removeFromAggregates: function(record) {
        var fields = record.getFields();
        for (var n in fields) {
            var field = fields[n];
            var value = field.getValue();
            if (field.isDisplayValueSet())
                value = field.getDisplayValue();
            this.aggregates.removeFromAggregates(n, value);
        }
    },
    /* -------------------------------------------------
*    Initialization code to set up field/cell info
* ------------------------------------------------- */
    _initTable: function() {
        var ppId = getAttributeValue(this.tableElementDOM, 'partial_page_span');
        if (ppId) {
            this.version = 1;
            var pp = gel(ppId);
            if (pp) {
                this.listID = getAttributeValue(pp, 'glide_list_edit_id');
                this.listEditType = getAttributeValue(pp, 'glide_list_edit_type');
                var e = gel('glide_list_query_' + this.listID);
                if (!e)
                    this.query = "";
                else
                    this.query = e.value;
                var e = gel('glide_list_field_' + this.listID);
                if (!e)
                    this.relatedField = "";
                else
                    this.relatedField = e.value;
                var count = 0;
                var e = gel("glide_list_row_count_" + this.listID);
                if (e && !isNaN(e.value))
                    count = new Number(e.value);
                this.rowCount = count;
            }
        } else {
            this.version = 2;
            this.listID = getAttributeValue(this.tableElementDOM, 'glide_list_edit_id') + '';
            this.listEditType = getAttributeValue(this.tableElementDOM, 'glide_list_edit_type') + '';
            this.relatedField = getAttributeValue(this.tableElementDOM, 'glide_list_field') + '';
            this.query = getAttributeValue(this.tableElementDOM, 'glide_list_query') + '';
            this.rowCount = new Number(getAttributeValue(this.tableElementDOM, 'total_rows'));
        }
        var prefixLength = this.tableName.length + 1;
        this.fields = [];
        this.firstField = null;
        var cellIndexOffset = this._getHeaderOffset();
        var cells = this.tableElementDOM.rows[0].cells;
        this.headers = [];
        this.headersByName = {};
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (hasClassName(cell, "column_head") || hasClassName(cell, "list_hdrcell")) {
                var fieldName = cell.getAttribute('glide_field');
                if (fieldName) {
                    this.fields.push(fieldName.substring(prefixLength));
                    this.headers[i + cellIndexOffset] = fieldName;
                    this.headersByName[fieldName] = i + cellIndexOffset;
                    if (!this.firstField)
                        this.firstField = fieldName;
                }
            }
        }
        this.initRows();
    },
    _getHeaderOffset: function() {
        if (this.version == 2)
            return 0;
        if (this.listEditType == 'save_with_form')
            return 1;
        if (this.tableElementDOM.rows.length <= 1)
            return 0;
        var cellIndexOffset = 0;
        var cells = this.tableElementDOM.rows[1].cells;
        for (var i = 1; i < cells.length; i++) {
            if (hasClassName(cells[i], 'vt'))
                break;
            cellIndexOffset++;
        }
        return cellIndexOffset;
    },
    _getSysIdToRowMapping: function() {
        this.lastRow = 0;
        this.sysIds = [];
        this.sysIdsToRows = {};
        for (var i = 0; i < this.tableElementDOM.rows.length; i++) {
            var row = this.tableElementDOM.rows[i];
            var sysId = getAttributeValue(row, "sys_id");
            if (sysId) {
                this.sysIdsToRows[sysId] = i;
                this.sysIds.push(sysId);
                this.lastRow = i;
            }
        }
    },
    _getAggregates: function() {
        this.aggregates = new GlideListAggregates(this.tableElementDOM);
    },
    _addField: function(sysId, field) {
        var record = this.records[sysId];
        if (!record)
            record = this._addRecord(sysId)
        return record.addField(field);
    },
    _canWriteToFields: function(record, fields) {
        var canWrite = true;
        for (var j = 0; j < fields.length; j++) {
            var field = record.getField(fields[j]);
            if (!field)
                continue;
            if (!field.canWrite) {
                canWrite = false;
                break;
            }
        }
        return canWrite;
    },
    _getField: function(sysId, field) {
        var record = this.records[sysId];
        if (!record)
            return null;
        return record.getField(field);
    },
    _getForm: function() {
        if ((typeof g_form == "undefined") || (!g_form))
            return null;
        return gel(g_form.getTableName() + ".do");
    },
    _getXmlIslandName: function() {
        return "ni.java.com.glide.ui_list_edit.ListEditFormatterAction[" + this.listID + "]";
    },
    _load: function() {
        var form = this._getForm();
        if (!form)
            return;
        var inputs = Form.getInputs(this._getForm(), '', this._getXmlIslandName());
        if (inputs.length == 0)
            return;
        this.deserialize(loadXML(inputs[0].value));
    },
    _getValueToRender: function(sysId, fieldName) {
        var field = this._getField(sysId, fieldName);
        if (!field)
            return '';
        if (field.isRenderValueSet())
            return field.getRenderValue();
        if (field.isDisplayValueSet())
            return field.getDisplayValue();
        if (field.isValueSet())
            return field.getValue();
        if (field.getRenderValue())
            return field.getRenderValue();
        if (field.getDisplayValue())
            return field.getDisplayValue();
        return field.getValue();
    },
    _serialize: function(ids, full) {
        var xml = loadXML("<record_update/>");
        var root = xml.documentElement;
        root.setAttribute("table", this.tableName);
        root.setAttribute("field", this.relatedField);
        root.setAttribute("query", this.query);
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var record = this.records[id];
            var r = xml.createElement("record");
            r.setAttribute("sys_id", id);
            r.setAttribute("operation", record.operation);
            root.appendChild(r);
            var fields = record.getFields();
            for (var fieldName in fields) {
                var field = fields[fieldName];
                field.serialize(xml, r, full);
            }
        }
        return getXMLString(xml);
    },
    /* -------------------------------------------------
*   Get/Save data from the server
* ------------------------------------------------- */
    /**
* Get values and security information for records and fields
*
* The callback is the function called after we have retrieved the values
*/
    getValues: function(tableName, /*[]*/ sysIds, /*[]*/ fields, callback) {
        var needFields = false;
        var ajax = new GlideAjax(this.PROCESSOR);
        ajax.addParam("sysparm_type", 'get_value');
        ajax.addParam('sysparm_table', tableName);
        if ((sysIds.length == 1) && (sysIds[0] == "-1")) {
            ajax.addParam("sysparm_default_query", this.query);
        }
        for (var i = 0; i < sysIds.length; i++) {
            var id = sysIds[i];
            var fieldList = [];
            for (var j = 0; j < fields.length; j++) {
                if (!this._getField(id, fields[j]))
                    fieldList.push(fields[j]);
            }
            if (fieldList.length > 0) {
                needFields = true;
                ajax.addParam('sysparm_sys_id_' + id, fieldList.join(','));
            }
        }
        if (needFields) {
            this.ajax = true;
            ajax.getXML(this._getValuesResponse.bind(this, callback));
        }
        else
            callback();
    },
    /**
* Get values and security information for records and fields based on a table query
*
* The callback is the function called after we have retrieved the values
*/
    getValuesFromQuery: function(tableName, query, /*[]*/ fields, callback) {
        var needFields = false;
        var ajax = new GlideAjax(this.PROCESSOR);
        ajax.addParam("sysparm_type", 'get_value');
        ajax.addParam('sysparm_table', tableName);
        ajax.addParam('sysparm_query', query);
        ajax.addParam('sysparm_fields', fields.join(','));
        ajax.getXML(this._getValuesResponse.bind(this, callback));
    },
    _getValuesResponse: function(callback, response) {
        this.ajax = false;
        if (!response || !response.responseXML) {
            this.errorMsg = new GwtMessage().getMessage("No response from server - try again later");
            callback();
            return;
        }
        var xml = response.responseXML;
        var items = xml.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var sysId = item.getAttribute("sys_id");
            this.generatedSysId = item.getAttribute("new_sys_id");
            var fieldList = item.getAttribute("field_list");
            var fields;
            if (fieldList)
                fields = fieldList.split(',');
            else
                fields = [];
            for (var j = 0; j < fields.length; j++) {
                var n = fields[j];
                var fieldItem = this._getXMLFieldItem(item, n);
                if (!fieldItem)
                    continue;
                var canWrite = true;
                if (fieldItem.getAttribute("can_write") == "false")
                    canWrite = false;
                var mandatory = false;
                if (fieldItem.getAttribute("mandatory") == "true")
                    mandatory = true;
                var okExtension = true;
                if (fieldItem.getAttribute("ok_extension") == "false")
                    okExtension = false;
                if (!this._getField(sysId, n)) {
                    var f = this._addField(sysId, n);
                    f.setInitialValues(this._getXMLValue(fieldItem, "value"), this._getXMLValue(fieldItem, "displayvalue"));
                    f.setWritable(canWrite);
                    f.setMandatory(mandatory);
                    f.setOKExtension(okExtension);
                    f.setLabel(fieldItem.getAttribute("label"));
                }
            }
        }
        callback();
        if (this.rowsToAdd > 0) {
            this.rowsToAdd--;
            this.addRow();
        }
    },
    _getXMLFieldItem: function(parent, n) {
        for (var i = 0; i < parent.childNodes.length; i++) {
            var item = parent.childNodes[i];
            if (item.nodeName.toLowerCase() == n)
                return item;
        }
        return null;
    },
    _getXMLValue: function(item, type) {
        var value = null;
        var e = item.getElementsByTagName(type);
        if (e && e.length > 0)
            value = getTextValue(e[0]);
        if (!value)
            value = "";
        return value;
    },
    /**
* Call the onChange handler, if there is one
*/
    _callOnChange: function(sysId, fieldName, oldValue, value) {
        var old_g_list = null;
        if (typeof g_list != "undefined")
            old_g_list = g_list;
        g_list = this;
        var scriptName = "onChange_" + this.listID + "_" + fieldName;
        for (var ndx = 0; ndx < 100; ndx++) {
            var f = this._getClientScriptFunc(scriptName, ndx);
            if (f == null)
                break;
            try {
                f(sysId, oldValue, value);
            } catch (ex) {}
        }
        g_list = old_g_list;
        return;
    },
    /**
* Call the onSubmit handlers, if there are any
*/
    callOnSubmit: function() {
        /*
var retFields = this.checkMandatory();
if (retFields) {
var txt = this.tableLabel + " contains some mandatory fields that are not filled in:\n";
for (var n in retFields) {
var fldCnt = retFields[n];
txt += "   " + fldCnt.label + " (missing from ";
if (fldCnt.count == 1)
txt += "1 record";
else
txt += fldCnt.count + " records";
txt += ")\n";
}
alert(txt);
return false;
}
*/
        var retVal;
        var scriptName = "onSubmit_" + this.listID;
        for (var ndx = 0; (ndx < 100) && (retVal != false); ndx++) {
            var f = this._getClientScriptFunc(scriptName, ndx);
            if (f == null)
                break;
            try {
                retVal = f();
            } catch (ex) {}
        }
        return retVal;
    },
    /**
* Make sure that we have all of the mandatory fields filled in
*/
    checkMandatory: function() {
        var ok = true;
        var retFields = {};
        for (var id in this.records) {
            var record = this.records[id];
            if ((record.operation != "add") && (record.operation != "update"))
                continue;
            var fields = record.fields;
            for (var n in fields) {
                var field = record.fields[n];
                if (!field.isMandatory())
                    continue;
                var value = this._getSetValue(field);
                if (record.operation == "add" || field.isValueSet() || field.isDisplayValueSet()) {
                    if (value == "") {
                        ok = false;
                        var fldCnt = retFields[n];
                        if (!fldCnt) {
                            fldCnt = {};
                            fldCnt.count = 1;
                            fldCnt.label = field.getLabel();
                            retFields[n] = fldCnt;
                        } else
                            fldCnt.count++;
                    }
                }
            }
        }
        if (ok)
            return null;
        else
            return retFields;
    },
    _getSetValue: function(field) {
        if (field.isDisplayValueSet())
            return field.getDisplayValue();
        return field.getValue();
    },
    _getClientScriptFunc: function(scriptName, ndx) {
        var n = scriptName + "_" + ndx;
        var f = window[n];
        if (typeof f != "function")
            return null;
        return f;
    },
    type: 'GlideListEditor'
};
function getQueryForList(listId) {
    var e = gel('sysparm_query');
    if (e)
        return e.value;
    var t = gel(listId + '_table');
    if (t)
        return getAttributeValue(t, 'glide_list_query') + '';
    return '';
}