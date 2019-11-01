var sn_ws = {
	/**
	 * Instantiates an empty RESTMessageV2 object.
	 When using an object instantiated without an argument, you must manually specify an HTTP method and endpoint.
	WITH an argument;
	 Instantiates a RESTMessageV2 object using information from a REST message record.
	 You must have a REST message record defined before you can use this constructor (with an argument)
	 * @param {string} [name] - The name of the extant REST message defined in the system
	 * @param {string} [methodName] - The name of the method to use (e.g. "Default GET")
	 * @constructor
	 */
	'RESTMessageV2' : function(name, methodName) {
		/**
		 * Send the REST message to the endpoint.
		 * @returns {RESTResponseV2}
		 */
		this.execute = function() {};
		/**
		 * Send the REST message to the endpoint asynchronously. The instance does not wait for a response from the web service provider when making asynchronous calls.
		 */
		this.executeAsync = function() {};
		/**
		 * Get the URL of the endpoint for the REST message.
		 */
		this.getEndpoint = function() {};
		/**
		 * Get the content of the REST message body.
		 * @returns {string} the REST message body as a string.
		 */
		this.getRequestBody = function() {};
		/**
		 *
		 * @param {string} headerName
		 * @returns {string} the value of the specified header
		 */
		this.getRequestHeader = function(headerName) {};
		/**
		 * @returns {Object} An Object that maps the name of each header to the associated value.
		 */
		this.getRequestHeaders = function() {};
		/**
		 *
		 * @param {string} tableName
		 * @param {string} recordSysId
		 * @param {string} fileName
		 * @param {string} encryptionContext
		 */
		this.saveResponseBodyAsAttachment = function(tableName, recordSysId, fileName, encryptionContext) {};
		/**
		 *
		 * @param {string} type
		 * @param {string} profileId
		 */
		this.setAuthenticationProfile = function(type, profileId) {};
		/**
		 *
		 * @param {string} userName
		 * @param {string} pass
		 */
		this.setBasicAuth = function(userName, pass) {};
		/**
		 *
		 * @param {string} correlator
		 */
		this.setEccCorrelator = function(correlator) {};
		/**
		 *
		 * @param {string} name - The parameter name (e.g. "skip_sensor").
		 * @param {string} value - Tha parameter value (e.g. "true").
		 */
		this.setEccParameter = function(name, value) {};
		/**
		 *
		 * @param {string} endpoint
		 */
		this.setEndpoint = function(endpoint) {};
		/**
		 *
		 * @param {string} method
		 */
		this.setHttpMethod = function(method) {};
		/**
		 *
		 * @param {string} timeoutMs
		 */
		this.setHttpTimeout = function(timeoutMs) {};
		/**
		 *
		 * @param {string} level
		 */
		this.setLogLevel = function(level) {};
		/**
		 *
		 * @param {string} midServerName
		 */
		this.setMIDServer = function(midServerName) {};
		/**
		 *
		 * @param {string} profileName
		 */
		this.setMutualAuth = function(profileName) {};
		/**
		 *
		 * @param {string} name
		 * @param {string} value
		 */
		this.setQueryParameter = function(name, value) {};
		/**
		 *
		 * @param {string|Object} body
		 */
		this.setRequestBody = function(body) {};
		/**
		 *
		 * @param {string} attachmentSysId
		 */
		this.setRequestBodyFromAttachment = function(attachmentSysId) {};
		/**
		 *
		 * @param {Object} stream
		 */
		this.setRequestBodyFromStream = function(stream) {};
		/**
		 *
		 * @param {string} name
		 * @param {string} value
		 */
		this.setRequestHeader = function(name, value) {};
		/**
		 *
		 * @param {string} requestorContext
		 * @param {string} requestorId
		 */
		this.setRequestorProfile = function(requestorContext, requestorId) {};
		/**
		 *
		 * @param {string} name
		 * @param {string} value
		 */
		this.setStringParameter = function(name, value) {};
		/**
		 *
		 * @param {string} name
		 * @param {string} value
		 */
		this.setStringParameterNoEscape = function(name, value) {};
	}
}