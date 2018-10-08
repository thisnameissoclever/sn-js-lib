/**
 * The scoped GlidePluginManager API provides a method for determining if a plugin has been
 * activated.
 * @class GlidePluginManager
 * @typedef {Object}  GlidePluginManager
 */
class GlidePluginManager {
    constructor() {}
    /**
     * Determines if the specified plugin has been activated.
     * @param {String} pluginID The plugin ID
     * @returns True if the plugin has been activated.
     * @example var gr = new GlideRecord('sys_plugins');
     * var queryString = "active=0^ORactive=1";
     * gr.addEncodedQuery(queryString);
     * gr.query();
     * pMgr = new GlidePluginManager();
     * while (gr.next()) {
     * var name = gr.getValue('name');
     * var pID = gr.getValue('source');
     * isActive = pMgr.isActive(pID);
     * if (isActive)
     * gs.info('The plugin ' + name + " is  active"  );
     * }
     */
    isActive(pluginID) {}
}