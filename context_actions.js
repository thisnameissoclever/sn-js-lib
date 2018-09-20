//defer context_actions.js
function columnSort(tableName, columnName, direction, evt) {
    if (!evt && gActiveContext)
        evt = gActiveContext.getFiringObject();
    var partialName = determinePartial(evt);
    var idx = tableName.indexOf(".");
    if (idx > -1) {
        columnName = tableName.substring(idx+1, tableName.length);
        tableName = tableName.substring(0, idx);
    }
    var list = GlideList.getByElement(getPartialSpan(partialName));
    var navigator = new GlideListNavigator(list);
    navigator.columnSort(tableName, columnName, direction, partialName);
}
function columnChart(tableName, columnName, type, newwindow) {
    var list = GlideList.getByListID(tableName);
    var query = list.getValue('sysparm_query');
    query = list.cleanQuery(query, true, true);
    if (type == null)
        type = 'bar';
    var parms = {};
    parms['sysparm_field'] = columnName;
    parms['sysparm_type'] = type;
    parms['sysparm_table'] = tableName;
    parms['sysparm_from_list'] = 'true';
    parms['sysparm_raw_title'] = 'Set name here...';
    parms['sysparm_chart_size'] = 'large';
    parms['sysparm_manual_labor'] = 'true';
    parms['sys_action'] = '';
    parms['sysparm_referring_url'] = '';
    parms['sysparm_query_encoded'] = '';
    var target = '';
    if (newwindow)
        target = '_blank';
    list.submit(parms, 'GET', 'sys_report_template.do', target);
}
function personalizeAggregate(listId, tableName, columnName, columnLabel) {
    var g = new GlideDialogWindow('Calculations');
    g.setTitle(columnLabel + ' (calculations)');
    g.setDialog('personalize_aggregate');
    g.setPreference("sysparm_list", tableName);
    g.setPreference("sysparm_list_element", columnName);
    var list = GlideList.getByListID(listId);
    var view = list.getValue('sysparm_view');
    if (!view)
        view = '';
    g.setPreference("sysparm_list_view", view);
    var collection = list.getValue('sysparm_collection');
    if (!collection)
        collection = '';
    g.setPreference("sysparm_list_parent", collection);
    var rel = list.getValue('sysparm_collection_relationship');
    if (!rel)
        rel = '';
    g.setPreference("sysparm_list_relationship", rel);
    g.render();
}
function switchView(type, tableName, viewName) {
    if (type == 'list')
        new GlideViewManager(tableName, viewName).refreshList();
    else
        new GlideViewManager(tableName, viewName).refreshDetail();
    return;
}
function filterInOut(listId, table, field, value, operator) {
    var list = GlideList.getByListID(listId);
    var term = field + QUERY_TERM_SEPERATOR + operator + QUERY_TERM_SEPERATOR +  value;
    var parms = {};
    parms['sysverb_addfilter'] = term;
    parms['sysparm_referring_url'] = '';
    parms['sys_action'] = 'sysverb_first';
    list.submit(parms);
}
function doActionListMenu(listId, id, sysId) {
    var form = getFormForList(listId);
    addInput(form, 'HIDDEN', 'sys_action', id);
    addInput(form, 'HIDDEN', 'sysparm_checked_items', sysId); // only one
    var ax = new ActionSecurity();
    if (!ax.execute(form))
        return false;
    form.submit();
}
function copyRowToClipboard(base, ref, sysId, view) {
    var url = base + "nav_to.do?uri=" + ref + ".do?sys_id=" + sysId;
    if (view)
        url += "%26sysparm_view=" + view;
    copyToClipboard(url);
}
function doUpdate(scope) {
    var name = gActiveContext.getTableName();
    var temp = name + '_update.do';
    var form = getControlForm(name);
    var msg = ['There are no rows selected', 'Update the entire list?', 'records'];
    var answer = new GwtMessage().getMessages(msg);
    if (scope == 'selected' && getChecked(form) == '') {
        alert(answer['There are no rows selected']);
        return;
    }
    form.action = temp;
    addInput(form, 'HIDDEN', 'sys_action', 'sysverb_multiple_update');
    addInput(form, 'HIDDEN', 'sysparm_multiple', 'true');
    addInput(form, 'HIDDEN', 'sysparm_nostack', 'yes');
    if (scope == 'selected')
        populateParmQuery(form, 'sys_idIN', 'NULL');
    else {
        if (!confirm(answer['Update the entire list?'] + " (" + form.sysparm_total_rows.value + " " + answer['records'] + ")")) {
            return;
        }
    }
    form.submit();
}
function contextAction(tableName, actionName) {
    var form = getControlForm(tableName);
    addInput(form, 'HIDDEN', 'sys_action', actionName);
    form.submit();
}
function contextConfirm(tableName, actionName) {
    var sysparm_rows = gel('sysparm_total_rows').value;
    var num_rows = parseInt(sysparm_rows);
    var sysparm_query = gel('sysparm_query');
    if (sysparm_query)
        sysparm_query = sysparm_query.value;
    else
        sysparm_query = '';
    var sysparm_view = getView(tableName);
    if (num_rows < g_export_warn_threshold) {
        var dialog = new GwtPollDialog(tableName, sysparm_query, sysparm_rows, sysparm_view, actionName);
        dialog.execute();
        return;
    }
    var dialog = new GwtExportScheduleDialog(tableName, sysparm_query, sysparm_rows, sysparm_view, actionName);
    dialog.execute();
}
function executeRecentSearch(searchTerm, url) {
    parent.document.getElementById('sysparm_search').value = unescape(searchTerm);
    window.open(url,'gsft_main');
    adjustSearch();
}
function getView(tableName) {
    var sysparm_view = '';
    if (checkIfActuallyReport()) {
        var form = getControlForm(tableName);
        if (form) {
            var temp = form['sysparm_view'];
            if (temp)
                sysparm_view = temp.value;
        }
    }
    if (sysparm_view != '')
        return sysparm_view;
    var sp = gel('sysparm_view');
    if (sp)
        sysparm_view = sp.value;
    return sysparm_view;
}
function copyToClipboard(str) {
    if (ie5) {
        var textArea = document.createElement("textarea");
        textArea.value = str;
        var CopiedText = textArea.createTextRange();
        CopiedText.execCommand("copy");
    } else {
        nonIECopy_clip(str);
    }
}
function nonIECopy_clip(meintext) {
    prompt("Because of a browser limitation the URL can not be placed directly in the clipboard.  Please use Ctrl-C to copy the data and escape to dismiss this dialog", meintext);
    return;
    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
    var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    if (!clip)
        return;
    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans)
        return;
    trans.addDataFlavor('text/unicode');
    var str = new Object();
    var len = new Object();
    var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    var copytext=meintext;
    str.data=copytext;
    trans.setTransferData("text/unicode",str,copytext.length*2);
    var clipid=Components.interfaces.nsIClipboard;
    if (!clip)
        return false;
    clip.setData(trans,null,clipid.kGlobalClipboard);
}
function moreActionDown(select, ref) {
    if (select.getAttribute('gsft_sec_check') == 'true')
        return;
    select.setAttribute('gsft_sec_check', 'true');
    var form = getFormForElement(select);
    var ax = new ActionSecurity();
    if (!ax.pruneSelect(select, form))
        return false;
}
function moreActionPicked(select, ref) {
    var form = getFormForElement(select);
    var index = select.selectedIndex;
    if (index > 0) {
        option = select.options[select.selectedIndex];
        if (!option.disabled && option.getAttribute("client") == "true") {
            var c = option.getAttribute("href");
            if (c) {
                try {
                    g_action_tableName = ref;
                    g_action_sysid = getChecked(form);
                    eval(c);
                } catch(e) { }
            }
        } else {
            if (option.value != '' && !option.disabled)
                gsftListSubmit(option, true);
        }
        select.selectedIndex = 0;
    }
}
function showQuickForm(id, action, width, height) {
    var form;
    var tableName;
    var srcElement;
    var keyset;
    if (window.lastEvent) {
        srcElement = getSrcElement(window.lastEvent);
        form = srcElement.form;
        if (srcElement.tagName == "SELECT") {
            var o = srcElement.options[srcElement.selectedIndex];
            tableName = o.getAttribute("table");
        } else
            tableName = srcElement.getAttribute("table");
        if ((action == undefined || action == '') && srcElement.value)
            action = srcElement.value;
        if (!form)
            keyset = g_list.getChecked();
        else
            keyset = getChecked(form);
        window.lastEvent = null; //explicitly clear for subsequent calls
    }
    if (tableName == undefined) {
        if (typeof(gcm) == 'undefined')
            gcm = crumbMenu;
        tableName = gcm.getTableName();
        form = getFormForList(tableName);
        if (typeof(rowSysId) != 'undefined')
            keyset = rowSysId;  //context menu, get right-clicked
        else
            keyset = getChecked(form); //list link, get checked
        gcm.setFiringObject(); //explicitly clear firing object for subsequent calls
    }
    if ( (!form && !tableName) || (!tableName && g_list))
        return;
    if (!keyset || keyset == '') {
        alert("No records selected");
        return;
    }
    var gForm = new GlideDialogForm("", tableName+"_update");
    if (width && height)
        gForm.setDialogSize(width, height);
    gForm.addParm('sysparm_view', id);
    gForm.setMultiple(form);
    gForm.addParm('sysparm_checked_items', "sys_idIN" + keyset);
    if (action && action != '')
        gForm.addParm('sysparm_action_name', action);
    gForm.render();
}
function personalizeResponses(id) {
    var parts = id.split('.');
    var mytable = parts[0];
    var myfield = parts[1];
    var myreferurl = document.getElementById('sysparm_this_url_enc');
    var url = "response_list.do?sysparm_name=" + mytable +
    "&sysparm_element=" + myfield +
    "&sysparm_target=" + id +
    "&sysparm_view=sys_response_tailor";
    if (myreferurl)
        url += "&sysparm_referring_url=" + myreferurl.value;
    self.location = url;
}
function personalizeChoices(id) {
    var mytable = id.split('.')[0];
    var mydependent = document.getElementById('ni.dependent_reverse.' + id);
    var url = new GlideURL("slushbucket_choice.do");
    url.addParam('sysparm_ref', id);
    url.addParam('sysparm_form', 'sys_choice');
    url.addParam('sysparm_dependent', (mydependent? mydependent.value : ""));
    url.addParam('sysparm_stack', 'no');
    if (mydependent != null) {
        var el = document.getElementsByName(mytable + "." + mydependent.value)[0];
        if (el != null) {
            var selectValue;
            if (el.options)
                selectValue = el.options[el.selectedIndex].value;
            else
                selectValue = el.value;
            url.addParam('sysparm_dependent_value', selectValue);
        }
    }
    self.location = url.getURL();
}
function personalizeControl(strIdent, id, query) {
    var url = 'sys_ui_list_control.do?sys_id=' + id;
    if (query && query != '')
        url += "&sysparm_query=" + query;
    window.location = url;
}
function personalizer(strIdent, strForm, strSysId) {
    var parentForm = getControlForm(strIdent);
    var form = document.forms['sys_personalize'];
    if (parentForm && parentForm['sysparm_collection_relationship'])
        addInput(form, 'HIDDEN', 'sysparm_collection_relationship', parentForm['sysparm_collection_relationship'].value);
    else
        addInput(form, 'HIDDEN', 'sysparm_collection_relationship', '');
    addInput(form, 'HIDDEN', 'sysparm_list', strIdent);
    addInput(form, 'HIDDEN', 'sysparm_form', strForm);
    addInput(form, 'HIDDEN', 'sysparm_sys_id', strSysId);
    if (parentForm && parentForm['sysparm_collection'])
        addInput(form, 'HIDDEN', 'sysparm_collection', parentForm['sysparm_collection'].value);
    form.submit();
}
function personalizeList(listId, tableName) {
    var parentForm = getFormForList(listId);
    var form = document.forms['sys_personalize'];
    if (parentForm && parentForm['sysparm_collection_relationship'])
        addInput(form, 'HIDDEN', 'sysparm_collection_relationship', parentForm['sysparm_collection_relationship'].value);
    else
        addInput(form, 'HIDDEN', 'sysparm_collection_relationship', '');
    addInput(form, 'HIDDEN', 'sysparm_list', tableName);
    addInput(form, 'HIDDEN', 'sysparm_form', 'list');
    if (parentForm && parentForm['sysparm_collection'])
        addInput(form, 'HIDDEN', 'sysparm_collection', parentForm['sysparm_collection'].value);
    else
        addInput(form, 'HIDDEN', 'sysparm_collection', '');
    form.submit();
}
function personalizeField(identifier, formName) {
    var form = document.forms['sys_personalize'];
    var fields = 'name.element.language';
    if (formName && formName.indexOf('sys_dictionary') == 0)
        fields = 'name.element';
    addQueryFilter(form, fields, identifier, '', formName);
    form.action = formName;
    form.submit();
}
function personalizeFields(identifier, formName) {
    var form = document.forms['sys_personalize'];
    addQueryFilter(form, 'name', identifier);
    form.action = formName;
    form.submit();
}
function personalizeSecurity(identifier, field_name) {
    var a = field_name.split('.');
    var g_dialog = new GlideDialogWindow('security_mechanic');
    g_dialog.setPreference('table_name', a[0]);
    g_dialog.setPreference('field_name', a[1]);
    g_dialog.setTitle('Security Mechanic');
    g_dialog.render();
}
function showDictionary(identifier, field_id) {
    var a = field_id.split('.');
    var g_dialog = new GlideDialogWindow('dictionary_viewer');
    g_dialog.setPreference('table_name', a[0]);
    g_dialog.setPreference('field_name', a[1]);
    g_dialog.setTitle('Dictionary Info: ' + field_id);
    g_dialog.render();
}
function listSecurity(identifier, field_name) {
    var form = document.forms['sys_personalize'];
    addQueryFilter(form, 'CALCULATED:SecurityQueryCalculator', field_name);
    form.action = "sys_security_acl_list.do";
    form.submit();
}
function listCollection(coll_table, coll_field, of_table, view_name) {
    var form = document.forms['sys_personalize'];
    addQueryFilter(form, 'CALCULATED:CollectionQueryCalculator', of_table + ',' + coll_field + ',' + view_name);
    addInput(form, 'HIDDEN', 'sysparm_domain_restore', 'false');
    form.action = coll_table + "_list.do";
    form.submit();
}
function showList(tableName, fields, ids) {
    if (!ids)
        ids = gActiveContext.getTableName();
    self.location = tableName + "_list.do?sysparm_query=" + addQueryFilter('', fields, ids, tableName);
}
function showItem(tableName, fields, ids, view) {
    if (!ids)
        ids = gActiveContext.getTableName();
    var url = tableName + ".do?sysparm_query=" + addQueryFilter('', fields, ids, tableName);
    if (typeof(view) != "undefined") {
        url += "&sysparm_view=" + view;
    }
    self.location = url;
}
function addQueryFilter(form, names, values, table, formName) {
    var tableName = table;
    if ((names == '' || names == null) || (values == '' || values == null))
        return;
    if (names.indexOf("CALCULATED") == 0) {
        var ec = "";
        if (names.indexOf("CollectionQueryCalculator") > 0)
            ec = collectionQueryCalculator(values);
        else
            ec = securityQueryCalculator(values);
        addInput(form, "HIDDEN", "sysparm_query", ec);
        addInput(form, "HIDDEN", "sysparm_query_encoced", ec);
        return;
    }
    var vNames = names.split(".");
    var vValues = values.split(".");
    if (names.indexOf("name.element") == 0) {
        if (vValues.length > 2) {
            var tableElement = TableElement.get(values);
            vValues[0] = tableElement.getTableName();
            vValues[1] = tableElement.getName();
        } else {
            var tableR = new Table(vValues[0]);
            var element = tableR.getElement(vValues[1]);
            var label = '';
            if (formName && formName.indexOf("sys_documentation") == 0)
                label = getTableLabel(tableR.getName(), element.getName());
            if (label == '' && element != null)
                vValues[0] = element.getTableName();
        }
    }
    if (names.indexOf("name.element.language") == 0) {
        vValues[2] = g_lang;
    }
    var query = new Array();
    for (var i = 0; i < vNames.length; i++) {
        if ("sys_choice" == tableName && "name" == vNames[i]) {
            var tables = choiceQueryCalculator(vValues[i]);
            query.push("nameIN" + tables.join(','));
        } else
            query.push(vNames[i] + "=" + vValues[i]);
    }
    if(tableName)
        return query.join('^');
    addInput(form, "HIDDEN", "sysparm_query", query.join('^'));
    addInput(form, "HIDDEN", "sysparm_query_encoded", query.join('^'));
}
function getTableLabel(tabel, element) {
    var ajax = new GlideAjax('ContextActionsAjax');
    ajax.addParam("sysparm_name", "getLabel");
    ajax.addParam("sysparm_type", tabel);
    ajax.addParam("sysparm_value", element);
    ajax.getXMLWait();
    return ajax.getAnswer();
}
function choiceQueryCalculator(tableName) {
    var tableDef = Table.get(tableName);
    var items = tableDef.getChoiceExtensions();
    var tables = new Array();
    tables.push(tableName);
    for (var i = 0; i < items.length; i++)
        tables.push(items[i].getName());
    return tables;
}
function collectionQueryCalculator(args) {
    var sa = args.split(",");
    var tableName = sa[0];
    var collField = sa[1];
    return buildQueryClause(tableName, collField);
}
function buildQueryClause(tableName, collField) {
    var tableDef = Table.get(tableName);
    var tables = tableDef.getTables();
    var result = new Array();
    result.push(collField);
    result.push("=");
    result.push(tableName);
    result.push("^OR");
    result.push(collField);
    result.push("IN");
    result.push(tables.join());
    return result.join("");
}
function securityQueryCalculator(values) {
    var sa = values.split(".");
    var fieldName = null;
    var tableName = sa[0];
    if (sa.length > 1)
        fieldName = sa[1];
    var allTables = new Array();
    allTables.push(tableName);
    var table = new Table(tableName);
    var element = table.getElement(fieldName);
    if(element != null && element.getTableName() != tableName)
        allTables.push(element.getTableName());
    allTables.push("*");
    var rules = getRules(allTables, fieldName);
    var rc = "nameIN" + rules.join();
    return rc;
}
function getRules(allTables, fieldName) {
    var rc = new Array();
    for (var x=0; x< allTables.length; x++) {
        var tableName = allTables[x];
        rc.push(tableName);
        if (fieldName != null) {
            rc.push(tableName + "." + fieldName);
            rc.push(tableName + ".*");
        }
    }
    return rc;
}