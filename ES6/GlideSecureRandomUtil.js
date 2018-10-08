/**
 * The scoped GlideSecureRandomUtil API provides methods for generating integers, long
 * values, and strings.
 * @class GlideSecureRandomUtil
 * @typedef {Object}  GlideSecureRandomUtil
 */
class GlideSecureRandomUtil {
    constructor() {}
    /**
     * Generates a pseudo-random integer.
     * @returns The pseudo-randomly generated integer.
     * @example gs.info(GlideSecureRandomUtil.getSecureRandomInt());
     * 
     */
    getSecureRandomInt() {}
    /**
     * Generates a pseudo-random integer between 0 (inclusive) and the bound (exclusive) value
     * that you pass into the method.
     * @param {Number} bound The bound value.
     * @returns The pseudo-randomly generated integer.
     * @example gs.info(GlideSecureRandomUtil.getSecureRandomIntBound(100));
     */
    getSecureRandomIntBound(bound) {}
    /**
     * Generates pseudo-random long value.
     * @returns The pseudo-randomly generated 64-bit integer.
     * @example gs.info(GlideSecureRandomUtil.getSecureRandomLong());
     * 
     */
    getSecureRandomLong() {}
    /**
     * Generates a random alpha-numeric String with the specified length.
     * @param {Number} length The length of the string in number of characters.
     * @returns The randomly generated string.
     * @example gs.info(GlideSecureRandomUtil.getSecureRandomString(12));
     */
    getSecureRandomString(length) {}
}