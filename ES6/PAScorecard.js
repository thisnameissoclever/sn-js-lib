/**
 * The PAScorecard API enables you to query information about Performance Analytics scorecards and
 * indicators.
 * @class PAScorecard
 * @typedef {Object}  PAScorecard
 */
class PAScorecard {
    constructor() {}
    /**
     * Add a query parameter to filter the returned scores.
     * @param {String} parameter The parameter to set. For a detailed list of available parameters, see . PAScorecard parameters
     * .
     * @param {String} value The value to assign to the specified parameter.
     * @returns Method does not return a value
     * @example var sc = new SNC.PAScorecard(); //in a scoped app, do not use the SNC namespace
     * sc.addParam('uuid', 'fb007202d7130100b96d45a3ce6103b4');       // Number of open incidents
     * sc.addParam('breakdown', '0df47e02d7130100b96d45a3ce610399');  // by Priority
     * var result = sc.query();
     * var json = sc.asJSON();
     * for (var i = 0; i &lt; result.length; i++)
     * gs.info(result[i].name + ': ' + result[i].value + ' ' + result[i].unit.display_value);
     */
    addParam(parameter, value) {}
    /**
     * Returns the latest query result as a JSON string.
     * @returns A JSON representation of the query result.
     */
    asJSON() {}
    /**
     * Performs a query based on the specified parameters and return the scorecard as an
     * object.
     * @returns The scorecard object.
     */
    query() {}
    /**
     * Returns the latest query result as an object.
     * @returns The scorecard object from the last query.
     */
    result() {}
}