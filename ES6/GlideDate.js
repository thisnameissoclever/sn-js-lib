/**
 * The scoped GlideDate class provides methods for performing operations on GlideDate
 * objects, such as instantiating GlideDate objects or working with GlideDate fields.
 * @class GlideDate
 * @typedef {Object}  GlideDate
 */
class GlideDate {
    /**
     * Creates a GlideDate object with the current date time.
     */
    constructor() {}
    /**
     * Gets the date in the specified date format.
     * @param {String} format the desired date format
     * @returns the date in the specified format
     * @example var gd = new GlideDate();
     * gd.setValue('2015-01-01');
     * gs.info(gd.getByFormat("dd-MM-yyyy"));
     */
    getByFormat(format) {}
    /**
     * Gets the day of the month stored by the GlideDate object, expressed in the UTC time
     * zone.
     * @returns The day of the month in the UTC time zone, from 1 to 31.
     * @example //Today's date is 2016-05-13
     * var gd =new GlideDate();
     * gs.info(gd.getDayOfMonthNoTZ());
     */
    getDayOfMonthNoTZ() {}
    /**
     * Gets the date in the current user's display format and time zone.
     * @returns The date in the user's format and time zone. Keep in mind when designing
     * business rules or script includes that this method may return values in different
     * formats for different users.
     * @example var gd =new GlideDate();
     * gd.setValue('2015-01-01');
     * gs.info(gd.getDisplayValue());
     */
    getDisplayValue() {}
    /**
     * Gets the display value in the internal format (yyyy-MM-dd).
     * @returns The date values for the GlideDate object in the current user's time zone and
     * the internal time format of yyyy-MM-dd.
     * @example var gd =new GlideDate();
     * gs.info(gd.getDisplayValueInternal());
     */
    getDisplayValueInternal() {}
    /**
     * Gets the month stored by the GlideDate object, expressed in the UTC time zone.
     * @returns The numerical value of the month from 1 to 12.
     * @example //Today's date is 2016-05-13
     * var gd =new GlideDate();
     * gs.info(gd.getMonthNoTZ());
     */
    getMonthNoTZ() {}
    /**
     * Gets the date value stored in the database by the GlideDate object in the internal
     * format, yyyy-MM-dd, and the system time zone, UTC by default.
     * @returns The date value in the internal format and system time zone.
     * @example var gd =new GlideDate();
     * gd.setValue('2015-01-01');
     * gs.info(gd.getValue());
     */
    getValue() {}
    /**
     * Gets the year stored by the GlideDate object, expressed in the UTC time zone.
     * @returns The numerical value of the year.
     * @example //Today's date is 2016-05-13
     * var gd =new GlideDate();
     * gs.info(gd.getYearNoTZ());
     */
    getYearNoTZ() {}
    /**
     * Sets a date value using the current user's display format and time zone.
     * @param {String} asDisplayed The date in the current user's display format and time zone. The parameter must
     * be formatted using the current user's preferred display format, such as yyyy-MM-dd.
     * @returns Method does not return a value
     * @example var gd =new GlideDate();
     * gd.setDisplayValue("2011-01-01");
     * gs.info(gd.getValue());
     */
    setDisplayValue(asDisplayed) {}
    /**
     * Sets the date of the GlideDate object.
     * @param {String} o The date and time to use.
     * @returns Method does not return a value
     * @example var gd = new GlideDate();
     * gd.setValue('2015-01-01');
     * gs.info(gd.getValue());
     */
    setValue(o) {}
    /**
     * Gets the duration difference between two GlideDate values.
     * @param {GlideDate} start The start value.
     * @param {GlideDate} end The end value.
     * @returns The duration between the two values.
     * @example var sgd1 = new GlideDate();
     * sgd1.setDisplayValue('2014-07-18');
     * var sgd2 = new GlideDate();
     * sgd2.setDisplayValue('2014-07-19');
     * duration= GlideDate.subtract(sgd1, sgd2);
     * gs.info(duration.getDisplayValue());
     */
    subtract(start, end) {}
}