//include classes/ServiceCatalogForm.js
var ServiceCatalogForm = Class.create(GlideForm, {
    initialize: function (tableName, mandatory, checkMandatory, checkNumeric, checkInteger) {
        GlideForm.prototype.initialize.call(this, tableName, mandatory, checkMandatory, checkNumeric, checkInteger);
        this.onCatalogSubmit = new Array();
    },
    fieldChanged: function() {
        this.modified = true;
    },
    _setCatalogCheckBoxDisplay : function (id, d) {
        var id = this.resolveNameMap(id);
        var nidot = gel('ni.' + id);
        if (!nidot)
            return false;
        var iotable = nidot.parentNode;
        while(iotable.className != "io_table")
            iotable = iotable.parentNode;
        if(iotable.className == "io_table") {
            if(d != "none") {
                iotable.style.display = d;
                nidot.parentNode.style.display = d;
                this._setCatalogSpacerDisplay(iotable, d);
            } else {
                var hideParent = true;
                var inputs = iotable.getElementsByTagName('input');
                for(var h=0;h<inputs.length&&hideParent==true;h++) {
                    if(inputs[h].id.indexOf('ni.') != -1 &&
                        inputs[h].parentNode.style.display != "none" &&
                        inputs[h].id != nidot.id) {
                        hideParent = false;
                    }
                }
                if(hideParent) {
                    iotable.style.display = d;
                    this._setCatalogSpacerDisplay(iotable, d);
                }
                nidot.parentNode.style.display = d;
            }
        }
        return true;
    },
    _setCatalogSpacerDisplay : function (table, d) {
        var id = this.resolveNameMap(id);
        var spacer = table.parentNode.parentNode.previousSibling;
        spacer.style.display = d;
    },
    setCatalogDisplay: function(id, d) {
        var id = this.resolveNameMap(id);
        if (this._setCatalogCheckBoxDisplay(id, d))
            return;
        var label = gel('label_' + id);
        if (label) {
            label.parentNode.parentNode.style.display = d;
            this._setCatalogSpacerDisplay(label.parentNode.parentNode, d);
        }
    },
    setCatalogVisibility: function(id, d) {
        var id = this.resolveNameMap(id);
        var label = gel('label_' + id);
        if (label)
            label.parentNode.parentNode.style.visibility = d;
        var spacer = gel('spacer_' + id);
        if (spacer) {
            spacer.style.visibility = d;
        }
    },
    removeCurrentPrefix: function(id) {
        return this.removeVariablesPrefix(GlideForm.prototype.removeCurrentPrefix.call(this, id));
    },
    removeVariablesPrefix: function(id) {
        var VARIABLES_PREFIX = "variables.";
        if (id.startsWith(VARIABLES_PREFIX))
            id = id.substring(VARIABLES_PREFIX.length);
        return id;
    },
    _cleanupName : function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        fieldName = this.resolveNameMap(fieldName);
        fieldName = fieldName.split(':');
        if (fieldName.length != 2)
            return false;
        fieldName = fieldName[1];
        return fieldName;
    },
    setContainerDisplay : function(fieldName, display) {
        fieldName = this._cleanupName(fieldName);
        if (!fieldName)
            return false;
        var container = gel('container_'+fieldName);
        if (!container)
            return false;
        var d = 'none';
        if (display == 'true' || display == true)
            d = '';
        container.style.display = d;
        container.style.display = d;
        return true;
    },
    hideSection : function(fieldName) {
        this.hideReveal(fieldName, false);
    },
    revealSection : function(fieldName) {
        this.hideReveal(fieldName, true);
    },
    hideReveal : function(fieldName, expand) {
        fieldName = this._cleanupName(fieldName);
        var row = gel('row_'+fieldName);
        if (!row)
            return false;
        if (expand && row.style.display=='none')
            toggle = true;
        else if (!expand && row.style.display != 'none')
            toggle = true;
        if (toggle)
            toggleVariableSet(fieldName);
    },
    setDisplay: function(id, display) {
        if (this.setContainerDisplay(id, display))
            return;
        id = this.removeCurrentPrefix(id);
        var s = this.tableName + '.' + id;
        var fieldName = id;
        var control = this.getControl(fieldName);
        if (!control)
            return;
        var d = 'none';
        var parentClass = '';
        if (display == 'true')
            display = true;
        if (display) {
            d = '';
            parentClass = 'label';
        }
        this.setCatalogDisplay(id, d);
        _frameChanged();
        return;
    },
    setVisible: function(id, visibility) {
        id = this.removeCurrentPrefix(id);
        var s = this.tableName + '.' + id;
        var fieldName = id;
        var control = this.getControl(fieldName);
        if (!control)
            return;
        var v = 'hidden';
        var parentClass = '';
        if (visibility == 'true')
            visibility = true;
        if (visibility) {
            v = 'visible';
            parentClass = 'label';
        }
        this.setCatalogVisibility(id, v);
        return;
    },
    setMandatory: function (fieldName, mandatory) {
        fieldName = this.removeCurrentPrefix(fieldName);
        fieldName = this.resolveNameMap(fieldName);
        var foundIt = this._setMandatory(this.elements, fieldName, mandatory);
        if (foundIt==false && g_form != null && window.g_sc_form && g_form != g_sc_form) {
            this._setMandatory(g_form.elements, fieldName, mandatory);
        }
    },
    _setMandatory: function (elements, fieldName, mandatory) {
        var foundIt = false;
        for (var x=0; x< elements.length; x++) {
            var thisElement = elements[x];
            var thisField = thisElement.fieldName;
            if (thisField == fieldName) {
                foundIt = true;
                thisElement.mandatory = mandatory;
                var className = '';
                if (mandatory && !this.getValue(fieldName).blank())
                    className = "mandatory_populated";
                else if (mandatory)
                    className = 'mandatory';
                this.changeCatLabel(fieldName, className);
                setMandatoryExplained();
            }
        }
        return foundIt;
    },
    changeCatLabel: function (fieldName, className) {
        var d = $('status.' + fieldName);
        if (d)
            d.className = className;
    },
    getCatLabel : function (fieldName) {
        var realName = this.resolveNameMap(fieldName);
        var label = $('status.' + realName);
        if (label)
            return label;
        return label;
    },
    notifyCatLabelChange: function (fieldName) {
        var mandatory = false;
        var nValue = this.getValue(fieldName);
        var realName = this.resolveNameMap(fieldName);
        var original = gel('sys_original.' + realName);
        var oValue = 'unknown';
        if (original)
            oValue = original.value;
        var newClass = 'changed';
        var oldClass = '';
        var sl = this.getCatLabel(fieldName);
        if (!sl) {
            var control = this.getControl(fieldName);
            if (!control)
                return;
            var container = control.getAttribute("gsftContainer");
            if (container)
                sl = $('status.' + container);
        }
        if (!sl)
            return;
        if (sl.className == 'mandatory' || sl.getAttribute('oclass') == 'mandatory')
            mandatory = true;
        oldClass = sl.className;
        if (mandatory && nValue.blank())
            newClass = 'mandatory';
        else {
            if (oValue == nValue)
                newClass = sl.getAttribute("oclass");
        }
        sl.className = newClass;
        if (oldClass != newClass)
            sl.setAttribute("oclass", oldClass);
    },
    onSubmit: function () {
        var action = this.getActionName();
        if (action == 'sysverb_back' || action == 'sysverb_cancel' || action == 'sysverb_delete')
            return true;
        var rc = this.mandatoryCheck();
        rc = rc && this.validate();
        return rc;
    },
    mandatoryCheck : function() {
        if (!this.checkMandatory)
            return true;
        var fa = this.elements;
        var rc = true;
        var invalidFields = new Array();
        var labels = new Array();
        for (var x =0; x< fa.length; x++) {
            var ed = fa[x];
            if (!ed.mandatory)
                continue;
            var widget = this.getControl(ed.fieldName);
            if (widget) {
                var widgetValue = this.getValue(ed.fieldName);
                if (widgetValue == null || widgetValue.blank()) {
                    var rowWidget = gel('sys_row');
                    var row = 0;
                    if (rowWidget)
                        row = parseInt(rowWidget.value);
                    if (row != -1) {
                        if (this.mandatory == false) {
                            widgetName = "sys_original." + this.tableName + '.' + ed.fieldName;
                            widget = gel(widgetName);
                            if (widget) {
                                widgetValue = widget.value;
                                if (widgetValue == null || widgetValue.blank())
                                    continue;
                            }
                        }
                    }
                    rc = false;
                    var tryLabel = false;
                    try {
                        widget.focus();
                    } catch (e) {
                        tryLabel = true;
                    }
                    if (tryLabel) {
                        var displayWidget = this.getDisplayBox(ed.fieldName);
                        if (displayWidget) {
                            try {
                                displayWidget.focus();
                            } catch (exception) {
                            }
                        }
                    }
                    var realName = this.resolveNameMap(ed.fieldName);
                    var widgetLabel = this.getLabelOf(ed.fieldName);
                    var shortLabel = trim(widgetLabel + '');
                    invalidFields.push(shortLabel);
                    labels.push('label_' + realName);
                }
            }
        }
        if (!rc) {
            var theText = invalidFields.join(', ');
            theText = new GwtMessage().getMessage('The following mandatory fields are not filled in') + ': ' + theText;
            try {
                alert(theText);
            } catch (e) {
            }
        }
        for (var x =0; x< labels.length; x++) {
            this.flash(labels[x], "#FFFACD", 0);
        }
        return rc;
    },
    getControl : function(fieldName) {
        var widgetName = this.resolveNameMap(fieldName);
        var possibles = document.getElementsByName(widgetName);
        if (possibles.length == 1)
            return possibles[0];
        else {
            var widget;
            for (var x=0; x< possibles.length; x++) {
                if (possibles[x].checked) {
                    widget = possibles[x];
                    break;
                }
            }
            if (!widget)
                widget = gel('sys_original.' + widgetName);
        }
        return widget;
    },
    getLabelOf : function(fieldName) {
        var fieldid = this.tableName + '.' + fieldName;
        fieldid = this.resolveNameMap(fieldName);
        var label = gel('label_' + fieldid);
        if (label) {
            var text = label.firstChild.innerText;
            if (!text) // IE uses innerText. The fox uses textContent
                text = label.firstChild.textContent;
            return text;
        }
        return null;
    },
    validate : function() {
        var fa = this.elements;
        var rc = true;
        var invalid = new Array();
        var labels = new Array();
        for (var x =0; x< fa.length; x++) {
            var ed = fa[x];
            var widgetName = this.tableName + '.' + ed.fieldName;
            var widget = this.getControl(ed.fieldName);
            if (widget) {
                var widgetValue = widget.value;
                var validator = this.validators[ed.type];
                if (validator) {
                    var isValid = validator.call(this, widgetValue);
                    if (!isValid) {
                        var widgetLabel = this.getLabelOf(ed.fieldName);
                        invalid.push(widgetLabel);
                        labels.push(widgetName);
                        rc = false;
                    }
                }
            }
        }
        if (!rc)
            alert('The following fields contain invalid text : ' + invalid.join(','));
        for (var x =0; x< labels.length; x++) {
            this.flash(labels[x], "#FFFACD", 0);
        }
        return rc;
    },
    setValue : function(fieldName, value, displayValue) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        this.secretSetValue(fieldName, value, displayValue);
        if  (control != null) {
            triggerEvent(control, 'change');
            if (control.getAttribute("type") == "radio") // "multiple choice" variables react to onclick due to IE bugs
                if (control.onclick)
                    control.onclick.call();
        }
    },
    getNiBox : function(fieldName) {
        var niName = 'ni.' + this.tableName + '.' + fieldName;
        var id = this.resolveNameMap(fieldName);
        if (id)
            niName = 'ni.' + id;
        return gel(niName);
    },
    getDisplayBox : function(fieldName) {
        var dName = 'sys_display.' + this.tableName + '.' + fieldName;
        var id = this.resolveNameMap(fieldName);
        if (id)
            dName = 'sys_display.' + id;
        var field = gel(dName);
        if (field)
            return field;
        dName = 'sys_display.' + fieldName;
        return gel(dName);
    },
    secretSetValue : function(fieldName, value, displayValue) {
        if (this.catalogSetValue(fieldName, value, displayValue))
            return;
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        var readOnlyField = gel('sys_readonly.' + control.id);
        if (readOnlyField) {
            readOnlyField.innerHTML = displayValue;
        } else {
            readOnlyField = gel(control.id + "_label");
            if (readOnlyField) {
                readOnlyField.value = displayValue;
            }
        }
        if (control.options) {
            var options = control.options;
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.value == value) {
                    control.selectedIndex = i;
                    break;
                }
            }
        } else if (control.type == 'hidden') {
            var nibox = this.getNiBox(fieldName);
            if (nibox && nibox.type == 'checkbox') {
                control.value = value;
                if (value == 'true')
                    nibox.checked = 'true';
                else
                    nibox.checked = null;
                return;
            }
            var displaybox = this.getDisplayBox(fieldName);
            if (displaybox) {
                if (typeof(displayValue) != 'undefined') {
                    if (displayValue != '')
                        control.value = value;
                    displaybox.value = displayValue;
                    refFlipImage(displaybox, control.id);
                    updateRelatedGivenNameAndValue(this.tableName + '.' + fieldName, value);
                    return;
                }
                control.value = value;
                if (value == null || value == '') {
                    displaybox.value = '';
                    refFlipImage(displaybox, control.id);
                    return;
                }
                var ed = this.getGlideUIElement(fieldName);
                if (!ed)
                    return;
                if (ed.type != 'reference')
                    return;
                var refTable = ed.reference;
                if (!refTable)
                    return;
                var ga = new GlideAjax('AjaxClientHelper');
                ga.addParam('sysparm_name','getDisplay');
                ga.addParam('sysparm_table',refTable);
                ga.addParam('sysparm_value',value);
                ga.getXMLWait();
                var displayValue=ga.getAnswer();
                displaybox.value = displayValue;
                refFlipImage(displaybox, control.id);
                updateRelatedGivenNameAndValue(this.tableName + '.' + fieldName, value);
            }
        } else {
            control.value = value;
        }
    },
    catalogSetValue : function (fieldName, value, displayValue) {
        var widgetName = this.resolveNameMap(fieldName);
        var possibles = document.getElementsByName(widgetName);
        if (possibles.length == 1)
            return false;
        for (var x=0; x< possibles.length; x++) {
            if (possibles[x].value == value) {
                possibles[x].checked = true;
            } else
                possibles[x].checked = false;
        }
        return true;
    },
    getGlideUIElement: function (fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        fieldName = this.resolveNameMap(fieldName);
        for (var x = 0; x < this.elements.length; x++) {
            var thisElement = this.elements[x];
            if (thisElement.fieldName == fieldName)
                return thisElement;
        }
    },
    getReference: function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        fieldName = this.resolveNameMap(fieldName);
        var ed = this.getGlideUIElement(fieldName);
        if (!ed)
            return;
        if (ed.type != 'reference')
            return;
        var value = this.getValue(fieldName);
        if (!value)
            return;
        var gr = new GlideRecord(ed.reference);
        gr.addQuery('sys_id', value);
        gr.query();
        gr.next();
        return gr;
    },
    hasPricingImplications : function(fieldName) {
        var realName = this.resolveNameMap(fieldName);
        var ed = this.getGlideUIElement(realName);
        if (ed && ed.attributes == 'priceCheck') {
            return true;
        }
        return false;
    },
    submit : function() {
        alert('The g_form.submit function has no meaning on a catlog item. Perhaps you mean g_form.addToCart() or g_form.orderNow() instead');
        return;
    },
    flash : function (widgetName, color, count) {
        var row = null;
        var labels = new Array();
        var widget = gel(widgetName);
        widget = widget.firstChild;
        labels.push(widget);
        count = count +1;
        for (var x =0; x< labels.length; x++) {
            var widget = labels[x];
            if (widget) {
                var originalColor = widget.style.backgroundColor;
                widget.style.backgroundColor = color;
            }
        }
        if (count < 4)
            setTimeout('g_form.flash("' + widgetName + '", "' + originalColor + '", ' + count + ')', 500);
    },
    serialize: function (filterFunc) {
        if (typeof(g_cart) == 'undefined')
            g_cart = new SCCart();
        var cart = g_cart;
        var item = gel('sysparm_id');
        if (!item)
            item = gel('current_item');
        if (item)
            item = item.value;
        else
            item = 'none';
        var url = cart.generatePostString() + "&sysparm_id=" + encodeURIComponent(item);
        return url;
    },
    serializeChanged: function() {
        return this.serialize();
    },
    addToCart : function() {
        if (typeof(addToCart) == 'function')
            addToCart();
        else
            alert('The add to cart function is usable only on catalog item forms');
    },
    orderNow : function() {
        if (typeof(orderNow) == 'function')
            orderNow();
        else
            alert('The order now function is usable only on catalog item forms');
    },
    addCatalogSubmit : function(handler) {
        this.onCatalogSubmit.push(handler);
    },
    callCatalogSubmitHandlers : function() {
        for (var x=0; x< this.onCatalogSubmit.length; x++) {
            var handler = this.onCatalogSubmit[x];
            var rc = handler.call(this);
            if (rc == false)
                return false;
        }
        return true;
    },
    catalogOnSubmit: function() {
        var rc = this.mandatoryCheck();
        rc = rc && this.callCatalogSubmitHandlers();
        return rc;
    },
    getValue: function(fieldName) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control)
            return '';
        return GlideForm.prototype._getValueFromControl.call(this, control);
    },
    _setReadonly: function(fieldName, disabled, isMandatory, fieldValue) {
        fieldName = this.removeCurrentPrefix(fieldName);
        var control = this.getControl(fieldName);
        if (!control)
            return;
        var s = this.tableName + '.' + fieldName;
        var ge = this.getGlideUIElement(fieldName);
        if (typeof ge == "undefined" && g_form != null && g_sc_form != null && g_form != g_sc_form) {
            var mapName = this.resolveNameMap(fieldName);
            for (var x=0; x< g_form.elements.length; x++) {
                var thisElement = g_form.elements[x];
                var thisField = thisElement.fieldName;
                if (thisField == mapName) {
                    ge = thisElement;
                    s = mapName;
                }
            }
        }
        var lookup = gel('lookup.' + control.id);
        if (lookup)
            s = control.id;
        GlideForm.prototype._setReadonly0.call(this, ge, control, s, fieldName, disabled, isMandatory, fieldValue);
    }
});