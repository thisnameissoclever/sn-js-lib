/**
 * The scoped GlideSystem (referred to by the variable name 'gs' in any server-side
 * JavaScript) API provides a number of convenient methods to get information about the system, the
 * current logged in user, etc.
 * @class GlideSystem
 * @typedef {Object}  GlideSystem
 */
class GlideSystem {
    constructor() {}
    /**
     * Adds an error message for the current session.
     * @param {Object} message The message to add.
     * @returns Method does not return a value
     * @example gs.include("PrototypeServer");
     * var ValidatePasswordStronger = Class.create();
     * ValidatePasswordStronger.prototype = {
     * process : function() {
     * var user_password = request.getParameter("user_password");
     * var min_len = 8;
     * var rules = "Password must be at least " + min_len +
     * " characters long and contain a digit, an uppercase letter, and a lowercase letter.";
     * if (user_password.length() &lt; min_len) {
     * gs.addErrorMessage("TOO SHORT: " + rules);
     * return false;
     * }
     * var digit_pattern = new RegExp("[0-9]", "g");
     * if (!digit_pattern.test(user_password)) {
     * gs.addErrorMessage("DIGIT MISSING: " + rules);
     * return false;
     * }
     * var upper_pattern = new RegExp("[A-Z]", "g");
     * if (!upper_pattern.test(user_password)) {
     * gs.addErrorMessage("UPPERCASE MISSING: " + rules);
     * return false;
     * }
     * var lower_pattern = new RegExp("[a-z]", "g");
     * if (!lower_pattern.test(user_password)) {
     * gs.addErrorMessage("LOWERCASE MISSING: " + rules);
     * return false;
     * }
     * return true; // password is OK
     * }
     * }
     */
    addErrorMessage(message) {}
    /**
     * Adds an info message for the current session. This method is not supported for
     * asynchronous business rules.
     * @param {Object} message An info message object.
     * @returns Method does not return a value
     * @example if ((!current.u_date1.nil()) &amp;&amp; (!current.u_date2.nil())) {
     * var start = current.u_date1.getGlideObject().getNumericValue();
     * var end = current.u_date2.getGlideObject().getNumericValue();
     * if (start &gt; end) {
     * gs.addInfoMessage('start must be before end');
     * current.u_date1.setError('start must be before end');
     * current.setAbortAction(true);
     * }
     * }
     */
    addInfoMessage(message) {}
    /**
     * Returns an ASCII string from the specified base64 string.
     * @param {String} source A base64 encoded string.
     * @returns The decoded string.
     */
    base64Decode(source) {}
    /**
     * Creates a base64 string from the specified string.
     * @param {String} source The string to be encoded.
     * @returns The base64 string.
     */
    base64Encode(source) {}
    /**
     * Returns the date and time for the beginning of last month in GMT.
     * @returns GMT beginning of last month, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfLastMonth() {}
    /**
     * Returns the date and time for the beginning of last week in GMT.
     * @returns GMT beginning of last week, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfLastWeek() {}
    /**
     * Returns the date and time for the beginning of next month in GMT.
     * @returns GMT beginning of next month, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfNextMonth() {}
    /**
     * Returns the date and time for the beginning of next week in GMT.
     * @returns The GMT beginning of next week, in the format yyyy-mm-dd hh:mm:ss.
     */
    beginningOfNextWeek() {}
    /**
     * Returns the date and time for the beginning of next year in GMT.
     * @returns GMT beginning of next year, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfNextYear() {}
    /**
     * Returns the date and time for the beginning of this month in GMT.
     * @returns GMT beginning of this month, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisMonth() {}
    /**
     * Returns the date and time for the beginning of this quarter in GMT.
     * @returns GMT beginning of this quarter, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisQuarter() {}
    /**
     * Returns the date and time for the beginning of this week in GMT.
     * @returns GMT beginning of this week, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisWeek() {}
    /**
     * Returns the date and time for the beginning of this year in GMT.
     * @returns GMT beginning of this year, in the format yyyy-mm-dd hh:mm:ss
     */
    beginningOfThisYear() {}
    /**
     * Generates a date and time for the specified date in GMT.
     * @param {String} date Format: yyyy-mm-dd
     * @param {String} range Start, end, or a time in the 24 hour format hh:mm:ss.
     * @returns A date and time in the format yyyy-mm-dd hh:mm:ss. If range is start, the
     * returned value is yyyy-mm-dd 00:00:00; If range is end the return value is
     * yyyy-mm-dd 23:59:59.
     */
    dateGenerate(date, range) {}
    /**
     * Returns the date and time for a specified number of days ago.
     * @param {Number} days Integer number of days
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     * @example function contractNoticeDue() {
     * var gr = new GlideRecord("contract");
     * gr.addQuery("u_contract_status", "Active");
     * gr.query();
     * while (gr.next()) {
     * if ((gr.u_termination_date &lt;= gs.daysAgo(-90)) &amp;&amp; (gr.u_contract_duration == "Long")) {
     * gr.u_contract_status = "In review";
     * }
     * else if ((gr.u_termination_date &lt;= gs.daysAgo(-50)) &amp;&amp; (gr.u_contract_duration == "Medium")) {
     * gr.u_contract_status = "In review";
     * }
     * else if ((gr.u_termination_date &lt;= gs.daysAgo(-10)) &amp;&amp; (gr.u_contract_duration == "Short")) {
     * gr.u_contract_status = "In review";
     * }
     * }
     * gr.update();
     * }
     */
    daysAgo(days) {}
    /**
     * Returns the date and time for the end of the day a specified number of days
     * ago.
     * @param {Number} days Integer number of days
     * @returns GMT end of the day in the format yyyy-mm-dd hh:mm:ss
     */
    daysAgoEnd(days) {}
    /**
     * Returns the date and time for the beginning of the day a specified number of days
     * ago.
     * @param {String} days Integer number of days
     * @returns GMT start of the day in the format yyyy-mm-dd hh:mm:ss
     * @example var gr = new GlideRecord('sysapproval_approver');
     * gr.addQuery('state', 'requested');
     * gr.addQuery('sys_updated_on', '&lt;', gs.daysAgoStart(5));
     * gr.query();
     */
    daysAgoStart(days) {}
    /**
     * Writes a debug message to the system log.
     * @param {String} message The log message with place holders for any variable arguments.
     * @param {Object} [param1] (Optional) First variable argument.
     * @param {Object} [param2] (Optional) Second variable argument.
     * @param {Object} [param3] (Optional) Third variable argument.
     * @param {Object} [param4] (Optional) Fourth variable argument.
     * @param {Object} [param5] (Optional) Fifth variable argument.
     * @returns Method does not return a value
     * @example gs.debug("This is a debug message");
     * var myFirstName = "Abel";
     * var myLastName = "Tuter";
     * gs.debug("This is a debug message from {0}.{1}", myFirstName, myLastName);
     */
    debug(message, param1, param2, param3, param4, param5) {}
    /**
     * Returns the date and time for the end of last month in GMT.
     * @returns GMT end of last month, in the format yyyy-mm-dd hh:mm:ss
     */
    endOfLastMonth() {}
    /**
     * Returns the date and time for the end of last week in GMT.
     * @returns GMT end of last week, in the format yyyy-mm-dd hh:mm:ss
     */
    endOfLastWeek() {}
    /**
     * Returns the date and time for the end of last year in GMT.
     * @returns GMT in format yyyy-mm-dd hh:mm:ss
     */
    endOfLastYear() {}
    /**
     * Returns the date and time for the end of next month in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfNextMonth() {}
    /**
     * Returns the date and time for the end of next week in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfNextWeek() {}
    /**
     * Returns the date and time for the end of next year in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfNextYear() {}
    /**
     * Returns the date and time for the end of this month in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfThisMonth() {}
    /**
     * Returns the date and time for the end of this quarter in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfThisQuarter() {}
    /**
     * Returns the date and time for the end of this week in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfThisWeek() {}
    /**
     * Returns the date and time for the end of this year in GMT.
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    endOfThisYear() {}
    /**
     * Writes an error message to the system log.
     * @param {String} message The log message with place holders for any variable arguments.
     * @param {Object} [param1] (Optional) First variable argument.
     * @param {Object} [param2] (Optional) Second variable argument.
     * @param {Object} [param3] (Optional) Third variable argument.
     * @param {Object} [param4] (Optional) Fourth variable argument.
     * @param {Object} [param5] (Optional) Fifth variable argument.
     * @returns Method does not return a value
     * @example gs.error("This is an error message");
     * var myFirstName = "Abel";
     * var myLastName = "Tuter";
     * gs.error("This is an error message from {0}.{1}", myFirstName, myLastName);
     */
    error(message, param1, param2, param3, param4, param5) {}
    /**
     * Queues an event for the event manager.
     * @param {String} name Name of the event being queued.
     * @param {Object} instance GlideRecord object, such as "current".
     * @param {String} [parm1] (Optional) Saved with the instance if specified.
     * @param {String} [parm2] (Optional) Saved with the instance if specified.
     * @param {String} [queue] Name of the queue.
     * @returns Method does not return a value
     * @example if (current.operation() != 'insert' &amp;&amp; current.comments.changes()) {
     * gs.eventQueue('incident.commented', current, gs.getUserID(), gs.getUserName());
     * }
     */
    eventQueue(name, instance, parm1, parm2, queue) {}
    /**
     * Queues an event for the event manager at a specified date and time.
     * @param {String} name Name of the event being queued.
     * @param {Object} instance A GlideRecord object, such as "current".
     * @param {String} parm1 (Optional) Saved with the instance if specified.
     * @param {String} parm2 (Optional) Saved with the instance if specified.
     * @param {Object} expiration Date and time to process this event.
     * @returns Method does not return a value
     */
    eventQueueScheduled(name, instance, parm1, parm2, expiration) {}
    /**
     * Executes a job for a scoped application.
     * @param {GlideRecord} job The job to be run.
     * @returns Returns the sysID of the scheduled job. Returns null if the job is global.
     */
    executeNow(job) {}
    /**
     * Generates a GUID that can be used when a unique identifier is required.
     * @returns A 32-character hexadecimal GUID.
     * @example personalId = gs.generateGUID();
     * gs.info(personalId);
     */
    generateGUID() {}
    /**
     * Gets the caller scope name; returns null if there is no caller.
     * @returns The caller's scope name, or null if there is no caller.
     * @example var Scopea = Class.create();
     * Scopea.prototype = {
     * initialize: function() {
     * },
     * callerScope: function() {
     * var scopeb = new app_scope_b.Scopeb();
     * return scopeb.callerscope();
     * },
     * type: 'Scopea'
     * }
     * @example var Scopeb = Class.create();
     * Scopeb.prototype = {
     * initialize: function() {
     * this._constructorCallerScope = gs.getCallerScopeName();
     * },
     * callerscope: function() {
     * return gs.getCallerScopeName();
     * },
     * getConstructorCallerScope: function() {
     * return this._constructorCallerScope;
     * },
     * type: 'Scopeb'
     * }
     * @example gs.info(new Scopea().getCallerScopeName());
     */
    getCallerScopeName() {}
    /**
     * Gets a string representing the cache version for a CSS file.
     * @returns The CSS cache version.
     * @example var verStr = gs.getCssCacheVersionString();
     * gs.info(verStr);
     */
    getCssCacheVersionString() {}
    /**
     * Gets the ID of the current application as set using the Application Picker.
     * @returns The current application's sys_id, or global in none is set.
     * @example var currentId = gs.getCurrentApplicationId();
     * gs.info(currentId);
     */
    getCurrentApplicationId() {}
    /**
     * Gets the name of the current scope.
     * @returns The current scope name.
     * @example var currentScope = gs.getCurrentScopeName();
     * gs.info(currentScope);
     */
    getCurrentScopeName() {}
    /**
     * Returns the list of error messages for the session that were added by
     * addErrorMessage().
     * @returns List of error messages
     */
    getErrorMessages() {}
    /**
     * Retrieves a message from UI messages with HTML special characters replaced with escape
     * sequences, for example, &amp; becomes &amp;amp;.
     * @param {String} id The ID of the message.
     * @param {Array} args (Optional) a list of strings or other values defined by
     * java.text.MessageFormat, which allows you to produce language-neutral messages for
     * display to users.
     * @returns The UI message with HTML special characters replaced with escape
     * sequences.
     * @example var myMessage = gs.geEscapedMessage("Hello {0}", ["mom"]);
     */
    getEscapedMessage(id, args) {}
    /**
     * Retrieves a message from UI messages.
     * @param {String} id The ID of the message.
     * @param {Array} args (Optional) a list of strings or other values defined by
     * java.text.MessageFormat,
     * which allows you to produce language-neutral messages for display to users.
     * @returns The UI message.
     * @example var my_message = '${gs.getMessage("This is a message.")}';
     * alert(my_message);
     */
    getMessage(id, args) {}
    /**
     * Gets the value of a Glide property. If the property is not found, returns an alternate
     * value.
     * @param {String} key The key for the property whose value should be returned.
     * @param {Object} [alt] (Optional) Alternate object to return if the property is not found.
     * @returns {String} The value of the Glide property, or the alternate object defined above.
     * @example var attachment_link = gs.getProperty('glide.servlet.uri');
     * gs.info(attachment_link);
     */
    getProperty(key, alt) {}
    /**
     * Gets a reference to the current Glide session.
     * @returns A reference for the current session.
     * @example if (!gs.hasRole("admin") &amp;&amp; !gs.hasRole("user_admin") &amp;&amp; gs.getSession().isInteractive()) {
     * current.addQuery("active", "true");
     * }
     */
    getSession() {}
    /**
     * Retrieves the GlideSession session ID.
     * @returns The session ID.
     * @example var myUserObject = gs.getSessionID();
     * gs.info(myUserObject);
     */
    getSessionID() {}
    /**
     * This method is no longer available. Instead, use
     * gs.getSession().getSessionToken().
     * @returns The session token.
     */
    getSessionToken() {}
    /**
     * Returns the name of the time zone associated with the current user.
     * @returns The time zone name.
     * @example gs.info(gs.getTimeZoneName());
     */
    getTimeZoneName() {}
    /**
     * Gets the current URI for the session.
     * @returns The URI.
     * @example gs.info(gs.getUrlOnStack());
     */
    getUrlOnStack() {}
    /**
     * Returns a reference to the scoped GlideUser object for the current user.
     * @returns Reference to a scoped user object.
     * @example var myUserObject = gs.getUser();
     */
    getUser() {}
    /**
     * Gets the display name of the current user.
     * @returns The name field of the current user. Returns Abel Tuter, as opposed to
     * abel.tuter.
     * @example gs.info(gs.getUserDisplayName());
     */
    getUserDisplayName() {}
    /**
     * Gets the sys_id of the current user.
     * @returns The sys_id of the current user.
     * @example gs.info(gs.getUserID());
     */
    getUserID() {}
    /**
     * Gets the user name, or user id, of the current user.
     * @returns The user name of the current user.
     * @example gs.info(gs.getUserName());
     */
    getUserName() {}
    /**
     * Determines if the current user has the specified role.
     * @param {Object} role The role to check.
     * @returns True if the user had the role. Returns true for users with the administrator
     * role.
     * @example if (!gs.hasRole("admin") &amp;&amp; !gs.hasRole("groups_admin")  &amp;&amp; gs.getSession().isInteractive()) {
     * var qc = current.addQuery("u_hidden", "!=", "true"); //cannot see hidden groups...
     * qc.addOrCondition("sys_id", "javascript:getMyGroups()"); //...unless in the hidden group
     * gs.info("User has admin and groups admin roles");
     * }
     * else {
     * gs.info("User does not have both admin and groups admin roles");
     * }
     */
    hasRole(role) {}
    /**
     * Returns the date and time for a specified number of hours ago.
     * @param {Number} hours Integer number of hours
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     * @example if (current.operation() == 'insert') {
     * // If no due date was specified, calculate a default
     * if (current.due_date == '') {
     * if (current.urgency == '1') {
     * // Set due date to 4 hours ahead of current time
     * current.due_date = gs.hoursAgo(-4);
     * }
     * if (current.urgency == '2') {
     * // Set due date to 2 days ahead of current time
     * current.due_date = gs.daysAgo(-2);
     * }
     * if (current.urgency == '3') {
     * // Set due date to 7 days ahead of current time
     * current.due_date = gs.daysAgo(-7);
     * }
     * }
     * }
     */
    hoursAgo(hours) {}
    /**
     * Returns the date and time for the end of the hour a specified number of hours
     * ago.
     * @param {Number} hours Integer number of hours
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    hoursAgoEnd(hours) {}
    /**
     * Returns the date and time for the start of the hour a specified number of hours
     * ago.
     * @param {Number} hours Integer number of hours
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    hoursAgoStart(hours) {}
    /**
     * Provides a safe way to call from the sandbox, allowing only trusted scripts to be
     * included.
     * @param {String} name The name fo the script to include.
     * @returns True if the include worked.
     * @example gs.include("PrototypeServer");
     */
    include(name) {}
    /**
     * Writes an info message to the system log.
     * @param {String} message The log message with place holders for any variable arguments.
     * @param {Object} [param1] (Optional) First variable argument.
     * @param {Object} [param2] (Optional) Second variable argument.
     * @param {Object} [param3] (Optional) Third variable argument.
     * @param {Object} [param4] (Optional) Fourth variable argument.
     * @param {Object} [param5] (Optional) Fifth variable argument.
     * @returns Method does not return a value
     * @example gs.info("This is an info message");
     * var myFirstName = "Abel";
     * var myLastName = "Tuter";
     * gs.info("This is an info message from {0}.{1}", myFirstName, myLastName);
     */
    info(message, param1, param2, param3, param4, param5) {}
    /**
     * Determines if debugging is active for a specific scope.
     * @returns True if either session debugging is active or the log level is set to debug for
     * the specified scope.
     * @example gs.debug("This is a log message");
     * var myFirstName = "Abel";
     * var myLastName = "Tuter";
     * gs.debug("This is a log message from {0}.{1}", myFirstName, myLastName);
     * gs.info(gs.isDebugging());
     */
    isDebugging() {}
    /**
     * Checks if the current session is interactive. An example of an interactive session is
     * when a user logs in normally. An example of a non-interactive session is using a SOAP request to
     * retrieve data.
     * @returns True if the session is interactive.
     * @example if (!gs.hasRole("admin") &amp;&amp; gs.getSession().isInteractive()) {
     * var qc1 = current.addQuery('u_group',"");
     * var gra = new GlideRecord('sys_user_grmember');
     * gra.addQuery('user', gs.getUserID());
     * gra.query();
     * while (gra.next()) {
     * qc1.addOrCondition('u_group', gra.group);
     * }
     * }
     */
    isInteractive() {}
    /**
     * Determines if the current user is currently logged in.
     * @returns True if the current user is logged in.
     * @example gs.info(gs.isLoggedIn());
     */
    isLoggedIn() {}
    /**
     * You can determine if a request comes from a mobile device.
     * @returns True if the request comes from a mobile device; otherwise, false.
     * @example if (gs.isMobile())
     * gs.info("submitted from mobile UI");
     * else
     * gs.info("NOT submitted from mobile UI");
     */
    isMobile() {}
    /**
     * Returns the date and time for the end of the minute a specified number of minutes
     * ago.
     * @param {Number} minutes Integer number of minutes
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    minutesAgoEnd(minutes) {}
    /**
     * Returns the date and time for the start of the minute a specified number of minutes
     * ago.
     * @param {Number} minutes Integer number of minutes
     * @returns GMT in the format yyyy-mm-dd hh:mm:ss
     */
    minutesAgoStart(minutes) {}
    /**
     * Returns the date and time for a specified number of months ago.
     * @param {Number} months Integer number of months
     * @returns GMT on today's date of the specified month, in the format yyyy-mm-dd
     * hh:mm:ss
     */
    monthsAgo(months) {}
    /**
     * Returns the date and time for the start of the month a specified number of months
     * ago.
     * @param {Number} months Integer number of months
     * @returns GMT start of the month the specified number of months ago, in the format
     * yyyy-mm-dd hh:mm:ss
     */
    monthsAgoStart(months) {}
    /**
     * Queries an object and returns true if the object is null, undefined, or contains an
     * empty string.
     * @param {Object} o The object to be checked.
     * @returns True if the object is null, undefined, or contains an empty string; otherwise,
     * returns false.
     * @example var gr = new GlideRecord();
     * gs.info(gs.nil(gr));
     */
    nil(o) {}
    /**
     * Returns the date and time for the last day of the quarter for a specified number of
     * quarters ago.
     * @param {Number} quarters Integer number of quarters
     * @returns GMT end of the quarter that was the specified number of quarters ago, in the
     * format yyyy-mm-dd hh:mm:ss
     */
    quartersAgoEnd(quarters) {}
    /**
     * Returns the date and time for the first day of the quarter for a specified number of
     * quarters ago.
     * @param {Number} quarters Integer number of quarters
     * @returns GMT end of the month that was the specified number of quarters ago, in the
     * format yyyy-mm-dd hh:mm:ss
     */
    quartersAgoStart(quarters) {}
    /**
     * Sets the specified key to the specified value if the property is within the script's
     * scope.
     * @param {String} key The key for the property to be set.
     * @param {String} value The value of the property to be set.
     * @param {String} [description] A description of the property.
     * @returns Method does not return a value
     * @example gs.setProperty("glide.foo","bar","foo");
     * gs.info(gs.getProperty("glide.foo"));
     */
    setProperty(key, value, description) {}
    /**
     * Sets the redirect URI for this transaction, which then determines the next page the
     * user will see.
     * @param {Object} o URI object or URI string to set as the redirect
     * @returns Method does not return a value
     * @example gs.setRedirect("com.glideapp.servicecatalog_cat_item_view.do?sysparm_id=d41ce5bac611227a0167f4bf8109bf70&amp;sysparm_user="
     * + current.sys_id + "&amp;sysparm_email=" + current.email)
     */
    setRedirect(o) {}
    /**
     * Determines if a database table exists.
     * @param {String} name Name of the table to check for existence.
     * @returns True if the table exists. False if the table was not found.
     * @example gs.info(gs.tableExists('incident'));
     */
    tableExists(name) {}
    /**
     * Replaces UTF-8 encoded characters with ASCII characters.
     * @param {String} url A string with UTF-8 percent (%) encoded characters.
     * @returns A string with encoded characters replaced with ASCII characters.
     */
    urlDecode(url) {}
    /**
     * Encodes non-ASCII characters, unsafe ASCII characters, and spaces so the returned
     * string can be used on the Internet. Uses UTF-8 encoding. Uses percent (%) encoding.
     * @param {String} url The string to be encoded.
     * @returns A string with non-ASCII characters, unsafe ASCII characters, and spaces
     * encoded.
     */
    urlEncode(url) {}
    /**
     * Writes a warning message to the system log.
     * @param {String} message The log message with place holders for any variable arguments.
     * @param {Object} [param1] (Optional) First variable argument.
     * @param {Object} [param2] (Optional) Second variable argument.
     * @param {Object} [param3] (Optional) Third variable argument.
     * @param {Object} [param4] (Optional) Fourth variable argument.
     * @param {Object} [param5] (Optional) Fifth variable argument.
     * @returns Method does not return a value
     * @example gs.warn("This is a warning");
     * var myFirstName = "Abel";
     * var myLastName = "Tuter";
     * gs.warn("This is a warning from {0}.{1}", myFirstName, myLastName);
     */
    warn(message, param1, param2, param3, param4, param5) {}
    /**
     * Takes an XML string and returns a JSON object.
     * @param {String} xmlString The XML string to be converted.
     * @returns A JSON object representing the XML string. Null if unable to process the XML
     * string.
     * @example var jsonObject = gs.xmlToJSON(xmlString);
     */
    xmlToJSON(xmlString) {}
    /**
     * Returns a date and time for a certain number of years ago.
     * @param {Number} years An integer number of years
     * @returns GMT beginning of the year that is the specified number of years ago, in the
     * format yyyy-mm-dd hh:mm:ss.
     */
    yearsAgo(years) {}
    /**
     * Returns yesterday's time (24 hours ago).
     * @returns GMT for 24 hours ago, in the format yyyy-mm-dd hh:mm:ss
     */
    yesterday() {}
}
//addons
const gs = new GlideSystem();