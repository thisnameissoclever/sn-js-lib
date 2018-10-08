/**
 * Provides methods to get and format translated messages.
 * @class i18NV3
 * @typedef {Object}  i18NV3
 */
class i18NV3 {
    constructor() {}
    /**
     * Formats a string containing named tokens with values from a map.
     * @param {String} message The message to have the tokens added.
     * @param {Object} map The map of name/value pairs to replace in the message.
     * @returns The formatted string
     * @example // Returns: "The rich young ruler was very very rich"
     * nowapi.i18n.format("The {p1} {p2} {p3} was very very {p1}",{p1: "rich", p2: "young", p3: "ruler"});
     */
    format(message, map) {}
    /**
     * Retrieves a translated message.
     * @param {String} msgKey The message to be retrieved.
     * @param {Function} callback The function to be called when the message has been retrieved. The callback
     * function has one argument, a string that is the translated message.
     * @returns Method does not return a value
     */
    getMessage(msgKey, callback) {}
    /**
     * Retrieves a set of messages.
     * @param {Array} msgKeys An array of keys specifying the messages to be retrieved.
     * @param {Function} callback The function to be called when the messages have been retrieved. The callback
     * function has one argument, an object containing key-value pairs, where key is the
     * requested message key, and the value is the translated string.
     * @returns Method does not return a value
     */
    getMessages(msgKeys, callback) {}
}