//defer functions.js
var QUERY_TERM_SEPERATOR = '^';
var AJAX_KEEPALIVE_TIMEOUT = 900;
var lastAppLink;
var loadingDialog;
var preloadedImages = new Object();
loadNewPrototypes();
function gsftSubmit(control, /* optional */ form, /* optional */ action_name) {
    var f;
    if (typeof form == "undefined") {
        f = findParentByTag(control, 'form');
        if (typeof form == "undefined") {
            var sectionFormId = gel("section_form_id"); // is there a Glide form on the page?
            if (sectionFormId)
                f = gel(sectionFormId.value);
        }
    } else
        f = form;
    if (g_submitted)
        return false;
    if (typeof action_name == "undefined")
        action_name = control.id;
    if (action_name == 'sysverb_delete') {
        if  (!confirm("Delete?")) {
            g_submitted = false;
            return false;
        }
    }
    f.sys_action.value=action_name;
    if (typeof f.onsubmit == "function" && action_name != 'sysverb_back') {
        var rc = f.onsubmit();
        if (rc == false) {
            g_submitted = false;
            return false;
        }
    }
    if (control && control.getAttribute('gsft_id')) {
        action_name = control.getAttribute('gsft_id');
        f.sys_action.value=action_name;
    }
    g_submitted = true;
    f.submit();
    return false;
}
function setCheckBox(box) {
    var name = box.name;
    var id = name.substring(3);
    var frm = box.form;
    if (frm)
        frm[id].value = box.checked;
    else {
        var widget = gel(id);
        if (widget)
            widget.value = box.checked;
    }
    if (box['onchange'])
        box.onchange();
}
function determineEffects() {
    if (isTouchDevice)
        sexyEffects = false;
}
function populateParmQuery(form, prefix, defaultNULL, action) {
    var keys = ['No records selected', 'Delete the selected item?', 'Delete these', 'items?'];
    var msgs = new GwtMessage().getMessages(keys);
    var keyset = getChecked(form);
    if (!action)
        action = form.sys_action.value;
    if (action.indexOf("sysverb") != 0) {
        if (keyset == '') {
            if (!alert(msgs["No records selected"]))
                return false;
        } else {
            if (action == "delete_checked") {
                var items = keyset.split(",");
                if (items.length == 1) {
                    if (!confirm(msgs["Delete the selected item?"]))
                        return false;
                } else if (items.length > 0) {
                    if (!confirm(msgs["Delete these"] + " " + items.length + " " + msgs["items?"]))
                        return false;
                }
            }
        }
    } else if (form.sys_action.value == "sysverb_new") {
        addInput(form, 'HIDDEN', 'sys_id', '-1');
    }
    if (keyset == '' && defaultNULL)
        keyset = defaultNULL;
    if (prefix)
        keyset = prefix + keyset;
    addInput(form, 'HIDDEN', 'sysparm_checked_items', keyset);
    return true;
}
function getChecked(form) {
    var keyset = '';
    var lookup = form;
    for (i = 0; i < lookup.elements.length; i++) {
        if ( lookup.elements[i].type != "checkbox")
            continue;
        var v = lookup.elements[i];
        if (v.checked) {
            var id = v.id.substring(3);
            var skip = v.name.substring(0,4);
            if (skip == "SKIP")
                continue;
            if (id == "all")
                continue;
            if (keyset == '')
                keyset = id;
            else
                keyset = keyset + ',' + id;
        }
    }
    return keyset;
}
function iterateList(e, table, row, value, update) {
    update = (typeof(update) == undefined) ? true : update;
    if (update)
        g_form.setMandatoryOnlyIfModified(true);
    var form = document.forms[table+'.do'];
    form.sys_action.value = value;
    var query = e.getAttribute("query");
    addInput(form, 'HIDDEN', 'sys_record_row', row);
    addInput(form, 'HIDDEN', 'sys_record_list', query);
    if (update && typeof form.onsubmit == "function") {
        var rc = form.onsubmit();
        if (!rc)
            return;
    }
    form.submit();
}
function sendEmail() {
    var form = document.forms['emailclient'];
    addInput(form, 'HIDDEN', 'EMAIL-CLIENT', 'send');
    if (typeof form.onsubmit == "function") {
        form.onsubmit();
    }
    form.submit();
}
function applyTemplate(sysID) {
    var t = new TemplateRecord(sysID);
    t.apply();
}
function refreshNav() {
    if (top.gsftReloadNav)
        top.gsftReloadNav();
}
function checkSave(tableName, urlBase, idField){
    var sysid = document.getElementsByName(idField)[0].value;
    checkSaveID(tableName, urlBase, sysid);
}
function checkSaveID(tableName, urlBase, sysid) {
    sysid = trim(sysid);
    var url = urlBase+"?sys_id="+sysid;
    var view = gel('sysparm_view');
    if (view != null) {
        view = view.value;
        if (view != '')
            url = url + "&sysparm_view=" + view;
    }
    return checkSaveURL(tableName, url);
}
function checkSaveURL(tableName, url) {
    if (g_submitted)
        return false;
    var f = document.forms[tableName+".do"];
    if (g_form.getTableName() == tableName) {
        var fs = document.forms;
        for (var z=0; z < fs.length; z++) {
            if (typeof fs[z].sys_uniqueValue != 'undefined') {
                f = fs[z];
                break;
            }
        }
    }
    g_form.setMandatoryOnlyIfModified(true);
    f.sys_action.value = 'sysverb_check_save';
    addInput(f, 'HIDDEN', 'sysparm_goto_url', url);
    if (typeof f.onsubmit == "function") {
        var rc = f.onsubmit();
        if (!rc) {
            g_submitted = false;
            return false;
        }
    }
    g_submitted = true;
    f.submit();
    return false;
}
function submitTextSearch(event, tableName) {
    if (event != true && event.keyCode != 13)
        return;
    var form = getControlForm(tableName);
    addHidden(form, 'sysverb_textsearch', form['sys_searchtext'].value);
    addHidden(form, 'sysparm_query', '');
    addHidden(form, 'sysparm_referring_url', '');
    form.submit();
}
function submitPrefixOnPress(event, tableName) {
    if (event.keyCode != 13)
        return;
    submitPrefixSearch(tableName);
    return false; // cancel form submit on bubble up of event
}
function submitPrefixSearch(tableName) {
    var form = getControlForm(tableName);
    addHidden(form, 'sysverb_skip_to', form['sys_skiptext'].value);
    addHidden(form, 'sysparm_current_row', "1");
    addHidden(form, 'sysparm_referring_url', '');
    addHidden(form, 'sys_action', 'skip_to');
    form.submit();
}
function setPrefixLabel(currentValue, search_text, goto_text) {
    var prefixlabel = $('prefix_search');
    if (currentValue == 'zztextsearchyy')
        prefixlabel.innerHTML = search_text;
    else
        prefixlabel.innerHTML = goto_text;
}
function handlePrefComboChange(event, search_text, goto_text) {
    var target = event.srcElement ? event.srcElement : event.target;
    setPrefixLabel(target.value, search_text, goto_text);
}
function getFormByTableName(tableName) {
    var form = getControlForm(tableName);
    if (!form)
        form = document.forms[tableName + '.do'];
    return form;
}
function getControlForm(name) {
    var form;
    if (ie5)
        form = document.forms(name + '_control', 0);
    else {
        if (isSafari || isChrome) { // this can be a collection in Safari so return 1st one in that case
            var collection = document.forms[name + '_control'];
            if (collection) {
                var collectionType = collection.toString();
                if (collectionType=="[object HTMLFormElement]")
                    form = collection;
                else // it should be [object Collection] and we want the first one
                    form = collection[0];
            }
        }
        else
            form = document.forms[name + '_control'];
    }
    return form;
}
function getFormForList(listId) {
    return gel(listId + "_control");
}
function getFormForElement(element) {
    var f = element.form;
    if (f)
        return f;
    return findParentByTag(element, "form");
}
function hideReveal(sectionName, imagePrefix, snap) {
    var el = gel(sectionName);
    var img = gel("img." + sectionName);
    var imageName = "section";
    if (imagePrefix)
        imageName = imagePrefix;
    if (el.style.display == "block") {
        if (snap)
            hide(el);
        else
            collapseEffect(el);
        if (img) {
            img.src = "images/"+imageName+"_hide.gifx";
            img.alt = new GwtMessage().getMessage("Display / Hide");
        }
    } else {
        if (snap)
            show(el);
        else
            expandEffect(el);
        if (img) {
            img.src = "images/"+imageName+"_reveal.gifx";
            img.alt = new GwtMessage().getMessage("Display / Hide");
        }
    }
}
function hideRevealWithTitle(name, hideMsg, showMsg) {
    var el = gel(name);
    var img = gel("img." + name);
    if (el.style.display == "block"){
        el.style.display = "none";
        img.src = "images/section_hide.gifx"
        img.title = showMsg;
        img.alt = showMsg;
    } else {
        el.style.display = "block";
        img.src = "images/section_reveal.gifx"
        img.title = hideMsg;
        img.alt = hideMsg;
    }
}
function forceHideWithTitle(name, msg) {
    var el = gel(name);
    var img = gel("img." + name);
    el.style.display = "none";
    img.src = "images/section_hide.gifx"
    img.title = msg;
    img.alt = msg;
}
function collapsedState(sectionName) {
    var el = gel(sectionName);
    return (el.style.display == "none");
}
function forceHide(sectionName){
    var el = gel(sectionName);
    var img = gel("img." + sectionName);
    el.style.display = "none";
    img.src = "images/section_hide.gifx"
    img.alt = new GwtMessage().getMessage("Collapse");
}
function forceReveal(sectionName, sectionNameStarts, tagName){
    var els = document.getElementsByTagName(tagName);
    if (els) {
        for(var c=0;c<els.length;++c) {
            if ( els[c].id.indexOf(sectionNameStarts) == 0 ) {
                forceHide(els[c].id);
            }
        }
    }
    var el = gel(sectionName);
    var img = gel("img." + sectionName);
    el.style.display = "block";
    img.src = "images/section_reveal.gif";
    img.alt = new GwtMessage().getMessage("Expand");
    window.location = '#' + sectionName;
}
function moveColumnOption(textBoxName, selectBoxName) {
    var textBox = gel(textBoxName); // text area
    var select = gel(selectBoxName);
    var options = select.options;
    for (var i = 0; i != select.length; i++) {
        var option = options[i];
        if (!option.selected)
            continue;
        var label = option.text;
        var v = option.value.split('.');
        v = v[1];
        v = '';
        insertAtCursor(textBox, "\n" + label + ": " + v);
    }
}
function insertAtCursor(textField, value) {
    if (document.selection) {
        textField.focus();
        sel = document.selection.createRange();
        sel.text = value;
    } else if (textField.selectionStart || textField.selectionStart == 0) {
        var startPos = textField.selectionStart;
        var endPos = textField.selectionEnd;
        textField.value = textField.value.substring(0, startPos) + value +
        textField.value.substring(endPos, textField.value.length);
    } else {
        textField.value += value;
    }
}
function insertScriptVar(textBoxName, selectBoxName) {
    var textBox = gel(textBoxName); // text area
    var select = gel(selectBoxName);
    var options = select.options;
    for (var i = 0; i != select.length; i++) {
        var option = options[i];
        if (!option.selected)
            continue;
        var label = option.text;
        var v = option.value.split('.');
        v = 'current.' + v[1];
        insertAtCursor(textBox, v);
    }
}
function mailTo(field) {
    var nameField = gel(field);
    if (nameField && nameField.value) {
        self.location = "mailto:" + nameField.value;
    }
}
function clearCacheSniperly() {
    var aj = new GlideAjax("GlideSystemAjax");
    aj.addParam("sysparm_name", "cacheFlush");
    aj.getXML(clearCacheDone);
}
function clearCacheDone() {
    window.status = "Cache flushed";
}
function getNumber(fieldID) {
    var aj = new GlideAjax("GetNextNumberAjax");
    aj.addParam("sysparm_name", fieldID);
    aj.getXML(gotNumber, "", new Array(fieldID));
}
function gotNumber(request, args) {
    var fieldID = args[0];
    var rxml = request.responseXML
    var numberField = gel(fieldID);
    var items = rxml.getElementsByTagName("item");
    if (items.length > 0) {
        var v = items[0].getAttribute("value");
        numberField.value = v;
        var displayField = gel(fieldID + "AutoNumber");
        displayField.style.display = "none";
    }
}
function fieldTyped(me) {
    formChangeKeepAlive();
}
function setPreference(name, value, func) {
    var u = getActiveUser();
    if (u)
        u.setPreference(name, value);
    var url = new GlideAjax("UserPreference");
    url.addParam("sysparm_type", "set");
    url.addParam("sysparm_name", name);
    url.addParam("sysparm_value", value);
    if (!func)
        func = doNothing;
    url.getXML(func);
}
function deletePreference(name) {
    var u = getActiveUser();
    if (u)
        u.deletePreference(name);
    var url = new GlideAjax("UserPreference");
    url.addParam("sysparm_type", "delete");
    url.addParam("sysparm_name", name);
    url.getXML(doNothing);
}
function getPreference(name) {
    var u = getActiveUser();
    if (u) {
        var opinion =  u.getPreference(name);
        if (typeof opinion != 'undefined')
            return opinion;
    }
    var url = new GlideAjax("UserPreference");
    url.addParam("sysparm_type", "get");
    url.addParam("sysparm_name", name);
    var xml = url.getXMLWait();
    if (!xml)
        return '';
    var items = xml.getElementsByTagName("item");
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var value = item.getAttribute("value");
        return value;
    }
    return '';
}
function getActiveUser() {
    return getTopWindow().g_active_user;
}
function labelClicked(label, elementType) {
    var hFor = label.htmlFor;
    if (hFor) {
        var elpaco = gel("sys_display." + hFor);
        if (!elpaco || elpaco.type == "hidden")
            elpaco = gel(hFor);
        if (elpaco && elpaco.type != "hidden" && elpaco.style.visibility != "hidden") {
            if (elpaco.disabled != true)
                if (elementType == "html" || elementType == "translated_html") {
                    var handler = g_form.elementHandlers[hFor];
                    if (handler)
                        handler.focusEditor(); // htmlarea knows how to property focus
                } else
                    elpaco.focus();
        }
    }
    return false;
}
function setCannedText(selectBox) {
    var theOption = selectBox.options[selectBox.selectedIndex];
    var messageText = theOption.value;
    var body = gel('message.text');
    body.value = messageText;
    if (body.htmlArea)
        body.htmlArea._doc.body.innerHTML = messageText;
}
function insertFieldName(textBoxName, label) {
    var textBox = gel(textBoxName); // text area
    var index = label.indexOf(":");
    if (index > -1 )
        insertAtCursor(textBox, "\n" + label);
    else
        insertAtCursor(textBox, label);
}
function preloadImages(srcs) {
    for(var i = 0; i < srcs.length; i++) {
        var imgSrc = srcs[i];
        if (!preloadedImages[imgSrc]) {
            var img = new Image();
            img.src = imgSrc;
            preloadedImages[imgSrc] = img;
        }
    }
}
function breakeveryheader(me) {
    var mainWin = getMainWindow();
    if (!mainWin)
        mainWin = top;
    if (mainWin && mainWin.CustomEvent && mainWin.CustomEvent.fire("print.grouped.headers", me.checked) === false)
        return false;
    var thestyle=(me.checked)? "always" : "auto";
    var els = document.getElementsByTagName("td");
    for (i = 0; i < els.length; i++) {
        if (els[i].id == 'breaker') {
            els[i].style.pageBreakAfter = thestyle;
        }
    }
}
function printList(maxRows) {
    var mainWin = getMainWindow();
    if (mainWin && mainWin.CustomEvent.fire("print", maxRows) === false)
        return false;
    var veryLargeNumber = "999999999";
    var print = true;
    var features = "resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=yes,location=no";
    var href = "";
    var frame = top.gsft_main;
    if (!frame)
        frame = top;
    if (frame.document.getElementById("printURL") != null) {
        href = frame.document.getElementById("printURL").value;
        href = printListURLDecode(href);
    }
    if (!href) {
        if (frame.document.getElementById("sysparm_total_rows") != null) {
            var mRows = parseInt(maxRows);
            if (mRows < 1)
                mRows = 5000;
            var totalrows = frame.document.getElementById("sysparm_total_rows").value;
            if (parseInt(totalrows) > parseInt(mRows))
                print = confirm(new GwtMessage().getMessage("Printing large lists may affect system performance. Continue?"));
        }
        var formTest;
        var f = 0;
        var form;
        while ((formTest = frame.document.forms[f++])) { // extra parens make Eclipse happy...
            if (formTest.id == 'sys_personalize_ajax') {
                form = formTest;
                break;
            }
        }
        if (!form)
            form = frame.document.forms['sys_personalize']; // its always there
        if (form.sysparm_referring_url != null) {
            href = form.sysparm_referring_url.value;
            if (href.indexOf("sys_id=-1") != -1 && !href.startsWith('sys_report_template')) {
                alert(new GwtMessage().getMessage("Please save the current form before printing."));
                return false;
            }
            href = printListURLDecode(href);
        }
    }
    if( href.indexOf("?") <0 )
        href += "?";
    else
        href += "&";
    href = href.replace("partial_page=", "syshint_unimportant=");
    href = href.replace("sysparm_media=", "syshint_unimportant=");
    href += "sysparm_stack=no&sysparm_force_row_count=" + veryLargeNumber + "&sysparm_media=print";
    if (print) {
        if (href != null && href != "") {
            win = window.open(href, "Printer_friendly_format", features);
            win.focus();
        } else {
            alert("Nothing to print");
        }
    }
}
function printListURLDecode(href) {
    href = href.replace(/@99@/g, "&");
    href = href.replace(/@88@/g, "@99@");
    href = href.replace(/@77@/g, "@88@");
    href = href.replace(/@66@/g, "@77@");
    return href;
}
function runBreadCrumb(elementID, name, query) {
    var element = gel(elementID);
    var form = getFormForElement(element);
    addInput(form, 'HIDDEN', 'sysverb_addrelated_query', query);
    addInput(form, 'HIDDEN', 'sysparm_referring_url', '');
    form.sys_action.value = 'sysverb_first';
    form.submit();
}
function replaceRegEx(text, doc, tableName) {
    var s = "";
    var re = new RegExp("%\\{\\w+[\\}]");
    var m = re.exec(text);
    if (m != null) {
        for (i = 0; i < m.length; i++) {
            s = s + m[i];
        }
    }
    if (tableName.indexOf('.') > 0)
        tableName = tableName.split('.')[0];
    if (s.length > 0) {
        var field = s.substring(2, s.length - 1);
        var obj = doc.getElementById("sys_display." + tableName + "." +  field);
        var val = "?";
        if (obj != null)
            val = obj.value;
        if (val.length == 0) {
            var labelText = "?"; // as a last resort such as sys_class_name during a create new
            var labels = doc.getElementsByTagName("label");
            for(i = 0; i < labels.length; i++){
                if (labels[i].htmlFor == tableName + "." + field) {
                    labelText = labels[i].innerHTML;
                    break;
                }
            }
            if (labelText.indexOf(':') > 0)
                labelText = labelText.split(':')[0];
            val = labelText;
        }
        re = new RegExp("%\\{" + field + "[\\}]", "g");
        var result = text.replace(re, val);
        if (result.indexOf("%{") > 0)
            result = replaceRegEx(result, doc, tableName);
        return result;
    } else
        return text;
}
function saveAttachment(tableName, sys_id) {
    var g_dialog = new GlideDialogWindow('attachment');
    g_dialog.setTitle('Attachments');
    g_dialog.setPreference('target_table', tableName);
    g_dialog.setPreference('target_sys_id', sys_id);
    g_dialog.on("closeconfirm", _saveAttachmentConfirm);
    g_dialog.render();
}
function _saveAttachmentConfirm(dialog) {
    var attachFile = gel("attachFile");
    var value = trim(attachFile.value);
    if (value != "")
        if (!confirm(new GwtMessage().getMessage("Close before uploading this attachment?") + " " + value))
            return false;
    _saveAttachmentClose();
    return true;
}
function _saveAttachmentClose() {
    var attachmentsModified = gel("attachments_modified").value;
    if (attachmentsModified != "true")
        return;
    if (typeof g_form == "undefined") // we won't have g_form for the email client in which case we're done
        return;
    if (g_form.newRecord)
        g_form.modified = true; // trigger dirty form support so we don't lose attachments on a new record
    var listID = "*NONE*";
    for (var i=0; i<document.forms.length; i++) {
        var checkForm = document.forms[i];
        if (checkForm.action.endsWith("sys_attachment_list.do")) {
            listID = checkForm.getAttribute("glide_list_id");
            break;
        }
    }
    if (listID != "*NONE*")
        navigateList("sysverb_first", listID, "bottom", true);
}
function addAttachmentNameToForm(sysid, name, hoverText, image, showView, showPopup) {
    var modified = gel("attachments_modified");
    if (modified)
        modified.value = "true";
    showObjectInline(gel("header_attachment_list_label"));
    var line = gel("header_attachment_line");
    if (line) {
        line.style.visibility = "visible";
        line.style.display = "";
    }
    var list = gel("header_attachment_list");
    var span = cel("span");
    span.id = "attachment_" + sysid;
    span.style.marginRight = "10px";
    var img = cel("img");
    img.src = image;
    img.alt = "";
    span.appendChild(img);
    var link = cel("a");
    link.href = "sys_attachment.do?sys_id=" + sysid;
    var txt = document.createTextNode(name);
    link.appendChild(txt);
    link.title = hoverText;
    link.style.marginRight = "4px";
    span.appendChild(link);
    if (showView == "true") {
        var blankBefore = document.createTextNode(" ");
        span.appendChild(blankBefore);
        var view = cel("a");
        var txt = document.createTextNode("[view]");
        view.appendChild(txt);
        view.className = "attachment";
        var showPopupElement = gel("ni.show_attachment_popup");
        if (showPopup == "false")
            view.href = "sys_attachment.do?sys_id=" + sysid + "&view=true";
        else
            view.onclick = function() {
                tearOffAttachment(sysid)
            };
        span.appendChild(view);
        var blankAfter = document.createTextNode(" ");
        span.appendChild(blankAfter);
    }
    list.appendChild(span);
}
function nextCalendarAction(duration, year, month, day, calendarID, styleField) {
    var form = document.getElementsByName('dash_form')[0];
    if (form) {
        var name = form.dashboard_name.value;
        var url = "sys_dashboard_template.do?";
        url += "sysparm_query=name=" + name;
        url += "&sysparm_calview="+duration;
        url += "&sysparm_year="+year;
        url += "&sysparm_month="+month;
        url += "&sysparm_day="+day;
        var viewwidget = form['sysparm_view'];
        if (viewwidget)
            url += '&sysparm_view=' + viewwidget.value;
        window.location = url;
    } else {
        form = document.getElementsByName('calendarform')[0];
        if (form == null)
            form = document.getElementsByName('reportform_control')[0];
        if (form == null) {
            form = document.getElementsByName('history')[0];
            if (form != null) {
                addInput(form, 'HIDDEN', 'sysparm_stack', "no");
            }
        }
        if (form != null) {
            addInput(form, 'HIDDEN', 'sysparm_calview', duration);
            addInput(form, 'HIDDEN', 'sysparm_year', year);
            addInput(form, 'HIDDEN', 'sysparm_month', month);
            addInput(form, 'HIDDEN', 'sysparm_day', day);
            var media = gel('sysparm_media');
            if (media != null) {
                addInput(form, 'HIDDEN', 'sysparm_media', media.value);
            }
            media = gel('sysparm_view');
            if (media != null) {
                addInput(form, 'HIDDEN', 'sysparm_view', media.value);
            }
            media = document.getElementsByName('sysparm_calstyle_choice');
            if (media != null) {
                for (var i = 0; i < media.length; i++) {
                    var r = media[i];
                    if (r.checked) {
                        addInput(form, 'HIDDEN', 'sysparm_calstyle', r.value);
                        break;
                    }
                }
            }
            media = gel('sysparm_calstyle');
            if (media != null) {
                addInput(form, 'HIDDEN', 'sysparm_calstyle', media.value);
            }
            if (typeof form.onsubmit == "function")
                form.onsubmit();
            form.submit();
        } else {
            var elementID = 'reportformportal';
            if (calendarID)
                elementID += calendarID;
            elementID += "_control";
            var element = gel(elementID);
            if (element != null) {
                var cstyle = null;
                media = document.getElementsByName('sysparm_calstyle_choice');
                if (media != null) {
                    for (var i = 0; i < media.length; i++) {
                        var r = media[i];
                        if (r.checked) {
                            cstyle = r.value;
                            break;
                        }
                    }
                }
                while (element.parentNode != null) {
                    element = element.parentNode;
                    if (element.tagName == 'TABLE') {
                        var gwindow = element.gWindow;
                        if (gwindow != null) {
                            gwindow.setPreference("sysparm_calview", duration);
                            gwindow.setPreference("sysparm_year", year);
                            gwindow.setPreference("sysparm_month", month);
                            gwindow.setPreference("sysparm_day", day);
                            if (cstyle != null)
                                gwindow.setPreference("sysparm_calstyle", cstyle);
                            gwindow.render();
                        }
                    }
                }
                return;
            }
            var url = "calendar_view.do?";
            var rid = gel('sysparm_report_id');
            if (rid != null) {
                url = "sys_report_display.do?";
                url += "sysparm_report_id="+gel('sysparm_report_id').value+"&";
            }
            url += "sysparm_calview="+duration;
            url += "&sysparm_year="+year;
            url += "&sysparm_month="+month;
            url += "&sysparm_day="+day;
            if (styleField)
                url += "&sysparm_calstyle="+styleField;
            window.location = url;
        }
    }
}
function displaySchedule(schedule) {
    if (schedule == null)
        return;
    var nodes = schedule[0];
    var tr = gel('ScheduleNodes');
    var tdspec = nodes;
    if (tr != null) {
        var labelIndex = 1;
        var width = 100/tdspec[0];
        var swidth = width+'%';
        for (var i=2; i <= tdspec[0]+1; i++) {
            td = document.createElement("td");
            tr.appendChild(td);
            var label = nodes[i];
            td.width = swidth;
            label = "<label>"+label+"</label>";
            td.innerHTML = label;
        }
    }
    var schedNodes = tdspec[1];
    width = 100 / schedNodes;
    swidth = width+'%';
    for (var i=1; i<schedule.length; i++) {
        var item = schedule[i];
        var field = item[0];
        if (field == '')
            continue;
        var tr = gel(field);
        if (tr != null) {
            for (var x=1; x <= schedNodes; x++) {
                td = document.createElement("td");
                td.width = swidth;
                tr.appendChild(td);
            }
            var tds = tr.getElementsByTagName("td");
            var first = item[1];
            var last = item[2];
            for (var tdi=0; tdi < first; tdi++) {
                setAll(tds, tdi, 'white');
            }
            for (var tdi = first; tdi <= last; tdi++) {
                if (tdi == first)
                    setDiamond(tds[first], 0, item[3]);
                else if (tdi == last)
                    setDiamond(tds[last], 1, item[4]);
                else
                    setAll(tds, tdi, 'blue');
            }
            for (var tdi=last+1; tdi < schedNodes; tdi++) {
                setAll(tds, tdi, 'white');
            }
        }
    }
}
function setDiamond(td, right, title) {
    var ctd = td;
    var img = document.createElement('img');
    img.src="images/workflow_diamond.gifx";
    img.style.marginRight = '0px';
    ctd.style.backgroundColor = 'blue';
    img.height=10;
    if (right == 1) {
        ctd.style.textAlign = 'right'
    } else {
        ctd.style.textAlign = 'left'
    }
    img.title = title;
    img.alt = title;
    ctd.appendChild(img);
}
function setAll(tds, index, color) {
    var ctd = tds[index];
    setOne(ctd, color, 0);
}
function setOne(td, color, percent) {
    var ctd = td;
    var img = document.createElement('img');
    img.src="images/s.gifx";
    img.alt="";
    if (color == 'blue')
        ctd.style.backgroundColor = color;
    img.border=0;
    img.hspace=0;
    if (color == 'blue')
        img.height=10;
    if (percent>0)
        ctd.width = percent;
    ctd.appendChild(img);
}
function displayGroups(prefID, groupPrefix, groupsPrefix) {
    var spanTags = document.getElementsByTagName('span');
    var fImage = gel(groupsPrefix + "_image");
    var src = fImage.src;
    var hide = false;
    if (src.indexOf('reveal') > -1 ) {
        fImage.src = "images/filter_hide.gifx";
        fImage.alt = new GwtMessage().getMessage("Collapse");
        setPreference(prefID, false, doNothing);
        hide = true;
    } else {
        fImage.src = "images/filter_reveal.gifx";
        fImage.alt = new GwtMessage().getMessage("Expand");
        setPreference(prefID, true, doNothing);
    }
    if (spanTags) {
        for(var c=0;c<spanTags.length;++c) {
            var spanTag = spanTags[c];
            var id = spanTag.id;
            if (id) {
                var tid = id.substring(0, groupPrefix.length);
                if (tid == groupPrefix) {
                    var groupValue = id.substring(groupPrefix.length+1);
                    var groupValue = groupValue.replace('\_div','');
                    var imageid = id.replace('\_div', '\_image');
                    var image = gel(imageid);
                    if (hide) {
                        spanTag.style.display = 'none';
                        image.src = "images/filter_hide.gifx";
                        image.alt = new GwtMessage().getMessage("Collapse");
                    } else {
                        spanTag.style.display = "block";
                        image.src = "images/filter_reveal.gifx";
                        image.alt = new GwtMessage().getMessage("Expand");
                    }
                }
            }
        }
    }
}
function displayGroup(groupId, groupValue, prefID) {
    var fDiv = gel(groupId+'_div');
    var fImage = gel(groupId+ '_image');
    if (fDiv.style.display == 'none') {
        fDiv.style.display = "block";
        fImage.src = "images/filter_reveal.gifx";
        fImage.alt = new GwtMessage().getMessage("Expand");
        setPreference(prefID, true, doNothing);
    } else {
        fDiv.style.display = 'none';
        fImage.src = "images/filter_hide.gifx";
        fImage.alt = new GwtMessage().getMessage("Collapse");
        setPreference(prefID, false, doNothing);
    }
    _frameChanged();
}
function toggleInline(name) {
    _toggleDisplay(name, 'inline');
}
function _toggleDisplay(name, displayType) {
    var e = gel(name);
    if (e.style.display == 'none' ) {
        e.style.display = displayType;
        setPreference(name, displayType, null);
    } else {
        e.style.display = 'none';
        setPreference(name, 'none', null);
    }
}
function toggleListNavigator(element) {
    toggleWidget(element+".listnavigator_div", "listnavigator");
}
function toggleBreadCrumb(element) {
    toggleWidget(element+".breadcrumb_div", "breadcrumb");
}
function toggleWidget(id, pref) {
    var x = $(id);
    if (!x)
        return;
    x.toggle();
    setPreference(pref, x.visible() ? "" : "none", null);
}
preloadImages(new Array("images/timer_stop.gifx", "images/timer_start.gifx"));
function pauseTimer(event, tmr) {
    var tmrImg = event.srcElement ? event.srcElement : event.target;
    var paused = gel("tmr_" + tmr + "_paused");
    if (paused.value == "false") {
        paused.value = "true";
        tmrImg.src = "images/timer_start.gifx";
        tmrImg.alt = new GwtMessage().getMessage("Start Timer")
    } else {
        paused.value = "false";
        tmrImg.src = "images/timer_stop.gifx";
        tmrImg.alt = new GwtMessage().getMessage("Pause Timer")
    }
}
function textareaResizer(id, change) {
    objectResizer(id, change, 'rows');
}
function textareaSizer(id, rows) {
    var element = gel(id);
    if (element)
        setAttributeValue(element, 'rows', rows);
}
function selectResizer(id, change) {
    objectResizer(id, change, 'size');
}
function objectResizer(id, change, attrName) {
    var element = $(id);
    var value = getAttributeValue(element, attrName) * 1; // force it to a number, mozilla issue
    value += change;
    if (value < 1)
        value = 1;
    if (element.tagName == 'INPUT') {
        element = $("div."+id);
        if (change > 0) {
            e.show();
        } else {
            e.hide();
            value = 1;
        }
    } else {
        var oldRows = element.rows;
        setAttributeValue(element, attrName, value);
        resizeTextAreaIframe(id, oldRows, value);
    }
    setPreference('rows.' + id, value, doNothing);
    _frameChanged();
}
function resizeTextAreaIframe(id, oldRows, rows) {
    var tf = gel("textarea_iframe." + id);
    if (!tf)
        return;
    if (!tf.parentNode)
        return;
    if (!tf.parentNode.nextSibling)
        return;
    var nid = tf.parentNode.nextSibling.id;
    if (nid != id)
        return;
    var elHeight = tf.clientHeight;
    var pixelsPerRow = Math.round(elHeight / oldRows);
    tf.style.height = rows * pixelsPerRow + "px";
}
var NOT_FOUND_IMAGE = "images/s.gif";
function deleteUserImage(image_id, replacement) {
    var ajax = new GlideAjax("AttachmentAjax");
    ajax.addParam("sysparm_value", image_id);
    ajax.addParam("sysparm_type", "delete");
    ajax.getXML(doNothing);
    var image = gel(image_id);
    if (image) {
        image.src = NOT_FOUND_IMAGE;
        image.alt = "";
    }
    var delspan = gel(image_id+"_delete");
    if (delspan)
        delspan.innerHTML = '';
    var addanchor = gel(image_id+"_update");
    if (addanchor)
        addanchor.innerHTML = "";
    var imagespan = gel(image_id+"_image");
    if (imagespan)
        imagespan.style.visibiity = "hidden";
    var noimagespan = gel(image_id+"_noimage");
    if (noimagespan)
        noimagespan.style.visibility = "";
    return false;
}
function showLoadingDialog() {
    loadingDialog = new GlideDialogWindow("dialog_loading", true);
    loadingDialog.setPreference('table', 'loading');
    loadingDialog.render();
}
function hideLoadingDialog() {
    loadingDialog.destroy();
}
function saveUserImage(tableName, gotourl) {
    var form = document.forms[tableName+'.do'];
    var viewwidget = form['sysparm_view'];
    if (viewwidget)
        gotourl += '&sysparm_view=' + viewwidget.value;
    form.sys_action.value = 'sysverb_check_save';
    addInput(form, 'HIDDEN', 'sysparm_goto_url', gotourl);
    var okToSubmit = true;
    if (typeof form.onsubmit == "function")
        okToSubmit = form.onsubmit();
    if (okToSubmit)
        form.submit();
    return false;
}
function validateVideoFileName(fileExtensions) {
    var action = gel('sys_action');
    if ('sysverb_cancel' == action.value)
        return true;
    var widget = gel("attachFile");
    if (!widget)
        return false;
    var filename = widget.value;
    var isvalid = endsWithVideoExtension(filename, fileExtensions);
    if (!isvalid) {
        alert(filename + " isn't a recognized video format");
    }
    return isvalid;
}
function endsWithVideoExtension(filename, fileExtensions) {
    var extensionArray = fileExtensions.split(",");
    var dot = filename.lastIndexOf('.')+1;
    var suffix = filename.substring(dot);
    suffix = suffix.toLowerCase();
    for (i = 0; i < extensionArray.length; i++) {
        var element = extensionArray[i];
        if (element == suffix)
            return true;
    }
    return false;
}
function validateImageFileName() {
    var action = gel('sys_action');
    if ('sysverb_cancel' == action.value)
        return true;
    var widget = gel("attachFile");
    if (!widget)
        return false;
    var filename = widget.value;
    var isvalid = endsWithImageExtension(filename);
    if (!isvalid) {
        alert(filename + " isn't a recognized image file format");
    }
    return isvalid;
}
var VALID_IMAGE_SUFFIX = ["jpg", "jpeg", "png", "bmp", "gif"];
function endsWithImageExtension(filename) {
    var dot = filename.lastIndexOf('.')+1;
    var suffix = filename.substring(dot);
    suffix = suffix.toLowerCase();
    for (i = 0; i < VALID_IMAGE_SUFFIX.length; i++) {
        var element = VALID_IMAGE_SUFFIX[i];
        element = element.toLowerCase();
        if (element == suffix)
            return true;
    }
    return false;
}
function toggleQuestionRows(thisclass, display, fl) {
    forcelabels = false;
    if (fl == true)
        forcelabels = true;
    var rows = $(document.body).select('.' + thisclass);
    for (i = 0; i < rows.length; i++) {
        var element = rows[i];
        var id = element.id;
        if ('CATEGORY_LABEL' != id || forcelabels)
            element.style.display = display;
    }
    var openStyle='none';
    var closedStyle='none';
    if ('none' == display)
        openStyle = '';
    else
        closedStyle = '';
    var s = gel(thisclass+'CLOSED');
    s.style.display=closedStyle;
    s = gel(thisclass+'OPEN');
    s.style.display=openStyle;
}
function toggleWorkflow(id, expandPref) {
    var map = new GwtMessage().getMessages(['Expand', 'Collapse']);
    var table = gel("workflow." + id);
    var spans = table.getElementsByTagName("span");
    for(var i = 0; i != spans.length; i++) {
        var span = spans[i];
        if (!span.getAttribute("stage"))
            continue;
        var spanImage = gel(span.id + '.image');
        var spanText = gel(span.id + '.text');
        if (span.getAttribute("selected") == 'true')
            spanText.style.color = "#2050d0";
        var filterImg = gel('filterimg.' + id);
        if (expandPref == "false") {
            span.style.display = "";
            spanText.style.display = "none";
            filterImg.src = "images/filter_hide.gifx";
            filterImg.title = map["Expand"];
            filterImg.alt = map["Expand"];
        } else {
            span.style.display = "block";
            spanText.style.display = "";
            filterImg.src = "images/filter_reveal.gifx";
            filterImg.title = map["Collapse"];
            filterImg.alt = map["Collapse"];
        }
    }
    _frameChanged();
}
function togglePreference(id) {
    toggleItems(id);
}
function toggleItems(id, force) {
    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        var tableId = tables[i].id;
        if (tableId.indexOf("workflow.") == -1)
            continue;
        var idParts = tables[i].id.split(".");
        if (id && tableId != "workflow." + id)
            continue;
        var pref = getPref(idParts[1]);
        if (force != pref)
            toggleWorkflow(idParts[1], pref);
        if (id)
            break;
    }
}
function getPref(id) {
    var filterImgSrc = gel('filterimg.' + id).src
    if (filterImgSrc.indexOf('hide') != -1)
        return "true";
    return "false";
}
function checkForClientKeystroke(evt) {
    var evt = ie5 ? event: evt;
    if (evt && evt.keyCode == 27 && g_popup_manager)
        g_popup_manager.destroypopDiv();
    if (evt && evt.shiftKey && evt.ctrlKey && evt.keyCode == 74) {
        var gWindow = new GlideDialogWindow("client_js");
        gWindow.setTitle("JavaScript Executor");
        gWindow.setPreference('table', 'javascript_executor');
        gWindow.render();
    }
    if (typeof parent.navVisible == "function") {
        if (evt && evt.ctrlKey && evt.keyCode == 190 && !evt.shiftKey && !evt.altKey) {
            Event.stop(evt);
            if (parent.navVisible()) {
                parent.hideNav();
                parent.hide("banner_top_left");
                parent.hide("banner_top_right");
            } else {
                parent.showNav();
                parent.show("banner_top_left");
                parent.show("banner_top_right");
            }
        }
    }
}
function toggleHelp(name) {
    var wrapper = gel('help_' + name + '_wrapper');
    var image = gel('img.help_' + name + '_wrapper');
    if (wrapper.style.display=="block") {
        collapseEffect(wrapper);
        image.src = "images/filter_hide16.gifx";
    } else {
        expandEffect(wrapper)
        image.src = "images/filter_reveal16.gifx";
    }
    image.alt = new GwtMessage().getMessage("Display / Hide");
}
function validateHex(field) {
    var num = field.value;
    var valid = isHex(num);
    if (!valid) {
        var sName = '';
        if (field.name != null)
            sName = ' of '+field.name+' ';
        alert("The entered value "+sName+"is not hex.  Please correct.");
    }
}
function isHex(num) {
    var str = num.replace(new RegExp('[0-9a-fA-F]','g'),'');
    if (str.length > 0)
        return false;
    return true;
}
function setLightWeightLink(name) {
    var v = gel(name);
    if (!v)
        return;
    var link = gel(name+"LINK");
    if (!link)
        return;
    var vis = "hidden";
    if (v.value != '')
        vis = "";
    link.style.visibility = vis;
}
function loadNewPrototypes() {
    if (typeof HTMLElement != "undefined" && !HTMLElement.prototype.insertAdjacentElement) {
        HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
            where = where.toLowerCase();
            switch (where) {
                case 'beforebegin':
                    this.parentNode.insertBefore(parsedNode, this)
                    break;
                case 'afterbegin':
                    this.insertBefore(parsedNode, this.firstChild);
                    break;
                case 'beforeend':
                    this.appendChild(parsedNode);
                    break;
                case 'afterend':
                    if (this.nextSibling)
                        this.parentNode.insertBefore(parsedNode, this.nextSibling);
                    else
                        this.parentNode.appendChild(parsedNode);
                    break;
            }
        }
        HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
            var r = this.ownerDocument.createRange();
            r.setStartBefore(this);
            var parsedHTML = r.createContextualFragment(htmlStr);
            this.insertAdjacentElement(where, parsedHTML)
        }
        HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
            var parsedText = document.createTextNode(txtStr)
            this.insertAdjacentElement(where, parsedText)
        }
    }
}
function enterBreadCrumb(id) {
    var m = gel("m_" + id);
    if (m)
        m.className = 'breadCrumbDelete';
}
function exitBreadCrumb(id) {
    var m = gel("m_" + id);
    if (!m)
        return;
    m.className = 'breadCrumb';
}
function styleBreadCrumbs(e, className) {
    e = e.nextSibling;
    while (e) {
        if (e.tagName == "SPAN")
            e.className = className;
        e = e.nextSibling;
    }
}
function toggleMode(id) {
    var widget = gel("ni_mode_" + id);
    if (!widget)
        return;
    widget.onchange();
}
function toggleDebug(id) {
    id = id.split('.')[1];
    for (var i =0; i < 1000; i++) {
        var widgetName = 'debug.' + id + '.' + i;
        var w = $(widgetName);
        if (!w)
            return;
        w.toggle();
    }
}
function saveOrDelete(e) {
    if (e.keyCode == 68 && e.ctrlKey == true && e.shiftKey == false && e.altKey == false) {
        var headerElements = $(document.body).select(".header"); // section_head_right.xml adds buttons with class "header"
        var eSize = headerElements.length;
        for (var i = 0; i < eSize; i++) { // loop through the elements with class "header"
            var element = headerElements[i];
            if (element.id=="sysverb_delete") { // check whether it is actually a Delete button
                if (element.disabled == false) { // do not pick a disabled button
                    var source = Event.element(e); // get the element that generated the event
                    source.blur(); // blur the current element so that any blur-triggered events will run
                    setTimeout(function(){
                        element.onclick();
                    }, 0);
                    return false; // return false so we do not try to submit the form
                }
            }
        }
    }
    if (e.keyCode == 83 && e.ctrlKey == true && e.shiftKey == false && e.altKey == false) {
        var source = Event.element(e); // get the element that generated the event
        source.blur(); // blur the current element so that any blur-triggered events will run
        gsftSubmit(gel('sysverb_update_and_stay'));
        return false;
    }
    return true;
}
/**
* Handle the 'enter_submits_form' user preference.  If we are currently focused on a button, run its JavaScript
* regardless of the preference as this is the way most browsers handle this.  If we are not on a button and we
* are to submit forms, find the first non-disabled action button and run its JavaScript.  If we are not to submit
* forms, just return false to stop the browser from submitting the form.
* Note that we make an exception for textarea elements because we want the ENTER key to insert carraige control
* in these fields.
**/
function enterSubmitsForm(e, enter_submits_form) {
    if (e.keyCode != 13) // if not the ENTER key, continue as usual
        return true;
    if (e.ctrlKey == true) // do not submit on Ctrl+M
        return false;
    var source = Event.element(e); // get the element that generated the event
    if (source && source.type=="textarea") // for text areas, let the enter pass through so carriage control is inserted
        return true;
    if (source && source.type == "submit") { // check whether it is actually a submit button
        if (source.disabled == false) { // do not attempt a disabled button
            source.onclick(); // run the onclick JavaScript for the button
            return false; // return false so we do not try to submit the form
        }
    }
    if (enter_submits_form == 'false') // if we are not to submit the form, just return false
        return false;
    var headerElements = $(document.body).select(".header"); // section_head_right.xml adds buttons with class "header"
    var eSize = headerElements.length;
    for (var i=0; i < eSize; i++) { // loop through the elements with class "header"
        var element = headerElements[i];
        if (element.type=="submit") { // check whether it is actually a submit button
            if (element.disabled == false) { // do not pick a disabled button
                source.blur(); // blur the current element so that any blur-triggered events will run
                setTimeout(function(){
                    element.onclick();
                }, 0);
                return false; // return false so we do not try to submit the form
            }
        }
    }
    return false; // maybe we didn't have any action buttons at all, return false so we do not try to do anything
}
function gsftPrompt(title, question, onPromptComplete, onPromptCancel) {
    var dialog = new GlideDialogWindow('glide_prompt', false);
    dialog.setTitle(title);
    dialog.setPreference('title', question);
    dialog.setPreference('onPromptComplete', onPromptComplete);
    dialog.setPreference('onPromptCancel', onPromptCancel);
    dialog.render();
}
function gsftConfirm(title, question, onPromptSave, onPromptCancel, onPromptDiscard) {
    var dialog = new GlideDialogWindow('glide_confirm', false);
    dialog.setTitle(title);
    dialog.setPreference('title', question);
    dialog.setPreference('onPromptSave', onPromptSave);
    dialog.setPreference('onPromptCancel', onPromptCancel);
    dialog.setPreference('onPromptDiscard', onPromptDiscard);
    dialog.render();
}