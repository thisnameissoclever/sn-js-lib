/**
 * Provides the ability to load scripts asynchronously.
 * @class ScriptLoader
 * @typedef {Object}  ScriptLoader
 */
class ScriptLoader {
    constructor() {}
    /**
     * Loads scripts asynchronously.
     * @param {Array} scripts An array of scripts.
     * @param {Function} callback The function called when the scripts have been loaded. The callback function
     * has no arguments.
     * @returns Method does not return a value
     */
    getScripts(scripts, callback) {}
    /**
     * Gets scripts asynchronously.
     * @param {String} filePath A path, including the file name, that contains one or more scripts.
     * @param {Function} callback The function to be called after the scripts have been loaded. The callback
     * function has no arguments.
     * @returns Method does not return a value
     */
    getScripts(filePath, callback) {}
}