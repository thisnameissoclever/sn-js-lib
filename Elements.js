//defer classes/GlideTimerElement.js
var GlideTimerElement = Class.create({
    initialize: function(name, tmrID) {
        this.name = name;
        this.tmrID = tmrID;
        this._setTimer();
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setValue: function(value, displayValue) {
        var v = duration2timeValue(value);
        var setField = document.getElementById(this.name);
        setTotalValue(v, this.tmrID);
        this._cancelTimer();
        this._setTimer();
    },
    _cancelTimer: function() {
        if (!this.timerID)
            return;
        clearTimeout(this.timerID);
        this.timerID = null;
    },
    _setTimer: function() {
        this.timerID = setTimeout(this._incrementTimer.bind(this),1000);
    },
    _incrementTimer: function() {
        var currentTime = fields2time(this.tmrID);
        if (!this._isPaused())
            currentTime = currentTime + 1;
        setIncrementingValue(currentTime, this.tmrID);
        this._setTimer();
    },
    _isPaused: function() {
        var paused = document.getElementById(this.tmrID + "_paused");
        return (paused.value == 'true' ? 1 : 0);
    },
    type: function() {
        return "GlideTimerElement";
    }
});
function fields2time(tmrid) {
    var currentTime = 0;
    var eHour = document.getElementById(tmrid + "_hour");
    var eMin = document.getElementById(tmrid + "_min");
    var eSec = document.getElementById(tmrid + "_sec");
    if (eHour.value)
        currentTime = 60 * 60 * parseInt((isNaN(eHour.value) ? 0 : eHour.value), 10);
    if (eMin.value)
        currentTime += 60 * parseInt((isNaN(eMin.value) ? 0 : eMin.value), 10);
    if (eSec.value) {
        currentTime += parseInt((isNaN(eSec.value) ? 0 : eSec.value), 10);
    }
    return currentTime;
}
function setTotalValue(currentTime, tmrid) {
    var eCalculated = document.getElementById(tmrid);
    var eHour = document.getElementById(tmrid + "_hour");
    var eMin = document.getElementById(tmrid + "_min");
    var eSec = document.getElementById(tmrid + "_sec");
    var hour = doubleDigitFormat(sGetHours(currentTime));
    var minute = doubleDigitFormat(sGetMinutes(currentTime));
    var second = doubleDigitFormat(sGetSeconds(currentTime));
    var minUpdate = (parseInt(eSec.value) == 59 ? true : false);
    var hourUpdate = (parseInt(eMin.value) == 59 ? true : false);
    eCalculated.value = "0 " + hour + ":" + minute + ":" + second;
    eSec.value = second;
    eMin.value = minute;
    eHour.value = hour;
    updateTotal(tmrid);
}
function setIncrementingValue(currentTime, tmrid) {
    var eCalculated = document.getElementById(tmrid);
    var eHour = document.getElementById(tmrid + "_hour");
    var eMin = document.getElementById(tmrid + "_min");
    var eSec = document.getElementById(tmrid + "_sec");
    var hour = doubleDigitFormat(sGetHours(currentTime));
    var minute = doubleDigitFormat(sGetMinutes(currentTime));
    var second = doubleDigitFormat(sGetSeconds(currentTime));
    var minUpdate = (parseInt(eSec.value) == 59 ? true : false);
    var hourUpdate = (parseInt(eMin.value) == 59 ? true : false);
    eCalculated.value = "0 " + hour + ":" + minute + ":" + second;
    if (second != eSec.value) {
        eSec.value = second;
        eSec.onchange();
    }
    if (minUpdate && minute != eMin.value) {
        eMin.value = minute;
        eMin.onchange();
    }
    if (hourUpdate && minUpdate && hour != eHour.value) {
        eHour.value = hour;
        eHour.onchange();
    }
}
function setTimer(newSetTime, setField, tmrid) {
    var tHour = document.getElementById("o" + tmrid + "_hour");
    var tMin = document.getElementById("o" + tmrid + "_min");
    var tSec = document.getElementById("o" + tmrid + "_sec");
    var hour = doubleDigitFormat(sGetHours(newSetTime));
    var minute = doubleDigitFormat(sGetMinutes(newSetTime));
    var second = doubleDigitFormat(sGetSeconds(newSetTime));
    tHour.innerHTML = hour;
    tMin.innerHTML = minute;
    tSec.innerHTML = second;
    if (hour > 24) {
        var days = parseInt(hour / 24);
        hour = days + " " + (hour-(days*24));
    }
    setField.value = hour + ":" + minute + ":" + second;
}
function duration2time(tmrid) {
    var currentTime = document.getElementById(tmrid);
    currentTime = currentTime.value;
    return duration2timeValue(currentTime);
}
function duration2timeValue(currentTime) {
    var days = 0;
    if (currentTime == 0)
        currentTime = "00:00:00";
    if (currentTime.indexOf(" ") > -1) {
        var sp = currentTime.indexOf(" ");
        days = currentTime.substring(0, sp);
        currentTime = currentTime.substring(sp+1, currentTime.length);
    }
    var hours = parseInt(currentTime.substring(0, 2), 10);
    var minutes = parseInt(currentTime.substring(3, 5), 10);
    var seconds = parseInt(currentTime.substring(6, 8), 10);
    currentTime = ((60*60) * 24) * days;
    currentTime += (60*60) * hours;
    currentTime += 60 * minutes;
    currentTime += seconds;
    return currentTime;
}
//defer classes/CompositeNameElement.js
var CompositeNameElement = Class.create({
    initialize: function(name) {
        this.name = name;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        var tn = gel('ni_tn_' + this.name);
        var fn = gel('ni_fn_' + this.name);
        tn.disabled = disabled;
        fn.disabled = disabled;
    }
});
//defer classes/UserRolesElement.js
var UserRolesElement = Class.create({
    initialize: function(name) {
        this.name = name;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        if (disabled) {
            var unlockElement = gel(this.name + "_unlock");
            lock(unlockElement, this.name, this.name + '_edit', this.name + '_nonedit', this.name + 'select_1', this.name + '_nonedit');
            hideObject(unlockElement);
        } else {
            var unlockElement = gel(this.name + "_unlock");
            showObjectInline(unlockElement);
        }
        return true;
    }
});
//defer classes/DaysOfWeekElement.js
var DaysOfWeekElement = Class.create({
    initialize: function(name) {
        this.name = name;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        var e = gel(this.name);
        if (e) {
            var checkedDays = e.value;
            for (var i = 1; i != 8; i++) {
                var cb = gel('ni.' + this.name + '.' + i);
                if (cb) {
                    cb.disabled = disabled;
                }
            }
        }
    }
});
//defer classes/FieldListElement.js
var FieldListElement = Class.create({
    initialize: function(name, dependent, dependentTable, defaultDisplayName, newRecord) {
        this.name = name;
        this.dependent = dependent;
        this.table = dependentTable;
        this.defaultDisplayName = (defaultDisplayName == "true"); // whether to default to the table's display column
        if (this.defaultDisplayName)
            this.tableChanged = (newRecord == "true"); // this lets us set the initial default value
        else
            this.tableChanged = false;
        this.displayName = ""; // we don't know the display name yet; AJAX will tell us
        this.lastValue = "";
        this.initialSetup = true;
    },
    onLoad: function() {
        if (!this.table) {
            var table = resolveDependentValue(this.name, this.dependent, this.table);
            this.table = table;
        }
        this._listCols();
    },
    depChange: function() {
        gel(this.name).value = "";
        this._setTableName();
    },
    moveOptionUpdate: function(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel,
        direction, property) {
        moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel,
            direction, property);
        this._setListValues();
    },
    moveUpUpdate: function(select) {
        moveUp(gel(select));
        this._setListValues();
    },
    moveDownUpdate: function(select) {
        moveDown(gel(select));
        this._setListValues();
    },
    _listCols: function() {
        var colist = gel(this.name);
        var url = "xmlhttp.do?sysparm_processor=ListColumns&sysparm_expanded=0&sysparm_name=" + this.table +
        "&sysparm_include_display_name=true";
        if (colist.value.length > 0)
            url += "&sysparm_col_list=" + colist.value;
        jslog("FieldListElement: _listCols calling AJAX " + url);
        serverRequest(url, this._colsReturned.bind(this), null);
    },
    _colsReturned: function(request) {
        jslog("FieldListElement: _colsReturned AJAX response received");
        var tcols = request.responseXML;
        var scols = gel("ni." + this.name + ".select_1");
        scols.options.length = 0;
        var acols = gel("ni." + this.name + ".select_0");
        acols.options.length = 0;
        var colist = gel(this.name);
        var mfields = new Array();
        var useSpecFields = false;
        var root = tcols.getElementsByTagName("xml")[0];
        this.displayName = root.getAttribute("displayName");
        if (this.tableChanged) {
            if (this.defaultDisplayName)
                colist.value = this.displayName;
            else
                colist.value = '';
        }
        if (colist.value.length > 0) {
            mfields = colist.value.split(",");
            if (mfields.length > 0)
                useSpecFields = true;
        }
        var items = tcols.getElementsByTagName("item");
        for (var i = 0; i != items.length; i++) {
            var item = items[i];
            var value = item.getAttribute("value");
            var label = item.getAttribute("label");
            var status = item.getAttribute("status");
            var ref = item.getAttribute("reference");
            if (ref) {
                if(ref == '')
                    ref = null;
            }
            var o = this._enhanceOption(item, value, label, root, status);
            if (valueExistsInArray(value, mfields)) {
                scols.options[scols.options.length] = o;
                if (ref)
                    acols.options[acols.options.length] = this._enhanceOption(item, value, label, root, "available");
            } else {
                acols.options[acols.options.length] = o;
            }
        }
        if (useSpecFields) {
            var newOptions = new Array();
            for(var i = 0; i != mfields.length; i++) {
                var s = mfields[i];
                for(var z = 0; z != scols.options.length; z++) {
                    if (scols.options[z].value == s) {
                        newOptions[newOptions.length] = scols.options[z];
                        break;
                    }
                }
            }
            scols.options.length = 0;
            for(var i = 0; i != newOptions.length; i++) {
                scols.options.add(newOptions[i]);
            }
        }
        this._setListValues();
    },
    _enhanceOption: function (item, value, label, root, status) {
        var ref = null;
        var xlabel = label;
        if (status != "selected") {
            ref = item.getAttribute("reference");
            if (ref) {
                if(ref != '') {
                    xlabel += " (+)";
                } else
                    ref = null;
            }
        }
        var o = new Option(xlabel, value);
        o.cv = value;
        o.cl = label;
        if (ref) {
            o.tl = item.getAttribute("reflabel");
            o.style.color = 'green';
            o.reference = ref;
            o.doNotDelete = 'true';
            if (root) {
                o.bt = root.getAttribute("name");
                o.btl = root.getAttribute("label");
            }
        }
        return o;
    },
    _setTableName: function() {
        var table = resolveDependentValue(this.name, this.dependent, this.table);
        if (table != this.table) {
            this.tableChanged = true;
            this.table = table;
            this._listCols(table);
        }
    },
    _setListValues: function() {
        var scols = gel("ni." + this.name + ".select_1");
        var values = "";
        var text = "";
        var count = 0;
        for (var i=0; i < scols.length; i++) {
            var opt = scols.options[i];
            if (opt.value && opt.value != "--None--") {
                if (count > 0) {
                    values += ",";
                    text += ", ";
                }
                values += opt.value;
                text += opt.text;
                count++;
            }
        }
        gel(this.name).value = values;
        var nonedit = gel(this.name+"_nonedit");
        if (nonedit)
            nonedit.innerHTML = text;
        this.tableChanged = false;
        if (this.lastValue != values) {
            this.lastValue = values;
            if (!this.initialSetup)
                onChange(this.name);
        }
        this.initialSetup = false;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        if (disabled) {
            var unlockElement = gel(this.name + "_unlock");
            lock(unlockElement, this.name, this.name + '_edit', this.name + '_nonedit',
                'ni.' + this.name + '.select_1', this.name + '_nonedit');
            hideObject(unlockElement);
        } else {
            var unlockElement = gel(this.name + "_unlock");
            showObjectInline(unlockElement);
        }
        return true;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setValue: function(value, displayValue) {
        gel(this.name).value = value; // actually set the value
        var acols = gel("ni." + this.name + ".select_0");
        var scols = gel("ni." + this.name + ".select_1");
        if (typeof value == "string")
            value = value.split(",");
        if (typeof displayValue == "string")
            displayValue = displayValue.split(",");
        if (value.length != displayValue.length) {
            jslog("FieldListElement " + this.name +
                ".setValue() received value and displayValue parameters of different lengths");
            return;
        }
        var selectedIds = new Array();
        var index = 0;
        for (var i = 0; i < scols.options.length; i++) {
            selectedIds[index] = i;
            index++;
        }
        if (index > 0)
            moveSelectedOptions(selectedIds, scols, acols, '--None--', ['home'], '--None--');
        var text = "";
        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            if (i > 0)
                text += ", ";
            var aIndex = this._getOptionIndex(acols, v);
            if (aIndex > -1) { // if it is 'available', move it over
                selectedIds = new Array();
                selectedIds[0] = aIndex;
                text += acols.options[aIndex].text;
                moveSelectedOptions(selectedIds, acols, scols, '--None--', [], '--None--');
            } else { // if it's not in available (for example, a dot-walked field), create a new option
                addChoiceFromValueAndDisplay(scols, v, displayValue[i]);
                text += displayValue[i];
            }
        }
        var nonedit = gel(this.name+"_nonedit");
        if (nonedit)
            nonedit.innerHTML = text;
    },
    _getOptionIndex: function(select, value) {
        for (var i=0; i<select.length; i++)
            if (select.options[i].value == value)
                return i;
        return -1;
    },
    type: function() {
        return "FieldListElement";
    }
});
//defer classes/GlideListElement.js
var GlideListElement = Class.create({
    initialize: function(name, table) {
        this.name = name;
        this.table = table;
    },
    /* Note that these arguments can be arrays if you want to set multiple values.
*
* You can pass one argument or two.  For reference values, if you pass both the sysid and the
* display value, it will more efficient because we won't have to look up the display values for
* you.  However, if you do not want to pass us the display value, we will do an AJAX call and
* find the value for you which will take a bit longer.
*
* Example: reset to no values
*       g_form.setValue("watch_list", "");
*
* Example: set to two references passing the display values to avoid AJAX call
*       var valueArray = new Array("46d44a23a9fe19810012d100cca80666", "46c6f9efa9fe198101ddf5eed9adf6e7");
*       var labelArray = new Array("Beth Anglin", "Bud Richman");
*       g_form.setValue("watch_list", valueArray, labelArray);
*
* Example: set arbitrary email address (for a sys_user glide list)
*       g_form.setValue("watch_list", "", "you@you.com");
*
* Example: set references and emails passing the display values to avoid AJAX call
*       var valueArray = new Array("46d44a23a9fe19810012d100cca80666", "", "46c6f9efa9fe198101ddf5eed9adf6e7");
*       var labelArray = new Array("Beth Anglin", "me@me.com", "Bud Richman");
*       g_form.setValue("watch_list", valueArray, labelArray);
*
* Example: set references and emails but use AJAX to obtain display values for references
*       var valueArray = new Array("46d44a23a9fe19810012d100cca80666", "me@me.com", "46c6f9efa9fe198101ddf5eed9adf6e7");
*       g_form.setValue("watch_list", valueArray);
*
* Example: set references and emails using comma separated string but use AJAX to obtain display values for references
*       g_form.setValue("watch_list", "46d44a23a9fe19810012d100cca80666,me@me.com,46c6f9efa9fe198101ddf5eed9adf6e7");
*/
    setValue: function(newValue, newDisplayValue) {
        var hiddenElement = gel(this.name); // where values are stored for the DB
        var visibleElement = gel("select_0" + this.name); // where values are stored for the user to see
        this.visibleElementId = visibleElement.id;
        hiddenElement.value = "";
        visibleElement.options.length = 0;
        if (newValue || newDisplayValue) { // is there some value to set this to?
            if (typeof newValue == "string" && newValue != "")
                newValue = newValue.split(","); // allow passing the new value as a comma separated string
            if (typeof newDisplayValue == "string" && newDisplayValue != "") { // not an array so set a single value
                this._setValue(newValue, newDisplayValue);
            } else {
                var allEmail = true;
                if (typeof newDisplayValue == "undefined" || newDisplayValue == "") {
                    for (i=0; i<newValue.length; i++) {
                        var item = newValue[i];
                        if (item.length == 32) // a sysid will be exactly 32 characters and won't contain an "@"
                            if (item.indexOf("@") == -1) {
                                allEmail = false;
                                break;
                            }
                    }
                    if (!allEmail) { // we have references so populate display values via AJAX
                        hiddenElement.value = newValue.join();
                        var ajaxArgs = this.table + "," + newValue.join();
                        var aj = new GlideAjax("ElementGlideListAjax");
                        aj.addParam("sysparm_type", "getDisplayValues");
                        aj.addParam("sysparm_value", ajaxArgs);
                        aj.getXML(this._glideListGetDisplayValuesDone.bind(this));
                        return; // will be continued by the _glideListGetDisplayValues function upon AJAX completion
                    }
                } else
                    allEmail = false;
                if (newValue.length > 0 && newDisplayValue.length != newValue.length) {
                    jslog("Error: Length of first and second parameter arrays to setValue for " + this.name + " are not the same");
                    return;
                }
                for (i = 0; i < newDisplayValue.length; i++) {
                    if (allEmail)
                        this._setValue("", newValue[i]);
                    else
                        this._setValue(newValue[i], newDisplayValue[i]);
                }
            }
        }
        this._updateDisplay();
    },
    _setValue: function(newValue, displayValue) {
        if (!newValue) // emails do not have a reference value
            addGlideListChoice(this.visibleElementId, displayValue, displayValue, false);
        else
            addGlideListChoice(this.visibleElementId, newValue, displayValue, false);
    },
    /* this function gets called by AJAXFunction once the AJAX lookup has been completed */
    _glideListGetDisplayValuesDone: function(response, args) {
        if (!response || !response.responseXML)
            return;
        var hiddenElement = gel(this.name);
        hiddenElement.values = "";
        var references = response.responseXML.getElementsByTagName("reference");
        for (var i=0; i<references.length; i++) {
            var displayValue = references[i].attributes.getNamedItem("display").nodeValue;
            var referenceValue = references[i].attributes.getNamedItem("sys_id").nodeValue;
            this._setValue(referenceValue, displayValue);
        }
        this._updateDisplay();
    },
    _showSpacer: function(display) {
        var spacer = gel("make_spacing_ok_" + this.name);
        if (spacer)
            spacer.style.display = "inline";
    },
    _updateDisplay: function() {
        toggleGlideListIcons(this.name);
        var lockImg = gel(this.name+"_lock");
        if (lockImg.style.display == "none")
            lock(lockImg, this.name, this.name + '_edit', this.name + '_nonedit', 'select_0' + this.name, this.name + '_nonedit')
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        if (disabled) {
            var unlockElement = gel(this.name + "_unlock");
            lock(unlockElement, this.name, this.name + '_edit', this.name + '_nonedit', 'select_0' + this.name, this.name + '_nonedit');
            this._showSpacer();
            hideObject(unlockElement);
        } else {
            var unlockElement = gel(this.name + "_unlock");
            showObjectInline(unlockElement);
        }
    }
});
function viewSelection(sourceSelect, tableName, urlBase, idField) {
    var sourceOptions = sourceSelect.options;
    var index = 0;
    var selectedId = -1;
    for (var i = 0; i < sourceSelect.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            selectedId = i;
            if (index == 1)
                return;
            index++;
        }
    }
    if (index == 0)
        return;
    var option = sourceOptions[selectedId];
    var sysid = option.value;
    checkSaveID(tableName, urlBase, sysid);
}
function editList(tableName, urlBase, idField, reference) {
    g_form.setMandatoryOnlyIfModified(true);
    var form = document.forms[tableName+'.do'];
    addInput(form, "HIDDEN", "sysparm_collection", tableName);
    addInput(form, "HIDDEN", "sysparm_collection_key", idField);
    addInput(form, "HIDDEN", "sysparm_collection_related_file", reference);
    var sysid = document.getElementsByName("sys_uniqueValue")[0].value;
    sysid = trim(sysid);
    addInput(form, "HIDDEN", "sysparm_collectionID", sysid);
    var url = tableName+'.do?sys_id='+sysid;
    var view = gel('sysparm_view');
    if (view != null) {
        view = view.value;
        if (view != '')
            url = url + "&sysparm_view=" + view;
    }
    addInput(form, "HIDDEN", "sysparm_referring_url", url);
    form.sys_action.value = 'sysverb_m2ms';
    if (typeof form.onsubmit == "function") {
        var rc = form.onsubmit();
        if (!rc)
            return;
    }
    form.submit();
    return false;
}
function addGlideListChoice(selectID, value, displayValue, /* optional */ toggleIcons) {
    if (!value)
        return;
    var select = new Select(selectID);
    if (select.contains(value))
        return;
    select.addOption(value, displayValue);
    select = null;
    if (typeof toggleIcons == "undefined" || toggleIcons == true)
        toggleGlideListIcons(selectID.substring('select_0'.length));
}
function addEmailAddressToList(selectID, input, msg) {
    g_form.hideErrorBox(input);
    if (input.value == null || input.value == "")
        return;
    if (!isEmailValid(input.value)) {
        g_form.showErrorBox(input, msg);
        return;
    }
    addGlideListChoice(selectID, input.value, input.value);
    input.value = "";
}
function emailInputKeyPress(e, selectID, input, msg) {
    g_form.hideErrorBox(input);
    var keyCode = getKeyCode(e);
    if (keyCode != KEY_ENTER)
        return;
    Event.stop(e);
    addEmailAddressToList(selectID, input, msg);
    return false;
}
function removefieldBackgroundText(the_field, the_text, ref) {
    if (the_field.value == the_text) {
        the_field.value = "";
        var standard_field = gel("select_0" + ref);
        the_field.style.color = standard_field.style.color;
        the_field.style.fontStyle = standard_field.style.fontStyle;
    }
}
function selectFromFieldList(selectID, depTableElementID, refTables, types, title) {
    var depElement = gel(depTableElementID);
    if (!depElement) {
        jslog("Dependent table not found for list");
        return;
    }
    var table = depElement.value;
    if (!table) {
        jslog("Dependent table not specified for list");
        return;
    }
    var gDialog = new GlideDialogWindow('field_list_selector');
    gDialog.setTitle(title);
    gDialog.setPreference('sysparm_elementID', selectID);
    gDialog.setPreference('sysparm_table', table);
    gDialog.setPreference('sysparm_ref_tables', refTables);
    gDialog.setPreference('sysparm_types', types);
    gDialog.setPreference('sysparm_prefix', '__dollar__{'); // using a dollar sign followed by { causes jelly parsing issues - use __dollar__ instead
    gDialog.setPreference('sysparm_suffix', '}');
    gDialog.setPreference('set_request_params', 'true');
    gDialog.render();
    gDialog = null;
}
function addGlideListReference(fieldid) {
    var value = gel(fieldid).value;
    var displayWidget = gel('sys_display.' + fieldid);
    var display = displayWidget.value;
    displayWidget.value = '';
    addGlideListChoice('select_0' + fieldid,  value, display);
}
function addGlideListFromSelect(selectID, select) {
    var option = select.options[select.selectedIndex];
    addGlideListChoice(selectID, option.value, option.value);
}
function addfieldBackgroundText(the_field, the_text) {
    if (the_field.value == "") {
        the_field.value = the_text;
        the_field.save_old_color = the_field.style.color;
        the_field.style.color = "blue";
        the_field.style.fontStyle = "italic";
    }
}
function toggleGlideListIcons(id, performOnChange) {
    var add_me = gel('add_me.' + id);
    var remove = gel('remove.' + id);
    var view2 = gel('view2.' + id);
    var select = gel('select_0' + id);
    var options = select.options;
    var selCnt = 0;
    var isMe = false;
    for (var i = 0; i != options.length; i++) {
        if (options[i].selected)
            selCnt++;
        if (options[i].value == g_user.userID)
            isMe = true;
    }
    if (view2) {
        var isEmail = false;
        if (selCnt == 1) {
            var selectValue = select.options[select.selectedIndex].value;
            if (selectValue.indexOf("@") > -1) {
                var selectText = select.options[select.selectedIndex].text;
                if (selectValue == selectText) // for references the value will be the sys_id
                    isEmail = true;
            }
        }
        var view2Link = gel('view2link.' + id);
        if (selCnt == 1 && !isEmail) {
            view2.src = 'images/protected_co.gifx';
            view2Link.disabled = false;
        } else {
            view2.src = 'images/protected_co_off.gifx';
            view2Link.disabled = true;
        }
    }
    if (remove) {
        if (selCnt > 0)
            remove.src = 'images/delete_edit.gifx';
        else
            remove.src = 'images/delete_edit_off.gifx';
    }
    if (add_me) {
        if (!isMe)
            add_me.src = 'images/icons/user_obj.gifx';
        else
            add_me.src = 'images/icons/user_obj_off.gifx';
    }
    add_me = null;
    remove = null;
    view2 = null;
    options = null;
    var fixedWidth = select.getAttribute("fixedwidth");
    if (!fixedWidth) {
        select.style.width = "";
        select = null;
        setTimeout(function() {
            glideListCheckMinWidth('select_0' + id)
        }, 0);
    }
    if (typeof performOnChange != "undefined")
        if (performOnChange == false)
            return;
    glideListSaveList(id);
}
function glideListCheckMinWidth(selectID) {
    var select = gel(selectID);
    var minWidth = parseInt(select.getAttribute("minwidth"), 10)
    if (Math.max(select.clientWidth, minWidth) == minWidth)
        select.style.width = minWidth + "px";
}
function glideListSaveList(id) {
    var sel0 = gel('select_0' + id);
    var distribution = gel(id);
    saveAllSelected([ sel0 ], [ distribution ], ',', '\\', '--None--');
    onChange(id);
}
function glideListViewSelection(id, refParent, reference) {
    var view2Link = gel("view2link." + id);
    if (view2Link.disabled == true)
        return false;
    viewSelection(gel("select_0"+id), refParent, reference + ".do", id);
}
//defer classes/GlideTimeElement.js
/* Handles functions for the Glide Time elmement type.
* Any changes made here should be tested via the Test Table > All Elements > Test Time (button).
*/
var GlideTimeElement = Class.create({
    initialize: function(name, initialValue) {
        this.name = name;
        this.setValue(initialValue)
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setValue: function(value, displayValue) {
        var hours = 0;
        var mins = 0;
        var secs = 0;
        var ampm = "";
        var dateFormat = gel(this.name + '_format').value;
        if (value == "00:00:00") {
            if (dateFormat.indexOf("hh") > -1) { // initializing to zeroes on 12-hour clock means 12 AM
                hours = 12;
                ampm = "AM";
            }
        } else {
            var timeObject = this._getTimeFromFormat(value, dateFormat);
            if (!timeObject) {
                this.log("setValue aborted; unable to interpret time '" + value + "' for format '" + dateFormat + "'");
                return;
            }
            hours = timeObject.hh;
            mins = timeObject.mm;
            secs = timeObject.ss;
            ampm = timeObject.ampm;
        }
        hours = this._LZ(hours, (dateFormat.toLowerCase().indexOf("hh") > -1));
        mins = this._LZ(mins, (dateFormat.toLowerCase().indexOf("mm") > -1));
        secs = this._LZ(secs, (dateFormat.toLowerCase().indexOf("ss") > -1));
        gel(this.name + 'dur_hour').value = hours;
        gel(this.name + 'dur_min').value = mins;
        gel(this.name + 'dur_sec').value = secs;
        var ampmw = gel(this.name + 'dur_ampm');
        if (ampmw)
            if (ampm)
                ampmw.value = ampm;
        GlideTimeElement.updateRealTime(this.name); // update the hidden field
    },
    /* add a leading zero if needed */
    _LZ: function(val, padded) {
        if (!padded) {
            if (val.length > 1)
                if (val.charAt(0)=='0')
                    val = val.substring(1);
            return val;
        }
        val += "";
        if (val.length < 2)
            val = "0" + val;
        return val;
    },
    /* extract hour, minute, second, and am/pm from a string based on a specified format */
    _getTimeFromFormat: function(val, format) {
        val = trim(val);
        var i_val=0;
        var i_format = 0;
        var c = "";
        var token = "";
        var hh, mm, ss, ampm="";
        while (i_format < format.length) {
            c=format.charAt(i_format);
            token="";
            while ((format.charAt(i_format)==c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (token=="hh"||token=="h") {
                hh=this._getInt(val,i_val,token.length,2);
                if(hh==null||(hh<1)||(hh>12)) {
                    this.log("bad hours: " + hh);
                    return;
                }
                i_val+=hh.length;
            } else if (token=="HH"||token=="H") {
                hh=this._getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>23)) {
                    this.log("bad hours: " + hh);
                    return;
                }
                i_val+=hh.length;
            } else if (token=="mm"||token=="m") {
                mm=this._getInt(val,i_val,token.length,2);
                if(mm==null||(mm<0)||(mm>59)) {
                    this.log("bad minutes: " + mm);
                    return;
                }
                i_val+=mm.length;
            } else if (token=="ss"||token=="s") {
                ss=this._getInt(val,i_val,token.length,2);
                if(ss==null||(ss<0)||(ss>59)) {
                    this.log("bad seconds: " + ss);
                    return;
                }
                i_val+=ss.length;
            } else if (token=="a") {
                if (val.substring(i_val,i_val+2).toLowerCase()=="am")
                    ampm="AM";
                else if (val.substring(i_val,i_val+2).toLowerCase()=="pm")
                    ampm="PM";
                else {
                    this.log("bad AM/PM: " + val.substring(i_val,i_val+2));
                    return;
                }
                i_val+=2;
            } else {
                if (val.substring(i_val,i_val+token.length)!=token) {
                    this.log("time did not match format at character " + i_val);
                    return;
                } else
                    i_val+=token.length;
            }
        }
        if (i_val != val.length) {
            this.log("time includes trailing characters");
            return;
        }
        return {
            hh:hh,
            mm:mm,
            ss:ss,
            ampm: ampm
        };
    },
    _getInt: function(str,i,minlength,maxlength) {
        for (var x=maxlength; x>=minlength; x--) {
            var token=str.substring(i,i+x);
            var intPart = this._getInteger(token);
            if (intPart != "")
                return intPart;
        }
        return null;
    },
    _getInteger: function(val) {
        var digits="1234567890";
        for (var i=0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i))==-1)
                return val.substring(0,i);
        }
        return val;
    },
    log: function(msg) {
        jslog("GetTimeElement - " + msg);
    },
    type: function() {
        return "GlideTimeElement";
    }
});
/* Sets the value in the hidden field which is what we send back to the server.
* Note this is called by the onChange handlers on the time element's UI.
*/
GlideTimeElement.updateRealTime = function(ref) {
    var sdata = gel(ref);
    var hour = gel(ref + 'dur_hour');
    var min = gel(ref + 'dur_min');
    var sec = gel(ref + 'dur_sec');
    var ampm = "";
    var dateFormat = gel(ref + '_format').value;
    if (dateFormat.indexOf("a") > -1) {
        var ampmw = gel(ref + 'dur_ampm');
        if (ampmw)
            ampm = ampmw.value;
    }
    sdata.value = GlideTimeElement.formatTime(parseInt(hour.value || 0, 10),
        parseInt(min.value || 0, 10),
        parseInt(sec.value || 0, 10),
        ampm,
        dateFormat);
    onChange(ref);
}
/* Returns time in a string formatted to the supplied format.
*
* Hour - an integer from 0 to 23 or 0 to 12 if ampm is "PM".
* Minute - an integer from 0 to 59.
* Second - an integer from 0 to 59.
* AmPm - null (for hh formats) or AM or PM.
*/
GlideTimeElement.formatTime = function(hour, minute, second, ampm, format) {
    var value=new Object();
    if (ampm=="PM")
        hour += 12;
    value["H"]=hour;
    value["HH"]=LZ(hour); // leading zero
    if (hour==0)
        value["h"]=12;
    else if (hour>12)
        value["h"]=hour-12;
    else
        value["h"]=hour;
    value["hh"]=LZ(value["h"]);
    value["a"]=ampm;
    value["m"]=minute;
    value["mm"]=LZ(minute);
    value["s"]=second;
    value["ss"]=LZ(second);
    var i_format=0;
    var c="";
    var result="";
    while (i_format < format.length) {
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null)
            result=result + value[token];
        else
            result=result + token;
    }
    return result;
}
//defer classes/GlideURLElement.js
var GlideURLElement = Class.create({
    initialize: function(name) {
        this.name = name;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        var lockElement = gel(this.name + "_lock");
        if (!lockElement)
            return;
        var unlockElement = gel(this.name + "_unlock");
        if (disabled) {
            lock(lockElement, this.name, this.name, this.name + "_link", this.name, this.name + "_link");
            hideObject(unlockElement);
        } else {
            showObjectInline(unlockElement);
        }
    },
    setValue: function(value) {
        var encodedValue = htmlEncode(value);
        var update_id = this.name + "_link";
        var update_element = gel(update_id);
        if (update_element.href)
            update_element.href = value;
        update_element.innerHTML = encodedValue;
        var input = gel(this.name);
        input.value = value;
    }
});
//defer classes/GlideUserImageElement.js
var GlideUserImageElement = Class.create({
    initialize: function(name) {
        this.name = name;
    },
    /* Used by GlideForm handlers to override the default GlideForm method. */
    setReadOnly: function(disabled) {
        var editButtons = gel("edit." + this.name);
        var addButton = gel("add." + this.name);
        var image = gel("image." + this.name);
        if (disabled) {
            hideObject(editButtons);
            hideObject(addButton);
        } else {
            showObjectInline(editButtons);
            if (!image)
                showObjectInline(addButton);
        }
    }
});
//defer classes/TableElement.js
var TableElement = Class.create({
    REF_ELEMENT_PREFIX: 'ref_',
    initialize: function(elementName, elementLabel) {
        this.name = elementName;
        this.label = elementLabel;
        this.clearLabel = '';
        this.tableName = '';
        this.type = 'string';
        this.isRef = false;
        this.refLabel = null;
        this.refDisplay = null;
        this.refQual = null;
        this.reference = null;
        this.refRotated = false;
        this.array = null;
        this.canread = 'unknown';
        this.canwrite = 'unknown';
        this.choice = '';
        this.multi = false;
        this.active = 'unknown';
        this.table = null;
        this.dependent = null;
        this.maxLength = null;
        this.displayChars = "-1";
        this.attributes = {};
        this.dependentChildren = {};
        this.namedAttributes = {};
        this.extensionElement = false;
    },
    addAttribute: function(name, value) {
        this.attributes[name] = value;
    },
    getAttribute: function(name) {
        return this.attributes[name];
    },
    getBooleanAttribute: function(name) {
        var v = this.getAttribute(name);
        if (v == null)
            return true;
        if (v == 'false' || v == 'no')
            return false;
        return true;
    },
    isDependent: function() {
        return this.dependent != null;
    },
    hasDependentChildren: function() {
        for (var key in this.dependentChildren)
            return true;
        return false;
    },
    getDependentChildren: function() {
        return this.dependentChildren;
    },
    setTable: function(t) {
        this.table = t;
    },
    setType: function(type) {
        this.type = type;
        if (type == 'glide_list')
            this.isRef = false;
        if (type == 'glide_var')
            this.isRef = true;
    },
    setReference: function(reference) {
        if (reference && reference != '')
            this.reference = reference;
        if ((this.type == 'glide_list' && this.reference) || this.type == 'reference' || this.type == 'domain_id' || this.type == 'glide_var')
            this.isRef = true;
    },
    setRefRotated: function(rotated) {
        if ('yes' == rotated)
            this.refRotated = true;
        else
            this.refRotated = false;
    },
    setCanWrite: function(ra) {
        if ('no' == ra)
            this.canwrite = false;
        else
            this.canwrite = true;
    },
    setCanRead: function(ra) {
        if ('no' == ra)
            this.canread = false;
        else
            this.canread = true;
    },
    setActive: function(active) {
        if ('no' == active)
            this.active = false;
        else
            this.active = true;
    },
    setRefQual: function(refQual) {
        this.refQual = refQual;
    },
    setRefLabel: function(label) {
        this.refLabel = label;
    },
    setRefDisplay: function(display) {
        this.refDisplay = display;
    },
    setArray: function(array) {
        this.array = array;
    },
    setClearLabel: function(cl) {
        this.clearLabel = cl;
    },
    setChoice: function(choice) {
        this.choice = choice;
    },
    setMulti: function(multi) {
        this.multi = multi;
    },
    setExtensionElement: function(b) {
        this.extensionElement = b;
    },
    setDependent: function(dep) {
        if (dep && dep != '')
            this.dependent = dep;
    },
    addDependentChild: function(name) {
        if (name)
            this.dependentChildren[name] = true;
    },
    setMaxLength: function(maxLength) {
        this.maxLength = maxLength;
    },
    setDisplayChars: function(displayChars) {
        this.displayChars = displayChars;
    },
    setNamedAttributes: function(attrs) {
        if (!attrs)
            return;
        var pairs = attrs.split(',');
        for (var i = 0; i < pairs.length; i++) {
            var parts = pairs[i].split('=');
            if (parts.length == 2)
                this.namedAttributes[parts[0]] = parts[1];
        }
    },
    isReference: function() {
        return this.isRef;
    },
    isRefRotated: function() {
        return this.refRotated;
    },
    isExtensionElement: function() {
        return this.extensionElement;
    },
    isDate: function() {
        return dateTypes[this.type];
    },
    isDateOnly: function() {
        if (dateOnlyTypes[this.type])
            return true;
        else
            return false;
    },
    isDateTime: function() {
        if (dateTimeTypes[this.type])
            return true;
        else
            return false;
    },
    getName: function() {
        return this.name;
    },
    getLabel: function() {
        return this.label;
    },
    getClearLabel: function() {
        return this.clearLabel;
    },
    getReference: function() {
        return this.reference;
    },
    getMulti: function() {
        return this.multi;
    },
    isMulti: function() {
        return this.getMulti() == 'yes';
    },
    getDependent: function() {
        return this.dependent;
    },
    getRefQual: function() {
        return this.refQual;
    },
    getRefLabel: function() {
        return this.refLabel;
    },
    getRefDisplay: function() {
        return this.refDisplay;
    },
    getType: function() {
        return this.type;
    },
    getChoice: function() {
        return this.choice;
    },
    getTable: function() {
        return this.table;
    },
    getTableName: function() {
        return this.tableName;
    },
    setTableName: function(t) {
        this.tableName = t;
    },
    isChoice: function() {
        return (this.choice == 1 ||
            this.choice == 3 ||
            this.type == "day_of_week" ||
            this.type == "week_of_month" ||
            this.type == "month_of_year");
    },
    getMaxLength: function() {
        return this.maxLength;
    },
    getDisplayChars: function() {
        return this.displayChars;
    },
    canRead: function() {
        if (this.canread == 'unknown')
            return this.getBooleanAttribute("canread");
        return this.canread;
    },
    canWrite: function() {
        if (this.canwrite == 'unknown')
            return this.getBooleanAttribute("canwrite");
        return this.canwrite;
    },
    isActive: function() {
        if (this.active == 'unknown')
            return this.getBooleanAttribute("active");
        return this.active;
    },
    isNumber: function() {
        return this.type == 'integer' ||
        this.type == 'decimal' ||
        this.type == 'numeric' ||
        this.type == 'float' ||
        this.type == 'percent_complete';
    },
    isArray: function() {
        if (this.array && this.array == 'yes')
            return true;
        return false;
    },
    canSort: function() {
        if (!this.getAttribute("cansort"))
            return false;
        if (this.name.indexOf("password") > -1)
            return false;
        if (this.name == 'sys_id')
            return false;
        if (this.type == "journal" || this.type == "journal_input")
            return false;
        if (this.isArray())
            return false;
        return true;
    },
    canGroup: function() {
        if (!this.canSort())
            return false;
        if (this.isMulti())
            return false;
        if (this.name.indexOf(".") > -1 && this.name.indexOf(this.REF_ELEMENT_PREFIX) > -1)
            return false;
        if (this.type == "glide_duration")
            return true;
        if (this.type == 'glide_date_time' ||
            this.type == 'glide_date' ||
            this.type == 'glide_time' ||
            this.type == 'due_date')
            return false;
        return true;
    },
    getAttributes: function() {
        return this.attributes['attributes'];
    },
    getNamedAttribute: function(name) {
        if (this.namedAttributes[name])
            return this.namedAttributes[name];
        else
            return null;
    },
    type : function() {
        return "TableElement";
    }
});
TableElement.get = function(name) {
    var names = name.split('.');
    var table = names[0];
    var tableDef = Table.get(table);
    var e = null;
    for (var i = 1; i < names.length; i++) {
        e = tableDef.getElement(names[i]);
        if (i == names.length - 1)
            break;
        if (!e.isReference()) // this is an error?
            break;
        tableDef = Table.get(e.getReference());
    }
    return e;
}
//include classes/GlideUIElement.js
var GlideUIElement = Class.create({
    CACHE_ELEMENTS: true,
    ENABLE_CHILD_WALKING: false,
    initialize: function (tableName, fieldName, type, mandatory, reference, attributes) {
        this.tableName = tableName;
        this.fieldName = fieldName;
        this.type = type;
        this.mandatory = mandatory;
        this.reference = reference;
        this.attributes = attributes;
        this.elementFetched = false;
        this.elementParentNode;
        this.fetchedNodes = {};
    },
    getType: function() {
        return this.type;
    },
    getID: function() {
        return this.tableName + '.' + this.fieldName;
    },
    getElementParentNode: function() {
        if (!this.elementFetched) {
            this.elementParentNode = gel('element.' + this.getID());
            this.elementFetched = true;
        }
        return this.elementParentNode;
    },
    getElement: function() {
        return this.getChildElementById(this.getID());
    },
    getLabelElement: function() {
        var parentElementNode = this.getElementParentNode();
        if (!parentElementNode)
            parentElementNode = document;
        var labels = parentElementNode.getElementsByTagName('label');
        for (var i = 0; (label = labels[i]); i++) {
            if (label.htmlFor == this.getID())
                return label;
        }
        return this.getStatusElement();
    },
    getStatusElement: function() {
        return this.getChildElementById('status.' + this.getID());
    },
    getChildElementById: function(id) {
        if (this.fetchedNodes[id])
            return this.fetchedNodes[id];
        var element = this.getChildElementById0(id);
        if (element)
            this.fetchedNodes[id] = element;
        return element;
    },
    getChildElementById0: function(id) {
        var element;
        if (this.ENABLE_CHILD_WALKING) {
            element = this._findSubChild(this.getElementParentNode(), id);
            if (element)
                return element;
        }
        return gel(id);
    },
    isMandatory: function() {
        return this.mandatory;
    },
    isDerived: function() {
        if (!this.fieldName)
            return false;
        return this.fieldName.indexOf('.') > -1;
    },
    setMandatory: function(mandatory) {
        this.mandatory = mandatory;
    },
    _findSubChild: function(startNode, id) {
        if (!startNode || (startNode.id && startNode.id == id))
            return startNode;
        var childNodes = startNode.children || startNode.childNodes;
        for(var i = 0; i < childNodes.length; i++) {
            var foundNode = this._findSubChild(childNodes[i], id);
            if (foundNode)
                return foundNode;
        }
        return;
    },
    type: "GlideUIElement"
});