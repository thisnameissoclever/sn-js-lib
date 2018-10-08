/**
 * Use ConnectionInfoProvider API to select connection information through the connection
 * alias.
 * @class ConnectionInfoProvider
 * @typedef {Object}  ConnectionInfoProvider
 */
class ConnectionInfoProvider {
    /**
     * Uses ConnectionInfoProvider() to select connection information through the connection
     * alias.
     */
    constructor() {}
    /**
     * This function retrieves a ConnectionInfo object identified by the given aliasID in the
     * current domain.
     * @param {String} aliasID The sys_id of a connection alias.
     * @returns Information about the connection.
     * @example var provider = new sn_cc.ConnectionInfoProvider();
     * // get a jdbc connection in the current domain with the alias ID
     * //     "6219afbf9f03320021dd7501942e70fc"
     * var connectionInfo = provider.getConnectionInfo("6219afbf9f03320021dd7501942e70fc");
     */
    getConnectionInfo(aliasID) {}
    /**
     * This function retrieves a ConnectionInfo object identified by the given aliasID for a
     * specific domain.
     * @param {String} aliasID The sys_id of a connection alias.
     * @param {String} domainID The sys_id of a domain or global.
     * @returns Connection information.
     * @example var provider = new sn_cc.ConnectionInfoProvider();
     * // get a jdbc connection in the ACME domain with the alias ID
     * //      "cd5923ff9f03320021dd7501942e70bb"
     * connectionInfo = provider.getConnectionInfoByDomain("cd5923ff9f03320021dd7501942e70bb",
     * "c90d4b084a362312013398f051272c0d");
     */
    getConnectionInfoByDomain(aliasID, domainID) {}
}