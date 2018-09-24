/*
 * This replicates the outline of the session object for help in autocompletion.
 */
//defer classes/session.js
/**
 *
 * @type {*|void}
 */
var Session = Class.create({
	
	
	initialize: function(tableName) {
		this.initialized = true;
	},
	
	/**
	 * Impersonate a user for the duration of the session (INCLUDING AFTER THE SCRIPT IS FINISHED RUNNING!), or until the onlineImpersonate() method is called again, with another (or the original user's) user_id.
	 * @example
	 * var originalUserID = session.onlineImpersonate('abel_tuter');
	 * //script here, executes as the impersonated user
	 * session.onlineImpersonate(originalUser);
	 * @param userID {string} The user_id OR the sys_id of the user you'd like to impersonate for this session (e.g. 'admin' or '6816f79cc0a8016401c5a33be04be441').
	 * @return The sys_id of the CURRENT user (PRE-impersonation). This can later be passed into session.onlineImpersonate() in order to reimpersonate the original session, which prevents ending up stuck in the other user's session after the script is finished running.
	 */
	onlineImpersonate: function(userID) {
		return 'abc123';
	},
	
	z: null
});
var session = new Session();