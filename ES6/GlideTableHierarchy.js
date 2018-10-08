/**
 * The Scoped GlideTableHierarchy API provides methods for handling information about table
 * relationships.
 * @class GlideTableHierarchy
 * @typedef {Object}  GlideTableHierarchy
 */
class GlideTableHierarchy {
    /**
     * Instantiates a GlideTableHierarchy object.
     * @param {String} tableName The name of the table.
     */
    constructor(tableName) {}
    /**
     * Returns an array of strings containing all tables that extend the current table and
     * includes the current table.
     * @returns An array of strings containing the tables in the hierarchy that includes the
     * current table.
     * @example var table = new GlideTableHierarchy("task");
     * gs.info(table.getAllExtensions());
     */
    getAllExtensions() {}
    /**
     * Returns the parent class.
     * @returns The parent class.
     * @example var table = new GlideTableHierarchy("cmdb_ci_server");
     * gs.info(table.getBase());
     */
    getBase() {}
    /**
     * Returns an array of strings containing all classes in the hierarchy of the current
     * table.
     * @returns An array of strings of the classes in the hierarchy.
     * @example var table = new GlideTableHierarchy("incident");
     * gs.info(table.getHierarchy());
     */
    getHierarchy() {}
    /**
     * Returns the table's name.
     * @returns The table's name.
     * @example var table = new GlideTableHierarchy("incident");
     * gs.info(table.getName());
     */
    getName() {}
    /**
     * Returns the top level class in the hierarchy.
     * @returns The root class.
     * @example var table = new GlideTableHierarchy("cmdb_ci_server");
     * gs.info(table.getRoot());
     */
    getRoot() {}
    /**
     * Returns an array of strings containing all tables that extend the current
     * table.
     * @returns An array of strings containing the tables that extend the current
     * table.
     * @example var table = new GlideTableHierarchy("task");
     * gs.info(table.getTableExtensions());
     */
    getTableExtensions() {}
    /**
     * Returns an array of strings of the table names in the hierarchy.
     * @returns An array of strings containing the names of tables in the hierarchy.
     * @example var table = new GlideTableHierarchy("incident");
     * gs.info(table.getTables());
     */
    getTables() {}
    /**
     * Returns true of this class has been extended.
     * @returns True if the current table has extensions.
     * @example var table = new GlideTableHierarchy("incident");
     * gs.info(table.hasExtensions());
     */
    hasExtensions() {}
    /**
     * Returns true if this is a base class.
     * @returns True if the current table has no parent and has extensions.
     * @example var table = new GlideTableHierarchy("incident");
     * gs.info(table.isBaseClass());
     */
    isBaseClass() {}
    /**
     * Returns true if this table is not in a hierarchy.
     * @returns True if the current table has no parent and no extensions.
     * @example var table = new GlideTableHierarchy("sys_user");
     * gs.info(table.isSoloClass());
     */
    isSoloClass() {}
}