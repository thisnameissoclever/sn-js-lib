/**
 * GlideAggregate enables you to easily create database aggregation
 * queries.
 * @class GlideAggregate
 * @typedef {Object}  GlideAggregate
 */
class GlideAggregate {
    /**
     * Creates a GlideAggregate object on the specified table.
     * @param {String} tableName Name of the table.
     */
    constructor(tableName) {}
    /**
     * Adds an aggregate.
     * @param {String} agg Name of the aggregate to add, for example, COUNT, MIN, or MAX
     * @param {String} name (Optional) Name of the column to aggregate. Null is the default.
     * @returns Method does not return a value
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('COUNT');
     * count.query();
     * var incidents = 0;
     * if (count.next()) {
     * incidents = count.getAggregate('COUNT');
     * }
     * //Number of incidents varies depending on the current state
     * //of the incident table
     * gs.info('Number of incidents: ' + incidents);
     */
    addAggregate(agg, name) {}
    /**
     * Adds an encoded query to the other queries that may have been set for this
     * aggregate.
     * @param {String} query An encoded query to add to the aggregate.
     * @returns Method does not return a value
     * @example //Number of incidents varies depending on the current state
     * //of the incident table
     * var count = new GlideAggregate('incident');
     * count.addEncodedQuery('active=true');
     * count.addAggregate('COUNT');
     * count.query();
     * var incidents = 0;
     * if (count.next())
     * incidents = count.getAggregate('COUNT');
     * gs.info(incidents);
     */
    addEncodedQuery(query) {}
    /**
     * Adds a not null query to the aggregate.
     * @param {String} fieldname The name of the field.
     * @returns The scoped query condition.
     * @example var count = new GlideAggregate('incident');
     * count.addNotNullQuery('short_description');
     * count.query();   // Issue the query to the database to get all records
     * while (count.next()) {
     * // add code here to process the aggregate
     * }
     */
    addNotNullQuery(fieldname) {}
    /**
     * Adds a null query to the aggregate.
     * @param {String} fieldName The name of the field.
     * @returns The scoped query condition.
     * @example var count = new GlideAggregate('incident');
     * count.addNullQuery('short_description');
     * count.query();   // Issue the query to the database to get all records
     * while (count.next()) {
     * // add code here to process the aggregate
     * }
     */
    addNullQuery(fieldName) {}
    /**
     * Adds a query to the aggregate.
     * @param {String} name The query to add.
     * @param {String} operator The operator for the query.
     * @param {String} value The list of values to include in the query.
     * @returns The query condition.
     * @example //Number of incidents varies depending on the current state
     * //of the incident table
     * var count = new GlideAggregate('incident');
     * count.addQuery('active', '=','true');
     * count.addAggregate('COUNT', 'category');
     * count.query();
     * while (count.next()) {
     * var category = count.category;
     * var categoryCount = count.getAggregate('COUNT', 'category');
     * gs.info("There are currently " + categoryCount + " incidents with a category of " + category);
     * }
     */
    addQuery(name, operator, value) {}
    /**
     * Adds a trend for a field.
     * @param {String} fieldName The name of the field for which trending should occur.
     * @param {String} timeInterval The time interval for the trend. The following choices are available: Year,
     * Quarter, Date, Week, DayOfWeek, Hour, Value.
     * @returns Method does not return a value
     */
    addTrend(fieldName, timeInterval) {}
    /**
     * Gets the value of an aggregate from the current record.
     * @param {String} agg The type of the aggregate, for example, SUM or Count.
     * @param {String} name Name of the field to get the aggregate from.
     * @returns The value of the aggregate.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('COUNT');
     * count.query();
     * var incidents = 0;
     * if (count.next()) {
     * incidents = count.getAggregate('COUNT');
     * }
     * //Number of incidents varies depending on the current state
     * //of the incident table
     * gs.info('Number of incidents: ' + incidents);
     */
    getAggregate(agg, name) {}
    /**
     * Gets the query necessary to return the current aggregate.
     * @returns The encoded query to get the aggregate.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('MIN', 'sys_mod_count');
     * count.groupBy('category');
     * count.query();
     * while (count.next()) {
     * gs.info(count.getAggregateEncodedQuery());
     * }
     */
    getAggregateEncodedQuery() {}
    /**
     * Retrieves the encoded query.
     * @returns The encoded query.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('MIN', 'sys_mod_count');
     * count.addAggregate('MAX', 'sys_mod_count');
     * count.addAggregate('AVG', 'sys_mod_count');
     * count.groupBy('category');
     * count.query();
     * gs.info(count.getEncodedQuery());
     */
    getEncodedQuery() {}
    /**
     * Retrieves the number of rows in the GlideAggregate object.
     * @returns The number of rows in the GlideAggregate object.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('MIN', 'sys_mod_count');
     * count.addAggregate('MAX', 'sys_mod_count');
     * count.addAggregate('AVG', 'sys_mod_count');
     * count.groupBy('category');
     * count.query();
     * gs.info(count.getRowCount());
     * while (count.next()) {
     * var min = count.getAggregate('MIN', 'sys_mod_count');
     * var max = count.getAggregate('MAX', 'sys_mod_count');
     * var avg = count.getAggregate('AVG', 'sys_mod_count');
     * var category = count.category.getDisplayValue();
     * gs.info(category + " Update counts: MIN = " + min + " MAX = " + max + " AVG = " + avg);
     * }
     */
    getRowCount() {}
    /**
     * Retrieves the table name associated with this GlideAggregate object.
     * @returns The table name.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('MIN', 'sys_mod_count');
     * count.addAggregate('MAX', 'sys_mod_count');
     * count.addAggregate('AVG', 'sys_mod_count');
     * count.groupBy('category');
     * count.query();
     * gs.info(count.getTableName());
     */
    getTableName() {}
    /**
     * Gets the value of a field.
     * @param {String} name The name of the field.
     * @returns The value of the field.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('MIN', 'sys_mod_count');
     * count.addAggregate('MAX', 'sys_mod_count');
     * count.addAggregate('AVG', 'sys_mod_count');
     * count.groupBy('category');
     * count.query();
     * while (count.next()) {
     * var min = count.getAggregate('MIN', 'sys_mod_count');
     * var max = count.getAggregate('MAX', 'sys_mod_count');
     * var avg = count.getAggregate('AVG', 'sys_mod_count');
     * var category = count.category.getDisplayValue();
     * }
     * gs.info("Current category is: " + count.getValue('category'));
     */
    getValue(name) {}
    /**
     * Provides the name of a field to use in grouping the aggregates.
     * @param {String} name Name of the field.
     * @returns Method does not return a value
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('MIN', 'sys_mod_count');
     * count.addAggregate('MAX', 'sys_mod_count');
     * count.addAggregate('AVG', 'sys_mod_count');
     * count.groupBy('category');
     * count.query();
     * while (count.next()) {
     * var min = count.getAggregate('MIN', 'sys_mod_count');
     * var max = count.getAggregate('MAX', 'sys_mod_count');
     * var avg = count.getAggregate('AVG', 'sys_mod_count');
     * var category = count.category.getDisplayValue();
     * gs.info(category + " Update counts: MIN = " + min + " MAX = " + max + " AVG = " + avg);
     * }
     */
    groupBy(name) {}
    /**
     * Determines if there are any more records in the GlideAggregate object.
     * @returns True if there are more results in the query set.
     * @example var agg = new GlideAggregate('incident');
     * agg.addAggregate('AVG', 'sys_mod_count');
     * agg.groupBy('category');
     * agg.query();
     * while (agg.hasNext()) {
     * agg.next();
     * var avg = agg.getAggregate('AVG', 'sys_mod_count');
     * var category = agg.category.getDisplayValue();
     * gs.info(category + ': AVG = ' + avg);
     * }
     */
    hasNext() {}
    /**
     * Moves to the next record in the GlideAggregate.
     * @returns True if there are more records in the query set; otherwise, false.
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('COUNT');
     * count.query();
     * var incidents = 0;
     * if (count.next()) {
     * incidents = count.getAggregate('COUNT');
     * gs.info(incidents);
     * }
     */
    next() {}
    /**
     * Orders the aggregates using the value of the specified field. The field will also be
     * added to the group-by list.
     * @param {String} name Name of the field to order the aggregates by.
     * @returns Method does not return a value
     * @example var agg = new GlideAggregate('incident');
     * agg.addAggregate('count', 'category');
     * agg.orderBy('category');
     * agg.query();
     * while (agg.next()) {
     * var category = agg.category;
     * var count = agg.getAggregate('count', 'category');
     * var agg2 = new GlideAggregate('incident');
     * agg2.addAggregate('count', 'category');
     * agg2.orderBy('category');
     * gs.info(category + ": Current number of incidents:" + count);
     * }
     */
    orderBy(name) {}
    /**
     * Orders the aggregates based on the specified aggregate and field.
     * @param {String} agg Type of aggregation.
     * @param {String} fieldName Name of the field to aggregate.
     * @returns Method does not return a value
     * @example ga.addAggregate(‘COUNT’, ‘category’);
     * ga.orderByAggregate('count', 'category');
     * ga.query();
     * while(ga.next()) {
     * gs.info(‘Category ’ + ga.category + ‘ ‘ + ga.getAggregate(‘COUNT’, ‘category’));
     * }
     */
    orderByAggregate(agg, fieldName) {}
    /**
     * Sorts the aggregates in descending order based on the specified field. The field will
     * also be added to the group-by list.
     * @param {String} name Name of the field.
     * @returns Method does not return a value
     * @example var agg = new GlideAggregate('incident');
     * agg.addAggregate('count', 'category');
     * agg.orderByDesc('category');
     * agg.query();
     * while (agg.next()) {
     * var category = agg.category;
     * var count = agg.getAggregate('count', 'category');
     * var agg2 = new GlideAggregate('incident');
     * agg2.addAggregate('count', 'category');
     * agg2.orderBy('category');
     * gs.info(category + ": Current number of incidents:" + count);
     * }
     */
    orderByDesc(name) {}
    /**
     * Issues the query and gets the results.
     * @returns Method does not return a value
     * @example var count = new GlideAggregate('incident');
     * count.addAggregate('COUNT');
     * count.query();
     * var incidents = 0;
     * if (count.next()) {
     * incidents = count.getAggregate('COUNT');
     * }
     * gs.info('Number of incidents: ' + incidents);
     */
    query() {}
    /**
     * Sets whether the results are to be grouped.
     * @param {Boolean} b When true the results are grouped.
     * @returns Method does not return a value
     * @example var ga = new GlideAggregate('incident');
     * ga.addAggregate('COUNT', 'category');
     * ga.setGroup(true);
     * ga.groupBy("category");
     * ga.query();
     * while(ga.next()) {
     * gs.info('Category ' + ga.category + ' ' + ga.getAggregate('COUNT', 'category'));
     * }
     */
    setGroup(b) {}
}