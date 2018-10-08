/**
 * GlideRecord is used for database operations. Client-side GlideRecord enables the use of
 * some GlideRecord functionality in client-side scripts, such as client scripts and UI policy
 * scripts.
 * @class GlideRecordV3
 * @typedef {Object}  GlideRecordV3
 */
class GlideRecordV3 {
    /**
     * Creates an instance of the GlideRecord class for the specified table.
     * @param {String} tableName The table to be used.
     */
    constructor(tableName) {}
    /**
     * Adds a column to order by in the query.
     * @param {String} column The column by which to order the result set.
     * @returns Method does not return a value
     */
    addOrderBy(column) {}
    /**
     * Adds a filter to return records where the field meets the specified condition (field,
     * operator, value).
     * @param {String} fieldName Name of the field to be checked.
     * @param {Object} operator An operator for the query.
     * @param {Object} value The value to use.
     * @returns Method does not return a value
     */
    addQuery(fieldName, operator, value) {}
    /**
     * Adds a filter to return records where the field is equal to the value (or is in a list
     * of values).
     * @param {String} fieldName Name of the field to be checked.
     * @param {Object} value The value or list of values on which to query.
     * @returns Method does not return a value
     */
    addQuery(fieldName, value) {}
    /**
     * Deletes the current record.
     * @param {Function} responseFunction The response function.
     * @returns True if the record was deleted. False if no record was found to delete.
     */
    deleteRecord(responseFunction) {}
    /**
     * Get a record by sysID.
     * @param {String} sysId The sysID of the record for which to search.
     * @returns True if one or more matching records was found. False if no records were
     * found.
     */
    get(sysId) {}
    /**
     * Retrieves all query conditions as an encoded query string.
     * @returns An encoded query string containing all conditions that have been added to the
     * query.
     */
    getEncodedQuery() {}
    /**
     * Gets the name of the table associated with the GlideRecord.
     * @returns The table name.
     */
    getTableName() {}
    /**
     * Determines if there are any more records in the GlideRecord.
     * @returns True if there are more records in the query set.
     */
    hasNext() {}
    /**
     * Inserts a new record using the field values that have been set for the current
     * record.
     * @param {Function} responseFunction The response function.
     * @returns The sys_id of the inserted record, or null if the record was not
     * inserted.
     */
    insert(responseFunction) {}
    /**
     * Moves to the next record in the GlideRecord.
     * @returns False if there are no more records in the query set.
     */
    next() {}
    /**
     * Specifies an orderBy column. May be called more than once to order by multiple
     * columns.
     * @param {String} column The column to add to sort the result set.
     * @returns Method does not return a value
     */
    orderBy(column) {}
    /**
     * Performs a query. Takes zero or more parameters. Parameters may be in any order. Any
     * function is considered to be a response function. Any pair of literals is considered a query
     * pair (field : value).
     * @param {Function} responseFunction The function called when the query results are available. (optional)
     * @param {String} name A field name. (optional)
     * @param {String} value The field value to check for. (optional)
     * @returns Method does not return a value
     * @example // synchronous, no response function, DO NOT USE
     * query();
     * //
     * // asynchronous, calls the responseFunction when done
     * query(responseFunction)
     * //
     * // synchronous, adds "category=hardware" to current query conditions, and does a query, DO NOT USE
     * query('category', 'hardware')
     * //
     * //asynchronous, adds "category=hardware" to current query conditions, does a query, and calls responseFunction
     * query('category', 'hardware', responseFunction) 
     */
    query(responseFunction, name, value) {}
}