/**
 * CatalogItemVariable API enables you to create and modify service
 * catalog item variables using scripts.
 * @class CatalogItemVariable
 * @typedef {Object}  CatalogItemVariable
 */
class CatalogItemVariable {
    constructor() {}
    /**
     * Insert the defined catalog item variable.
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
     * Returns a mapping of catalog item variable attribute values.
     * @param {Object} columns Specify the set of columns that you would like the values for.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns An object mapping column names to values.
     */
    read(columns, standardUpdate) {}
    /**
     * Defines attribute values for the specified catalog item variable.
     * @param {Object} attributes An object mapping column names to values.
     * @returns Method does not return a value
     */
    setAttributes(attributes) {}
    /**
     * Updates the current catalog item variable with set values.
     * @param {Object} columnValues An object mapping column names to values.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     */
    update(columnValues, standardUpdate) {}
}