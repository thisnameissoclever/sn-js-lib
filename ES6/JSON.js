/**
 * Provides scoped methods to create JSON objects from a string, and to turn JSON objects
 * into strings.
 * @class JSON
 * @typedef {Object}  JSON
 */
class JSON {
    constructor() {}
    /**
     * Creates an object or primitive type from a JSON formatted string.
     * @param {String} str A JSON formatted string.
     * @returns An object created from the specified string.
     * @example var str = '{"name":"George","lastname":"Washington"}';
     * var obj = JSON.parse(str);
     * gs.info('The first name is' + obj.name);
     */
    parse(str) {}
    /**
     * Creates a string from a JSON object.
     * @param {Object} jsonObject The JSON object to be turned into a string.
     * @returns A JSON formatted string.
     * @example var obj = {"name":"George","lastname":"Washington"};
     * var str =  JSON.stringify(obj);
     * gs.info('The object' + str);
     * 
     */
    stringify(jsonObject) {}
}