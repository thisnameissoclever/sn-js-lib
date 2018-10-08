//defer functions_onchange.js
function onChange(elementName){
    var eChanged = gel(elementName);
    var eOriginal = gel("sys_original." + elementName);
    if (eOriginal == null) {
        return;
    }
    var vOriginal = eOriginal.value;
    var vChanged = eChanged.value;
    eChanged.changed = (vOriginal != vChanged);
    onChangeLabelProcess(elementName);
    setMandatoryExplained();
    if (hasDepends != null && hasDepends(elementName))
        onSelChange(elementName);
    clientScriptOnChange(elementName, eChanged, vOriginal, vChanged);
    fieldChanged(elementName, eChanged.changed);
}
function onChangeLabelProcess(elementName) {
    var el = gel(elementName);
    var statusNode = gel('status.' + elementName);
    onChangeLabelProcessByEl(el, statusNode);
}
function onChangeLabelProcessByEl(elementNode, statusLabel) {
    if (!elementNode || !statusLabel)
        return;
    var mandatory = elementNode.getAttribute("mandatory") + ""; // faster to not pull from the DOM each time
    if (mandatory == null || mandatory == "null") // if the field itself has no opinion, use the label's attribute
        mandatory = statusLabel.getAttribute("mandatory") + "";
    else
        statusLabel.setAttribute("mandatory", mandatory);
    var newClassName = statusLabel.getAttribute("oclass");
    if (mandatory=="true" && elementNode.value == "")
        newClassName = "mandatory";
    else if (elementNode.changed)
        newClassName = "changed";
    else if (mandatory=="true")
        newClassName = "mandatory_populated";
    if (mandatory!="true" && (newClassName == "mandatory" || newClassName == "mandatory_populated"))
        newClassName = "";
    if (mandatory == "true")
        statusLabel.setAttribute("title", "Mandatory - must be populated before Submit");
    else
        statusLabel.setAttribute("title", "");
    var slm = gel("section508." + elementNode.id);
    if (slm)
        slm.setAttribute("title", statusLabel.getAttribute("title"));
    statusLabel.className = newClassName;
    CustomEvent.fire("mandatory.changed", elementNode.id, newClassName);
}
function  clientScriptOnChange(elementName, eChanged, vOriginal, vChanged) {
    var splitMe = elementName.split('.');
    var tableName = splitMe[0];
    var fieldName = splitMe.slice(1).join('.');
    callChangeHandlers(tableName, fieldName, eChanged, vOriginal, vChanged);
}
function callChangeHandlers(tableName, fieldName, eChanged, vOriginal, vChanged) {
    var widgetName = tableName + "." + fieldName;
    g_form.hideFieldMsg(fieldName, true);
    template = false;
    if (eChanged.templateValue == 'true')
        template = true;
    eChanged.templateValue = 'false';
    for (var i = 0; i < g_event_handlers.length; i++) {
        var handler = g_event_handlers[i];
        if (handler.fieldName != widgetName && handler.fieldName != fieldName)
            continue;
        callChangeHandler(handler, this, eChanged, vOriginal, vChanged, false, template);
    }
    CustomEvent.fire("change.handlers.run", tableName, fieldName);
}
function fireAllChangeHandlers() {
    for (var x = 0; x < g_event_handlers.length; x++) {
        var handler = g_event_handlers[x];
        var elementName = handler.fieldName;
        var theWidget = gel(elementName);
        if (!theWidget)
            continue;
        var original = gel("sys_original." + elementName);
        var oldVal = 'unknown';
        if (original)
            oldVal = original.value;
        var newVal = theWidget.value;
        callChangeHandler(handler, this, theWidget, oldVal, newVal, true, false);
    }
    CustomEvent.fire("change.handlers.run.all");
}
function callChangeHandler(handler, control, theWidget, oldVal, newVal, loading, template) {
    if (g_jsErrorNotify == "true") {
        try {
            callChangeHandler0(handler, control, theWidget, oldVal, newVal, loading, template);
        } catch (ex) {
            if (g_user.hasRole('client_script_admin')) {
                g_form.showFieldMsg(theWidget, "onChange script error: " + ex.toString() + "\n" +
                    handler.handler.toString(), "error", false);
            }
            else {
                g_form.showFieldMsg(theWidget,
                    "Script error encountered when changing this field - please contact your System Administrator",
                    "error", false);
            }
        }
    } else
        callChangeHandler0(handler, control, theWidget, oldVal, newVal, loading, template);
}
function callChangeHandler0(handler, control, theWidget, oldVal, newVal, loading, template) {
    var g_timer = g_startTimer('CSOC', handler.handlerName);
    handler.handler.call(control, theWidget, oldVal, newVal, loading, template);
    g_endTimer(g_timer);
}
function multiKeyDown(me) {
    var eOriginal = 'g_' + me.id.replace(/\./g, '_');
    var eOriginalSet = eval("typeof " + eOriginal + " != 'undefined'");
    if (eOriginalSet)
        return;
    var oValue = escape(me.value);
    eval(eOriginal + '="' + oValue + '";');
    var form = findParentByTag(me, "form");
    if (me.id && form && document.createElement) {
        var elementName = me.id;
        addInput(form, 'hidden', "sys_original." + elementName, "XXmultiChangeXX");
    }
}
function multiModified(me) {
    multiKeyDown(me);
    var form = findParentByTag(me, "form");
    var changeFlag = true;
    if (me.id && form && document.createElement) {
        var elementName = me.id;
        var vOriginal = unescape(eval('g_' + me.id.replace(/\./g, '_')));
        var vCurrent = me.value;
        if (vCurrent == vOriginal)
            changeFlag = false;
        me.changed = changeFlag;
        onChangeLabelProcess(elementName);
        if ((typeof me.isFocused) == "boolean") // element must have onblur/onfocus handlers to set this
            if (me.isFocused == false) // if no longer in focus, fire on change scripts
                clientScriptOnChange(elementName, me, 'unknown', me.value);
    }
    fieldChanged(elementName, changeFlag);
}
function formChangeKeepAlive() {
    var nowsecs = parseInt((new Date()).getTime() / 1000);
    var secs = parseInt(lastActivity.getTime() / 1000);
    var difference = nowsecs - secs;
    if (difference > AJAX_KEEPALIVE_TIMEOUT) {
        var aj = new GlideAjax("GlideSystemAjax");
        aj.addParam("sysparm_name", "isLoggedIn");
        aj.getXML(doNothing);
        lastActivity = new Date();
    }
}
/**
* Indicate that the field has changed
*
* @param elementName name of the field that changed
* @param changeFlag indicates if the field was modified (true) or changed back to its original value (false)
*/
function fieldChanged(elementName, changeFlag) {
    formChangeKeepAlive();
    if (typeof(g_form) != "undefined")
        g_form.fieldChanged(elementName, changeFlag);
}
function addOnChangeEvent(fields, tableName, callfunc) {
    for(var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (typeof field == "string") {
            if (tableName)
                field = tableName + "." + field;
            field = gel(field);
        }
        if (field && field.tagName)
            Event.observe(field, 'change', callfunc);
    }
}