/**
 * The RESTMessageV2 API allows you to send
 * outbound REST messages
 * using JavaScript.
 * @class RESTMessageV2
 * @typedef {Object}  RESTMessageV2
 */
class RESTMessageV2 {
    /**
     * Instantiates an empty RESTMessageV2 object.
     */
    constructor() {}
    /**
     * Sends the REST message to the endpoint.
     * @returns The response returned by the REST provider.
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute(); //Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
     */
    execute() {}
    /**
     * Sends the REST message to the endpoint asynchronously. The instance does not wait for a
     * response from the web service provider when making asynchronous calls.
     * @returns The response returned by the REST provider.
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.executeAsync(); //Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
     * response.waitForResponse(60); // In seconds. Wait at most 60 seconds to get response from ECC Queue/Mid Server //Might throw exception timing out waiting for response in ECC queue.
     */
    executeAsync() {}
    /**
     * Returns the URL of the endpoint for the REST message.
     * @returns The URL of the REST web service provider.
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var endpoint = sm.getEndpoint();
     */
    getEndpoint() {}
    /**
     * Returns the content of the REST message body.
     * @returns The REST message body.
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var body = sm.getRequestBody();
     */
    getRequestBody() {}
    /**
     * Returns the value for an HTTP header specified in the REST message.
     * @param {String} headerName The request header you want to get the value for.
     * @returns The value of the specified header.
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var header = sm.getRequestHeader("Accept");
     */
    getRequestHeader(headerName) {}
    /**
     * Returns HTTP headers that were set by the REST client and the associated
     * values.
     * @returns An Object that maps the name of each header to the associated value.
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var headers = sm.getRequestHeaders();
     */
    getRequestHeaders() {}
    /**
     * Configures the REST message to save the returned response body as an attachment
     * record.
     * @param {String} tableName Specify the table that contains the record you want to attach the saved file
     * to.
     * @param {String} recordSysId Specify the sys_id of the record you want to attach the saved file to.
     * @param {String} fileName Specify the file name to give to the saved file.
     * @returns Method does not return a value
     * @example (function sampleRESTMessageV2() {
     * try{
     * var request  = new sn_ws.RESTMessageV2();
     * request.setHttpMethod('get');
     * var attachment_sys_id  = '&lt;attachment_record_sys_id&gt;',
     * tablename = 'incident',
     * recordSysId = '&lt;incident_sys_id&gt;',
     * response,
     * httpResponseStatus,
     * filename ='&lt;filename&gt;';
     * //endpoint - ServiceNow REST Attachment API
     * request.setEndpoint('https://&lt;instance_name&gt;.service-now.com/api/now/attachment/' + attachment_sys_id  +'/file');
     * request.setBasicAuth('&lt;username&gt;', '&lt;password&gt;');
     * //RESTMessageV2 - saveResponseBodyAsAttachment(String tableName, String recordSysId, String fileName)
     * request.saveResponseBodyAsAttachment(tablename, recordSysId, filename);
     * response = request.execute();
     * httpResponseStatus = response.getStatusCode();
     * gs.print(" http response status_code:  " + httpResponseStatus);
     * }
     * catch(ex){
     * var message  = ex.getMessage();
     * gs.print(message);
     * }
     * })();
     */
    saveResponseBodyAsAttachment(tableName, recordSysId, fileName) {}
    /**
     * Configure the REST message to save the returned response body as an encrypted
     * attachment record.
     * @param {String} tableName Specify the table that contains the record you want to attach the saved file
     * to.
     * @param {String} recordSysId Specify the sys_id of the record you want to attach the saved file to.
     * @param {String} fileName Specify the file name to give to the saved file.
     * @param {String} encryptContext Specify the sys_id of an encryption context. The saved file is encrypted using
     * this context.
     * @returns Method does not return a value
     */
    saveResponseBodyAsAttachment(tableName, recordSysId, fileName, encryptContext) {}
    /**
     * Sets the credentials for the REST message using an existing basic auth or OAuth 2.0
     * profile.
     * @param {String} type The type of authentication profile to use. Valid values are 'basic' to use
     * basic authentication, or 'oauth2' to use OAuth 2.0.
     * @param {String} profileId The sys_id of an authentication profile record. When using basic auth, specify
     * the sys_id of a Basic Auth Configuration [sys_auth_profile_basic] record. When using
     * OAuth 2.0, specify the sys_id of a OAuth Entity Profile [oauth_entity_profile]
     * record.
     * @returns Method does not return a value
     * @example var requestBody;
     * var responseBody;
     * var status;
     * var sm;
     * try{
     * // Might throw exception if message doesn't exist or not visible due to scope.
     * sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;", "get");
     * //set auth profile to an OAuth 2.0 profile record.
     * sm.setAuthenticationProfile('oauth2', '1234adsf123212131123qasdsf');
     * sm.setStringParameter("symbol", "NOW");
     * sm.setStringParameterNoEscape("xml_data","&lt;data&gt;test&lt;/data&gt;");
     * //In milliseconds. Wait at most 10 seconds for response from http request.
     * sm.setHttpTimeout(10000);
     * //Might throw exception if http connection timed out or some issue
     * //with sending request itself because of encryption/decryption of password.
     * response = sm.execute();
     * responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
     * status = response.getStatusCode();
     * } catch(ex) {
     * responseBody = ex.getMessage();
     * status = '500';
     * } finally {
     * requestBody = sm ? sm.getRequestBody():null;
     * }
     */
    setAuthenticationProfile(type, profileId) {}
    /**
     * Sets basic authentication headers for the REST message.
     * @param {String} userName The username you want to use to authenticate the REST message.
     * @param {String} userPass The password for the specified user.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setBasicAuth("username","password");
     */
    setBasicAuth(userName, userPass) {}
    /**
     * Associate outbound requests and the resulting response record in the ECC queue. This
     * method only applies to REST messages sent through a MID Server.
     * @param {String} correlator A unique identifier
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setEccCorrelator("unique_identifier");
     */
    setEccCorrelator(correlator) {}
    /**
     * Override a value from the database by writing to the REST message payload. This method
     * only applies to REST messages sent through a MID Server.
     * @param {String} name The name of the parameter, such as source.
     * @param {String} value The value to assign to the specified parameter.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setEccParameter("source","http://very.long.endpoint.url");
     */
    setEccParameter(name, value) {}
    /**
     * Set the endpoint for the REST message.
     * @param {String} endpoint The URL of the REST provider you want to interface with.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2();
     * sm.setEndpoint("http://web.service.endpoint");
     */
    setEndpoint(endpoint) {}
    /**
     * The HTTP method this REST message performs, such as GET or PUT.
     * @param {String} method The HTTP method to perform.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2();
     * sm.setHttpMethod("post");
     */
    setHttpMethod(method) {}
    /**
     * Set the amount of time the REST message waits for a response from the web service
     * provider before the request times out.
     * @param {Number} timeoutMs The amount of time, in milliseconds, before the call to the REST provider times
     * out.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setHttpTimeout(6000);
     */
    setHttpTimeout(timeoutMs) {}
    /**
     * Set the log level for this message and the corresponding response.
     * @param {String} level The log level. Valid values are basic, elevated, and all.
     * @returns Method does not return a value
     * @example var rm = new sn_ws.RESTMessageV2();
     * rm.setLogLevel(‘all’);
     */
    setLogLevel(level) {}
    /**
     * Configures the REST message to communicate through a MID Server.
     * @param {String} midServer The name of the MID Server to use. Your instance must have an active MID Server
     * with the specified name.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setMIDServer("mid_server_name");
     */
    setMIDServer(midServer) {}
    /**
     * Sets the mutual authentication protocol profile for the REST message.
     * @param {String} profileName The Name of the protocol profile to use for mutual
     * authentication.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setMutualAuth("mutual_auth_profile_name");
     */
    setMutualAuth(profileName) {}
    /**
     * Append a parameter to the end of the request URL with the form name=value.
     * @param {String} name The name of the URL parameter to pass.
     * @param {String} value The value to assign the URL parameter.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2();
     * //Set up message, including endpoint and authentication
     * sm.setQueryParameter("sysparm_query","active=true^ORDERBYnumber^ORDERBYDESCcategory");
     */
    setQueryParameter(name, value) {}
    /**
     * Set the body content to send to the web service provider when using PUT or POST HTTP
     * methods.
     * @param {String} body The request body to send.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("Update user","post"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var body = "&lt;Message body content&gt;";
     * sm.setRequestBody(body);
     */
    setRequestBody(body) {}
    /**
     * Sets the request body using an existing attachment record.
     * @param {String} attachmentSysId The sys_id of the Attachment [sys_attachment] record you want to send in this
     * REST message.
     * @returns Method does not return a value
     * @example (function sampleRESTMessageV2() {
     * try {
     * var request = new sn_ws.RESTMessageV2();
     * request.setHttpMethod('post');
     * request.setEndpoint('&lt;web service endpoint URL&gt;');
     * request.setRequestBodyFromAttachment('&lt;attachment sys_id&gt;');
     * var response = request.execute();
     * var httpResponseStatus = response.getStatusCode();
     * gs.print("http response status_code: " + httpResponseStatus);
     * }
     * catch (ex) {
     * var message = ex.getMessage();
     * gs.print(message);
     * }
     * })();
     */
    setRequestBodyFromAttachment(attachmentSysId) {}
    /**
     * Set the body content of a PUT or POST message using a binary stream.
     * @param {Object} stream The binary data to send, such as an attachment or a stream from a 3rd-party
     * service.
     * @returns Method does not return a value
     */
    setRequestBodyFromStream(stream) {}
    /**
     * Sets an HTTP header in the REST message to the specified value.
     * @param {String} name The name of the header.
     * @param {String} value The value to assign to the specified header.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setRequestHeader("Accept","Application/json");
     */
    setRequestHeader(name, value) {}
    /**
     * Override the default requestor profile for the REST message in order to retrieve an
     * OAuth access token associated with a different requestor.
     * @param {String} requestorContext  
     * @param {String} requestorId  
     * @returns Method does not return a value
     */
    setRequestorProfile(requestorContext, requestorId) {}
    /**
     * Sets a REST message function variable with the specified name from the REST message
     * record to the specified value.
     * @param {String} name The name of the REST message variable. This parameter must be defined in the
     * REST message record before you can assign a value to it.
     * @param {String} value The value to assign the variable.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setStringParameter("s","NOW");
     */
    setStringParameter(name, value) {}
    /**
     * Sets a REST message function variable with the specified name from the REST message
     * record to the specified value.
     * @param {String} name The name of the REST message variable. This parameter must be defined in the
     * REST message record before you can assign a value to it.
     * @param {String} value The value to assign the variable.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.RESTMessageV2("&lt;REST_message_record&gt;","get"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setStringParameterNoEscape("s","NOW");
     */
    setStringParameterNoEscape(name, value) {}
}