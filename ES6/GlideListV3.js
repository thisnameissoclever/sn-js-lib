/**
 * Use GlideListV3 to manipulate lists.
 * @class GlideListV3
 * @typedef {Object}  GlideListV3
 */
class GlideListV3 {
    constructor() {}
    /**
     * Adds a single term to the list query filter.
     * @param {String} filter Query string condition to add.
     * @returns Method does not return a value
     */
    addFilter(filter) {}
    /**
     * Returns the GlideList object for the specified DOM element.
     * @param {Object} DomElement The DOM element ID for which you want the GlideList object.
     * @returns The GlideList object for the specified DOM element. Returns null if the DOM
     * element is not found.
     */
    get(DomElement) {}
    /**
     * Returns the GlideList object for specified list.
     * @param {String} listId The list name.
     * @returns The GlideList object for the specified list, or null if not found.
     */
    get(listId) {}
    /**
     * Returns a comma-separated list of sys_ids for checked items in the list. Does not
     * return items that are not allowed to be executed.
     * @returns Comma-separated list of the sys_ids for checked items in the list. Does not
     * return items that are not allowed to be executed.
     */
    getChecked() {}
    /**
     * Returns the sysparm_fixed query.
     * @returns The fixed query string for the list.
     */
    getFixedQuery() {}
    /**
     * Returns the form's target attribute.
     * @returns The form's target attribute.
     */
    getFormTarget() {}
    /**
     * Returns the field or comma-separated list of fields that are used to group the
     * list.
     * @returns The field or comma-separated list of fields used to group the list.
     */
    getGroupBy() {}
    /**
     * Returns the name of the list, which is usually the table name.
     * @returns The list name.
     */
    getListName() {}
    /**
     * Returns the first field used to order the list.
     * @returns The field used to order the list, or an empty string if the list is not
     * sorted.
     */
    getOrderBy() {}
    /**
     * Returns the name of the parent table (the table associated with the form).
     * @returns The parent table name.
     */
    getParentTable() {}
    /**
     * Returns the encoded query string for the list.
     * @param {Object} options The options can be one or more of the following.
     * orderby - include ORDERBY in the query
     * groupby - include GROUPBY in the query
     * fixed - include sysparm_fixed_query in the query
     * all - include all the options in the query
     * 
     * @returns Encoded query string for the list.
     */
    getQuery(options) {}
    /**
     * Returns the referring URL.
     * @returns Returns the parent form's URL, or '*' if there is no parent form.
     */
    getReferringUrl() {}
    /**
     * Returns the related list field that associates the related list to the parent
     * form.
     * @returns Field that connects the list to the parent form.
     */
    getRelated() {}
    /**
     * Returns the related list type.
     * @returns The relationship table type.
     */
    getRelatedListType() {}
    /**
     * Returns the relationship record id, if this is type REL related list.
     * @returns The sys_id of the relationship record.
     */
    getRelationshipId() {}
    /**
     * Returns the number of rows returned by the query.
     * @returns The number of rows returned by the query.
     */
    getRowCount() {}
    /**
     * Returns the number of rows to be displayed on a page.
     * @returns The number of rows to be displayed on a page.
     */
    getRowsPerPage() {}
    /**
     * Returns the table name of the list.
     * @returns The list's table name.
     */
    getTableName() {}
    /**
     * Returns the list title.
     * @returns The list title.
     */
    getTitle() {}
    /**
     * Returns the view used to display the list.
     * @returns The name of the view
     */
    getView() {}
    /**
     * Returns true if the list has been personalized by the user.
     * @returns True if the list layout has changed.
     */
    isUserList() {}
    /**
     * Refreshes the list. The orderBy part of the list filter is ignored so that the list's
     * natural ordering is used.
     * @param {Number} firstRow (Optional) The first row to display in the list. If not specified, the list's
     * current first row is used.
     * @param {Object} additionalParams (Optional) Name- value pairs that are submitted with the list refresh
     * request.
     * @returns Method does not return a value
     */
    refresh(firstRow, additionalParams) {}
    /**
     * Refreshes the list using the orderBy fields.
     * @param {Number} firstRow (Optional) The first row to display in the list. If not specified, the list's
     * current first row is used.
     * @param {Object} additionalParams (Optional) Name- value pairs that are submitted with the list refresh
     * request.
     * @returns Method does not return a value
     */
    refreshWithOrderBy(firstRow, additionalParams) {}
    /**
     * Sets the encoded query string for the list ignoring the orderBy and groupBy parts of
     * the query string.
     * @param {String} filter An encoded query string.
     * @param {Boolean} saveOrderBy The default is false. When true uses the orderBy part of the query.
     * @param {Boolean} saveGroupBy The default is false. When true uses the groupBy part of the query.
     * @returns Method does not return a value
     */
    setFilter(filter, saveOrderBy, saveGroupBy) {}
    /**
     * Sets the encoded query string for the list, and then refreshes the list using the new
     * filter.
     * @param {String} filter Encoded query string.
     * @returns Method does not return a value
     */
    setFilterAndRefresh(filter) {}
    /**
     * Sets the first row to be displayed when the list is refreshed.
     * @param {Number} firstRow The row number in the list.
     * @returns Method does not return a value
     */
    setFirstRow(firstRow) {}
    /**
     * Specifies where to display the response from the form.
     * @param {String} target The form.target attribute value to use.
     * @returns Method does not return a value
     */
    setFormTarget(target) {}
    /**
     * Sets the groupBy criteria for the list, for a single field or
     * multiple fields.
     * @param {groupBy} String The group by criteria for the list.
     * @returns Method does not return a value
     */
    setGroupBy(String) {}
    /**
     * Sets the orderBy criteria for the list.
     * @param {String} orderBy Single or multiple order by fields.
     * @returns Method does not return a value
     */
    setOrderBy(orderBy) {}
    /**
     * Sets the parent form referring url.
     * @param {String} url The parent form's URL
     * @returns Method does not return a value
     */
    setReferringUrl(url) {}
    /**
     * Set the number of rows to display on a page.
     * @param {Number} numRows The number of rows to display on a page.
     * @returns Method does not return a value
     */
    setRowsPerPage(numRows) {}
    /**
     * Displays or hides all of the groups within the list and saves the current
     * collapsed/expanded state of the groups as a user preference.
     * @param {Boolean} showFlag When true, displays the groups within the list.
     * @returns Method does not return a value
     */
    showHideGroups(showFlag) {}
    /**
     * Displays or hides the list and saves the current collapsed/expanded state of the list
     * as a user preference.
     * @param {Boolean} showFlag When true, displays the list.
     * @returns Method does not return a value
     */
    showHideList(showFlag) {}
    /**
     * Sort the list in ascending order.
     * @param {String} field The field to be used to sort the list.
     * @returns Method does not return a value
     */
    sort(field) {}
    /**
     * Sorts the list in descending order.
     * @param {String} field The field used to sort the list.
     * @returns Method does not return a value
     */
    sortDescending(field) {}
    /**
     * Toggles the list display between collapsed and expanded, and saves the state as a user
     * preference.
     * @returns Method does not return a value
     */
    toggleList() {}
    /**
     * Toggles the list display between collapsed and expanded, but does not save the state as
     * a user preference.
     * @returns Method does not return a value
     */
    toggleListNoPref() {}
}