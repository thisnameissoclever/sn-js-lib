/**
 * The scoped GlideQueryCondition API provides additional AND or OR conditions that can be
 * added to the current condition, allowing you to build complex queries.
 * @class GlideQueryCondition
 * @typedef {Object}  GlideQueryCondition
 */
class GlideQueryCondition {
    constructor() {}
    /**
     * Adds an AND condition to the current condition.
     * @param {String} name The name of a field.
     * @param {String} oper (Optional) The operator for the query. If you do not specify an operator, the
     * condition uses an equals operator.
     * @param {Object} value The value to query on.
     * @returns A reference to a GlideQueryConditon that was added to the
     * GlideRecord.
     * @example var gr = new GlideRecord('incident');
     * var qc = gr.addQuery('category', 'Hardware');
     * qc.addCondition('category', 'Network');
     * gr.addQuery('number','INC0000003');
     * gr.next();
     * gr.number;
     * gs.info(gr.getEncodedQuery());
     */
    addCondition(name, oper, value) {}
    /**
     * Appends a 2-or-3 parameter OR condition to an existing GlideQueryCondition.
     * @param {String} name Field name
     * @param {String} oper (Optional) Query operator. The available values are dependent on the data
     * type of the value parameter.Numbers:
     * =
     * !=
     * &gt;
     * &gt;=
     * &lt;
     * &lt;=
     * Strings (must be in upper case):
     * =
     * !=
     * IN
     * STARTSWITH
     * ENDSWITH
     * CONTAINS
     * DOESNOTCONTAIN
     * 
     * @param {Object} value Value on which to query (not case-sensitive).Note: All passed in arrays must
     * contain a minimum of two elements. Single element arrays are not
     * supported.
     * @returns A reference to a GlideQueryConditon that was added to the
     * GlideRecord.
     * @example var gr = new GlideRecord('incident');
     * var qc = gr.addQuery('category', 'Hardware');
     * qc.addOrCondition('category', 'Network');
     * gr.addQuery('number','INC0000003');
     * gr.next();
     * gr.number;
     * gs.info(gr.getEncodedQuery());
     * 
     * @example var myObj = new GlideRecord('incident');
     * var q1 = myObj.addQuery('state', '&lt;', 3);
     * q1.addOrCondition('state', '&gt;', 5);
     * var q2 = myObj.addQuery('priority', 1);
     * q2.addOrCondition('priority', 5);
     * myObj.query();
     */
    addOrCondition(name, oper, value) {}
}