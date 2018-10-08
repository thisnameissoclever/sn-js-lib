/**
 * Provides methods to control and refresh the navigator and main frame.
 * @class GlideNavigationV3
 * @typedef {Object}  GlideNavigationV3
 */
class GlideNavigationV3 {
    constructor() {}
    /**
     * Redirects to a new URL.
     * @param {String} url The URL to be loaded. It can be any URL supported by the browser.
     * @param {String} target The frame to use. If omitted, opens in the current frame.
     * @returns Method does not return a value
     */
    open(url, target) {}
    /**
     * Opens a popup window.
     * @param {String} url The URL to open.
     * @param {String} name The window name
     * @param {String} features A comma separated list of features for the popup window.
     * @param {Boolean} noStack True to append sysparm_stack=no to the url. This prevents weirdness when using
     * the form back button.
     * @returns The instance of the new window.
     */
    openPopup(url, name, features, noStack) {}
    /**
     * Redirects to a record. The record will be displayed in the navigator.
     * @param {String} tableName The name of the table containing the record to be displayed.
     * @param {String} sys_id The sys_id of the record to be displayed.
     * @returns Method does not return a value
     */
    openRecord(tableName, sys_id) {}
    /**
     * Refreshes the navigator display.
     * @returns Method does not return a value
     */
    refreshNavigator() {}
    /**
     * Reloads the current frame.
     * @returns Method does not return a value
     */
    reloadWindow() {}
}