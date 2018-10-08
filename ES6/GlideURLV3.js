/**
 * Provides methods for manipulating a URI.
 * @class GlideURLV3
 * @typedef {Object}  GlideURLV3
 */
class GlideURLV3 {
    /**
     * Creates an instance of the GlideURL class.
     * @param {String} contextPath A relative path for the URL.
     */
    constructor(contextPath) {}
    /**
     * Adds a query string name-value pair to the URL.
     * @param {String} name Name of the query string parameter.
     * @param {String} value Query string value.
     * @returns The GlideURL
     * @example var gu = new GlideURL('incident.do');
     * var url = gu.addParam('sys_id', '-1');
     * 
     */
    addParam(name, value) {}
    /**
     * Get the entire context path and query string parameters as a single URI.
     * @param {Object} additionalParams A name-value pair object that contains parameters that are added to this URL
     * request only. These additional parameters are not saved to the GlideURL
     * object.
     * @returns The GlideURL with the specified additional parameters added to the end.
     */
    getURL(additionalParams) {}
    /**
     * Reloads the current page URL.
     * @returns Method does not return a value
     */
    refresh() {}
}