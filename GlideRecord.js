/*
 * This replicates the outline of the GlideRecord object for help in autocompletion.
 * http://wiki.service-now.com/index.php?title=GlideRecord
 * http://www.servicenowguru.com/scripting/gliderecord-query-cheat-sheet/
 */
//defer classes/GlideRecord.js
var GlideRecord = {
	AJAX_PROCESSOR: "AJAXGlideRecord",
	initialized: false,
	
	table: "table",
	encodedQuery: "",
	
	initialize: function(tableName) {
		this.currentRow = -1;
		this.rows = [];
		this.conditions = [];
		this.encodedQuery = "";
		this.orderByFields = [];
		this.displayFields = [];
		this.maxQuerySize = -1;
		if (tableName) {
			this.setTableName(tableName);
		}
		if (this.initialized == false) {
			this.ignoreNames = [];
			for (var xname in this) {
				this.ignoreNames[xname] = true;
			}
		} else {
			for (var xname in this) {
				if (this.ignoreNames[xname] && this.ignoreNames[xname] == true) {
					continue;
				}
				delete this[xname];
			}
		}
		this.initialized = true;
	},
	
	addActiveQuery: function() {
	},
	
	addDomainQuery: function(GlideRecord) {
	},
	/**
	 * addQuery(String, Object, Object) <br />
	 * Add a filter to the current query being built.<br />
	 * Operator Can Be: <br />
	 * =<br />
	 * ><br />
	 * <<br />
	 * <=<br />
	 * <=<br />
	 * !=<br />
	 * STARTSWITH<br />
	 * CONTAINS<br />
	 * ENDSWITH<br />
	 * DOES NOT CONTAIN<br />
	 * INSTANCEOF<br />
	 * @param fieldName -- Name of field being queried against.
	 * @param operator -- Operator to use.
	 * @param value -- Value to compare against.
	 *
	 */
	addQuery: function(fieldName, operator, value) {
		var fName;
		var fOper;
		var fValue;
		if (arguments.length == 2) {
			fName = arguments[0];
			fOper = '=';
			fValue = arguments[1];
		} else if (arguments.length == 3) {
			fName = arguments[0];
			fOper = arguments[1];
			fValue = arguments[2];
		}
		this.conditions.push({
			'name': fName,
			'oper': fOper,
			'value': fValue
		});
	},
	/*
	 * autoSysFields(Boolean) <br />
	 * Add a filter to the current query being built.
	 * @param toggle -- If false, it prevents created, created by, updated, and updated by from updating.
	 */
	autoSysFields: function(toggle) {
	},
	/**
	 * Set a window (like a slice or substring) of GlideRecords to return, by row index (zero-based).
	 * Note: chooseWindow (below) INCLUDES the first index, but DOES NOT INCLUDE the last; hence the above iteration.
	 * So "chooseWindow(0,3)" will run through records at index 0, 1, and 2 - but not the record at index 3.
	 * @param f {number} - The first index
	 * @param l {number} - The last index (NON-inclusive!)
	 * @param forceCount {boolean} - If true, will get all possible records within the given query. I don't actually know what this means, this is just what the API docs say.
	 */
	chooseWindow: function(f, l, forceCount) {
	},
	getEncodedQuery: function() {
		var ec = this.encodedQuery;
		for (var i = 0; i < this.conditions.length; i++) {
			var q = this.conditions[i];
			ec += "^" + q['name'] + q['oper'] + q['value'];
		}
		return ec;
	},
	deleteRecord: function(responseFunction) {
		var ajax = new GlideAjax(this.AJAX_PROCESSOR);
		ajax.addParam("sysparm_type", "delete");
		ajax.addParam("sysparm_name", this.getTableName());
		ajax.addParam("sysparm_chars", this._getXMLSerialized());
		if (typeof responseFunction == 'undefined') {
			var rxml = ajax.getXMLWait();
			return;
		}
		if (typeof responseFunction != 'function') {
			responseFunction = doNothing;
		}
		ajax.getXML(this._deleteRecord0.bind(this), null, responseFunction);
	},
	_deleteRecord0: function(response, responseFunction) {
		if (!response || !response.responseXML) {
			return;
		}
		responseFunction(this);
	},
	get: function(id) {
		this.initialize();
		this.addQuery('sys_id', id);
		this.query();
		return this.next();
	},
	getTableName: function() {
		return this.tableName;
	},
	hasNext: function() {
		return (this.currentRow + 1 < this.rows.length);
	},
	insert: function(responseFunction) {
		return this.update(responseFunction);
	},
	gotoTop: function() {
		this.currentRow = -1;
	},
	/**
	 * next()<br />
	 * Iterates to the next row.
	 * @return NULL if there are no more records in the set.
	 */
	next: function() {
		if (!this.hasNext()) {
			return false;
		}
		this.currentRow++;
		this.loadRow(this.rows[this.currentRow]);
		return true;
	},
	/**
	 * nextRecord()<br />
	 * Iterates to the next row.
	 * @return NULL if there are no more records in the set.
	 */
	nextRecord: function() {
		if (!this.hasNext()) {
			return false;
		}
		this.currentRow++;
		this.loadRow(this.rows[this.currentRow]);
		return true;
	},
	loadRow: function(r) {
		for (var i = 0; i < r.length; i++) {
			var name = r[i].name;
			var value = r[i].value;
			if (this.isDotWalkField(name)) {
				var start = this;
				var parts = name.split(/-/);
				for (var p = 0; p < parts.length - 1; p++) {
					var part = parts[p];
					if (typeof start[part] != 'object') {
						start[part] = new Object();
					}
					start = start[part];
				}
				var fieldName = parts[parts.length - 1];
				start[fieldName] = value;
			} else {
				this[name] = value;
			}
		}
	},
	isDotWalkField: function(name) {
		for (var i = 0; i < this.displayFields.length; i++) {
			var fieldName = this.displayFields[i];
			if (fieldName.indexOf(".") == -1) {
				continue;
			}
			var encodedFieldName = fieldName.replace(/\./g, "-");
			if (name == encodedFieldName) {
				return true;
			}
		}
		return false;
	},
	addOrderBy: function(f) {
		this.orderByFields.push(f);
	},
	orderBy: function(f) {
		this.orderByFields.push(f);
	},
	setDisplayFields: function(fields) {
		this.displayFields = fields;
	},
	/**
	 * query(fieldName, value)<br />
	 * Issues the currently built query with another filter added.<br />
	 * query('category', 'hardware', responseFunction) --- as above but async and calls responseFunction when done
	 * Takes zero or more arguments in any order
	 * Any function is assumed to be a response function
	 * Any pair of literals are a query pair
	 * @param fieldName {string=} -- The fieldname of a filter you wish to add.
	 * @param value {string=} -- the value you're looking for in that field.
	 * @return null
	 */
	query: function(fieldName, value) {
	},
	query: function() {
		var responseFunction = this._parseArgs(arguments);
		if (getBaseLine(this)) {
			var rxml = loadXML(g_filter_description.getBaseLine());
			this._queryResponse(rxml);
			return;
		}
		var ajax = new GlideAjax(this.AJAX_PROCESSOR);
		ajax.addParam("sysparm_type", "query");
		ajax.addParam("sysparm_name", this.getTableName());
		ajax.addParam("sysparm_chars", this.getEncodedQuery());
		if (this.getLimit() != -1) {
			ajax.addParam("sysparm_max_query", this.getLimit());
		}
		if (this.orderByFields.length > 0) {
			ajax.addParam("sysparm_orderby", this.orderByFields.join(","));
		}
		if (this.displayFields.length > 0) {
			ajax.addParam("sysparm_display_fields", this.displayFields.join(","));
		}
		if (!responseFunction) {
			var sw = new StopWatch();
			var rxml = ajax.getXMLWait();
			sw.jslog("*** WARNING *** GlideRecord synch query for table: " + this.getTableName());
			this._queryResponse(rxml);
			return;
		}
		ajax.getXML(this._query0.bind(this), null, responseFunction);
	},
	/**
	 * Gets the GlideRecord object for a given reference element. MUST BE DOT-CALLED FROM THE OBJECT ITSELF.
	 * Example: current.u_ref_field.getRefRecord(); //Returns the GlideRecord object for the record in this field
	 * @returns {GlideRecord} - The GlideRecord object for the value in the GlideElement field it's called upon.
	 */
	getRefRecord: function() {
	},
	/**
	 * queryRecord(fieldName, value)<br />
	 * Issues the currently built query with another filter added.<br />
	 * query('category', 'hardware', responseFunction) --- as above but async and calls responseFunction when done
	 * Takes zero or more arguments in any order
	 * Any function is assumed to be a response function
	 * Any pair of literals are a query pair
	 * @param fieldName -- The fieldname of a filter you wish to add.
	 * @param value -- the value you're looking for in that field.
	 * @return null
	 */
	queryRecord: function(fieldName, value) {
	},
	queryRecord: function() {
		var responseFunction = this._parseArgs(arguments);
		if (getBaseLine(this)) {
			var rxml = loadXML(g_filter_description.getBaseLine());
			this._queryResponse(rxml);
			return;
		}
		var ajax = new GlideAjax(this.AJAX_PROCESSOR);
		ajax.addParam("sysparm_type", "query");
		ajax.addParam("sysparm_name", this.getTableName());
		ajax.addParam("sysparm_chars", this.getEncodedQuery());
		if (this.getLimit() != -1) {
			ajax.addParam("sysparm_max_query", this.getLimit());
		}
		if (this.orderByFields.length > 0) {
			ajax.addParam("sysparm_orderby", this.orderByFields.join(","));
		}
		if (this.displayFields.length > 0) {
			ajax.addParam("sysparm_display_fields", this.displayFields.join(","));
		}
		if (!responseFunction) {
			var sw = new StopWatch();
			var rxml = ajax.getXMLWait();
			sw.jslog("*** WARNING *** GlideRecord synch query for table: " + this.getTableName());
			this._queryResponse(rxml);
			return;
		}
		ajax.getXML(this._query0.bind(this), null, responseFunction);
	},
	_parseArgs: function(args) {
		var responseFunction = null;
		var i = 0;
		while (i < args.length) {
			if (typeof args[i] == 'function') {
				responseFunction = args[i];
				i++;
				continue;
			}
			if (i + 1 < args.length) {
				this.conditions.push({
					'name': args[i],
					'oper': '=',
					'value': args[i + 1]
				});
				i += 2;
			} else {
				i++;
			}
		}
		return responseFunction;
	},
	_query0: function(response, responseFunction) {
		if (!response || !response.responseXML) {
			return;
		}
		this._queryResponse(response.responseXML);
		responseFunction(this);
	},
	_queryResponse: function(rxml) {
		var rows = [];
		var items = rxml.getElementsByTagName("item");
		for (var i = 0; i < items.length; i++) {
			var grData = items[i];
			var cnodes = grData.childNodes;
			var fields = [];
			for (var z = 0; z < cnodes.length; z++) {
				var field = cnodes[z];
				var name = field.nodeName;
				var value = getTextValue(field);
				if (!value) {
					value = "";
				}
				fields.push({
					'name': name,
					'value': value
				});
			}
			rows.push(fields);
		}
		this.setRows(rows);
	},
	setRows: function(r) {
		this.rows = r;
	},
	setTableName: function(tableName) {
		this.tableName = tableName;
	},
	update: function(responseFunction) {
		var ajax = new GlideAjax(this.AJAX_PROCESSOR);
		ajax.addParam("sysparm_type", "save_list");
		ajax.addParam("sysparm_name", this.getTableName());
		ajax.addParam("sysparm_chars", this._getXMLSerialized());
		if (typeof responseFunction == 'undefined') {
			var rxml = ajax.getXMLWait();
			return this._updateResponse(rxml);
		}
		if (typeof responseFunction != 'function') {
			responseFunction = doNothing;
		}
		ajax.getXML(this._update0.bind(this), null, responseFunction);
	},
	_update0: function(response, responseFunction) {
		if (!response || !response.responseXML) {
			return;
		}
		var answer = this._updateResponse(response.responseXML);
		responseFunction(this, answer);
	},
	_updateResponse: function(rxml) {
		var items = rxml.getElementsByTagName("item");
		if (items && items.length > 0) {
			return getTextValue(items[0]);
		}
	},
	updateWithReferences: function() {
	
	},
	/*
	 * Set the limit for how many records to fetch.
	 *  @param maxQuery -- Number of records to return.
	 *  @return null
	 */
	setLimit: function(maxQuery) {
		this.maxQuerySize = maxQuery;
	},
	getLimit: function() {
		return this.maxQuerySize;
	},
	_getXMLSerialized: function() {
		var xml = loadXML("<record_update/>");
		var root = xml.documentElement;
		root.setAttribute("id", "id_goes_here");
		root.setAttribute('table', this.getTableName());
		var item = xml.createElement(this.getTableName());
		root.appendChild(item);
		for (var xname in this) {
			if (this.ignoreNames[xname]) {
				continue;
			}
			var f = xml.createElement(xname);
			item.appendChild(f);
			var v = this[xname];
			if (!v) {
				v = "NULL";
			}
			var t = xml.createTextNode(v);
			f.appendChild(t);
		}
		return getXMLString(xml);
	},
	
	//------------------------------------------------------------------------------//
	//--------------------------Query Functions-------------------------------------//
	//------------------------------------------------------------------------------//
	addInactiveQuery: function() {
	},
	addNotNullQuery: function(String) {
	},
	addNullQuery: function(String) {
	},
	addOrCondition: function(String, Object, Object) {
	},
	applyEncodedQuery: function(String) {
	},
	canCreate: function() {
	},
	canDelete: function() {
	},
	canRead: function() {
	},
	canWrite: function() {
	},
	changes: function() {
	},
	changesTo: function(state) {
	},
	changesFrom: function(state) {
	},
	hasAttachments: function() {
	},
	instanceOf: function(String) {
	},
	isNewRecord: function() {
	},
	isValid: function() {
	},
	isValidField: function(String) {
	},
	isValidField: function() {
	},
	operation: function() {
	},
	orderByDesc: function(String) {
	},
	/**
	 * Set the current record to be the record that was saved with saveLocation().<br />
	 * If saveLocation has not been called yet, the current record is set to be the first record of the recordset.
	 * @return null
	 */
	restoreLocation: function() {
	},
	/**
	 * Save the current row number so that we can get back to this location using restoreLocation()
	 * @return null
	 */
	saveLocation: function() {
	},
	
	//------------------------------------------------------------------------------//
	//----------------------------Get Functions-------------------------------------//
	//------------------------------------------------------------------------------//
	getAttribute: function(String) {
	},
	getClassDisplayValue: function() {
	},
	getDisplayValue: function() {
	},
	getED: function() {
	},
	getElement: function() {
	},
	getEscapedDisplayValue: function() {
	},
	getFields: function() {
	},
	getLabel: function() {
	},
	getLink: function(Boolean) {
	},
	getLocation: function() {
	},
	getRecordClassName: function() {
	},
	getRelatedLists: function() {
	},
	getRelatedTables: function() {
	},
	/**
	 * Gets the number of rows in result set.
	 * @return Integer -- # of Rows.
	 */
	getRowCount: function() {
	},
	getRowNumber: function() {
	},
	getUniqueValue: function() {
	},
	getValue: function(fieldToGet) {
	},
	
	//------------------------------------------------------------------------------//
	//----------------------------Set Functions-------------------------------------//
	//------------------------------------------------------------------------------//
	setAbortAction: function(Boolean) {
	},
	setDisplayValue: function(String, Object) {
	},
	setForceUpdate: function(Boolean) {
	},
	setLocation: function(Int) {
	},
	setNewGuid: function() {
	},
	setNewGuidValue: function(String) {
	},
	setUseEngines: function(Boolean) {
	},
	setQueryReferences: function(Boolean) {
	},
	setValue: function(String, Object) {
	},
	setWorkflow: function(Boolean) {
	},
	
	//------------------------------------------------------------------------------//
	//----------------------------Update Functions----------------------------------//
	//------------------------------------------------------------------------------//
	applyTemplate: function(Template) {
	},
	update: function(Object) {
	},
	/**
	 * To use updateMultiple, ALWAYS use .setValue(), never use pass-by-reference.
	 * Also, DO perform the .query(), but don't use .next().
	 * Just add your conditions, do query, use .setValue() to change your value, and then call .updateMultiple(). That's it.
	 */
	updateMultiple: function() {
	},
	
	//------------------------------------------------------------------------------//
	//----------------------------Insert Functions----------------------------------//
	//------------------------------------------------------------------------------//
	newRecord: function() {
	},
	
	//------------------------------------------------------------------------------//
	//----------------------------Delete Functions----------------------------------//
	//------------------------------------------------------------------------------//
	deleteMultiple: function() {
	},
	z: null
});

var current = new GlideRecord(),
	previous = new GlideRecord();