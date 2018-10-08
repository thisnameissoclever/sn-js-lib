/**
 * CatItem API enables you to create and modify service catalog items
 * using scripts.
 * @class CatItem
 * @typedef {Object}  CatItem
 */
class CatItem {
    constructor() {}
    /**
     * Adds the Available For user criteria to a catalog
     * item.
     * @param {string} action Specify add to add the user criteria to the
     * Available For list. Specify
     * delete to delete the user criteria from the
     * Available For list.
     * @param {Array} criteriaIDs Array of the user criteria sys_ids.
     * @returns Method does not return a value
     * @example 
     * var item = new sn_sc.CatItem("31bea3d53790200044e0bfc8bcbe5dec");
     * item. availableForUserCriteria("add", ["0c441abbc6112275000025157c651c89"]);
     * 
     */
    availableForUserCriteria(action, criteriaIDs) {}
    /**
     * Specifies if the user has access to view the catalog item on global search.
     * @param {Boolean} isMobile True if the search is in mobile view. Else, false.
     * @returns Returns true if the user has access to view the catalog item on global search.
     * Else, returns false.
     * @example var cart=new sn_sc.CatItem("04b7e94b4f7b4200086eeed18110c7fd");
     * data.history=cart.canViewOnSearch('false');
     */
    canViewOnSearch(isMobile) {}
    /**
     * Inserts the defined catalog item.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    create(standardUpdate) {}
    /**
     * Deletes the defined catalog item.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    delete(standardUpdate) {}
    /**
     * Specifies the first category that the user can view in a catalog.
     * @param {String} catalogId sys_id of the catalog.
     * @returns sys_id of the first category that the user can view in a catalog.
     * @example var CatItem=new sn_sc.CatItem("04b7e94b4f7b4200086eeed18110c7fd");
     * console.log(CatItem.getFirstAccessibleCategoryForSearch("e0d08b13c3330100c8b837659bba8fb4”));
     */
    getFirstAccessibleCategoryForSearch(catalogId) {}
    /**
     * Returns the class name for the current catalog item record.
     * @returns Class name for the current catalog item record.
     * @example var CatItem=new sn_sc.CatItem("04b7e94b4f7b4200086eeed18110c7fd");
     * console.log(CatItem.getRecordClass());
     */
    getRecordClass() {}
    /**
     * Specifies if the catalog item is available in service portal.
     * @returns Returns true if the catalog item is available in service portal.  Else, returns
     * false.
     * @example var CatItem=new sn_sc.CatItem("04b7e94b4f7b4200086eeed18110c7fd");
     * data.history=CatItem.isVisibleServicePortal();
     */
    isVisibleServicePortal() {}
    /**
     * Adds the Not Available For user criteria to a catalog
     * item.
     * @param {String} action Specify add to add the user criteria to the
     * Not Available For list. Specify
     * delete to delete the user criteria from the
     * Not Available For list.
     * @returns Method does not return a value
     * @example 
     * var item = new sn_sc.CatItem("31bea3d53790200044e0bfc8bcbe5dec");
     * item. notAvailableForUserCriteria("add", ["0c441abbc6112275000025157c651c89"]);
     * 
     */
    notAvailableForUserCriteria(action) {}
    /**
     * Returns a mapping of catalog item attribute values.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @param {Object} columns Specify the set of columns that you would like the values for.
     * @returns An object mapping column names to values.
     */
    read(standardUpdate, columns) {}
    /**
     * Defines attribute values for this catalog item.
     * @param {Object} attributes An object mapping column names to values.
     * @returns Method does not return a value
     */
    setAttributes(attributes) {}
    /**
     * Defines the catalogs that this catalog item is associated with.
     * @param {String} catalogs Specify comma-separated list of catalogs that you would like the item to be
     * associated with.
     * @returns Method does not return a value
     */
    setCatalogs(catalogs) {}
    /**
     * Defines the categories that this catalog item is associated with.
     * @param {String} categories Specify comma-separated list of categories that you would like the item to be
     * associated with.
     * @returns Method does not return a value
     */
    setCategories(categories) {}
    /**
     * Sets the image of a catalog item to a database image record.
     * @param {String} dbImageSysId sys_id of an attachment referencing the db_image.
     * @param {String} type Type can be picture or an icon.
     * @returns Method does not return a value
     */
    setImage(dbImageSysId, type) {}
    /**
     * Defines the table name for this catalog item.
     * @param {String} tableName Specify the name of the table that extends sc_cat_item.
     * @returns Method does not return a value
     */
    setTableName(tableName) {}
    /**
     * Updates current catalog item with set values.
     * @param {Object} columnValues An object mapping column names to values.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    update(columnValues, standardUpdate) {}
}