/**
 * The RESTResponseV2 API allows you to use the data returned by an outbound REST message
 * in JavaScript code.
 * @class RESTResponseV2
 * @typedef {Object}  RESTResponseV2
 */
class RESTResponseV2 {
    constructor() {}
    /**
     * Returns all headers contained in the response, including any duplicate
     * headers.
     * @returns The list of headers contained in the response. Each header is represented as a
     * GlideHTTPHeader object which contains the header name and
     * value.
     * @example var r = new sn_ws.RESTMessageV2('&lt;A REST message&gt;', 'get');
     * var response = r.execute();
     * var headers = response.getAllHeaders();
     * for(var i in headers){
     * gs.print(headers[i].name + ': ' + headers[i].value);
     * }
     */
    getAllHeaders() {}
    /**
     * Get the content of the REST response body.
     * @returns The REST response body.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var responseBody = response.getBody();
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
     * 
     */
    getCookies() {}
    /**
     * Get the numeric error code if there was an error during the REST transaction.
     * @returns The numeric error code, such as 1 for socket timeout.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var errorCode = response.getErrorCode();
     */
    getErrorCode() {}
    /**
     * Get the error message if there was an error during the REST transaction.
     * @returns The error message.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var errorMsg = response.getErrorMessage();
     */
    getErrorMessage() {}
    /**
     * Get the value for a specified header.
     * @param {String} name The name of the header that you want the value for, such as Set-Cookie.
     * @returns The value of the specified header.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var headerVal = response.getHeader("Content-Type");
     */
    getHeader(name) {}
    /**
     * Get all headers returned in the REST response and the associated values.
     * @returns An Object that maps the name of each header to the associated value.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var headers = response.getHeaders();
     */
    getHeaders() {}
    /**
     * Get the fully-resolved query sent to the REST endpoint..
     * @returns The fully-resolved query.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var queryString = response.getQueryString();
     */
    getQueryString() {}
    /**
     * Get the sys_id value of the attachment created from the response body
     * content.
     * @returns The sys_id of the new attachment record.
     */
    getResponseAttachmentSysid() {}
    /**
     * Get the numeric HTTP status code returned by the REST provider.
     * @returns The numeric status code returned by the REST provider, such as 200 for a
     * successful response.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var statusCode = response.getStatusCode();
     */
    getStatusCode() {}
    /**
     * Indicate if there was an error during the REST transaction.
     * @returns Returns true if there was an error, false if there was no error.
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute();
     * var error = response.haveError();
     */
    haveError() {}
    /**
     * Set the amount of time the instance waits for a response from the web service
     * provider.
     * @param {Number} timeoutSecs The amount of time, in seconds, to wait for this response.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("Yahoo Finance","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.executeAsync();
     * response.waitForResponse(60);
     */
    waitForResponse(timeoutSecs) {}
}