/**
 * Use ConnectionInfo API to get connection attribute information through the connection
 * and credential alias.
 * @class ConnectionInfo
 * @typedef {Object}  ConnectionInfo
 */
class ConnectionInfo {
    constructor() {}
    /**
     * Returns the value of a connection info attribute with the specified name.
     * @returns Method does not return a value
     * @example   // get the same values using getAttribute
     * gs.info(connectionInfo.getAttribute("name"));
     * gs.info(connectionInfo.getAttribute("connection_url"));
     * 
     */
    getAttribute() {}
    /**
     * Returns the value of credential attributes for a specified connection.
     * @returns Method does not return a value
     * @example  // get credential attributes
     * gs.info(connectionInfo.getCredentialAttribute("user_name"));
     * gs.info(connectionInfo.getCredentialAttribute("password"));
     * 
     */
    getCredentialAttribute() {}
    /**
     * Returns the connection attributes as a collection of key-value pairs.
     * @returns Method does not return a value
     * @example  // get data map
     * var datamap = connectionInfo.getDataMap();
     * gs.info(datamap["name"]);
     * gs.info(datamap["connection_url"]);
     * 
     */
    getDataMap() {}
    /**
     * Returns the extended attributes as a collection of key-value pairs.
     * @returns Method does not return a value
     * @example // get extended attributes
     * var extendedAttributes = connection.getExtendedAttributes();
     * gs.info(extendedAttributes["name1"]);
     * }
     * 
     */
    getExtendedAttributes() {}
}