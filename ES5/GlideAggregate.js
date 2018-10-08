/*
 * This replicates the outline of the GlideAggregate object for help in autocompletion.
 * Note that this class simply extends the GlideRecord class.
 * I've cheated and included all the GlideRecord functions within this class to avoid inheritance issues.
 * http://wiki.service-now.com/index.php?title=GlideAggregate
 */

function GlideAggregate (table) {

    //------------------------------------------------------------------------------//
    //--------------------------Query Functions-------------------------------------//
    //------------------------------------------------------------------------------//
    this.table = table;
    this.addActiveQuery = function() { };
    this.addDomainQuery = function(GlideRecord){ };
    this.addInactiveQuery = function(){ };
    this.addNotNullQuery = function(String){ };
    this.addNullQuery = function(String){ };
    this.addQuery = function(String, Object, Object){ };
    this.applyEncodedQuery = function(String){ };
    this.canCreate = function(){ };
    this.canDelete = function(){ };
    this.canRead = function(){ };
    this.canWrite = function(){ };
    this.changes = function(){ };
    this.hasAttachments = function(){ };
    this.hasNext = function(){ };
    this.instanceOf = function(String){ };
    this.isNewRecord = function(){ };
    this.isValid = function(){ };
    this.isValidField = function(String){ };
    this.isValidField = function(){ };
    this.next = function(){ };
    this.operation = function(){ };
    this.orderBy = function(String){ };
    this.query = function(Object, Object){ };
    this.restoreLocation = function(){ };
    this.saveLocation = function(){ };

    //------------------------------------------------------------------------------//
    //----------------------------Get Functions-------------------------------------//
    //------------------------------------------------------------------------------//
    this.get = function(Object, Object){ };
    this.getAttribute = function(String) { };
    this.getClassDisplayValue = function() { };
    this.getDisplayValue = function() { };
    this.getED = function() { };
    this.getElement = function() { };
    this.getEncodedQuery = function() { };
    this.getEscapedDisplayValue = function() { };
    this.getFields = function() { };
    this.getLabel = function() { };
    this.getLink = function(Boolean) { };
    this.getLocation = function() { };
    this.getRecordClassName = function() { };
    this.getRelatedLists = function() { };
    this.getRelatedTables = function() { };
    this.getRowCount = function() { };
    this.getRowNumber = function() { };
    this.getTableName = function() { };
    this.getUniqueValue = function() { };
    this.getValue = function(String) { };

    //------------------------------------------------------------------------------//
    //----------------------------Set Functions-------------------------------------//
    //------------------------------------------------------------------------------//
    this.setAbortAction = function(Boolean) { };
    this.setDisplayValue = function(String, Object) { };
    this.setForceUpdate = function(Boolean) { };
    this.setLimit = function(Int) { };
    this.setLocation = function(Int) { };
    this.setNewGuid = function() { };
    this.setNewGuidValue = function(String) { };
    this.setUseEngines = function(Boolean) { };
    this.setQueryReferences = function(Boolean) { };
    this.setValue = function(String, Object) { };
    this.setWorkflow = function(Boolean) { };

    //------------------------------------------------------------------------------//
    //----------------------------Update Functions----------------------------------//
    //------------------------------------------------------------------------------//
    this.applyTemplate = function(Template) { };
    this.update = function(Object) { };

    //------------------------------------------------------------------------------//
    //----------------------------Insert Functions----------------------------------//
    //------------------------------------------------------------------------------//
    this.initialize = function() { };
    this.insert = function() { };
    this.newRecord = function() { };

    //------------------------------------------------------------------------------//
    //----------------------------Delete Functions----------------------------------//
    //------------------------------------------------------------------------------//
    this.deleteMultiple = function() { };
    this.deleteRecord = function() { };

    //------------------------------------------------------------------------------//
    //------------------------GlideAggregate Functions------------------------------//
    //------------------------------------------------------------------------------//
    this.addEncodedQuery = function(String) { };
    this.addHaving = function(String, String, String) { };
    /*
     * addAggregate(String, String)
     * @param aggregateType -- (COUNT, SUM, MIN, MAX, AVG)
     * @param groupBy -- The collumn to group by.
     * @return null
     */
    this.addAggregate = function(aggregateType, groupBy) { };
    /*
     * addAggregate(String)
     * @param aggregateType -- (COUNT, SUM, MIN, MAX, AVG)
     * @return null
     */
    this.addAggregate = function(aggregateType) { };
    this.addTrend = function(String, String) { };
    /*
     * getAggregate(String, String)
     * @param aggregateType -- (COUNT, SUM, MIN, MAX, AVG)
     * @param groupBy -- The collumn to group by.
     * @return Result of Aggregate -- either an integer or decimal
     */
    this.getAggregate = function(aggregateType, groupBy) { };
    /*
     * getAggregate(String, String)
     * @param aggregateType -- (COUNT, SUM, MIN, MAX, AVG)
     * @return Result of Aggregate -- either an integer or decimal
     */
    this.getAggregate = function(aggregateType) { };
    this.getQuery = function() { };
    this.getTotal = function(String, String) { };
    this.getValue = function(String) { };
    this.groupBy = function(String) { };
    this.orderBy = function(String) { };
    this.orderByAggregate = function(String, String) { };
    this.query = function() { };
    this.setGroup = function(Boolean) { };
}
