/**
 * You can create a globally unique identifier.
 * @class GlideGuidV3
 * @typedef {Object}  GlideGuidV3
 */
class GlideGuidV3 {
    constructor() {}
    /**
     * Creates a globally unique identifier 32 characters long, or as specified with the
     * optional length argument.
     * @param {Number} stringLength The desired string length, must be between 1 and 32 inclusive. This parameter
     * is optional. If not specified, the returned string will be 32 characters
     * long.
     * @returns The globally unique identifier.
     */
    generate(stringLength) {}
}