//include list_filter.js
var runFilterHandlers = {}
function displayFilters(name) {
    var fDiv = gel(name + MAIN_LAYER);
    if (!fDiv)
        return;
    var image = name + MAIN_LAYER + "_image";
    if (fDiv.getAttribute('gsft_empty') == 'true') {
        var i = gel(image);
        fDiv.setAttribute('gsft_oldTitle', i.title);
        i.title = "";
        setImage(image, "images/filter_reveal.gifx");
        fDiv.style.display = '';
        var myForm = findParentByTag(fDiv, "form");
        var ga = new GlideAjax("AJAXJellyRunner", "AJAXJellyRunner.do");
        ga.addParam("template", "list_filter_partial.xml");
        ga.addParam("sysparm_query_encoded", myForm.sysparm_query_encoded.value);
        ga.addParam("sysparm_target", myForm.sys_target.value);
        var related = myForm.sys_is_related_list;
        if (related)
            ga.addParam("sysparm_is_related_list",related.value);
        else
            ga.addParam("sysparm_is_related_list", "false");
        var ref_list_pinned = myForm.sysparm_reflist_pinned;
        if (ref_list_pinned)
            ga.addParam("sysparm_reflist_pinned",ref_list_pinned.value);
        var x = name.split(".");
        try {
            if(getTopWindow().Table.isCached(x[1].split(".")[0], null))
                ga.addParam("sysparm_want_metadata", "false");
            else
                ga.addParam("sysparm_want_metadata", "true");
        } catch(e) {
            ga.addParam("sysparm_want_metadata", "true");
        }
        ga.addParam("sysparm_list_ref_field", x[1]);
        ga.getXML(displayFiltersAsynch, null, fDiv);
    } else if (fDiv.style.display == ''){
        fDiv.style.display = 'none';
        setImage(image, "images/filter_hide.gifx");
    } else {
        fDiv.style.display = '';
        setImage(image, "images/filter_reveal.gifx");
    }
}
function displayFiltersAsynch(response, div, title) {
    var html = response.responseText;
    div.innerHTML = html;
    html.evalScripts(true);
    var n = div.id.substring(0, div.id.length - "filterdiv".length);
    columnsGet(n);
    refreshFilter(n);
    div.setAttribute('gsft_empty', 'false');
    div.style.display = "";
    var image = gel(div.id + "_image");
    if (image)
        image.title = div.getAttribute('gsft_oldTitle');
    _frameChanged();
}
function setImage(element, src) {
    var i;
    if (!$(element))
        i = gel(element);
    else
        i = $(element);
    i.src = src;
}
function swapImage(imgId, newSrc) {
    return function () {
        setImage(imgId, newSrc);
    };
}
function setDisplay(element, display) {
    var i = $(element);
    i.style.display = display;
}
function initFilterPin(n, pinned) {
    var e = gel(n + '_pin');
    if (e) {
        e._isPinned = false;
        e._name = n;
    }
    if (pinned) {
        toggleFilterPin(n);
        displayFilters(n);
    }
}
function pinRefListFilter(name) {
    var e = gel(name + "filterdiv_image");
    if (e)
        hideObject(e);
    e = gel(name + "filter_pin");
    if (e)
        hideObject(e);
    displayFilters(name);
}
function toggleFilterPin(name) {
    var e = gel(name + "_pin");
    if (e) {
        e._isPinned = !e._isPinned;
        if (e._isPinned) {
            if (typeof g_filter_description != 'undefined' && g_filter_description.getPinned() != 1)
                setPreference('filter.pinned.' + name, 'true');
            e.src = "images/pinned.pngx";
            e.title = "Disable the pin filters";
            e.className = "toolbarImgActive";
        } else {
            deletePreference('filter.pinned.' + name);
            e.src = "images/unpinned.pngx";
            e.title = "Pin the filters";
            e.className = "toolbarImgDisabled";
        }
    }
}
function runFilter(name) {
    if (queueFilters[name]) {
        columnsGet(name, runFilterCallBack);
        return;
    }
    runFilter0(name);
}
function runFilterCallBack() {
    queueFilters[mainFilterTable] = null;
    runFilter0(mainFilterTable);
}
function runFilter0(name) {
    var filter = getFilter(name);
    if (name.endsWith('.'))
        name = name.substring(0, name.length - 1);
    if (runFilterHandlers[name]) {
        runFilterHandlers[name](name, filter);
        return;
    }
    var list = GlideList.getByListID(name);
    if (!list)
        return;
    list.runQuery(filter);
}
function saveFilterRadioChange() {
    var div = gel('savefiltergroupref');
    var grp = new GwtMessage().getMessage('Group');
    if (getGroupSaveOption() == grp)
        div.style.display = "inline";
    else
        div.style.display = "none";
}
function getFilterVisibility() {
    var vis = getGroupSaveOption();
    var me = new GwtMessage().getMessage('Me');
    var eone = new GwtMessage().getMessage('Everyone');
    var grp = new GwtMessage().getMessage('Group');
    if (vis == me)
        return vis;
    if (vis == eone)
        return "GLOBAL";
    if (vis != grp)
        return me;
    var vis = '';
    var e = gel('save_filter_ref_id').value;
    var e = gel(e);
    if (e)
        vis = e.value;
    if (!vis)
        return me;
    return vis;
}
function getGroupSaveOption() {
    var rb = gel('MeRadio');
    if (rb && rb.checked)
        return rb.value;
    rb = gel('EveryoneRadio');
    if (rb && rb.checked)
        return rb.value;
    rb = gel('GroupRadio');
    if (rb && rb.checked)
        return rb.value;
    return new GwtMessage().getMessage('Me');
}
function unpinFilters(name) {
    var e = gel(name + "_pin");
    if (e) {
        e._isPinned = false;
        deletePreference('filter.pinned.' + name);
        e.src = "images/unpinned.pngx";
    }
}
function saveFilter(aTable, aFilter) {
    var list = GlideList.getByListID(aTable);
    var siname = list.getElement('save_filter_name');
    if (!siname || !siname.value || siname.value.length <= 0) {
        var msg = new GwtMessage().getMessage("Enter a name to use for saving");
        alert(msg);
        siname.focus();
        return;
    }
    var filter = getFilter(aFilter);
    var groupBy = list.getValue('select_groupby');
    if (groupBy)
        filter += "^GROUPBY" + groupBy;
    var parms = {};
    parms['filter_visible'] = getFilterVisibility();
    parms['save_filter_query'] = filter;
    parms['save_filter_name'] = siname.value;
    parms['sys_action'] = 'sysverb_save_filter';
    list.submit(parms);
}
function runRelatedFilter(element, name) {
    var filter = getFilter(name);
    var parms = {};
    parms['sysverb_addrelated_query'] = filter;
    parms['sysparm_referring_url'] = '';
    parms['sys_action'] = 'sysverb_first';
    GlideList.getByElement(element).submit(parms);
}
function makeDefaultFilter(element, name) {
    var filter = getFilter(name, false);
    var parms = {};
    parms['sysverb_setrelated_query'] = filter;
    parms['sysparm_referring_url'] = '';
    parms['sys_action'] = 'sysverb_first';
    GlideList.getByElement(element).submit(parms);
}
function setFilterName() {
    var fn = gel('save_filter_name');
    var fs = gel('filteron');
    if (fn && fs && fs.selectedIndex >= 0) {
        var o = fs.options[fs.selectedIndex];
        if (o.value == "")
            return;
        fn.value = o.text;
    }
}
function filterBoxChange(name, selectBox) {
    var theOption = selectBox.options[selectBox.selectedIndex];
    var type = theOption.getAttribute("type");
    if (type == "filter") {
        var parms = {};
        parms['sysparm_query'] = theOption.value;
        parms['sysparm_referring_url'] = '';
        parms['sysparm_current_row'] = '0';
        GlideList.getByListID(name).submit(parms, "GET");
    } else if (type == "edit_personal") {
        self.location = "sys_filter_list.do?sysparm_query=table=" + this.gcm.tableName + "^user%3D" + this.g_user.userID;
    }
}
function setFilter(mft, filter) {
    queueFilters[mft] = filter;
    queueTables[mft] = mft;
    setGroupBy(mft, filter);
}
function setGroupBy(mft, filter) {
    if (filter == null)
        return;
    var groupSel = getThing(mft, 'select_groupby');
    if (groupSel == null)
        return;
    var idx = filter.indexOf('GROUPBY');
    if (idx == -1)
        return;
    groupBy = filter.substring(idx + 7);
    idx = groupBy.indexOf("^");
    if (idx > -1 )
        groupBy = groupBy.substring(0, idx);
    var options = groupSel.options;
    for(var i = 0; i < options.length; i++) {
        if (options[i].value == groupBy) {
            groupSel.selectedIndex = i;
            break;
        }
    }
}