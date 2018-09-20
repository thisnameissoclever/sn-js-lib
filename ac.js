//defer ac.js
var g_isInternetExplorer = document.all && document.getElementById
var KEY_RETURN      = 3;
var KEY_BACKSPACE   = 8;
var KEY_TAB         = 9;
var KEY_ENTER       = 13;
var KEY_PAGEUP      = 33;
var KEY_PAGEDOWN    = 34;
var KEY_END         = 35;
var KEY_HOME        = 36;
var KEY_ARROWLEFT   = 37;
var KEY_ARROWUP     = 38;
var KEY_ARROWRIGHT  = 39;
var KEY_ARROWDOWN   = 40;
var KEY_INSERT      = 45;
var KEY_DELETE      = 46;
var NO_INVISIBLE    = 0;
var itemHeight      = 16;
var ctimeVal;
var TAG_DIV = "div";
var TAG_SPAN = "span";
var ONE_TO_MANY = "OTM";
var g_ac_objects = new Array();
function acKeyDown(evt, elementName, type, dependent) {
    var typedChar = getKeyCode(evt);
    if (typedChar == KEY_ARROWDOWN || typedChar == KEY_ARROWUP)
        fieldChange(evt, elementName, type, dependent);
}
function acKeyUp(evt, elementName, type, dependent) {
    var typedChar = getKeyCode(evt);
    if (typedChar != KEY_ARROWDOWN && typedChar != KEY_ARROWUP)
        fieldChange(evt, elementName, type, dependent);
}
function fieldChange(event, elementName, type, dependent) {
    if (document.readyState && document.readyState != "complete") {
        jslog("fieldChange delayed due to document not being ready");
        return;
    }
    var table = elementName.split('.')[0];
    var additional = null;
    if (dependent != null) {
        var dparts = dependent.split(",");
        var el = document.getElementsByName(table + "." + dparts[0])[0];
        if (el != null) {
            var selectValue = "";
            if (el.tagName == "INPUT") {
                var selectValue = el.value;
            } else {
                selectValue = el.options[el.selectedIndex].value;
            }
            additional = "sysparm_value=" + selectValue;
        }
    }
    fieldProcess(event, elementName, type, false, true, null, additional);
}
function fieldProcess(evt, elementName, type, noMax, useInvisible, uFieldName, additional, refField) {
    var typedChar = getKeyCode(evt);
    var evalText = "fieldProcessNow('" + typedChar + "', " +
    "'" + elementName + "', " +
    "'" + type + "', " +
    noMax + ", " +
    useInvisible + ", " +
    (uFieldName != null ? "'" + uFieldName + "'" : "null") + ", " +
    (additional != null ? "\"" + additional + "\"" : "null") + ", " +
    (refField != null ? "'" + refField + "'" : "null") +
    ");";
    if (ctimeVal > 0 && typedChar != 0)
        clearTimeout(ctimeVal);
    var displayField;
    var invisibleField;
    if (type == "Reference") {
        displayField = gel("sys_display." + elementName);
        if (useInvisible)
            invisibleField = gel(elementName);
    } else {
        displayField = gel(elementName);
        if (useInvisible)
            invisibleField = gel("sys_display." + elementName);
    }
    var updateField;
    if (uFieldName != null)
        updateField = gel(uFieldName);
    var ac = displayField.ac;
    if (ac == null) {
        ac = getAC(displayField.name);
        if (ac == null) {
            ac = newAC(displayField, invisibleField, updateField, elementName, type);
            if (ac.isOTM())
                ac.refField = refField;
        }
    }
    if (typedChar != KEY_TAB) {
        ac.fieldChanged = true;
        ac.matched = false;
        ac.ignoreAJAX = false;
        if (ac.type == 'Reference')
            ac.dirty = true;
    }
    var waitTime = 50;
    if (typedChar == KEY_ARROWDOWN || typedChar == KEY_ARROWUP || typedChar == NO_INVISIBLE)
        waitTime = 0;
    ctimeVal = setTimeout(evalText, g_acWaitTime || waitTime);
}
function initAutoCompleteField(ac) {
    if (ac.getUpdateField())
        return;
    Event.observe(ac.getField(), 'blur', fieldBlurred.bind(ac.getField()), false);
    setDropDownSizes();
    setStyle(ac.getMenu(), "dropDownTableStyle");
    window.onresize = setDropDownSizes;
    setSavedText(ac, new Array((ac.getInvisibleField() ? ac.getInvisibleField().value : null), ac.getField().value));
    var request = new Object();
    request.responseXML = new Object();
    request.responseXML.ac = ac;
    storeResults(ac, "", request);
}
function setDropDownSizes() {
    for(var i = 0; i < g_ac_objects.length; i++) {
        var ac = g_ac_objects[i];
        if (!ac)
            continue;
        setDropDownSize(ac);
    }
}
function setDropDownSize(ac) {
    var field = ac.getField();
    var mLeft = grabOffsetLeft(field) + "px";
    var mTop = grabOffsetTop(field) + (field.offsetHeight - 1) + "px";
    var mWidth = estimateWidth(ac) + "px";
    var menu = ac.getMenu();
    if (menu.offsetWidth > parseInt(mWidth))
        mWidth = menu.offsetWidth + "px";
    acSetTopLeftWidth(menu.style, mTop, mLeft, mWidth);
    var iframe = ac.getIFrame();
    if (iframe)
        acSetTopLeftWidth(iframe.style, mTop, mLeft, mWidth);
}
function acSetTopLeftWidth(style, top, left, width) {
    style.left = left;
    style.top = top;
    style.width = width;
}
function estimateWidth(ac) {
    var field = ac.getField();
    if (g_isInternetExplorer)
        return field.offsetWidth - (ac.menuBorderSize * 2);
    else
        return field.offsetWidth;
}
function fieldBlurred() {
    var theField = this;
    var ac = theField.ac;
    ac.ignoreAJAX = true;
    var cc = ac.getField().value;
    if (cc.indexOf("javascript:") != 0) {
        if (ac.type == 'Reference' && ac.matched == false && ac.fieldChanged == true) {
            setReferenceField(ac, cc);
        }
    }
    ac.matched = false;
    ac.fieldChanged = false;
    ac.previousTextValue = '';
    checkForDirty(ac);
    ac.hideDropDown();
}
function setReferenceField(ac, cc) {
    var encodedText = encodeText(cc);
    var url = "xmlhttp.do?sysparm_processor=" + ac.type +
    "&sysparm_name=" + ac.elementName +
    "&sysparm_exact_match=yes" +
    "&sysparm_chars=" + encodedText +
    "&sysparm_type=" + ac.type;
    var response = serverRequestWait(url);
    var items = response.responseXML.getElementsByTagName("item");
    if (items.length == 1) {
        var item = items[0];
        var name = trim(item.getAttribute("name"));
        var label = trim(item.getAttribute("label"));
        ac.getField().value = label;
        ac.getInvisibleField().value = name;
    } else {
        var e = ac.getField();
        var f = e.filter;
        if (!f || f == '') {
            ac.getInvisibleField().value = "x";
            ac.getField().value = "";
            ac.getInvisibleField().value = "";
        }
    }
    fieldSet(ac);
    refFlipImage(ac.getField(), ac.elementName);
    ac.dirty = true;
}
function stripNewlines(data) {
    var retData = "";
    var Ib = "\n\r";
    for(var c=0; c < data.length; c++) {
        if (Ib.indexOf(data.charAt(c))==-1)
            retData += data.charAt(c);
        else
            retData += " ";
    }
    return retData;
}
function grabMenuInfo(j) {
    var spanTag=j.getElementsByTagName(TAG_SPAN);
    var spanInfo = new Array();
    if (!spanTag)
        return spanInfo;
    for(var i = 0; i < spanTag.length; i++) {
        var e = spanTag[i];
        if ( e.className != "selected_item" )
            continue;
        var spanData = e.innerHTML;
        if ( spanData != "&nbsp;" ) {
            spanInfo = new Array(e.gname, stripNewlines(e.glabel));
        }
        break;
    }
    return spanInfo;
}
function storeResults(ac, searchString, req) {
    ac.resultsStorage[searchString] = req;
}
function retrieveStorage(ac, textStr) {
    return ac.resultsStorage[textStr];
}
function storeZeroString(ac, searchString, req) {
    ac.emptyResults[searchString] = req;
}
function findRelatedZeroString(ac, searchString) {
    for(var str in ac.emptyResults) {
        if (searchString.substring(0, str.length) == str) {
            return ac.emptyResults[str];
        }
    }
}
var handleClickedDropDown=function() {
    setAllText(this.ac, grabMenuInfo(this));
    this.ac.dirty = false;
}
var handleMouseOverDropDown = function() {
    setStyle(this,"selectedItemStyle");
}
var handleMouseOutDropDown = function() {
    setStyle(this, "nonSelectedItemStyle");
}
function dropDownHilight(ac, direction) {
    setTextField(ac, new Array((ac.getInvisibleField() ? ac.savedInvisibleTextValue : null), ac.savedTextValue));
    ac.matched = true;
    if (!ac.currentMenuItems || ac.currentMenuCount <= 0 )
        return;
    ac.showDropDown();
    var toSelect = ac.selectedItemNum + direction;
    if (toSelect >= ac.currentMenuCount)
        toSelect = ac.currentMenuCount - 1;
    if (ac.selectedItemNum != -1 && toSelect != ac.selectedItemNum) {
        setStyle(ac.selectedItemObj,"nonSelectedItemStyle");
        ac.selectedItemNum = -1;
    }
    if (toSelect < 0) {
        ac.selectedItemNum = -1;
        ac.getField().focus();
        return;
    }
    ac.selectItem(toSelect);
    setStyle(ac.selectedItemObj, "selectedItemStyle");
    setTextField(ac, grabMenuInfo(ac.selectedItemObj));
    ac.dirty = true;
}
function setPreviousText(ac, textArray) {
    if (textArray[1] != null)
        ac.previousTextValue = textArray[1];
}
function setSavedText(ac, textArray) {
    ac.setSavedText(textArray);
}
function setTextValue(ac, textArray) {
    ac.textValue = textArray[1].replace(/\r\n/g, "\n");
    if (textArray[0] != null && ac.getInvisibleField()) {
        ac.invisibleTextValue = textArray[0];
    }
}
function setTextField(ac, textArray) {
    var f;
    if (textArray[0] != null && ac.getInvisibleField()) {
        f = ac.getInvisibleField();
        f.value = textArray[0];
    }
    f = ac.getField();
    f.value = textArray[1];
    fireOnFormat(ac);
}
function setAllText(ac, textArray) {
    setSavedText(ac, textArray);
    setTextValue(ac, textArray);
    setTextField(ac, textArray);
    setPreviousText(ac, textArray);
    fieldSet(ac);
}
function fieldSet(ac) {
    ac.dirty = false;
    ac.matched = true;
    updateRelated(ac);
    fireChange(ac);
    fireOnFormat(ac);
}
function fireChange(ac) {
    callOnChange(ac.getInvisibleField());
    callOnChange(ac.getField());
}
function callOnChange(f) {
    if (!f)
        return;
    if (f["onchange"])
        f.onchange();
}
function fireOnFormat(ac) {
    var f = ac.getField();
    if (f.getAttribute("onformat"))
        eval(f.getAttribute("onformat"));
}
function updateRelated(ac) {
    var elementName = ac.elementName;
    var elementValue = ac.invisibleTextValue;
    if (elementValue != '')
        updateRelatedGivenNameAndValue(elementName, elementValue);
    if (ac["fCall"]) {
        var onset = ac["fCall"];
        eval(onset);
    }
}
function clearRelated(ac) {
    var elementName = ac.elementName;
    var nodes = document.getElementsByTagName('input');
    var sName = elementName+".";
    for (var i=0; i<nodes.length; i++ ) {
        var current = nodes[i];
        var id = current.id;
        var index = id.indexOf(sName);
        if (index == -1)
            continue;
        index = id.lastIndexOf(".");
        var fName = id.substring(index+1, id.length);
        var select = gel(elementName + "." + fName);
        if (select != null) {
            var x = select.tagName;
            if (x == 'select' || x == 'SELECT') {
                var selindex = select.selectedIndex;
                if (selindex != -1) {
                    var option = select.options[selindex];
                    option.selected = false;
                }
                var options = select.options;
                for (oi=0; oi<options.length; oi++) {
                    var option=options[oi];
                    var optval = option.value;
                    if (optval == '') {
                        option.selected = true;
                        break;
                    }
                }
            }
        }
        current.value='';
    }
}
function setStyle(child, styleName) {
    child.className = styleName;
    var style = child.style;
    var ac = child.ac;
    if (styleName == "dropDownTableStyle") {
        style.fontSize="13px";
        style.fontFamily="arial,sans-serif";
        style.wordWrap="break-word";
    } else if (styleName == "nonSelectedItemStyle") {
        ac.setNonSelectedStyle(child);
    } else if (styleName == "selectedItemStyle") {
        ac.setSelectedStyle(child);
    } else if (styleName == "dropDownRowStyle") {
        style.display="block";
        style.paddingLeft= 3;
        style.paddingRight= 3;
        style.height = itemHeight + "px";
        style.overflow ="hidden";
        style.whiteSpace = "nowrap";
    }
}
function createDropDown(ac, foundStrings) {
    ac.clearDropDown();
    for(var c = 0; c < foundStrings.length; c++) {
        var child = createChild(ac, foundStrings[c]);
        ac.appendItem(child);
    }
    setSavedText(ac, new Array((ac.getInvisibleField()? ac.invisibleTextValue : null), ac.textValue));
    if ( ac.currentMenuCount != 0 ) {
        var height = (itemHeight * ac.currentMenuCount) + 4;
        ac.setHeight(height);
    }
    ac.selectedItemObj = null;
    ac.selectedItemNum = -1;
}
function createChild(ac, sa) {
    var theDiv = cel(TAG_DIV);
    theDiv.ac = ac;
    setStyle(theDiv, "nonSelectedItemStyle");
    theDiv.onmousedown = handleClickedDropDown;
    theDiv.onmouseover = handleMouseOverDropDown;
    theDiv.onmouseout = handleMouseOutDropDown;
    var menuRow = cel(TAG_SPAN);
    setStyle(menuRow, "dropDownRowStyle");
    if (false && sa.length == 4) {
        var r = cel(TAG_SPAN);
        r.innerHTML = sa[3];
        menuRow.appendChild(r);
        r = cel(TAG_SPAN);
        r.innerHTML = "&nbsp;";
        menuRow.appendChild(r);
    }
    var itemInRow = cel(TAG_SPAN);
    itemInRow.innerHTML = sa[1].escapeHTML();
    itemInRow.gname = sa[0];
    if (ac.type == "PickList")
        itemInRow.glabel = sa[2];
    else
        itemInRow.glabel = sa[1];
    itemInRow.className = "selected_item";
    menuRow.appendChild(itemInRow);
    theDiv.appendChild(menuRow);
    return theDiv;
}
function encodeText(txt) {
    if (encodeURIComponent)
        return encodeURIComponent(txt);
    if (escape)
        return escape(txt);
}
function newAC(fld, invfld, ufld, elementName, type) {
    var name = fld.name + "_form";
    var ac = new AJAXOtherCompleter(name, elementName);
    ac.setType(type);
    ac.setField(fld);
    ac.setInvisibleField(invfld);
    ac.setUpdateField(ufld);
    var oCount = g_ac_objects.length;
    g_ac_objects[oCount] = ac;
    initAutoCompleteField(ac);
    ac.firstUse = true;
    return ac;
}
function removeAC(name) {
    for(var i = 0; i < g_ac_objects.length; i++) {
        if (g_ac_objects[i] == null)
            continue;
        if (g_ac_objects[i].elementName == name)
            g_ac_objects[i] = null;
    }
}
function getAC(name) {
    for(var i = 0; i < g_ac_objects.length; i++) {
        if (g_ac_objects[i] == null)
            continue;
        if (g_ac_objects[i].name == name)
            return g_ac_objects[i];
    }
    return getacPerInput(name);
}
function getacPerInput(elementName) {
    var f = gel("sys_display." + elementName);
    if (f != null && f.ac != null)
        return f.ac;
    f = gel(elementName);
    if (f != null && f.ac != null)
        return f.ac;
    return null;
}
function checkEnter(e, elementName) {
    var ac = getAC(elementName);
    if (ac == null)
        return true; // continue event processing
    var keyCode = getKeyCode(e);
    if (keyCode == KEY_ENTER) {
        if (ac.type != 'PickList') {
            Event.stop(e); // pressing enter should add the email to the list but not submit the form
            return false; //cancel the event
        }
    }
    return true; // continue event processing
}
function checkForDirty(ac) {
    if (!ac.dirty)
        return;
    setTextValue(ac, new Array((ac.getInvisibleField() ? ac.getInvisibleField().value : null), ac.getField().value));
    fieldSet(ac);
}
function fieldChangeSlush(event, elementName, type, noMax, uFieldName, additional) {
    fieldProcess(event, elementName, type, noMax, false, uFieldName, additional);
}
function fieldChangeSlush1(event, elementName, fieldName, type, noMax, uFieldName) {
    var filter = getFilter();
    displayField = document.getElementsByName(elementName)[0];
    displayField.value = filter;
    fieldProcess(event, elementName, ONE_TO_MANY, noMax, false, uFieldName, 1, fieldName);
}
function fieldChangeSlush2(event, elementName, fieldName, type, noMax, uFieldName, queryAddOn, additional, fDiv) {
    var filter = getFilter(elementName, '', fDiv);
    filter += "^" + queryAddOn;
    displayField = gel(elementName);
    displayField.value = filter;
    fieldProcess(event, elementName, ONE_TO_MANY, noMax, false, uFieldName, additional, fieldName);
}
function updateSlushField(ac, values) {
    var updateField = ac.getUpdateField();
    destroyUpdateField(ac);
    if (values != null) {
        for(var zi = 0; zi < values.length; zi++) {
            updateField.options[zi] = new Option(values[zi][1], values[zi][0]);
        }
    }
    if (updateField["onchange"])
        updateField.onchange();
}
function destroyUpdateField(ac) {
    ac.getUpdateField().options.length = 0;
}
function getKeyCode(e) {
    if (e == null)
        return 0;
    return g_isInternetExplorer ? event.keyCode : e.keyCode;
}
function fieldProcessNow(typedChar, elementName, type, noMax, useInvisible, uFieldName, additional, refField) {
    var displayField;
    var invisibleField;
    var updateField;
    if (type == "Reference") {
        displayField = gel("sys_display." + elementName);
        if (useInvisible)
            invisibleField = gel(elementName);
    } else {
        displayField = gel(elementName);
        if (useInvisible)
            invisibleField = gel("sys_display." + elementName);
    }
    if (uFieldName != null)
        updateField = gel(uFieldName);
    var ac = displayField.ac;
    if (ac == null) {
        ac = getAC(displayField.name);
        if (ac == null) {
            ac = newAC(displayField, invisibleField, updateField, elementName, type);
            if (ac.isOTM())
                ac.refField = refField;
        }
    }
    var eDep = displayField;
    var itemName = eDep.getAttribute("function");
    if (itemName != null)
        ac.fCall = itemName;
    setTextValue(ac, new Array((invisibleField ? invisibleField.value : null), displayField.value));
    if ( typedChar == KEY_TAB )
        return;
    ac.fieldChanged = true;
    if ( typedChar != 0 || updateField || ac.isOTM() ) {
        if ( ac.isOTM() || ((typedChar == KEY_ARROWDOWN || typedChar == KEY_ARROWUP) && !updateField )) {
            if (ac.isOTM() || !ac.isVisible()) {
                if (ac.isOTM())
                    searchForData(ac, elementName, 'M2MList', noMax, additional);
                else
                    searchForData(ac, elementName, type, noMax, additional);
            } else {
                ac.showDropDown();
                dropDownHilight(ac, typedChar == KEY_ARROWUP ? -1 : 1 );
            }
        } else {
            if (!updateField)
                setSavedText(ac, new Array((invisibleField ? ac.invisibleTextValue : null), ac.textValue));
            if (typedChar != KEY_ENTER && typedChar != KEY_RETURN) {
                if (ac.firstUse || ac.previousTextValue != ac.textValue) {
                    searchForData(ac, elementName, type, noMax, additional);
                    ac.firstUse = false;
                } else
                    clearRelated(ac);
            } else {
                var selectedItemNum = ac.selectedItemNum; // hide drop down will destroy this so save it first
                ac.hideDropDown();
                if (ac.matched == false && selectedItemNum == -1) {
                    jslog("Enter hit without matches, ignoring it");
                    return;
                }
                fieldSet(ac);
                ac.previousTextValue = '';
            }
        }
    }
}
function updateRelatedGivenNameAndValue(elementName, elementValue) {
    var viewField = gel("view." + elementName);
    if (viewField == null)
        return;
    viewField.style.display = "inline";
    var viewRField = gel("viewr." + elementName);
    var viewHideField = gel("view." + elementName + ".no");
    if (viewRField != null)
        viewRField.style.display = "inline";
    if (viewHideField != null)
        viewHideField.style.display = "none";
    if (typeof(g_form) == 'undefined')
        return;
    var list = g_form.getDerivedFields(elementName);
    if (list == null)
        return;
    var url = "xmlhttp.do?sysparm_processor=GetReferenceRecord" +
    "&sysparm_name=" + elementName +
    "&sysparm_value=" + elementValue;
    var args = new Array(elementName,list.join(','));
    serverRequest(url, refFieldChangeResponse, args);
}
function emptySubstr(ac) {
    return findRelatedZeroString(ac, ac.textValue);
}
function searchForData(ac, elementName, type, noMax, additional) {
    var cachedData;
    if (!additional && !ac.isOTM())
        cachedData = retrieveStorage(ac, ac.textValue);
    window.status = "Searching for: " + ac.textValue;
    if (emptySubstr(ac))
        cachedData = emptySubstr(ac);
    if (cachedData) {
        fieldChangeResponse(cachedData, true);
    } else {
        var encodedText = encodeText(ac.textValue);
        var url = "sysparm_processor=" + type +
        "&sysparm_name=" + elementName +
        "&sysparm_chars=" + encodedText +
        "&sysparm_nomax=" + noMax +
        "&sysparm_type=" + type;
        if (ac.isOTM())
            url += "&sysparm_field=" + ac.refField;
        if (additional)
            url += "&" + additional;
        if (type != "Reference" && typeof(g_form) != "undefined")
            url += "&" + g_form.serialize();
        serverRequestPost("xmlhttp.do", url, fieldChangeResponse);
        var target = ac.getField();
        if (target.type != 'hidden')
            ac.getField().focus();
    }
    setPreviousText(ac, new Array(ac.invisibleTextValue, ac.textValue));
}
function fieldChangeResponse(request, nozero) {
    if (request == null)
        return;
    var ac = request.responseXML.ac;
    if (request.responseXML.documentElement) {
        var xml = request.responseXML;
        var items = xml.getElementsByTagName("item");
        var e = xml.documentElement;
        var elementName = e.getAttribute("sysparm_name");
        var searchText = e.getAttribute("sysparm_chars");
        var type = e.getAttribute("sysparm_type");
        var displayField;
        var invisibleField;
        if (type == "Reference") {
            displayField = gel("sys_display." + elementName);
            invisibleField = gel(elementName);
        } else {
            displayField = gel(elementName);
            invisibleField = gel("sys_display." + elementName);
        }
        var ac = displayField.ac;
        if (ac.ignoreAJAX == true)
            return;
        var values = new Array();
        window.status = "Matches" + (searchText? " for " + searchText : "") + ": " + items.length;
        if (items.length == 0) {
            if (ac.getInvisibleField())
                ac.getInvisibleField().value = "";
            if (nozero != true)
                storeZeroString(ac, searchText, request);
        }
        if (searchText && ac.textValue && searchText != ac.textValue)
            return;
        storeResults(ac, (searchText? searchText : ""), request);
        for(var iCnt = 0; iCnt < items.length; iCnt++) {
            var item = items[iCnt];
            var name = item.getAttribute("name");
            var label = item.getAttribute("label");
            var value = item.getAttribute("value");
            var className = item.getAttribute("sys_class_name");
            value = replaceRegEx(value, document, elementName.split(".")[0]);
            values[values.length] = new Array(name, label, value, className);
        }
        if (type == "Reference") {
            if (items.length == 1 && searchText != null && fieldMatches(searchText, items[0].getAttribute("label"))) {
                displayField.value = items[0].getAttribute("label");
                invisibleField.value = items[0].getAttribute("name");
                fieldSet(ac);
            } else {
                var viewField = document.getElementById("view." + elementName);
                var viewHideField = document.getElementById("view." + elementName + ".no");
                if (viewField != null)
                    viewField.style.display = "none";
                if (viewHideField != null)
                    viewHideField.style.display = "inline";
                invisibleField.value = "";
                ac.dirty = true;
            }
        }
        if (ac.getUpdateField()) {
            updateSlushField(ac, values);
        } else {
            createDropDown(ac, values);
            ac.showDropDown();
        }
    } else {
        window.status = "";
        if (ac.getUpdateField())
            updateSlushField(ac, null);
        else {
            clearRelated(ac);
            ac.clearDropDown();
        }
    }
    if ( !ac.getUpdateField() && ac.currentMenuCount < 1 )
        ac.hideDropDown();
}
function fieldMatches(search, retitem) {
    if (search.length >= retitem.length) {
        var cc = retitem.substring(0, search.length);
        if (search.toLowerCase() == cc.toLowerCase()) {
            return true;
        }
    }
    return false;
}
function lightWeightReferenceLink(inputName, tableName) {
    if (typeof(g_cart) != 'undefined') {
        g_cart.showReferenceForm(inputName, tableName);
        return;
    }
    var input = gel(inputName);
    var sys_id = input.value;
    var url = tableName + ".do?sys_id=" + sys_id;
    var frame = top.gsft_main;
    if (!frame)
        frame = top;
    frame.location = url;
}
function clearDependents(name) {
    var nodes = document.getElementsByTagName('input');
    for (var i = 0; i < nodes.length; i++ ) {
        var current = nodes[i];
        var dependentField = current.dependent_field;
        if (!dependentField)
            continue;
        if (name == dependentField) {
            current.value = "";
            var ac = getAC(current.name);
            if (ac) {
                ac.resultsStorage = new Object();
                ac.emptyResults = new Object();
            }
            clearDependents(current.id);
        }
    }
}