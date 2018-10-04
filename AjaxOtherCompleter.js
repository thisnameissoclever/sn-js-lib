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
	}
	
	setInvisibleField(f) {
		this.iField = f;
		this._setAC(f);
	}
	
	setField(f) {
		this.field = f;
		this.field.autocomplete = "off";
		this._setAC(f);
	}
	
	setUpdateField(f) {
		this.updateField = f;
		this._setAC(f);
	}
	
	_setAC(field) {
		if (field) {
			field.ac = this;
		}
	}
	
	setType(type) {
		this.type = type;
	}
	
	setSavedText(textArray) {
		if (textArray[0] != null) {
			this.savedInvisibleTextValue = textArray[0];
		}
		this.savedTextValue = textArray[1];
	}
	
	getMenu() {
		return this.getDropDown();
	}
	
	getUpdateField() {
		return this.updateField;
	}
	
	oldFunctionJunk() {
		this.isOTM = function() {
			return this.type == ONE_TO_MANY;
		};
		this.getInvisibleField = function() {
			return this.iField;
		};
	}
}