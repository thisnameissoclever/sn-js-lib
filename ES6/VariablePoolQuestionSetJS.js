/**
 * VariablePoolQuestionSetJS API enables you to use Variable Pool
 * Question Set. To use this class in a scoped application, use the sn_sc namespace identifier. The
 * Service Catalog Scoped API plugin (com.glideapp.servicecatalog.scoped.api) that is enabled by
 * default is required to access the VariablePoolQuestionSetJS API.
 * @class VariablePoolQuestionSetJS
 * @typedef {Object}  VariablePoolQuestionSetJS
 */
class VariablePoolQuestionSetJS {
    /**
     * Creates an instance of the VariablePoolQuestionSet class.
     */
    constructor() {}
    /**
     * Returns the array of questions associated with the cart item ids specified.
     * @returns Object pointing to the current cart details.
     * @example var cart=new sn_sc.VariablePoolQuestionSetJS();
     * cart.setCartID("9bf16afb87110300318d05a888cb0b49");
     * cart.load();
     * console.log(cart.getFlatQuestions());
     */
    getFlatQuestions() {}
    /**
     * Loads the question set.
     * @returns Method does not return a value
     * @example var cart=new sn_sc.VariablePoolQuestionSetJS();
     * cart.load();
     */
    load() {}
    /**
     * Sets the cart item ids of the variable pool.
     * @param {String} id  
     * @returns Method does not return a value
     * @example var cart=new sn_sc.VariablePoolQuestionSetJS();
     * cart.setCartID("9bf16afb87110300318d05a888cb0b49");
     */
    setCartID(id) {}
}