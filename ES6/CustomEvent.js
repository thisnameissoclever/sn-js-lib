/**
 * You can use CustomEvent API to show qualified embedded help in the right
 * sidebar.
 * @class CustomEvent
 * @typedef {Object}  CustomEvent
 */
class CustomEvent {
    constructor() {}
    /**
     * Show the embedded-help content specified by the qualifier parameter in the right
     * sidebar.
     * @param {String} event The event to send. Must be the string
     * "embedded_help:load_embedded_help"
     * @param {String} qualifier The qualifier name created in the Embedded Help application.
     * @returns Method does not return a value
     * @example var qualifier = 'your-EH-qualifier';
     * CustomEvent.fireAll("embedded_help:load_embedded_help", qualifier);
     */
    fireAll(event, qualifier) {}
}