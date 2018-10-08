/**
 * A RESTAPIResponse object allows you to build a RESTful response to a scripted REST API
 * request.
 * @class RESTAPIResponse
 * @typedef {Object}  RESTAPIResponse
 */
class RESTAPIResponse {
    constructor() {}
    /**
     * Get the ResponseStreamWriter for this response, allowing you to write directly to the
     * response stream.
     * @returns The ResponseStreamWriter for this response. You can use this object to write
     * directly to the response stream.
     * @example response.setContentType('application/json');
     * response.setStatus(200);
     * var writer = response.getStreamWriter();
     */
    getStreamWriter() {}
    /**
     * Sets the body content to send in the web service response.
     * @param {Object} body The response body, as a JavaScript object.
     * The body content is automatically serialized to JSON or XML depending on the
     * value of the Accept header passed in the request.
     * @returns Method does not return a value
     * @example var body = {};
     * body.name = "incident";
     * body.number = "1234";
     * body.caller = {"id": "user1"};
     * response.setBody(body);
     * 
     * @example var bodyArray = [];
     * var body = {};
     * body.name = "incident";
     * body.number = "1234";
     * body.caller = {"id":"user1"};
     * bodyArray.push(body);
     * response.setBody(bodyArray);
     */
    setBody(body) {}
    /**
     * Assigns a value to the Content-Type header in the web service response.
     * @param {String} contentType The content type of the response body, such as application/json.
     * @returns Method does not return a value
     * @example responseBuilder.setContentType('application/json');
     */
    setContentType(contentType) {}
    /**
     * Configure the response to return an error.
     * @param {Object} error An error object.
     * @returns Method does not return a value
     */
    setError(error) {}
    /**
     * Assign a value to a REST service response header.
     * @param {String} header The header you want to set.
     * @param {String} value The value to assign the specified header.
     * @returns Method does not return a value
     * @example responseBuilder.setHeader("Location","&lt;URI&gt;");
     */
    setHeader(header, value) {}
    /**
     * Sets the headers for the web service response.
     * @param {Object} headers A JavaScript object listing each header and the value to assign that
     * header.
     * @returns Method does not return a value
     * @example var headers = {};
     * headers.X-Total-Count=100;
     * headers.Location=‘https://instance.service-now.com/&lt;endpoint_to_resource&gt;';
     * response.setHeaders(headers);
     */
    setHeaders(headers) {}
    /**
     * Assigns a value to the Location header in the web service response.
     * @returns Method does not return a value
     */
    setLocation() {}
    /**
     * Sets the status code number for the web service response.
     * @param {Number} status The status code to send in the response, such as 200 to indicate success.
     * Passing a non-numerical value, such as a string, causes the status code to default
     * to 0.
     * @returns Method does not return a value
     * @example response.setStatus(200);
     */
    setStatus(status) {}
}