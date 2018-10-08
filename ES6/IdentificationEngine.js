/**
 * The IdentificationEngine uses the Identification and Reconciliation framework to
 * minimize creation of duplicate CIs and to reconcile CI attributes by only accepting information
 * from authorized data sources when updating the CMDB.
 * @class IdentificationEngine
 * @typedef {Object}  IdentificationEngine
 */
class IdentificationEngine {
    constructor() {}
    /**
     * Insert or update configuration items in the CMDB based on identification and
     * reconciliation rules. Use this API instead of updating the CMDB directly.
     * @param {String} source Identifies the data source of the CI information. These must be one of the
     * choice values defined for the discovery_source field of the cmdb_ci table.
     * @param {String} input A JSON formatted string of configuration items to be added or updated. Each
     * input string is in the format  'items: [{}], relations:[{}], related[{}]', where
     * each item within the items,  relations, and related lists contains name-value pairs.
     * The possible name-value pairs within the items list are:
     * className - the sys_class_name of the CI to be created or updated.
     * values:{} - the field information for the CI as name-value pairs, where the
     * name is the field name. When updating reference fields, the value must be the
     * referenced sys_id.
     * lookup:[{}] - a list of records with each item having name-value pairs like
     * the items list.
     * related: [{}] - a list of records with each item having name-value pairs
     * like the items list.
     * The possible name-value pairs within the relations list are:
     * parent - index of the parent item in the dependency relation
     * child - index of the child item in the dependency relation
     * type - the relationship type. This is one of the name field values from the
     * cmdb_rel_type table.
     * 
     * @returns A JSON formatted string that is a list of results for the configuration items
     * in the input string. Each result string is in the format  'items: [{}],
     * relations:[{}]',  where each item within the  items and relations lists contains
     * name-value pairs. The possible name-value pairs within the items list are:
     * className- the sys_class_name for the CI that was updated or created.
     * operation, which is one of INSERT, UPDATE, UPDATE_WITH_UPGRADE,
     * UPDATE_WITH_DOWNGRADE, UPDATE_WITH_SWITCH, DELETE, NO_CHANGE
     * sysId - the sys_id of the CI that was updated or created.
     * relatedSysIds -  a list of sys_id values of CIs used during lookup based
     * identification.
     * maskedAttributes – a list of attributes whose update by a non-authoritative
     * data source gets skipped as defined by the
     * Reconciliation
     * Rules.
     * identifierEntrySysId - sys_id of identifier entry used during matching.
     * errors - a list of errors in the format of (error, message string), where
     * error can be ABANDONED, INVALID_INPUT_DATA, IDENTIFICATION_RULE_MISSING,
     * IDENTIFICATION_RULE_FOR_LOOKUP_MISSING, NO_LOOKUP_RULES_FOR_DEPENDENT_CI,
     * NO_CLASS_NAME_FOR_INDEPENDENT_CI, MISSING_DEPENDENCY, MULTIPLE_DEPENDENCIES,
     * MULTIPLE_DUPLICATE_RECORDS, RELATION_CHAIN_ENDS_AT_QUALIFIER,
     * QUALIFICATION_LOOP, TYPE_CONFLICT_IN_QUALIFICATION, MULTI_MATCH,
     * REQUIRED_ATTRIBUTE_EMPTY, RECLASSIFICATION_NOT_ALLOWED
     * duplicateIndices - a list of indexes of items that are duplicates of the
     * current item.
     * identificationAttempts - a list of attempts in the format of (attributes,
     * identiferName, attemptResult, searchOnTable) where
     * attributes - the attributes of identifier entry used during
     * identification
     * identiferName - the CI identifier to which this identifier entry
     * belongs
     * attemptResult - one of SKIPPED, NO_MATCH, MATCHED, MULTI_MATCH
     * searchOnTable - the table searched during the identification
     * process.
     * The possible name-value pairs within the relations list are:
     * className - the relationship CI's class name and is always cmdb_rel_ci
     * operation - one of INSERT, UPDATE, NO_CHANGE
     * sysId - the sys_id of the relationship CI inserted or updated
     * 
     * @example var payload = {items: [{className:'cmdb_ci_linux_server',
     * values: {name:'stry0900844 CI 2',
     * serial_number:'9876EFGH',
     * mac_address:'4653XYZ',
     * ip_address:'10.10.10.4',
     * ram:'1238'}}]
     * };
     * var jsonUntil = new JSON();
     * var input = jsonUntil.encode(payload);
     * var output = sn_cmdb.IdentificationEngine.createOrUpdateCI('ServiceNow', input);
     * gs.print(output);
     * 
     * @example var payload =
     * {items: [
     * {className:'cmdb_ci_web_server',
     * values: {name:'apache linux den 200',
     * running_process_command: 'xyz',
     * running_process_key_parameters: 'abc',
     * tcp_port:'3452'}},
     * {className:'cmdb_ci_linux_server',
     * values: {name:'lnux100', ram:'2048'}}],
     * relations:[{parent: 0, child: 1, type: 'Runs on::Runs'}]
     * };
     * var jsonUntil = new JSON();
     * var input = jsonUntil.encode(payload);
     * var output = sn_cmdb.IdentificationEngine.createOrUpdateCI('ServiceWatch', input);
     * gs.print(output);
     * 
     * @example var payload = {items: [
     * {className:'cmdb_ci_netgear',
     * values: {name:'ny8500-nbxs08',
     * ports:'1200'},
     * lookup: [{className:'cmdb_serial_number',
     * values:{serial_number:'1234ABCD', serial_number_type:'uuid',absent:'false',valid:'true'}},
     * {className:'cmdb_serial_number',
     * values:{serial_number:'3456EFGH', serial_number_type:'system',absent:'false',valid:'true'}}]}]};
     * var jsonUntil = new JSON();
     * var input = jsonUntil.encode(payload);
     * var output = sn_cmdb.IdentificationEngine.createOrUpdateCI('ServiceNow', input);
     * gs.print(output);
     * 
     */
    createOrUpdateCI(source, input) {}
    /**
     * Determines the operation (insert/update) that will be performed with the specified
     * payload without committing the operation in the database.
     * @param {String} jsonString A JSON formatted string of configuration items to be added or updated. Each
     * input string is in the format  'items: [{}], relations:[{}]', where each item within
     * the items and relations lists contains name-value pairs. The possible name-value
     * pairs within the items list are:
     * className - the sys_class_name of the CI to be created or updated.
     * values:{} - the field information for the CI as name-value pairs, where the
     * name is the field name.
     * lookup:[{}] - a list of records with each item having name-value pairs like
     * the items list.
     * The possible name-value pairs within the relations list are:
     * parent - index of the parent item in the dependency relation
     * child - index of the child item in the dependency relation
     * type - the relationship type. This is one of the name field values from the
     * cmdb_rel_type table.
     * 
     * @returns A JSON formatted string that is a list of results. Each result string is in the
     * format  'items: [{}], relations:[{}]', where each item within the items and
     * relations lists contains name-value pairs. The possible name-value pairs within
     * the items list are:
     * className- the sys_class_name for the CI that was updated or created.
     * operation, which is one of INSERT, UPDATE, UPDATE_WITH_UPGRADE,
     * UPDATE_WITH_DOWNGRADE, UPDATE_WITH_SWITCH, DELETE, NO_CHANGE
     * sysId - the sys_id of the CI that was updated or created.
     * relatedSysIds - a list of sys_id values of CIs used during lookup based
     * identification.
     * identifierEntrySysId - sys_id of identifier entry used during matching.
     * errors - a list of errors in the format of (error, message string), where
     * error can be ABANDONED, INVALID_INPUT_DATA, IDENTIFICATION_RULE_MISSING,
     * IDENTIFICATION_RULE_FOR_LOOKUP_MISSING, NO_LOOKUP_RULES_FOR_DEPENDENT_CI,
     * NO_CLASS_NAME_FOR_INDEPENDENT_CI, MISSING_DEPENDENCY, MULTIPLE_DEPENDENCIES,
     * MULTIPLE_DUPLICATE_RECORDS, RELATION_CHAIN_ENDS_AT_QUALIFIER,
     * QUALIFICATION_LOOP, TYPE_CONFLICT_IN_QUALIFICATION, MULTI_MATCH,
     * REQUIRED_ATTRIBUTE_EMPTY, RECLASSIFICATION_NOT_ALLOWED
     * duplicateIndices - a list of indexes of items that are duplicates of the
     * current item.
     * identificationAttempts - a list of attempts in the format of (attributes,
     * identiferName, attemptResult, searchOnTable) where
     * attributes - the attributes of identifier entry used during
     * identification
     * identiferName - the CI identifier to which this identifier entry
     * belongs
     * attemptResult - one of SKIPPED, NO_MATCH, MATCHED, MULTI_MATCH
     * searchOnTable - the table searched during the identification
     * process.
     * The possible name-value pairs within the relations list are:
     * className - the relationship CI's class name and is always cmdb_rel_ci
     * operation - one of INSERT, UPDATE, NO_CHANGE
     * sysId - the sys_id of the relationship CI inserted or updated
     * 
     */
    identifyCI(jsonString) {}
    /**
     * Run an identification audit against the specified CI to detect duplicates.
     * @param {GlideRecord} gr The CI on which to run the audit to detect duplicates. The CI must have
     * independent identification rules.
     * @returns Method does not return a value
     */
    runIdentificationAudit(gr) {}
}