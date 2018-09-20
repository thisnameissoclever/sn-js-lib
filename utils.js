//defer utils.js
function doNothing() {
}
function callCal(id, cal, anchor, dateformat) {
    new GwtDateTimePicker(id, dateformat, false);
}
function valueExistsInArray(val, array) {
    for(var i = 0; i < array.length; i++) {
        if (val == array[i])
            return true;
    }
    return false;
}
function doubleDigitFormat(num) {
    if (num >= 10)
        return num;
    return "0" + num;
}
function tripleDigitFormat(num) {
    if (num >= 100)
        return num;
    if (num >= 10)
        return "0" + doubleDigitFormat(num);
    return "00" + num;
}
function sGetHours(totalSecs) {
    return parseInt(totalSecs / (60 * 60), 10);
}
function sGetMinutes(totalSecs) {
    totalSecs -= (60*60)*sGetHours(totalSecs);
    return parseInt(totalSecs / 60, 10);
}
function sGetSeconds(totalSecs) {
    totalSecs -= (60*60)*sGetHours(totalSecs);
    totalSecs -= (60)*sGetMinutes(totalSecs);
    return parseInt(totalSecs, 10);
}
function isNumber(test) {
    if (typeof test == "undefined" || test == null)
        return false;
    var _numer = test.search("[^0-9]");
    if (_numer > -1)
        return false;
    return true;
}
function isAlphaNum(thchar) {
    return isAlpha(thchar) || isDigit(thchar);
}
function isAlpha(thchar){
    return (thchar >= 'a' && thchar <= 'z\uffff') || (thchar >= 'A' && thchar <= 'Z\uffff') || thchar == '_';
}
function isDigit(thchar) {
    return (thchar >= '0' && thchar <= '9');
}
function containsOnlyChars(validChars, sText) {
    if (sText == null || sText == '')
        return true;
    for (var i = 0; i < sText.length; i++) {
        var c = sText.charAt(i);
        if (validChars.indexOf(c) == -1) // not a match
            return false;
    }
    return true;
}
function rel(id) {
    var e = $(id);
    if (e)
        e.parentNode.removeChild(e);
}
function removeElementsByName(name) {
    var elements = document.getElementsByName(name);
    for (i = 0; i < elements.length; i++ ) {
        elements[i].parentNode.removeChild(elements[i]);
    }
}
function getAttributeValue(element, attrName) {
    var value;
    if (ie5)
        value = element.attributes[attrName].nodeValue;
    else
        value = element.getAttribute(attrName);
    return value;
}
function setAttributeValue(element, attrName, value) {
    if (ie5) {
        if (element.attributes[attrName] == null) {
            var attr = document.createAttribute(attrName);
            attr.value = value;
            element.setAttributeNode(attr);
        } else {
            element.attributes[attrName].nodeValue = value;
        }
    } else
        element.setAttribute(attrName, value);
}
function toggleDivDisplayAndReturn(divName) {
    if (divName) {
        var div = $(divName);
        if (!div)
            return;
        if (div.style.display == "none") {
            showObject(div);
        } else {
            hideObject(div);
        }
        return div;
    }
}
function toggleDivDisplay(divName) {
    toggleDivDisplayAndReturn(divName);
    return;
}
function findParentByTag(element, tag) {
    var ret;
    while (element && element.parentNode && element.parentNode.tagName) {
        element = element.parentNode;
        if (element.tagName.toLowerCase() == tag.toLowerCase())
            return element;
    }
    return ret;
}
function replaceAll(str, from, to) {
    var idx = str.indexOf( from );
    while ( idx > -1 ) {
        str = str.replace( from, to );
        idx = str.indexOf( from );
    }
    return str;
}
function expandEffect(el, duration, steps, stepCallback, completionCallback) {
    if (!sexyEffects) {
        showObject(el);
        if (completionCallback)
            completionCallback(el);
        return;
    }
    var h;
    if (el.originalHeight)
        h = el.originalHeight;
    else {
        h = getHeight(el);
        if (h==0) { // if getting the height didn't work, just show the thing
            showObject(el);
            return;
        }
        el.originalHeight = h;
    }
    if (!duration)
        duration = 70;
    if (!steps)
        steps = 14;
    el.style.overflow = "hidden";
    el.style.height = "1px";
    el.style.display = "block";
    el.style.visibility = "visible";
    new Rico.Effect.Size( el.id, null, h, duration, steps, {
        step:function() {
            if (stepCallback)
                stepCallback(el);
        },
        complete:function() {
            el.style.overflow = "";
            el.style.height = "auto";
            _expandComplete(el, completionCallback);
        }
    });
    return h;
}
function _expandComplete(el, completionCallback) {
    if (completionCallback)
        completionCallback(el);
    _frameChanged();
}
function collapseEffect(el, duration, steps) {
    if (!sexyEffects) {
        hideObject(el);
        return;
    }
    var h;
    if (el.originalHeight)
        h = el.originalHeight;
    else {
        h = el.offsetHeight;
        el.originalHeight = h;
    }
    if (!duration)
        duration = 70;
    if (!steps)
        steps = 14;
    if (!h)
        h = el.offsetHeight;
    el.style.overflow = "hidden";
    new Rico.Effect.Size( el.id, null, 1, 50, 12, {
        complete:function() {
            el.style.display = "none";
            el.style.overflow = "";
            el.style.height = h;
            _frameChanged();
        }
    });
}
function getHeight(el) {
    var item;
    try {
        item = el.cloneNode(true); // there is a bug in IE where this sometimes can fail with "unspecified error"
    }
    catch(e) {
        jslog("getHeight blew up... we caught the error and returned 0")
        return 0;
    }
    var height = 0;
    item.style.visibility = "hidden";
    item.style.display = "block";
    item.style.position = "absolute";
    item.style.top = 0;
    item.style.left = 0;
    document.body.appendChild(item);
    height = item.offsetHeight;
    document.body.removeChild(item);
    return height;
}
function getWidth(el) {
    var item = el.cloneNode(true);
    var width = 0;
    item.style.visibility = "hidden";
    item.style.display = "block";
    item.style.position = "absolute";
    item.style.top = 0;
    item.style.left = 0;
    document.body.appendChild(item);
    width = item.offsetWidth;
    document.body.removeChild(item);
    return width;
}
function grabOffsetLeft(item) {
    return getOffset(item,"offsetLeft")
}
function grabOffsetTop(item) {
    return getOffset(item, "offsetTop")
}
function getOffset(item, attr) {
    var parentElement = getFormContentParent();
    var wb=0;
    while(item) {
        wb += item[attr];
        item = item.offsetParent;
        if (item == parentElement)
            break;
    }
    return wb;
}
function grabScrollLeft(item) {
    return getScrollOffset(item, "scrollLeft")
}
function grabScrollTop(item) {
    return getScrollOffset(item, "scrollTop")
}
function getScrollOffset(item, attr) {
    var parentElement = getFormContentParent();
    var wb=0;
    while (item && item.tagName && item != parentElement) {
        wb += item[attr];
        if (isMSIE)
            item = item.offsetParent;
        else
            item = item.parentNode;
    }
    return wb;
}
function getValue(evt) {
    evt = getEvent(evt);
    if (!evt)
        return null;
    var elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if (!elem)
        return null;
    try {
        return elem.options[elem.selectedIndex].value;
    } catch(e) {
        var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
        alert("Unable to get data:\n" + msg);
    }
    return null;
}
function getEvent(event) {
    var event = event || window.event;
    if (!event.target)
        event.target = event.srcElement;
    if (typeof event.layerX == 'undefined')
        event.layerX = event.offsetX;
    if (typeof event.layerY == 'undefined')
        event.layerY = event.offsetY;
    return event;
}
function getEventCoords(e) {
    var fudge = getFormContentParent();
    var answer = Event.pointer(e);
    answer = new Point(answer.x, answer.y);
    if (fudge == document.body)
        return answer;
    answer.x += fudge.scrollLeft;
    answer.y += fudge.scrollTop;
    return answer;
}
function getRelativeTop() {
    var port = document.viewport;
    var topLeft = new Point(port.getScrollOffsets().left, port.getScrollOffsets().top)
    var fudge = getFormContentParent();
    if (fudge != document.body) {
        topLeft.x += fudge.scrollLeft;
        topLeft.y += fudge.scrollTop;
    }
    return topLeft;
}
function getViewableArea() {
    if (document.compatMode  != 'BackCompat') {
        return new Rectangle(
            document.documentElement.scrollLeft,
            document.documentElement.scrollTop,
            document.documentElement.clientWidth,
            document.documentElement.clientHeight
            );
    }
    return new Rectangle(
        document.body.scrollLeft,
        document.body.scrollTop,
        document.body.clientWidth,
        document.body.clientHeight
        );
}
function getRealEvent(e) {
    e = getEvent(e);
    if (isTouchDevice && isTouchEvent(e)) {
        e = e.changedTouches[0];
    }
    return e;
}
function isTouchEvent(e) {
    if (typeof e == 'undefined' || typeof e.changedTouches == 'undefined')
        return false;
    return true;
}
function isTouchRightClick(e) {
    if (!isTouchEvent(e))
        return false;
    var hasTwoFingers = e.changedTouches.length > 1;
    return hasTwoFingers;
}
function getTextValue(node) {
    if (node.textContent)
        return node.textContent;
    var firstNode = node.childNodes[0];
    if (!firstNode)
        return null;
    if (firstNode.data)
        return firstNode.data;
    return firstNode.nodeValue;
}
function getObjX(obj){
    if(!obj.offsetParent) return 0;
    var x = getObjX(obj.offsetParent);
    return obj.offsetLeft + x;
}
function getObjY(obj){
    if(!obj.offsetParent) return 0;
    var y = getObjY(obj.offsetParent);
    return obj.offsetTop + y;
}
function getScrollX(){
    if (window.pageXOffset)
        return window.pageXOffset;
    var parentElement = getFormContentParent();
    if (parentElement.scrollHeight)
        return parentElement.scrollLeft;
}
function getScrollY(){
    if (window.pageYOffset)
        return window.pageYOffset;
    var parentElement = getFormContentParent();
    if (parentElement.scrollWidth)
        return parentElement.scrollTop;
}
function getMouseX(evt) {
    if (evt.pageX) return evt.pageX;
    obj = getSrcElement(evt);
    return getScrollX() + evt.x;
}
function getMouseY(evt) {
    if (evt.pageY) return evt.pageY;
    return getScrollY() + evt.y;
}
function getSrcElement(evt) {
    if (evt.srcElement) return evt.srcElement;
    if (evt.target) return evt.target;
    return evt.currentTarget;
}
function addForm() {
    var form = cel('form');
    document.body.appendChild(form);
    if (typeof g_ck != 'undefined' && g_ck != "") {
        addHidden(form, "sysparm_ck", g_ck);
    }
    return form;
}
function addHidden(form, name, value) {
    addInput(form, 'HIDDEN', name, value);
}
function addInput(form, type, name, value){
    var inputs = Form.getInputs(form, '', name);
    if (inputs.length > 0) {
        inputs[0].value = value;
        return;
    }
    var opt = document.createElement('input');
    opt.type = type;
    opt.name = name;
    opt.id = name;
    opt.value = value;
    form.appendChild(opt);
}
/**
* Return an object that contains all of the values from the hidden input fields to allow
* you to easily provide parameter values (tyipcally to a UI Page) and be able to access
* the values from the client script.
*
* Typical use within a UI Page:
*
*    HTML:
*       <g:emitParms />
*       <input type="hidden" id="abc" value="def" />
*
*   Client Script:
*       var params = getHiddenInputValuesMap(document);
*      alert("The value for sysparm_table is " + params['sysparm_table']);
*/
function getHiddenInputValuesMap(parent) {
    var valuesMap = {}
    var inputs = parent.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.type.toLowerCase() != "hidden")
            continue;
        valuesMap[input.id] = input.value;
    }
    return valuesMap;
}
function appendSelectOption(select, value, label) {
    var opt;
    opt = document.createElement("option");
    opt.value = value;
    opt.appendChild(label);
    select.appendChild(opt);
    return opt;
}
function selectMenuItem(id, selectName) {
    var selectMenu = document.getElementById(selectName);
    if (!selectMenu)
        return -1;
    var options = selectMenu.options;
    var selectItem = selectMenu.selectedIndex;
    if (id) {
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.value == id) {
                selectItem = i;
                break;
            }
        }
    }
    if (selectItem > 0) {
        selectMenu.selectedIndex = selectItem;
        if (selectMenu["onchange"]) {
            selectMenu.onchange();
        }
    }
    return selectItem;
}
function menuIsEmpty(selectName) {
    var selectMenu = document.getElementById(selectName);
    if (!selectMenu || selectMenu.selectedIndex <= 0)
        return true;
    return false;
}
function getBounds(obj, addScroll) {
    var x = grabOffsetLeft(obj);
    var y = grabOffsetTop(obj);
    if (addScroll) {
        x += getScrollX();
        y += getScrollY();
    }
    this.absoluteRect = {
        top:    y,
        left:   x,
        bottom: y + obj.offsetHeight,
        right:  x + obj.offsetWidth,
        height: obj.offsetHeight,
        width:  obj.offsetWidth,
        middleX: x + (obj.offsetWidth / 2),
        middleY: y + (obj.offsetHeight / 2),
        cbottom: y + obj.clientHeight,
        cright:  x + obj.clientWidth
    };
    return this.absoluteRect;
}
function sz(t) {
    a = t.value.split('\n');
    b=1;
    for (x=0;x < a.length; x++) {
        if (a[x].length >= t.cols)
            b+= Math.floor(a[x].length/t.cols);
    }
    b += a.length;
    if (b > t.rows)
        t.rows = b;
}
/**
* Generates a random 32 character length hexadecimal value. The length can be optionally specified
* to return a string of specific size. Note that this does use similar algorithms to the server side
* Guid.generate(); however, is functionally NOT the same.
*/
function guid(l) {
    var l = l || 32, strResult = '';
    while (strResult.length < l)
        strResult += (((1+Math.random()+new Date().getTime())*0x10000)|0).toString(16).substring(1);
    return strResult.substr(0, l);
}
function addClassName(element, name) {
    if (element) {
        var names = element.className.split(" ");
        if (!names.exists(name))
            names.push(name);
        element.className = names.join(" ");
    }
}
function removeClassName(element, name) {
    if (element) {
        var names = element.className.split(" ");
        if (names.removeItem(name))
            element.className = names.join(" ");
    }
}
function hasClassName(element, name) {
    if (element) {
        var names = element.className.split(" ");
        return names.exists(name);
    }
}
function stopSelection(e) {
    e.onselectstart = function() {
        return false;
    }; // IE
    e.style.MozUserSelect = "none"; // FF
}
function restoreSelection(e) {
    e.onselectstart = null;
    e.style.MozUserSelect = "";
}
function removeFocusFromDom() {
    var elm = cel('input');
    elm.style.height = '0';
    elm.style.width = '0';
    elm.style.fontSize = '0';
    elm.style.position = 'absolute';
    elm.style.left = '0';
    elm.style.top = '0';
    document.body.appendChild(elm);
    elm.focus();
    rel(elm);
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(s) {
        if (!s)
            return false;
        if (this.length < s.length)
            return false;
        return (this.substr(this.length - s.length, s.length) == s);
    };
}
function getAttributeValue(element, name) {
    if (!element.attributes)
        return null;
    var v = element.attributes.getNamedItem(name);
    if (v == null)
        return null;
    return v.nodeValue;
}
function getAbsPosition(el) {
    var r = {
        x: el.offsetLeft,
        y: el.offsetTop
    };
    if (el.offsetParent) {
        var tmp = getAbsPosition(el.offsetParent);
        r.x += tmp.x;
        r.y += tmp.y;
    }
    return r;
}
function createImage(src, title, object, onClick) {
    var img = cel('input');
    img.type = 'image';
    img.src = src;
    img.title = title;
    img.alt = title;
    if (arguments.length == 4)
        img.onclick = onClick.bindAsEventListener(object);
    return img;
}
function getXMLString(node) {
    var xml = "???";
    if (node.xml) {
        xml = node.xml;
    } else if (window.XMLSerializer) {
        xml = (new XMLSerializer()).serializeToString(node);
    }
    return xml;
}
function getXMLNodeAttribute(node, attr) {
    if (!node)
        return null;
    var a = node.attributes.getNamedItem(attr);
    return (a) ? a.value : null;
}
function importNode(d, childNode) {
    var oNew;
    if (childNode.nodeType == 1) {
        oNew = d.createElement(childNode.nodeName);
        for (var i = 0; i < childNode.attributes.length; i++) {
            if (childNode.attributes[i].nodeValue != null && childNode.attributes[i].nodeValue != '') {
                var attrName = childNode.attributes[i].name;
                if (attrName == "class")
                    oNew.setAttribute("className", childNode.attributes[i].value);
                else
                    oNew.setAttribute(attrName, childNode.attributes[i].value);
            }
        }
        if (childNode.style != null && childNode.style.cssText != null)
            oNew.style.cssText = childNode.style.cssText;
    } else if (childNode.nodeType == 3) {
        oNew = d.createTextNode(childNode.nodeValue);
    }
    if (childNode.hasChildNodes()) {
        for (var oChild = childNode.firstChild; oChild; oChild = oChild.nextSibling) {
            oNew.appendChild(importNode(d, oChild));
        }
    }
    return oNew;
}
function isEmailValid(value){
    var problemMsg = isEmailValidWithReason(value);
    if (problemMsg != "") {
        jslog("isEmailValid: " + problemMsg);
        return false;
    }
    return true;
}
function isEmailValidWithReason(value) {
    var localPartChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%*/?|^{}`~&'+-=_.";
    var domainChars =    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.";
    if (value.indexOf("@") == -1)
        return "missing @ sign";
    var s = value.split("@");
    if (s.length != 2)
        return "too many at signs";
    if (!containsOnlyChars(localPartChars, s[0]))
        return "invalid character before the at sign";
    if (s[0].length < 1)
        return "at least one character must be before the at sign";
    if (s[0].substr(0,1) == ".")
        return "period cannot be the first character";
    if (s[0].substr(s[0].length-1,1) == ".")
        return "period cannot be the last character before the at sign";
    if (!containsOnlyChars(domainChars, s[1]))
        return "invalid character after the at sign";
    var periodIndex = s[1].indexOf(".");
    if (periodIndex == -1)
        return "missing period after the at sign";
    if (periodIndex == 0)
        return "period cannot be the first character after the at sign";
    var periods = s[1].split(".");
    var lastPeriod = periods[periods.length-1];
    if (lastPeriod.length < 2)
        return "must be at least 2 characters after the last period";
    if (!isAlphaNum(s[1].substr(0,1)))
        return "the first character after the at sign must be alphanumeric";
    if (!isAlphaNum(s[1].substr(s[1].length-1,1)))
        return "the last character must be alphanumeric";
    return ""; // address is OK
}
function isLeftClick(e) {
    if (ie5 && getEvent(e).button != 1)
        return false;
    if (!ie5 && getEvent(e).button != 0)
        return false;
    return true;
}
function formatMessage() {
    if (arguments.length == 1)
        return arguments[0];
    var str = arguments[0];
    var i = 0;
    while (++i < arguments.length) {
        str = str.replace( new RegExp( '\\{'+(i-1)+'\\}', 'g' ), arguments[i] );
    }
    return str;
}
function getAscii(instring) {
    var chars=""
    var i;
    for (i = 0; i < instring.length; i++) {
        if (i > 0)
            chars += ",";
        chars += instring.charCodeAt(i);
    }
    return chars;
}
function getFormattedDateAndTime(date) {
    return getFormattedDate(date) + " " + getFormattedTime(date);
}
function getFormattedDate(date) {
    var d = (date? date : new Date());
    var curr_mon = d.getMonth() + 1;
    var curr_day = d.getDate();
    var curr_year = d.getYear() - 100;
    return doubleDigitFormat(curr_mon) + "/" + doubleDigitFormat(curr_day) + "/" + doubleDigitFormat(curr_year)
}
function getFormattedTime(date) {
    var d = (date? date : new Date());
    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();
    var curr_sec = d.getSeconds();
    var curr_msec = d.getMilliseconds();
    return doubleDigitFormat(curr_hour) + ":" + doubleDigitFormat(curr_min) + ":" + doubleDigitFormat(curr_sec) + " (" + tripleDigitFormat(curr_msec) + ")"
}
function showGoToLine(textAreaID) {
    var e = gel("go_to_" + textAreaID)
    if (e) {
        showObjectInline(e);
        gel("go_to_input_" + textAreaID).focus();
    }
}
function gotoLineKeyPress(evt, textAreaObject, input) {
    evt = getEvent(evt);
    if (evt.keyCode == 13) {
        Event.stop(evt);
        gotoLinePopup(textAreaObject, input.value);
        input.value = "";
        hideObject(input.parentNode);
    }
}
function gotoLinePopup(textAreaObject, lineText) {
    if (lineText) {
        lineText = trim(lineText);
        if (lineText) {
            var line = parseInt(lineText, 10);
            g_form._setCaretPositionLineColumn(textAreaObject, line, 1);
        }
    }
}
function getBrowserWindowHeight() {
    var myHeight = 0;
    if ( typeof( window.innerHeight ) == 'number' )
        myHeight = window.innerHeight; //Non-IE
    else if ( document.documentElement && document.documentElement.clientHeight )
        myHeight = document.documentElement.clientHeight; //IE 6+ in 'standards compliant mode'
    else if ( document.body && document.body.clientHeight )
        myHeight = document.body.clientHeight; //IE 4 compatible
    return myHeight;
}
function getBrowserWindowWidth() {
    var myWidth = 0;
    if ( typeof( window.innerWidth ) == 'number' )
        myWidth = window.innerWidth; //Non-IE
    else if ( document.documentElement && document.documentElement.clientWidth )
        myWidth = document.documentElement.clientWidth; //IE 6+ in 'standards compliant mode'
    else if ( document.body && document.body.clientWidth )
        myWidth = document.body.clientWidth; //IE 4 compatible
    return myWidth;
}
var WindowSize = Class.create({
    initialize: function() {
        this.width = getBrowserWindowWidth();
        this.height = getBrowserWindowHeight();
    }
});
/**
* Reference: http://www.alexandre-gomes.com/?p=115
*/
function getScrollBarWidthPx() {
    var inner = cel("p");
    inner.style.width = "100%";
    inner.style.height = "200px";
    var outer = cel("div");
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = "scroll";
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;
    document.body.removeChild(outer);
    return (w1 - w2);
}
function getElementStyle(e, currentStyle, cssName) {
    if (e.currentStyle)
        return e.currentStyle[currentStyle];
    if (window.getComputedStyle)
        return document.defaultView.getComputedStyle(e, null).getPropertyValue(cssName);
    return "";
}
function getUriParameter(strParamName) {
    strParamName = strParamName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var strRegex = "[\\?&]"+strParamName+"=([^&#]*)";
    var regex = new RegExp(strRegex);
    var results = regex.exec(window.location.href);
    return results == null ? null : results[1];
}