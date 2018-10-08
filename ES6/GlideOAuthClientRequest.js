/**
 * Use these methods for handling OAuth client requests.
 * @class GlideOAuthClientRequest
 * @typedef {Object}  GlideOAuthClientRequest
 */
class GlideOAuthClientRequest {
    constructor() {}
    /**
     * Retrieves the grant type.
     * @returns The grant type.
     */
    getGrantType() {}
    /**
     * Retrieves the HTTP headers for the string you provide.
     * @param {String} name The name of the parameter.
     * @returns The string map with the HTTP headers.
     */
    getHeader(name) {}
    /**
     * Retrieves the HTTP headers.
     * @returns The string map with the HTTP headers.
     */
    getHeaders() {}
    /**
     * Retrieves the parameters for the parameter name you provide.
     * @param {String} name The parameter name for which you want the parameters.
     * @returns The parameters.
     */
    getParameter(name) {}
    /**
     * Retrieves the password.
     * @returns The password.
     */
    getPassword() {}
    /**
     * Retrieves the refresh token.
     * @returns The refresh token.
     */
    getRefreshToken() {}
    /**
     * Retrieves the scope.
     * @returns The scope.
     */
    getScope() {}
    /**
     * Retrieves the user name.
     * @returns The user name.
     */
    getUserName() {}
    /**
     * Sets the grant type for the string you provide.
     * @param {String} name The grant type.
     * @returns Method does not return a value
     */
    setGrantType(name) {}
    /**
     * Retrieves the HTTP headers for the string you provide.
     * @param {String} name The name of the parameter.
     * @param {String} value The value of the parameter.
     * @returns Method does not return a value
     */
    setHead(name, value) {}
    /**
     * Sets the parameters for the name:value pair of strings you provide.
     * @param {String} name The parameter name for which you want the parameters.
     * @param {String} value The value of the parameter.
     * @returns Method does not return a value
     */
    setParameter(name, value) {}
    /**
     * Sets the password with the string you provide.
     * @param {String} password The user name.
     * @returns Method does not return a value
     */
    setPassword(password) {}
    /**
     * Sets the refresh token with the string you provide.
     * @param {String} refreshToken The refresh token.
     * @returns Method does not return a value
     * @example 
     * var tokenRequest =new GlideOAuthClientRequest();
     * tokenRequest.setGrantType("password");
     * tokenRequest.setUserName("itil");
     * tokenRequest.setPassword("itil");
     * tokenRequest.setScope(null);
     * var oAuthClient =new GlideOAuthClient();var tokenResponse = oAuthClient.requestToken("TestClient", tokenRequest);
     * gs.log("Error:"+ tokenResponse.getErrorMessage());
     * var token = tokenResponse.getToken();if(token){
     * gs.log("AccessToken:"+ token.getAccessToken());
     * gs.log("AccessTokenExpiresIn:"+ token.getExpiresIn());
     * gs.log("RefreshToken:"+ token.getRefreshToken());
     * 
     */
    setRefreshToken(refreshToken) {}
    /**
     * Sets the scope for the string you provide.
     * @param {String} scope The scope.
     * @returns Method does not return a value
     */
    setScope(scope) {}
    /**
     * Sets the user name with the string you provide.
     * @param {String} userName The user name.
     * @returns Method does not return a value
     */
    setUserName(userName) {}
}