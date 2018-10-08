/**
 * The scoped GlideDuration class provides methods for working with spans of time or
 * durations.
 * @class GlideDuration
 * @typedef {Object}  GlideDuration
 */
class GlideDuration {
    /**
     * Instantiates a GlideDuration object.
     */
    constructor() {}
    /**
     * Add the specified duration to the object.
     * @param {GlideDuration} duration The value to add to the object.
     * @returns The sum of the current and the added duration.
     * @example var duration = new GlideDuration('3 12:00:00');
     * var duration2 = new GlideDuration('3:00:00');
     * var answer = duration.add(duration2);
     * gs.info(answer.getDisplayValue());
     */
    add(duration) {}
    /**
     * Gets the duration in the specified format.
     * @param {String} format The duration format.
     * @returns The current duration in the specified format.
     * @example var dur = new GlideDuration('3 22:00:00');
     * gs.info(dur.getByFormat('HH:mm'));
     */
    getByFormat(format) {}
    /**
     * Gets the number of days.
     * @returns The number of days.
     * @example var dur = new GlideDuration('3 12:00:00');
     * gs.info(dur.getDayPart());
     */
    getDayPart() {}
    /**
     * Gets the display value of the duration in number of days, hours, and
     * minutes.
     * @returns The number of days, hours, and minutes.
     * @example var dur = new GlideDuration('3 12:00:00');
     * gs.info(dur.getDisplayValue());
     */
    getDisplayValue() {}
    /**
     * Gets the duration value in "d HH:mm:ss" format.
     * @returns The duration value.
     * @example var dur = new GlideDuration('3 12:00:00');
     * gs.info(dur.getDurationValue());
     */
    getDurationValue() {}
    /**
     * Gets the rounded number of days. If the time part is more than 12 hours, the return
     * value is rounded up. Otherwise, it is rounded down.
     * @returns The day part, rounded.
     * @example var dur = new GlideDuration('3 11:00:00');
     * gs.info(dur.getRoundedDayPart());
     */
    getRoundedDayPart() {}
    /**
     * Gets the internal value of the GlideDuration object.
     * @returns The duration in the object's internal format, which is the date and time from
     * January 1, 1970, 00:00:00.
     * @example var dur = new GlideDuration('3 12:00:00');
     * gs.info(dur.getValue());
     */
    getValue() {}
    /**
     * Sets the display value.
     * @param {String} asDisplayed The duration in "d HH:mm:ss" format.
     * @returns Method does not return a value
     * @example var dur = new GlideDuration();
     * dur.setDisplayValue('3 08:00:00');
     * gs.info(dur.getDisplayValue());
     */
    setDisplayValue(asDisplayed) {}
    /**
     * Sets the internal value of the GlideDuration object.
     * @param {Object} o The duration in the object's internal format, which is the date and time from
     * January 1, 1970, 00:00:00.
     * @returns Method does not return a value
     * @example var dur = new GlideDuration();
     * dur.setValue('1970-01-05 08:00:00'); // sets internal DateTime value. The String will be parsed into a GlideDateTime object.
     * gs.info(dur.getDisplayValue());
     */
    setValue(o) {}
    /**
     * Subtracts the specified duration from the current duration.
     * @param {GlideDuration} duration The duration to subtract.
     * @returns Method does not return a value
     * @example var duration = new GlideDuration('3 12:00:00');
     * var duration2 = new GlideDuration('3:00:00');
     * var answer = duration.subtract(duration2);
     * gs.info(answer.getDisplayValue());
     */
    subtract(duration) {}
}