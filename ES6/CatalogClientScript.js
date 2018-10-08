/**
 * CatalogClientScript API enables you to create, modify, or delete
 * catalog client script records. To use this class in a scoped application, use the sn_sc namespace
 * identifier. The Service Catalog Scoped API plugin (ID: com.glideapp.servicecatalog.scoped.api)
 * that is enabled by default is required to access the CatalogClientScript
 * API.
 * @class CatalogClientScript
 * @typedef {Object}  CatalogClientScript
 */
class CatalogClientScript {
    /**
     * Creates an instance of the CatalogClientScript class.
     */
    constructor() {}
    /**
     * Adds a script to the catalog client script.
     * @param {String} script Script to be added to the catalog client script.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.addScript("function onLoad(){Enter the script}");
     */
    addScript(script) {}
    /**
     * Specifies if the catalog client script runs on a catalog item.
     * @param {Boolean} flag If true, the catalog client script runs on the catalog item. If false, the
     * catalog client script does not run on the catalog item.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.appliesToCatalogItem(true);
     */
    appliesToCatalogItem(flag) {}
    /**
     * Specifies if the catalog client script runs on a catalog task.
     * @param {Boolean} flag If true, the catalog client script runs on the catalog task. If false, the
     * catalog client script does not run on the catalog task.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.appliesToCatalogTask(true);
     */
    appliesToCatalogTask(flag) {}
    /**
     * Specifies if the catalog client script runs on a requested item.
     * @param {Boolean} flag If true, the catalog client script runs on the requested item. If false, the
     * catalog client script does not run on the requested item.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.appliesToRequestedItem(true);
     */
    appliesToRequestedItem(flag) {}
    /**
     * Specifies if the catalog client script runs on a requested item.
     * @param {Boolean} flag If true, the catalog client script runs on the target record. If false, the
     * catalog client script does not run on the target record.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.appliesToTargetRecord(true);
     */
    appliesToTargetRecord(flag) {}
    /**
     * Inserts the defined catalog client script in the catalog_script_client table.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns sys_id of the catalog client script.
     * @example 
     * var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.setAttributes({"name": "My Catalog Item", "applies_to": "item", "ui_type": "desktop", "type": "onLoad"});
     * catalogClientScript.appliesToCatalogItem(true);
     * catalogClientScript.appliesToRequestedItem(true);
     * catalogClientScript.appliesToCatalogTask(true);
     * catalogClientScript.appliesToTargetRecord(true);
     * var catalogClientScriptId = catalogClientScript.create();
     * gs.info(catalogClientScriptId);
     * 
     */
    create(standardUpdate) {}
    /**
     * Deletes the defined catalog client script.
     * @param {String} sys_id sys_id of the catalog client script.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns Method does not return a value
     * @example 
     * var sys_id = "039c516237b1300054b6a3549dbe5dfc";
     * var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.deleteRecord("039c516237b1300054b6a3549dbe5dfc");
     */
    deleteRecord(sys_id, standardUpdate) {}
    /**
     * Defines attribute values for the catalog client script.
     * @param {Map} attributes A JSON object that has mapping for the field and value pairs.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.setAttributes({"name": "My Catalog Item", "applies_to": "catalog_item", "ui_type": "desktop", "type": "onLoad"});
     */
    setAttributes(attributes) {}
    /**
     * Associates a catalog item with the catalog client script.
     * @param {String} sys_id sys_id of the catalog item.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.setCatalogItem("039c516237b1300054b6a3549dbe5dfc");
     */
    setCatalogItem(sys_id) {}
    /**
     * Runs the catalog client script when a variable value is updated.
     * @param {String} sys_id sys_id of the variable.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.setOnChangeVariable("039c516237b1300054b6a3549dbe5dfc");
     */
    setOnChangeVariable(sys_id) {}
    /**
     * Associates a variable set with the catalog client script.
     * @param {String} sys_id sys_id of the variable set.
     * @returns Method does not return a value
     * @example var catalogClientScript = new sn_sc.CatalogClientScript();
     * catalogClientScript.setVariableSet("039c516237b1300054b6a3549dbe5dfc");
     */
    setVariableSet(sys_id) {}
}