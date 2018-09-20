//defer condition.js
var MAIN_LAYER = "filterdiv";
var TEXTQUERY = "123TEXTQUERY321";
var PLACEHOLDER = "123PLACEHOLDER321";
var PLACEHOLDERFIELD = '-- choose field --';
var DEFAULT_NAME = "report";
var DEFAULT_WIDTH = "10px";
var DEFAULT_BORDER = 0;
var JS_GS = 'javascript:gs.';
var useTextareas = false;
var noConditionals = false;
var noOps = false;
var noSort = false;
var gotShowRelated = false;
var gotoPart = false;
var calendars = 0;
var refcount = 0;
var sortIndex = 0;
var queryNumber = 0;
var calendarPopups = [];
var filter;
var orderBy;
var columns = null;
var currentTable = '';
var firstTable = '';
var oldStatus = '';
var showRelated = '';
var filterExpanded = false;
var queueTables = new Array();
var queueFilters = new Array();
var queueColumns = new Array();
var operators = [ "BETWEEN", "!=", ">=", "<=", "=", ">", "<", "NOT IN", "IN", "NOT LIKE", "LIKE", "ON", "NOTON", "DATEPART",
"RELATIVE", "STARTSWITH", "ENDSWITH", "ISEMPTY", "ISNOTEMPTY", "INSTANCEOF", "ANYTHING", "MATCH_PAT", "MATCH_RGX"];
var dateTypes = new Array();
dateTypes['glide_date_time'] = 1;
dateTypes['glide_date'] = 1;
dateTypes['date'] = 1;
dateTypes['datetime'] = 1;
dateTypes['due_date'] = 1;
var dateOnlyTypes = new Object();
dateOnlyTypes['glide_date'] = 1;
dateOnlyTypes['date'] = 1;
var dateTimeTypes = new Object();
dateTimeTypes['glide_date_time'] = 1;
dateTimeTypes['datetime'] = 1;
dateTimeTypes['due_date'] = 1;
var numericTypes = new Array();
numericTypes['integer'] = 1;
numericTypes['decimal'] = 1;
numericTypes['numeric'] = 1;
numericTypes['float'] = 1;
numericTypes['domain_number'] = 1;
var opersNS = {};
opersNS.opdef = {
    'af'  : [ '>',          'after'              ],
    'any' : [ 'ANYTHING',   'is anything'        ],
    'are' : [ '=',          'are'                ],
    'asc' : [ 'ascending',  'a to z'             ],
    'avg' : [ 'avg',        'average'            ],
    'bf'  : [ '<',          'before'             ],
    'btw' : [ 'BETWEEN',    'between'            ],
    'dsc' : [ 'descending', 'z to a'             ],
    'dtpt': [ 'DATEPART',   'trend'              ],
    'em'  : [ 'ISEMPTY',    'is empty'           ],
    'enwt': [ 'ENDSWITH',   'ends with'          ],
    'eq'  : [ '=',          'is'                 ],
    'gt'  : [ '>',          'greater than'       ],
    'gteq': [ '>=',         'greater than or is' ],
    'inna': [ 'IN',         'is one of'          ],
    'inst': [ 'INSTANCEOF', 'is a'               ],
    'lk'  : [ 'LIKE',       'contains'           ],
    'lt'  : [ '<',          'less than'          ],
    'lteq': [ '<=',         'less than or is'    ],
    'max' : [ 'max',        'maximum'            ],
    'min' : [ 'min',        'minimum'            ],
    'mpat': [ 'MATCH_PAT',  'matches pattern'    ],
    'mreg': [ 'MATCH_RGX',  'matches regex'      ],
    'ntem': [ 'ISNOTEMPTY', 'is not empty'       ],
    'nteq': [ '!=',         'is not'             ],
    'ntin': [ 'NOT IN',     'is not one of'      ],
    'ntlk': [ 'NOT LIKE',   'does not contain'   ],
    'nton': [ 'NOTON',      'not on'             ],
    'on'  : [ 'ON',         'on'                 ],
    'oper': [ '-- oper --', '-- oper --'         ],
    'rltv': [ 'RELATIVE',   'relative'           ],
    'snc' : [ 'SINCE',      'since baseline'     ],
    'stwt': [ 'STARTSWITH', 'starts with'        ],
    'sum' : [ 'sum',        'Total'              ]
};
opersNS.compile = function() {
    for (var fieldType in sysopers) {
        var proto = sysopers[fieldType];
        if (proto.charAt(0) == '=')
            continue;
        var opers = proto.split(/ +/);
        var opArray = [];
        for (var i = 0; i < opers.length; i++) {
            var oper = opers[i];
            if (oper)
                opArray.push(opersNS.opdef[oper]);
        }
        sysopers[fieldType] = opArray;
    }
    for (var fieldType in sysopers) {
        var proto = sysopers[fieldType];
        if (typeof proto != 'string')
            continue;
        sysopers[fieldType] = sysopers[proto.substring(1)];
    }
}
var sysopers = {
    'aggspec'             : 'sum  avg  min  max  any  ',
    'boolean'             : 'eq   nteq em   ntem any  ',
    'calendar'            : 'on   nton bf   af   btw  dtpt rltv snc  em   ntem any  ',
    'choice'              : 'eq   nteq inna ntin lk   stwt enwt ntlk any  ',
    'composite_name'      : '=string',
    'conditions'          : '=string',
    'decimal'             : '=integer',
    'default'             : 'eq   nteq any  ',
    'email'               : '=string',
    'email_script'        : '=string',
    'field_name'          : '=string',
    'glide_duration'      : '=integer',
    'glide_list'          : 'lk   ntlk em   ntem ',
    'GUID'                : '=string',
    'html'                : 'lk   ntlk em   ntem any  ',
    'integer'             : 'eq   nteq em   ntem lt   gt   lteq gteq any  ',
    'integer_choice'      : 'eq   nteq inna ntin em   ntem lt   gt   lteq gteq any  ',
    'journal'             : '=script',
    'journal_input'       : '=script',
    'keyword'             : 'are  ',
    'multi_two_lines'     : '=string',
    'ph_number'           : '=string',
    'placeholder'         : 'oper ',
    'reference'           : 'eq   nteq em   ntem stwt enwt lk   ntlk any  ',
    'replication_payload' : '=string',
    'script'              : 'lk   ntlk any  ',
    'script_plain'        : '=script',
    'sortspec'            : 'asc  dsc  ',
    'string'              : 'stwt enwt lk   ntlk eq   nteq em   ntem mpat mreg any  inna',
    'string_choice'       : '=choice',
    'string_clob'         : 'lk   ntlk stwt enwt em   ntem any  ',
    'string_numeric'      : 'eq   nteq lk   ntlk stwt enwt btw  any  ',
    'sys_class_name'      : 'eq   nteq inst any  ',
    'table_name'          : '=string',
    'timer'               : '=integer',
    'translated_field'    : '=string',
    'translated_html'     : '=html',
    'translated_text'     : '=string',
    'url'                 : '=string',
    'xml'                 : '=html'
};
opersNS.compile();
var extopers = {};
extopers['MATCH_PAT'] = true;
extopers['MATCH_RGX'] = true;
var calNS = {};
calNS.protoVal = [
    'Today: [0d   ]0d  ]0d  ',
    'Yesterday: [1d   ]1d  ]1d  ',
    'Tomorrow: [-1d  ]-1d ]-1d ',
    'This week: [=w   ]=w  ]=w  ',
    'Last week: [<w   ]<w  ]<w  ',
    'Next week: [>w   ]>w  ]>w  ',
    'This month: [=m   ]=m  ]=m  ',
    'Last month: [<m   ]<m  ]<m  ',
    'Next month: [>m   ]>m  ]>m  ',
    'Last 3 months: [3m   ]=m  [3m  ',
    'Last 6 months: [6m   ]=m  [6m  ',
    'Last 9 months: [9m   ]=m  [9m  ',
    'Last 12 months: [12m  ]=m  [12m ',
    'This quarter: [=q   ]=q  ]=q  ',
    'Last quarter: [1q   ]1q  ]1q  ',
    'Last 2 quarters: [1q   ]=q  ]2q  ',
    'This year: [=y   ]=y  ]=y  ',
    'Next year: [>y   ]>y  ]>y  ',
    'Last year: [<y   ]<y  ]<y  ',
    'Last 2 years: [<y   ]=y  [<y  ',
    'Last 7 days: [7d   ]0d  [7d  ',
    'Last 30 days: [30d  ]0d  [30d ',
    'Last 60 days: [60d  ]0d  [60d ',
    'Last 90 days: [90d  ]0d  [90d ',
    'Last 120 days: [120d ]0d  [120d',
    'Current hour: [0h   ]0h  ]0h  ',
    'Last hour: [1h   ]1h  ]1h  ',
    'Last 2 hours: |2h   |0h  |2h  ',
    'Current minute: [0n   ]0n  ]0n  ',
    'Last minute: [1n   ]1n  [1n  ',
    'Last 15 minutes: [15n  ]0n  [15n ',
    'Last 30 minutes: [30n  ]0n  [30n ',
    'Last 45 minutes: [45n  ]0n  [45n ',
    'One year ago: |12m  ]=m  |12m '
    ];
calNS.agoUnits = {
    d: 'days',
    m: 'months',
    q: 'quarters',
    h: 'hours',
    n: 'minutes'
};
calNS.agoStartEnd = {
    '[':'Start',
    ']':'End',
    '|':''
};
calNS.ofUnits = {
    w: 'Week',
    m: 'Month',
    q: 'Quarter',
    y: 'Year'
};
calNS.ofBeginningEnd = {
    '[':'beginning',
    ']':'end',
    '|':''
};
calNS.ofWhich = {
    '<':'Last',
    '=':'This',
    '>':'Next'
};
calNS.compileCal = function compileCal() {
    var result = [];
    for (var i = 0; i < calNS.protoVal.length; i++) {
        var proto = calNS.protoVal[i];
        var parts = /^(.*?)\: *([^ ]*) *([^ ]*) *([^ ]*) *$/.exec(proto);
        var row = [];
        row.push(parts[1]);
        for (var j = 2; j <= 4; j++)
            row.push(encode(parts[j]));
        result.push(row);
    }
    result.BETWEEN = ['Now', JS_GS + 'nowNoTZ()', JS_GS + 'nowNoTZ()'];
    result.RELATIVE = [
    [ 'on or after',  'GE' ],
    [ 'on or before', 'LE' ],
    [ 'after',        'GT' ],
    [ 'before',       'LT' ],
    [ 'on',           'EE' ] ];
    result.TRENDVALUES = [
    [ 'Hours',    'hour'      ],
    [ 'Minutes',  'minute'    ],
    [ 'Days',     'dayofweek' ],
    [ 'Months',   'month'     ],
    [ 'Quarters', 'quarter'   ],
    [ 'Years',    'year'      ] ];
    result.WHEN = [
    [ 'ago',      'ago'  ],
    [ 'from now', 'ahead'] ];
    result.DATEPART = compileDatePart();
    return result;
    function encode(part) {
        var parts = /^([\[\]\|])([\-0-9]+)([dmqhn])$/.exec(part);
        return parts ?
        JS_GS + calNS.agoUnits[parts[3]] + 'Ago' + calNS.agoStartEnd[parts[1]] + '(' + parts[2] + ')' :
        JS_GS + calNS.ofBeginningEnd[part.charAt(0)] + 'Of' + calNS.ofWhich[part.charAt(1)] +
        calNS.ofUnits[part.charAt(2)] + '()';
    }
    function compileDatePart() {
        var result = [];
        compileDaysOfWeek(result);
        compileMonths(result);
        compileQuarters(result);
        compileYears(result);
        compileWeeks(result);
        compileHours(result);
        return result;
        function compileDaysOfWeek(result) {
            var dow = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (var i = 0; i < dow.length; i++)
                result.push([dow[i], JS_GS + "datePart('dayofweek','" + dow[i].toLowerCase() + "')"]);
        }
        function compileMonths(result) {
            var ml = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            var ms = ['jan','feb','mar','apr','may','june','july','aug','sep','oct','nov','dec'];
            for (var i = 0; i < ml.length; i++)
                result.push([ml[i], JS_GS + "datePart('month', '" + ms[i] + "')"]);
        }
        function compileQuarters(result) {
            for (var i = 1; i <= 4; i++)
                result.push(['Quarter ' + i, JS_GS + "datePart('quarter','" + i + "')"]);
        }
        function compileYears(result) {
            for (var i = 2000; i <= 2012; i++)
                result.push(['' + i, JS_GS + "datePart('year','" + i + "')"]);
        }
        function compileWeeks(result) {
            for (var i = 0; i <= 52; i++)
                result.push(['Week ' + i, JS_GS + "datePart('week','" + i + "')"]);
        }
        function compileHours(result) {
            for (var i = 0; i < 24; i++) {
                var hr = (i == 0) ? 'Midnight' : ((i < 12) ? '' + i + ' am' : ((i == 12) ? 'Noon' : '' + (i - 12) + ' pm'));
                result.push([hr, JS_GS + "datePart('hour', '" + i + "')"]);
            }
        }
    }
}
var sysvalues = {};
sysvalues['boolean']        = [[ "true", "true" ], [ "false",  "false" ]];
sysvalues['string_boolean'] = [[ "1", "true" ], [ "0",  "false" ]];
sysvalues['calendar']       = calNS.compileCal();
var MESSAGES_CONDITION_RELATED_FILES = ['lowercase_fields','Keywords','Show Related Fields','Remove Related Fields', '-- choose field --', '-- value --', '-- None --'];
var g_current_table = '';
var g_filter_extension_map = new Object();
function deleteFilterByID(tablename, id) {
    var td = getThing(tablename, id);
    deleteTD(tablename, td);
    _frameChanged();
}
function deleteTD(tableName, butTD) {
    var butTR = butTD.parentNode;
    if (butTR.conditionObject)
        butTR.conditionObject.remove();
    else {
        var parent = butTR.parentNode;
        if (parent.conditionObject) {
            parent.conditionObject.remove();
        }
    }
}
function sortByFilter(item) {
    return item.canSort();
}
function seeIfItHasFilters(name) {
    var noItemsDiv = getThing(name, 'nofilteritems');
    if (noItemsDiv) {
        var fs = getThing(name,'gcond_filters');
        if (fs && fs.hasChildNodes()) {
            noItemsDiv.style.display = "none";
        } else {
            noItemsDiv.style.display = "inline";
        }
    }
    var itemsActions = getThing(name, 'filteractions');
    if (itemsActions) {
        var fs = getThing(name, 'gcond_filters');
        if (fs && fs.hasChildNodes()) {
            itemsActions.style.display = "inline";
        } else {
            itemsActions.style.display = "none";
        }
    }
}
function displayGroupList(element, name, groupField, groupValue, groupQuery) {
    var form = getFormForElement(element);
    var query = getQueryForForm(form);
    var view = gel('sysparm_view');
    if (view != null)
        view = view.value;
    var gfilters = query.split("^");
    var filter = '';
    for (var i = 0; i < gfilters.length; i++) {
        var idx = gfilters[i].indexOf('GROUPBY');
        if (idx > -1)
            continue;
        idx = gfilters[i].indexOf('ORDERBY');
        if (idx > -1)
            continue;
        if (filter.length > 0 )
            filter += "^";
        filter += gfilters[i];
    }
    if (filter.length > 0 )
        filter += "^";
    filter += groupQuery; //groupField+'='+groupValue;
    for (var i = 0; i < gfilters.length; i++) {
        var idx = gfilters[i].indexOf('GROUPBY');
        if (idx > -1)
            continue;
        idx = gfilters[i].indexOf('ORDERBY');
        if (idx == -1)
            continue;
        if (filter.length > 0 )
            filter += "^";
        filter += gfilters[i];
    }
    var url = name + "_list.do?sysparm_query=" + filter;
    if (view != null && view.indexOf("rpt-") != 0)
        url = url + '&sysparm_view=' + view;
    window.location = url;
}
function getQueryForForm(form) {
    var elements = Form.getElements($(form));
    for (var i = 0; i < elements.length; i++) {
        var thisElement = elements[i];
        if (thisElement.id == 'sysparm_query' || thisElement.name == 'sysparm_query')
            return thisElement.value;
    }
    return '';
}
function getFilter(name, doEscape, fDiv) {
    var fullFilter = "";
    orderBy = "";
    var divName = "gcond_filters";
    if(fDiv != null)
        divName = fDiv + divName;
    var fDiv = getThing(name, divName);
    if (fDiv == null)
        return "";
    var fQueries = fDiv.getElementsByTagName("tr");
    for (var i = 0; i < fQueries.length; i++ ) {
        var queryTR = fQueries[i];
        if (queryTR.queryPart != 'true')
            continue;
        var queryID = queryTR.queryID;
        var query = getThing(name, queryID);
        filter = "";
        var queryString = getQueryString(query);
        if (fullFilter.length > 0 && queryString.length > 0)
            fullFilter += "^NQ";
        fullFilter = fullFilter + queryString;
    }
    if (fullFilter.length > 0)
        fullFilter += "^EQ";
    fullFilter += orderBy;
    filter = fullFilter;
    if (doEscape)
        filter = encodeURIComponent(filter);
    return filter;
}
function reconstruct(table,column) {
    if (!column)
        return column;
    if (column.indexOf("...")<0)
        return column;
    var ngfi = column.indexOf("...");
    var ngf = column.substring(0,ngfi);
    var te = new Table(table);
    var recon = ngf + "." + te.getDisplayName(ngf);
    return recon;
}
function getQueryString(query) {
    var tableTRs = query.getElementsByTagName("tr");
    for(var i = 0; i < tableTRs.length; i++) {
        var tr = tableTRs[i];
        if (!tr)
            continue;
        if (tr.basePart != 'true')
            continue;
        getQueryForTR(tr);
    }
    return filter;
}
function getQueryForTR(trItem) {
    var trs = trItem.getElementsByTagName("tr");
    for(var i = 0; i < trs.length; i++) {
        var tr = trs[i];
        var type = tr.varType;
        var field = getTDFieldValue(tr.tdField);
        if (field == PLACEHOLDER)
            continue;
        var oper = getSelectedOption(tr.operSel).value;
        if (!tr.sortSpec && !tr.aggSpec) {
            var val;
            if (tr.handler) {
                val = tr.handler.getValues();
                if (oper == 'SINCE')
                    oper = '>';
            }
            if (filter.length > 0)
                filter += "^";
            if (tr.gotoPart)
                filter += "GOTO";
            if (i != 0)
                filter += "OR";
            filter += field + oper + val;
            var ips = tr.getElementsByTagName("input");
            for(var ti = 0; ti < ips.length; ti++) {
                var iput = ips[ti];
                if (iput.type == "hidden" && iput.name == "subcon") {
                    filter += "^" + iput.jop + iput.field + iput.oper + iput.value;
                }
            }
        } else if (!tr.aggSpec) {
            if (oper == 'ascending') {
                orderBy += "^" + "ORDERBY" + field;
            }
            else if (oper == 'descending') {
                orderBy += "^" + "ORDERBYDESC" + field;
            }
        }
    }
}
function getTDFieldValue(td) {
    var fType = td.fieldType ? td.fieldType : "select";
    var tags = td.getElementsByTagName(fType);
    var field = tags[0];
    var input;
    if (fType == "select") {
        var options = field.options;
        if (field.multiple == true) {
            var retVal = new Array();
            for(var i = 0; i < options.length; i++) {
                if (options[i].selected)
                    retVal[retVal.length] = options[i].value;
            }
            return retVal.join(",");
        } else {
            return options[field.selectedIndex].value;
        }
    } else {
        input = field;
    }
    return input.value;
}
function refreshFilter(name) {
    var fDiv = getThing(name,'gcond_filters');
    var fQueries = fDiv.getElementsByTagName("tr");
    for (var i = 0; i < fQueries.length; i++ ) {
        var queryTR = fQueries[i];
        if (queryTR.queryPart != 'true')
            continue;
        var queryID = queryTR.queryID;
        var query = getThing(name, queryID);
        refreshQuery(query);
    }
}
function refreshQuery(query) {
    var tableTRs = query.getElementsByTagName("tr");
    for(var i = 1; i < tableTRs.length; i++) {
        var tr = tableTRs[i];
        if (!tr)
            continue;
        if (tr.basePart != 'true')
            continue;
        var fieldValue = tr.tdValue;
        refreshSelect(tr, fieldValue);
    }
}
function refreshSelect(tr, td) {
    if (typeof td == 'undefined')
        return;
    var fType = td.fieldType ? td.fieldType : "select";
    var tags = td.getElementsByTagName(fType);
    if (tags == null || tags.length == 0)
        return;
    var field = tags[0];
    if (fType == "select") {
        var options = field.options;
        if (field.multiple == true) {
            var choices = field.choices;
            choicesGet(tr.tableField, field, choices);
        }
    }
}
function getThing(table, name) {
    var thing = gel(table+name);
    if (thing != null)
        return thing;
    thing = gel(name);
    if (thing != null)
        return thing;
    if (table != null) {
        var fperiod = table.indexOf(".");
        if (fperiod > 0) {
            table = table.substring(fperiod+1);
            thing = gel(table+name);
        }
    }
    return thing;
}
function setup(name) {
    if (name == null || name == '') {
        name = firstTable;
        if (name == null || name == '') {
            alert("Choose a table before adding filters");
            return false;
        }
    }
    g_current_table = name;
    columns = queueColumns[name];
    if (columns == null) {
        var tname = (name.split("."))[0];
        columns = queueColumns[tname];
        if (columns == null) {
            columnsGet(name, setup);
            columns = queueColumns[tname];
            if (columns == null)
                return false;
        }
    }
    if (columns == null) {
        alert("Choose a table before adding filters");
        return false;
    }
    currentTable = name;
    return true;
}
function addFilter1(name, queryID) {
    addFilter(name, queryID);
}
function addFilterFor(name, isTableName, fDiv) {
    if (isTableName)
        addFilter(name, '', '', '', '', fDiv);
    else {
        var parts = name.split(".");
        var systable = parts[0];
        var sysfield = parts[2];
        var dep = gel(systable + '.' + sysfield);
        var table = null;
        if (dep != null && dep.tagName == 'SELECT' && getSelectedOption(dep).value)
            table = getSelectedOption(dep).value;
        else if (dep != null)
            table = dep.value;
        if (table != null) {
            addFilter(table+"."+parts[0]+"."+parts[1]);
        }
    }
}
function addFilter(tableName, queryID, fField, fOper, fValue, fDiv) {
    var row = addConditionSpec(tableName, queryID, fField, fOper, fValue, fDiv);
}
function addFirstLevelFields(s, target, fValue, filterMethod, fieldName, forFilter, onlyRestrictedFields) {
    var messages = new GwtMessage().getMessages(MESSAGES_CONDITION_RELATED_FILES);
    while (s.length > 0)
        s.remove(0);
    if (!gotShowRelated) {
        gotShowRelated = true;
        if (typeof g_filter_description != 'undefined')
            showRelated = g_filter_description.getShowRelated();
        else
            showRelated = getPreference("filter.show_related");
    }
    var placeholder = false;
    var selindex = 0;
    var indentLabel = false;
    var savedItems = new Object();
    var savedLabels = new Array();
    var labelPrefix = '';
    var headersAdded = false;
    var parts = target.split(".");
    var tableName = parts[0];
    var tableDef = getTableReference(tableName);
    var extension = '';
    var prefix = '';
    if (parts.length > 1 && parts[1] != null && parts[1] != '') {
        var o = null;
        if (filterExpanded && parts.length > 2) {
            var tableLabel = tableDef.getLabel();
            if (tableLabel == null)
                tableLabel = "Parent";
            o = addOption(s, tableDef.getName()+"...", tableLabel + " " + messages['lowercase_fields'], false);
            o.tableName = tableDef.getName();
            o.style.color = 'blue';
        }
        if (parts[1] == PLACEHOLDERFIELD) {
            o = addOption(s, PLACEHOLDER, messages['-- choose field --'], true);
            o.style.color = 'blue';
            o.tableName = tableDef.getName();
            o.fullLabel = messages['-- choose field --'];
            placeholder = true;
        }
        var sPeriod = "";
        var cname = '';
        for (var i = 1; i < parts.length-1; i++) {
            var f = parts[i];
            if (f == null || f == '')
                break;
            var elementDef = tableDef.getElement(parts[i]);
            if (elementDef == null)
                break;
            var childTable = tableName;
            if (elementDef.isReference()) {
                childTable = elementDef.getReference();
                if (elementDef.isExtensionElement())
                    extension = childTable;
                else
                    extension = '';
            } else {
                if (fieldName != null && fieldName.indexOf("...") > -1) {
                    childTable = parts[0];
                } else {
                    break;
                }
            }
            var parentTable = (extension != '')? extension:elementDef.getTable().getName();
            var tableDef = getTableReference(childTable, parentTable);
            if (cname.length)
                cname = cname + ".";
            cname += elementDef.getName();
            sPeriod = "." + sPeriod;
            var clabel =  sPeriod + elementDef.getLabel() + "-->" + elementDef.getRefLabel() + " " + messages['lowercase_fields'];
            o = addOption(s, cname+"...", clabel, false);
            o.tablename = tableDef.getName();
            o.style.color = 'blue';
            selindex++;
            indentLabel = true;
            headersAdded = true;
            if (labelPrefix.length)
                labelPrefix += ".";
            labelPrefix += elementDef.getLabel();
            if (prefix.length)
                prefix += ".";
            prefix += elementDef.getName();
        }
    }
    columns = tableDef.getColumns();
    queueColumns[tableDef.getName()] = columns;
    var textIndex = false;
    if (!noOps && !indentLabel) {
        var root = columns.getElementsByTagName("xml");
        if (root != null && root.length == 1) {
            root = root[0];
            textIndex = root.getAttribute("textIndex");
        }
    }
    var items = (extension != '')? tableDef.getTableElements(extension):tableDef.getElements();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (filterMethod != null) {
            if (filterMethod(item) == false) {
                continue;
            }
        }
        var t = item.getName();
        if (prefix != '')
            t = prefix + '.' + t;
        if (!noOps && item.getAttribute("filterable") == "no")
            continue;
        if (!item.canRead()) {
            if (t != fValue) {
                continue;
            } else {
                item.setCanRead('yes');
            }
        }
        if (!item.isActive()) {
            if (t != fValue) {
                continue;
            } else {
                item.setActive('yes');
            }
        }
        var label = item.getLabel();
        if (!elementDef || elementDef.getType() != "glide_var") {
            savedItems[label] = t;
            savedLabels[savedLabels.length] = label;
        }
        if (item.isReference() && !item.isRefRotated() && item.getType() != 'glide_list' && filterExpanded && showRelated == 'yes') {
            label += "-->" + item.getRefLabel();
            label += " " + messages['lowercase_fields'];
            t += "...";
            savedItems[label] = t;
            savedLabels[savedLabels.length] = label;
        }
    }
    items = tableDef.getExtensions();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var label = item.getLabel() + " (+)";
        t = item.getExtName() + "...";
        if (prefix != '')
            t = prefix + '.' + t;
        savedItems[label] = t;
        savedLabels[savedLabels.length] = label;
    }
    if (!onlyRestrictedFields && ((fValue == TEXTQUERY || textIndex) && filterMethod == null || forFilter)) {
        o = addOption(s, TEXTQUERY, messages['Keywords'], (fValue == TEXTQUERY));
        o.fullLabel = messages['Keywords'];
    }
    for (var i = 0; i < savedLabels.length; i++) {
        var sname = savedLabels[i];
        var o = addOption(s, savedItems[sname], sname, savedItems[sname] == fValue);
        o.tableName = tableDef.getName();
        if (labelPrefix != '')
            o.fullLabel = labelPrefix + "." + sname;
        else
            o.fullLabel = sname;
        if (indentLabel) {
            var yyy = o.innerHTML;
            o.innerHTML = "&nbsp;&nbsp;&nbsp;"+yyy;
        }
        var v = o.value;
        if (v.indexOf("...") != -1)
            if (o.fullLabel.indexOf("(+)") == -1)
                o.style.color = 'blue';
            else
                o.style.color = 'darkred';
    }
    if (filterExpanded  && !onlyRestrictedFields) {
        if (showRelated != 'yes') {
            var o = addOption(s, "...Show Related Fields...", messages['Show Related Fields'], false);
            o.style.color = 'blue';
        } else {
            var o = addOption(s, "...Remove Related Fields...", messages['Remove Related Fields'], false);
            o.style.color = 'blue';
        }
    }
    if (!placeholder && (s.selectedIndex == 0 && ((textIndex && fValue != TEXTQUERY) || headersAdded)))
        s.selectedIndex = selindex;
    if (s.selectedIndex >= 0) {
        fValue = getSelectedOption(s).value;
    }
    return s;
}
function updateSortFields(name, select) {
    if (setup(name) == false)
        return;
    name = currentTable;
    var o = getSelectedOption(select);
    var fieldName = o.value;
    name = name.split(".")[0];
    var idx = fieldName.indexOf("...");
    if (idx != -1) {
        var f = fieldName.substring(0, idx);
        if (f != name)
            f = name + "." + f;
        f = f + ".";
        addFirstLevelFields(select, f, '', null);
        return;
    }
    name = currentTable = getTableFromOption(o);
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        if (optionWasSelected(option)) {
            option.innerHTML = getNormalLabel(option);
            option.style.color = 'black';
            option.wasSelected = 'false';
            break;
        }
    }
    if (setup(name) == false)
        return;
    var tr = select.parentNode.parentNode;
    o.normalLabel = o.innerHTML;
    o.innerHTML = getFullLabel(o);
    o.style.color = 'green';
    o.wasSelected = 'true';
    select.style.width = "240px";
    return;
}
function updateFields(name, select, fOper, fValue, includeExtended) {
    if (!setup(name))
        return;
    name = currentTable;
    var o = getSelectedOption(select);
    var fieldName = o.value;
    name = name.split(".")[0];
    var idx = fieldName.indexOf("...");
    if (idx != -1) {
        if (fieldName == '...Show Related Fields...') {
            gotShowRelated = true;
            showRelated = 'yes';
            setPreference("filter.show_related", "yes");
        }
        if (fieldName == '...Remove Related Fields...') {
            gotShowRelated = true;
            showRelated = 'no';
            setPreference("filter.show_related", "no");
        }
        var f = fieldName.substring(0, idx);
        if (f != name)
            f = name + "." + f;
        f = f + ".";
        addFirstLevelFields(select, f, '', null, fieldName);
        return;
    }
    name = currentTable = getTableFromOption(o);
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        if (optionWasSelected(option)) {
            option.innerHTML = getNormalLabel(option);
            option.style.color = 'black';
            option.wasSelected = 'false';
            break;
        }
    }
    if (setup(name) == false)
        return;
    var tr = select.parentNode.parentNode;
    o.normalLabel = o.innerHTML;
    o.innerHTML = getFullLabel(o);
    o.style.color = 'green';
    o.wasSelected = 'true';
    select.style.width = "240px";
    buildFieldsPerType(name, tr, fieldName, fOper, fValue, includeExtended);
}
function buildFieldsPerType(tableName, tr, descriptorName, fOper, fValue, includeExtended) {
    var tableName = tableName.split(".")[0];
    var parts = descriptorName.split(".");
    descriptorName = parts[parts.length-1];
    var tableDef = getTableReference(tableName);
    if (tableDef == null)
        return;
    var type;
    var multi;
    var isChoice;
    var elementDef = tableDef.getElement(descriptorName);
    var msg = new GwtMessage();
    if (elementDef == null) {
        if (descriptorName != TEXTQUERY && descriptorName != PLACEHOLDER)
            return;
        if (descriptorName == TEXTQUERY) {
            type = 'keyword';
            multi = true;
            isChoice = false;
        } else {
            type = 'placeholder';
            multi = false;
            isChoice = false;
            fValue = msg.getMessage('-- value --');
        }
    } else {
        type = elementDef.getType();
        multi = elementDef.getMulti();
        isChoice = elementDef.isChoice();
        if (!elementDef.getBooleanAttribute("canmatch"))
            type = "string_clob";
    }
    var tdField = tr.tdField;
    var tdOperator = tr.tdOper;
    var tdValue = tr.tdValue;
    tr.varType = type;
    tr.gotoPart = gotoPart;
    if (tr.handler)
        tr.handler.destroy();
    tr.handler = null;
    if (tr.sortSpec == true) {
        tr.varType = 'sortspec';
        type = 'sortspec';
    } else if (tr.aggSpec == true) {
        tr.varType = 'aggspec';
        type = 'aggspec';
    }
    tr.tableField = tableName + "." + descriptorName;
    tdOperator.innerHTML = "";
    tdValue.innerHTML = "";
    if (type == "float")
        type = "integer";
    else if (type == 'domain_number')
        type = "integer";
    else if (type == "wide_text" || type == "ref_ext")
        type = "string";
    else if (dateTypes[type]) {
        type = "calendar";
        if (fValue && fValue.indexOf("datePart") > -1 )
            fOper = 'DATEPART';
        else if (fValue && (fValue.indexOf('getBaseFilter') > 0))
            fOper = "SINCE";
    }
    var operSel = addOperators(tdOperator, type, fOper, isChoice, includeExtended);
    tr.operSel = operSel;
    if (fOper == null && operSel)
        fOper = tdOperator.currentOper;
    if ((type == "boolean") || (type == 'string_boolean')) {
        tr.handler = new GlideFilterChoice(tableName, elementDef);
        var keys = new Array();
        for (var i =0; i< sysvalues[type].length; i++) {
            keys.push(sysvalues[type][i][0]);
        }
        var msg = new GwtMessage();
        var map = msg.getMessages(keys);
        for (var i =0; i < sysvalues[type].length; i++) {
            var v = sysvalues[type][i][0];
            sysvalues[type][i][1] = map[v];
        }
        tr.handler.setChoices(sysvalues[type]);
    } else if (type == 'calendar')
        tr.handler = new GlideFilterDate(tableName, elementDef);
    else if (type == "reference" || type == "glide_list")
        tr.handler = new GlideFilterReference(tableName, elementDef);
    else if (type == 'sortspec' || type == 'aggspec')
    {} // ignore
    else if (type == 'mask_code' || isChoice)
        tr.handler = new GlideFilterChoiceDynamic(tableName, elementDef);
    else if (type == 'glide_duration' || type == 'timer')
        tr.handler = new GlideFilterDuration(tableName, elementDef);
    else if (isFilterExtension(type))
        tr.handler = initFilterExtension(type, tableName, elementDef);
    else if ((multi == 'yes') && (useTextareas))
        tr.handler = new GlideFilterStringMulti(tableName, elementDef);
    else
        tr.handler = new GlideFilterString(tableName, elementDef);
    if (tr.handler)
        tr.handler.create(tr, fValue);
}
function isFilterExtension(type) {
    if (g_filter_extension_map[type])
        return true;
    return false;
}
function initFilterExtension(type, tableName, elementDef) {
    var o = g_filter_extension_map[type];
    return o.call(this, tableName, elementDef);
}
function resetMenuMulti(td, menu, multiple) {
    if (multiple == false) {
        var selected = 0;
        for(var i = 0; i < menu.options.length; i++) {
            if (menu.options[i].selected) {
                selected = i;
                break;
            }
        }
        menu.multiple = false;
        menu.selectedIndex = selected;
        menu.size = 1;
    } else {
        menu.options[menu.selectedIndex].selected = true;
        menu.multiple = true;
        menu.size = 4;
    }
}
function addTextInput(td, dValue, type) {
    var input = cel("input");
    if (type)
        input.type = type;
    if (td.parentNode.conditionObject)
        if (td.parentNode.conditionObject.isPlaceHolder())
            input.disabled = true;
    if (isMSIE) {
        input.onkeypress = function() {
            return enterKey(event)
        };
        if (isMSIE7 || isMSIE6)
            input.style.marginTop = "-1px";
    } else
        input.onkeypress =enterKey;
    td.fieldType = "input";
    if (dValue)
        input.value = dValue;
    input.className = "filerTableInput";
    input.title = 'input value';
    if (useTextareas) {
        input.style.width="80%";
        input.maxlength=80;
    }
    input.style.verticalAlign = "top";
    td.appendChild(input);
    return input;
}
function addTextArea(td, dValue) {
    if (!useTextareas)
        return addTextInput(td, dValue);
    var input = cel("textarea");
    td.fieldType = "textarea";
    if (dValue)
        input.value = dValue;
    input.className = "filerTableInput";
    input.title = 'input value';
    input.wrap="soft";
    input.rows=5;
    input.style.width="80%";
    input.maxlength=80;
    td.appendChild(input);
    return input;
}
function getTableFromOption(option) {
    var tableName = option.tableName || option.getAttribute('tableName');
    if (tableName === undefined || tableName == null || tableName == '' )
        tableName = "";
    return tableName;
}
function getFullLabel(option) {
    var answer = option.fullLabel || option.getAttribute('fullLabel');
    if (answer === undefined || answer == null || answer == '' )
        answer = "";
    return answer;
}
function getNormalLabel(option) {
    var answer = option.normalLabel || option.getAttribute('normalLabel');
    if (answer === undefined || answer == null || answer == '' )
        answer = "";
    return answer;
}
function optionWasSelected(option) {
    var answer = option.wasSelected || option.getAttribute('wasSelected');
    if (answer === undefined || answer == null || answer == '' )
        return false;
    if (answer == 'true')
        return true;
    return false;
}
function addFields(tableName, fValue, isSort, includeExtended) {
    setup(tableName);
    var s = _createFilterSelect();
    if (!isSort)
        s.onchange =  function() {
            updateFields(tableName, this, null, null, includeExtended);
        };
    else
        s.onchange =  function() {
            updateSortFields(tableName, this);
        };
    var sname = tableName.split(".")[0];
    if (fValue)
        sname = sname + "." + fValue;
    if (isSort) {
        addFirstLevelFields(s, sname, fValue, sortByFilter);
    } else {
        addFirstLevelFields(s, sname, fValue, null);
    }
    return s;
}
function addOperators(td, type, dValue, isChoice, includeExtended) {
    var msg = new GwtMessage();
    var s = _createFilterSelect("99");
    s.title = 'choose operator';
    if (td.parentNode.conditionObject)
        if (td.parentNode.conditionObject.isPlaceHolder())
            s.disabled = true;
    var opers;
    if (isChoice)
        opers = sysopers[type + "_choice"];
    if (!opers && sysopers[type])
        opers = sysopers[type];
    if (!opers)
        opers = sysopers['default'];
    if (noOps)
        dValue = '=';
    var keys = buildMap(opers, 1);
    map = msg.getMessages(keys);
    for(var ii=0; ii < opers.length; ii++) {
        var opInfo = opers[ii];
        if (opInfo[0] == 'SINCE') {
            var base = new GlideRecord('cmdb_baseline');
            base.query();
            if (!base.hasNext())
                continue;
        }
        if (!includeExtended && extopers[opInfo[0]])
            continue;
        addOption(s, opInfo[0], map[opInfo[1]], dValue && opInfo[0] == dValue);
    }
    if (dValue && getSelectedOption(s).value != dValue) {
        addOption(s, dValue, msg.getMessage(dValue));
        s.selectedIndex = s.length - 1;
    }
    td.fieldType = "select";
    td.currentOper = getSelectedOption(s).value;
    td.subType = type;
    td.appendChild(s);
    return s;
}
function getBaseLine(caller) {
    if (typeof g_filter_description != 'undefined'
        && typeof g_filter_description.getBaseLine() != 'undefined'
        && caller.getTableName() == 'cmdb_baseline'
        && caller.getEncodedQuery()
        && caller.orderByFields.length < 1
        && caller.displayFields.length < 1)
        return true;
    return false;
}
function addChoices(response, args) {
    if (!response)
        return;
    xml = response.responseXML;
    var msg = new GwtMessage();
    var input = args[0];
    var dValue = args[1];
    var defaultSelected = new Object();
    input.title = 'choose value';
    if (input.multiple == true) {
        var na = dValue.split(",");
        for(var i = 0; i < na.length; i++) {
            var str = na[i];
            defaultSelected[str] = str;
        }
    } else {
        defaultSelected[dValue] = dValue;
    }
    input.options.length = 0;
    if (xml) {
        var items = xml.getElementsByTagName("item");
        addOption(input, '', msg.getMessage('-- None --'), false);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var v = item.getAttribute("value");
            var l = item.getAttribute("label");
            addOption(input, v, l, defaultSelected[v]);
        }
    }
}
function buildMap(values, position) {
    var map = new Object();
    var keys = new Array();
    for (var i=0; i < values.length; i++) {
        var thisOp = values[i];
        var thisMsg = thisOp[position];
        keys.push(thisMsg);
    }
    return keys;
}
function resetFilters() {
    var t = getThing(currentTable,'gcond_filters');
    clearNodes(t);
}
function columnRequest(evt, x) {
    resetFilters();
    if (evt) {
        if (x) {
            if (x && x.options)
                g_filter_description.setMainFilterTable(getSelectedOption(x).value);
        } else
            g_filter_description.setMainFilterTable(getValue(evt));
    }
    if (g_filter_description.getMainFilterTable() == null || g_filter_description.getMainFilterTable() == "") {
        columns = null;
        return;
    }
    queueTables[g_filter_description.getMainFilterTable()] = g_filter_description.getMainFilterTable();
    queueFilters[g_filter_description.getMainFilterTable()] = null;
    currentTable = g_filter_description.getMainFilterTable();
    args = new Array(g_filter_description.getMainFilterTable());
    if (x) {
        conditionColumnResponse(evt, args);
    } else {
        columnsGet(g_filter_description.getMainFilterTable());
    }
}
function processQueue() {
    var x = queueTables;
    for (var i in x)
    {
        if (queueColumns[i] == null) {
            queueColumns[i] = "requested";
            columnsGet(x[i], processQueue);
        }
    }
}
function columnsGetWithFilter(mft, filter, nu) {
    queueFilters[mft] = filter;
    queueTables[mft] = mft;
    columnsGet(mft, nu);
}
function columnsGet(mft, nu) {
    loadFilterTableReference(mft);
    conditionColumnResponse(columns, mft, nu);
}
function loadFilterTableReference(mft) {
    var tablepart = mft.split(".")[0];
    currentTable = mft;
    if (typeof g_filter_description != 'undefined')
        if (g_filter_description.getMainFilterTable() == null || g_filter_description.getMainFilterTable() == "")
            g_filter_description.setMainFilterTable(mft);
    var tableDef = getTableReference(tablepart);
    var columns = tableDef.getColumns();
    queueColumns[mft] = columns;
    queueColumns[tablepart] = columns;
    return tableDef;
}
function getTableReference(tableName, parentTable) {
    if (firstTable == '')
        firstTable = tableName;
    return Table.get(tableName, parentTable);
}
function choicesGet(tableField, input, dValue) {
    var ajax = new GlideAjax('PickList');
    ajax.addParam('sysparm_chars', '*');
    ajax.addParam('sysparm_nomax', 'true');
    ajax.addParam('sysparm_name', tableField);
    ajax.getXML(addChoices, null, new Array(input, dValue));
}
function conditionColumnResponse(columns, tableName, mfunc) {
    decodeFilter(tableName);
    queueFilters[tableName] = null;
    seeIfItHasFilters(tableName);
    if (mfunc && (typeof mfunc != "undefined") && mfunc != "undefined") {
        mfunc(tableName);
    }
}
function decodeFilter(tableName) {
    currentTable = tableName;
    var query = queueFilters[tableName];
    queueFilters[tableName] = null;
    var fDiv = getThing(tableName,'gcond_filters');
    if (query == null) {
        query = fDiv.initialQuery;
        if (query != null && fDiv.filterObject != null) {
            var fo = fDiv.filterObject;
            if (fo.isQueryProcessed())
                return; // Filter already processed
        }
    }
    var runable = false;
    var defaultPH = true;
    var filterObject = fDiv.filterObject;
    if (filterObject) {
        runable = filterObject.isRunable();
        defaultPH = filterObject.defaultPlaceHolder;
    }
    var filterObject = new GlideFilter(tableName);
    filterObject.setRunable(runable);
    filterObject.setDefaultPlaceHolder(defaultPH);
    filterObject.setQuery(query);
}
function slushbucketDOMcheck() {
    var epObject; // epObject is used to lower the number of elements returned below
    if(epObject= gel("ep")) {
        var tdArr = epObject.getElementsByTagName("TD");
        for(var tdArrIndex = 0;
            tdArrIndex < tdArr.length;
            tdArrIndex++) {
            if (tdArr[tdArrIndex].className == "slushbody")
                return true;
        }
    }
    return false;
}
function listDOMcheck(el) {
    while (el) {
        el = findParentByTag(el, "div");
        if (!el)
            return null;
        if (el.id.endsWith(MAIN_LAYER))
            return el.id.substring(0, el.id.length - MAIN_LAYER.length);
    }
    return null;
}
function enterKey(event) {
    if (event.keyCode == 13 || event.keyCode == 3) {
        var timeout;
        if (slushbucketDOMcheck()) {
            timeout = "acRequest();";
        } else {
            var name = listDOMcheck(Event.element(getEvent(event)));
            if (name)
                timeout = "runFilter('" + name + "');";
        }
        if (timeout)
            setTimeout(timeout, 0);
        Event.stop(event);
        return false; //cancel the event
    }
    return true;
}
function _createFilterSelect(width, multi, size) {
    var s = cel('select');
    s.className = "filerTableSelect";
    s.title = "choose input";
    if (width)
        s.style.width = width + "px";
    if (multi)
        s.multiple = true;
    s.size = size || 1;
    s.valign = "top";
    s.style.verticalAlign="top";
    return s;
}
function _createFilterSelectForType(type, val) {
    var s = _createFilterSelect();
    for (var i = 0; i < sysvalues[type].length; i++) {
        var opInfo = sysvalues[type][i];
        addOption(s, opInfo[0], opInfo[1], val && opInfo[0] == val);
    }
    return s;
}