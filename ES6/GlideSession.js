/**
 * The scoped GlideSession API provides a way to find information about
 * the current session.
 * @class GlideSession
 * @typedef {Object}  GlideSession
 */
class GlideSession {
    constructor() {}
    /**
     * Returns a session client value previously set with putClientData().
     * @param {String} paramName Name of the client data to retrieve.
     * @returns The client data as a string.
     * @example var session = gs.getSession();
     * session.putClientData('test1', 'Harry');
     * var clientData = session.getClientData('test1');
     * gs.info(clientData);
     */
    getClientData(paramName) {}
    /**
     * Returns the client IP address.
     * @returns The IP address.
     * @example var session = gs.getSession();
     * var addr = session.getClientIP();
     * gs.info(addr);
     */
    getClientIP() {}
    /**
     * Returns the application currently selected in the application picker.
     * @returns The currently selected application.
     * @example var session = gs.getSession();
     * var appID = session.getCurrentApplicationId();
     * gs.info(appID);
     */
    getCurrentApplicationId() {}
    /**
     * Returns the session's language code.
     * @returns The session's language code.
     * @example var session = gs.getSession();
     * var language = session.getLanguage();
     * gs.info(language);
     */
    getLanguage() {}
    /**
     * Returns the session token.
     * @returns The session token.
     * @example var session = gs.getSession();
     * var token = session.getSessionToken();
     * gs.info(token);
     */
    getSessionToken() {}
    /**
     * Returns the name of the session's time zone.
     * @returns The name of the session's time zone.
     * @example var session = gs.getSession();
     * var zoneName = session.getTimeZoneName();
     * gs.info(zoneName);
     */
    getTimeZoneName() {}
    /**
     * Returns the URL on the stack. Returns null if the stack is empty.
     * @returns The URL. Returns null if the stack is empty.
     * @example var session = gs.getSession();
     * var URL = session.getUrlOnStack();
     * gs.info(URL);
     */
    getUrlOnStack() {}
    /**
     * Returns true if the user is impersonating another user.
     * @returns Returns true if the user is impersonating another user; otherwise, returns
     * false.
     * @example var isImpersonator = gs.getSession().isImpersonating();
     * gs.info(isImpersonator);
     */
    isImpersonating() {}
    /**
     * Returns true if the session is interactive.
     * @returns True if the session is interactive.
     * @example var interActive = gs.getSession().isInteractive();
     * gs.info(interActive);
     */
    isInteractive() {}
    /**
     * Returns true if the user is logged in.
     * @returns True if the user is logged in.
     * @example var session = gs.getSession();
     * var loggedIn = session.isLoggedIn();
     * gs.info(loggedIn);
     */
    isLoggedIn() {}
    /**
     * Sets a session client value that can be retrieved with
     * getClientData(). This method is used in a server side script that runs when
     * a form is created.
     * @param {String} paramName Name of the client data to set.
     * @param {String} paramValue Value of the client data.
     * @returns Method does not return a value
     * @example var session = gs.getSession();
     * session.putClientData('test1', 'Harry');
     * var clientData = session.getClientData('test1');
     * gs.info(clientData);
     */
    putClientData(paramName, paramValue) {}
}