/**
 * Manipulate time-series data to prepare the data for evaluation and
 * analysis.
 * @class Transformer
 * @typedef {Object}  Transformer
 */
class Transformer {
    /**
     * Create a Transformer object.
     * @param {GlideRecord} sourceRecords Contains the records for which metrics are to be evaluated. Can be one record
     * or many.
     */
    constructor(sourceRecords) {}
    /**
     * Run the transform.
     * @param {GlideDateTime} start The beginning of the period to be evaluated.
     * @param {GlideDateTime} end The end of the period to be evaluated.
     * @returns The transformed data.
     * @example var minutesAgoStart = 60;
     * var end = new GlideDateTime();
     * var start = new GlideDateTime(end);
     * start.addSeconds(-1 * 60 * minutesAgoStart);
     * // query subject records
     * var grDrone = new GlideRecord('mb_demo_drone');
     * grDrone.query();
     * // building transform; get the average transforms of a metric, grouping by model
     * var transformer = new sn_clotho.Transformer(grDrone);
     * transformer.groupBy("fleet").metric("mb_demo_mt_altitude").avg().label('avg - %g:fleet:');
     * // execute and return result for visualization
     * var tfrmResult = transformer.execute(start, end);
     */
    execute(start, end) {}
    /**
     * Specify a field to be used to group the data.
     * @param {String} field A field in the table to be used to group the transform results.
     * @returns A TransformPart object that can be used to specify the transform
     * characteristics.
     * @example var transformer = new sn_clotho.Transformer(grDrone);
     * var trnsfrm = transformer.groupBy("fleet");
     */
    groupBy(field) {}
    /**
     * Specify the metric field to be used in the transform.
     * @param {String} metricName Name of the metric field.
     * @returns A TransformPart object that can be used to specify the transform
     * characteristics.
     * @example var transformer = new sn_clotho.Transformer(grDrone);
     * var trnsfrm = transformer.metric("mb_demo_mt_altitude");
     */
    metric(metricName) {}
}