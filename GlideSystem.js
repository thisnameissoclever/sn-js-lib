/*
 * This replicates the outline of the GlideSystem object for help in autocompletion.
 * http://wiki.service-now.com/index.php?title=GlideSystem
 */

function GlideSystem () {

	//------------------------------------------------------------------------------//
	//--------------------------General Functions-----------------------------------//
	//------------------------------------------------------------------------------//
	this.eventQueue = function(String, Object, String, String, String) { };
	this.getDisplayColumn = function(String) { };
	this.getEscapedProperty = function(String, Object) { };
	/*
	 * <p>getMessage(messageID, optionalArguments)</p>
	 * <p>Retrieve message from UI messages. Note: if the UI message has a tick ('),
	 *    there may be issues with the message in the script; to escape the ticks ('),
	 *    use getMessageS(String, Object).</p>
	 * @param messageID - ID of message
	 * @param optionalArguments - Optional Arguments
	 * @return the UI message as a string.
	 */
	this.getMessage = function(messageID, optionalArguments) { };
	/*
	 * <p>getMessage(messageID, optionalArguments)</p>
	 * <p>Retrieve message from ui messages and escapes all ticks (').
	 *    Useful if you are inserting into a javascript expression from jelly.</p>
	 * @param messageID - ID of message
	 * @param optionalArguments - Optional Arguments
	 * @return the UI message as a string, with the ticks escaped.
	 */
	this.getMessageS = function(messageID, optionalArguments) { };
	this.getNodeValue = function(Object, Integer) { };
	this.getNodeName = function(Object, Integer) { };
	this.include = function(scriptIncludeName) { };
	/*
	 * <p>getProperty(propertyName, defaultValue)</p>
	 * <p>Gets a system property.</p>
	 * @param propertyName - Property name to get.
	 * @param defaultValue - The value to return if the property is not found.
	 * @return The value of the property if found, else the defaultValue supplied.
	 */
	this.getProperty = function(propertyName, defaultValue) { };
	/*
	 * <p>setProperty(propertyName, newValue)</p>
	 * <p>Sets a system property.</p>
	 * @param propertyName - Property name to set.
	 * @param newValue - Value to set the property to.
	 * @return Don't know.
	 */
	this.setProperty = function(propertyName, newValue) { };
	/*
	 * <p>setProperty(propertyName, newValue)</p>
	 * <p>Sets the value and description of a system property.</p>
	 * @param propertyName - Property name to set.
	 * @param newValue - Value to set the property to.
	 * @param propertyDescription - Description to set for the property.
	 * @return Don't know.
	 */
	this.setProperty = function(propertyName, newValue, propertyDescription) { };
	this.getScriptError = function(String) { };
	this.getStyle = function(String, String, String) { };
	this.getXMLText = function(String, String) { };
	this.getXMLNodeList = function(String) { };
	this.log = function(String) { };
	/**
	 * logError(message, source)
	 * Creates an error logged to the system logs.
	 * @param message {string} - The error message.
	 * @param String {string} - The source of the error.
	 */
	this.logError = function(message, source) { };
	this.nil = function(Object) { };
	this.print = function(String) { };
	this.tableExists = function(String) { };

	//------------------------------------------------------------------------------//
	//----------------------Date and Time Functions---------------------------------//
	//------------------------------------------------------------------------------//
	/*
	 * <p>beginningOfLastMonth()</p>
	 * @return UTC beginning of last month adjusted for the timezone of the server, in the format yyyy-mm-dd hh:mm:ss
	 */
	this.beginningOfLastMonth = function() { return new String(); };
	this.beginningOfLastWeek = function() { };
	this.beginningOfNextWeek = function() { };
	this.beginningOfNextMonth = function() { };
	this.beginningOfNextYear = function() { };
	this.beginningOfThisMonth = function() { };
	this.beginningOfThisQuarter = function() { };
	this.beginningOfThisWeek = function() { };
	this.beginningOfThisYear = function() { };
	this.beginningOfToday = function() { };
	this.beginningOfYesterday = function() { };
	this.calDateDiff = function(String, String, Boolean) { };
	/**
	 * <p>dateDiff(String, String, boolean)</p>
	 * <p>Calculates the difference between two dates.</p>
	 * @param startDate {(GlideDateTime|GlideDate|String|Object} a starting date to compare, in yyyy-mm-dd.
	 * @param endDate {(GlideDateTime|GlideDate|String|Object} an ending date to compare, in yyyy-mm-dd.
	 * @param bnumericValue {boolean} true to return difference in number of seconds, false to return difference in the format ddd hh:mm:ss.
	 * @return {(String|number)} if boolean bnumericValue is true, the difference in number of seconds;<br />if false, the difference in the format ddd hh:mm:ss.
	 */
	this.dateDiff = function(startDate, endDate, bnumericValue) { };
	this.dateGenerate = function(String, String) { };
	this.daysAgo = function(Int) { };
	this.daysAgoEnd = function(Int) { };
	this.daysAgoStart = function(Int) { };
	this.endOfLastMonth = function() { };
	this.endOfLastWeek = function() { };
	this.endOfLastYear = function() { };
	this.endOfNextMonth = function() { };
	this.endOfNextWeek = function() { };
	this.endOfNextYear = function() { };
	this.endOfThisMonth = function() { };
	this.endOfThisQuarter = function() { };
	this.endOfThisWeek = function() { };
	this.endOfThisYear = function() { };
	this.endOfToday = function() { };
	this.endOfYesterday = function() { };
	this.hoursAgo = function(Int) { };
	this.hoursAgoEnd = function(Int) { };
	this.hoursAgoStart = function(Int) { };
	this.lastWeek = function() { };
	this.minutesAgo = function(Int) { };
	this.minutesAgoEnd = function(Int) { };
	this.minutesAgoStart = function(Int) { };
	this.monthsAgo = function(Int) { };
	this.monthsAgoEnd = function(Int) { };
	this.monthsAgoStart = function(Int) { };

	/*
	* now()
	* Returns Date & Time in user defined format:
	* YYYY-MM-DD HH:MM:SS
	*/
	this.now = function() { return new String(); };
	this.nowDateTime = function() { };
	this.quartersAgo = function(Int) { };
	this.quartersAgoEnd = function(Int) { };
	this.quartersAgoStart = function(Int) { };
	this.yearsAgo = function(Int) { };
	this.isFirstDayOfMonth = function(Object) { };
	this.isFirstDayOfWeek = function(Object) { };
	this.isFirstDayOfYear = function(Object) { };
	this.isLastDayOfMonth = function(Object) { };
	this.isLastDayOfWeek = function(Object) { };
	this.isLastDayOfYear = function(Object) { };

	//------------------------------------------------------------------------------//
	//-----------------------User Session Functions---------------------------------//
	//------------------------------------------------------------------------------//
	this.addErrorMessage = function(Object) { };
	this.addInfoMessage = function(Object) { };
	this.addMessage = function(String, Object) { };
	this.getErrorMessages = function() { };
	this.getImpersonatingUserDisplayName = function() { };
	this.getImpersonatingUserName = function() { };
	this.getInfoMessages = function() { };
	this.getMessages = function(String) { };
	this.getPreference = function(String, Object) { };
	this.getSession = function() { };
	this.getSessionID = function() { };
	this.getTrivialMessages = function() { };
	this.getUser = function() { return new User(); };
	this.getUserDisplayName = function() { };
	this.getUserID = function() { };
	this.getUserName = function() { };
	this.getUserNameByUserID = function(String) { };
	this.hasRole = function(String) { };
	this.hasRoleInGroup = function(Object, Object) { };
	this.isInteractive = function() { };
	this.isLoggedIn = function() { };
	this.setRedirect = function(Object) { };
	/**
     * Sets the return URI for this transaction. This determines what page the user will be directed to when they return from the next form, if they go "back" using the back-arrow at the top-left of most pages in the ServiceNow interface, or if they submit a form or something that redirects them to the previous page on their "stack" (history).
	 * @param uri {(Object|String)} The
	 */
	this.setReturn = function(uri) { };
	/**
	 * Gets the sys_id of the current user.
	 * @returns {String} The sys_id of the current user.
	 */
	this.getUserID = function() { };
	/**
	 * UNDOCUMENTED
	 * SERVER-SIDE
	 * Sleeps (waits/pauses) for a specified number of MS (thousandths of a second. ie: 5000 = 5 seconds).
	 * Returns no value. Not available in scoped apps. This is the server-side equivalent of the pure JS "setTimeout()" function, and can be used in script includes and even business rules.
	 * If used within a before, after, or display business rule, this will prevent the form from loading after the user saves the record, until the timer is complete.
	 * Because of this fact, it may be wise to present the user with a client-side message in an onSubmit Client Script, which alerts them that this operation may take longer than usual, so they don't get concerned that their browser has frozen.
	 * If the timer is used inside of a loop, a counter and limit-check should be used in order to prevent an infinite loop.
	 *
	 * @param ms {number} The number of milliseconds to sleep for.
	 */
	this.sleep = function(ms) {};
	
	/**
	 * Logs a warning, and the source.
	 * NOT AVAILABLE IN SCOPED APPS!
	 * @param msg {string}
	 * @param source {string}
	 */
	this.logWarning = function(msg, source) {};
	
	/**
	 * Logs an error, and the source.
	 * NOT AVAILABLE IN SCOPED APPS!
	 * @param msg {string}
	 * @param source {string}
	 */
	this.logError = function(msg, source) {};

	//------------------------------------------------------------------------------//
	//-----------------------Unknown Hidden Functions-------------------------------//
	//------------------------------------------------------------------------------//
	this.loadGlobalScripts = function() { };
}


var gs = new GlideSystem();