/**
 * The SOAPMessageV2 API allows you to send an outbound SOAP message using
 * JavaScript.
 * @class SOAPMessageV2
 * @typedef {Object}  SOAPMessageV2
 */
class SOAPMessageV2 {
    /**
     * Instantiates an empty SOAPMessageV2 object.
     */
    constructor() {}
    /**
     * Send the SOAP message to the endpoint.
     * @returns The response returned by the SOAP provider.
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.execute(); //Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
     */
    execute() {}
    /**
     * Send the SOAP message to
     * the ECC queue.
     * @returns The response returned by the SOAP provider.Note:  Attempting to use the SOAP
     * response object before the response has been processed may result in a timeout
     * error.
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var response = sm.executeAsync();
     */
    executeAsync() {}
    /**
     * Get the endpoint for the SOAP message.
     * @returns The URL of the SOAP web service provider.
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var endpoint = sm.getEndpoint();
     */
    getEndpoint() {}
    /**
     * Get the content of the SOAP message body.
     * @returns The SOAP message body.
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var endpoint = sm.getRequestBody();
     */
    getRequestBody() {}
    /**
     * Get the value for an HTTP header specified by the SOAP client.
     * @param {String} headerName The request header you want to get the value for.
     * @returns The value of the specified header.
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var header = sm.getRequestHeader("Accept");
     */
    getRequestHeader(headerName) {}
    /**
     * Get HTTP headers that were set by the SOAP client and the associated
     * values.
     * @returns An Object that maps the name of each header to the associated value.
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var endpoint = sm.getRequestHeaders();
     */
    getRequestHeaders() {}
    /**
     * Set basic authentication headers for the SOAP message.
     * @param {String} userName The username to use when authenticating the SOAP message.
     * @param {String} userPass The password for the specified user.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setBasicAuth("username","password");
     */
    setBasicAuth(userName, userPass) {}
    /**
     * Associate outbound requests and the resulting response record in the ECC
     * queue.
     * @param {String} correlator A unique identifier.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setEccCorrelator("unique_id");
     */
    setEccCorrelator(correlator) {}
    /**
     * Override a value from the database by writing to the SOAP message payload.
     * @param {String} name The name of the ECC parameter.
     * @param {String} value The value to assign to the specified ECC parameter.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setEccParameter("source","http://very.long.endpoint");
     */
    setEccParameter(name, value) {}
    /**
     * Set the endpoint for the SOAP message.
     * @param {String} endpoint The URL of the SOAP web service provider you want to interface with.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2();
     * sm.setEndpoint("http://web.service.endpoint");
     */
    setEndpoint(endpoint) {}
    /**
     * Set the amount of time the SOAP message waits for a response from the web service
     * provider before the request times out.
     * @param {Number} timeoutMs The amount of time to wait for a response from the web service provider, in
     * milliseconds.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setHttpTimeout(6000);
     */
    setHttpTimeout(timeoutMs) {}
    /**
     * Sets the log level for this message and the corresponding response.
     * @param {String} level The log level. Valid values are basic, elevated, and all.
     * @returns Method does not return a value
     */
    setLogLevel(level) {}
    /**
     * Configure the SOAP message to be sent through a MID Server.
     * @param {String} midServerName The name of the MID Server you want to send the SOAP message through. Your
     * instance must have an active MID Server with the specified name.
     * @returns Method does not return a value
     */
    setMIDServer(midServerName) {}
    /**
     * Set the mutual authentication
     * protocol
     * profile for the SOAP message.
     * @param {String} profileName The name of the protocol profile to use for mutual authentication.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setMutualAuth("auth_profile_name");
     */
    setMutualAuth(profileName) {}
    /**
     * Set the body content to send to the web service provider.
     * @param {String} requestBody The body of the SOAP message.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * var body = "&lt;SOAP message body&gt;";
     * sm.setRequestBody(body);
     */
    setRequestBody(requestBody) {}
    /**
     * Set an HTTP header in the SOAP message to the specified value.
     * @param {String} headerName The name of the header.
     * @param {String} headerValue The value to assign to the specified header.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setRequestHeader("Accept","Application/json");
     */
    setRequestHeader(headerName, headerValue) {}
    /**
     * Define the SOAP action this SOAP message performs.
     * @param {String} soapAction The SOAP action this SOAP message performs.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2();
     * sm.setSOAPAction("GetQuote");
     * //construct SOAP message by specifying endpoint and auth
     * sm.execute();
     */
    setSOAPAction(soapAction) {}
    /**
     * Set a variable with the specified name from the SOAP message record to the specified
     * value.
     * @param {String} name The name of the SOAP message variable.
     * @param {String} value The value to assign to the specified variable.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setStringParameter("symbol","NOW");
     */
    setStringParameter(name, value) {}
    /**
     * Set a variable with the specified name from the SOAP message record to the specified
     * value.
     * @param {String} name The name of the SOAP message variable.
     * @param {String} value The value to assign to the specified variable.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setStringParameterNoEscape("symbol","NOW");
     */
    setStringParameterNoEscape(name, value) {}
    /**
     * Sets web service security values for the SOAP message.
     * @param {String} keystoreId The sys_id of the Java or PKCS12 key store to use.
     * @param {String} keystoreAlias The alias that identifies the public and private keys.
     * @param {String} keystorePassword The password assigned to the key store record.
     * @param {String} certificateId The sys_id of the trusted server certificate.
     * @returns Method does not return a value
     * @example var sm = new sn_ws.SOAPMessageV2("StockQuote","GetQuote"); //Might throw exception if message doesn't exist or not visible due to scope.
     * sm.setWSSecurity("70d65e074f3812001f6eac118110c71a","Quote keys","UXr82cqX75Z7MaSa+EyjGA==","ba969a074f3812001f6eac118110c76d");
     */
    setWSSecurity(keystoreId, keystoreAlias, keystorePassword, certificateId) {}
}