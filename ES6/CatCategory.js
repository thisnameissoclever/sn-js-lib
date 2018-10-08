/**
 * CatCategory API enables you to create and modify service catalog
 * categories using scripts.
 * @class CatCategory
 * @typedef {Object}  CatCategory
 */
class CatCategory {
    constructor() {}
    /**
     * Adds the Available For user criteria to a catalog
     * category.
     * @param {String} action Specify add to add the user criteria to the
     * Available For list. Specify
     * delete to delete the user criteria from the
     * Available For list.
     * @param {Array} criteriaIDs Array of the user criteria sys_ids.
     * @returns Method does not return a value
     * @example 
     * var item = new sn_sc.CatCategory("31bea3d53790200044e0bfc8bcbe5dec");
     * item. availableForUserCriteria("add", ["0c441abbc6112275000025157c651c89"]);
     * 
     */
    availableForUserCriteria(action, criteriaIDs) {}
    /**
     * Inserts the defined category.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Return the sys_id of the inserted variable record.
     */
    create(standardUpdate) {}
    /**
     * Brief description of the method.
     * @param {Boolean} standardUpdate  
     * @returns Method does not return a value
     */
    deleteRecord(standardUpdate) {}
    /**
     * Returns the sys_id of the category.
     * @returns sys_id of the category.
     * @example 
     * var cart=new sn_sc.CatCategory("2809952237b1300054b6a3549dbe5dd4");
     * var categoryID=cart.getID();
     * gs.info(categoryID);
     */
    getID() {}
    /**
     * Adds the Not Available For user criteria to a catalog
     * category.
     * @param {String} action Specify add to add the user criteria to the
     * Not Available For list. Specify
     * delete to delete the user criteria from the
     * Not Available For list.
     * @returns Method does not return a value
     * @example 
     * var item = new sn_sc.CatCategory("31bea3d53790200044e0bfc8bcbe5dec");
     * item. notAvailableForUserCriteria("add", ["0c441abbc6112275000025157c651c89"]);
     * 
     */
    notAvailableForUserCriteria(action) {}
    /**
     * Returns a mapping of the category.
     * @param {Object} columns Specify the set of columns that you would like the values for.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns An object mapping column names to values.
     */
    read(columns, standardUpdate) {}
    /**
     * Defines attribute values for this category.
     * @param {Object} attributes Set the attributes for new field and value pairs.
     * @returns Method does not return a value
     */
    setAttributes(attributes) {}
    /**
     * Define the table name for this category.
     * @param {String} tableName Specify the name of the table that extends sc_category.
     * @returns Method does not return a value
     */
    setTableName(tableName) {}
    /**
     * Use to update current category.
     * @param {Object} columnValues An object mapping column names to values.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    update(columnValues, standardUpdate) {}
}