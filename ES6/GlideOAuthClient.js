/**
 * Use these methods for requesting and revoking OAuth refresh and access tokens.
 * @class GlideOAuthClient
 * @typedef {Object}  GlideOAuthClient
 */
class GlideOAuthClient {
    constructor() {}
    /**
     * Retrieves the token for the client. You can use the token to check the expiration date
     * and perform a token renewal.
     * @param {String} OAuthEntityName The OAuth entity.
     * @param {String} requestor The request.
     * @returns The token for the client.
     * @example token = oAuthClient.getToken(testAppProvider, someone@someemail.com);
     */
    getToken(OAuthEntityName, requestor) {}
    /**
     * Retrieves the token for the client, with the request parameters encoded in JSON
     * format.
     * @param {String} clientName The client name.
     * @param {String} jsonString The JSON string for the client.
     * @returns The token for the client.
     * @example 
     * var oAuthClient = new GlideOAuthClient();
     * var params ={grant_type:"password", username:"itil", password:'itil'};
     * var json =new JSON();
     * var text = json.encode(params);
     * var tokenResponse = oAuthClient.requestToken('TestClient', text);
     * var token = tokenResponse.getToken();
     * gs.log("AccessToken:"+ token.getAccessToken());
     * gs.log("AccessTokenExpiresIn:"+ token.getExpiresIn());
     * gs.log(" RefreshToken:"+ token.getRefreshToken());
     * 
     */
    requestToken(clientName, jsonString) {}
    /**
     * Retrieves the token for the client, with the client name and the request set into a
     * GlideOAuthClientResponse object.
     * @param {String} clientName The client name.
     * @param {GlideOAuthClientRequest} request The request.
     * @returns The token for the client.
     */
    requestTokenByRequest(clientName, request) {}
    /**
     * Revokes the access or refresh token for the client, with the request and optional
     * header parameters set into a GlideOAuthClientRequest object.
     * @param {String} clientName The client name.
     * @param {String} accessToken The access token.
     * @param {String} refreshToken The refresh token.
     * @param {GlideOAuthClientRequest} request The request.
     * @returns The token for the client.
     */
    revokeToken(clientName, accessToken, refreshToken, request) {}
}