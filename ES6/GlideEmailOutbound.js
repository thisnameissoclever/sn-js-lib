/**
 * The scoped GlideEmailOutbound class implements the email object for scoped applications.
 * You can use the GlideEmailOutbound methods with the email global object available in mail scripts.
 * The email object behaves identically for global and scoped applications.
 * @class GlideEmailOutbound
 * @typedef {Object}  GlideEmailOutbound
 */
class GlideEmailOutbound {
    /**
     * Instantiates a scoped GlideEmailOutbound object.
     */
    constructor() {}
    /**
     * Adds the address to either the cc or bcc list.
     * @param {String} type Either cc or bcc, determines the list to which the address is added.
     * @param {String} address The recipient's email address.
     * @returns Method does not return a value
     * @example email.addAddress('cc', 'joe.employee@something.com');
     */
    addAddress(type, address) {}
    /**
     * Adds the recipient to either the cc or bcc list, but uses the display name instead of
     * the address when showing the recipient.
     * @param {String} type Either cc or bcc, determines the list to which the address is added.
     * @param {String} address The recipient's email address.
     * @param {String} displayName The name to be shown instead of the email address.
     * @returns Method does not return a value
     * @example email.addAddress('bcc', 'joe.employee@something.com', 'dudley rocks');
     */
    addAddress(type, address, displayName) {}
    /**
     * Returns the email's subject line.
     * @returns The email's subject line.
     * @example var subject = email.getSubject();
     */
    getSubject() {}
    /**
     * Sets the body of the email.
     * @param {String} bodyText The body of the email.
     * @returns Method does not return a value
     * @example email.setBody('Dear Sir, ...');
     */
    setBody(bodyText) {}
    /**
     * Sets the sender's address.
     * @param {String} address The sender's email address.
     * @returns Method does not return a value
     * @example email.setFrom('joe.employee@something.com');
     */
    setFrom(address) {}
    /**
     * Sets the reply to address.
     * @param {String} address The reply to email address.
     * @returns Method does not return a value
     * @example email.setReplyTo('joe.employee@something.com');
     */
    setReplyTo(address) {}
    /**
     * Sets the email's subject line.
     * @param {String} subject Text for the subject line.
     * @returns Method does not return a value
     * @example email.setSubject('Important Issues to discuss');
     */
    setSubject(subject) {}
}