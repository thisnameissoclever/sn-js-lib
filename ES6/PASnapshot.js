/**
 * The PASnapshot API enables you to query information about Performance Analytics
 * snapshots.
 * @class PASnapshot
 * @typedef {Object}  PASnapshot
 */
class PASnapshot {
    constructor() {}
    /**
     * Compare records in snapshots for a specified indicator at multiple dates, such as to
     * identify records included in one snapshot but not the other.
     * @param {String} sys_id The indicator sys_id.
     * @param {Number} date1 The date of the first snapshot, in the format yyyymmdd.
     * @param {Number} date2 The date of the second snapshot, in the format yyyymmdd.
     * @param {String} type Specifies what data to retrieve. Valid values are:
     * all1: all records in the first snapshot
     * all2: all records in the second snapshot
     * shared: records that are in both snapshots
     * movedin: records that are in the second snapshot, but not the first
     * movedout: records that are in the first snapshot, but not the second
     * 
     * @returns A comma-separated list of sys_id values.
     * @example var snapshot2 = PASnapshot.getCompareIDs('fb007202d7130100b96d45a3ce6103b4', 20160430, 20160531, 'shared');
     * gs.info(snapshot2);
     */
    getCompareIDs(sys_id, date1, date2, type) {}
    /**
     * Get the query used to compare records in snapshots for a specified indicator at
     * multiple dates.
     * @param {String} sys_id The indicator sys_id.
     * @param {Number} date1 The date of the first snapshot, in the format yyyymmdd.
     * @param {Number} date2 The date of the second snapshot, in the format yyyymmdd.
     * @param {String} type Specifies what data to retrieve. Valid values are:
     * all1: all records in the first snapshot
     * all2: all records in the second snapshot
     * shared: records that are in both snapshots
     * movedin: records that are in the second snapshot, but not the first
     * movedout: records that are in the first snapshot, but not the second
     * 
     * @returns The table, view, and encoded query as a JSON string.
     * @example var snapshot4 = PASnapshot.getCompareQuery('fb007202d7130100b96d45a3ce6103b4', 20160530, 20160531, 'all1');
     * gs.info(snapshot4);
     * 
     */
    getCompareQuery(sys_id, date1, date2, type) {}
    /**
     * Get the sys_id values for all records contained in the snapshot for a specified
     * indicator at the specified date.
     * @param {String} sys_id The indicator sys_id.
     * @param {Number} date The date when the snapshot was taken, in the format yyyymmdd.
     * @returns A comma-separated list of sys_id values.
     * @example var snapshot1 = PASnapshot.getIDs('fb007202d7130100b96d45a3ce6103b4', 20160530);
     * gs.info(snapshot1);
     */
    getIDs(sys_id, date) {}
    /**
     * Get the query used to generate the snapshot for a specified indicator at the specified
     * date.
     * @param {String} sys_id The indicator sys_id.
     * @param {Number} date The date when the snapshot was taken, in the format yyyymmdd.
     * @returns The table, view, and encoded query as a JSON string.
     * @example var snapshot3 = PASnapshot.getQuery('fb007202d7130100b96d45a3ce6103b4', 20160530);
     * gs.info(snapshot3);
     */
    getQuery(sys_id, date) {}
}