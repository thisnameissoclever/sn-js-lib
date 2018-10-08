//defer popups.js
var lastMouseX;
var lastMouseY;
var helpWindow = null;
var beenFocused = false;
document.onmousedown = markFocused;
function markFocused() {
    beenFocused = true;
}
function mousePositionSave(e) {
    if (navigator.appName.indexOf("Microsoft") != -1) e = window.event;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
}
function imageListOpen(elementName, img_dirs, ignore) {
    var url = new GlideURL("image_picker.do");
    url.addParam("sysparm_element", elementName);
    url.addParam("sysparm_img_dirs", img_dirs);
    url.addParam("sysparm_ignore", ignore);
    popupOpenStandard(url.getURL(), "imagepicker");
}
function imageListPick(elementName, value) {
    var element = document.getElementById(elementName);
    var imgel = document.getElementById("img." + elementName);
    element.value = value;
    if (element['onchange'])
        element.onchange();
    if (imgel != null) {
        if (value && value.length > 0)
            imgel.src = value;
        else
            imgel.src = "images/s.gifx";
    }
    popupClose();
    return false;
}
function reflistOpen(target, elementName, refTableName, dependent, useQBE, refQualElements){
    var url = reflistOpenUrl(target, target, elementName, refTableName, dependent, useQBE, refQualElements);
    popupOpenStandard(url, "lookup");
}
function reflistOpenUrl(target, targetElementID, elementName, refTableName, dependent, useQBE, refQualElements) {
    var url;
    if (useQBE == 'true')
        url = new GlideURL(refTableName + '_search.do');
    else
        url = new GlideURL(refTableName + '_list.do');
    url.addParam("sysparm_target", target);
    var et = gel(targetElementID);
    if (et)
        url.addParam("sysparm_target_value", et.value);
    var dspEl = gel("sys_display." + targetElementID);
    if (dspEl && !et.value)
        url.addParam("sysparm_reference_value", dspEl.value);
    url.addParam("sysparm_element", elementName);
    url.addParam("sysparm_reference", refTableName);
    url.addParam("sysparm_view", "sys_ref_list");
    var v = getDependentValue(target, dependent);
    if (v != null)
        url.addParam("sysparm_dependent", v);
    var refQual = getRefQualURI(target, refQualElements);
    return url.getURL() + refQual;
}
function emailClientOpen(e, table, row, rows) {
    var query = e.getAttribute("query");
    var addOn = '&sysparm_record_row=' + row + '&sysparm_record_rows=' + rows + '&sysparm_record_list=' + encodeURIComponent(query);
    emailClientOpenPop(table, false, null, null, addOn);
}
function emailClientOpenPop(table, immediate, replyType, replyID, addOn) {
    var id = document.getElementsByName("sys_uniqueValue")[0];
    if (!id)
        return;
    var url = new GlideURL("email_client.do");
    url.addParam("sysparm_table", table);
    url.addParam("sysparm_sys_id", id.value);
    url.addParam("sysparm_target", table);
    if (replyType != null) {
        url.addParam("replytype", replyType);
        url.addParam("replyid", replyID);
    }
    popupOpenEmailClient(url.getURL() + g_form.serializeChangedAll());
}
function reflistPick(elementName, value, display) {
    var listName = "select_0" + elementName;
    var list = $(listName);
    if (list) {
        addGlideListChoice(listName, value, display, true);
        popupClose();
        return false;
    }
    if (gel("sys_display.LIST_EDIT_" + elementName))
        elementName = "LIST_EDIT_" + elementName;
    var element = $("sys_display." + elementName);
    if (element && element.ac && typeof(element.ac.referenceSelect) == "function") {
        element.ac.referenceSelectTimeout(value, display);
        popupClose();
        return;
    }
    element = $(elementName);
    element.value = value;
    if (typeof(element.onchange) == "function")
        element.onchange();
    element = $("sys_display." + elementName);
    element.value = display;
    if (typeof(element.onchange) == "function")
        element.onchange();
    var eDep = element;
    var itemName = eDep.getAttribute("function");
    if (itemName != null) {
        eval(itemName);
    }
    element = document.getElementsByName("sys_select." + elementName)[0];
    if (element != null) {
        var options = element.options;
        var optionFound = false;
        for (var i=0; i < options.length; i++) {
            var option = options[i];
            option.selected = false;
            var o = option.value;
            if (o == value ) {
                option.selected = true;
                optionFound = true;
            }
        }
        if (!optionFound) {
            element.selectedIndex = -1;
            var opt = document.createElement("option");
            opt.value = value;
            opt.appendChild(document.createTextNode(display));
            opt.selected = true;
            element.appendChild(opt);
            var options = element.options;
            element.selectedIndex = options.length-1;
            element.disabled = true;
            element.disabled = false;
        }
        element.onchange();
    } else {
        var fcs = "updateRelatedGivenNameAndValue('" + elementName + "','" + value + "');";
        setTimeout(fcs, 0);
    }
    popupClose();
    return false;
}
function picklistOpen(baseURL, width, modified, searchParam, target, dependent) {
    if (modified == '1')
        baseURL = baseURL + searchParam;
    baseURL += getDependent(target, dependent);
    popupOpenStandard(baseURL, "lookup");
}
function getDependent(target, dependent){
    var value = getDependentValue(target, dependent);
    if (value == null)
        return "";
    return "&sysparm_dependent=" + encodeURIComponent(value);
}
function getDependentValue(target, dependent) {
    if (dependent == null)
        return null;
    var table = target.split('.')[0];
    var tfield = dependent.split(',')[0];
    var elname = table + '.' + tfield;
    if (tfield == 'sys_id') {
        tfield = 'sys_uniquevalue';
        elname = 'sys_uniquevalue';
    }
    var el = document.getElementsByName(elname)[0];
    if (el == null)
        return null;
    var selectValue = "";
    if (el.tagName == "INPUT")
        var selectValue = el.value;
    else
        selectValue = el.options[el.selectedIndex].value;
    return selectValue;
}
function getRefQualURI(target, refQualElements) {
    if (!refQualElements)
        return "";
    var aj = new GlideAjax("FormStateAjax");
    aj.addEncodedString(g_form.serialize());
    aj.getXMLWait();
    return "&sysparm_client_record=session";
}
function picklistPick(elementName, value) {
    var element = document.getElementsByName(elementName)[0];
    element.value = value;
    if (element["onchange"]) {
        element.onchange();
    }
    element.value = replaceRegEx(element.value, document, elementName);
    popupClose();
    return false;
}
function popupOpenStandard(url, name) {
    var width = 700;
    var height = 480;
    var features = "width="+ width +",height="+ height +",toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=1";
    popupOpen(url, name, width, height, features, true );
}
function popupOpenEmailClient(url) {
    var width = 875;
    var height = 575;
    var features = "width="+ width +",height="+ height +",toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=1";
    popupOpenFocus(url, "Email_Client", width, height, features, false, false );
}
/**
* Calls through to the popupOpenFocus() with closeOnLoseFocus set to true.
*/
function popupOpen(url, name, pWidth, pHeight, features, snapToLastMousePosition) {
    popupOpenFocus (url, name, pWidth, pHeight, features, snapToLastMousePosition, true);
}
/**
* Handles popup windows.
* If snapToLastMousePosition is true, then the popup will open up near the mouse click.
* If closeOnLoseFocus is true, then it will close when the user clicks back into the browser window that opened it.
*/
function popupOpenFocus(url, name, pWidth, pHeight, features, snapToLastMousePosition, closeOnLoseFocus) {
    popupClose();
    if (url.indexOf("sysparm_nameofstack") == -1)
        url += "&sysparm_stack=no";
    if (snapToLastMousePosition) {
        if (lastMouseX - pWidth < 0) {
            lastMouseX = pWidth;
        }
        if (lastMouseY + pHeight > screen.height) {
            lastMouseY -= (lastMouseY + pHeight + 50) - screen.height;
        }
        lastMouseX -= pWidth;
        lastMouseY += 10;
        features += ",screenX=" + lastMouseX + ",left=" + lastMouseX + ",screenY=" + lastMouseY + ",top=" + lastMouseY;
    }
    if (closeOnLoseFocus) {
        popupCurrent = window.open(url, name, features, false);
        if (!popupCurrent) {
            alert('Please disable your popup blocker to use this feature');
            return null;
        } else {
            popupCurrent.focus();
            popupCurrent.opener = self;
            return popupCurrent;
        }
    } else {
        popupCurrent = null;
        win = window.open(url, name, features, false);
        if (win) {
            win.focus();
            win.opener = self;
        }
        return win;
    }
}
function xmlView(ref, id) {
    var mytable = ref.split('.')[0];
    var myfield = ref.split('.')[1];
    var w = 700;
    var h = 500;
    var url = new GlideURL(mytable + ".do");
    url.addParam("sys_id", id);
    url.addParam("sys_target", myfield);
    url.addParam("XML", "");
    popupOpen(url.getURL(), "xmlview", w, h,
        "width="+w+",height="+h+",toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=1");
}
function htmlView(ref, id) {
    var mytable = ref.split('.')[0];
    var myfield = ref.split('.')[1];
    var w = 1000;
    var h = 500;
    var url = new GlideURL("diff_html_page.do");
    url.addParam("sysparm_id", id);
    url.addParam("sysparm_table", mytable);
    popupOpen(url.getURL(), "htmlview", w, h,
        "width="+w+",height="+h+",toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollbars=1");
}
function tearOffReference(table, fieldName, view, navigate) {
    var widget = gel(fieldName);
    if (widget == null) {
        alert('Tear off called for a non existent reference field');
        return false;
    }
    var sys_id = widget.value;
    if (sys_id == null || sys_id == '') {
        alert('Please select a reference before trying to tear it off');
        return false;
    }
    tearOff(table, sys_id, view, navigate);
}
function tearOff(table, sys_id, view, navigate) {
    var key = sys_id;
    var url = new GlideURL(table + '.do');
    url.addParam("sys_id", key);
    url.addParam("sysparm_view", view);
    url.addParam("sysparm_stack", "no");
    url.addParam("sysparm_referring_url", "tear_off");
    window.open(url.getURL(), "",
        "toolbar=no,menubar=no,personalbar=no,width=800,height=600," +
        "scrollbars=yes,resizable=yes");
    if (navigate) {
        gsftSubmit(document.getElementById('sysverb_back'));
    }
}
function tearOffAttachment(sys_id) {
    var url = new GlideURL("sys_attachment.do");
    url.addParam("sysparm_referring_url", "tear_off");
    url.addParam("view", "true");
    url.addParam("sys_id", sys_id);
    window.open(url.getURL(), sys_id,
        "toolbar=no,menubar=no,personalbar=no,width=800,height=600," +
        "scrollbars=yes,resizable=yes");
}