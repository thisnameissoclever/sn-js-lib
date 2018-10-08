/**
 * The GlideAjaxV3 API provides the ability to asynchronously execute server-side scripts
 * from a client-side script.
 * @class GlideAjaxV3
 * @typedef {Object}  GlideAjaxV3
 */
class GlideAjaxV3 {
    /**
     * Creates an instance of the GlideAjaxV3 class.
     * @param {String} processor The name of the processor (server-side script) to call.
     */
    constructor(processor) {}
    /**
     * Set a name-value pair to be sent to the processor.
     * @param {String} name The name of the parameter. This usually has the prefix 'sysparm_'.
     * @param {String} value The parameter value.
     * @returns Method does not return a value
     */
    addParam(name, value) {}
    /**
     * Call the processor asynchronously and get the answer element of the response in JSON
     * format.
     * @param {Function} callback The callback function. The function receives the answer element of the response
     * as a JSON object.
     * @returns Method does not return a value
     */
    getJSON(callback) {}
    /**
     * Returns the value of the specified parameter.
     * @param {String} name The name of the parameter to return.
     * @returns The specified parameter's value.
     */
    getParam(name) {}
    /**
     * Returns the name-value pairs for the request.
     * @returns The request's name-value pairs.
     */
    getParams() {}
    /**
     * Returns the server-side script that the request is going to use.
     * @returns The value of the request's sysparm_processor parameter.
     */
    getProcessor() {}
    /**
     * Returns the target URL.
     * @returns The URL where the Ajax request will be sent.
     */
    getURL() {}
    /**
     * Call the processor asynchronously and get the response in XML format.
     * @param {Function} callback The callback function. The function receives the response as an
     * argument.
     * @returns Method does not return a value
     */
    getXML(callback) {}
    /**
     * Call the processor asynchronously and get the answer element of the response in XML
     * format.
     * @param {Function} callback The callback function. The function receives the answer element of the
     * response in XML format as an argument.
     * @returns Method does not return a value
     * @example function autofillPhoneNumber(sysid) {
     * var ga = new GlideAjax('x_abc_myscope.AjaxUtils');
     * ga.addParam('sysparm_type', 'getPhoneNumberForUser');
     * ga.addParam('sysparm_user', sysid);
     * ga.getXMLAnswer(function(answer) {
     * g_form.setValue('phone_number', answer);
     * });
     * }
     */
    getXMLAnswer(callback) {}
    /**
     * Sets a callback function to be called if the Ajax request fails.
     * @param {Function} callback The function to be called if the Ajax request fails. The callback function has
     * one parameter, the XMLHttpRequest object.
     * @returns Method does not return a value
     */
    setErrorCallback(callback) {}
    /**
     * Sets the request's server-side script. The server-side script is also called the
     * processor.
     * @param {String} serverScript The server-side script (processor) to receive the request.
     * @returns Method does not return a value
     */
    setProcessor(serverScript) {}
}