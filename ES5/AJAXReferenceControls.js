//defer classes/ajax/AJAXReferenceControls.js
var AJAXReferenceControls = Class.create({
    initialize: function(tableElement, id, parentElement, refSysId, rowSysId, refQualTag) {
        this.refName = id;
        this.id = "LIST_EDIT_" + id;
        this.tableElement = tableElement;
        this.dependent = null;
        this.refImageFocused = false;
        this.refSysId = refSysId;
        this.rowSysId = rowSysId;
        this.createAdditionalValues(refQualTag);
        this.createInput(parentElement);
        this.createLookup(parentElement);
        this.createDependent(parentElement);
    },
    clearDropDown: function() {
        if (this.ac)
            this.ac.clearDropDown();
    },
    createAdditionalValues: function(refQualTag) {
        this.additionalValues = {};
        this.additionalValues.sys_uniqueValue = this.rowSysId;
        this.additionalValues.sys_target = this.tableElement.getTable().getName();
        this.additionalValues.sysparm_list_edit_ref_qual_tag = refQualTag;
    },
    createInput: function(parentElement) {
        this._createHidden(parentElement, this.id, '');
        this.input = cel("input", parentElement);
        input = this.input;
        input.id = "sys_display." + this.id;
        input.onfocus = this._onFocus.bind(this);
        input.onkeydown = this._onKeyDown.bindAsEventListener(this);
        input.onkeypress = this._onKeyPress.bindAsEventListener(this);
        input.onkeyup = this._onKeyUp.bindAsEventListener(this);
        input.autocomplete = "off";
        input.ac_columns = "";
        input.ac_order_by = "";
    },
    resolveReference: function() {
        if (this.ac)
            this.ac.onBlur();
    },
    setDisplayValue: function(value) {
        this.input.value = value;
    },
    getInput: function() {
        return this.input;
    },
    getValue: function() {
        return gel(this.id).value;
    },
    getDisplayValue: function() {
        return this.input.value;
    },
    isResolving: function() {
        return (this.ac && this.ac.isResolving());
    },
    setResolveCallback: function(f) {
        if (!this.ac)
            return;
        this.ac.setResolveCallback(f);
    },
    createLookup: function(parent) {
        var image = createImage("images/reference_list.gifx", "Lookup using list");
        image.id = "ref_list." + this.id;
        image.onclick = this._refListOpen.bindAsEventListener(this);
        image.onfocus = this._onRefImageFocus.bindAsEventListener(this);
        image.onblur = this._onRefImageBlur.bindAsEventListener(this);
        image.style.marginLeft = "5px";
        parent.appendChild(image);
    },
    createDependent: function(parent) {
        if (!this.tableElement.isDependent())
            return;
        var input = cel("input");
        input.type = "hidden";
        this.dependent = "sys_dependent";
        input.id = this.tableElement.getTable().getName() + "." + this.dependent;
        input.name = input.id;
        parent.appendChild(input);
        this.dependentInput = input;
    },
    setRecord: function(record) {
        this.record = record;
    },
    _createHidden: function(parent, id, value) {
        var input = cel("input");
        input.type = "hidden";
        input.id = id;
        input.value = value;
        parent.appendChild(input);
        return input;
    },
    _setDependent: function() {
        if (this.dependent == null)
            return;
        this.dependentInput.value = this.record.getValue(this.tableElement.getDependent());
    },
    _onFocus: function(evt) {
        if (this.ac)
            return;
        this._setDependent();
        var dep = '';
        if (this.dependentInput)
            dep = "sys_dependent";
        this.ac = new AJAXReferenceCompleter(this.input, this.id, dep);
        this.ac.elementName = this.refName;
        this.ac.referenceSelect(this.refSysId, this.input.value);
        this.ac.clearDerivedFields = false;
        for (var n in this.additionalValues)
            this.ac.setAdditionalValue(n, this.additionalValues[n]);
    },
    _onKeyDown: function(evt) {
        acReferenceKeyDown(this.input, evt);
    },
    _onKeyPress: function(evt) {
        acReferenceKeyPress(this.input, evt);
    },
    _onKeyUp: function(evt) {
        acReferenceKeyUp(this.input, evt);
    },
    _refListOpen: function(evt) {
        if (!this.refImageFocused)
            return false;
        var te = this.tableElement;
        this._setDependent();
        var url = reflistOpenUrl(this.refName, this.id, te.getName(), te.getReference());
        for (var n in this.additionalValues)
            url += "&" + n + "=" + encodeText(this.additionalValues[n]);
        if (this.dependentInput)
            url += "&sysparm_dependent=" + escape(this.dependentInput.value);
        popupOpenStandard(url, "lookup");
        return false;
    },
    _onRefImageFocus: function(e) {
        this.refImageFocused = true;
    },
    _onRefImageBlur: function(e) {
        this.refImageFocused = false;
    },
    type: function() {
        return "AJAXReferenceControls";
    }
});