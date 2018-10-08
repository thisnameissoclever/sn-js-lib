/**
 * The spModal class provides an alternative way to show alerts, prompts, and confirmation
 * dialogs.  The SPModal class is available in Service Portal client scripts.
 * @class spModal
 * @typedef {Object}  spModal
 */
class spModal {
    constructor() {}
    /**
     * Displays an alert.
     * @param {String} message The message to display.
     * @returns The promise contains a single argument that contains true or false.
     * @example // HTML template
     * &lt;button ng-click="c.onAlert()" class="btn btn-default"&gt;
     * Alert
     * &lt;/button&gt;
     * // Client script
     * function(spModal) {
     * var c = this;
     * c.onAlert = function () {
     * spModal.alert('How do you feel today?').then(function (answer) {
     * c.simple = answer;
     * });
     * }
     * }
     */
    alert(message) {}
    /**
     * Displays a confirmation message.
     * @param {String} message The message to display.
     * @returns The promise contains a single argument that contains true or false.
     * @example // HTML template
     * &lt;button ng-click="c.onConfirm()" class="btn btn-default"&gt; Confirm &lt;/button&gt;
     * &lt;span&gt;{{c.confirmed}}&lt;/span&gt;
     * // Client script
     * function(spModal) {
     * var c = this;
     * c.onConfirm = function() {
     * c.confirmed = "asking";
     * spModal.confirm("Can you confirm or deny this?").then(function(confirmed) {
     * c.confirmed = confirmed; // true or false
     * })
     * }
     * } 
     * @example //HTML template
     * &lt;button ng-click="c.onConfirmEx()" class="btn btn-default"&gt;
     * Confirm - HTML message
     * &lt;/button&gt;
     * &lt;span&gt;{{c.confirmed}}&lt;/span&gt;
     * // Client script
     * function(spModal) {
     * var c = this;
     * // more control, passing options
     * c.onConfirmEx = function() {
     * c.confirmed = "asking";
     * var warn = '&lt;i class="fa fa-warning" aria-hidden="true"&gt;&lt;/i&gt;';
     * spModal.open({
     * title: 'Delete this Thing?',
     * message: warn + ' Are you &lt;b&gt;sure&lt;/b&gt; you want to do that?'
     * }).then(function(confirmed) {
     * c.confirmed = confirmed;
     * })
     * }
     * }
     */
    confirm(message) {}
    /**
     * Opens a modal window using the specified options.
     * @param {Object} options An object that may have these properties.
     * title - a string that can be HTML that goes in the header. The default is
     * empty.
     * message - a string that can be HTML that goes in the header. The default is
     * empty.
     * buttons - an array that contains the buttons to show on the dialog. The
     * default is Cancel and OK.
     * input - a Boolean. When true shows an input field on the dialog. The default
     * is false.
     * value - a string containing the value of the input field. The default is
     * empty.
     * widget - a string that identifies the widget ID or sys_id to embed in the
     * dialog. The default is empty.
     * widgetInput - an object to send the embedded widget as input. The default is
     * null.
     * shared - a client-side object to share data with the embedded widget client
     * script.
     * size - a string indicating the size of the window. Can be 'sm' or 'lg'. The
     * default is empty.
     * 
     * @returns Method does not return a value
     * @example //HTML template
     * &lt;button ng-click="c.onOpen()" class="btn btn-default"&gt;
     * Prompt with label
     * &lt;/button&gt;
     * &lt;div ng-show="c.name"&gt;
     * You answered &lt;span&gt;{{c.name}}&lt;/span&gt;
     * &lt;/div&gt;
     * //Client code
     * function(spModal) {
     * var c = this;
     * c.onOpen = function() {
     * //ask the user for a string
     * spModal.open({
     * title: 'Give me a name',
     * message: 'What would you like to name it?',
     * input: true,
     * value: c.name
     * }).then(function(name) {
     * c.name = name;
     * })
     * }
     * }
     * @example //HTML template
     * &lt;button ng-click="c.onAgree()" class="btn btn-default"&gt;
     * Agree
     * &lt;/button&gt;
     * &lt;div ng-show="c.agree"&gt;
     * You answered {{c.agree}}
     * &lt;/div&gt;
     * //Client script
     * function(spModal) {
     * var c = this;
     * c.onAgree = function() {
     * // ask the user for a string
     * // note embedded html in message
     * var h = '&lt;h4&gt;Apple likes people to agree to lots of stuff&lt;/h4&gt;'
     * // Line feeds added to the following lines for presentation formatting.
     * var m = 'Your use of Apple software or hardware products is based
     * on the software license and other terms and conditions in effect for the
     * product at the time of purchase. Your agreement to these terms is required
     * to install or use the product. '
     * spModal.open({
     * title: 'Do you agree?',
     * message: h + m,
     * buttons: [
     * {label:'✘ ${No}', cancel: true},
     * {label:'✔ ${Yes}', primary: true}
     * ]
     * }).then(function() {
     * c.agree = 'yes';
     * }, function() {
     * c.agree = 'no';
     * })
     * }
     * }
     * @example //HTML template
     * &lt;button ng-click="c.onWidget('widget-cool-clock')" class="btn btn-default"&gt;
     * Cool Clock
     * &lt;/button&gt;
     * //Client script
     * function(spModal) {
     * var c = this;
     * c.onWidget = function(widgetId, widgetInput) {
     * spModal.open({
     * title: 'Displaying widget ' + widgetId,
     * widget: widgetId,
     * widgetInput: widgetInput || {}
     * }).then(function(){
     * console.log('widget dismissed');
     * })
     * }
     * }
     */
    open(options) {}
    /**
     * Displays a prompt for user input.
     * @param {String} message The message to display.
     * @param {String} default A default value to use if the user does not provide a response.
     * @returns The promise contains the user's response, or the default value if the user does
     * not enter a response.
     * @example //HTML template
     * &lt;button ng-click="c.onPrompt()" class="btn btn-default"&gt;
     * Prompt
     * &lt;/button&gt;
     * &lt;div ng-show="c.name"&gt;
     * You answered &lt;span&gt;{{c.name}}&lt;/span&gt;
     * &lt;/div&gt;
     * // Client script
     * function(spModal) {
     * var c = this;
     * c.onPrompt = function() {
     * spModal.prompt("Your name please", c.name).then(function(name) {
     * c.name = name;
     * })
     * }
     * }
     */
    prompt(message,
        default) {}
}