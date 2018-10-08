/**
 * Provides the result of a transformation run on time-series data.
 * @class TransformResult
 * @typedef {Object}  TransformResult
 */
class TransformResult {
    constructor() {}
    /**
     * Returns an array of Data objects. Returns an error if no group was specified for the
     * transform.
     * @returns An array of Data objects, with each object corresponding to a group.
     */
    byGroup() {}
    /**
     * Returns the transformed data with the specified label.
     * @param {String} label The label that identifies the data to be retrieved.
     * @returns The Data object with the transform results.
     */
    getByLabel(label) {}
    /**
     * Returns a single Data object, or null if the result is empty.
     * @returns The Data object with the transform results.
     */
    getData() {}
    /**
     * Returns the transformed data as an array. This method turns a Data object into an
     * array.
     * @returns The Data object formatted as an array.
     */
    toArray() {}
}