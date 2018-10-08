/**
 * The CMDBGroupAPI provided methods for performing actions on CMDB groups.
 * @class CMDBGroupAPI
 * @typedef {Object}  CMDBGroupAPI
 */
class CMDBGroupAPI {
    constructor() {}
    /**
     * Returns all CIs for this group. This includes all manual CIs and the list of CIs from
     * the Query Builder's saved query.
     * @param {String} groupId The sysId of the CMDB group.
     * @param {Boolean} requireCompleteSet When true, returns an empty string if any CIs are filtered out by ACL
     * restrictions.
     * @returns A JSON formated string in the format
     * { 'result':false,
     * 'errors':[ {'message':'Group does not exist',
     * 'error':'GROUP_SYS_ID_IS_NOT_FOUND'},
     * { } // another error if it exists
     * ],
     * 'partialCIListDueToACLFlag':false,
     * 'idList':['sys_id_1', 'sys_id2'] }
     * Where
     * result - a boolean flag. When true the method was successful.
     * errors - a list of errors with a message and error code.
     * partialCIListDueToACLFlag -  a Boolean flag. When true, the idList is
     * incomplete due to an ACL restriction. When false, the idList is complete.
     * idList - an array of cmdb_ci sys_ids
     * When not successful, returns one of the errors GROUP_SYS_ID_IS_NOT_FOUND,
     * GROUP_SYS_ID_IS_EMPTY, FAIL_TO_INSERT_GROUP_CI_PAIR,
     * FAIL_TO_INSERT_GROUP_QUERY_ID_PAIR, CI_CAN_NOT_FOUND, SAVED_QUERY_ID_NOT_FOUND,
     * ERROR_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * TIMEOUT_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * NOT_COMPLETE_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * MAX_LIMIT_DURING_QUERY_BUILDER_PROCESS_QUERY, GROUP_API_TIMEOUT,
     * EXCEPTION_FROM_EXECUTE_QUERY,
     * SOME_CI_NOT_VISIBLE_DUE_TO_SECURITY_CONSTRAINT
     * @example // Script example:
     * var getAllCIFunc = function(groupSysId) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.getAllCI(groupSysId, false);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to retrieve ci list: " + parsed.idList);
     * } else {
     * gs.print("fail to retrieve list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * var groupExists = "d0d2d25113152200eef2dd828144b0e4";
     * var groupContainsInvalidSavedQuery = "e685a2c3d7012200de92a5f75e610387";
     * getAllCIFunc(groupExists);
     * getAllCIFunc(groupContainsInvalidSavedQuery);
     */
    getAllCI(groupId, requireCompleteSet) {}
    /**
     * Returns all CIs returned from all saved query builder's query IDs for the specified
     * group.
     * @param {String} groupId The sysId of the CMDB group.
     * @param {Boolean} requireCompleteSet When true, returns an empty string if any CIs are filtered out by ACL
     * restrictions.
     * @returns A JSON formated string in the format
     * { 'result':false,
     * 'errors':[ {'message':'Group does not exist',
     * 'error':'GROUP_SYS_ID_IS_NOT_FOUND'},
     * { } // another error if it exists
     * ],
     * 'partialCIListDueToACLFlag':false,
     * 'idList':['sys_id_1', 'sys_id2'] }
     * Where
     * result - a boolean flag. When true the method was successful.
     * errors - a list of errors with a message and error code.
     * partialCIListDueToACLFlag -  a Boolean flag. When true, the idList is
     * incomplete due to an ACL restriction. When false, the idList is complete.
     * idList - an array of cmdb_ci sys_ids
     * When not successful, returns one of the errors GROUP_SYS_ID_IS_NOT_FOUND,
     * GROUP_SYS_ID_IS_EMPTY, FAIL_TO_INSERT_GROUP_CI_PAIR,
     * FAIL_TO_INSERT_GROUP_QUERY_ID_PAIR, CI_CAN_NOT_FOUND, SAVED_QUERY_ID_NOT_FOUND,
     * ERROR_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * TIMEOUT_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * NOT_COMPLETE_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * MAX_LIMIT_DURING_QUERY_BUILDER_PROCESS_QUERY, GROUP_API_TIMEOUT,
     * EXCEPTION_FROM_EXECUTE_QUERY,
     * SOME_CI_NOT_VISIBLE_DUE_TO_SECURITY_CONSTRAINT
     * @example // Script example:
     * var getAllCIFromQueryBuilderFunc = function(groupSysId) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.getAllCIFromQueryBuilder(groupSysId, false);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to retrieve ci list: " + parsed.idList);
     * } else {
     * gs.print("fail to retrieve list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * var groupExists = "d0d2d25113152200eef2dd828144b0e4";
     * var groupContainsInvalidSavedQuery = "e685a2c3d7012200de92a5f75e610387";
     * getAllCIFromQueryBuilderFunc(groupExists);
     * getAllCIFromQueryBuilderFunc(groupContainsInvalidSavedQuery);
     */
    getAllCIFromQueryBuilder(groupId, requireCompleteSet) {}
    /**
     * Returns the CMDB group's manual CI list.
     * @param {String} groupId The sysId of the CMDB group.
     * @param {Boolean} requireCompleteSet When true, returns an error string if any CIs are filtered out by ACL
     * restrictions.
     * @returns A JSON formated string in the format
     * { 'result':false,
     * 'errors':[ {'message':'Group does not exist',
     * 'error':'GROUP_SYS_ID_IS_NOT_FOUND'},
     * { } // another error if it exists
     * ],
     * 'partialCIListDueToACLFlag':false,
     * 'idList':['sys_id_1', 'sys_id2'] }
     * Where
     * result - a boolean flag. When true the method was successful.
     * errors - a list of errors with a message and error code.
     * partialCIListDueToACLFlag -  a Boolean flag. When true, the idList is
     * incomplete due to an ACL restriction. When false, the idList is complete.
     * idList - an array of cmdb_ci sys_ids
     * When not successful, returns one of the errors GROUP_SYS_ID_IS_NOT_FOUND,
     * GROUP_SYS_ID_IS_EMPTY, FAIL_TO_INSERT_GROUP_CI_PAIR,
     * FAIL_TO_INSERT_GROUP_QUERY_ID_PAIR, CI_CAN_NOT_FOUND, SAVED_QUERY_ID_NOT_FOUND,
     * ERROR_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * TIMEOUT_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * NOT_COMPLETE_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * MAX_LIMIT_DURING_QUERY_BUILDER_PROCESS_QUERY, GROUP_API_TIMEOUT,
     * EXCEPTION_FROM_EXECUTE_QUERY,
     * SOME_CI_NOT_VISIBLE_DUE_TO_SECURITY_CONSTRAINT
     * @example // Script example for requireCompleteSet being false:
     * var getManualCIList = function(groupSysId) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.getManualCIList(groupSysId, false);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to retrieve ci list: " + parsed.idList);
     * } else {
     * gs.print("fail to retrieve list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * // create a group in cmdb_group, and add CIs to this group in Edit Manual CI form
     * var groupExists = "d0d2d25113152200eef2dd828144b0e4";
     * // use a non-exist group
     * var groupDoesNotExists = "d0d2d25113152200eef2dd828144b0e4111";
     * getManualCIList(groupExists);
     * getManualCIList(groupDoesNotExists);
     * 
     * @example // Script example for requireCompleteSet being true
     * var getManualCIList = function(groupSysId) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.getManualCIList(groupSysId, true);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to retrieve ci list: " + parsed.idList);
     * } else {
     * gs.print("fail to retrieve list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * // create a group in cmdb_group, and add CIs to this group in Edit Manual CI form
     * var groupExists = "d0d2d25113152200eef2dd828144b0e4";
     * getManualCIList(groupExists);
     */
    getManualCIList(groupId, requireCompleteSet) {}
    /**
     * Returns the query builder's query IDs for the specified CMDB group.
     * @param {String} groupId The sysId of the CMDB group.
     * @param {Boolean} requireCompleteSet When true, returns an empty string if any CIs are filtered out by ACL
     * restrictions.
     * @returns A JSON formated string in the format
     * { 'result':false,
     * 'errors':[ {'message':'Group does not exist',
     * 'error':'GROUP_SYS_ID_IS_NOT_FOUND'},
     * { } // another error if it exists
     * ],
     * 'partialCIListDueToACLFlag':false,
     * 'idList':['sys_id_1', 'sys_id2'] }
     * Where
     * result - a boolean flag. When true the method was successful.
     * errors - a list of errors with a message and error code.
     * partialCIListDueToACLFlag -  a Boolean flag. When true, the idList is
     * incomplete due to an ACL restriction. When false, the idList is complete.
     * idList - an array of cmdb_ci sys_ids
     * When not successful, returns one of the errors GROUP_SYS_ID_IS_NOT_FOUND,
     * GROUP_SYS_ID_IS_EMPTY, FAIL_TO_INSERT_GROUP_CI_PAIR,
     * FAIL_TO_INSERT_GROUP_QUERY_ID_PAIR, CI_CAN_NOT_FOUND, SAVED_QUERY_ID_NOT_FOUND,
     * ERROR_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * TIMEOUT_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * NOT_COMPLETE_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * MAX_LIMIT_DURING_QUERY_BUILDER_PROCESS_QUERY, GROUP_API_TIMEOUT,
     * EXCEPTION_FROM_EXECUTE_QUERY,
     * SOME_CI_NOT_VISIBLE_DUE_TO_SECURITY_CONSTRAINT
     * @example // Script example:
     * var getSavedQueryIdList = function(groupSysId) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.getSavedQueryIdList(groupSysId, false);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to retrieve saved query id list: " + parsed.idList);
     * } else {
     * gs.print("fail to retrieve list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * var groupExists = "d0d2d25113152200eef2dd828144b0e4";
     * var groupDoesNotExists = "d0d2d25113152200eef2dd828144b0e4111";
     * getSavedQueryIdList(groupExists);
     * getSavedQueryIdList(groupDoesNotExists);
     */
    getSavedQueryIdList(groupId, requireCompleteSet) {}
    /**
     * Sets the manual CI list for the specified group. The existing manual CI list is
     * overwritten. CI sysIds not found in the cmdb_ci table are ignored.
     * @param {String} groupId The sysId of the CMDB group.
     * @param {String} ciSysIds Comma separated list of CI sysIds.
     * @returns A JSON formated string in the format
     * { 'result':false,
     * 'errors':[ {'message':'Group does not exist',
     * 'error':'GROUP_SYS_ID_IS_NOT_FOUND'},
     * { } // another error if it exists
     * ],
     * 'partialCIListDueToACLFlag':false,
     * 'idList':['sys_id_1', 'sys_id2'] }
     * Where
     * result - a boolean flag. When true the method was successful.
     * errors - a list of errors with a message and error code.
     * partialCIListDueToACLFlag -  a Boolean flag. When true, the idList is
     * incomplete due to an ACL restriction. When false, the idList is complete.
     * idList - an array of cmdb_ci sys_ids
     * When not successful, returns one of the errors GROUP_SYS_ID_IS_NOT_FOUND,
     * GROUP_SYS_ID_IS_EMPTY, FAIL_TO_INSERT_GROUP_CI_PAIR,
     * FAIL_TO_INSERT_GROUP_QUERY_ID_PAIR, CI_CAN_NOT_FOUND, SAVED_QUERY_ID_NOT_FOUND,
     * ERROR_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * TIMEOUT_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * NOT_COMPLETE_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * MAX_LIMIT_DURING_QUERY_BUILDER_PROCESS_QUERY, GROUP_API_TIMEOUT,
     * EXCEPTION_FROM_EXECUTE_QUERY,
     * SOME_CI_NOT_VISIBLE_DUE_TO_SECURITY_CONSTRAINT
     * @example // Script example:
     * var setManualCIListFunc = function(groupSysId, manualCIList) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.setManualCIList(groupSysId, manualCIList);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to set manual ci list");
     * } else {
     * gs.print("fail to set manual ci list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * var group = "d0d2d25113152200eef2dd828144b0e4";
     * var groupDoesNotExist = "1234";
     * var manualCIList = "b4fd7c8437201000deeabfc8bcbe5dc1, affd3c8437201000deeabfc8bcbe5dc3";
     * setManualCIListFunc(group, manualCIList);
     * setManualCIListFunc(groupDoesNotExist, manualCIList);
     */
    setManualCIList(groupId, ciSysIds) {}
    /**
     * Sets the saved query ID list for the specified group. The existing query ID list is
     * overwritten. Query sysIds not found in the qb_saved_query table are ignored.
     * @param {String} groupId The sysId of the CMDB group.
     * @param {String} queryIds Comma separated list of saved query sysIds.
     * @returns A JSON formated string in the format
     * { 'result':false,
     * 'errors':[ {'message':'Group does not exist',
     * 'error':'GROUP_SYS_ID_IS_NOT_FOUND'},
     * { } // another error if it exists
     * ],
     * 'partialCIListDueToACLFlag':false,
     * 'idList':['sys_id_1', 'sys_id2'] }
     * Where
     * result - a boolean flag. When true the method was successful.
     * errors - a list of errors with a message and error code.
     * partialCIListDueToACLFlag -  a Boolean flag. When true, the idList is
     * incomplete due to an ACL restriction. When false, the idList is complete.
     * idList - an array of cmdb_ci sys_ids
     * When not successful, returns one of the errors GROUP_SYS_ID_IS_NOT_FOUND,
     * GROUP_SYS_ID_IS_EMPTY, FAIL_TO_INSERT_GROUP_CI_PAIR,
     * FAIL_TO_INSERT_GROUP_QUERY_ID_PAIR, CI_CAN_NOT_FOUND, SAVED_QUERY_ID_NOT_FOUND,
     * ERROR_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * TIMEOUT_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * NOT_COMPLETE_DURING_QUERY_BUILDER_PROCESS_QUERY,
     * MAX_LIMIT_DURING_QUERY_BUILDER_PROCESS_QUERY, GROUP_API_TIMEOUT,
     * EXCEPTION_FROM_EXECUTE_QUERY,
     * SOME_CI_NOT_VISIBLE_DUE_TO_SECURITY_CONSTRAINT
     * @example // Script example:
     * var setSavedQueryIdListFunc = function(groupSysId, queryIdList) {
     * var parser = new JSONParser();
     * var response = sn_cmdbgroup.CMDBGroupAPI.setSavedQueryIdList(groupSysId, queryIdList);
     * var parsed = parser.parse(response);
     * if (parsed.result) {
     * gs.print("succeed to set saved query id list");
     * } else {
     * gs.print("fail to set saved query id list, errors: " + JSON.stringify(parsed.errors));
     * }
     * }
     * var group = "d0d2d25113152200eef2dd828144b0e4";
     * var savedQueryBuilderIdList = "394585fed7812200de92a5f75e6103e8";
     * var savedQueryBuilderIdNotExistList = "b4fd7c8437201000deeabfc8bcbe5dc1,
     * affd3c8437201000deeabfc8bcbe5dc3";
     * setSavedQueryIdListFunc(group, savedQueryBuilderIdList);
     * setSavedQueryIdListFunc(group, savedQueryBuilderIdNotExistList);
     * 
     */
    setSavedQueryIdList(groupId, queryIds) {}
}