/**
 * Scoped TemplatePrinter handles printing from a mail script to the email message.
 * @class TemplatePrinter
 * @typedef {Object}  TemplatePrinter
 */
class TemplatePrinter {
    constructor() {}
    /**
     * Prints the string to the email body.
     * @param {String} string The string to print
     * @returns Method does not return a value
     * @example template.print("Incident number - " + current.number + "\n");
     */
    print(string) {}
    /**
     * Adds non-breaking spaces to the email body.
     * @param {Number} spaces The number of non-breaking spaces to output to the email body.
     * @returns Method does not return a value
     * @example template.space(4);
     */
    space(spaces) {}
}