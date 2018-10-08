/**
 * The scoped GlideUser API provides access to information about the current user and
 * current user roles. Using the scoped GlideUser API avoids the need to use the slower GlideRecord
 * queries to get user information.
 * @class GlideUser
 * @typedef {Object}  GlideUser
 */
class GlideUser {
    constructor() {}
    /**
     * Returns the current user's company sys_id.
     * @returns Company sys_id
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getCompanyID());
     */
    getCompanyID() {}
    /**
     * Returns the current user's display name.
     * @returns User's display name
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getDisplayName());
     */
    getDisplayName() {}
    /**
     * Returns the user's email address.
     * @returns User's email address
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getEmail());
     */
    getEmail() {}
    /**
     * Returns the user's first name.
     * @returns User's first name
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getFirstName());
     */
    getFirstName() {}
    /**
     * Gets the sys_id of the current user.
     * @returns User's sys_id
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getID());
     */
    getID() {}
    /**
     * Returns the user's last name.
     * @returns User's last name
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getLastName());
     */
    getLastName() {}
    /**
     * Returns the user ID, or login name, of the current user.
     * @returns User ID
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getName());
     */
    getName() {}
    /**
     * Gets the specified user preference value for the current user.
     * @param {String} name The name of the preference.
     * @returns The preference value.
     * @example var currentUser = gs.getUser();
     * currentUser.savePreference(­'myPref','red');
     * gs.info(currentUser.getPreference(­'myPref'));
     */
    getPreference(name) {}
    /**
     * Returns a list of roles that includes explicitly granted roles, inherited roles, and
     * roles acquired by group membership.
     * @returns List of all roles available to the user
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getRoles());
     */
    getRoles() {}
    /**
     * Returns the list of roles explicitly granted to the user.
     * @returns List of roles explicitly assigned to the user
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.getUserRoles());
     */
    getUserRoles() {}
    /**
     * Determines if the current user has the specified role.
     * @param {String} role Role to check
     * @returns True if the user has the role.
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.hasRole('admin'));
     */
    hasRole(role) {}
    /**
     * Determines if the current user is a member of the specified group.
     * @param {String} group Group to check
     * @returns True if the user is a member of the group.
     * @example var currentUser = gs.getUser();
     * gs.info(currentUser.isMemberOf(­'Capacity Mgmt'));
     */
    isMemberOf(group) {}
    /**
     * Saves a user preference value to the database.
     * @param {String} name The preference to save.
     * @param {String} value The preference value.
     * @returns Method does not return a value
     * @example var currentUser = gs.getUser();
     * currentUser.savePreference('myPref','red');
     * gs.info(currentUser.getPreference('myPref'));
     */
    savePreference(name, value) {}
}
//addons
const g_user = new GlideUser();