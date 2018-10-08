/**
 * Displays a form in a GlideModal.
 * @class GlideModalFormV3
 * @typedef {Object}  GlideModalFormV3
 */
class GlideModalFormV3 {
    /**
     * Creates an instance of the GlideModalForm class.
     * @param {String} title The form title.
     * @param {String} tableName The table being shown.
     * @param {Function} onCompletionCallback The function to call after the form has been submitted and processed on the
     * server. The callback function has the form callbackFunction(String
     * action_verb, String sys_id, String table, String displayValue) where
     * action_verb is the name of the UI action executed. Examples are sysverb_insert
     * (Submit button),  sysverb_cancel, sysverb_save (Save button).
     * sys_id is the sys_id of the affected record.
     * table is the name of the table containing the record.
     * displayValue
     * 
     */
    constructor(title, tableName, onCompletionCallback) {}
    /**
     * Sets the specified parameter to the specified value.
     * @param {String} name The parameter name.
     * @param {String} value The parameter value.
     * @returns Method does not return a value
     */
    addParm(name, value) {}
    /**
     * Shows the form.
     * @returns Method does not return a value
     */
    render() {}
    /**
     * Sets the function to be called when the form has been successfully submitted and
     * processed by the server.
     * @param {Function} callbackFunction The callback function to be called when the form has been successfully
     * processed.
     * @returns Method does not return a value
     */
    setCompletionCallback(callbackFunction) {}
    /**
     * Sets the function to be called after the form has been loaded.
     * @param {Function} callbackFunction The function to be called after the form has been loaded. The callback function
     * has the form callBackFunction(GlideModalForm obj)
     * @returns Method does not return a value
     */
    setOnloadCallback(callbackFunction) {}
    /**
     * Sets the object's sys_id preference.
     * @param {String} sys_id The id preference. One of the query parameters passed to the form.
     * @returns Method does not return a value
     */
    setSysID(sys_id) {}
}