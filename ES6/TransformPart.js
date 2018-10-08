/**
 * Use the TransformPart class to specify details of the transform to be done.
 * @class TransformPart
 * @typedef {Object}  TransformPart
 */
class TransformPart {
    constructor() {}
    /**
     * Add the specified number to the value in each time stamp.
     * @param {Number} constant The number to add to the value in each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    add(constant) {}
    /**
     * Aggregate the selected metric series into one series containing the average value for
     * each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    avg() {}
    /**
     * Create a result set that for each time stamp returns specified number of bottom values.
     * This method results in 'count' number of series. Each value retains the label of its source
     * series.
     * @param {Number} count The number of series to return. The series are labeled 0 to count - 1.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    bottom(count) {}
    /**
     * Replace the value in any time stamp that is greater than the specified value with the
     * specified value.
     * @param {Number} ceiling The maximum allowed value for any time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    ceil(ceiling) {}
    /**
     * Mark this transform for collection.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    collect() {}
    /**
     * Aggregate the selected metric series into one series containing the number of values
     * for each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    count() {}
    /**
     * Divide the value in each time stamp by the specified number.
     * @param {Number} constant The number by which to divide the value of each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    div(constant) {}
    /**
     * Create a series using the specified aggregator for the specified time.
     * @param {Object} aggregator Can be AVG, MIN, MAX, or LAST
     * @param {Object} duration The time period for doing
     * @returns A TransformPart object that can be used to specify transform characteristics.
     */
    filter(aggregator, duration) {}
    /**
     * Replace the value in any time stamp that is less than the specified value with the
     * specified value.
     * @param {Number} floor The minimum value for any time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    floor(floor) {}
    /**
     * Create series made up of the value that the specified percentage of values is below.
     * Returns a series for each fraction in the specified array.
     * @param {Array of numbers} fractions The fractions to use on the input series.
     * @returns A TransformPart object that can be used to specify transform characteristics.
     * Contains one series for each fraction specified.
     * @example // returns a single series containing the median for each time stamp, which
     * // means that half a time stamp's values are below the returned value
     * fractiles([.5])
     * // returns four series, one series for each of the 25%, 50%, 75%, and 100% quartiles
     * fractiles([.25, .5, .75, 1])
     * // returns the median, 95% percentile, the max value
     * fractiles([.50, .95, 1]) 
     */
    fractiles(fractions) {}
    /**
     * Return the part of the result relevant to this transform.
     * @returns Contains the transform results associated with this part of the
     * transform.
     * @example var t = new sn_clotho.Transformer(drones);
     * t.metric("mb_demo_mt_altitude");
     * var avgTform = t.avg();
     * t.execute();
     * var avgTformResult = avgTform.getResult();
     */
    getResult() {}
    /**
     * Specify a field to be used to group the data.
     * @param {String} field A field in the table to be used to group the transform results.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    groupBy(field) {}
    /**
     * Create a data value for a NaN data item by interpolating from adjacent data values.
     * @param {Object} count Specifies the number of data samples in each direction to check for a non NaN
     * value. If if a non NaN value is not found, NaN is used.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    interpolate(count) {}
    /**
     * Add a label for the resulting series.
     * @param {String} label The label for the transform results.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    label(label) {}
    /**
     * Returns at most the specified number of values, starting at the most recent non-NaN
     * value.
     * @param {Object} count A number of time stamps.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    limit(count) {}
    /**
     * Run a logarithm on the value in each time stamp where the result is the log of the
     * specified base for the time stamp value.
     * @param {Number} base The base for the logarithm calculation.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    log(base) {}
    /**
     * Returns a series with the maximum value for each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    max() {}
    /**
     * Create a series containing the median of values for each time stamp across a set of
     * series.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    median() {}
    /**
     * Specify the metric field to be used in the transform.
     * @param {String} metric Name of the metric field.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    metric(metric) {}
    /**
     * Returns a series with the minimum value for each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    min() {}
    /**
     * Multiply the value in each time stamp by the specified number.
     * @param {Number} constant The number by which to multiply the value of each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    mul(constant) {}
    /**
     * Partition the series into intervals of the same duration.
     * @param {String} aggregator The aggregator to use. Can be min, max, avg, or last.
     * @param {GlideDateTime or an ISO 8601 formatted string} duration The interval length.
     * @param {GlideDateTime or an ISO 8601 formatted string} base The zero offset for partitioning. For example, if you partition by day (24h),
     * then set the base to Monday at midnight in your time zone. If you partition by 30
     * days, then set the base to  1st day of the most recent month.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    partition(aggregator, duration, base) {}
    /**
     * Specify the number of samples to include in the result.
     * @param {Number} count The number of samples to include in the result.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    resample(count) {}
    /**
     * Round the value in each time stamp to the specified precision.
     * @param {Number} precision The value to be used in the rounding calculation.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    round(precision) {}
    /**
     * Create a series containing the standard deviation of values for each time stamp across
     * a set of series.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    stddev() {}
    /**
     * Subtract the specified number from the value in each time stamp.
     * @param {Object} constant The number to subtract from the value in each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    sub(constant) {}
    /**
     * Aggregate the selected metric series into one series containing the sum of all values
     * for each time stamp.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    sum() {}
    /**
     * Create a result set that for each time stamp returns the specified number of top
     * values. This method results in 'count' number of series. Each value retains the label of its
     * source series.
     * @param {Number} count The number of series to return. The series are labeled 0 to count - 1.
     * @returns A TransformPart object that can be used to specify transform
     * characteristics.
     */
    top(count) {}
}