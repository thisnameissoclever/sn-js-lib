//defer spell.js
var TAG_DIV         = "div";
var TAG_SPAN        = "span";
var TAG_FORM        = "form";
var TAG_TEXTAREA    = "textarea";
var TAG_INPUT       = "input";
var TAG_A           = "a";
var SMENU_TAG       = "_suggestmenu";
var DISPLAY_TAG     = "_display";
var MENU_BGCOLOR    = "#DDDDDD";
var HTML_TEXT       = 0;
var FLAT_TEXT       = 1;
var POSITION        = 0;
var WORD            = 1;
var SETWORD         = 2;
var MODE            = 3;
var SUGGESTS        = 4;
var TEXT_MODE       = 0;
var BOX_MODE        = 1;
var ITEM_HEIGHT     = 16;
var FONT_SIZE       = 9;
var FONT_FACE       = "Arial";
var PREVIEW_BORDER  = 1;
var PREVIEW_PADDING = 2;
var SUGGEST_TOP_BORDER  = 3;
var SUGGEST_BOT_BORDER  = 2;
var mods        = new Array();
var originalSpellValue = new Array();
var keys = ["Checking...", "Resume", "Resume editing", "No misspellings found"];
var processing = false;
function spellCheck(elementName) {
    var msgs = new GwtMessage().getMessages(keys);
    var linkName = "link." + elementName;
    var link = getObjectByName(linkName, TAG_A);
    var textField = getObjectByName(elementName, TAG_TEXTAREA);
    if (textField == null)
        textField = getObjectByName(elementName, TAG_INPUT);
    textField.parentNode.onsubmit = saveAllChanges;
    if (!link.savedHTML)
        link.savedHTML = link.innerHTML;
    setStatus(linkName, msgs["Checking..."]);
    jslog("element:  " + elementName);
    if (!textField.mode) {
        if (!processing)
            grabSpellData(elementName, textField, linkName, msgs);
    } else {
        var previewDiv = getObjectByName(elementName + DISPLAY_TAG, TAG_DIV);
        setStatus(linkName, "");
        textField.mode = 0;
        updateTextBox(elementName);
        hideDiv(previewDiv);
        hideAllMenus();
        delete originalSpellValue[elementName];
    }
}
function displaySpellText(elementName) {
    var sDiv = getObjectByName(elementName + DISPLAY_TAG, TAG_DIV);
    var textField = getObjectByName(elementName, TAG_TEXTAREA);
    if (textField == null)
        textField = getObjectByName(elementName, TAG_INPUT);
    var scroll = 'auto';
    if (textField.tagName == 'INPUT')
        scroll = 'visible';
    if (!sDiv) {
        sDiv = createEditDiv(elementName + DISPLAY_TAG, textField, scroll);
        addChild(sDiv);
    }
    var displayText = buildDisplayText(elementName, HTML_TEXT);
    sDiv.innerHTML = "<pre wrap='wrap' style=\"" +
    "margin-top: 0px; margin-bottom: 0px; " +
    "font-family: " + FONT_FACE + "; " +
    "white-space: pre-wrap; " +
    "word-wrap: break-word; " +
    "font-size: " + FONT_SIZE + "pt;" +
    "\">" + displayText + "</pre>";
    saveAllChanges();
    showDiv(sDiv);
}
function buildDisplayText(elementName, flatText) {
    var rText;
    var prevPos = 0;
    var curPos = 0;
    var spellCheckText = new Array();
    var textField = getObjectByName(elementName, TAG_TEXTAREA);
    if (textField == null)
        textField = getObjectByName(elementName, TAG_INPUT);
    var baseText = textField.value;
    for(var zo = 0; zo < mods[elementName].length; zo++) {
        var mod = mods[elementName][zo];
        var zPos = mod[POSITION];
        var zWord = mod[WORD];
        var zSetWord = mod[SETWORD];
        var zMode = mod[MODE];
        var fName = buildRefID(elementName, zPos);
        if ((zPos - 1) > 0) {
            spellCheckText.push(baseText.substring(prevPos, zPos));
            curPos += zPos - prevPos;
        }
        if (flatText) {
            if (zMode == BOX_MODE) {
                var iField = getObjectByName(fName, TAG_INPUT);
                spellCheckText.push(iField.value);
                mod[WORD] = iField.value;
                mod[POSITION] = curPos;
            } else {
                spellCheckText.push(zSetWord);
                mod[WORD] = zSetWord;
                mod[POSITION] = curPos;
            }
        } else {
            if (zMode == BOX_MODE) {
                var iField = getObjectByName(fName, TAG_INPUT);
                if (iField)
                    zSetWord = iField.value;
                spellCheckText.push("<input type=input " +
                    "id=\"" + fName + "\" name=\"" + fName + "\" " +
                    "style=\"font-weight: bold; font-family: " + FONT_FACE +
                    "; font-size: " + FONT_SIZE +
                    "pt; color: black;\"" +
                    "value=\"" + zSetWord + "\" " +
                    "size=" + ((zWord.length < 4 ? 4 : zWord.length - 2)) + ">");
            } else {
                spellCheckText.push("<a " +
                    "id=\"" + fName + "\" name=\"" + fName + "\" " +
                    "style=\"color: " +
                    (zWord == zSetWord ? "red" : "green") +
                    "; font-weight: bold;\" onclick=\"showSuggestions(" +
                    zo + ", '" + fName +
                    "', '" + elementName + "');Event.stop(event);\">" + zSetWord + "</a>");
            }
        }
        prevPos = parseInt(zPos) + (zWord.length);
        curPos += mod[WORD].length;
    }
    spellCheckText.push(baseText.substring(prevPos));
    rText = spellCheckText.join("")
    return rText;
}
function buildRefID(elementName, position) {
    return elementName + "_pos_" + position;
}
function hideDiv(theDiv) {
    if (theDiv)
        theDiv.style.visibility = "hidden";
}
function showDiv(theDiv) {
    if (theDiv)
        theDiv.style.visibility = "visible";
}
function createEditDiv(id, field, overflow) {
    var menu = document.createElement(TAG_DIV);
    menu.id = id;
    menu.name = id;
    menu.style.borderRight="black " + PREVIEW_BORDER + "px solid";
    menu.style.borderLeft="black " + PREVIEW_BORDER + "px solid";
    menu.style.borderTop="black " + PREVIEW_BORDER + "px solid";
    menu.style.borderBottom="black " + PREVIEW_BORDER + "px solid";
    menu.style.paddingRight=PREVIEW_PADDING;
    menu.style.paddingLeft=PREVIEW_PADDING;
    menu.style.paddingTop=PREVIEW_PADDING;
    menu.style.paddingBottom=PREVIEW_PADDING;
    menu.style.visibility="hidden";
    menu.style.position="absolute";
    menu.style.backgroundColor="#CCCCEE";
    menu.style.overflow=overflow;
    menu.style.fontFamily=FONT_FACE;
    menu.style.fontSize=FONT_SIZE + "pt";
    menu.style.whiteSpace="pre";
    menu.style.wordWrap="break-word";
    menu.style.zIndex = 20000;
    adjustSpellCheckEditDiv(menu, field);
    menu.onclick = hideAllMenus;
    menu.onscroll = hideAllMenus;
    menu.onkeyup = saveAllChanges;
    return menu;
}
function adjustSpellCheckEditDiv(menu, field) {
    menu.style.left = grabOffsetLeft(field) + "px";
    menu.style.top = grabOffsetTop(field) + "px";
    var setWidth = field.offsetWidth;
    var setHeight = field.offsetHeight;
    if (!isMSIE) {
        var borderSizes = ( PREVIEW_BORDER * 2 ) + ( PREVIEW_PADDING * 2);
        setHeight -= borderSizes;
        setWidth -= borderSizes;
    }
    menu.style.height = (setHeight - 2) + "px";
    menu.style.width = (setWidth - 2) + "px";
}
var hideAllMenus=function() {
    var divs = document.getElementsByTagName(TAG_DIV);
    for(var ca = 0; ca < divs.length; ca++) {
        var daDiv = divs[ca];
        var divID = daDiv.id;
        if (divID.length > SMENU_TAG.length &&
            (divID.substring(divID.length - SMENU_TAG.length) == SMENU_TAG)) {
            hideDiv(daDiv);
        }
    }
    return;
}
var saveAllChanges=function() {
    var divs = document.getElementsByTagName(TAG_DIV);
    for(var ca = 0; ca < divs.length; ca++) {
        var daDiv = divs[ca];
        var divID = daDiv.id;
        var displayTag = elementName + DISPLAY_TAG;
        if (divID.length > displayTag.length &&
            (divID.substring(divID.length - displayTag.length) == displayTag)) {
            var elementName = divID.substring(0, divID.length - DISPLAY_TAG.length);
            updateTextBox(elementName);
        }
    }
    return;
}
function createSuggestDiv(link, id, elementName) {
    var menu = document.createElement(TAG_DIV);
    menu.id = id;
    menu.name = menu.id;
    menu.elementName = elementName;
    menu.style.borderRight="gray 2px outset";
    menu.style.borderLeft="white 2px outset";
    menu.style.borderTop="white " + SUGGEST_TOP_BORDER + "px outset";
    menu.style.borderBottom="gray " + SUGGEST_BOT_BORDER + "px outset";
    menu.style.paddingRight="1";
    menu.style.paddingLeft="1";
    menu.style.paddingTop="2";
    menu.style.paddingBottom="2";
    menu.style.visibility="hidden";
    menu.style.position="absolute";
    menu.style.backgroundColor=MENU_BGCOLOR;
    menu.style.fontFamily=FONT_FACE;
    menu.style.fontSize="8pt";
    menu.style.zIndex = 20000;
    return menu;
}
function grabSpellData(nam, textField, linkName, msgs) {
    processing = true;
    mods = new Array();
    var request = findXMLObject();
    var searchURL = "xmlhttp.do";
    var textField = getObjectByName(nam, TAG_TEXTAREA);
    if (textField == null)
        textField = getObjectByName(nam, TAG_INPUT);
    var baseText = textField.value;
    originalSpellValue[nam] = baseText;
    var aj = new GlideAjax("SpellCheckerAjax");
    aj.setEncode(false);
    aj.addParam("sysparm_name", encodeText(nam));
    aj.addParam("sysparm_chars", encodeText(baseText));
    aj.getXML(afterGrabSpellData, null, [nam, textField, linkName, msgs, processing]);
}
function afterGrabSpellData(response, args) {
    if (!response || !response.responseXML)
        return;
    elementName = args[0];
    textField = args[1];
    linkName = args[2];
    msgs = args[3];
    processing = args[4];
    var changes = extractSpellChanges(response.responseXML);
    mods[elementName] = changes;
    if (changes.length) {
        textField.mode = 1;
        displaySpellText(elementName);
        if (textField.tagName == 'INPUT')
            setStatus(linkName, msgs["Resume"]);
        else
            setStatus(linkName, msgs["Resume editing"]);
    } else {
        setStatus(linkName, msgs["No misspellings found"]);
        setTimeout("setStatus('" + linkName + "', '');", 3000);
    }
    processing = false;
}
function extractSpellChanges(responseXML) {
    if (responseXML && responseXML.documentElement) {
        var items = responseXML.getElementsByTagName("match");
        var elementName = responseXML.documentElement.getAttribute("sysparm_name");
        var origText = responseXML.documentElement.getAttribute("sysparm_chars");
        for(i = 0; i < items.length; i++) {
            var item = items[i];
            var word = item.getAttribute("word");
            var pos = item.getAttribute("position");
            var sugs  = item.getElementsByTagName("suggest")
            mods[mods.length] = new Array(pos, word, word, TEXT_MODE, sugs);
        }
    }
    return mods;
}
function encodeText(txt) {
    if (encodeURIComponent)
        return encodeURIComponent(txt);
    if (escape)
        return escape(txt)
}
function findXMLObject() {
    var obj=null;
    try {
        obj=new ActiveXObject("Msxml2.XMLHTTP")
    } catch(e) {
        try {
            obj=new ActiveXObject("Microsoft.XMLHTTP")
        } catch(sc) {
            obj=null
        }
    }
    if (!obj && typeof XMLHttpRequest!="undefined") {
        obj=new XMLHttpRequest()
    }
    return obj;
}
function showSuggestions(mod, name, elementName) {
    var link = getObjectByName(name, TAG_A);
    var widSize = 6;
    if (link) {
        var previewDiv = getObjectByName(elementName + DISPLAY_TAG, TAG_DIV);
        var sugsDiv = getObjectByName(name + "_" + elementName + SMENU_TAG, TAG_DIV);
        if (!sugsDiv) {
            sugsDiv = createSuggestDiv(link, name + "_" + elementName + SMENU_TAG, elementName);
            addChild(sugsDiv);
        }
        while(sugsDiv.childNodes.length>0)
            sugsDiv.removeChild(sugsDiv.childNodes[0]);
        for(var gs = 0; gs < mods[elementName][mod][SUGGESTS].length; gs++) {
            var itemName = mods[elementName][mod][SUGGESTS][gs].getAttribute("word");
            sugsDiv.appendChild(makeMenuItem(TEXT_MODE, mod, itemName));
            if (itemName.length > widSize)
                widSize = itemName.length;
        }
        var msg = new GwtMessage().getMessage('Edit...');
        if (msg.length > widSize)
            widSize = msg.length;
        sugsDiv.appendChild(makeMenuItem(BOX_MODE, mod, "<i>" + msg + "</i>"));
        sugsDiv.style.left = grabOffsetLeft(link) + "px";
        sugsDiv.style.top = ((grabOffsetTop(link) + link.offsetHeight + 2) - previewDiv.scrollTop) + "px";
        sugsDiv.style.width = link.offsetWidth + "px";
        var menuItems = mods[elementName][mod][SUGGESTS].length + 1;
        var sHeight = (ITEM_HEIGHT * menuItems) + (SUGGEST_TOP_BORDER + SUGGEST_BOT_BORDER);
        if (navigator&&navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
            sugsDiv.style.height = sHeight;
        } else {
            sugsDiv.style.height = sHeight - (SUGGEST_TOP_BORDER + SUGGEST_BOT_BORDER);
            sugsDiv.style.width = ((FONT_SIZE - 2) * widSize-1) + "px";
        }
        showDiv(sugsDiv);
    }
}
function makeMenuItem(mode, mNum, item) {
    var theDiv=document.createElement(TAG_DIV);
    var menuRow=document.createElement(TAG_SPAN);
    var itemInRow=document.createElement(TAG_SPAN);
    theDiv.onmousedown=spellClickedDropDown;
    theDiv.onmouseover=spellMouseOverDropDown;
    theDiv.onmouseout=spellMouseOutDropDown;
    theDiv.cmod = mNum;
    theDiv.cmode = mode;
    itemInRow.innerHTML = item;
    menuRow.appendChild(itemInRow);
    theDiv.appendChild(menuRow);
    setSpellStyle(menuRow,"dropDownRowStyle");
    setSpellStyle(itemInRow,"dropDownItemStyle");
    return theDiv;
}
function getObjectByName(name, type) {
    var objs = document.getElementsByTagName(type);
    for(var ca = 0; ca < objs.length; ca++) {
        var daObj = objs[ca];
        if (daObj && (daObj.id == name || daObj.name == name))
            return daObj;
    }
    return;
}
function setSpellStyle(child,styleName) {
    child.className=styleName;
    if (styleName == "nonSelectedItemStyle") {
        child.style.backgroundColor=MENU_BGCOLOR;
        child.style.color="black";
        if (child.displaySpan)
            child.displaySpan.style.color="green"
    } else if (styleName == "selectedItemStyle") {
        child.style.backgroundColor="#000070";
        child.style.color="white";
        child.style.cursor="pointer";
        if (child.displaySpan)
            child.displaySpan.style.color="white"
    } else if (styleName == "dropDownItemStyle") {
        child.style.width="100%";
        child.style.cssFloat="left";
    } else if (styleName == "dropDownRowStyle") {
        child.style.display="block";
        child.style.paddingLeft="5";
        child.style.paddingRight="5";
        child.style.height=ITEM_HEIGHT + "px";
        child.style.overflow="hidden";
    }
}
function updateTextBox(elementName) {
    var textField = getObjectByName(elementName, TAG_TEXTAREA);
    if (textField == null)
        textField = getObjectByName(elementName, TAG_INPUT);
    var newValue = buildDisplayText(elementName, FLAT_TEXT);
    if (newValue != originalSpellValue[elementName]) {
        textField.value = newValue;
        multiModified(textField);
    }
}
var spellClickedDropDown=function() {
    var elementName = this.parentNode.elementName;
    var position = mods[elementName][this.cmod][POSITION];
    if (this.cmode == BOX_MODE) {
        mods[elementName][this.cmod][MODE] = BOX_MODE;
        mods[elementName][this.cmod][SETWORD] = mods[elementName][this.cmod][WORD];
    } else {
        mods[elementName][this.cmod][MODE] = TEXT_MODE;
        mods[elementName][this.cmod][SETWORD] = spellMenuInfo(this);
    }
    displaySpellText(elementName);
    if (this.cmode == BOX_MODE) {
        var fName = buildRefID(elementName, position);
        setTimeout("fieldFocus('" + fName + "')", 500);
    }
    hideDiv(this.parentNode);
}
function fieldFocus(fieldName) {
    var textField = getObjectByName(fieldName, TAG_INPUT);
    if (textField)
        textField.focus();
}
var spellMouseOverDropDown=function() {
    setSpellStyle(this,"selectedItemStyle");
}
var spellMouseOutDropDown=function() {
    setSpellStyle(this,"nonSelectedItemStyle");
}
function spellMenuInfo(j) {
    var theStyleType = "dropDownItemStyle";
    var spanTag=j.getElementsByTagName(TAG_SPAN);
    var spanInfo = new Array();
    if (spanTag) {
        for(var c=0;c<spanTag.length;++c) {
            if ( spanTag[c].className == theStyleType ) {
                var spanData=spanTag[c].innerHTML;
                if ( spanData != "&nbsp;" ) {
                    spanInfo = spanData;
                }
                break;
            }
        }
    }
    return spanInfo;
}
function setStatus(elementName, text) {
    var link = getObjectByName(elementName, TAG_A);
    if (link) {
        if (text && text.length > 0) {
            link.innerHTML = "<b><u>" + text + "</u></b>";
        } else {
            link.innerHTML = link.savedHTML;
        }
        var realName = elementName.substring(5);
        var displayField = gel(realName + DISPLAY_TAG);
        if (displayField)
            adjustSpellCheckEditDiv(displayField, gel(realName));
    }
}