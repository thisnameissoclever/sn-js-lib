//defer classes/ajax/AJAXCompleter.js
class AJAXCompleter {
	
	constructor(name, elementName) {
		this.className = "AJAXCompleter";
		this.name = name;
		this.elementName = elementName;
		this.field = null;
		this.menuBorderSize = 1;
		this.resetSelected();
		this.initDropDown();
		this.initIFrame();
		this.KEY_BACKSPACE = 8;
		this.KEY_TAB = 9;
		this.KEY_RETURN = 13;
		this.KEY_ESC = 27;
		this.KEY_LEFT = 37;
		this.KEY_UP = 38;
		this.KEY_RIGHT = 39;
		this.KEY_DOWN = 40;
		this.KEY_DELETE = 46;
		this.KEY_HOME = 36;
		this.KEY_END = 35;
		this.KEY_PAGEUP = 33;
		this.KEY_PAGEDOWN = 34;
	}
	
	initDropDown() {
		this.log(" initDropDown()");
		var dd = gel(this.name);
		if (!dd) {
			dd = cel("div");
			dd.id = this.name;
			var style = dd.style;
			style.border = "black " + this.menuBorderSize + "px solid";
			this._setCommonStyles(style);
			style.backgroundColor = "white";
			style.zIndex = 20000;
		}
		this.dropDown = dd;
		addChild(dd);
		this.clearDropDown();
		this.currentMenuItems = new Array();
		this.currentMenuCount = this.currentMenuItems.length;
	}
	
	initIFrame() {
		var iFrame = gel(this.name + "_shim");
		if (!iFrame) {
			iFrame = cel("iframe");
			iFrame.name = this.name + "_shim";
			iFrame.scrolling = "no";
			iFrame.frameborder = "no";
			iFrame.src = "javascript:false;";
			iFrame.id = this.name + "_shim";
			var style = iFrame.style;
			style.height = 0;
			this._setCommonStyles(style);
			style.zIndex = this.dropDown.style.zIndex - 1;
			addChild(iFrame);
		}
		this.iFrame = iFrame;
	}
	
	_setCommonStyles(style) {
		style.padding = 0;
		style.visibility = "hidden";
		style.display = "none";
		style.position = "absolute";
	}
	
	setWidth(w) {
		this.log("setting width to: " + w);
		this.dropDown.style.width = w + "px";
		this.iFrame.style.width = w + "px";
	}
	
	setHeight(height) {
		this.dropDown.height = height;
		if (g_isInternetExplorer) {
			height += 4;
		}        // border adjustment
		this.iFrame.style.height = height;
	}
	
	resetSelected() {
		this.selectedItemObj = null;
		this.selectedItemNum = -1;
	}
	
	clearDropDown() {
		this.log("clearDropDown()");
		this.hideDropDown();
		var dropDown = this.dropDown;
		while (dropDown.childNodes.length > 0) {
			dropDown.removeChild(dropDown.childNodes[0]);
		}
		this.currentMenuItems = new Array();
		this.currentMenuCount = this.currentMenuItems.length;
		this._setInactive();
	}
	
	_setActive() {
		g_active_ac = this;
	}
	
	_setInactive() {
		g_active_ac = null;
	}
	
	hideDropDown() {
		if (this.dropDown.style.visibility == "hidden") {
			return;
		}
		this._showHide("hidden", "none");
		this.resetSelected();
	}
	
	onDisplayDropDown() {
	}
	
	showDropDown() {
		if (this.dropDown.style.visibility == "visible") {
			return;
		}
		this._showHide("visible", "inline");
		this.onDisplayDropDown();
	}
	
	_showHide(type, display) {
		this.dropDown.style.visibility = type;
		this.iFrame.style.visibility = type;
		this.dropDown.style.display = display;
		this.iFrame.style.display = display;
	}
	
	isVisible() {
		return this.dropDown.style.visibility == "visible";
	}
	
	appendElement(element) {
		this.getDropDown().appendChild(element);
	}
	
	appendItem(item) {
		this.appendElement(item);
		if (this.currentMenuItems == null) {
			this.currentMenuItems = new Array();
		}
		item.acItemNumber = this.currentMenuItems.length;
		this.currentMenuItems.push(item);
		this.currentMenuCount = this.currentMenuItems.length;
		this.log("appendItem, currentMenuCount = " + this.getMenuCount());
	}
	
	selectNext() {
		var itemNumber = this.selectedItemNum;
		if (this.selectedItemNum < this.getMenuCount() - 1) {
			itemNumber++;
		}
		this.setSelection(itemNumber);
	}
	
	selectPrevious() {
		var itemNumber = this.selectedItemNum;
		if (this.selectedItemNum <= 0) {
			return false;
		}
		itemNumber--;
		this.setSelection(itemNumber);
		return true;
	}
	
	unsetSelection() {
		if (this.selectedItemNum == -1) {
			return;
		}
		this.setNonSelectedStyle(this.selectedItemObj);
		this.resetSelected()
	}
	
	setSelection(itemNumber) {
		this.unsetSelection();
		this.selectItem(itemNumber);
		this.setSelectedStyle(this.selectedItemObj);
	}
	
	selectItem(itemNumber) {
		this.selectedItemNum = itemNumber;
		this.selectedItemObj = this.currentMenuItems[itemNumber];
	}
	
	getMenuItems() {
		return this.currentMenuItems;
	}
	
	getObject(itemNumber) {
		return this.currentMenuItems[itemNumber];
	}
	
	getSelectedObject() {
		return this.getObject(this.selectedItemNum);
	}
	
	setSelectedStyle(element) {
		var style = element.style;
		style.backgroundColor = "#000070";
		style.color = "white";
		if (typeof element.displaySpan != "undefined") {
			alert("element.displaySpan.style.color");
			element.displaySpan.style.color = "white"
		}
	}
	
	setNonSelectedStyle(element) {
		var style = element.style;
		style.backgroundColor = "white";
		style.color = "black";
		if (element.displaySpan) {
			element.displaySpan.style.color = "green";
		}
	}
	
	setTargetTable(targetTable) {
		this.targetTable = targetTable;
	}
	
	getTargetTable() {
		return this.targetTable;
	}
	
	isPopulated() {
		return this.getMenuCount() > 0;
	}
	
	log(msg) {
		jslog(this.className + ": " + msg);
	}
	
	getIFrame() {
		return this.iFrame;
	}
	
	getField() {
		return this.field;
	}
	
	getDropDown() {
		return this.dropDown;
	}
	
	getMenuCount() {
		return this.currentMenuCount;
	}
}