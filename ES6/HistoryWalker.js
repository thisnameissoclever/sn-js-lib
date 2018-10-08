/**
 * The HistoryWalker API uses the audit/history tables to generate a
 * historical version of an existing record. It supports the ability to return a GlideRecord to a
 * previous update count (walked GlideRecord) with the appropriate GlideElements populated. After
 * the walked GlideRecord is retrieved, the API provides the ability to move forward and backward
 * the update numbers navigating through its historical updates.
 * @class HistoryWalker
 * @typedef {Object}  HistoryWalker
 */
class HistoryWalker {
    /**
     * Fetches the database record based on the parameters, using the History Sets to retrieve
     * the historic data.
     * @param {String} tableName Name of table containing the record to retrieve.
     * @param {String} sydId sys_id of the record to retrieve.
     */
    constructor(tableName, sydId) {}
    /**
     * Gets the update number of the current walked glide record.
     * @returns Current update number or, -1 if record is not found
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.walkTo(3);
     * gs.info('Update number: ' + hw.getUpdateNumber());
     */
    getUpdateNumber() {}
    /**
     * Gets the record filled with the history/audit data after walking to an update
     * number.
     * @returns The walked GlideRecord.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.walkTo(0);
     * var walkedRecord = hw.getWalkedRecord();
     * gs.info('Priority in update number 0: ' + walkedRecord.priority);
     * hw.walkTo(1);
     * walkedRecord = hw.getWalkedRecord();
     * gs.info('Short description in update number 1: ' + walkedRecord.short_description);
     */
    getWalkedRecord() {}
    /**
     * Gets a copy of the record filled with the history/audit data after walking to an update
     * number.
     * @returns A copy of the walked GlideRecord.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var walkedRecord = [];
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.walkTo(0);
     * walkedRecord[0] = hw.getWalkedRecordCopy();
     * hw.walkTo(1);
     * walkedRecord[1] = hw.getWalkedRecordCopy();
     * gs.info('Priority in update number 0: ' + walkedRecord[0].priority);
     * gs.info('Short description in update number 1: ' + walkedRecord[1].short_description);
     * 
     */
    getWalkedRecordCopy() {}
    /**
     * Specifies if the record-level read access is applied on the record when retrieving from
     * the database.
     * @returns Returns true if field level security is enabled, else returns false.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * gs.info('Field level security is active: ' + hw.isFieldLevelSecurity());
     */
    isFieldLevelSecurity() {}
    /**
     * Specifies if the record-level read access is applied on the record when retrieving from
     * the database.
     * @returns Returns true if the record-level security is enabled, else returns
     * false.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * gs.info('Record level security is active: ' + hw.isRecordLevelSecurity());
     * 
     */
    isRecordLevelSecurity() {}
    /**
     * Specifies if any of the methods that walk the record from one update to another,
     * support the “changes” data for each element.
     * @returns Returns true if the changes support is enabled, else returns false.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * gs.info('Changes is active: ' + hw.isWithChanges());
     */
    isWithChanges() {}
    /**
     * Specifies if journal type fields are populated from the historical values.
     * @returns Returns true if journal fields are populated, else returns false.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * gs.info('Populating journal fields is active: ' + hw. isWithJournalFields());
     * 
     */
    isWithJournalFields() {}
    /**
     * Specifies if values are set for variables that are recorded in the history.
     * @returns Returns true if including values for variables, else returns false.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * gs.info('Populating variables is active: ' + hw. isWithVariables());
     */
    isWithVariables() {}
    /**
     * Sets the field-level read access on each element before setting the historical value of
     * that element in the GlideRecord. If the field-level security is enabled, it prevents the API to
     * populate the fields of the walked record that the user of the API does not have access
     * to.
     * @param {Boolean} fieldLevelSecurity If set to true, field-level security is enabled. The default value is
     * true.
     * @returns Method does not return a value
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.setFieldLevelSecurity(false);
     * hw.walkTo(0);
     * 
     */
    setFieldLevelSecurity(fieldLevelSecurity) {}
    /**
     * Sets the record-level read access on the record when retrieving from the database. The
     * record-level security prevents the API to retrieve the walked record if the user of the API does
     * not have access to the GlideRecord.
     * @param {Boolean} recordLevelSecurity If set to true, record-level read access security is enabled. The default value
     * is true.
     * @returns Method does not return a value
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.setRecordLevelSecurity(false);
     * hw.walkTo(0);
     * 
     */
    setRecordLevelSecurity(recordLevelSecurity) {}
    /**
     * Sets the “changes” data support for each element for a method that walks the record
     * from one update to another.
     * @param {Boolean} withChanges If set to true, the “changes” data is supported for each element. The default
     * value is true.
     * @returns Method does not return a value
     * @example var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.walkTo(0);
     * do {
     * printChangedFields(hw);
     * } while (hw.walkForward());
     * function printChangedFields(hw) {
     * var walkedGr = hw.getWalkedRecord();
     * var fields = GlideScriptRecordUtil.get(walkedGr).getChangedFieldNames();
     * gs.print("Fields changed at update " + hw.getUpdateNumber() + " were:");
     * for (var j = 0; j &lt; fields.size(); j++)
     * gs.print(" " + fields.get(j));
     * gs.print("");
     * }
     * 
     */
    setWithChanges(withChanges) {}
    /**
     * Specifies if journal type fields are populated from the historical values.
     * @param {Boolean} withJournalFields If set to true, include journal-type fields. Th default value is false.
     * @returns Method does not return a value
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.setWithJournalFields(true);
     * if (hw.walkTo(0)) {
     * var workNotes = hw.getWalkedRecord().work_notes;
     * gs.info('Work Notes in update number ' + hw.getUpdateNumber() + ' was ' + workNotes);
     * }
     * 
     */
    setWithJournalFields(withJournalFields) {}
    /**
     * Specifies if variables are populated from the historical values.
     * @param {Boolean} withVariables If set to true, values are populated for variables. The default value is
     * false.
     * @returns Method does not return a value
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.setWithVariables(true);
     * hw.walkTo(0);
     * if (hw.walkTo(0)) {
     * var varUrgency = hw.getWalkedRecord().variables.urgency;
     * gs.info('Variable Urgency in update number ' + hw.getUpdateNumber() + ' was ' + varUrgency);
     * }
     * 
     */
    setWithVariables(withVariables) {}
    /**
     * Applies the appropriate history/audit data to get a walked GlideRecord to the state
     * when it was one update number backward. If the previous update count is missing from the
     * history/audit data, it will walk to the previous available update count.
     * @returns Returns true if walking to the specified update number was possible. Else,
     * returns false, for example if already walked to the update number 0.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.walkTo(incGr.sys_mod_count);
     * do {
     * var oldPriority = hw.getWalkedRecord().priority;
     * gs.info('Incident priority in update number ' + hw.getUpdateNumber() + ' was ' + oldPriority);
     * } while (hw.walkBackward())
     * 
     */
    walkBackward() {}
    /**
     * Applies the appropriate history/audit data to get a walked GlideRecord to the state
     * when it was one update number forward. If next update count is missing from the history/audit
     * data, it will walk to the next available update count.
     * @returns Returns true if walking to the specified update number was possible. Else,
     * returns false, for example if already walked to the GlideRecord update
     * count.
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * hw.walkTo(0);
     * do {
     * var oldPriority = hw.getWalkedRecord().priority;
     * gs.info('Incident priority in update number ' + hw.getUpdateNumber() + ' was ' + oldPriority);
     * } while (hw.walkForward())
     * 
     */
    walkForward() {}
    /**
     * Applies the appropriate history/audit data to get a GlideRecord to the state it was in
     * a specific update count. Use getWalkedRecord() or getWalkedRecordCopy() after walking to an
     * update number to retrieve the “walked” GlideRecord.
     * @param {Integer} updateCount The update number to walk to.
     * @returns true if walking to the specified update number was possible, false otherwise,
     * for example if the requested update is greater than the update count of the
     * GlideRecord, or if there is no history/audit data of the requested update
     * number
     * @example var incGr = new GlideRecord('incident');
     * incGr.get('number', 'INC0000015');
     * var hw = new sn_hw.HistoryWalker(incGr.getTableName(), incGr.getUniqueValue());
     * if (hw.walkTo(3)) {
     * var oldPriority = hw.getWalkedRecord().priority;
     * gs.info('Incident priority in update number ' + hw.getUpdateNumber() + ' was ' + oldPriority);
     * } else
     * gs.info('Incident does not have update number 3');
     */
    walkTo(updateCount) {}
}