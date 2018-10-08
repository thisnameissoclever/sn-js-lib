/**
 * A Data object contains the results of transform performed by a
 * sn_clotho.Client.transform() method.
 * @class Data
 * @typedef {Object}  Data
 */
class Data {
    constructor() {}
    /**
     * Returns the end time for data in the Data object.
     * @returns The end of the time period.
     */
    getEnd() {}
    /**
     * Returns the label assigned by the
     * sn_clotho.ClothoTransform.label() method.
     * @returns The label assigned to the data.
     */
    getLabel() {}
    /**
     * Returns the name of the metric of the data series. Returns null when the data object is
     * associated with multiple data series.
     * @returns Name of the metric field. Returns null when the data object is associated with
     * multiple data series.
     */
    getMetricName() {}
    /**
     * Returns the time period in milliseconds.
     * @returns The elapsed time in seconds.
     */
    getPeriod() {}
    /**
     * Returns the start time for data in the Data object.
     * @returns The time for the first data point.
     */
    getStart() {}
    /**
     * Returns the subject of the data series. Returns null when the data object is associated
     * with multiple data series.
     * @returns The subject field value of the subject GlideRecord. This is generally the
     * sys_id of the subject GlideRecord.
     */
    getSubject() {}
    /**
     * Returns the name of the table assigned in the DataSelector class constructor. Returns
     * null when the data object is associated with multiple data series.
     * @returns Table name. Returns null when the data object is associated with multiple data
     * series.
     */
    getTableName() {}
    /**
     * Returns an array of values.
     * @returns An array of numbers.
     */
    getValues() {}
    /**
     * Returns the number of values in the Data object.
     * @returns The number of values in the object.
     */
    size() {}
}