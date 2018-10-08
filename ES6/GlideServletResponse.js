/**
 * The GlideServletResponse API is used in processor scripts.
 * @class GlideServletResponse
 * @typedef {Object}  GlideServletResponse
 */
class GlideServletResponse {
    constructor() {}
    /**
     * Sends a temporary redirect to the client.
     * @param {String} location The URL to receive the response.
     * @returns Method does not return a value
     */
    sendRedirect(location) {}
    /**
     * Sets the MIME type of the response
     * @param {String} type The MIME type.
     * @returns Method does not return a value
     * @example g_response.setContentType('text/html;charset=UTF-8');
     */
    setContentType(type) {}
    /**
     * Sets a response header to the specified value.
     * @param {String} key Specifies the header.
     * @param {String} value The value to be assigned to the header. If the header exists, it is over
     * written.
     * @returns Method does not return a value
     * @example g_response.setHeader("host", "demonightlyus.service-now.com");
     */
    setHeader(key, value) {}
    /**
     * Sets the status code for the response.
     * @param {Number} status The status to be set.
     * @returns Method does not return a value
     * @example // set the status to okay
     * g_response.setStatus(200);
     */
    setStatus(status) {}
}