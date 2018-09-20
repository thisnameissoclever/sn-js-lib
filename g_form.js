//include classes/GlideForm.js
function default_on_submit() {
    if (!g_form)
        return true;
    return g_form.onSubmit();
}
var g_form = Class.create({
    INFO_CLASS: "outputmsg_info",
    ERROR_CLASS: "outputmsg_error",
    INFO_ICON: "images/outputmsg_success.gifx",
    ERROR_ICON: "images/outputmsg_error.gifx",
    MSG_ROW: "_message_row",
    initialize: function (tableName, mandatory, checkMandatory, checkNumeric, checkInteger) {
        this.tableName = tableName;
        this.modified = false;
        this.modifiedFields = {};
        this.mandatoryOnlyIfModified = false;
        this.elements = new Array();
        this.mandatory = mandatory;
        this.checkMandatory = checkMandatory;
        this.checkNumeric = checkNumeric;
        this.checkInteger = checkInteger;
        this.nameMap = new Array();
        this.attributes = new Array();
        this.validators = new Array();
        this.disabledFields = new Array();
        this.elementHandlers = {};
        this.prefixHandlers = new Array();
        this.newRecord = gel('sys_row') && gel('sys_row').value == "-1";
    },
    fieldChanged: function(elementName, changeFlag) {
        if (changeFlag) {
            this.modified = true;
            this.modifiedFields[elementName] = true;
        } else if (this.modifiedFields[elementName]) {
            this.modifiedFields[elementName] = false;
            this._checkModified();
        }
    },
    _checkModified: function() {
        for (var n in this.modifiedFields) {
            if (this.modifiedFields[n]) {
                this.modified = true;
                return;
            }
        }
        this.modified = false;
    },
    setMandatoryOnlyIfModified: function() {
        this.mandatoryOnlyIfModified = true;
    },
    addNameMapEntry: function(entry) {
        this.nameMap.push(entry);
    },
    addGlideUIElement: function(/* GlideUIElement */ ed) {
        this.elements.push(ed);
    },
    registerHandler: function(id, handler) {
        this.elementHandlers[id] = handler;
    },
    registerPrefixHandler: function(prefix, handlerObject) {
        var handler = new GlideFormPrefixHandler(handlerObject);
        this.prefixHandlers[prefix] = handler;
    },
    getPrefixHandler: function(id) {
        var idSplit = id.split(".");
        if (idSplit.length < 2)
            return;
        var handler = this.prefixHandlers[idSplit[0]];
        if (typeof handler == "undefined")
            return;
        handler.setFieldName(id);
        return handler;
    },
    getElement: function(id) {
        if (this.elementHandlers[id] && (typeof this.elementHandlers[id].getElement == "function"))
            return this.elementHandlers[id].getElement();
        else
            return this.getControl(id);
    },
    getParameter: function(parm) {
        if (!(parm.substr(0,8)=='sysparm_'))
            parm = 'sysparm_' + parm;
        var pcel = gel(parm);
        if (pcel)
            return pcel.value;
        else
            return '';
    },
    hasAttribute: function(s) {
        if (this.attributes[s])
            return true;
        return false;
    },
    addAttribute: function(s) {
        this.attributes[s] = s;
    },
    addValidator: function(fieldType, validator) {
        this.validators[fieldType] = validator;
    },
    setDisplay: function(fieldName, display) {
        fieldName = this.removeCurrentPrefix(fieldName);
        this._setDisplay(fieldName, display, this.isMandatory(fieldName), this.getValue(fieldName));
    },
	getBooleanValue: function(fieldName) {
		var val = this.getValue(fieldName);
		val = val ? val + '' : val;
		if (!val || val.length == 0 || val =="false")
			return false;
		return true;
	},
    _setDisplay: function(fieldName, display, isMandatory, fieldValue) {
        var s = this.tableName + '.' + fieldName;
        var control = this.getControl(fieldName);
        if (!control) {
            var handler = this.getPrefixHandler(fieldName);
            if (handler)
                handler.getObject().setDisplay(handler.getFieldName(), display);
            return;
        }
        var displayValue = 'none';
        if (display == 'true' || display == true) {
            display = true;
            displayValue = '';
        }
        if ((display != true) && isMandatory && fieldValue == '')
            return;
        var theElement = control;
        if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].getElement == "function"))
            theElement = this.elementHandlers[control.id].getElement();
        if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setDisplay == "function")) {
            this.elementHandlers[control.id].setDisplay(display ? '' : 'none');
        } else {
            this.changeElementStyle(fieldName, 'display', displayValue);
        }
        this.setSensitiveDisplayValue(s + ".ui_policy_sensitive", displayValue);
        _frameChanged();
    },
    setSensitiveDisplayValue: function(name, displayValue) {
        var elements = document.getElementsByName(name);
        for (i = 0; i < elements.length; i++ ) {
            elements[i].style.display = displayValue;
        }
    },
    setVisible: function(fieldName, visibility) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control) {
            var handler = this.getPrefixHandler(fieldName);
            if (handler)
                handler.getObject().setVisible(handler.getFieldName(), visibility);
            return;
        }
        var v = 'hidden';
        if (visibility == 'true')
            visibility = true;
        if (visibility)
            v = 'visible';
        if ((visibility != true) && this.isMandatory(fieldName) && (this.getValue(fieldName) == ''))
            return;
        this.changeElementStyle(fieldName, 'visibility', v);
    },
    changeElementStyle: function(fieldName, name, value) {
        var ge = this.getGlideUIElement(fieldName);
        if (!ge)
            return;
        if (this.changeElementParent(ge, name, value)) {
            if (isMSIE6 && name == "display") { // IE6 has bugs with just the parent being hidden, hide the element itself
                var el = ge.getElement();
                el.style[name] = value;
            }
            return;
        }
        var labelElement = ge.getLabelElement();
        if (labelElement)
            labelElement.parentNode.parentNode.style[name] = value;
        var parentTR = findParentByTag(ge.getElement(), "tr");
        if (parentTR && parentTR != labelElement)
            parentTR.style[name] = value;
    },
    changeElementParent: function(ge, name, value) {
        var element = ge.getElementParentNode();
        if (element) {
            element.style[name] = value;
            return true;
        }
        return false;
    },
    getLabel: function(id) {
        id = this.removeCurrentPrefix(id);
        var label;
        var labels = document.getElementsByTagName('label');
        for (var i = 0; (label = labels[i]); i++) {
            if (label.htmlFor.endsWith(id)) {
                return label;
            }
        }
        return false;
    },
    isNewRecord: function() {
        return this.newRecord;
    },
    isMandatory: function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var thisElement = this.getGlideUIElement(fieldName);
        if (!thisElement)
            return false;
        return thisElement.isMandatory();
    },
    setMandatory: function (fieldName, mandatory) {
        var thisElement = this.getGlideUIElement(fieldName);
        if (!thisElement) {
            var handler = this.getPrefixHandler(fieldName);
            if (handler)
                handler.getObject().setMandatory(handler.getFieldName(), mandatory);
            return;
        }
        thisElement.setMandatory(mandatory);
        var e = thisElement.getElement();
        if (e) {
            e.setAttribute("mandatory", mandatory);
            onChangeLabelProcessByEl(e, thisElement.getStatusElement());
        }
        if (mandatory) {
            setMandatoryExplained(true);
            var value = this.getValue(fieldName);
            if (value == '') {
                this._setDisplay(fieldName, true, true, '');
                this._setReadonly(fieldName, false, true, '');
            }
        }
    },
    setDisabled: function (fieldName, disabled) {
        this.setReadonly(fieldName, disabled);
    },
    setReadOnly: function (fieldName, disabled) {
        this.setReadonly(fieldName, disabled);
    },
    setReadonly: function (fieldName, disabled) {
        fieldName = this.removeCurrentPrefix(fieldName);
        this._setReadonly(fieldName, disabled, this.isMandatory(fieldName), this.getValue(fieldName));
    },
    _setReadonly: function (fieldName, disabled, isMandatory, fieldValue) {
        var s = this.tableName + '.' + fieldName;
        var control = this.getControl(fieldName);
        if (!control) {
            var handler = this.getPrefixHandler(fieldName);
            if (handler)
                handler.getObject()._setReadonly(handler.getFieldName(), disabled, isMandatory, fieldValue);
            return;
        }
        var ge = this.getGlideUIElement(fieldName);
        if (!ge)
            return;
        this._setReadonly0(ge, control, s, fieldName, disabled, isMandatory, fieldValue);
    },
    _setReadonly0: function (ge, control, s, fieldName, disabled, isMandatory, fieldValue) {
        if (disabled && isMandatory && fieldValue == '')
            return;
        if (control.getAttribute('gsftlocked') == 'true')
            return;
        if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setReadOnly == "function")) {
            if (this.elementHandlers[control.id].setReadOnly(disabled) == true)
                return;
        } else
            control.disabled = disabled;
        this._setDisabledField(control, disabled);
        this._setFieldReadOnly(ge, "sys_display." + s, disabled);
        this._setFieldReadOnly(ge, "sys_select." + s, disabled);
        var lookup = ge.getChildElementById("lookup." + s);
        var displayValue = '';
        if (lookup) {
            if (disabled)
                displayValue = 'none';
            else
                displayValue = '';
            lookup.style.display = displayValue;
        }
        this.setSensitiveDisplayValue(s + ".ui_policy_sensitive", disabled ? 'none' : '');
        this._setFieldReadOnly(ge, "ni." + this.tableName + "." + fieldName, disabled);
        if (this.tableName == "ni") // variable checkboxes have to be disabled too
            this._setFieldReadOnly(ge, "ni." + ge.fieldName, disabled);
        var geType = ge.getType();
        if (geType == "glide_duration" || geType == "glide_time") {
            this._setFieldReadOnly(ge, "ni." + this.tableName + "." + fieldName + "dur_day", disabled);
            this._setFieldReadOnly(ge, "ni." + this.tableName + "." + fieldName + "dur_hour", disabled);
            this._setFieldReadOnly(ge, "ni." + this.tableName + "." + fieldName + "dur_min", disabled);
            this._setFieldReadOnly(ge, "ni." + this.tableName + "." + fieldName + "dur_sec", disabled);
            this._setFieldReadOnly(ge, this.tableName + "." + fieldName + "dur_hour", disabled);
            this._setFieldReadOnly(ge, this.tableName + "." + fieldName + "dur_min", disabled);
            this._setFieldReadOnly(ge, this.tableName + "." + fieldName + "dur_sec", disabled);
            if (geType == "glide_time")
                this._setFieldReadOnly(ge, this.tableName + "." + fieldName + "dur_ampm", disabled);
        }
        if(control.type == "radio")
            this._readOnlyRadio(control, fieldName, disabled);
    },
    _readOnlyRadio: function (control, fieldName, disabled) {
        var parent = control.parentNode;
        if (parent.nodeName == "LABEL") // if we're on a label, we need to go up one more to get to the TD
            parent = parent.parentNode;
        var inputs = $(parent).select("input");
        var inputsDisabled = 0;
        for (var i=0; i<inputs.length; i++) {
            inputs[i].disabled = disabled;
            inputsDisabled++;
        }
        if (inputsDisabled > 1) // it was an across, we're done
            return;
        var tr = control.parentNode.parentNode; // get the TR
        if (tr.nodeName != "TR") // if we were in a label, we'll need to go up one more level
            tr = tr.parentNode;
        this._readOnlyRadioDirection(tr, fieldName, "previous", disabled);
        this._readOnlyRadioDirection(tr, fieldName, "next", disabled);
    },
    _readOnlyRadioDirection: function (tr, fieldName, direction, disabled) {
        if (direction == "previous")
            tr = tr.previousSibling;
        else
            tr = tr.nextSibling;
        var serviceCatalog = false;
        while (tr) {
            if (tr.getAttribute("is_radio_option") == "true") { // service catalog will include this attribute on the TR
                serviceCatalog = true;
                if (!fieldName.startsWith("IO:")) // translate the variable name to it's IO: name
                    fieldName = "IO:" + this._cleanupName(fieldName);
            } else if (serviceCatalog)
                return; // next TR didn't have the attribute (but we had them before) so we're done
            var td = tr.childNodes[0]; // for choices the first and only TD has the radio
            if (serviceCatalog) // for service catalog, the radio is in the 2nd TD
                td = tr.childNodes[1]; // second node should be the TD that has the radio
            if (td.childNodes) {
                var radio = td.childNodes[0];
                if (!radio)
                    return; // nothing there, we're done
                if (radio.nodeName == "LABEL") // input will be inside a label
                    radio = radio.childNodes[0];
                if (radio.nodeName != "INPUT")
                    return; // wrong type of node, we're done
                if (radio.name == fieldName || radio.name.endsWith("." + fieldName))
                    radio.disabled = disabled;
                else
                    return; // wrong name, we're done
            }
            if (direction == "previous")
                tr = tr.previousSibling;
            else
                tr = tr.nextSibling;
        }
    },
    _setFieldReadOnly: function (ge, s, disabled) {
        var control = ge.getChildElementById(s);
        if (control) {
            control.disabled = disabled;
            this._setDisabledField(control, disabled);
        }
    },
    _setDisabledField: function (control, disabled) {
        if (disabled) {
            addClassName(control, 'disabled');
            this._addDisabledField(control);
        } else  {
            removeClassName(control, 'disabled');
            this._removeDisabledField(control);
        }
    },
    _addDisabledField: function (control) {
        var n = this.disabledFields.length;
        this.disabledFields[n] = control;
    },
    _removeDisabledField: function (control) {
        var n = this.disabledFields.length;
        for (i = 0; i < n; i++) {
            if (this.disabledFields[i] == control) {
                this.disabledFields.splice(i,1);
                break;
            }
        }
    },
    onSubmit: function () {
        this.submitted = true;
        var action = this.getActionName();
        if (action == 'sysverb_back' || action == 'sysverb_cancel' || action == 'sysverb_delete' || action == 'sysverb_query')
            return true;
        var rc = this.mandatoryCheck();
        rc = rc && this.validate();
        if (rc) {
            for (i = 0; i < this.disabledFields.length; i++) {
                this.disabledFields[i].disabled = false;
            }
        }
        return rc;
    },
    mandatoryCheck: function() {
        if (!this.checkMandatory || (!this.modified && this.mandatoryOnlyIfModified))
            return true;
        var rc = true;
        var invalidFields = new Array();
        var labels = new Array();
        var missing = this.getMissingFields();
        for (var i = 0; i < missing.length; i++) {
            rc = false;
            var field = missing[i];
            var widget = this.getControl(field);
            var tryLabel = false;
            try {
                widget.focus();
            } catch (e) {
                tryLabel = true;
            }
            if (tryLabel) {
                var displayWidget = this.getDisplayBox(field);
                if (displayWidget) {
                    try {
                        displayWidget.focus();
                    } catch (exception) {
                    }
                }
            }
            labels.push(this.tableName + '.' + field);
            var widgetLabel = this.getLabelOf(field);
            var shortLabel = trim(widgetLabel + '');
            invalidFields.push(shortLabel);
        }
        if (!rc) {
            var theText = invalidFields.join(', ');
            theText = new GwtMessage().getMessage('The following mandatory fields are not filled in') + ': ' + theText;
            try {
                alert(theText);
            } catch (e) {
            }
        }
        for (var i = 0; i < labels.length; i++) {
            this.flash(labels[i], "#FFFACD", 0);
        }
        return rc;
    },
    getEditableFields: function() {
        var fa = this.elements;
        var answer = new Array();
        for (var i = 0; i < fa.length; i++) {
            var ed = fa[i];
            var widget = this.getControl(ed.fieldName);
            if (!widget)
                continue;
            if (this.isEditableField(ed, widget))
                answer.push(ed.fieldName);
        }
        return answer;
    },
    isEditableField: function(ge, control) {
        if (!this.isVisible(ge, control))
            return false;
        if (!this.isReadOnly(ge, control))
            return false;
        if (this.isDisplayNone(ge, control))
            return false;
        return true;
    },
    isVisible: function(ge, control) {
        if (ge.getType() != "glide_duration" && ge.getType != "glide_time") {
            var xx = control.style['visibility'];
            if (xx == 'hidden')
                return false;
        }
        xx = this._getElementStyle(ge, 'visibility');
        if (xx == 'hidden')
            return false;
        return true;
    },
    isReadOnly: function(ge, control) {
        return !control.disabled;
    },
    isDisplayNone: function(ge, control) {
        if (ge.getType() == 'html' || ge.getType() == 'translated_html')
            return false;
        var xx = control.style['display'];
        if (xx == 'none')
            return true;
        var xx = this._getElementStyle(ge, 'display');
        if (xx == 'none')
            return true;
        return false;
    },
    _getElementStyle: function(ge, style) {
        var element = ge.getElementParentNode();
        if (element)
            return element.style[style];
        var labelElement = ge.getLabelElement();
        if (labelElement)
            return labelElement.parentNode.parentNode.style[style];
        var parentTR = findParentByTag(ge.getElement(), "tr");
        if (parentTR && parentTR != labelElement)
            return parentTR.style[name];
        return "";
    },
    getMissingFields: function() {
        var fa = this.elements;
        var answer = new Array();
        for (var i = 0; i < fa.length; i++) {
            var ed = fa[i];
            if (!ed.mandatory)
                continue;
            var widget = this.getControl(ed.fieldName);
            if (!widget)
                continue;
            if (this._isMandatoryFieldEmpty(ed))
                answer.push(ed.fieldName);
        }
        return answer;
    },
    _isMandatoryFieldEmpty: function (ed) {
        var widgetValue = this.getValue(ed.fieldName);
        if (widgetValue != null && widgetValue != '')
            return false;
        if ((this.isNewRecord() || this.mandatory) && !ed.isDerived())
            return true;
        widgetName = "sys_original." + this.tableName + '.' + ed.fieldName;
        widget = gel(widgetName);
        if (widget) {
            widgetValue = widget.value;
            if (widgetValue == null || widgetValue == '')
                return false;
        }
        return true;
    },
    resolveNameMap: function(prettyName) {
        var rc = prettyName;
        for (var i = 0; i < this.nameMap.length; i++) {
            var entry = this.nameMap[i];
            if (entry.prettyName == prettyName) {
                rc = entry.realName;
            }
        }
        return rc;
    },
    getFormElement: function() {
        return gel(this.tableName + '.do');
    },
    getControl: function(fieldName) {
        var ge = this.getGlideUIElement(fieldName);
        if (ge) {
            var widget = ge.getElement();
            if (widget) {
                return widget;
            }
        }
        return this.getControlByForm(fieldName);
    },
    getControlByForm: function(fieldName) {
        var form = this.getFormElement();
        if (!form)
            return;
        widget = form[this.tableName + '.' + fieldName];
        if (!widget)
            widget = form[fieldName];
        if (widget && typeof widget != 'string' && widget.length) {
            for (var i = 0; i < widget.length; i++) {
                if (widget[i].checked)
                    return widget[i];
            }
            var wt = widget[0].type;
            if (typeof wt != 'undefined' && wt == 'radio')
                return widget[0];
        }
        return widget;
    },
    _tryLabelRow: function(fieldName) {
        var id = "label_" + fieldName;
        var row = gel(id);
        if (row) {
            var child = row.firstChild;
            if (child) {
                var answer = child.innerText;
                if (!answer)
                    answer = child.textContent;
                return answer;
            }
        }
        return null;
    },
    getLabelOf: function(fieldName) {
        var fieldid = this.tableName + '.' + fieldName;
        var widgetLabel = this.getLabel(fieldid);
        var labelContent = "";
        if (widgetLabel) {
            labelContent = widgetLabel.innerText || widgetLabel.textContent;
            if ((labelContent.lastIndexOf(":") +1) == labelContent.length)
                labelContent = labelContent.toString().substring(0, (labelContent.length -1));
        }
        if (labelContent == null || labelContent == '')
            labelContent = this._tryLabelRow(fieldName);
        if (labelContent == null || labelContent == '')
            labelContent = fieldName;
        return labelContent;
    },
    validate: function() {
        var fa = this.elements;
        var rc = true;
        var labels = new Array();
        for (var i = 0; i < fa.length; i++) {
            var ed = fa[i];
            var widgetName = this.tableName + '.' + ed.fieldName;
            var widget = this.getControl(ed.fieldName);
            if (widget) {
                var widgetValue = widget.value;
                var widgetType = ed.type;
                var specialType = widget.getAttribute("specialtype");
                if (specialType)
                    widgetType = specialType;
                var validator = this.validators[widgetType];
                if (validator) {
                    this.hideFieldMsg(widget);
                    var isValid = validator.call(this, widgetValue);
                    if (isValid!=null && isValid!=true) {
                        var widgetLabel = this.getLabelOf(ed.fieldName);
                        labels.push(widgetName);
                        rc = false;
                        if (isValid == false || isValid == "false")
                            isValid = "Invalid text";
                        this.showFieldMsg(widget, isValid,'error');
                    }
                }
            }
        }
        for (var i = 0; i < labels.length; i++)
            this.flash(labels[i], "#FFFACD", 0);
        return rc;
    },
    removeCurrentPrefix: function(id) {
        if (id.indexOf('current.') == 0)
            id = id.substring(8);
        return id;
    },
    isNumeric: function(internaltype) {
        if (internaltype == 'decimal')
            return true;
        if (internaltype == 'float')
            return true;
        if (internaltype == 'integer')
            return true;
        if (internaltype == 'numeric')
            return true;
        return false;
    },
    isInteger: function(internaltype) {
        if (internaltype == 'integer')
            return true;
        return false;
    },
    setTemplateValue: function(fieldName, value, displayValue) {
        fieldname = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (control)
            control.templateValue = 'true';
        this.setValue(fieldName, value, displayValue);
    },
    setValue: function(fieldName, value, displayValue) {
        fieldname = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control) {
            var handler = this.getPrefixHandler(fieldName);
            if (handler)
                handler.getObject().setValue(handler.getFieldName(), value, displayValue);
            return;
        }
        this._setValue(fieldName, value, displayValue, true);
        triggerEvent(control, 'change');
    },
    getNiBox: function(fieldName) {
        var niName = 'ni.' + this.tableName + '.' + fieldName;
        return gel(niName);
    },
    getDisplayBox: function(fieldName) {
        var dName = 'sys_display.' + this.tableName + '.' + fieldName;
        var field = gel(dName);
        if (field)
            return field;
        dName = 'sys_display.' + fieldName;
        return gel(dName);
    },
    clearValue: function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control)
            return;
        if (!control.options) {
            this._setValue(fieldName, '');
            return;
        }
        var selindex = control.selectedIndex;
        if (selindex != -1) {
            var option = control.options[selindex];
            option.selected = false;
        }
        var options = control.options;
        for (i = 0; i < options.length; i++) {
            var option = options[i];
            var optval = option.value;
            if (optval == '') {
                option.selected = true;
                break;
            }
        }
    },
    _setValue: function(fieldName, value, displayValue, updateRelated) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        var readOnlyField = gel('sys_readonly.' + control.id);
        if (readOnlyField) {
            if (displayValue && readOnlyField.tagName != "SELECT")
                readOnlyField.value = displayValue;
            else
                readOnlyField.value = value;
        } else {
            readOnlyField = gel(control.id + "_label");
            if (readOnlyField) {
                displayValue = this._ensureDisplayValue(fieldName, value, displayValue);
                if (readOnlyField.tagName == 'SPAN')
                    readOnlyField.innerHTML = displayValue;
                else
                    readOnlyField.value = displayValue;
            }
        }
        if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setValue == "function"))
            this.elementHandlers[control.id].setValue(value, displayValue);
        else if (control.options) {
            var i = this._getSelectedIndex(control, value, displayValue);
            control.selectedIndex = i;
        } else if (control.type == 'hidden') {
            var nibox = this.getNiBox(fieldName);
            if (nibox && nibox.type == 'checkbox') {
                if (value && value == '0')
                    value = 'false';
                if (value && value == '1')
                    value = 'true';
                control.value = value;
                if (value && value == 'false')
                    nibox.checked = null;
                else
                if (value || value == 'true')
                    nibox.checked = 'true';
                else
                    nibox.checked = null;
                setCheckBox(nibox);
                onChange(this.tableName + "." + fieldName);
                return;
            }
            var displaybox = this.getDisplayBox(fieldName);
            if (displaybox) {
                var sel = gel("sys_select." + this.tableName + "." + fieldName);
                if (typeof(displayValue) == 'undefined' && value)
                    displayValue = this._ensureDisplayValue(fieldName, value, displayValue);
                if (typeof(displayValue) != 'undefined') {
                    control.value = value;
                    displaybox.value = displayValue;
                    this._setReferenceSelect(control, sel, value, displayValue);
                    refFlipImage(displaybox, control.id);
                    if (updateRelated)
                        updateRelatedGivenNameAndValue(this.tableName + '.' + fieldName, value);
                    return;
                }
                control.value = value;
                if (value == null || value == '') {
                    displaybox.value = '';
                    this._setReferenceSelect(control, sel, value, '');
                    refFlipImage(displaybox, control.id);
                    return;
                }
                displaybox.value = displayValue;
                this._setReferenceSelect(control, sel, value, displayValue);
                refFlipImage(displaybox, control.id);
                updateRelatedGivenNameAndValue(this.tableName + '.' + fieldName, value);
            } else {
                var ge = this.getGlideUIElement(fieldName);
                if (ge && ge.getType() == 'glide_duration')
                    setDurationValues(this.getTableName() + "." + fieldName, value);
            }
        } else
            control.value = value;
    },
    _setReferenceSelect: function(control, sel, value, displayValue) {
        if (control && !control.options && sel) {
            var i = this._getSelectedIndex(sel, value, displayValue);
            sel.selectedIndex = i;
        }
    },
    _getSelectedIndex: function(control, value, displayValue) {
        var options = control.options;
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.value == value) {
                return i;
            }
        }
        var dv = value;
        if (typeof(displayValue) != 'undefined')
            dv = displayValue;
        var newOption = new Option(dv, value);
        control.options[control.options.length] = newOption;
        return control.options.length-1;
    },
    _ensureDisplayValue: function (fieldName, value, displayValue) {
        if (displayValue)
            return displayValue;
        var ed = this.getGlideUIElement(fieldName);
        if (!ed)
            return displayValue;
        if (ed.type != 'reference' && ed.type != 'domain_id')
            return displayValue;
        var ga = new GlideAjax('AjaxClientHelper');
        ga.addParam('sysparm_name','getDisplay');
        ga.addParam('sysparm_table', ed.reference);
        ga.addParam('sysparm_value',value);
        ga.getXMLWait();
        return ga.getAnswer();
    },
    getUniqueValue: function() {
        return this.getValue('sys_uniqueValue');
    },
    getValue: function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control) {
            var handler = this.getPrefixHandler(fieldName);
            if (handler)
                return handler.getObject().getValue(handler.getFieldName());
            return '';
        }
        return this._getValueFromControl(control);
    },
    _getValueFromControl: function(control) {
        if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].getValue == "function"))
            return new String(this.elementHandlers[control.id].getValue());
        return new String(control.value);
    },
    getIntValue: function(fieldName) {
        var val = this.getValue(fieldName);
        if (!val || val.length == 0)
            return 0;
        return parseInt(formatClean(val));
    },
    /* Add an option to a choice list.
*
* Add to the end of a choice list:
*       g_form.addOption('priority', '6', '6 - Really Low');
* Add at a specific point in a choice List (zero-based):
*       g_form.addOption('priority', '2.5', '2.5 - Really Low', 3);
*/
    addOption: function (fieldName, choiceValue, choiceLabel, choiceIndex) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control)
            return;
        if (!control.options)
            return;
        var len = control.options.length;
        if (choiceIndex == undefined)
            choiceIndex = len; // no position specified, put it at the end
        if (choiceIndex < 0 || choiceIndex > len)
            choiceIndex = len; // specified position is impossible, put it at the end
        var newOption = new Option(choiceLabel, choiceValue);
        var value = choiceValue;
        if (len > 0) { // push existing down options after the specified position
            value = this.getValue(fieldName); // selected value remains the same as before
            control.options[len] = new Option('', '');
            for (var i = len; i > choiceIndex; i--) {
                control.options[i].text = control.options[i - 1].text;
                control.options[i].value = control.options[i - 1].value;
            }
        }
        control.options[choiceIndex] = newOption;
        this.setValue(fieldName, value);
    },
    clearOptions: function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (control && !control.options) {
            var name = "sys_select." + this.tableName + "." + fieldName;
            control = gel(name);
        }
        if (!control)
            return;
        if (!control.options)
            return;
        control.innerHTML = '';
    },
    getOptionControl: function(fieldName, choiceValue) {
        var noPrefix = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(noPrefix);
        if (control && !control.options) {
            var name = "sys_select." + this.tableName + "." + noPrefix;
            control = gel(name);
        }
        return control;
    },
    removeOption: function(fieldName, choiceValue) {
        var control = this.getOptionControl(fieldName, choiceValue);
        if (!control)
            return;
        if (!control.options)
            return;
        var options = control.options;
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.value == choiceValue) {
                if (isWebKit) {
                    option.disabled = true;
                } else
                    control.options[i] = null;
                break;
            }
        }
    },
    getOption: function(fieldName, choiceValue) {
        var control = this.getOptionControl(fieldName, choiceValue);
        if (!control)
            return null;
        if (!control.options)
            return null;
        var options = control.options;
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.value == choiceValue)
                return option;
        }
        return null;
    },
    removeContextItem: function(itemID) {
        for (av in contextMenus) {
            if (contextMenus[av]) {
                var menu = contextMenus[av];
                var c = menu.context;
                if (c)
                    this.removeItem(menu, itemID);
            }
        }
    },
    removeItem: function(menu, itemID) {
        var items = menu.childNodes;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.innerHTML == itemID) {
                menu.removeChild(item);
                clearNodes(item);
                break;
            }
        }
        return;
    },
    getGlideUIElement: function (fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        for (var i = 0; i < this.elements.length; i++) {
            var thisElement = this.elements[i];
            if (thisElement.fieldName == fieldName)
                return thisElement;
        }
    },
    getDerivedFields: function(fieldName) {
        var parts = fieldName.split(".");
        parts.shift();
        fieldName = parts.join(".")+".";
        var list = new Array();
        for (var i = 0; i < this.elements.length; i++) {
            var thisElement = this.elements[i];
            if (thisElement.fieldName.indexOf(fieldName) == 0) {
                var target = thisElement.fieldName.substring(fieldName.length);
                list.push(target);
            }
        }
        if (list.length == 0)
            return null;
        return list;
    },
    getReference: function(fieldName, callback) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var ed = this.getGlideUIElement(fieldName);
        if (!ed)
            return;
        if (ed.type != 'reference' && ed.type != 'domain_id')
            return;
        var value = this.getValue(fieldName);
        if (!value)
            return;
        var gr = new GlideRecord(ed.reference);
        if (value == "")
            return gr;
        gr.addQuery('sys_id', value);
        if (callback) {
            var fn = function(gr) {
                gr.next();
                callback(gr)
                }; // cloture mojo
            gr.query(fn);
            return;
        }
        gr.query();
        gr.next();
        return gr;
    },
    submit: function() {
        var action = gel('sysverb_update');
        if (action)
            return gsftSubmit(action);
    },
    save: function() {
        var action = gel('sysverb_update_and_stay');
        if (action)
            return gsftSubmit(action);
    },
    getActionName: function () {
        var form = this.getFormElement();
        if (form) {
            var theButton = form.sys_action;
            if (theButton)
                return theButton.value;
        }
        return this.action;
    },
    getTableName: function() {
        return this.tableName;
    },
    getSections: function() {
        var spans = document.getElementsByTagName('span');
        var sections = new Array();
        for (var i = 0; i < spans.length; i++) {
            if (spans[i].id.substring(0, 8) == "section.")
                sections.push(spans[i]);
        }
        return sections;
    },
    serialize: function (filterFunc) {
        var formName = this.tableName + '.do';
        if (!filterFunc)
            return Form.serialize(gel(formName));
        var elements = Form.getElements(gel(formName));
        var queryComponents = new Array();
        for (var i = 0; i < elements.length; i++) {
            if (filterFunc(elements[i])) {
                var queryComponent = Form.Element.serialize(elements[i]);
                if (queryComponent)
                    queryComponents.push(queryComponent);
            }
        }
        return queryComponents.join('&');
    },
    serializeChanged: function() {
        var s = this.serializeTargetFields();
        var f = this.serialize(this.changedFieldsFilter.bind(this));
        if (f)
            f = "&" + f;
        return s + f;
    },
    serializeChangedAll: function() {
        var s = this.serializeTargetFields();
        var f = this.serialize(this.allChangedFieldsFilter.bind(this));
        if (f)
            f = "&" + f;
        return s + f;
    },
    serializeTargetFields: function() {
        var s = this._serializeElement("sys_target");
        s += this._serializeElement("sys_uniqueValue");
        s += this._serializeElement("sys_row");
        s += this._serializeElement("sysparm_encoded_record");
        return s;
    },
    _serializeElement: function(id) {
        var e = gel(id);
        if (e) {
            var queryComponent = Form.Element.serialize(e);
            if (queryComponent)
                return "&" + queryComponent;
        }
        return "";
    },
    changedFieldsFilter: function(element) {
        if (element.changed
            && element.id.startsWith(this.getTableName() + ".")
            && (element.tagName.toUpperCase() != "TEXTAREA"))
            return true;
        if (element.id.startsWith("ni.VE"))
            return true;
        if (element.name.startsWith("ni.WATERMARK"))
            return true;
        return false;
    },
    allChangedFieldsFilter: function(element) {
        if (element.changed && element.id.startsWith(this.getTableName() + "."))
            return true;
        return false;
    },
    flash: function (widgetName, color, count) {
        var row = null;
        var labels = new Array();
        var realLabel = this.getLabel(widgetName);
        if (realLabel)
            row = $(realLabel.parentNode.parentNode);
        else {
            jslog("flash() called for '" + widgetName + "' but there is no label for it")
            return;
        }
        var temp = row.select('.label_left');
        for (var i = 0; i < temp.length; i++)
            labels.push(temp[i]);
        temp = row.select('.label_right');
        for (var i = 0; i < temp.length; i++)
            labels.push(temp[i]);
        temp = row.select('.label');
        for (var i = 0; i < temp.length; i++)
            labels.push(temp[i]);
        count = count + 1;
        for (var i = 0; i < labels.length; i++) {
            var widget = labels[i];
            if (widget) {
                var originalColor = widget.style.backgroundColor;
                widget.style.backgroundColor = color;
            }
        }
        if (count < 4)
            setTimeout('g_form.flash("' + widgetName + '", "' + originalColor + '", ' + count + ')', 500);
    },
    enable: function () {
        var form = this.getFormElement();
        if (form)
            for (var i = 0; i < form.elements.length; i++)
                form.elements[i].disabled = false;
    },
    disable: function() {
        var form = this.getFormElement();
        if (form)
            for (var i = 0; i < form.elements.length; i++)
                form.elements[i].disabled = true;
    },
    showRelatedList: function(listTableName) {
        show(listTableName + "_wrapper");
        show(this.findV2RelatedListName(listTableName));
    },
    hideRelatedList: function(listTableName) {
        hide(listTableName + "_wrapper");
        hide(this.findV2RelatedListName(listTableName));
    },
    findV2RelatedListName: function(listTableName) {
        var compareId = this.getTableName() + "." + listTableName;
        var rlw = gel("related_lists_wrapper");
        for (var i=0; i < rlw.childNodes.length; i++) {
            var node = rlw.childNodes[i];
            if (node.nodeName != "DIV")
                continue;
            var idName = node.getAttribute("id");
            if (idName.length == 0)
                continue;
            if (idName.indexOf(compareId) > -1)
                return node.firstChild;
        }
        return "";
    },
    showRelatedLists: function() {
        show("related_lists_wrapper");
        if (g_tabs2List && g_tabs2List.isActivated())
            show("tabs2_list");
    },
    hideRelatedLists: function() {
        hide("related_lists_wrapper");
        if (g_tabs2List && g_tabs2List.isActivated())
            hide("tabs2_list");
    },
    addInfoMessage: function(msg) {
        this._addFormMessage(msg, "info");
    },
    addErrorMessage: function(msg) {
        this._addFormMessage(msg, "error");
    },
    _addFormMessage: function(msg, type) {
        var e = gel("output_messages");
        var newMsg = document.createElement("div");
        newMsg.setAttribute("class", "system_message outputmsg_" + type);
        newMsg.setAttribute("className", "system_message outputmsg_" + type);
        newMsg.innerHTML = '<table cellspacing="0" cellpadding="0" border="0" class="background_transparent"><tbody><tr><td class="message_image"><img width="16" height="16" src="images/outputmsg_' + type + '.gifx"></td><td width="100%">' + msg + '</td><td id="close_messages" class="message_image close_messages"></td></tr></tbody></table>';
        e.appendChild(newMsg);
        var close_images = $(e).select(".close_messages");
        for (var i = 0; i < close_images.length; i++)
            close_images[i].innerHTML = "";
        var c = gel("close_messages");
        c.innerHTML = '<img src="images/x.gifx" width="13" height="12" onclick="window.hide(\'output_messages\');gel(\'output_messages\').innerHTML = \'\';"/>';
        e.style.display = "";
        var scrollDiv = getFormContentParent();
        scrollDiv.scrollTop = 0;
    },
    /***
* Show an message below the indicated form field.
* input - name (string) of the field or the control (object) itself for the field.
* message - Message string.
* type - string either "info" or "error".
* scrollForm (optional) - true means to scroll down to the field.  False means do not scroll down to the
*    field.  If not specified, the property glide.ui.scroll_to_message_field is used to determine
*    whether scrolling should occur.
*/
    showFieldMsg: function(input, message, type, /* optional */ scrollForm) {
        var msgClass;
        var msgImage;
        var msgImageAlt;
        var msgRowType;
        switch(type)
        {
            case "info":
                msgClass = this.INFO_CLASS;
                msgImage = this.INFO_ICON;
                msgImageAlt = new GwtMessage().getMessage("Informational Message");
                msgRowType = 'info' + this.MSG_ROW;
                break;
            case "error":
                msgClass = this.ERROR_CLASS;
                msgImage = this.ERROR_ICON;
                msgImageAlt = new GwtMessage().getMessage("Error Message");
                msgRowType = 'error' + this.MSG_ROW;
                break;
            default:
                msgClass = this.INFO_CLASS;
                msgImage = this.INFO_ICON;
                msgImageAlt = new GwtMessage().getMessage("Informational Message");
                msgRowType = 'info' + this.MSG_ROW;
                break;
        }
        var inputElement = input;
        if (typeof(inputElement)=="string") // if a string, it's not the actual control so get it
            inputElement = this.getControl(inputElement);
        if (!inputElement || !message) {
            jslog("ERROR: invalid field or missing message passed to g_form.showFieldMsg('" + input + "','" + message + "')");
            return;
        }
        var positionedCursor = this._positionCursorAtError(inputElement, message);
        var fieldTrId = "element." + inputElement.id;
        var tr = document.getElementById(fieldTrId);
        if (!tr) {
            var parent = inputElement.parentNode;
            var tr = null;
            while (parent != null) {
                if (parent.nodeName.toUpperCase() == 'TR') {
                    tr = parent;
                    break;
                }
                parent = parent.parentNode;
            }
        }
        if (tr == null) {
            return;
        }
        if (inputElement.nodeName.toUpperCase() == "TEXTAREA")
            var msgColspan = inputElement.parentNode.colSpan;
        else
            var msgColspan = tr.cells.length;
        var rows = tr.parentNode;
        var doc = tr.ownerDocument;
        var fieldmsgTr = doc.createElement('TR');
        fieldmsgTr.className = msgRowType;
        fieldmsgTr.hasFieldmsg = true;
        var fieldmsgTd = doc.createElement('TD');
        fieldmsgTd.colSpan = msgColspan;
        fieldmsgTr.appendChild(fieldmsgTd);
        var fieldmsgDiv = doc.createElement('DIV');
        fieldmsgDiv.className = msgClass;
        fieldmsgTd.appendChild(fieldmsgDiv);
        var fieldmsgImg = doc.createElement('IMG');
        fieldmsgImg.src = msgImage;
        fieldmsgImg.alt = msgImageAlt;
        fieldmsgDiv.appendChild(fieldmsgImg);
        var fieldmsgMsg = doc.createTextNode(message);
        fieldmsgDiv.appendChild(fieldmsgMsg);
        rows.insertBefore(fieldmsgTr, tr.nextSibling);
        if (!positionedCursor) // if we weren't able to position the cursor within a block of text,
            this._scrollToElementTR(tr, fieldmsgTr, scrollForm);
    },
    /***
* Called by showFieldMsg to scroll down to the label for an element.  This keeps the user from
* missing a message if it appears off the screen.  Scrolling occurs if either the label or
* the message is off the screen.  When scrolling occurs, we scroll to the top of the label.
*/
    _scrollToElementTR: function(labelTR, msgTR, scrollForm) {
        var scroll = scrollForm;
        if (typeof scroll == "undefined") {
            var scrollToMsg = gel("ni.scroll_to_messsage_field");
            if (scrollToMsg == null)
                scroll = true;
            else {
                if (scrollToMsg.value != "false")
                    scroll = true;
                else
                    scroll = false;
            }
        }
        if (!scroll)
            return;
        var scrollDiv = getFormContentParent();
        var refControl = gel("sys_target");
        var ref;
        var titleDiv;
        if (refControl != null) {
            ref = refControl.value;
            titleDiv = gel(ref + ".form_header");
        } else {
            titleDiv = gel("form_header");
        }
        var headerHeight = titleDiv.clientHeight;
        var topOfLabel = grabOffsetTop(labelTR);
        var needToScroll = false;
        if (topOfLabel > scrollDiv.scrollTop + scrollDiv.clientHeight)
            needToScroll = true; // label is below the current display
        else if (topOfLabel < scrollDiv.scrollTop + headerHeight)
            needToScroll = true; // label is above the current display
        else { // label was OK but is the message on the screen?
            var topOfMsg = grabOffsetTop(msgTR);
            if (topOfMsg > scrollDiv.scrollTop + scrollDiv.clientHeight)
                needToScroll = true;
        }
        if (needToScroll)
            scrollDiv.scrollTop = topOfLabel - headerHeight;
    },
    /***
* Show an error message below the indicated form field.
* input - name (string) of the field or the control (object) itself for the field.
* message - Message string.
* scrollForm (optional) - true means to scroll down to the field.  False means do not scroll down to the
*    field.  If not specified, the property glide.ui.scroll_to_message_field is used to determine
*    whether scrolling should occur.
*/
    showErrorBox: function(input, message, /* optional */ scrollForm) {
        this.showFieldMsg(input, message, "error", scrollForm);
    },
    hideFieldMsg: function(input, clearAll) {
        var inputElement = input;
        if (typeof(inputElement)=="string") // if a string, it's not the actual control so get it
            inputElement = this.getControl(inputElement);
        if (!inputElement) {
            jslog("ERROR: invalid field ('" + input + "') passed to g_form.hideFieldMsg");
            return;
        }
        var fieldTrId = "element." + inputElement.id;
        var tr = document.getElementById(fieldTrId);
        if (!tr) {
            var parent = inputElement.parentNode;
            var tr = null;
            while (parent != null) {
                if (parent.nodeName.toUpperCase() == 'TR') {
                    tr = parent;
                    break;
                }
                parent = parent.parentNode;
            }
        }
        if (tr == null)
            return;
        var fieldmsgTr = tr.nextSibling;
        if (fieldmsgTr != null) {
            while (fieldmsgTr != null && fieldmsgTr.getAttribute("is_radio_option") == "true") {
                fieldmsgTr = fieldmsgTr.nextSibling;
            }
            if (fieldmsgTr != null && fieldmsgTr.hasFieldmsg) {
                fieldmsgTr.parentNode.removeChild(fieldmsgTr);
                if (!clearAll)
                    return;
                this.hideFieldMsg(input, true);
            }
        }
    },
    hasFieldMsgs: function(type) {
        var formHasFieldMsgs = false;
        if (type) {
            var msgTRs = $(document.body).select('.' + type + this.MSG_ROW);
            formHasFieldMsgs = msgTRs.length > 0;
        }
        else {
            var msgTRs = $(document.body).select('.info' + this.MSG_ROW);
            formHasFieldMsgs = msgTRs.length > 0;
            var msgTRs = $(document.body).select('.error' + this.MSG_ROW);
            if (msgTRs.length > 0)
                formHasFieldMsgs = true;
        }
        return formHasFieldMsgs;
    },
    hideAllFieldMsgs: function(type) {
        if (type) {
            var msgTRs = $(document.body).select('.' + type + this.MSG_ROW);
            for (var i = 0; i < msgTRs.length;i++) {
                msgTRs[i].parentNode.removeChild(msgTRs[i]);
            }
        }
        else {
            var msgTRs = $(document.body).select('.info' + this.MSG_ROW);
            for (var i = 0; i < msgTRs.length;i++) {
                msgTRs[i].parentNode.removeChild(msgTRs[i]);
            }
            var msgTRs = $(document.body).select('.error' + this.MSG_ROW);
            for (var i = 0; i < msgTRs.length;i++) {
                msgTRs[i].parentNode.removeChild(msgTRs[i]);
            }
        }
    },
    hideErrorBox: function(input) {
        this.hideFieldMsg(input);
    },
    _positionCursorAtError: function(elem, message) {
        if (typeof elem == "undefined" || elem.disabled)
            return false;
        var index = message.indexOf("line (");
        if (index > -1) {
            var parenIndex = message.indexOf(")", index+6);
            if (parenIndex > -1) {
                var lineNo = message.substring(index + 6, parenIndex);
                lineNo = parseInt(lineNo, 10);
                index = message.indexOf("(", parenIndex);
                if (index > -1) {
                    parenIndex = message.indexOf(")", index);
                    if (parenIndex > -1) {
                        var columnNo = message.substring(index + 1, parenIndex);
                        columnNo = parseInt(columnNo, 10);
                        return this._setCaretPositionLineColumn(elem, lineNo, columnNo);
                    }
                } else
                    return this._setCaretPositionLineColumn(elem, lineNo, 1);
            }
        }
        return false;
    },
    _setCaretPositionLineColumn: function(elem, lineNo, columnNo) {
        var pl = 1;
        var data = elem.value;
        var len = data.length;
        var position = 0;
        while (pl < lineNo && position > -1) {
            position = data.indexOf('\n', position);
            if (position > -1)
                position++;
            pl++;
        }
        if (position == -1) {
            jslog("Failed to find editor caret position for error");
            return false; // we failed to find the line you wanted
        }
        position += columnNo - 1;
        if (elem.createTextRange)
            position -= lineNo - 1; // don't count new line chars in this case
        try {
            this._setCaretPosition(elem, position);
        } catch (err) {
            jslog("Failed to position cursor at the error");
            return false;
        }
        return true;
    },
    _setCaretPosition: function(elem, caretPos) {
        if (elem.createTextRange) { // IE
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if (elem.setSelectionRange) { // Firefox & Webkit
                if (caretPos == 0)
                    caretPos = 1;
                elem.setSelectionRange(caretPos - 1, caretPos);
                if (isSafari || isChrome) // we don't have a good way to scroll in these
                    elem.focus();
                else { // Firefox needs a little extra help scrolling there
                    var ev = document.createEvent("KeyEvents");
                    ev.initKeyEvent("keypress", true, true, window, false, false, false, false, 0, elem.value.charCodeAt(caretPos - 1));
                    elem.dispatchEvent(ev);
                    elem.focus();
                }
            } else
                elem.focus();
        }
    },
    disableAttachments: function() {
        var label = gel("header_attachment_list_label");
        if (label)
            label.href = "javascript:alert('Attachments are not allowed')";
        var icon = gel("header_add_attachment");
        if (icon)
            icon.style.display = 'none';
        AttachmentUploader.disableAttachments();
    },
    setAction: function(action) {
        this.action = action;
    },
    getAction: function() {
        return this.action;
    },
    type: "g_form"
});
var GlideFormPrefixHandler = Class.create({
    initialize: function (handlerObject) {
        this.handlerObject = handlerObject;
        this.fieldName = "";
    },
    getObject: function() {
        return this.handlerObject;
    },
    getFieldName: function() {
        return this.fieldName;
    },
    setFieldName: function(id) {
        this.fieldName = id;
    },
    type: "GlideFormPrefixHandler"
});