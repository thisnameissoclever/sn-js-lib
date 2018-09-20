//defer depends.js
function getNameFromElement(elementName) {
    var names = elementName.split(".");
    names = names.slice(1);
    return names.join(".");
}
function loadFilterColumns(fname, dependent) {
    var value = resolveDependentValue(fname, dependent);
    var names = fname.split(".");
    serverRequest("xmlhttp.do?sysparm_include_sysid=true&sysparm_processor=SysMeta&sysparm_table_name=false&sysparm_type=column&sysparm_nomax=true&sysparm_value=" + names[0], getFilterColumnsResponse, [fname, dependent]);
}
function getFilterColumnsResponse(evt, args) {
    var fname = args[0];
    var dep = args[1];
    var hinput = document.getElementById(fname);
    filterExpanded = true;
    var table = resolveDependentValue(fname, dep);
    var xfilter = unescape(hinput.value);
    var form = findParentByTag(hinput, "FORM");
    if (table)
        createCondFilter(table + "." + fname, xfilter, fname);
}
function onSelChange(elementName) {
    var vName = "ni.dependent." + getNameFromElement(elementName);
    var eDeps = document.getElementsByName(vName);
    jslog("*************---->" + eDeps.length);
    for(var i = 0; i < eDeps.length; i++) {
        var eDep = eDeps[i];
        if (eDep == null)
            continue;
        var f = eDep.attributes.getNamedItem('onDependentChange');
        if (f) {
            eval(f.nodeValue);
            continue;
        }
        var name = eDep.value;
        var eChanged = gel(elementName);
        var value;
        if (eChanged.options) {
            var selected = eChanged.selectedIndex;
            value = eChanged.options[selected].value;
        } else
            value = eChanged.value;
        var retFunc = selResponse;
        var ajax = new GlideAjax("set_from_attributes");
        var argCnt = 0;
        for (var ac = 0; ac < eDep.attributes.length; ac++) {
            var itemName = eDep.attributes[ac].name;
            if (itemName.substring(0, 7).toLowerCase() == "sysparm") {
                var pvalue = eDep.attributes[ac].value;
                ajax.addParam(itemName, pvalue);
                argCnt++;
            } else if (itemName == "function") {
                var fdef = eDep.attributes[ac].value;
                var index = fdef.indexOf("(");
                if (index == -1)
                    retFunc = eval(eDep.attributes[ac].value);
                else
                    retFunc = fdef;
            }
        }
        if (argCnt == 0)
            continue;
        ajax.addParam("sysparm_value", value);
        ajax.addParam("sysparm_name", name);
        ajax.addParam("sysparm_chars", "*");
        ajax.addParam("sysparm_nomax", "true");
        ajax.getXML(retFunc, null, eChanged);
    }
}
function selResponse(request) {
    if (!request || !request.responseXML)
        return;
    var e = request.responseXML.documentElement;
    var elementName = e.getAttribute("sysparm_name");
    var processorName = e.getAttribute("sysparm_processor");
    var defaultOption = e.getAttribute("default_option");
    var selectedItem = e.getAttribute("select_option");
    var select = gel(elementName);
    var currentValue = select.value;
    select.options.length = 0;
    if (processorName == "PickList")
        appendSelectOption(select, "", document.createTextNode((defaultOption? defaultOption : new GwtMessage().getMessage('-- None --'))));
    var items = request.responseXML.getElementsByTagName("item");
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var t = item.getAttribute("value");
        var label = item.getAttribute("label");
        var opt = appendSelectOption(select, t, document.createTextNode(label));
        if (selectedItem && label == selectedItem)
            opt.selected = true;
        else if (currentValue && t == currentValue) {
            opt.selected = true;
            currentValue = '';
        }
    }
    if (select['onchange'])
        select.onchange();
}
function hasDepends(elementName) {
    var vName = "ni.dependent." + getNameFromElement(elementName);
    var eDep = document.getElementsByName(vName)[0];
    return eDep;
}
function resolveDependentValue(id, depname, deptable) {
    var systable = id.split(".")[0];
    var table = null;
    var dep = document.getElementById(systable + '.' + depname);
    if (dep != null) {
        if (dep.tagName == 'SELECT')
            table = dep.options[dep.selectedIndex].value
        else
            table = dep.value;
        table = table.split(".")[0];
    } else {
        table = deptable;
    }
    if (table == '*' || table == '' || table == 'null')
        table = null;
    return table;
}
function loadFields(fname, dependent, types, script_types) {
    var hinput = gel(fname);
    var systable = fname.split(".")[0];
    var table = null;
    var dep = gel(systable + '.' + dependent);
    if (dep != null) {
        if (dep.tagName == 'SELECT')
            table = dep.options[dep.selectedIndex].value
        else
            table = dep.value;
    } else
        table = dependent;
    if (table != null)
        getTableColumns(table, fname, types, script_types);
}
function getTableColumns(table, ref, types, script_types) {
    if (!types)
        types = "";
    if (!script_types)
        script_types = "";
    serverRequest("xmlhttp.do?sysparm_include_sysid=true&sysparm_processor=SysMeta&sysparm_table_name=false&sysparm_type=column&sysparm_nomax=true" +
        "&sysparm_value=" + table + "&sysparm_types=" + types + "&sysparm_script_types=" + script_types + "&sysparm_containing_table=" +
        $('sys_target').value, getTableColumnsResponse, ref);
}
function getTableColumnsResponse(request, ref) {
    var fname = ref;
    var tcols = request.responseXML;
    var scols = gel(fname);
    var currentvis = scols.style.visibility;
    scols.style.visibility = "hidden";
    var cfield = gel('sys_original.'+fname);
    cValue = cfield.value;
    scols.options.length = 0;
    var includeNone = scols.attributes.getNamedItem('include_none'); //'';
    if (includeNone) {
        if (includeNone.nodeValue == 'true')
            scols.options[scols.options.length] = new Option(new GwtMessage().getMessage('-- None --'), '');
    }
    var items = tcols.getElementsByTagName("item");
    var sindex = 0;
    for (var i = 0; i != items.length; i++) {
        var item = items[i];
        var value = item.getAttribute("value");
        var label = item.getAttribute("label");
        scols.options[scols.options.length] = new Option(label, value);
        if (cValue == value)
            sindex = scols.options.length - 1;
    }
    scols.selectedIndex = sindex;
    scols.style.visibility = currentvis;
}