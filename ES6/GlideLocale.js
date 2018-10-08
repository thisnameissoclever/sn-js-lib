/**
 * GlideLocale provides information about display information for the local
 * instance.
 * @class GlideLocale
 * @typedef {Object}  GlideLocale
 */
class GlideLocale {
    constructor() {}
    /**
     * Returns the GlideLocale object.
     * @returns The GlideLocale object.
     * @example var locale = GlideLocale.get();
     */
    get() {}
    /**
     * Returns the decimal separator.
     * @returns The decimal separator.
     * @example var locale = GlideLocale.get();
     * var decimalSeparator = locale.getDecimalSeparator();
     * gs.info( "The decimal separator is " + decimalSeparator);
     */
    getDecimalSeparator() {}
    /**
     * Returns the grouping separator.
     * @returns The grouping separator.
     * @example var locale = GlideLocale.get();var groupingSeparator = locale.getGroupingSeparator();
     * gs.info( "The grouping separator is " + groupingSeparator);
     */
    getGroupingSeparator() {}
}