/**
 * Build functions to perform SQL operations in the database.
 * @class GlideDBFunctionBuilder
 * @typedef {Object}  GlideDBFunctionBuilder
 */
class GlideDBFunctionBuilder {
    /**
     * Instantiates a GlideDBFunctionBuilder object.
     */
    constructor() {}
    /**
     * Adds the values of two or more integer fields.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myAddingFunction = functionBuilder.add();
     * myAddingFunction = functionBuilder.field('order');
     * myAddingFunction = functionBuilder.field('priority');
     * myAddingFunction = functionBuilder.build();
     */
    add() {}
    /**
     * Builds the database function defined by the GlideDBFunctionBuilder object.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myAddingFunction = functionBuilder.add();
     * myAddingFunction = functionBuilder.field('order');
     * myAddingFunction = functionBuilder.field('priority');
     * myAddingFunction = functionBuilder.build();
     * gs.print(myAddingFunction);
     */
    build() {}
    /**
     * Concatenates the values of two or more fields.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myConcatFunction = functionBuilder.concat();
     * myConcatFunction = functionBuilder.field('short_description');
     * myConcatFunction = functionBuilder.field('caller_id.name');
     * myConcatFunction = functionBuilder.build();
     */
    concat() {}
    /**
     * Defines a constant value to use in the function. If used with the
     * dayofweek() method, the string defines whether to use Sunday or Monday as
     * the first day of the week.
     * @param {String} constant A constant value used in a function. When used with the
     * dayofweek() method, the value defines whether the week starts
     * on a Sunday or Monday.
     * 1: Week begins on Sunday.
     * 2: Week begins on Monday.
     * This definition enables the dayofweek() method to return
     * the correct day of the week from a given date. If a value other than 1 or 2 is
     * provided, the dayofweek() method uses Sunday as the first day
     * of the week.
     * @returns Method does not return a value
     */
    constant(constant) {}
    /**
     * Determines the duration using a given start date/time and end date/time.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myDateDiffFunction = functionBuilder.datediff();
     * myDateDiffFunction = functionBuilder.field('sys_updated_on');
     * myDateDiffFunction = functionBuilder.field('opened_at');
     * myDateDiffFunction = functionBuilder.build();
     */
    datediff() {}
    /**
     * Returns an integer representing the day of the week for a given date.
     * @returns If the first day of the week is set to Sunday in the constant(String
     * constant) method, return values are associated with the following days
     * of the week:
     * 1: Sunday
     * 2: Monday
     * 3: Tuesday
     * 4: Wednesday
     * 5: Thursday
     * 6: Friday
     * 7: Saturday
     * If the first day of the week is set to Monday:
     * 1: Monday
     * 2: Tuesday
     * 3: Wednesday
     * 4: Thursday
     * 5: Friday
     * 6: Saturday
     * 7: Sunday
     * If a value other than 1 or 2 is provided in the constant(String
     * constant) method, the dayofweek() method uses
     * Sunday as the first day of the week.
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var dayOfWeekFunction = functionBuilder.dayofweek();
     * dayOfWeekFunction = functionBuilder.field('opened_at');
     * dayOfWeekFunction = functionBuilder.constant('2');
     * dayOfWeekFunction = functionBuilder.build();
     * var gr = new GlideRecord('incident');
     * gr.addFunction(dayOfWeekFunction);
     * gr.query();
     * while(gr.next())
     * gs.log(gr.getValue(dayOfWeekFunction));
     * 
     */
    dayofweek() {}
    /**
     * Divides the value of one integer field by another.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myDivideFunction = functionBuilder.divide();
     * myDivideFunction = functionBuilder.field('order');
     * myDivideFunction = functionBuilder.field('priority');
     * myDivideFunction = functionBuilder.build();
     */
    divide() {}
    /**
     * Defines a field on which a SQL operation is performed.
     * @param {String} field The field on which you are performing the SQL operation.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myAddingFunction = functionBuilder.add();
     * myAddingFunction = functionBuilder.field('order');
     * myAddingFunction = functionBuilder.field('priority');
     * myAddingFunction = functionBuilder.build();
     */
    field(field) {}
    /**
     * Determines the number of code units in a field.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myLengthFunction = functionBuilder.length();
     * myLengthFunction = functionBuilder.field('short_description');
     * myLengthFunction = functionBuilder.build();
     * 
     */
    length() {}
    /**
     * Multiplies the values of two integer fields.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var myMultiplyFunction = functionBuilder.multiply();
     * myMultiplyFunction = functionBuilder.field('order');
     * myMultiplyFunction = functionBuilder.field('priority');
     * myMultiplyFunction = functionBuilder.build();
     */
    multiply() {}
    /**
     * Subtracts the value of one integer field from another.
     * @returns Method does not return a value
     * @example var functionBuilder = new GlideDBFunctionBuilder();
     * var mySubtractFunction = functionBuilder.subtract();
     * mySubtractFunction = functionBuilder.field('order');
     * mySubtractFunction = functionBuilder.field('priority');
     * mySubtractFunction = functionBuilder.build();
     */
    subtract() {}
}