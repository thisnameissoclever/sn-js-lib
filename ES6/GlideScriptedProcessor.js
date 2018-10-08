/**
 * ServiceNow
 * processors are equivalent to Java servlets.
 * @class GlideScriptedProcessor
 * @typedef {Object}  GlideScriptedProcessor
 */
class GlideScriptedProcessor {
    constructor() {}
    /**
     * Redirects to the specified URL.
     * @param {String} url the destination URL
     * @returns Method does not return a value
     * @example //Do whatever processing you need and redirect to the homepage
     * g_processor.redirect("/navpage.do")
     */
    redirect(url) {}
    /**
     * Encodes an object as a JSON string and writes it to the current URL.
     * @param {Object} o The object to encode to a JSON string.
     * @returns Method does not return a value
     * @example var map = {"key1":"value1","key2":"value2"};
     * g_processor.writeJSON(map);
     */
    writeJSON(o) {}
    /**
     * Writes the specified string to the current URL in the specified
     * character-encoding.
     * @param {String} contentType Sets the content type of the response sent to the client, if the response has
     * not been committed, and may include a character-encoding specification.
     * @param {String} s The string to write.
     * @returns Method does not return a value
     * @example var name = g_request.getParameter("name");
     * g_processor.writeOutput("text/plain", "Hello " + name);
     */
    writeOutput(contentType, s) {}
    /**
     * Writes the specified string to the current URL.
     * @param {String} s The string to write.
     * @returns Method does not return a value
     * @example var name = g_request.getParameter("name");
     * g_processor.writeOutput("Hello " + name);
     */
    writeOutput(s) {}
}