//defer classes/ajax/AJAXOtherCompleter.js
class AJAXOtherCompleter extends AJAXCompleter {
    constructor(element, reference) {
		super();
		AJAXCompleter.prototype.initialize.call(this, 'AC.' + reference, reference);
        this.className = "AJAXReferenceCompleter";
        this.dirty = false;
        this.matched = false;
        this.fieldChanged = false;
        this.ignoreAJAX = false;
        this.type = null;
        this.refField = null;
        this.textValue = "";
        this.invisibleTextValue = "";
        this.savedTextValue = "";
        this.savedInvisibleTextValue = "";
        this.previousTextValue = "";
        this.resultsStorage = new Object();
        this.emptyResults = new Object();
        this.oldFunctionJunk();
    },
    setInvisibleField: function(f) {
        this.iField = f;
        this._setAC(f);
    },
    setField: function(f) {
        this.field = f;
        this.field.autocomplete = "off";
        this._setAC(f);
    },
    setUpdateField: function(f) {
        this.updateField = f;
        this._setAC(f);
    },
    _setAC: function(field) {
        if (field)
            field.ac = this;
    },
    setType: function(type) {
        this.type = type;
    },
    setSavedText: function(textArray) {
        if (textArray[0] != null)
            this.savedInvisibleTextValue = textArray[0];
        this.savedTextValue = textArray[1];
    },
    getMenu: function() {
        return this.getDropDown();
    },
    getUpdateField: function() {
        return this.updateField;
    },
    oldFunctionJunk: function() {
        this.isOTM = function() {
            return this.type == ONE_TO_MANY;
        };
        this.getInvisibleField = function() {
            return this.iField;
        };
    }
});