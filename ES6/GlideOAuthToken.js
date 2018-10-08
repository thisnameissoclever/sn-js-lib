/**
 * Use the GlideOAuthToken methods for retrieving OAuth access token and information about
 * the access token.
 * @class GlideOAuthToken
 * @typedef {Object}  GlideOAuthToken
 */
class GlideOAuthToken {
    constructor() {}
    /**
     * Retrieves the access token.
     * @returns The access token.
     */
    getAccessToken() {}
    /**
     * Retrieves the sys_id of the token ID.
     * @returns The sys_id of the access token.
     */
    getAccessTokenSysID() {}
    /**
     * Retrieves the lifespan of the access token in seconds.
     * @returns The lifespan.
     */
    getExpiresIn() {}
    /**
     * Retrieves the lifespan of the access token in seconds.
     * @returns The refresh token.
     */
    getRefreshToken() {}
    /**
     * Retrieves the sys_id of the refresh token.
     * @returns The sys_id of the refresh token.
     */
    getRefreshTokenSysID() {}
    /**
     * Retrieves the scope, which is the amount of access granted by the access
     * token.
     * @returns The scope.
     */
    getScope() {}
}