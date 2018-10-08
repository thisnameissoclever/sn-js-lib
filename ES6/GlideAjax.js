/**
 * The GlideAjax class enables a client script to call server-side code
 * in a script include.
 * @class GlideAjax
 * @typedef {Object}  GlideAjax
 */
class GlideAjax {
    /**
     * Constructor for GlideAjax.
     * @param {String} class_name The name of the server-side class that contains the method you want to execute.
     */
    constructor(class_name) {}
    /**
     * Specifies a parameter name and value to be passed to the server-side function associated
     * with this GlideAjax object.
     * @param {String} parm_name The name of the parameter to pass. (The name must begin with the
     * sysparm_ .)
     * @param {String} parm_value The value to assign to parm_name.
     * @returns Method does not return a value
     */
    addParam(parm_name, parm_value) {}
    /**
     * Retrieves the results from a server-side method called from the client via
     * getXMLWait().
     * @returns Method does not return a value
     */
    getAnswer() {}
    /**
     * Sends the server a request to execute the method and parameters associated with this
     * GlideAjax object.
     * @param {Function} callback The name of the callback function to process the results returned by the server.
     * @returns Method does not return a value
     * @example var comments = gel("dialog_comments").value;
     * var ga = new GlideAjax('validateComments'); //Call script include to escape text
     * ga.addParam('sysparm_name', 'validateComments');
     * ga.addParam('sysparm_comments', comments);
     * ga.getXML(callback);
     * return false;
     * function callback(response) {
     * var comments = response.responseXML.documentElement.getAttribute("answer");
     * comments = trim(comments);
     * if (comments == "") {
     * //If comments are empty, alert the user and stop submission
     * alert("Please enter your comments before submitting.");
     * } else {
     * //If there are comments, close the dialog window and submit them
     * GlideDialogWindow.get().destroy(); //Close the dialog window
     * g_form.setValue("comments", comments); //Set the "Comments" field with comments in the dialog
     * }
     */
    getXML(callback) {}
    /**
     * Call the processor asynchronously and get the answer element of the response in XML
     * format.
     * @param {Function} callback The callback function. The function receives the answer element of the response
     * in XML format as an argument.
     * @returns Method does not return a value
     * @example function updateAttachmentCount(sysid) {
     * var ga = new GlideAjax('AttachmentAjax');
     * ga.addParam('sysparm_type', 'attachmentCount');
     * ga.addParam('sysparm_value', sysid);
     * ga.getXMLAnswer(numberOfAttachments, null, sysid); // callback: numberOfAttachments
     * }
     * function numberOfAttachments(answer, sysid) {
     * // we want to know there are 5 attachments, not 5.0 attachments
     * var number = parseInt(answer);
     * var buttons = $$('.attachmentNumber_' + sysid);
     * if (buttons[0] == undefined)
     * $('header_attachment_list_label').down().innerHTML = number;
     * else {
     * for (var i = 0; i &lt; buttons.length; i++) {
     * buttons[i].innerHTML = number;
     * }
     * }
     * }
     */
    getXMLAnswer(callback) {}
    /**
     * Sends the server a request to execute the method and parameters associated with this
     * GlideAjax object.
     * @returns Method does not return a value
     * @example var ga = new GlideAjax('HelloWorld');
     * ga.addParam('sysparm_name','helloWorld');
     * ga.addParam('sysparm_user_name',"Bob");
     * ga.getXMLWait();
     * alert(ga.getAnswer());
     */
    getXMLWait() {}
}