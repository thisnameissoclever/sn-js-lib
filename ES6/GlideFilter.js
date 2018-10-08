/**
 * The Scoped GlideFilter API provides a method to determine if a record meets a specified
 * set of requirements.
 * @class GlideFilter
 * @typedef {Object}  GlideFilter
 */
class GlideFilter {
    constructor() {}
    /**
     * The filter parameter is an encoded query string.
     * @param {GlideRecord} gr The GlideRecord to be evaluated.
     * @param {String} filter An encoded query string.
     * @param {Object} matchAll (Optional) If true and the encoded query string contains multiple conditions
     * then all conditions must be true for the method to return true. If false and the
     * encoded query string contains multiple conditions then only one condition needs to
     * be true for the method to return true. If the encoded query string has only one
     * condition, this parameter has no impact.
     * @returns True when the record meets the filter conditions.
     * @example var rec = new GlideRecord('incident');
     * rec.query();
     * var bool = true;
     * while(rec.next())
     * {
     * bool = GlideFilter.checkRecord(rec, "active=true");
     * gs.info("number "+ rec. number + " is " + bool);
     * }
     */
    checkRecord(gr, filter, matchAll) {}
}