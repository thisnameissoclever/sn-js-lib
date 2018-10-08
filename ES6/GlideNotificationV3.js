/**
 * You can show messages over the page content.
 * @class GlideNotificationV3
 * @typedef {Object}  GlideNotificationV3
 */
class GlideNotificationV3 {
    constructor() {}
    /**
     * Displays the specified string over the page content as the specified type of
     * message.
     * @param {String} type The type of message - error, warning, or info.
     * @returns Method does not return a value
     * @example // Displays an info message at the top of the screen
     * nowapi.g_notification.show("info", "The record has been updated");
     * // Displays an error message at the top of the screen
     * nowapi.g_notification.show("error", "You need to provide notes!");
     */
    show(type) {}
}