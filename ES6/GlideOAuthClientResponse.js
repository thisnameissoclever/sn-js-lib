/**
 * Use these methods for handling OAuth client responses.
 * @class GlideOAuthClientResponse
 * @typedef {Object}  GlideOAuthClientResponse
 */
class GlideOAuthClientResponse {
    constructor() {}
    /**
     * Retrieves all of the response information, including instance information.
     * @returns The response information.
     */
    getBody() {}
    /**
     * Retrieves the HTTP response content header from an external OAuth provider.
     * @returns The HTTP response header.
     */
    getContentType() {}
    /**
     * Retrieves the error message if authentication is not successful.
     * @returns The error message.
     */
    getErrorMessage() {}
    /**
     * Retrieves the HTTP response code from the external OAuth provider.
     * @returns The HTTP response code.
     */
    getResponseCode() {}
    /**
     * Retrieves the error message if authentication is not successful.
     * @returns The response content.
     */
    getResponseParameters() {}
    /**
     * Retrieves the refresh token.
     * @returns The refresh token.
     */
    getToken() {}
}