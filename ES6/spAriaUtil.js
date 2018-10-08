/**
 * You can show messages on a screen reader. The spAriaUtil service is an angular service
 * included as part of the Service Portal angular application. The spAriaUtil service is available
 * in the client script block of Service Portal widgets.
 * @class spAriaUtil
 * @typedef {Object}  spAriaUtil
 */
class spAriaUtil {
    constructor() {}
    /**
     * Announce a message to a screen reader.
     * @param {String} message The message to be shown.
     * @returns Method does not return a value
     * @example function(spAriaUtil) {
     * // widget controller
     * spAriaUtil.sendLiveMessage('Hello world!');
     * }
     */
    sendLiveMessage(message) {}
}