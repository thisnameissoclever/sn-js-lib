/**
 * The scoped Workflow API provides methods that can be used in an activity definition
 * script.
 * @class Workflow
 * @typedef {Object}  Workflow
 */
class Workflow {
    constructor() {}
    /**
     * Adds a debug message to the log.
     * @param {String} message The message to add to the log.
     * @param {Object} args Arguments to add to the message.
     * @returns The message added to the log.
     * @example var loggedMessage = workflow.debug("All is well");
     */
    debug(message, args) {}
    /**
     * Adds an error message to the log.
     * @param {String} message The message to add to the log.
     * @param {Object} args Arguments to add to the message.
     * @returns The logged message
     * @example var loggedMessage = workflow.error("An error has occurred. ");
     */
    error(message, args) {}
    /**
     * Returns the specified variable's value.
     * @param {String} name The variable name
     * @returns The variable's value
     * @example var value = workflow.getVariable("task");
     */
    getVariable(name) {}
    /**
     * Adds an informational message to the log.
     * @param {String} message The message to add to the log.
     * @param {Object} args Arguments to add to the message.
     * @returns The message that is logged.
     * @example var loggedMessage = workflow.info("All is well");
     */
    info(message, args) {}
    /**
     * Returns the workflow variables.
     * @returns Contains the workflow variables as name value pairs.
     * @example var variables = workflow.inputs();
     */
    inputs() {}
    /**
     * Returns the workflow name.
     * @returns The workflow name
     * @example var name = workflow.name();
     */
    name() {}
    /**
     * Removes the specified variable from the workflow.
     * @param {String} name The variable name
     * @returns Method does not return a value
     * @example var value = workflow.removeVariable("task");
     */
    removeVariable(name) {}
    /**
     * Returns the workflow's result.
     * @returns The workflow's result
     * @example var value = workflow.removeVariable("task");
     */
    result() {}
    /**
     * Returns the workflow's scratchpad object.
     * @returns The scratchpad object.
     * @example var scratchpad = workflow.scratchpad();
     */
    scratchpad() {}
    /**
     * Sets the workflow's result.
     * @param {String} result The workflow's result
     * @returns Method does not return a value
     * @example workflow.setResult("Success");
     */
    setResult(result) {}
    /**
     * Sets the specified variable to the specified value.
     * @param {String} name The variable name
     * @param {Object} value The value to be assigned to the variable.
     * @returns Method does not return a value
     * @example workflow.setVariable("task", "terrible");
     */
    setVariable(name, value) {}
    /**
     * Adds a warning message to the log.
     * @param {String} message The message to add to the log.
     * @param {Object} args Arguments to add to the message.
     * @returns The logged message
     * @example var loggedMessage = workflow.warn("Check your permissions.");
     */
    warn(message, args) {}
}