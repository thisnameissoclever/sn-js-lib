/**
 * Use the DataBuilder class to create a series of data points for a metric. Use the
 * sn_clotho.Client.put() method to save the values.
 * @class DataBuilder
 * @typedef {Object}  DataBuilder
 */
class DataBuilder {
    /**
     * Creates an instance of the DataBuilder class.
     * @param {Object} glideRecord GlideRecord from which to obtain the domain.
     * @param {String} metric The field name of the metric.
     */
    constructor(glideRecord, metric) {}
    /**
     * Add a series of data points to the DataBuilder object. Each data point is a time stamp
     * and a value.
     * @param {GlideDateTime} start The time stamp for the first data point. Subsequent time stamps are calculated
     * using the retention policy collection period.
     * @param {Array} value An array of numbers.
     * @returns The same DataBuilder object.
     * @example 
     * var points = [7,0.5,273];
     * var dataBuilder = new sn_clotho.DataBuilder(gr, 'cpu_percentage');
     * // this creates a GlideDateTime object set to the current date and time
     * var time = new GlideDateTime();
     * dataBuilder.add(time, points);
     */
    add(start, value) {}
    /**
     * Adds a data point to the DataBuilder object. Each data point is a time stamp and a
     * value. This method does not save the data point in the metric. Use the
     * sn_clotho.Client.put() method to save the values.
     * @param {GlideDateTime} start The time stamp for the data point.
     * @param {Number} value The value of the data point.
     * @returns The DataBuilder object.
     * @example var dataBuilder = new sn_clotho.DataBuilder(gr, 'cpu_percentage');
     * // this creates a GlideDateTime object set to the current date and time
     * var time = new GlideDateTime();
     * dataBuilder.add(time, 0.6);
     */
    add(start, value) {}
}