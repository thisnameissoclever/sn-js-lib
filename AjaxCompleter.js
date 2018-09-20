//defer classes/ajax/AJAXCompleter.js
var AJAXCompleter = Class.create({
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    initialize: function(name, elementName) {
        this.className = "AJAXCompleter";
        this.name = name;
        this.elementName = elementName;
        this.field = null;
        this.menuBorderSize = 1;
        this.resetSelected();
        this.initDropDown();
        this.initIFrame();
    },
    initDropDown: function() {
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
    },
    initIFrame: function() {
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
    },
    _setCommonStyles: function(style) {
        style.padding = 0;
        style.visibility = "hidden";
        style.display = "none";
        style.position = "absolute";
    },
    setWidth: function(w) {
        this.log("setting width to: " + w);
        this.dropDown.style.width = w + "px";
        this.iFrame.style.width = w + "px";
    },
    setHeight: function(height) {
        this.dropDown.height = height;
        if (g_isInternetExplorer)
            height += 4;        // border adjustment
        this.iFrame.style.height = height;
    },
    resetSelected: function() {
        this.selectedItemObj = null;
        this.selectedItemNum = -1;
    },
    clearDropDown: function() {
        this.log("clearDropDown()");
        this.hideDropDown();
        var dropDown = this.dropDown;
        while(dropDown.childNodes.length > 0)
            dropDown.removeChild(dropDown.childNodes[0]);
        this.currentMenuItems = new Array();
        this.currentMenuCount = this.currentMenuItems.length;
        this._setInactive();
    },
    _setActive: function() {
        g_active_ac = this;
    },
    _setInactive: function() {
        g_active_ac = null;
    },
    hideDropDown: function() {
        if (this.dropDown.style.visibility == "hidden")
            return;
        this._showHide("hidden", "none");
        this.resetSelected();
    },
    onDisplayDropDown: function() {
    },
    showDropDown: function() {
        if (this.dropDown.style.visibility == "visible")
            return;
        this._showHide("visible", "inline");
        this.onDisplayDropDown();
    },
    _showHide: function(type, display) {
        this.dropDown.style.visibility = type;
        this.iFrame.style.visibility = type;
        this.dropDown.style.display = display;
        this.iFrame.style.display = display;
    },
    isVisible: function() {
        return this.dropDown.style.visibility == "visible";
    },
    appendElement: function(element) {
        this.getDropDown().appendChild(element);
    },
    appendItem: function(item) {
        this.appendElement(item);
        if (this.currentMenuItems == null)
            this.currentMenuItems = new Array();
        item.acItemNumber = this.currentMenuItems.length;
        this.currentMenuItems.push(item);
        this.currentMenuCount = this.currentMenuItems.length;
        this.log("appendItem, currentMenuCount = " + this.getMenuCount());
    },
    selectNext: function() {
        var itemNumber = this.selectedItemNum;
        if (this.selectedItemNum < this.getMenuCount() - 1)
            itemNumber++;
        this.setSelection(itemNumber);
    },
    selectPrevious: function() {
        var itemNumber = this.selectedItemNum;
        if (this.selectedItemNum <= 0)
            return false;
        itemNumber--;
        this.setSelection(itemNumber);
        return true;
    },
    unsetSelection: function()  {
        if (this.selectedItemNum == -1)
            return;
        this.setNonSelectedStyle(this.selectedItemObj);
        this.resetSelected()
    },
    setSelection: function(itemNumber) {
        this.unsetSelection();
        this.selectItem(itemNumber);
        this.setSelectedStyle(this.selectedItemObj);
    },
    selectItem: function(itemNumber) {
        this.selectedItemNum = itemNumber;
        this.selectedItemObj = this.currentMenuItems[itemNumber];
    },
    getMenuItems: function() {
        return this.currentMenuItems;
    },
    getObject: function(itemNumber) {
        return this.currentMenuItems[itemNumber];
    },
    getSelectedObject: function() {
        return this.getObject(this.selectedItemNum);
    },
    setSelectedStyle: function(element) {
        var style = element.style;
        style.backgroundColor = "#000070";
        style.color = "white";
        if (typeof element.displaySpan != "undefined") {
            alert("element.displaySpan.style.color");
            element.displaySpan.style.color = "white"
        }
    },
    setNonSelectedStyle: function(element) {
        var style = element.style;
        style.backgroundColor = "white";
        style.color="black";
        if (element.displaySpan)
            element.displaySpan.style.color = "green";
    },
    setTargetTable: function(targetTable) {
        this.targetTable = targetTable;
    },
    getTargetTable: function() {
        return this.targetTable;
    },
    isPopulated: function() {
        return this.getMenuCount() > 0;
    },
    log: function(msg) {
        jslog(this.className + ": " + msg);
    },
    getIFrame: function() {
        return this.iFrame;
    },
    getField: function() {
        return this.field;
    },
    getDropDown: function() {
        return this.dropDown;
    },
    getMenuCount: function() {
        return this.currentMenuCount;
    }
});