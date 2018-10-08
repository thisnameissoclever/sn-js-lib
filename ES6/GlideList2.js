/**
 * GlideList2 is a JavaScript class used to customize (v2)
 * lists.
 * @class GlideList2
 * @typedef {Object}  GlideList2
 */
class GlideList2 {
    constructor() {}
    /**
     * Adds a single term to the list query filter.
     * @param {String} filter Query string condition to add.
     * @returns Method does not return a value
     * @example g_list.addfilter("active=true");
     */
    addFilter(filter) {}
    /**
     * Returns the GlideList2 object for the list that contains the specified
     * item.
     * @param {Object} DOMelement The DOM element ID for the list for which you want the
     * GlideList2 object.
     * @returns The GlideList2 object or null if not found.
     */
    get(DOMelement) {}
    /**
     * Returns the GlideList2 object for the list specified.
     * @param {String} ListID The list ID for which you want the GlideList2
     * object.
     * @returns The GlideList2 object or null if not found.
     * @example function assignLabelActionViaLookupModal(tableName, listId) {
     * var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * assignLabelViaLookup(tableName, sysIds, list.getView());
     * }
     */
    get(ListID) {}
    /**
     * Returns a comma-separated list of the sys_ids for the items that are checked in the list.
     * @returns Comma-separated list of the sys_ids for the items that are checked in the list. Does not
     * check to determine that the items returned are allowed to be executed.
     * @example function removeLabelActionViaLookupModal(tableName, listId) {
     * var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * var sysIds = list.getChecked();
     * if (!sysIds)
     * return;
     * removeLabelViaLookup(tableName, sysIds);
     * }
     */
    getChecked() {}
    /**
     * Returns the sysparm_fixed query.
     * @returns The fixed query string for the list.
     * @example var list = GlideList2.get(container.readAttribute('list_id'));
     * var filter = this._getFilter(element);
     * var fixedQuery = list.getFixedQuery();
     * if (fixedQuery)
     * filter = fixedQuery + "^" + filter;
     */
    getFixedQuery() {}
    /**
     * Returns the field or comma-separated list of fields that are used to group the list.
     * @returns The field or comma-separated list of fields that are used to group the list.
     * @example function runFilterV2Lists(name, filter) {
     * var list = GlideList2.get(name);
     * if (list) {
     * var groupBy = list.getGroupBy();
     * if (groupBy)
     * filter += "^" + groupBy;
     * list.setFilterAndRefresh(filter);
     * }
     * }
     */
    getGroupBy() {}
    /**
     * Returns the name of the list, which is usually the table name.
     * @returns The list name (usually the table name).
     * @example var list = GlideList2.get(name);
     * var listName = list.getListName();
     * 
     */
    getListName() {}
    /**
     * Returns the first field used to order the list.
     * @returns The field used for order, or a blank.
     * @example var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * var orderBy = list.getOrderBy();
     */
    getOrderBy() {}
    /**
     * Returns the name of the parent table for a related list (the table associated with the form).
     * @returns The parent table name.
     * @example for (var id in GlideLists2) {
     * var list = GlideLists2[id];
     * if (list.getTableName() == listTableName &amp;&amp; list.getParentTable() == tableName)
     * return list.getContainer();
     * }
     * 
     */
    getParentTable() {}
    /**
     * Returns the encoded query string for the list.
     * @param {Boolean} orderBy (Optional) If true, includes the orderBy in the encoded
     * query string.
     * @param {Boolean} groupBy (Optional) If true, includes the groupBy in the encoded
     * query string.
     * @param {Boolean} fixed (Optional) If true, includes fixed query in the encoded
     * query string.
     * @param {Boolean} all (Optional) If true, includes orderBy, groupBy, and fixed
     * query.
     * @returns Encoded query string for the list.
     * @example var list = GlideList2.get(this.listID);
     * var ajax = new GlideAjax("AJAXJellyRunner", "AJAXJellyRunner.do");
     * ajax.addParam("sysparm_query_encoded", list.getQuery({groupby: true, orderby: true}));
     * ajax.addParam("sysparm_table", list.getTableName());
     * ajax.addParam("sysparm_view", list.getView());
     */
    getQuery(orderBy, groupBy, fixed, all) {}
    /**
     * Returns the related list field that associates the related list to the parent form.
     * @returns Field that connects the list to the parent form.
     * @example var list = GlideList2.get(name);
     * var related = list.getRelated();
     * if (related)
     * ajax.addParam("sysparm_is_related_list", "true");
     */
    getRelated() {}
    /**
     * Returns the table name for the list.
     * @returns Returns the table name for the list.
     * @example GlideList2.getListsForTable = function(table) {
     * var lists = [];
     * for (var id in GlideLists2) {
     * var list = GlideLists2[id];
     * if (list.getTableName() == table)
     * lists.push(list);
     * }
     * return lists;
     * }
     */
    getTableName() {}
    /**
     * Returns the list title.
     * @returns The list title.
     * @example var list = GlideList2.get(name);
     * var listTitle = list.getTitle();
     * 
     */
    getTitle() {}
    /**
     * Returns the view used to display the list.
     * @returns The name of the view.
     * @example function assignLabelActionViaLookupModal(tableName, listId) {
     * var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * assignLabelViaLookup(tableName, sysIds, list.getView());
     * }
     */
    getView() {}
    /**
     * Returns true if the list has been personalized by the user by
     * choosing the list mechanic and changing the list layout.
     * @returns True if the list layout has been changed.
     * @example var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * if (list.isUserList())
     * var tableName = list.getTableName();
     */
    isUserList() {}
    /**
     * Refreshes the list.  The orderBy part of the list filter is ignored
     * so that the list uses its natural ordering when it is refreshed.
     * @param {Number} firstRow (Optional) The first row to appear in the list. If not specified, the first row
     * of the current is used.
     * @param {String} additionalParms (Optional) name-value pairs that are submitted with the list refresh
     * request.
     * @returns Method does not return a value
     * @example $timeout(function() {
     * if (GlideList.lists) {
     * var list = GlideList.get(name);
     * if (list) {
     * if (sortBy) {
     * if (sortDirection == 'ASC')
     * list.sort(sortBy);
     * else
     * list.sortDescending(sortBy);
     * }
     * list.refresh();
     * }
     * }
     * }			
     */
    refresh(firstRow, additionalParms) {}
    /**
     * Refreshes the list. The orderBy part of the list filter is included
     * if it is specified for the list.
     * @param {Number} firstRow (Optional) The first row to appear in the list.
     * @param {String} description (Optional)  name=value pairs that are submitted with the list refresh request.
     * @returns Method does not return a value
     * @example ga.getXML(function(serverResponse) {
     * var response = serverResponse.responseXML.getElementsByTagName("response")[0];
     * if (response) {
     * var list = GlideList2.getByName("backlog_stories");
     * list.refreshWithOrderBy();
     * var status = response.getAttribute('status');
     * $j('html, body').animate({scrollTop: $j("#"+data.record.sys_id).offset().top},500);
     * if (status == 'failure') {
     * alert('${gs.getMessage("Story cannot be created. Team is not associated with any project.")}');
     * }
     * }
     * }
     */
    refreshWithOrderBy(firstRow, description) {}
    /**
     * Sets the encoded query string for the list, ignoring the orderBy and
     * groupBy parts of the query string.
     * @param {String} filter Encoded query string.
     * @returns Method does not return a value
     * @example list = GlideList2.get($(side+"ContentDivRelease").select(".list_div")[0].getAttribute("id"));
     * if (list) {
     * list.setFilter("active=true");
     * list.refresh(1);
     * }
     */
    setFilter(filter) {}
    /**
     * Sets the encoded query string for the list, including the orderBy
     * and groupBy if specified, and then refreshes the list using the new
     * filter.
     * @param {String} filter Encoded query string.
     * @returns Method does not return a value
     * @example function updateListFilter(projectID) {
     * var list = GlideList2.getByName("backlog_stories");
     * var fixedQuery = $('hdn_additional_filters').value;
     * if(!projectID) {
     * list.setFilterAndRefresh(fixedQuery + "^ORDERBYteam_index");
     * list.setOrderBy("team_index");
     * }
     * }
     */
    setFilterAndRefresh(filter) {}
    /**
     * Sets the first row that appears in the list when the list is refreshed.
     * @param {Number} rowNum Row number of the first row to display.
     * @returns Method does not return a value
     * @example var nextRow = 0;
     * var rowsPerPage = 20;
     * var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * list.setFirstRow(nextRow);
     * nextRow = nextRow + rowsPerPage;
     * 
     */
    setFirstRow(rowNum) {}
    /**
     * Sets the groupBy criteria for the list, for a single field or
     * multiple fields.
     * @param {String} groupBy The groupBy criteria for the list.
     * @returns Method does not return a value
     * @example function runContextAction(listId) {
     * var g_list = GlideList2.get(listId);
     * g_list.setGroupBy('');
     * g_list.refresh(1);
     * }
     */
    setGroupBy(groupBy) {}
    /**
     * Sets the orderBy criteria for the list.
     * @param {String} orderBy Single or multiple order by fields.
     * @returns Method does not return a value
     * @example updateOrderBy: function(orderBy){
     * var list = GlideList2.get(this.listID);
     * if (list)
     * list.setOrderBy(orderBy);
     * };
     */
    setOrderBy(orderBy) {}
    /**
     * Sets the number of rows per page to display.
     * @param {Number} rows The number of rows to display
     * @returns Method does not return a value
     * @example link: function(scope) {
     * var list = GlideList2.get(scope.listId);
     * list.setRowsPerPage(scope.maxRows);
     * list.setFilterAndRefresh(scope.tableQuery);
     * }
     */
    setRowsPerPage(rows) {}
    /**
     * Shows or hides all the groups within the list and saves the current collapsed/expanded
     * state of the groups as a user preference.
     * @param {Boolean} showFlag If true, shows the groups within the list.
     * @returns Method does not return a value
     * @example function showHideAllGroups(showFlag) {
     * var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * list.showHideGroups(showFlag);
     * }
     */
    showHideGroups(showFlag) {}
    /**
     * Displays or hides the list and saves the current collapsed/expanded state of the list as a user preference.
     * @param {Boolean} showFlag If true, displays the list.
     * @returns Method does not return a value
     * @example GlideList2.toggleAll = function(expandFlag) {
     * for (var id in GlideLists2) {
     * var list = GlideLists2[id];
     * list.showHideList(expandFlag);
     * }
     */
    showHideList(showFlag) {}
    /**
     * Sorts the list in ascending order and saves the choice.
     * @param {String} field Specifies the field used to sort the list.
     * @returns Method does not return a value
     * @example $timeout(function() {
     * if (GlideList.lists) {
     * var list = GlideList.get(name);
     * if (list) {
     * if (sortBy) {
     * if (sortDirection == 'ASC')
     * list.sort(sortBy);
     * else
     * list.sortDescending(sortBy);
     * }
     * list.refresh();
     * }
     * }
     * }
     */
    sort(field) {}
    /**
     * Sorts the list in descending order and saves the choice.
     * @param {String} field Specifies the field used to sort the list.
     * @returns Method does not return a value
     * @example $timeout(function() {
     * if (GlideList.lists) {
     * var list = GlideList.get(name);
     * if (list) {
     * if (sortBy) {
     * if (sortDirection == 'ASC')
     * list.sort(sortBy);
     * else
     * list.sortDescending(sortBy);
     * }
     * list.refresh();
     * }
     * }
     * }
     */
    sortDescending(field) {}
    /**
     * Toggles the display of the list and saves the current collapsed/expanded state of the list as a user preference.
     * @returns Method does not return a value
     * @example var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * list.toggleList();
     */
    toggleList() {}
    /**
     * Toggles the display of the list but does not save the current collapsed/expanded state of the list as a user preference.
     * @returns Method does not return a value
     * @example var list = GlideList2.get(listId);
     * if (!list)
     * return;
     * list.toggleListNoPref();
     */
    toggleListNoPref() {}
}