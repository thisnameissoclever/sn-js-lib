/**
 * A RESTAPIRequest object allows you to access scripted REST API request details in
 * scripts.
 * @class RESTAPIRequest
 * @typedef {Object}  RESTAPIRequest
 */
class RESTAPIRequest {
    constructor() {}
    /**
     * Returns the value of a specific header from the web service request.
     * @param {String} header The name of the header, such as accept or
     * content-type.
     * @returns The value of the specified header.
     * @example var acceptHeader = request.getHeader('accept');
     */
    getHeader(header) {}
    /**
     * Get the content types specified in the request Accept header.
     * @returns An array of string values where each string is a content type, such as
     * application/json.
     */
    getSupportedResponseContentTypes() {}
}