/**
 * The GlideSPScriptable API provides a set of methods for use in Service Portal
 * Widgets.
 * @class GlideSPScriptable
 * @typedef {Object}  GlideSPScriptable
 */
class GlideSPScriptable {
    constructor() {}
    /**
     * Returns true if the user can read the specified GlideRecord.
     * @param {GlideRecord} gr The GlideRecord to check.
     * @returns True if the record is valid and readable.
     * @example //Server script
     * data.items = [];
     * data.userName = gs.getUserDisplayName();
     * var gr = new GlideRecord("sc_cat_item");
     * gr.query();
     * while(gr.next() &amp;&amp; data.items.length &lt; 10) {
     * if ($sp.canReadRecord(gr)) {
     * data.items.push(gr.getDisplayValue("name"));
     * }
     * }
     * //HTML template
     * &lt;div class="panel panel-default"&gt;
     * &lt;div class="panel-heading"&gt;Hi, {{c.data.userName}}!&lt;/div&gt;
     * &lt;div class="panel-body"&gt;
     * Here are some things you can order:
     * &lt;ul&gt;&lt;li ng-repeat="item in c.data.items"&gt;{{item}}&lt;/li&gt;&lt;/ul&gt;
     * &lt;/div&gt;
     * &lt;/div&gt;
     */
    canReadRecord(gr) {}
    /**
     * Returns true if the user can read the specified GlideRecord.
     * @param {String} table Name of the table to query.
     * @param {String} sysId Sys_id of the record to query.
     * @returns True if the record is valid and readable.
     */
    canReadRecord(table, sysId) {}
    /**
     * Returns a model and view model for a sc_cat_item or
     * sc_cat_item_guide.
     * @param {String} sysId The sys_id of the catalog item (sc_cat_item) or order guide
     * (sc_cat_item_guide).
     * @returns An object containing the catalog item variable model, view, sections, pricing,
     * and client scripts.
     * @example // Server script
     * (function() {
     * var sys_id = $sp.getParameter("sys_id")
     * data.catItem = $sp.getCatalogItem(sys_id);
     * })();
     * // Client script
     * function($http, spUtil) {
     * var c = this;
     * var submitting = false;
     * c.getIt = function() {
     * if (submitting) return;
     * $http.post(spUtil.getURL('sc_cat_item'), c.data.catItem).success(function(response) {
     * if (response.answer) {
     * c.req = response.answer;
     * c.req.page = c.req.table == 'sc_request' ? 'sc_request' : 'ticket';
     * }
     * });
     * }
     * }
     * //SCSS
     * .img-bg {
     * padding: 5px;
     * background-color: $brand-primary;
     * }
     * .img-responsive {
     * margin: 0 auto;
     * }
     * .cat-icon {
     * display: block;
     * margin: -40px auto 0;
     * }
     * // HTML template
     * &lt;div class="col-sm-4"&gt;
     * &lt;div class="panel panel-default"&gt;
     * &lt;div class="img-bg"&gt;
     * &lt;img ng-src="{{::data.catItem.picture}}" class="img-responsive" /&gt;
     * &lt;/div&gt;
     * &lt;span class="cat-icon fa fa-stack fa-lg fa-3x hidden-xs"&gt;
     * &lt;i class="fa fa-circle fa-stack-2x text-success"&gt;&lt;/i&gt;
     * &lt;i class="fa fa-desktop fa-stack-1x fa-inverse"&gt;&lt;/i&gt;
     * &lt;/span&gt;
     * &lt;div class="panel-body"&gt;
     * &lt;p class="lead text-center"&gt;{{::data.catItem.name}}&lt;/p&gt;
     * &lt;ul class="list-unstyled"&gt;
     * &lt;li class="text-center" ng-if="::data.catItem.price"&gt;${Price}: {{::data.catItem.price}}&lt;/li&gt;
     * &lt;/ul&gt;
     * &lt;sp-model form-model="::data.catItem" mandatory="mandatory"&gt;&lt;/sp-model&gt;
     * &lt;p ng-if="c.req" class="text-center text-success"&gt;
     * ${Request created!} &lt;a href="?id={{c.req.page}}&amp;table={{c.req.table}}&amp;sys_id={{c.req.sys_id}}"&gt;{{c.req.number}}&lt;/a&gt;
     * &lt;/p&gt;
     * &lt;button ng-if="!c.req" class="btn btn-default btn-block" ng-click="c.getIt()"&gt;${Get it}&lt;/button&gt;
     * &lt;/div&gt;
     * &lt;/div&gt;
     * &lt;/div&gt;
     */
    getCatalogItem(sysId) {}
    /**
     * Returns a model and view model for a sc_cat_item or
     * sc_cat_item_guide.
     * @param {String} sysId The sys_id of the catalog item (sc_cat_item) or order guide
     * (sc_cat_item_guide).
     * @param {Boolean} isOrdering When true, uses create roles security check. When false, uses write roles
     * security check.When users are ordering an item or have it in their cart,  check
     * using the create roles.
     * If users are not ordering, for example, somebody is
     * looking at a requested item to see the variables associated with that item, then
     * check using the write roles.
     * @returns An object containing the catalog item variable model, view, sections, pricing,
     * and client scripts.
     */
    getCatalogItem(sysId, isOrdering) {}
    /**
     * Returns the display value of the specified field (if it exists and has a value) from
     * either the widget's sp_instance or the sp_portal
     * record.
     * @param {String} fieldName Name of the field
     * @returns The display value from either the sp_instance or
     * sp_portal record.
     * @example //Server script
     * (function() {
     * data.title = $sp.getDisplayValue("title");
     * data.catalog = $sp.getDisplayValue("sc_catalog");
     * })();
     * //HTML template
     * &lt;div&gt;
     * &lt;h1&gt;sp_instance.title: {{::data.title}}&lt;/h1&gt;
     * &lt;h1&gt;sp_portal.sc_catalog: {{::data.catalog}}&lt;/h1&gt;
     * &lt;/div&gt;
     */
    getDisplayValue(fieldName) {}
    /**
     * Returns information about the specified field in the specified GlideRecord.
     * @param {GlideRecord} gr The GlideRecord to check
     * @param {String} fieldName The field to find information for
     * @returns An object containing the field's label, value,  displayValue,  and type.
     * Returns null if the GlideRecord of field name are not valid, or if the field is not
     * readable.
     */
    getField(gr, fieldName) {}
    /**
     * Checks the specified list of field names, and returns an array of valid field
     * names.
     * @param {GlideRecord} gr The GlideRecord to check
     * @param {String} field A comma separated list of field names.
     * @returns An array of valid fields.
     */
    getFields(gr, field) {}
    /**
     * Checks the specified list of field names and returns an object of valid field
     * names.
     * @param {GlideRecord} gr The GlideRecord to check
     * @param {String} field A comma separated list of field names.
     * @returns An object containing valid field names.
     */
    getFieldsObject(gr, field) {}
    /**
     * Return the form.
     * @param {String} tableName The name of the table
     * @param {String} sysId The form's sys_id
     * @returns The form
     */
    getForm(tableName, sysId) {}
    /**
     * Returns KB articles in the specified category and its subcategories.
     * @param {String} sys_id Sys_id of the KB article category.
     * @param {Number} limit Maximum number of KB articles returned.
     * @returns The articles within the category and its subcategories with:
     * A workflow_state of
     * published.
     * A valid_to date greater than or equal to the current
     * date.
     * 
     * @example //Server script
     * (function() {
     * data.kbs = $sp.getKBCategoryArticles("0ac1bf8bff0221009b20ffffffffffec", 5);
     * })();
     * //HTML template
     * &lt;div&gt;
     * articles: {{::data.kbs}}
     * &lt;/div&gt;
     * 
     */
    getKBCategoryArticles(sys_id, limit) {}
    /**
     * Returns Knowledge Base article summaries in the specified category and its
     * subcategories.
     * @param {String} sys_id Sys_id of the KB article category.
     * @param {Number} limit Maximum number of KB articles returned.
     * @param {Number} maxChars Maximum number of characters to return from the article text. For full article
     * text, set the value to -1.
     * @returns The articles within the category and its subcategories with:
     * A workflow_state of
     * published.
     * A valid_to date greater than or equal to the current
     * date.
     * 
     * @example //Server script
     * (function() {
     * data.summary = $sp.getKBCategoryArticleSummaries("0ac1bf8bff0221009b20ffffffffffec", 5, 200);
     * })();
     * //HTML template
     * &lt;div&gt;
     * articles: {{::data.summary}}
     * &lt;/div&gt;
     * 
     */
    getKBCategoryArticleSummaries(sys_id, limit, maxChars) {}
    /**
     * Returns the number of articles in the defined Knowledge Base.
     * @param {String} sys_id Sys_id of a Knowledge Base record.
     * @returns Number of knowledge articles in the defined Knowledge Base with:
     * A workflow_state of
     * published.
     * A valid_to date greater than or equal to the current
     * date.
     * 
     * @example //Server script
     * (function() {
     * data.count = $sp.getKBCount("a7e8a78bff0221009b20ffffffffff17");
     * })();
     * //HTML template
     * &lt;div&gt;
     * articles: {{::data.count}}
     * &lt;/div&gt;
     * 
     */
    getKBCount(sys_id) {}
    /**
     * Returns a list of the specified table's columns in the specified view.
     * @param {String} tableName Name of the table
     * @param {String} view The view by which to filter the columns
     * @returns An object containing the column names.
     */
    getListColumns(tableName, view) {}
    /**
     * Returns the (?id=) portion of the URL based on the sp_menu type.
     * @param {GlideRecord} page The page
     * @returns The href portion of the URL.
     */
    getMenuHREF(page) {}
    /**
     * Returns an array of menu items for the specified instance.
     * @param {String} sysId sysId of the instance
     * @returns Menu items for the specified instance
     */
    getMenuItems(sysId) {}
    /**
     * Returns the value of the specified parameter.
     * @param {String} name The name of the key from the query string or post body.
     * @returns Returns the specified parameter as an object. Returns null if there is no
     * request, JSON request, or widget.
     */
    getParameter(name) {}
    /**
     * Returns the portal's GlideRecord.
     * @returns The portal record
     * @example //Server script
     * (function() {
     * var portalGr = $sp.getPortalRecord();
     * data.logo = portalGr.getDisplayValue("logo");
     * data.homepage = portalGr.getDisplayValue("homepage.id");
     * })();
     * //HTML template
     * &lt;div&gt;
     * &lt;img ng-src="{{::c.data.logo}}" /&gt;
     * &lt;a href="?id={{::c.data.homepage}}"&gt;Click here to go home&lt;/a&gt;
     * &lt;/div&gt;
     */
    getPortalRecord() {}
    /**
     * Returns the current portal context.
     * @returns The sp_portal record of the current portal context or null. Returns null if the
     * widget is embedded by another widget.
     * @example //Server script
     * (function(){
     * var gr = $sp.getRecord();
     * data.tableLabel = gr.getLabel();
     * })();
     * //HTML template
     * &lt;div class="panel-heading"&gt;
     * &lt;h4 class="panel-title"&gt;${{{data.tableLabel}} details}&lt;/h4&gt;
     * &lt;/div&gt;
     */
    getRecord() {}
    /**
     * Copies display values for the specified fields into the data parameter.
     * @param {Object} data The display values for the specified fields are copied to this object.
     * @param {GlideRecord} from The GlideRecord to process.
     * @param {String} names A comma-separated list of field names.
     * @returns Method does not return a value
     */
    getRecordDisplayValues(data, from, names) {}
    /**
     * For the specified fields, copies the element's name, display value, and value into the
     * data parameter.
     * @param {Object} data The element's name, display value, and value for the specified fields are
     * copied to this object.
     * @param {GlideRecord} from The GlideRecord to process.
     * @param {String} names A comma-separated list of field names.
     * @returns Method does not return a value
     */
    getRecordElements(data, from, names) {}
    /**
     * Copies values for the specified field names from the GlideRecord into the data
     * parameter.
     * @param {Object} data The value for the specified fields are copied to this object.
     * @param {GlideRecord} from The GlideRecord to process.
     * @param {String} names A comma-separated list of field names.
     * @returns Method does not return a value
     */
    getRecordValues(data, from, names) {}
    /**
     * Returns an array of Service Catalog variables associated
     * with a record.
     * @param {GlideRecord} gr The record to retrieve Service Catalog variables
     * for. Must be a record with Service Catalog variables
     * defined, such as a requested item [sc_req_item] record or an incident submitted
     * through a record producer.
     * @param {Boolean} includeNilResponses Optional parameter. If true, variables with no user-defined value are included
     * in the array.
     * @returns Array of Service Catalog variables
     * associated with the record.
     * @example //Server script
     * (function() {
     * var itemsGR = new GlideRecord("sc_req_item");
     * itemsGR.get('585d1bc44f4f13008a959a211310c77d');
     * data.scVars = $sp.getRecordVariablesArray(itemsGR);
     * })();
     * //HTML template
     * &lt;div&gt;
     * Requested item variables: {{::data.scVars}}
     * &lt;/div&gt;
     */
    getRecordVariablesArray(gr, includeNilResponses) {}
    /**
     * Gets the activity stream for the specified record. This method works on tables that
     * extend the task table.
     * @param {String} table The table name
     * @param {String} sysID The sys_id of the record
     * @returns If a table extending the task table is specified, contains the display_value,
     * sys_id, short_description,number, entries, user_sys_id, user_full_name, user_login,
     * label, table, and journal_fields properties; otherwise contains the table and sys_id
     * properties.Note: The user_login property contains the User ID of the current user.
     * The user_sys_id and iser_full_name properties reference the creator of the queried
     * record.
     */
    getStream(table, sysID) {}
    /**
     * Returns the user's initials.
     * @returns The user's initials
     */
    getUserInitials() {}
    /**
     * Returns the value of the specified parameter.
     * @param {String} name Name of the parameter
     * @returns Value of the specified parameter. Null if the request does not exist or has no
     * such parameter, the rectangle does not exist or has no such parameter, or the portal
     * is null or has no such parameter.
     * @example //Server script
     * (function() {
     * data.title = $sp.getValue("title");
     * data.catalog = $sp.getValue("sc_catalog");
     * })();
     * //HTML templage
     * &lt;div&gt;
     * &lt;h1&gt;sp_instance.title: {{::data.title}}&lt;/h1&gt;
     * &lt;h1&gt;sp_portal.sc_catalog: {{::data.catalog}}&lt;/h1&gt;
     * &lt;/div&gt;
     */
    getValue(name) {}
    /**
     * Copies values from the request or instance to the data parameter.
     * @param {Object} data Receives the parameter values.
     * @param {String} names Comma-separated string of field names.
     * @returns Method does not return a value
     */
    getValues(data, names) {}
    /**
     * Gets a widget by id or sys_id, executes that widget's server script using the provided
     * options, then returns the widget model.
     * @param {String} sysID The widget sys_id or widget_id
     * @param {Object} options An object to pass to the widget's server script. Refer to this object as
     * options in your server script.Note: Any options passed into this
     * function will only be available in the embedded widget's server script on the
     * first execution of that script. Any subsequent calls into
     * the server script from the embedded widget will not contain the object properties
     * passed in.
     * @returns A widget model to be used with sp-widget.
     * @example //Server script
     * data.myWidget = $sp.getWidget('widget_id', {p1: param1, p2: param2});
     * //HTML
     * &lt;sp-widget widget="c.data.myWidget"&gt;&lt;/sp-widget&gt;
     */
    getWidget(sysID, options) {}
    /**
     * Transforms a URL requesting a list or form in the platform UI into the URL of the
     * corresponding id=list or id=form Service Portal
     * page.
     * @param {String} url Platform UI URL
     * @returns Transformed Service Portal URL.If the passed-in URL does not request a list
     * or a form in the platform UI, a null value is returned.
     * @example GlideSPScriptable().mapUrlToSPUrl("http://demo.service-now.com/task_list.do?sysparm_userpref_module=1523b8d4c611227b00be8216ec331b9a&amp;sysparm_query=assigned_to=javascript:getMyAssignments()&amp;sysparm_clear_stack=true"))
     * @example GlideSPScriptable().mapUrlToSPUrl("incident.do?sys_id=12bc12bc12bc12bc12bc12bc12bc12bc")
     */
    mapUrlToSPUrl(url) {}
}
//addons
const $sp = new GlideSPScriptable();