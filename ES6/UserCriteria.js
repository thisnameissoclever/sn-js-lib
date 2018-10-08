/**
 * UserCriteria API enables you to create, modify, or delete user
 * criteria records using scripts. To use this class in a scoped application, use the sn_uc
 * namespace identifier. The User Criteria Scoped API plugin (ID:
 * com.glideapp.user_criteria.scoped.api) should be enabled to access the
 * UserCriteria API.
 * @class UserCriteria
 * @typedef {Object}  UserCriteria
 */
class UserCriteria {
    /**
     * Creates an instance of the UserCriteria class.
     */
    constructor() {}
    /**
     * Creates a user criteria with specified values in the user_criteria table. Values
     * specified in columnValues override the values provided via setters.
     * @param {Object} columnValues Key and value pairs for a column and its value.
     * @param {Boolean} standardUpdate Set to true to enable the running of engines and workflow.
     * @returns sys_id of the created user criteria.
     * @example 
     * var uc = new sn_uc.UserCriteria();
     * uc.setCompanies("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89”);
     * uc.setActive(true);
     * uc.setUsers("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * var UserCriteriaId = UserCriteria.create();
     * gs.info(UserCriteriaId);
     * 
     */
    create(columnValues, standardUpdate) {}
    /**
     * Deletes the current user criteria.
     * @returns If true,  the user criteria is deleted.If false, no user criteria is found
     * to delete.
     * @example var uc = new sn_uc.UserCriteria("31bea3d53790200044e0bfc8bcbe5dec");
     * uc.deleteRecord();
     */
    deleteRecord() {}
    /**
     * Displays the mapping for the attribute and value pairs of the catalog item.
     * @param {String} columns Array of catalog item attributes.
     * @returns Mapping for the attribute and value pairs of the catalog item.
     * @example var uc = new sn_uc.UserCriteria();
     * uc.read({"name", "applies_to"});
     */
    read(columns) {}
    /**
     * Specifies if the user criteria is active.
     * @param {Boolean} active If true, the user criteria is active. If false, the user criteria is
     * inactive.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setActive(true);
     * 
     */
    setActive(active) {}
    /**
     * Specifies if the user criteria has an advanced script.
     * @param {Boolean} advanced If true, the user criteria has an advanced script.If false, the user
     * criteria does not have an advanced script.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setAdvanced(true);
     * 
     */
    setAdvanced(advanced) {}
    /**
     * Sets the company property for the user criteria.
     * @param {String} companies Comma-separated list of the company sys_ids to be set for the user
     * criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setCompanies("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * 
     */
    setCompanies(companies) {}
    /**
     * Sets the department property for the user criteria.
     * @param {String} departments Comma-separated list of the department sys_ids to be set for the user
     * criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setDepartments("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * 
     */
    setDepartments(departments) {}
    /**
     * Sets the group property for the user criteria.
     * @param {String} groups Comma-separated list of the group sys_ids to be set for the user
     * criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setGroups("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * 
     */
    setGroups(groups) {}
    /**
     * Sets the location property for the user criteria.
     * @param {String} locations Comma-separated list of the location sys_ids to be set for the user
     * criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setLocations("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * 
     */
    setLocations(locations) {}
    /**
     * Sets the match_all property for the user criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setMatchAll(true);
     * 
     */
    setMatchAll() {}
    /**
     * Sets the name property for the user criteria.
     * @param {String} name Name of the user criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setName("Property1");
     * 
     */
    setName(name) {}
    /**
     * Sets the role property for the user criteria.
     * @param {String} roles Comma-separated list of the role sys_ids to be set for the user
     * criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setRoles("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * 
     */
    setRoles(roles) {}
    /**
     * Sets the script for the user criteria.
     * @param {String} script Script to be set for the advanced user criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setScript("function scriptTest() {
     * var retVal;
     * if (gs.getUser().getRecord().getDisplayValue('department') == 'Product Management') {
     * retVal = true;
     * } else {
     * retVal = false;
     * }
     * return retVal;
     * }");
     * 
     */
    setScript(script) {}
    /**
     * Sets the user property for the user criteria.
     * @param {String} users Comma-separated list of the user sys_ids to be set for the user
     * criteria.
     * @returns Method does not return a value
     * @example var uc = new sn_uc.UserCriteria();
     * uc.setUsers("31bea3d53790200044e0bfc8bcbe5dec,0c441abbc6112275000025157c651c89");
     * 
     */
    setUsers(users) {}
    /**
     * Updates the current catalog item with the specified values.
     * @param {Object} columnValues Mapping for the column name and the value pairs.
     * @param {String} reason Reason for updating the catalog item.
     * @returns Returns the sys_id of  the created user criteria.
     * @example var uc = new sn_uc.UserCriteria();
     * uc.update("name": "Updated name", "The existing name is not relevant. Setting a relevant name");
     * 
     */
    update(columnValues, reason) {}
}