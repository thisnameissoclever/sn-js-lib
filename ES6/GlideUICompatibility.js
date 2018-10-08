/**
 * The scoped GlideUICompatibility class provides the ability for scoped applications to
 * define their own minimum browser versions. This is done by creating system properties for the
 * scoped application.
 * @class GlideUICompatibility
 * @typedef {Object}  GlideUICompatibility
 */
class GlideUICompatibility {
    /**
     * Creates a GlideUICompatibility object.
     * @param {String} scopeName The application's scope name
     */
    constructor(scopeName) {}
    /**
     * Returns the terms "block" or "allow" based upon the browser version.
     * @returns Either block or allow
     * @example UICompatibility = new GlideUICompatibility(gs.getCurrentScopeName());
     * var blockOrAllow = UICompatibility.getCompatibility();
     * gs.info(blockOrAllow);
     */
    getCompatibility() {}
    /**
     * Determines if the browser is not supported.
     * @returns True if the browser is not supported.
     * @example UICompatibility = new GlideUICompatibility(gs.getCurrentScopeName());
     * var blocked = UICompatibility.isBlocked();
     * gs.info(blocked);
     */
    isBlocked() {}
}