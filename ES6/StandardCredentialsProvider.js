/**
 * Use StandardCredentialsProvider API to retrieve credential information.
 * @class StandardCredentialsProvider
 * @typedef {Object}  StandardCredentialsProvider
 */
class StandardCredentialsProvider {
    /**
     * Use StardardCredentialsProvider() to retrieve credential information.
     */
    constructor() {}
    /**
     * This function retrieves a credential object identified by the given sys ID.
     * @param {String} sys A string representing the sys ID of the credential record.
     * @returns A credential.
     * @example var provider = new sn_cc.StandardCredentialsProvider();
     * var credentials = provider.getCredentials(["ssh"]);
     * for (var i = 0; i &lt; credentials.length; i++) {
     * var credential = credentials[i];
     * gs.info(credential.getAttribute("name"));
     * }
     * 
     */
    getCredentialByID(sys) {}
    /**
     * This function returns an array of all credentials that match the given types and
     * tags.
     * @param {String} types Types is an array of credential type names. For example, ["ssh",
     * "windows"]Note: If types are null or empty, any match returns a credential. If
     * types are specified, the credentials whose type matches one of the types
     * returns.
     * @param {String} handles Handles is a comma-separated list of handle names. For example,
     * "ssh,jdbc"
     * @returns Information about the ConnInfo...
     * @example var provider = new sn_cc.StandardCredentialsProvider();
     * var credentials = provider.getCredentials(["ssh"]);
     * for (var i = 0; i &lt; credentials.length; i++) {
     * var credential = credentials[i];
     * gs.info(credential.getAttribute("name"));
     * }
     * 
     */
    getCredentials(types, handles) {}
}