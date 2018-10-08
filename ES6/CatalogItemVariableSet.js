/**
 * CatalogItemVariableSet API enables you to create and modify service
 * catalog item variable sets using scripts.
 * @class CatalogItemVariableSet
 * @typedef {Object}  CatalogItemVariableSet
 */
class CatalogItemVariableSet {
    constructor() {}
    /**
     * Inserts the defined catalog item variable set.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Return the sys_id of the inserted variable record.
     */
    create(standardUpdate) {}
    /**
     * Deletes the defined catalog item variable.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    deleteRecord(standardUpdate) {}
    /**
     * Returns a mapping of catalog item variable set attribute values.
     * @param {Object} columns Specify the set of columns that you would like the values for.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns An object mapping column names to values.
     */
    read(columns, standardUpdate) {}
    /**
     * Defines attribute values for this catalog item variable set.
     * @param {Object} attributes An object mapping column names to values.
     * @returns Method does not return a value
     */
    setAttributes(attributes) {}
    /**
     * Updates the current catalog item variable set with set values.
     * @param {Object} columnValues An object mapping column names to values.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    update(columnValues, standardUpdate) {}
}