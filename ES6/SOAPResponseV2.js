/**
 * The SOAPResponseV2 API allows you to use the data returned by an outbound SOAP message
 * in JavaScript code.
 * @class SOAPResponseV2
 * @typedef {Object}  SOAPResponseV2
 */
class SOAPResponseV2 {
    constructor() {}
    /**
     * Return all headers contained in the response, including any duplicate
     * headers.
     * @returns The list of headers contained in the response. Each header is represented as a
     * GlideHTTPHeader object which contains the header name and
     * value.
     * @example var r = new sn_ws.SOAPMessageV2('&lt;A SOAP message&gt;', 'get');
     * var response = r.execute();
     * var headers = response.getAllHeaders();
     * for(var i in headers){
     * gs.print(headers[i].name + ': ' + headers[i].value);
     * }
     */
    getAllHeaders() {}
    /**
     * Get the content of the SOAP response body.
     * @returns The SOAP response body.
     * @example var body = response.getBody();
     */
    getBody() {}
    /**
     * Returns all cookies included in the response.
     * @returns The list of cookies. Iterate through the list to perform operations on each
     * cookie.
     * @example var cookies = response.getCookies();
     * var i;
     * for(i=0;i&lt;cookies.size();i++) {
     * gs.print(‘cookie: ‘ + cookies.get(i));
     * }
     */
    getCookies() {}
    /**
     * Get the numeric error code if there was an error during the SOAP
     * transaction.
     * @returns The numeric error code, such as 1 for a socket timeout.
     * @example var errorCode = response.getErrorCode();
     */
    getErrorCode() {}
    /**
     * Get the error message if there was an error during the SOAP transaction.
     * @returns The error message.
     * @example var errorMsg = response.getErrorMessage();
     */
    getErrorMessage() {}
    /**
     * Get the value for a specified HTTP header.
     * @param {String} name The name of the header that you want the value for, such as Set-Cookie.
     * @returns The value of the specified header.
     * @example var headerVal = response.getHeader("Accept");
     */
    getHeader(name) {}
    /**
     * Get all HTTP headers returned in the SOAP response and the associated
     * values.
     * @returns An Object that maps the name of each header to the associated value.
     * @example var headers = response.getHeaders();
     */
    getHeaders() {}
    /**
     * Get the numeric HTTP status code returned by the SOAP provider.
     * @returns The numeric status code returned by the SOAP provider, such as 200 for a
     * successful response.
     * @example var statusCode = response.getStatusCode();
     */
    getStatusCode() {}
    /**
     * Indicate if there was an error during the SOAP transaction.
     * @returns Returns true if there was an error, false if there was no error.
     * @example var error = response.haveError();
     */
    haveError() {}
    /**
     * Set the amount of time the instance waits for a response from the web service
     * provider.
     * @param {Number} timeoutSecs The amount of time, in seconds, to wait for this response.
     * @returns Method does not return a value
     * @example response.waitForResponse(60);
     */
    waitForResponse(timeoutSecs) {}
}