/**
 * The GlideServletRequest API is used in processor scripts.
 * @class GlideServletRequest
 * @typedef {Object}  GlideServletRequest
 */
class GlideServletRequest {
    constructor() {}
    /**
     * Returns the MIME type of the body of the request.
     * @returns The content type, returns null if the content type is not known.
     * @example var contentType = g_request.getContentType();
     */
    getContentType() {}
    /**
     * Returns the header value.
     * @param {String} name The name of the header to be retrieved.
     * @returns The header.
     * @example var headerValue = g_request.getHeader("host");
     */
    getHeader(name) {}
    /**
     * Returns a comma-separated list of header names.
     * @returns A comma-separated list of header names.
     * @example var headerList = g_request.getHeaderNames();
     */
    getHeaderNames() {}
    /**
     * Returns the header values.
     * @param {String} name Names of the headers to be retrieved.
     * @returns The header values.
     * @example var headerValue = g_request.getHeaders("host");
     */
    getHeaders(name) {}
    /**
     * Returns the value of the parameter contained in the request URL.
     * @param {String} name The name of the parameter to be retrieved. This can be the parameter endpoint
     * from the processor form.
     * @returns The parameter value. Returns null if the parameter is not found.
     * @example var name = g_request.getParameter("x_snc_custom_x_snc_name");
     */
    getParameter(name) {}
    /**
     * Returns a list of the parameter names found in the request URL.
     * @returns A comma-separated list of parameter names.
     * @example var paramList = g_request.getParameterNames();
     */
    getParameterNames() {}
    /**
     * Returns the query string from the request.
     * @returns The query string.
     * @example var daString = g_request.getQueryString();
     * g_processor.writeOutput("The query string is: " + daString);
     */
    getQueryString() {}
}