/**
 * Utility methods to perform common functions in a Service Portal widget client
 * script.
 * @class spUtil
 * @typedef {Object}  spUtil
 */
class spUtil {
    constructor() {}
    /**
     * Displays a notification error message.
     * @param {String} message Error message to display.
     * @returns Method does not return a value
     * @example spUtil.addErrorMessage("There has been an error processing your request")
     */
    addErrorMessage(message) {}
    /**
     * Displays a notification info message.
     * @param {String} message Message to display.
     * @returns Method does not return a value
     * @example spUtil.addInfoMessage("Your order has been placed")
     */
    addInfoMessage(message) {}
    /**
     * Displays a trivial notification message.
     * @param {String} message Message to display.
     * @returns Method does not return a value
     * @example spUtil.addTrivialMessage("Thanks for your order")
     */
    addTrivialMessage(message) {}
    /**
     * Formats a string as an alternative to string concatenation.
     * @param {String} template String template with values for substitution. 
     * @param {Object} data Object containing variables for substitution.
     * @returns A formatted string.
     * @example spUtil.format('An error ocurred: {error} when loading {widget}', {error: '404', widget: 'sp-widget'})
     */
    format(template, data) {}
    /**
     * Returns a widget model by ID or sys_id.
     * @param {String} widgetId Widget ID or sys_id of the widget to embed.
     * @param {Object} data (Optional) Name/value pairs of parameters to pass to the widget model.
     * @returns Model of the embedded widget.
     * @example spUtil.get("widget-cool-clock").then(function(response) {
     * c.coolClock = response;
     * });
     * @example spUtil.get('pps-list-modal', {title: c.data.editAllocations,
     * table: 'resource_allocation',
     * queryString: 'GROUPBYuser^resource_plan=' + c.data.sysId,
     * view: 'resource_portal_allocations' }).then(function(response) {
     * var formModal = response;
     * c.allocationListModal = response;
     * });
     * 
     */
    get(widgetId, data) {}
    /**
     * Watches for updates to a table or filter and returns the value from the callback
     * function.
     * @param {Object} $scope The scope of the data object updated by the callback function.
     * @param {String} table Watched table.
     * @param {String} filter Filter for fields to watch.
     * @param {Function} callback An optional parameter to define the callback function.
     * @returns The return value of the callback function.
     * @example //A simple recordWatch function.
     * spUtil.recordWatch($scope, "live_profile", "sys_id=" + liveProfileId);
     * //In a widget client script
     * function(spUtil, $scope) {
     * // widget controller
     * var c =this;
     * // Registers a listener on the incident table with the filter active=true,
     * // meaning that whenever something changes on that table with that filter,
     * // the callback function is executed.
     * // The callback function takes two parameters: name and data.
     * spUtil.recordWatch($scope, "incident", "active=true", function(name, data) {
     * // Returns information about the event that has occurred
     * console.log(name);
     * // Returns the data inserted or updated on the table
     * console.log(data);
     * });
     * }
     * 
     */
    recordWatch($scope, table, filter, callback) {}
    /**
     * Calls the server and replaces the current options and
     * data with the server response.
     * @param {Object} $scope The scope defined for the update.
     * @returns The updated options and data objects.
     */
    refresh($scope) {}
    /**
     * Updates the data object on the server within a given scope.
     * @param {Object} $scope The scope defined for the update.
     * @returns The updated data object.
     */
    update($scope) {}
}