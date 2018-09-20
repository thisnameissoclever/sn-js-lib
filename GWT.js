//defer classes/GwtScrollbarSynchronizer.js
/*
* wrap two elements from different parts
* of a page within a single div to allow the elements to be scrolled
* together and provide the illusion of being a single element
*
* Use:
*
*       var scrollbarSynchronizer = new GwtScrollbarSynchronizer("leftTargetId", "rightTargetId");
*
* Options:
*
*       scrollbarSynchronizer.setBorder("4px solid black");
*       scrollbarSynchronizer.setPosition("relative");
*       scrollbarSynchronizer.setTop("100px");
*       scrollbarSynchronizer.setLeft("100px");
*       scrollbarSynchronizer.setHieght("100px");
*       scrollbarSynchronizer.setWidth("100px");
*       scrollbarSynchronizer.setClassname("mySplicerClass");
*
*/
var GwtScrollbarSynchronizer = Class.create({
    initialize: function(targetLeftId, targetRightId) {
        this.setTargetLeft($(targetLeftId));
        this.setTargetRight($(targetRightId));
        this.scrollBarWidth = 20;
        this.padding = 0;
        this.margin = 0;
        this.targetSpacer = 12;
        this.border = "0px";
        this.backgroundColor = "#fff";
        this.position = "absolute";
        this.top = grabOffsetTop(this.targetLeft);
        this.left = grabOffsetLeft(this.targetLeft);
        this.height = this.targetLeft.offsetHeight;
        this.width = this.targetLeft.offsetWidth + this.targetRight.offsetWidth + this.padding;
    },
    setTargetLeft: function(target) {
        this.targetLeft = target;
    },
    setTargetRight: function(target) {
        this.targetRight = target;
    },
    setBorder: function(border) {
        this.border = border;
    },
    setPosition: function(position) {
        this.position = position;
    },
    setTop: function(top) {
        this.top = top;
    },
    setLeft: function(left) {
        this.left = left;
    },
    setHeight: function(height) {
        this.height = height;
    },
    setWidth: function(width) {
        this.width = width;
    },
    setClassname: function(classname) {
        this.classname = classname;
    },
    render: function() {
        this.targetRight.style.overflow = "visible";
        this.targetLeft.style.overflow = "visible";
        var div = cel("div");
        div.id = "scrollbarSynchronizer";
        div.style.zIndex = "999";
        div.style.overflow = "auto";
        if (this.classname && this.classname != null) {
            div.classname = this.classname;
        } else {
            div.style.border = this.border;
            div.style.height = this.height;
            div.style.width = "100%";
            div.style.position = this.position;
            div.style.top = this.top;
            div.style.left = this.left;
            div.style.backgroundColor = this.backgroundColor;
            div.style.margin = this.margin;
        }
        this.cellWidth = parseInt((this.width/2) - this.scrollBarWidth);
        var leftDiv = cel("div");
        leftDiv.id = "leftTargetDiv";
        leftDiv.style.position = "absolute";
        leftDiv.style.top = "0px";
        leftDiv.style.left = "0px";
        leftDiv.style.border = "1px solid #999";
        leftDiv.style.height = "98%";
        leftDiv.style.margin = "0px";
        leftDiv.appendChild(this.targetLeft);
        div.appendChild(leftDiv);
        var rightDiv = cel("div");
        rightDiv.id = "rightTargetDiv";
        rightDiv.style.position = "absolute";
        rightDiv.style.top = "0px";
        rightDiv.style.left = this.cellWidth + this.targetSpacer;
        rightDiv.style.border = "1px solid #999";
        rightDiv.style.height = "98%";
        rightDiv.style.margin = "0px";
        rightDiv.appendChild(this.targetRight);
        div.appendChild(rightDiv);
        document.body.appendChild(div);
    },
    z:null
});
//defer classes/GwtCellSelector.js
var GwtCellSelector = Class.create({
    initialize: function(tableElement) {
        this.tableElement = tableElement;
        this.setDisable(false);
        this.setSelectColumnOnly(false);
        this.setSelectNonContiguous(false);
        this.setSelectColor("#DFDFDF");
        this.browserColor = null;
        this.setUnselectColor("#FAFAFA");
        this.setCursor("crosshair");
        this.setBorderSize("2px solid black");
        this.preSelectionColors = new Object();
        this.onSelect = null;
        this.beforeSelect = null;
        this.selectMultipleColumns = false;
        this.selectMiscCells = false;
        this.isMouseDown = false;
        this.centerCellColVal = 0;
        this.centerCellRowVal = 0;
        this.atCol = 0;
        this.atRow = 0;
        this.colFrom = 0;
        this.colTo = 0;
        this.rowFrom = 0;
        this.rowTo = 0;
        this.maxCol = 0;
        this.maxRow = 0;
        this.returnObjects = new Object();
        this.cellBackgroundXref = new Object();
        this.ignoreColumns = new Object();
        this.ignoreRows = new Object();
        Event.observe(this.tableElement, "mousedown", this._dragStart.bind(this));
        this.mouseUpTableListener = this._dragEnd.bindAsEventListener(this);
        this.mouseOverTableListener = this._dragOver.bindAsEventListener(this);
        this.mouseUpDocListener = this._dragCheck.bindAsEventListener(this);
    },
    _dragStart: function(e) {
        if (!isLeftClick(e))
            return;
        if  (!this.disableGrid) {
            this._getGridInfo();
            if (this.selectNonContiguous)
                this._contiguousCheck(e);
            if (this.ignoreColumns[Event.element(e).cellIndex] ||
                this.ignoreRows[Event.element(e).parentNode.rowIndex]) {
                return;
            }
            if (this.beforeSelect) {
                if (!this.handleBeforeSelect(e))
                    return;
            }
            if (!this.isSelectColumnOnly)
                this.selectMultipleColumns = e.shiftKey;
            this.isMouseDown = true;
            document.body.style.cursor = this.cursor;
            stopSelection(document.body);
            this._setEpicenter(e);
            this._selectCells(e);
            Event.observe(this.tableElement, "mouseup", this.mouseUpTableListener);
            Event.observe(this.tableElement, "mouseover", this.mouseOverTableListener);
            Event.observe(document, "mouseup", this.mouseUpDocListener);
        }
    },
    _dragOver: function(e) {
        if  (this.isMouseDown) {
            this._selectCells(e);
        }
    },
    _dragEnd: function(e) {
        this.returnObjects = new Object();
        this.isMouseDown = false;
        document.body.style.cursor = "default";
        this._selectCells(e);
        if  (this.onSelect) {
            this.handleOnSelect(this.returnObjects);
        }
        restoreSelection(document.body);
        Event.stopObserving(this.tableElement, "mouseup", this.mouseUpTableListener);
        Event.stopObserving(this.tableElement, "mouseover", this.mouseOverTableListener);
        Event.stopObserving(document, "mouseup", this.mouseUpDocListener);
    },
    _dragCheck: function(e) {
        if  (this.isMouseDown) {
            try {
                this._dragEnd(e);
            }
            catch (err) {
            }
        }
    },
    _contiguousCheck: function(e) {
        if (e.ctrlKey)
            this.selectMiscCells = e.ctrlKey;
        else if (e.metaKey)
            this.selectMiscCells = e.metaKey;
        else
            this.selectMiscCells = false;
    },
    getSelectedObjects: function() {
        return this.returnObjects;
    },
    getColFrom: function() {
        return this.colFrom;
    },
    getColTo: function() {
        return this.colTo;
    },
    getRowFrom: function() {
        return this.rowFrom;
    },
    getRowTo: function() {
        return this.rowTo;
    },
    setIgnoreColumn: function(column) {
        this.ignoreColumns[column] = column;
    },
    setIgnoreRow: function(row) {
        this.ignoreRows[row] = row;
    },
    setSelectColor: function(selectColor) {
        this.selectColor = selectColor;
    },
    setUnselectColor: function(unselectColor) {
        this.unselectColor = unselectColor;
    },
    setCursor: function(cursor) {
        this.cursor = cursor;
    },
    setSelectColumnOnly: function(flag) {
        this.isSelectColumnOnly = flag;
    },
    setDisable: function(flag) {
        this.disableGrid = flag;
    },
    setSelectNonContiguous: function(flag) {
        this.selectNonContiguous = flag;
    },
    setBorderSize: function(size) {
        this.borderSize = size;
    },
    _setSelectedCells: function(colFrom, colTo, rowFrom, rowTo) {
        this.colFrom = colFrom;
        this.colTo = colTo;
        this.rowFrom = rowFrom;
        this.rowTo = rowTo;
    },
    _selectCells: function(e) {
        this.atColVal = Event.element(e).cellIndex;
        this.atRowVal = Event.element(e).parentNode.rowIndex;
        if  (this.atColVal <= 0) {
            return;
        }
        if  (this.atRowVal <= 0) {
            return;
        }
        if (this.selectMultipleColumns) {
            if  (this.atColVal < this.centerCellColVal) {
                this.colFrom = this.atColVal;
                this.colTo = this.centerCellColVal;
                this._getRowSelection();
            }
            if  (this.atColVal > this.centerCellColVal) {
                this.colFrom = this.centerCellColVal;
                this.colTo = this.atColVal;
                this._getRowSelection();
            }
        }
        if  (this.atColVal == this.centerCellColVal) {
            this.colFrom = this.centerCellColVal;
            this.colTo = this.centerCellColVal;
            this._getRowSelection();
        }
        if (this.atRowVal < this.centerCellRowVal) {
            this.rowFrom = this.atRowVal;
            this.rowTo = this.centerCellRowVal;
            this._getColSelection();
        }
        if (this.atRowVal > this.centerCellRowVal) {
            this.rowFrom = this.centerCellRowVal;
            this.rowTo = this.atRowVal;
            this._getColSelection();
        }
        if  (this.atRowVal == this.centerCellRowVal) {
            this.rowFrom = this.centerCellRowVal;
            this.rowTo = this.centerCellRowVal;
            this._getColSelection();
        }
        this._drawSelection(this.colFrom, this.colTo, this.rowFrom, this.rowTo);
    },
    _getRowSelection: function() {
        if (this.atRowVal < this.centerCellRowVal) {
            this.rowFrom = this.atRowVal;
            this.rowTo = this.centerCellRowVal;
        }
        if (this.atRowVal > this.centerCellRowVal) {
            this.rowFrom = this.centerCellRowVal;
            this.rowTo = this.atRowVal;
        }
        if  (this.atRowVal == this.centerCellRowVal) {
            this.rowFrom = this.centerCellRowVal;
            this.rowTo = this.centerCellRowVal;
        }
    },
    _getColSelection: function() {
        if (this.selectMultipleColumns) {
            if  (this.atColVal < this.centerCellColVal) {
                this.colFrom = this.atColVal;
                this.colTo = this.centerCellColVal;
            }
            if  (this.atColVal > this.centerCellColVal) {
                this.colFrom = this.centerCellColVal;
                this.colTo = this.atColVal;
            }
        }
        if  (this.atColVal == this.centerCellColVal) {
            this.colFrom = this.centerCellColVal;
            this.colTo = this.centerCellColVal;
        }
    },
    _drawSelection: function(colFrom, colTo, rowFrom, rowTo) {
        this._highlightCells(colFrom, colTo, rowFrom, rowTo);
    },
    _saveCellColor: function(col, row, color) {
        if (this.preSelectionColors[col + "," + row] != null)
            return;
        this.preSelectionColors[col + "," + row] = "";
        if (color != null && color.length > 0)
            this.preSelectionColors[col + "," + row] = color;
    },
    restoreCellColors: function() {
        for (var key in this.preSelectionColors) {
            var color = "";
            if (this.preSelectionColors[key] != null && this.preSelectionColors[key].length > 0)
                color = this.preSelectionColors[key];
            var cell = key.split(",");
            var e = this.tableElement.rows[cell[1]].cells[cell[0]];
            if (e.style.backgroundColor == this.browserColor)
                e.style.backgroundColor = color;
        }
        this.preSelectionColors = new Object();
    },
    _highlightCells: function(colFrom, colTo, rowFrom, rowTo) {
        if (!this.selectMiscCells)
            this.restoreCellColors();
        for (var x=colFrom; x<=colTo; x++) {
            for (var y=rowFrom; y<=rowTo; y++) {
                try {
                    var e = this.tableElement.rows[y].cells[x];
                    this._saveCellColor(x, y, e.style.backgroundColor);
                    e.style.backgroundColor = this.selectColor;
                    if (this.browserColor == null)
                        this.browserColor = e.style.backgroundColor;
                    this.returnObjects[x + "," + y] = this.tableElement.rows[y].cells[x].id;
                }
                catch (err) {
                }
            }
        }
    },
    _clearAllCells: function() {
        for (var x=1; x<=this.maxCol; x++) {
            for (var y=1; y<this.maxRow; y++) {
                try {
                    this.tableElement.rows[y].cells[x].style.backgroundColor = "";
                    this.tableElement.rows[y].cells[x].style.border = "0px";
                }
                catch (err) {
                }
            }
        }
    },
    _getGridInfo: function() {
        this.maxRow = this.tableElement.rows.length;
        this.maxCol = this.tableElement.rows[0].cells.length;
    },
    _setEpicenter: function(e) {
        this.centerCellColVal = Event.element(e).cellIndex;
        this.centerCellRowVal = Event.element(e).parentNode.rowIndex;
    },
    handleBeforeSelect: function(e) {
    },
    handleOnSelect: function(selectedCells) {
    },
    setBeforeSelect: function(flag) {
        this.beforeSelect = flag;
    },
    setOnSelect: function(flag) {
        this.onSelect = flag;
    },
    z: null
});
//defer classes/GwtDraggable.js
/**
* Glide Windowing Toolkit - Draggable stuff
* bjr
*
* -------------------------------------------------------------
*  Dragging is supported in the following ways:
*
*     Free dragging (default)
*       you can drag the element anywhere and it will be dragged along
*
*     Custom dragging
*       You may override the drag handling by providing your own start, dragging
*       and end methods.  Use the following methods to specify your own overrides:
*           - setStart
*           - setDrag
*           - setEnd
*
* -------------------------------------------------------------
*  In addition to controlling how the dragging is handled, you can register for
*  notification of the dragging operation without be responsible for handling the
*  dragging operations by using the following events (register with the 'on' method):
*
*       beforedrag
*           callback signature -> f(this, clientX, clientY, event)
*
*       dragging
*           callback signature -> f(this, dragElemPosX, dragElemPosY, event)
*
*       dragged
*           callback signature -> f(this, event)
*
* -------------------------------------------------------------
*  Providing your own custom drag element
*  --------------------------------------
*      By default, when you drag, the dragged element is the 'draggable' element
*       that is specified as 'itemDragged' in the ctor.  You can provide your own
*       draggable element (typically done at start drag time or at before drop time)
*       by calling setDraggable or saveAndSetDraggable.  The saveAndSetDraggable call
*       will keep track of the original draggable element associated with this drag
*       object so that it can be restred at end drag time.
*
*/
var GwtDraggable = Class.create(GwtObservable, {
    initialize : function(header, itemDragged) {
        this.header = $(header);
        if (!itemDragged)
            itemDragged = this.header;
        this.parentElement = getFormContentParent();
        this.setDraggable($(itemDragged));
        this.setCursor("move");
        this.setStart(this.genericStart.bind(this));
        this.setDrag(this.genericDrag.bind(this));
        this.setEnd(this.genericEnd.bind(this));
        this.scroll = false;
        this.differenceX = 0;
        this.differenceY = 0;
        this.shiftKey = false;
        this.fDrag = this.drag.bind(this);
        this.fEnd = this.end.bind(this);
        this.enable();
    },
    enable: function() {
        this.header.onmousedown = this.start.bind(this);
        this.header.ontouchstart = this.start.bind(this);
    },
    disable: function() {
        this.header.onmousedown = null;
        this.header.ontouchstart = null;
    },
    start: function(e) {
        e = getEvent(e);
        var ex = e.clientX;
        var ey = e.clientY;
        if (this.getScroll()) {
            ex += getScrollX();
            ey += getScrollY();
        }
        this.differenceX = ex - grabOffsetLeft(this.draggable) + grabScrollLeft(this.draggable);
        this.differenceY = ey - grabOffsetTop(this.draggable) + grabScrollTop(this.draggable);
        this.shiftKey = e.shiftKey;
        Event.observe(this.parentElement, "mousemove", this.fDrag);
        Event.observe(this.parentElement, "mouseup", this.fEnd);
        Event.observe(this.parentElement, "touchmove", this.fDrag);
        Event.observe(this.parentElement, "touchend", this.fEnd);
        this.active = false;
        this._stopSelection(e);
        this.draggable.dragging_active = true;
        var ret = this.onDragStart(this, ex, ey, e);
        this.fireEvent("beforedrag", this, ex, ey, e);
        return ret;
    },
    destroy: function() {
        if (this.header) {
            this.header.onmousedown = null;
            this.header.ontouchstart = null;
        }
        this.header = null;
        this.draggable = null;
        this.parentElement = null;
    },
    drag : function(e) {
        if (!this.active) {
            createPageShim(this.parentElement);
            this.active = true;
        }
        this._stopSelection(e);
        e = getEvent(e);
        var ex = e.clientX;
        var ey = e.clientY;
        if (this.getScroll()) {
            ex += getScrollX();
            ey += getScrollY();
        }
        var ret = this.onDrag(this, parseInt(ex - this.differenceX), parseInt(ey - this.differenceY), e);
        this.fireEvent("dragging", this, parseInt(ex - this.differenceX), parseInt(ey - this.differenceY), e);
        return ret;
    },
    end : function(e) {
        e = getEvent(e);
        Event.stopObserving(this.parentElement, "mousemove", this.fDrag);
        Event.stopObserving(this.parentElement, "mouseup", this.fEnd);
        Event.stopObserving(this.parentElement, "touchmove", this.fDrag);
        Event.stopObserving(this.parentElement, "touchend", this.fEnd);
        this.shiftKey = e.shiftKey;
        removePageShim(this.parentElement);
        this._restoreSelection();
        this.draggable.dragging_active = false;
        var ret = this.onDragEnd(this, e);
        if (!this.active)
            return;
        this.active = false;
        this.fireEvent("dragged", this, e);
        this.resetDraggable();
        return ret;
    },
    getDraggable: function() {
        return this.draggable;
    },
    getYDifference: function() {
        return this.differenceY;
    },
    getXDifference: function() {
        return this.differenceX;
    },
    getScroll: function() {
        return this.scroll;
    },
    setDraggable: function(e) {
        this.draggable = e;
    },
    setStart: function(f) {
        this.onDragStart = f;
    },
    setDrag: function(f) {
        this.onDrag = f;
    },
    setEnd: function(f) {
        this.onDragEnd = f;
    },
    setCursor: function(c) {
        if (this.header.style) {
            this.header.style.cursor = c;
        }
    },
    setScroll: function(s) {
        this.scroll = s;
    },
    saveAndSetDraggable: function(e) {
        this.origDraggable = this.draggable;
        this.setDraggable(e);
    },
    resetDraggable: function() {
        if (this.origDraggable) {
            this.draggable = this.origDraggable;
            this.origDraggable = null;
        }
    },
    genericStart: function(x, y) {
        return true;
    },
    genericEnd: function() {
        return true;
    },
    genericDrag: function(me, x, y) {
        me.draggable.style.left = x;
        me.draggable.style.top = y;
        return true;
    },
    _stopSelection: function(ev) {
        stopSelection(this.parentElement);
        if (ie5) {
            ev.cancelBubble = true;
            ev.returnValue = false;
        } else {
            if (typeof ev.preventDefault != 'undefined')
                ev.preventDefault();
            if (typeof ev.stopPropagation != 'undefined')
                ev.stopPropagation();
        }
    },
    _restoreSelection: function() {
        restoreSelection(this.parentElement);
    },
    z: function() {
    }
});
function createPageShim(parentElement) {
    var w = (parentElement.scrollWidth? parentElement.scrollWidth : parentElement.clientWidth);
    var h = (parentElement.scrollHeight? parentElement.scrollHeight : parentElement.clientHeight);
    var pageShim = cel("div");
    pageShim.id = pageShim.name = "pageshim";
    pageShim.style.top = 0;
    pageShim.style.left = 0;
    pageShim.style.width = w;
    pageShim.style.height = h;
    pageShim.style.position = "absolute";
    pageShim.style.display = "block";
    pageShim.style.zIndex = "500";
    pageShim.style.backgroundColor = "red";
    pageShim.style.opacity=0;
    pageShim.style.filter="alpha(opacity=0)";
    parentElement.appendChild(pageShim);
}
function removePageShim(parentElement) {
    var pageShim = gel("pageshim");
    if (pageShim)
        parentElement.removeChild(pageShim);
}
function createIFrameShim(bounds) {
    var iframeShim = cel("iframe");
    iframeShim.id = iframeShim.name = "iframeDragShim";
    iframeShim.style.position = "absolute";
    iframeShim.style.top = bounds.top;
    iframeShim.style.left = bounds.left;
    iframeShim.style.width = bounds.width;
    iframeShim.style.height = bounds.height;
    document.body.appendChild(iframeShim);
}
function moveIFrameShim(x, y) {
    var iframeShim = gel("iframeDragShim");
    if (iframeShim) {
        iframeShim.style.left = x;
        iframeShim.style.top = y;
    }
}
function removeIFrameShim() {
    var iframeShim = gel("iframeDragShim");
    if (iframeShim)
        document.body.removeChild(iframeShim);
}
//defer classes/GwtDraggableSnap.js
var debugId = 0;
/**
* Glide Windowing Toolkit - Draggable stuff
* bjr
*
* -------------------------------------------------------------
*  This class extends GwtDraggable to support 'snap' dragging.
*
*     Snap to table
*    -------------
*       the dragged element snaps to cells within a table (grid)
*       To use this mode:
*
*           - call setSnapTable(id_of_table_element)
*
*           - any cells in the table with these attributes will be snapped to:
*                   dragging = "true"
*                   dropzone = "true"
*
*       The snapping operation depends on the position style of the
*       dragged element.  If the position is 'absolute', then the element
*       will be snapped to the upper left corner of the cell using
*       absolute positioning.  If the position is 'relative', then the
*       element will be removed from its current parent cell and appended
*       to the spanned to cell.  Relative positioning will also allow you
*       to move the dragged element above or below other elements in the
*       cell as you drag.
*
*       When you are snap dragging, a floating element is created that
*       tracks the mouse movements during dragging since the snapped element
*       spans instead of moves smoothly with the mouse.  This element can
*       be styled so that it is either visible or not and may take any form
*       that you chose.  Use the following methods to set the floater:
*
*           - setFloatClass
*               sets that className for the float element
*
*           - setCreateFloat
*               sets that name of a function that is called when the floater
*               is to be created.  Must return a 'div' element.  The function
*               is called with the following signature:
*
*                   createFloat(dragObj, currentPageX, currentPageY)
*
*
*     Using custom drop zones instead of a table
*    ------------------------------------------
*       addDropZone(element)
*       removeDropZone(element)
*       clearDropZones()
*
*
*     Override drop zone initialization
*    ---------------------------------
*       You may also override the initialization of the drop zones by calling:
*
*           - setInitDropZones(myFunc)
*               callback signature -> f(this, pageX, pageY)
*
*       When dragging starts, 'myFunc' will be called to allow you to
*       specify the drop zones.  You must return an array of elements that
*       will be used as drop zones.  The handling of drop zones based on
*       whether the dragging element is relative or absolute positioned
*       works the same as described above for snapping to a table.
*
*
*    Override the dropping of elements
*   ---------------------------------
*       By default, when a drop can occur, it will occur.  If you want to
*       control when drops occur, register for the following event (using 'on'):
*
*           - beforedrop
*               callback signature -> f(this, zone, drop_before_this_element, x, y)
*
*           If your function returns false, then no further action will be taken
*           If your function returns true, then the dragged object will be
*               moved to the drop zone for you
*
*           For absolute positioned dragging, zone and drop_before_this_element
*           will be the same value.  For relative positioned dragging, zone is
*           the element containing the drop zone and drop_before_this_element
*           is the location within the drop zone element.
*
*   Bounding the drag
*    -----------------
*       To set bounds on the dragging operation (actually, just the
*       float) use the following:
*
*           setBoundUpDown()
*               the drag will ONLY move up or down while dragging
*                   (turns off left-right bounding)
*
*           setBoundLeftRight()
*               the drag will ONLY move left and right while dragging
*                   (turns off up-down bounding)
*
*           setBoundElement(element)
*               the drag will not allow the float to drag outside of the
*               specified element
*                   (may be used with left-right or up-down bounding)
*/
var GwtDraggableSnap = Class.create(GwtDraggable, {
    initialize : function(header, itemDragged) {
        GwtDraggable.prototype.initialize.call(this, header, itemDragged);
        this.snapTable = null;
        this.dropZoneList = [];
        this.initDropZones = null;
        this.boundDirection = null;
        this.boundElement = null;
        this.setStart(this.snapStart.bind(this));
        this.setDrag(this.snapDrag.bind(this));
        this.setEnd(this.snapEnd.bind(this));
        this.setCreateFloat(this._createFloat.bind(this));
        this.setFloatClassName("drag_float_visible");
    },
    destroy: function() {
        this.snapTable = null;
        this.dropZoneList = null;
        this.onInitDropZones = null;
        this.boundElement = null;
        GwtDraggable.prototype.destroy.call(this);
    },
    setCreateFloat: function(f) {
        this.onCreateFloat = f;
        if (!f)
            this.onCreateFloat = this._createFloat.bind(this);
    },
    setFloatClassName: function(n) {
        this.floatClassName = n;
    },
    setSnapTable: function(table) {
        this.snapTable = table;
        this.dropZoneList = [];
    },
    setInitDropZones: function(f) {
        this.onInitDropZones = f;
        this.snapTable = null;
        this.dropZoneList = [];
    },
    setBoundLeftRight: function() {
        this.boundDirection = "l-r";
    },
    setBoundUpDown: function() {
        this.boundDirection = "u-d";
    },
    setBoundElement: function(element) {
        this.boundElement = element;
    },
    addDropZone: function(element) {
        this.dropZoneList.push(element);
    },
    removeDropZone: function(element) {
        for (var i = 0; i < this.dropZoneList.length; i++) {
            if (element.id == this.dropZoneList[i].id) {
                this.dropZoneList.remove(i);
                break;
            }
        }
    },
    clearDropZones: function() {
        this.dropZoneList = [];
    },
    snapStart: function(dragObj, x, y, e) {
        x -= this.differenceX;
        y -= this.differenceY;
        if (dragObj.draggable.style.position == "absolute")
            this.snapMode = "absolute";
        else
            this.snapMode = "relative";
        this.currentDropZone = null;
        this.snapElement = null;
        this.dragFloat = null;
        this._initDropZones(dragObj, x, y);
        this._initDragBounds(x, y);
        return true;
    },
    snapDrag: function(dragObj, x, y, e) {
        var pos = this._boundDragging(x, y);
        x = pos[0];
        y = pos[1];
        if (!this.dragFloat)
            this.dragFloat = this.onCreateFloat(dragObj, x, y);
        if (this.dragFloat) {
            this.dragFloat.style.left = x;
            this.dragFloat.style.top = y;
        }
        this._findDropZoneAndMove(dragObj, x + this.differenceX, y + this.differenceY);
        return true;
    },
    snapEnd: function(dragObj, x, y, e) {
        this.dropZones = [];
        if (this.dragFloat)
            this.floatIntv = this._floatBackAndDelete(this, 150, 15);
        return true;
    },
    hasSnapMoved: function() {
        return this.originalDropZone != this.currentDropZone;
    },
    _createFloat: function(dragObj, x, y) {
        var dfloat = cel("div");
        dfloat.id = "floater";
        dfloat.className = this.floatClassName;
        dfloat.style.position = "absolute";
        dfloat.style.width = dragObj.draggable.offsetWidth - (!isMSIE ? 2 : 0);
        dfloat.style.height = dragObj.draggable.offsetHeight - (!isMSIE ? 2 : 0);
        document.body.appendChild(dfloat);
        return dfloat;
    },
    _boundDragging: function(x, y) {
        if (this.boundDirection == "l-r")
            y = this.origY;
        else if (this.boundDirection == "u-d")
            x = this.origX;
        if (this.boundElement) {
            if (y < this.boundTop)
                y = this.boundTop;
            if (y > this.boundBottom)
                y = this.boundBottom;
            if (x < this.boundLeft)
                x = this.boundLeft;
            if (x > this.boundRight)
                x = this.boundRight;
        }
        return [x, y];
    },
    _findDropZoneAndMove: function(dragObj, x, y) {
        if (this.snapMode == "absolute") {
            if (this.currentDropZone && this._overlaps(this.currentDropZone, x, y))
                return false;
            var dz = this._findDropZoneAbsolute(dragObj, x, y);
            if (dz && dz != this.currentDropZone) {
                this.currentDropZone = dz;
                this.snapElement = dz.element;
                if (!this.fireEvent("beforedrop", dragObj, dz.element, dz.element, x, y))
                    return false;
                dragObj.draggable.style.left = this.currentDropZone.left;
                dragObj.draggable.style.top = this.currentDropZone.top;
                return true;
            }
        } else {
            var dz = this._findDropZoneRelative(dragObj, x, y);
            if (dz && dragObj.draggable.nextSibling != dz.element) {
                this.currentDropZone = dz;
                this.snapElement = dz.element.parentNode;
                if (!this.fireEvent("beforedrop", dragObj, dz.element.parentNode, dz.element, x, y))
                    return false;
                dz.element.parentNode.insertBefore(dragObj.draggable, dz.element);
                dragObj.draggable.parentNode.style.display = "none";
                dragObj.draggable.parentNode.style.display = "";
                return true;
            }
        }
        return false;
    },
    _findDropZoneAbsolute: function(dragObj, x, y) {
        var dz = null;
        for (var i = 0; i < this.dropZones.length; i++) {
            if (this._overlaps(this.dropZones[i], x, y)) {
                dz = this.dropZones[i];
                break;
            }
        }
        return dz;
    },
    _findDropZoneRelative: function(dragObj, x, y) {
        var draggable = dragObj.getDraggable();
        var cCell = null;
        var aLargeNumber = 100000000;
        for (var z = 0; z < this.dropZones.length; z++) {
            var dz = this.dropZones[z];
            if (draggable == dz)
                continue;
            var ai = Math.sqrt(Math.pow(x - dz.left, 2) + Math.pow(y - dz.top, 2));
            if (isNaN(ai))
                continue;
            if (ai < aLargeNumber){
                aLargeNumber = ai;
                cCell = dz;
            }
        }
        return cCell;
    },
    _initDragBounds: function(x, y) {
        this.origX = x;
        this.origY = y;
        if (this.boundElement) {
            this.boundLeft = grabOffsetLeft(this.boundElement) - grabScrollLeft(this.boundElement);
            this.boundTop = grabOffsetTop(this.boundElement) - grabScrollTop(this.boundElement);
            this.boundRight = this.boundLeft + this.boundElement.offsetWidth - this.draggable.offsetWidth;
            this.boundBottom = this.boundTop + this.boundElement.offsetHeight - this.draggable.offsetHeight;
            this.boundLeft -= 4;
            this.boundTop -= 4;
            this.boundRight += 4;
            this.boundBottom += 4;
        }
    },
    _initDropZones: function(dragObj, x, y) {
        this.dropZones = [];
        var zones = [];
        if (this.onInitDropZones) {
            zones = this.onInitDropZones(this, x, y);
        } else if (this.snapTable) {
            zones = this._initDropZonesFromTable(this.snapTable);
        } else {
            for (var i = 0; i < this.dropZoneList.length; i++)
                zones.push(this.dropZoneList[i]);
        }
        for (var i = 0; i < zones.length; i++) {
            var zone = zones[i];
            if (this.snapMode == "absolute") {
                this._addDropZone(zone);
            } else {
                this._initDropZonesRelative(dragObj, zone);
            }
        }
        if (this.snapMode == "absolute") {
            this.originalDropZone = this._findDropZoneAbsolute(dragObj, x, y);
        } else {
            var nextSibling = dragObj.draggable.nextSibling;
            for (var i = 0; i < this.dropZones.length; i++) {
                if (this.dropZones[i].element == nextSibling) {
                    this.originalDropZone = this.dropZones[i];
                    break;
                }
            }
        }
    },
    _initDropZonesFromTable: function(t) {
        var zones = [];
        var rowCnt = t.rows.length;
        var colCnt = t.rows[0].cells.length;
        for (var row = 0; row < rowCnt; row++) {
            for (var col = 0; col < colCnt; col++) {
                var cell = t.rows[row].cells[col];
                if (getAttributeValue(cell, "dropzone") == "true" || cell.dropzone == "true")
                    zones.push(cell);
            }
        }
        return zones;
    },
    _initDropZonesRelative: function(dragObj, zone) {
        var myHeight = 0;
        var lastDivExists = false;
        for (var i = 0; i < zone.childNodes.length; i++) {
            var node = zone.childNodes[i];
            if (getAttributeValue(node, "dragpart")
                || node.dragpart == "true"
                || getAttributeValue(node, "dropzone")
                || node.dropzone == "true") {
                if ((node.id == "lastdiv") || (node.name == "lastdiv"))
                    lastDivExists = true;
                if (node == dragObj.draggable) {
                    myHeight = dragObj.draggable.offsetHeight;
                }
                if (this._isInScrollRegion(node, zone)) {
                    this._addDropZone(node, myHeight);
                }
            }
        }
        if (!lastDivExists) {
            var lastDiv = cel("DIV");
            lastDiv.name = "lastdiv";
            lastDiv.dropzone = "true";
            lastDiv.style.width = "100%";
            lastDiv.style.height = "0";
            zone.appendChild(lastDiv);
            this._addDropZone(lastDiv, myHeight);
        }
    },
    _addDropZone: function(element, topOffset) {
        if (!topOffset)
            topOffset = 0;
        var dropZone = {};
        dropZone.element = element;
        dropZone.left = grabOffsetLeft(element) - grabScrollLeft(element);
        dropZone.top = grabOffsetTop(element) - topOffset - grabScrollTop(element);
        dropZone.right = dropZone.left + element.offsetWidth;
        dropZone.bottom = dropZone.top + element.offsetHeight;
        this.dropZones.push(dropZone);
    },
    _isInScrollRegion: function(element, region) {
        var left = element.offsetLeft;
        var top = element.offsetTop;
        if (left < 0)
            left = 0;
        if (top < 0)
            top = 0;
        return (left >= region.scrollLeft)
        && (top  >= region.scrollTop)
        && (left <= (region.scrollLeft + region.offsetWidth))
        && (top  <= (region.scrollTop + region.offsetHeight));
    },
    _overlaps: function(dz, x, y) {
        return ((dz.left < x) && (x < dz.right) && (dz.top < y) && (y < dz.bottom));
    },
    _floatBackAndDelete: function(gd, tTime, tMoves) {
        var baseObj = gd.getDraggable();
        var movenObj = gd.dragFloat;
        var currentX = parseInt(movenObj.style.left);
        var currentY = parseInt(movenObj.style.top);
        var backX = (currentX - grabOffsetLeft(baseObj) - grabScrollLeft(baseObj)) / tMoves;
        var backY = (currentY - grabOffsetTop(baseObj) - grabScrollTop(baseObj)) / tMoves;
        return setInterval(
            function(){
                if (tMoves < 1) {
                    clearInterval(gd.floatIntv);
                    gd.dragFloat.parentNode.removeChild(gd.dragFloat);
                    gd.dragFloat = null;
                    return;
                }
                tMoves--;
                currentX -= backX;
                currentY -= backY;
                movenObj.style.left = parseInt(currentX) + "px";
                movenObj.style.top = parseInt(currentY) + "px"
            }, tTime / tMoves)
    },
    z: null
});
//defer classes/GwtPopup.js
function popupStart(element, evt) {
    if (!element.GwtPopup)
        element.GwtPopup = new GwtPopup(element);
    return element.GwtPopup.onMouseMove(evt);
}
function popupCancel(element, evt) {
    if (element.GwtPopup)
        return element.GwtPopup.onMouseOut(evt);
}
var GwtPopup = Class.create({
    initialize: function(element) {
        this.className = "GwtPopup";
        this.element = element;
        this.mouseReset();
        this.timer = 0;
        this.delay = 500;
    },
    onMouseMove: function(evt) {
        var x = Event.pointerX(evt);
        var y = Event.pointerY(evt);
        if (this.x == x && this.y == y)
            return true;
        if (this.timer != 0)
            clearTimeout(this.timer);
        this.timer = setTimeout(this.iFrameTest.bind(this), this.delay);
        return true;
    },
    onMouseOut: function() {
        this.mouseReset();
        if (this.timer == 0)
            return;
        clearTimeout(this.timer);
        this.timer = 0;
    },
    onTimerEvent: function() {
        var d = new GlideDialogForm(this.element.getAttribute('popup_table'));
        d.setSysID(this.element.getAttribute('popup_sys_id'));
        d.setTitle("Hello");
        d.render();
        this.dialog = d;
    },
    iFrameTest: function() {
        var iframeShim = cel("iframe");
        iframeShim.id = iframeShim.name = "iframeDragShim_" + this.id;
        iframeShim.src = this.element.href;
        iframeShim.style.position = "absolute";
        iframeShim.style.top = 10;
        iframeShim.style.left = 60;
        iframeShim.style.width = 600;
        iframeShim.style.height = 800;
        iframeShim.style.backgroundColor = "white";
        document.body.appendChild(iframeShim);
    },
    mouseReset: function() {
        this.x = -1;
        this.y = -1;
    }
});
function pop() {
    return "whatever";
}
//defer classes/GwtDateTimePicker.js
/**
* Date Time picker
*
* TODO: check for and clean up all memory leaks!
* TODO: test with other languages
* TODO: remove old calendar support and replace with this support
*
* To use:
*    var tp = new GwtDateTimePicker(dateFieldId, dateTimeFormat, includeTime, [positionElement, defaultValue])
*
* dateFieldId
*       the id of the date field used to:
*           - get the initial value (if defaultValue is not specified)
*           - position the calendar popup (if positionElement is not specified)
*           - updated with the user selected date/time value when the user enters and accepts
*               the date/time - this field is updated with the date/time in the specified dateTimeFormat
*
* dateTimeFormat
*       the date time format of the dateTimeString and the format used when reading or updating dateFieldId
*
* includeTime
*       flag indicating if date AND time should be requested or only the date
*
* positionElement
*       the element used to position the date time picker.  If not specified, dateFieldId is used
*
* defaultValue
*       the default date and optional time.  If not specified, the initial value is taken from dateFieldId
*
*
* NOTE: If modifying this file, GwtMobileDateTimePicker extends this class so changes made here may impact it.
* ------------------------------------------------------------------------------------------------------------
*
*/
var GwtDateTimePicker = Class.create(GlideWindow, {
    MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    DAYS_IN_MONTH : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    MSGS : ["Go to Today", "Time", "SMTWTFS", "Invalid time"],
    initialize: function(dateFieldId, dateTimeFormat, includeTime, /*optional*/positionElement, /*optional*/defaultValue) {
        this.dayCells = [];
        this.cleanup = [];
        this._getMessages();
        this.includeTime = includeTime;
        this.firstDay = Math.min(Math.max(g_date_picker_first_day_of_week - 1, 0), 6);
        GlideWindow.prototype.initialize.call(this, "GwtDateTimePicker", true);
        this.dateFieldId = dateFieldId;
        var dateField = $(dateFieldId);
        if (!defaultValue)
            defaultValue = dateField.value;
        this.selectedDate = getUserDateTime();
        if (defaultValue) {
            var ms = getDateFromFormat(defaultValue, dateTimeFormat);
            if (ms > 0)
                this.selectedDate = new Date(ms);
        }
        this.date = new Date(this.selectedDate);
        this.setFormat(dateTimeFormat);
        this.removeBody();
        this.clearSpacing();
        this.canFocus = false;
        this._createControls();
        if (positionElement)
            this._moveToPosition(positionElement);
        else
            this._moveToPosition(dateField);
        this.setZIndex(10000);
        this.setShim(true);
        this._shimResize();
        this.mouseUpFunc = this.onMouseUp.bindAsEventListener(this);
        this.keyUpFunc = this.onKeyUp.bind(this);
        if (this.includeTime)
            Event.observe(this.window, "keypress",  this.keyUpFunc);
        Event.observe(document, "mouseup", this.mouseUpFunc);
        this.canFocus = true;
        this.focusEditor();
    },
    destroy: function() {
        for (var i = 0; i < this.cleanup.length; i++) {
            this.cleanup[i].onchange = null;
            this._deregisterDayClick(this.cleanup[i]);
        }
        this.cleanup = [];
        this.dayCells = [];
        this.tbody = null;
        if (this.includeTime)
            Event.stopObserving(this.window, "keypress", this.keyUpFunc);
        Event.stopObserving(document, "mouseup", this.mouseUpFunc);
        GlideWindow.prototype.destroy.call(this);
    },
    _getMessages:function() {
        this.msgs = new GwtMessage().getMessages(this.MSGS.concat(this.MONTH_NAMES));
    },
    _createControls: function() {
        var parent = getFormContentParent();
        this.insert(parent, null);
        this.setWidth(10);
        var html = this._createCalendar();
        this._createOkCancel();
        this.setTitle(html);
        this._showMonth();
    },
    _createCalendar: function() {
        var div = cel("div");
        div.className = "calDiv";
        var table = cel("table", div);
        table.className = "calBorder";
        table.border = 0;
        table.cellSpacing = 0;
        table.cellPadding = 0;
        var tbody = cel("tbody", table);
        var tr = cel("tr", tbody);
        var td = cel("td", tr);
        table = cel("table", td);
        table.className = "calTable";
        table.cellSpacing = 0;
        table.cellPadding = 0;
        var tbody = cel("tbody", table);
        this.tbody = tbody;
        this._createHeader(tbody);
        this._createMonth(tbody);
        if (this.includeTime)
            this._createTime(tbody);
        return div;
    },
    _createHeader: function(tbody) {
        var tr = cel("tr", tbody);
        var cell = cel("td", tr);
        cell.className = "calMonthNavigation pointerhand";
        cell.innerHTML = "&lt;&lt;";
        cell.onclick = this._prevMonth.bind(this);
        this.cleanup.push(cell);
        cell = cel("td", tr);
        cell.id = "GwtDateTimePicker_month"
        cell.className = "calMonthNavigation calText";
        cell.colSpan = 7;
        cell = cel("td", tr);
        cell.className = "calMonthNavigation pointerhand";
        cell.innerHTML = "&gt;&gt;";
        cell.onclick = this._nextMonth.bind(this);
        this.cleanup.push(cell);
    },
    _createMonth: function(tbody) {
        var tr = cel("tr", tbody);
        var daysOfWeek = this.msgs["SMTWTFS"];
        for (var i = 0; i < 9; i++) {
            var cell = cel("td", tr);
            cell.className = "calText calDayColumnHeader";
            if (i > 0 && i < 8)
                cell.innerHTML = daysOfWeek.substr(((i + this.firstDay) % 7) - 1, 1);
        }
        var dayIndex = 0;
        for (var week = 0; week < 6; week++) {
            tr = cel("tr", tbody);
            for (var dow = 0; dow < 9; dow++) {
                var cell = cel("td", tr);
                if (dow > 0 && dow < 8) {
                    cell.className = "calText calCurrentMonthDate";
                    var a = cel("a", cell);
                    a.id = "GwtDateTimePicker_day" + dayIndex;
                    this._registerDayClick(a);
                    this.cleanup.push(a);
                    a.day = "0";
                    a.month = "0";
                    a.year = "0";
                    this.dayCells[dayIndex] = a;
                    dayIndex++;
                }
            }
        }
        tr = cel("tr", tbody);
        cell = cel("td", tr);
        cell.className = "calText calTodayText pointerhand";
        cell.colSpan = 9;
        cell.width = "100%";
        cell.align = "center";
        cell.innerHTML = this.msgs["Go to Today"];
        cell.onclick = this._selectToday.bind(this);
        this.cleanup.push(cell);
    },
    _registerDayClick: function(a) {
        a.onclick = this._selectDay.bindAsEventListener(this);
        a.ondblclick = this._selectDayAndSave.bindAsEventListener(this);
    },
    _deregisterDayClick: function(a) {
        a.onclick = null;
        a.ondblclick = null;
    },
    _createTime: function(tbody) {
        var tr = cel("tr", tbody);
        cell = cel("td", tr);
        cell.className = "calText calTime";
        cell.colSpan = 9;
        cell.width = "100%";
        cell.align = "center";
        var span = cel('span', cell);
        span.innerHTML = this.msgs["Time"] + ": ";
        var input = this._createTextInput('hh');
        input.tabIndex = 1000;
        var hour = this.selectedDate.getHours();
        var ampm = "a";
        if (this.hasAMPM) {
            if (hour == 0)
                hour = 12;
            else if (hour > 11) {
                ampm = "p";
                if (hour > 12)
                    hour -= 12;
            }
        }
        input.value = padLeft(hour, 2, '0');
        span.appendChild(input);
        var sep = cel('span', span);
        sep.innerHTML = ":";
        input = this._createTextInput('mm');
        input.value = padLeft(this.selectedDate.getMinutes(), 2, '0');
        input.tabIndex = 1001;
        span.appendChild(input);
        if (this.hasSeconds) {
            sep = cel('span', span);
            sep.innerHTML = ":";
            input = this._createTextInput('ss');
            input.tabIndex = 1002;
            input.value = padLeft(this.selectedDate.getSeconds(), 2, '0');
            span.appendChild(input);
        }
        if (this.hasAMPM) {
            var s = cel("select");
            s.id = 'GwtDateTimePicker_ampm';
            s.className = "calText";
            s.size = 1;
            input.tabIndex = 1003;
            addOption(s, "am", "AM", ampm == "a");
            addOption(s, "pm", "PM", ampm == "p");
            span.appendChild(s);
        }
        tr = cel("tr", tbody);
        cell = cel("td", tr);
        cell.id = "GwtDateTimePicker_error";
        cell.className = "calText calErrorText";
        cell.colSpan = 9;
        cell.width = "100%";
        cell.align = "center";
    },
    _createTextInput: function(id) {
        var input = cel('input');
        input.id = 'GwtDateTimePicker_' + id;
        input.size = "2";
        input.maxLength = "2";
        input.className = "calText calInput";
        input.onchange = this._hideTimeError.bind(this);
        this.cleanup.push(input);
        return input;
    },
    _showMonth: function() {
        var sy = this.selectedDate.getFullYear();
        var sm = this.selectedDate.getMonth();
        var sd = this.selectedDate.getDate();
        var cy = this.date.getFullYear();
        var cm = this.date.getMonth();
        var cd = this.date.getDate();
        inner("GwtDateTimePicker_month", this.msgs[this.MONTH_NAMES[cm]] + " " + cy);
        var d = this._getFirstDay(new Date(this.date));
        for (var ndx = 0; ndx < 42; ndx++) {
            var a = this.dayCells[ndx];
            a.day = d.getDate();
            a.month = d.getMonth();
            a.year = d.getFullYear();
            a.innerHTML = d.getDate();
            var className;
            a.className = "";
            if ((d.getMonth() == sm) && (d.getFullYear() == sy) && (d.getDate() == sd))
                className = "calText calCurrentDate";
            else if ((d.getMonth() == cm) && (d.getFullYear() == cy))
                className = "calText calCurrentMonthDate";
            else {
                className = "calText calOtherMonthDate";
                a.className = "calOtherMonthDateAnchor";
            }
            a.parentNode.className = className;
            d.setDate(d.getDate() + 1);
        }
        this.focusEditor();
    },
    _getFirstDay: function(/*Date*/ d) {
        d.setDate(1);
        var dow = d.getDay();
        while (((dow - this.firstDay) % 7) > 0) {
            d.setDate(d.getDate() - 1);
            dow--;
        }
        return d;
    },
    _moveToPosition: function(positionElement) {
        this.offsetLeft = getOffset(positionElement, "offsetLeft");
        this.offsetTop = getOffset(positionElement, "offsetTop");
        this.container.style.top = this.offsetTop + positionElement.offsetHeight + 1;
        var left = (this.offsetLeft + positionElement.offsetWidth) - this.window.offsetWidth;
        if (left < 0)
            left = 0;
        this.container.style.left = left;
    },
    _createOkCancel: function () {
        if (!this.includeTime) {
            var hdr = this.getHeader();
            hdr.cellSpacing = 0;
            hdr.cellPadding = 0;
            return;
        }
        var b = createImage('images/workflow_approval_rejected.gifx', "Cancel (ESC)", this, this.dismiss);
        b.id = 'GwtDateTimePicker_cancel';
        this.addDecoration(b);
        b = createImage('images/workflow_approved.gifx', "Save (Enter)", this, this.save);
        b.id = 'GwtDateTimePicker_ok';
        this.addDecoration(b);
    },
    dismiss: function() {
        try {
            this.destroy();
        } catch(e) {}
        return false;
    },
    save: function() {
        if (this.includeTime) {
            var tm = this._getTimeEntry();
            if (tm == null)
                return;
            this.selectedDate.setHours(tm.hour, tm.min, tm.sec);
        }
        this.dismiss();
        var e = gel(this.dateFieldId);
        e.value = formatDate(this.selectedDate, this.dateTimeFormat);
        if (e['onchange'])
            e.onchange();
    },
    focusEditor: function(id) {
        if (!this.canFocus)
            return;
        if (!id)
            id = "GwtDateTimePicker_hh";
        var e = gel(id);
        if (e)
            Field.activate(e);
    },
    onKeyUp: function(e) {
        var e = getEvent(e);
        if (e.keyCode == 27) {
            Event.stop(e);
            this.dismiss();
        } else if (e.keyCode == 13) {
            Event.stop(e);
            this.save();
        }
    },
    onMouseUp: function(e) {
        var e = getEvent(e);
        if (this._isFromMe(e))
            return;
        Event.stop(e);
        this.save();
    },
    _isFromMe: function(e) {
        var div = Event.findElement(e, "DIV");
        while (div) {
            if (div.id == "GwtDateTimePicker")
                return true;
            div = findParentByTag(div, "DIV");
        }
        return false;
    },
    setFormat: function(format) {
        this.dateTimeFormat = format;
        this.hasAMPM = (format.indexOf("a") >= 0);
        this.hasSeconds = (format.indexOf("s") >= 0);
    },
    _prevMonth: function() {
        var d = this.date.getDate();
        var m = this.date.getMonth();
        var y = this.date.getFullYear();
        if (m > 0)
            m--;
        else {
            m = 11;
            y--;
        }
        if (d > this.DAYS_IN_MONTH[m])
            d = this.DAYS_IN_MONTH[m];
        this.date.setDate(1);       // set to 1 so that setting month does not change it
        this.date.setMonth(m);
        this.date.setFullYear(y);
        this.date.setDate(d);
        this._showMonth();
    },
    _nextMonth: function() {
        var d = this.date.getDate();
        var m = this.date.getMonth();
        var y = this.date.getFullYear();
        if (m < 11)
            m++;
        else {
            m = 0;
            y++;
        }
        if (d > this.DAYS_IN_MONTH[m])
            d = this.DAYS_IN_MONTH[m];
        this.date.setDate(1);       // set to 1 so that setting month does not change it
        this.date.setMonth(m);
        this.date.setFullYear(y);
        this.date.setDate(d);
        this._showMonth();
    },
    _selectToday: function() {
        var today = new Date();
        this.selectedDate.setDate(1);
        this.selectedDate.setFullYear(today.getFullYear());
        this.selectedDate.setMonth(today.getMonth());
        this.selectedDate.setDate(today.getDate())
        this.date = new Date(this.selectedDate);
        if (!this.includeTime)
            this.save();
        else
            this._showMonth();
    },
    _selectDay: function(e) {
        Event.stop(e);
        var cell = Event.element(getEvent(e));
        this.selectedDate.setDate(1);
        this.selectedDate.setFullYear(cell.year);
        this.selectedDate.setMonth(cell.month);
        this.selectedDate.setDate(cell.day);
        this.date = new Date(this.selectedDate);
        if (!this.includeTime)
            this.save();
        else
            this._showMonth();
    },
    _selectDayAndSave: function(e) {
        this._selectDay(e);
        this.save();
    },
    /**
* Get the user entered time and return an object with these properties:
*
*       .hour (0-23)
*       .min (0-59)
*       .sec (0-59)
*
* If any of the time values are invalid, a null is returned instead of a time object and
* the time is highlighted
*/
    _getTimeEntry: function() {
        var tm = {};
        tm.sec = 0;
        tm.min = 0;
        tm.hour = 0;
        var v = gel("GwtDateTimePicker_hh").value;
        if (!this._isValidTimePart(v, this.hasAMPM ? 1 : 0, this.hasAMPM ? 12 : 23)) {
            this._showTimeError("hh");
            return null;
        }
        tm.hour = parseInt(v, 10);
        if (this.hasAMPM) {
            if (tm.hour == 12)
                tm.hour = 0;
            var ampm = gel("GwtDateTimePicker_ampm");
            if (ampm.selectedIndex == 1)
                tm.hour += 12;
        }
        v = gel("GwtDateTimePicker_mm").value;
        if (!this._isValidTimePart(v, 0, 59)) {
            this._showTimeError("mm");
            return null;
        }
        tm.min = parseInt(v, 10);
        if (this.hasSeconds) {
            v = gel("GwtDateTimePicker_ss").value;
            if (!this._isValidTimePart(v, 0, 59)) {
                this._showTimeError("ss");
                return null;
            }
            tm.sec = parseInt(v, 10);
        }
        return tm;
    },
    _isValidTimePart: function(v, min, max) {
        if (!v || isNaN(v))
            return false;
        var num = parseInt(v, 10);
        if (num < min || num > max)
            return false;
        return true;
    },
    _showTimeError: function(part) {
        var e = $("GwtDateTimePicker_error");
        if (!e)
            return;
        e.innerHTML = "";
        var img = cel("img", e);
        img.src = "images/error_tsk.gifx";
        img.alt = this.msgs["Invalid time"];
        var span = cel("span", e);
        span.innerHTML = this.msgs["Invalid time"];
        this.focusEditor("GwtDateTimePicker_" + part);
    },
    _hideTimeError: function() {
        var e = $("GwtDateTimePicker_error");
        if (!e)
            return;
        e.innerHTML = "";
    },
    type: function() {
        return "GwtDateTimePicker";
    }
});
//defer classes/GwtPollDialog.js
var GwtPollDialog = Class.create(GlideDialogWindow, {
    initialize: function (tableName, query, rows, view, action) {
        GlideDialogWindow.prototype.initialize.call(this, 'export_poll_dialog');
        var keys = ["Export in Progress", "Export Complete"];
        this.msgs = new GwtMessage().getMessages(keys);
        this.tableName = tableName;
        this.query = query;
        this.rows = rows;
        this.view = view;
        this.action = action;
        this.setPreference('table', 'export_poll');
        this.setPreference('sysparm_query', this.query);
        this.setPreference('sysparm_target', this.tableName);
        this.setPreference('sysparm_export', this.action);
        this.setPreference('sysparm_view', this.view);
        this.setPreference('sysparm_rows', this.rows);
        this.setTitle(this.msgs["Export in Progress"]);
        this.pollInterval = 1000;
        this.jobId = null;
        this.timerId = null;
        g_poll_dialog = this;
    },
    execute : function() {
        this.render();
    },
    close : function() {
        g_poll_dialog = null;
        this.destroy();
    },
    cancelJob : function() {
        var postString = "job_id=" + this.jobId +"&sys_action=cancel";
        serverRequestPost("poll_processor.do", postString, function() {
            clearTimeout(this.timerId);
        }.bind(this) );
        this.close();
    },
    startPolling : function() {
        var poll_form = gel('sys_poll.do');
        if (poll_form) {
            poll_form.sys_action.value="init";
            var serial = Form.serialize(poll_form);
            serverRequestPost('poll_processor.do', serial, this.ackInit.bind(this));
        }
    },
    ackInit : function(response) {
        this.jobId = response.responseText;
        this._queuePoll();
    },
    ack : function(response) {
        var answer = response.responseText;
        var index = answer.indexOf('complete');
        if (index == 0) {
            var splits = answer.split(',');
            var id = splits[1];
            var completed = gel('completed_sys_id');
            completed.value = id;
            var span = gel('poll_text');
            span.innerHTML = this.msgs["Export Complete"];
            var download = gel('download_button');
            if (download) {
                download.setAttribute('class', 'web');
                download.setAttribute('className', 'web');
                download.disabled = false;
            }
            var image = gel('poll_img');
            if (image)
                image.style.display = 'none';
            var complete = gel('export_complete');
            if (complete)
                complete.style.display = '';
            this.setTitle(this.msgs["Export Complete"]);
            return;
        }
        if (answer.indexOf('initial' != 0)) {
            var span = gel('poll_text');
            if (span) {
                span.innerHTML = answer;
            }
            this._queuePoll.call(this);
        }
    },
    _queuePoll : function() {
        this.timerId = setTimeout(this.poll.bind(this), this.pollInterval);
    },
    poll : function() {
        if (this.jobId) {
            var postString = "job_id=" + this.jobId +"&sys_action=poll";
            serverRequestPost("poll_processor.do", postString, this.ack.bind(this));
        }
    },
    getResult: function() {
        var completed = gel('completed_sys_id');
        var id = completed.value;
        top.window.location = "sys_attachment.do?sys_id=" + id;
        this.close();
    }
});
//defer classes/GwtExportScheduleDialog.js
var GwtExportScheduleDialog = Class.create(GlideDialogWindow, {
    initialize: function (tableName, query, rows, view, action) {
        GlideDialogWindow.prototype.initialize.call(this, 'export_schedule_dialog');
        var keys = ["Please Confirm", "Please specify an address", "Export will be emailed to"];
        this.msgs = new GwtMessage().getMessages(keys);
        this.tableName = tableName;
        this.query = query;
        this.rows = rows;
        this.view = view;
        this.action = action;
        this.setPreference('table', 'export_schedule');
        this.setPreference('sysparm_query', this.query);
        this.setPreference('sysparm_target', this.tableName);
        this.setPreference('sysparm_export', this.action);
        this.setPreference('sysparm_view', this.view);
        this.setPreference('sysparm_rows', this.rows);
        this.setTitle(this.msgs["Please Confirm"]);
        g_export_schedule_dialog = this;
    },
    execute : function() {
        this.render();
    },
    close : function() {
        g_export_schedule_dialog = null;
        this.destroy();
    },
    emailMe : function() {
        var address = gel('display_address');
        if (!address)
            return;
        if (address.value  == '') {
            alert(this.msgs["Please specify an address"]);
            return;
        }
        var real_address = gel('email_address');
        real_address.value = address.value;
        var splits = this.action.split('\_');
        var fName = 'sys_confirm_' + splits[1] + '.do';
        var confirm_form = gel(fName);
        confirm_form.sys_action.value="email";
        var remember_me = gel('display_remember_me');
        if (remember_me.checked)
            gel('remember_me').value = "true";
        var serial = Form.serialize(confirm_form);
        var args = this.msgs["Export will be emailed to"] + ' ' + address.value;
        serverRequestPost(fName,  serial, this.ack, args);
        this.close();
    },
    waitForIt : function() {
        var dialog = new GwtPollDialog(this.tableName, this.query, this.rows, this.view,  this.action);
        dialog.execute();
        this.close();
    },
    ack : function(request, message) {
        alert(message);
    }
});
//defer classes/GwtNavFilter.js
/**
* Handles nav menu filtering
*
* TODO: find/fix issue where text walks away from image in first set of modules before a separator for an app when window gets small
* TODO: red background when no match
*/
var GwtNavFilter = {
    cachedElements: {},
    clearText: function() {
        this.text = '';
    },
    filter: function(text) {
        if (!this.text)
            this._saveUserPreferences();
        this.text = this._cleanupText(text);
        if (!this.text)
            this._clearFilter();
        else
            this._filter();
    },
    _cleanupText: function(text) {
        var answer = text.toLowerCase();
        if (answer == "**")
            return "";
        if (answer.indexOf("*") == 0)
            answer = answer.substring(1);
        return answer;
    },
    _clearFilter: function() {
        this._showAppsCollapsed();
        this._restoreUserPreferences();
    },
    _filter: function(){
        this.displayed = {};
        this._matchApps();
        this._matchModules();
    },
    _matchApps: function() {
        var apps = this._getApps();
        for (var id in apps) {
            if (this._textMatch(apps[id]))
                this._showAppAndModules(id);
            else
                this._hideAppAndModules(id);
        }
    },
    _matchModules: function() {
        var modules = this._getModules();
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];
            var id = module.getAttribute('moduleid');
            if (this.displayed[id])
                continue;
            var label = module.getAttribute('modulename');
            var type = module.getAttribute('moduletype');
            if ((type != 'SEPARATOR') && (this._textMatch(label)))
                this._showModule(module);
        }
    },
    _textMatch: function(label) {
        return label && label.toLowerCase().indexOf(this.text) > -1;
    },
    _getApps: function() {
        if (!this.appList) {
            this.appList = new Object();
            var apps = document.getElementsByTagName("div");
            for (var i = 0; i != apps.length; i++) {
                var app = apps[i];
                var appid = app.getAttribute('appid');
                if (!appid)
                    continue;
                if (app.id == "div.perspectives")
                    continue;
                var t = this._getInnerText(app);
                this.appList[appid] = t;
            }
        }
        return this.appList;
    },
    _getModules: function() {
        if (!this.modList) {
            this.modList = [];
            var rows = document.getElementsByTagName("tr");
            for (var i = 0; i != rows.length; i++) {
                var row = rows[i];
                var parent = row.getAttribute('moduleparent');
                if (!parent || (parent == 'perspectives'))
                    continue;
                this.modList.push(row);
            }
        }
        return this.modList;
    },
    _showAppsCollapsed: function() {
        var apps = this._getApps();
        for (var id in apps) {
            var appDiv = this._getCachedElement('div.' + id);
            if (!appDiv)
                continue;
            showObject(appDiv);
            var span = this._getCachedElement(id);
            hideObject(span);
        }
        var rows = document.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; i++) {
            var module = rows[i];
            module.style.display = '';
            if (module.getAttribute('moduletype') == 'SEPARATOR') {
                var id = module.getAttribute('moduleid');
                var tr = this._getCachedElement("children." + id);
                if (tr)
                    tr.style.display = '';
                var span = this._getCachedElement(id);
                if (span) {
                    span.style.height = 'auto';
                    showObject(span);
                    var img = this._getCachedElement('img.' + id);
                    if (!img)
                        continue;
                    img.src = "images/arrow_reveal.gifx";
                }
            }
        }
    },
    _showModulesForApp: function(span, displayed) {
        var trs = span.getElementsByTagName("tr");
        for (var i = 0; i != trs.length; i++) {
            trs[i].style.display = '';
            var id = trs[i].getAttribute('moduleid');
            if (displayed && id)
                this.displayed[id] = 1;
        }
    },
    _hideModulesForApp: function(span) {
        var trs = span.getElementsByTagName("tr");
        for (var i = 0; i != trs.length; i++)
            trs[i].style.display = 'none';
    },
    _saveUserPreferences: function() {
        this.expandedApps = {};
        this.expandedModules = {};
        var apps = this._getApps();
        for (var id in apps) {
            var span = this._getCachedElement(id);
            if (span.style.display != 'none')
                this.expandedApps[id] = 1;
        }
        var modules = this._getModules();
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];
            var id = module.getAttribute('moduleid');
            var span = this._getCachedElement(id);
            if (!span)
                continue;
            if (span.style.display != 'none')
                this.expandedModules[id] = 1;
        }
    },
    _getCachedElement: function(id) {
        var element = this.cachedElements[id];
        if (!element) {
            element = gel(id);
            this.cachedElements[id] = element;
        }
        return element;
    },
    _restoreUserPreferences: function() {
        var apps = this._getApps();
        for (var id in apps) {
            var div = this._getCachedElement('div.' + id);
            var span = this._getCachedElement(id);
            if (this.expandedApps[id]) {
                this._markAppAsExpanded(div);
                showObject(span);
            } else {
                this._markAppAsCollapsed(div);
                hideObject(span);
            }
        }
        var colImg = "images/arrow_hide.gifx";
        var expImg = "images/arrow_reveal.gifx";
        var modules = this._getModules();
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];
            var id = module.getAttribute('moduleid');
            var type = module.getAttribute('moduletype');
            if (type != 'SEPARATOR')
                continue;
            var tr = this._getCachedElement("children." + id);
            var span = this._getCachedElement(id);
            var img = this._getCachedElement('img.' + id);
            if (this.expandedModules[id]) {
                if (tr)
                    tr.style.display = '';
                if (span) {
                    showObject(span);
                    span.style.height = 'auto';
                }
                if (img)
                    img.src = expImg;
            } else {
                if (tr)
                    tr.style.display = '';
                if (span) {
                    hideObject(span);
                    span.style.height = 'auto';
                }
                if (img)
                    img.src = colImg;
            }
        }
    },
    _showAppAndModules: function(id) {
        this._showApp(id);
        var span = this._getCachedElement(id);
        this._showModulesForApp(span, true);
    },
    _showApp: function(id) {
        if (this.displayed[id])
            return;
        var appDiv = this._getCachedElement('div.' + id);
        if (!appDiv)
            return;
        showObject(appDiv);
        this.displayed[id] = 1;
        var span = this._getCachedElement(id);
        showObject(span);
        this._markAppAsExpanded(appDiv);
        span.style.height = 'auto';
    },
    _markAppAsExpanded: function(appDiv) {
        var img = appDiv.getElementsByTagName('img')[0];
        img.src = "images/arrows_collapse_sm.gifx?v=2";
        img.alt = g_appCollapseMsg;
    },
    _markAppAsCollapsed: function(appDiv) {
        var img = appDiv.getElementsByTagName('img')[0];
        img.src = "images/arrows_expand_sm.gifx?v=2";
        img.alt = g_appExpandMsg;
    },
    _hideAppAndModules: function(id) {
        var appDiv = this._getCachedElement('div.' + id);
        if (!appDiv)
            return;
        hideObject(appDiv);
        var span = this._getCachedElement(id);
        hideObject(span);
        this._hideModulesForApp(span);
    },
    _showModule: function(module) {
        var id = module.getAttribute('moduleid');
        if (id) {
            if (this.displayed[id])
                return;
            this.displayed[id] = 1;
        }
        module.style.display = '';
        if (module.getAttribute('moduletype') == 'SEPARATOR') {
            var tr = this._getCachedElement("children." + id);
            if (tr)
                tr.style.display = '';
            var span = this._getCachedElement(id);
            showObject(span);
            span.style.height = 'auto';
            var img = this._getCachedElement('img.' + id);
            if (img)
                img.src = "images/arrow_reveal.gifx";
        }
        var container = module.getAttribute('modulecontainer');
        if (container) {
            var row = this._getCachedElement('module.' + container);
            this._showModule(row);
            return;
        }
        var app = module.getAttribute('moduleparent');
        if (app)
            this._showApp(app);
    },
    _getInnerText: function(node) {
        if (node.textContent)
            return node.textContent;
        if (node.innerText)
            return node.innerText;
        return '';
    },
    type: 'GwtNavFilter'
}
//defer classes/GwtDate.js
/**
* GwtDate is used to manage dates in a timezone agnostic format.  All timezone handling for
* GwtDate's is handled by making AJAX calls to the server (to get now, for example).
*
* Dates/times are serialized and deserialized as:
*
*      year,month,day:hour,minute
*
* Where ':hour,minute' is optional
*
* Also note that month is zero based (Jan = 0)
*/
var GwtDate = Class.create({
    MINUTES_IN_DAY : 1440,
    DAYS_IN_MONTH : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    MONTHS_IN_YEAR : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    AJAX_PROCESSOR : "xmlhttp.do?sysparm_processor=com.glide.schedules.AJAXDate",
    initialize: function(s) {
        if (s) {
            this.deserialize(s);
        } else {
            this.clear();
        }
    },
    clone: function() {
        var newDate = new GwtDate(this.serialize());
        return newDate;
    },
    clear: function() {
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
    },
    serialize: function(dateOnly) {
        var s = this.year + "-" + (this.month + 1) + "-" + this.day;
        if (!dateOnly)
            s += " " + this.formatTime(true);
        return s;
    },
    serializeInUserFormat: function(dateOnly) {
        if (dateOnly)
            return this.formatDate(g_user_date_format);
        else
            return this.formatDate(g_user_date_time_format);
    },
    serializeTimeInUserFormat: function(includeSeconds) {
        var spaceIndex = g_user_date_time_format.indexOf(" "); // after the space is the time format
        var timeFormat = g_user_date_time_format.substr(spaceIndex+1);
        if (!includeSeconds)
            timeFormat = timeFormat.replace(/[:\.]ss/,''); // remove seconds from format whether the separator is : or .
        var d = this.getDateObject(true);
        return formatDate(d, timeFormat);
    },
    deserialize: function(s) {
        this.clear();
        if (typeof s == 'number')
            return this.setFromMs(s);
        var components = s.split(" ");
        if (components) {
            var parts = components[0].split("-");
            this.year = parts[0] * 1;
            if (parts.length > 1) {
                this.month = (parts[1] * 1) - 1;
                if (parts.length > 2) {
                    this.day = parts[2] * 1;
                }
            }
            if (components.length >= 2) {
                var parts = components[1].split(":");
                this.hour = parts[0] * 1;
                if (parts.length > 1) {
                    this.minute = parts[1] * 1;
                }
                if (parts.length > 2) {
                    this.second = parts[2] * 1;
                }
            }
        }
    },
    getYear: function() {
        return this.year;
    },
    getMonth: function() {
        return this.month;
    },
    getDay: function() {
        return this.day;
    },
    getHour: function() {
        return this.hour;
    },
    getMinute: function() {
        return this.minute;
    },
    getSecond: function() {
        return this.second;
    },
    getTime: function() {
        var h = this.hour * 60;
        var m = this.minute * 1;
        if (this.second >= 30) {
            m++;
        }
        return h + m;
    },
    getDaysInMonth: function() {
        if ((this.month == 1) && ((this.year % 4) == 0) && (((this.year % 100) != 0) || ((this.year % 400) == 0))) {
            return 29;
        } else {
            return this.DAYS_IN_MONTH[this.month];
        }
    },
    setYear: function(year) {
        this.year = year;
    },
    setMonth: function(month) {
        this.month = month;
    },
    setDay: function(day) {
        this.day = day;
    },
    setHour: function(hour) {
        this.hour = hour;
    },
    setMinute: function(minute) {
        this.minute = minute;
    },
    setSecond: function(second) {
        this.second = second;
    },
    setStartOfDay: function() {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
    },
    setEndOfDay: function() {
        this.hour = 23;
        this.minute = 59;
        this.second = 59;
    },
    setFromJsDate: function(date) {
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
    },
    setFromMs: function(milliseconds) {
        this.setFromJsDate(new Date(milliseconds));
    },
    setFromDate: function(date) {
        this.year = date.getYear();
        this.month = date.getMonth();
        this.day = date.getDay();
        this.hour = date.getHour();
        this.minute = date.getMinute();
        this.second = date.getSecond();
    },
    setFromInt: function(intDate, intTime) {
        this.clear();
        var year = Math.floor(intDate / 10000);
        this.year = year;
        this.month = (Math.floor((intDate - (year * 10000)) / 100)) - 1;  // months are zero-based
        this.day = intDate % 100;
        if (intTime) {
            var hour = Math.floor(intTime / 10000);
            this.hour = hour;
            this.minute = Math.floor((intTime - (hour * 10000)) / 100);
            this.second = intTime % 100;
        }
    },
    /**
* Return time formatted for internal times
*/
    formatTime: function(includeSeconds) {
        var h = doubleDigitFormat(this.hour);
        var m = doubleDigitFormat(this.minute);
        if (!includeSeconds)
            return h + ":" + m;
        return h + ":" + m + ":" + doubleDigitFormat(this.second);
    },
    /**
* Return date formatted based on the user's date format settings
*/
    formatDate: function(format) {
        var d = this.getDateObject(false);
        d.setYear(this.year);
        d.setMonth(this.month);
        d.setDate(this.day);
        d.setHours(this.hour);
        d.setMinutes(this.minute);
        d.setSeconds(this.second);
        return formatDate(d, format);
    },
    /**
* Return a javascript Date object for the date, and optionally, the time
*/
    getDateObject: function(includeTime) {
        var d = new Date();
        /* Set the day to 1 before we start to set other parts.  This is because "d" will
* initialize to the current date.  However, some months do not have as many days as others
* so when you try to setMonth and the current day is larger than the number of days for that
* month, your month will adjust to some other month where the days fit.  For example, running
* this code on 2009-AUG-31 and trying to call this for the date 2009-APR-01 will result in
* 2009-MAY-01 being returned because May has 31 days but April does not.
*/
        d.setDate(1);
        d.setYear(this.year);
        d.setMonth(this.month);
        d.setDate(this.day);
        if (includeTime) {
            d.setHours(this.getHour());
            d.setMinutes(this.getMinute());
            d.setSeconds(this.getSecond());
        } else {
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
        }
        return d;
    },
    /**
* Does the range from this date to the toDate represent all day?
*/
    isAllDay: function(toDate) {
        return ((this.getTime() == 0) && (toDate.getTime() >= (this.MINUTES_IN_DAY)));
    },
    /**
* Returns whether the our date is is <, =, > the otherDate.
*/
    compare: function(otherDate, includeTimes) {
        if (this.getYear() != otherDate.getYear()) {
            return this.getYear() - otherDate.getYear();
        }
        if (this.getMonth() != otherDate.getMonth()) {
            return this.getMonth() - otherDate.getMonth();
        }
        if (this.getDay() != otherDate.getDay()) {
            return this.getDay() - otherDate.getDay();
        }
        if (includeTimes) {
            if (this.getHour() != otherDate.getHour()) {
                return this.getHour() - otherDate.getHour();
            }
            if (this.getMinute() != otherDate.getMinute()) {
                return this.getMinute() - otherDate.getMinute();
            }
            if (this.getSecond() != otherDate.getSecond()) {
                return this.getSecond() - otherDate.getSecond();
            }
        }
        return 0;
    },
    addSeconds: function(seconds) {
        if (seconds < 0)
            return this.subtractSeconds(seconds * -1);
        for (var i = 0; i < seconds; i++) {
            this._incrementSecond();
        }
    },
    addMinutes: function(minutes) {
        if (minutes < 0)
            return this.subtractMinutes(minutes * -1);
        for (var i = 0; i < minutes; i++) {
            this._incrementMinute();
        }
    },
    addHours: function(hours) {
        if (hours < 0)
            return this.subtractHours(hours * -1);
        for (var i = 0; i < hours; i++) {
            this._incrementHour();
        }
    },
    addDays: function(days) {
        for (var i = 0; i < days; i++) {
            this._incrementDay();
        }
    },
    addMonths: function(months) {
        for (var i = 0; i < months; i++) {
            this._incrementMonth();
        }
        if (this.day > this.getDaysInMonth()) {
            this.day = this.getDaysInMonth();
        }
    },
    addYears: function(years) {
        this.year += years;
    },
    subtractSeconds: function(seconds) {
        for (var i = 0; i < seconds; i++) {
            this._decrementSecond();
        }
    },
    subtractMinutes: function(minutes) {
        for (var i = 0; i < minutes; i++) {
            this._decrementMinute();
        }
    },
    subtractHours: function(hours) {
        for (var i = 0; i < hours; i++) {
            this._decrementHour();
        }
    },
    subtractDays: function(days) {
        for (var i = 0; i < days; i++) {
            this._decrementDay();
        }
    },
    subtractMonths: function(months) {
        for (var i = 0; i < months; i++) {
            this._decrementMonth();
        }
        if (this.day > this.getDaysInMonth()) {
            this.day = this.getDaysInMonth();
        }
    },
    subtractYears: function(years) {
        this.year -= years;
    },
    _incrementSecond: function() {
        this.second++;
        if (this.second > 59) {
            this.second = 0;
            this._incrementMinute();
        }
    },
    _incrementMinute: function() {
        this.minute++;
        if (this.minute > 59) {
            this.minute = 0;
            this._incrementHour();
        }
    },
    _incrementHour: function() {
        this.hour++;
        if (this.hour > 23) {
            this.hour = 0;
            this._incrementDay();
        }
    },
    _incrementDay: function() {
        this.day++;
        if (this.day > this.getDaysInMonth()) {
            this.day = 1;
            this._incrementMonth();
        }
    },
    _incrementMonth: function() {
        this.month++;
        if (this.month >= 12) {
            this.year++;
            this.month = 0;
        }
    },
    _decrementSecond: function() {
        this.second--;
        if (this.second < 0) {
            this.second = 59;
            this._decrementMinute();
        }
    },
    _decrementMinute: function() {
        this.minute--;
        if (this.minute < 0) {
            this.minute = 59;
            this._decrementHour();
        }
    },
    _decrementHour: function() {
        this.hour--;
        if (this.hour < 0) {
            this.hour = 23;
            this._decrementDay();
        }
    },
    _decrementDay: function() {
        this.day--;
        if (this.day == 0) {
            this._decrementMonth();
            this.day = this.getDaysInMonth();
        }
    },
    _decrementMonth: function() {
        this.month--;
        if (this.month < 0) {
            this.year--;
            this.month = 11;
        }
    },
    /**
* Set the current date/time from the server in the session's current timezone
*/
    now: function() {
        var parms = "&sysparm_type=now";
        var response = serverRequestWait(this.AJAX_PROCESSOR + parms);
        var xml = response.responseXML;
        var e = xml.documentElement;
        this.clear();
        this.deserialize(e.getAttribute("now"));
        return this;
    },
    /**
* Get the session's current timezone
*/
    getCurrentTimeZone: function() {
        var parms = "&sysparm_type=now";
        var response = serverRequestWait(this.AJAX_PROCESSOR + parms);
        var xml = response.responseXML;
        var e = xml.documentElement;
        return e.getAttribute("time_zone");
    },
    /**
* Get the day of the week (based on the session's timezone) for the date
* Sun = 0, Mon = 1, etc.
*/
    getDayOfWeek: function() {
        var parms = "&sysparm_type=day_of_week&date=" + this.serialize(true);
        var response = serverRequestWait(this.AJAX_PROCESSOR + parms);
        var xml = response.responseXML;
        var e = xml.documentElement;
        return e.getAttribute("day_of_week");
    },
    getCurrentMonth: function() {
        return this.MONTHS_IN_YEAR[this.getMonth()];
    },
    /**
* Get the week number (based on the session's timezone) for the date
*/
    getWeekNumber: function() {
        var parms = "&sysparm_type=week_number&date=" + this.serialize(true);
        var response = serverRequestWait(this.AJAX_PROCESSOR + parms);
        var xml = response.responseXML;
        var e = xml.documentElement;
        return e.getAttribute("week_number");
    },
    toString: function() {
        return this.formatDate('yyyy-MM-dd HH:mm:ss');
    }
});
/**
* Mobile Date Time Picker.
*
* Note this is extends the desktop browser version.
*
*/
var GwtMobileDateTimePicker = Class.create(GwtDateTimePicker, {
    BUTTON_MSGS : ["OK", "Cancel"],
    _getMessages:function() {
        var msg_text = this.MSGS.concat(this.MONTH_NAMES).concat(this.BUTTON_MSGS);
        this.msgs = new GwtMessage().getMessages(msg_text);
    },
    _createOkCancel: function() {
        var trButtons = cel("tr", this.tbody);
        var tdButtons = cel("td", trButtons);
        tdButtons.colSpan = 9;
        tdButtons.className = "calActionButtonRow";
        if (this.includeTime) {
            var okButton = cel("input", tdButtons);
            okButton.className = "action_button_" + g_mobile_device_type + " calButton";
            okButton.type = "button";
            okButton.value = this.msgs["OK"];
            okButton.onclick = this.save.bind(this);
            this.cleanup.push(okButton);
        }
        var cancelButton = cel("input", tdButtons);
        cancelButton.className = "action_button_" + g_mobile_device_type + " calButton";
        cancelButton.type = "button";
        cancelButton.value = this.msgs["Cancel"];
        cancelButton.onclick = this.dismiss.bind(this);
        this.cleanup.push(cancelButton);
    },
    _registerDayClick: function(a) {
        a.picker = this;
        a.onclick = this._selectDay.bindAsEventListener(a);
    },
    _deregisterDayClick: function(a) {
        GwtDateTimePicker.prototype._deregisterDayClick.call(this, a);
        a.picker = null;
    },
    _moveToPosition: function(positionElement) {
        this.offsetLeft = getOffset(positionElement, "offsetLeft");
        this.offsetTop = getOffset(positionElement, "offsetTop");
        this.container.style.top = this.offsetTop + positionElement.offsetHeight + 1;
        var left = this.offsetLeft; // even with field start since we don't have a lot of room
        this.container.style.left = left;
    },
    focusEditor: function(id) {
        if (!this.canFocus)
            return;
        var e = gel("GwtDateTimePicker_month");
        if (e.scrollIntoView)
            e.scrollIntoView(true);
        return;
    },
    _selectDay: function(e) {
        var e = getEvent(e);
        Event.stop(e);
        var anchor = this; // "this" is the anchor.
        var picker = this.picker; // the GwtDateTimePicker object
        picker.selectedDate.setDate(1);
        picker.selectedDate.setFullYear(anchor.year);
        picker.selectedDate.setMonth(anchor.month);
        picker.selectedDate.setDate(anchor.day);
        picker.date = new Date(picker.selectedDate);
        if (!picker.includeTime)
            picker.save();
        else
            picker._showMonth();
    },
    type: function() {
        return "GwtMobileDateTimePicker";
    }
});
var GwtTable = Class.create({
    initialize: function(parent) {
        this.type        = 'GwtTable';
        this.name        = 'GwtTable';
        this.dragger = null;
        this.htmlElement = cel("TABLE");
        this.body = cel("TBODY", this.htmlElement);
        this.row = null;
        if (parent)
            parent.appendChild(this.htmlElement);
    },
    addRow: function() {
        this.row = cel("TR", this.body);
        for(var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            var td = cel("TD", this.row);
            td.innerHTML = t;
        }
    },
    addRowWithClassName: function() {
        this.row = cel("TR", this.body);
        for(var i = 1; i < arguments.length; i++) {
            var t = arguments[i];
            var td = cel("TD", this.row);
            td.className = arguments[0];
            td.innerHTML = t;
        }
    },
    addTD: function(element) {
        var td = cel("TD", this.row);
        td.appendChild(element);
    }
});
var GwtListEditWindow = Class.create(GlideWindow, {
    MESSAGES: [
    "1 row will be updated",
    " rows will be updated",
    "1 row will not be updated",
    " rows will not be updated"
    ],
    initialize: function(editor) {
        this.glideWindowId = "cell_edit_window";
        GlideWindow.prototype.initialize.call(this, this.glideWindowId, true);
        this.refName = editor.name;
        this.tableElement = editor.tableElement;
        this.cell = editor.element;
        this._getMessages();
        this.inputID = 'cell_edit_value';
        this.state = 'initialize';
        this.removeBody();
        this.clearSpacing();
        this.createOkCancel();
        this.setPreferredWidth();
        this.setEditor(editor);
        this.destroyed = false;
        Event.observe(window, "resize", this._onResize.bind(this));
        Event.observe(this.window, "keyup",  this.onKeyUp.bind(this));
        this.currWidth = document.body.clientWidth;
        this.showUpdateMessage();
    },
    setEditor: function(editor) {
        this.editor = editor;
        this._createControls();
    },
    showUpdateMessage: function() {
        this.getCountCellsSelected();
        var numSelected = this.numCanEdit + this.numCannotEdit;
        if (numSelected <= 1)
            return;
        var div = cel("div");
        div.style.marginTop = 2;
        div.style.fontWeight = "normal";
        var msgStr;
        if (this.numCanEdit == 1)
            msgStr = this.msgRowUpdated;
        else
            msgStr = this.numCanEdit + this.msgRowsUpdated;
        if (this.numCannotEdit > 0) {
            msgStr = msgStr + "<br/>";
            if (this.numCannotEdit == 1)
                msgStr += this.msgRowNotUpdated;
            else
                msgStr += this.numCannotEdit + this.msgRowsNotUpdated;
        }
        div.innerHTML = msgStr;
        gel(this.glideWindowId + "_header").appendChild(div);
    },
    truncateDisplayValue: function(dispValue) {
        var displayChars = new Number(this.editor.tableElement.getDisplayChars());
        if (!isNaN(displayChars) && (displayChars != -1)) {
            if (dispValue.length > displayChars)
                dispValue = dispValue.substring(0, displayChars) + "...";
        }
        return dispValue;
    },
    getCountCellsSelected: function() {
        this.numCanEdit = 0;
        this.numCannotEdit = 0;
        var ids = this.editor.getCanWriteIds();
        this.numCanEdit = ids.length;
        this.numCannotEdit = this.editor.getSysIds().length - ids.length;
    },
    getSelectedCells: function() {
        return this.selectedCells;
    },
    _createControls: function() {
        var parent = getFormContentParent();
        this.insert(parent, null, true); // draw invisible
        var ret = this.createEditControls();
        if (!(ret === false))
            this.createEditControlsComplete();
    },
    createEditControls: function () {
        this.setTitle("unimplemented abstract function createEditControls");
    },
    createEditControlsComplete: function() {
        if (this.state != 'initialize')
            return;
        this.editor.hideLoading();
        this.moveToCell();
        this.visible();
        setTimeout(this.focusEditor.bind(this), 10);
        this.state = 'complete';
    },
    createTextInput: function() {
        var answer = cel('input');
        answer.id = 'cell_edit_value';
        answer.style.width = this.preferredWidth;
        this.focusElement = answer;
        return answer;
    },
    getText: function(t) {
        if (!t)
            return;
        if (t.innerText)
            return t.innerText;
        else
            return t.textContent;
    },
    moveToCell: function() {
        this.offsetLeft = getOffset(this.cell, "offsetLeft");
        this.offsetTop = getOffset(this.cell, "offsetTop");
        var docScrollWidth = document.body.scrollWidth;
        if (this.cell.nextSibling == null || this.getWidth() + this.offsetLeft > docScrollWidth) {
            var width = this.getWidth() + 2;
            if (width == null)
                return;
            if (width > this.cell.clientWidth)
                this.offsetLeft = this.offsetLeft + this.cell.clientWidth - width;
        }
        if (!this.container)
            return;
        this.container.style.top = this.offsetTop;
        this.container.style.left = this.offsetLeft;
    },
    createOkCancel: function () {
        b = createImage('images/workflow_approval_rejected.gif', "Cancel (ESC)", this, this.dismiss);
        b.id = 'cell_edit_cancel';
        this.addDecoration(b);
        var b = createImage('images/workflow_approved.gifx', "Save (Enter)", this, this.saveAndClose);
        b.id = 'cell_edit_ok';
        this.addDecoration(b);
    },
    saveAndClose: function () {
        if (this.destroyed)
            return false;
        if (this.state != 'complete') {
            this.dismiss();
            return;
        }
        this.state = 'saving';
        this.save();
        this.dismiss();
        if (this.editor)
            this.editor.saveValues();
        return;
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input) {
            this.setValue(input.value);
        }
    },
    setValue: function(value, displayValue) {
        if (!displayValue)
            displayValue = '';
        if (this.editor)
            this.editor.setValue(value, displayValue);
    },
    setRenderValue: function(value) {
        if (!value)
            value = '';
        if (this.editor)
            this.editor.setRenderValue(value);
    },
    focusEditor: function() {
        if (this.focusElement)
            Field.activate(this.focusElement);
    },
    onKeyUp: function(e) {
        e = getEvent(e);
        if (e.keyCode == 27)
            this.dismiss();
        else if (e.keyCode == 13)
            this.saveAndClose();
    },
    dismiss: function() {
        if (this.destroyed)
            return false;
        this.destroyed = true;
        try {
            this.destroy();
        } catch(e) {}
        this.state = 'destroyed';
        return false;
    },
    setPreferredWidth: function() {
        this.preferredWidth = this.cell.clientWidth;
        if (this.preferredWidth > 400)
            this.preferredWidth = 400;
        if (this.preferredWidth < 150)
            this.preferredWidth = 150;
        this.setWidth(10);
    },
    setCellSelection: function() {
        this.updateRows = new Array();
        this.selectedCells = this.editor.getSelectedCells();
        if (this.selectedCells != null) {
            for (var key in this.selectedCells) {
                var coords = key.split(",");
                var col = coords[0];
                var row = coords[1];
                this.updateRows.push(row);
            }
        }
    },
    clearCellSelection: function() {
        this.updateRows = new Array();
        this.editor.cellSelection = new Object();
    },
    _onResize: function(e) {
        if (this.destroyed)
            return;
        setTimeout(this.moveToCell.bind(this), 0);
    },
    _getMessages: function() {
        var gMessage = new GwtMessage();
        var map = gMessage.getMessages(this.MESSAGES);
        this.msgRowUpdated = map[this.MESSAGES[0]];
        this.msgRowsUpdated = map[this.MESSAGES[1]];
        this.msgRowNotUpdated = map[this.MESSAGES[2]];
        this.msgRowsNotUpdated = map[this.MESSAGES[3]];
    },
    type: function() {
        return "GwtListEditWindow";
    }
});
var GwtListEditText = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var input = this.createTextInput();
        input.value = this.editor.getValue();
        if (this.editor.tableElement.maxLength > 0)
            input.setAttribute("maxLength", this.editor.tableElement.maxLength);
        var answer = this.editor.getValue();
        if (this.tableElement.isNumber()) {
            input.value = this.editor.getDisplayValue();
            input.className = "decimal";
            answer = this.editor.getDisplayValue();
        }
        this.setTitle(input);
        answer = answer.replace(/\n/g, " ");
        answer = answer.replace(/\t/g, "");
        this.focusElement.value = answer;
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input) {
            if (this.tableElement.isNumber())
                this.setValue(null, input.value);
            else {
                this.setValue(input.value);
            }
            this.setRenderValue(this.truncateDisplayValue(input.value));
        }
    },
    type: function() {
        return "GwtListEditText";
    }
});
var GwtListEditSelect = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var select = "<select id='cell_edit_value' />";
        this.setTitle(select);
        this.focusElement = gel('cell_edit_value');
        this.addOptions();
        if (!this.staticOptions)
            return false;
    },
    addOptions: function() {
        var rowSysId = this.cell.parentNode.id;
        var ajax = new GlideAjax('PickList');
        ajax.addParam('sys_uniqueValue', rowSysId);
        ajax.addParam('sysparm_target', this.tableElement.getTable().getName());
        ajax.addParam('sysparm_chars', '*');
        ajax.addParam('sysparm_name', this.refName);
        ajax.addParam('sysparm_nomax', "true");
        ajax.getXML(this._createOptions.bind(this));
    },
    _createOptions: function(response) {
        if (this.state != 'initialize')
            return;
        var xml = response.responseXML;
        var items = xml.getElementsByTagName("item");
        var value = this.editor.getValue();
        this.focusElement.options.length = 0;
        if (this.tableElement.choice != "3") {
            this.nullOverride = xml.documentElement.getAttribute("default_option");
            if (this.nullOverride)
                addOption(this.focusElement, "", this.nullOverride, this._isSelected(value, "", this.nullOverride));
            else
                addOption(this.focusElement, "", new GwtMessage().getMessage('-- None --'), true);
        }
        for (var i = 0; i < items.length; i++) {
            var v = items[i].getAttribute("value");
            var l = items[i].getAttribute("label");
            addOption(this.focusElement, v, l, this._isSelected(value, v, l));
        }
        GwtListEditWindow.prototype.createEditControlsComplete.call(this);
    },
    _isSelected: function(value, v, l) {
        if (l == value || v ==value)
            return true;
        else
            return false;
    },
    save: function() {
        var select = this.focusElement;
        var i = select.selectedIndex;
        var option = select.options[i];
        this.setValue(option.value);
        var text = option.text;
        if (!option.value)
            text = '';
        this.setRenderValue(text);
    },
    type: function() {
        return "GwtListEditSelect";
    }
});
var GwtListEditCalendar = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var html = this.createCalendarHTML();
        this.setTitle(html);
    },
    save: function() {
        var input = gel('cell_edit_value');
        this.setValue(null, input.value);
        this.setRenderValue(input.value);
    },
    dismiss: function() {
        this._dismissCalendar();
        if (this.inputID) {
            var input = gel(this.inputID);
            if (input)
                input.onfocus = null;
        }
        GwtListEditWindow.prototype.dismiss.call(this);
    },
    _dismissCalendar: function() {
        if (gel("GwtDateTimePicker") && this.cal)
            this.cal.dismiss();
        this.cal = null;
    },
    createCalendarHTML: function () {
        var answer = cel('span');
        var input = this.createTextInput();
        input.value = this.editor.getDisplayValue();
        answer.appendChild(input);
        input.onfocus = this.onFocus.bind(this);
        var img = createImage("images/small_calendar.gifx", new GwtMessage().getMessage("Choose date..."), this, this.showCalendar.bind(this));
        img.id = this.type();
        img.style.marginLeft = "4px";
        answer.appendChild(img);
        return answer;
    },
    onFocus: function() {
        var input = gel(this.inputID);
        if (input)
            input.onfocus = null;
        this.showCalendar();
    },
    showCalendar: function() {
        if (gel("GwtDateTimePicker"))
            return;
        var format;
        if (this.tableElement.isDateTime())
            format = g_user_date_time_format;
        else
            format = g_user_date_format;
        this.cal = new GwtDateTimePicker(this.inputID, format, false);
        return false;
    },
    type: function() {
        return "GwtListEditCalendar";
    }
});
var GwtListEditReference = Class.create(GwtListEditWindow, {
    createEditControls: function() {
        this.id = this.refName;
        this.createInputControls(this.getTitle());
    },
    createInputControls: function(parent) {
        var refSysId = this.editor.getValue();
        var rowSysId = this.cell.parentNode.id;
        this.inputControls = new AJAXReferenceControls(this.tableElement, this.id, parent, refSysId, rowSysId, this._getRefQualTag());
        this.inputControls.setDisplayValue(this._getDisplayValue());
        this.focusElement = this.inputControls.getInput();
        this.focusElement.style.width = this.preferredWidth;
        this.inputControls.setRecord(this.editor);
    },
    saveAndClose: function () {
        this.inputControls.resolveReference();
        if (this.inputControls.isResolving())
            this.inputControls.setResolveCallback(this._saveAndClose.bind(this));
        else
            this._saveAndClose();
    },
    _saveAndClose: function() {
        GwtListEditWindow.prototype.saveAndClose.call(this);
    },
    save: function() {
        var sys_id = this.inputControls.getValue();
        if (!sys_id)
            sys_id = "NULL";
        if (sys_id == "1111")
            sys_id = "NULL";
        var displayValue = this.inputControls.getDisplayValue();
        if (!displayValue)
            sys_id = "NULL";
        if (sys_id == "NULL")
            displayValue = '';
        this.setValue(sys_id);
        this.setRenderValue(displayValue);
    },
    dismiss: function() {
        if (this.destroyed || !this.inputControls)
            return false;
        this.inputControls.clearDropDown();
        GwtListEditWindow.prototype.dismiss.call(this);
    },
    _getRefQualTag: function() {
        var tag;
        var table = findParentByTag(this.cell, "TABLE");
        if (table) {
            tag = getAttributeValue(table, 'glide_list_edit_ref_qual_tag');
            if (tag)
                return tag;
        }
        tag = "";
        var form = findParentByTag(this.cell, "FORM")
        if (form) {
            var tag = form['sysparm_list_edit_ref_qual_tag'];
            if (tag)
                tag = tag.value;
        }
        return tag;
    },
    _getDisplayValue: function() {
        if (this.editor.getValue() == "NULL")
            return "";
        return this.editor.getRenderValue() || this.editor.getDisplayValue();
    },
    type: function() {
        return "GwtListEditReference";
    }
});
var GwtListEditBoolean = Class.create(GwtListEditSelect, {
    addOptions: function() {
        this.staticOptions = true;
        var select = this.focusElement;
        var value = this.editor.getValue();
        addOption(select, true, "true", value == "true");
        addOption(select, false, "false", value != "true");
    },
    type: function() {
        return "GwtListEditBoolean";
    }
});
var GwtListEditDuration = Class.create(GwtListEditWindow, {
    MS_IN_DAY: 86400000,
    createEditControls: function () {
        this.setDateParts(this.editor.getValue());
        this.gMessage = new GwtMessage();
        this.gMessage.getMessages(['Hours', 'Days', 'day', 'hour', 'minute', 'second', 'minutes', 'seconds']);  // get the translations into the cache
        this.renderControl();
    },
    setDateParts: function(dateStr) {
        if (dateStr.length <= 0) {
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        }
        else {
            var dateTime = dateStr.split(" ");
            var dateParts = dateTime[0].split("-");
            var timeParts = dateTime[1].split(":");
            this.days = parseInt(Date.parse(dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0]) / this.MS_IN_DAY);
            this.hours = timeParts[0];
            this.minutes = timeParts[1];
            this.seconds = timeParts[2];
        }
    },
    renderControl: function() {
        var table = cel("table");
        table.cellPadding = 0;
        table.style.backgroundColor = "EEEEEE";
        var tbody = cel("tbody", table);
        var tr = cel("tr", tbody);
        var td = cel("td", tr);
        td.innerHTML = this.gMessage.getMessage("Days") + "&nbsp;";
        td = cel("td", tr);
        var days = cel("input", td);
        days.id = "dur_day";
        days.size = "2";
        days.maxLength = "5";
        days.style.marginRight = "5px";
        days.value = this.days
        td = cel("td", tr);
        td.innerHTML = this.gMessage.getMessage("Hours") + "&nbsp;";
        td = cel("td", tr);
        var hours = cel("input", td);
        hours.id = "dur_hour";
        hours.size = "2";
        hours.maxLength = "2";
        hours.value = this.hours;
        td = cel("td", tr);
        td.innerHTML = ":";
        td = cel("td", tr);
        var mins = cel("input", td);
        mins.id = "dur_min";
        mins.size = "2";
        mins.maxLength = "2";
        mins.value = this.minutes;
        td = cel("td", tr);
        td.innerHTML = ":";
        td = cel("td", tr);
        var secs = cel("input", td);
        secs.id = "dur_sec";
        secs.size = "2";
        secs.maxLength = "2";
        secs.value = this.seconds;
        this.setTitle(table);
        this.focusElement = gel("dur_day");
    },
    save: function() {
        var day = gel("dur_day").value;
        var hour = gel("dur_hour").value;
        var min = gel("dur_min").value;
        var sec = gel("dur_sec").value;
        if (!day || day == null || !isNumber(day))
            day = 0;
        if (!hour || hour == null || !isNumber(hour))
            hour = 0;
        if (!min || min == null || !isNumber(min))
            min = 0;
        if (!sec || sec == null || !isNumber(sec))
            sec = 0;
        day = parseInt(day, 10);
        hour = parseInt(hour, 10);
        min = parseInt(min, 10);
        sec = parseInt(sec, 10);
        var dt = new Date(0);
        dt.setUTCDate(day + 1);
        var dateStr = dt.getUTCFullYear() + "-" + padLeft(dt.getUTCMonth() + 1, 2, '0') + "-" + padLeft(dt.getUTCDate(), 2, '0')  + " " +
        padLeft(hour, 2, '0') + ":" + padLeft(min, 2, '0') + ":" + padLeft(sec, 2, '0');
        this.setValue(dateStr);
        this._setRenderValue(day, hour, min, sec);
    },
    _setRenderValue: function(day, hour, min, sec) {
        var dspVal = "";
        if (day > 0)
            dspVal += day + " " + this._getLabel("day", day) + " ";
        if (hour > 0)
            dspVal += hour + " " + this._getLabel("hour", hour) + " ";
        if (min > 0)
            dspVal += min + " " + this._getLabel("minute", min) + " ";
        if (dspVal == "")
            dspVal += sec + " " + this._getLabel("second", sec) + " ";
        this.setRenderValue(dspVal);
    },
    _getLabel: function(label, val) {
        if (val != 1)
            label += "s";
        return this.gMessage.getMessage(label).toLowerCase();
    },
    type: function() {
        return "GwtListEditDuration";
    },
    z: null
});
var GwtListEditTablename = Class.create(GwtListEditSelect, {
    addOptions: function() {
        var ga = new GlideAjax('AjaxClientHelper');
        ga.addParam('sysparm_name','generateChoiceTable');
        ga.getXML(this._createOptions.bind(this));
    },
    type: function() {
        return "GwtListEditTablename";
    }
});
var GwtListEditDependent = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        this.preferredWidth = 0;
        this.controlsCount = 0;
        this._renderContainer();
        this._renderControls();
        return false;
    },
    _renderControls: function() {
        var fields = this.editor.getFields();
        for (var i = 0; i < fields.length; i++) {
            var tableElement = TableElement.get(this.editor.table + '.' + fields[i]);
            if (!tableElement || !tableElement.isChoice())
                continue;
            this._renderControl(tableElement, fields[i]);
        }
    },
    _resizeControls: function() {
        var editControls = gel("editControls");
        if (editControls) {
            var choiceLists = editControls.getElementsByTagName("select");
            for (var i = 0; i < choiceLists.length; i++) {
                if (choiceLists[i].clientWidth > this.preferredWidth)
                    this.preferredWidth = choiceLists[i].clientWidth;
            }
            for (var i = 0; i < choiceLists.length; i++) {
                choiceLists[i].style.width = this.preferredWidth + 'px';
            }
        }
    },
    _renderContainer: function() {
        var table = cel("table");
        table.cellPadding = 2;
        table.style.backgroundColor = "EEEEEE";
        var tbody = cel("tbody", table);
        tbody.id = "editControls";
        this.setTitle(table);
    },
    _renderControl: function(tableElement, fieldName) {
        this.refName = this.editor.table + "." + fieldName;
        var id = "LIST_EDIT_" + this.refName;
        if (gel(id))
            return;
        var tbody = gel("editControls");
        var tr = cel("tr", tbody);
        var td = cel("td", tr);
        td.id = "container_" + this.refName;
        td.innerHTML = tableElement.label + ":<br>";
        this.focusElement = cel("select");
        this.focusElement.id = id;
        this.focusElement.name = this.refName;
        this.focusElement.setAttribute("dbVal", this.editor.getValue(fieldName));
        this.focusElement.onchange = this._handleOnChange.bindAsEventListener(this);
        td.appendChild(this.focusElement)
        this.controlsCount++;
        var dependent = tableElement.getDependent();
        var depVal = '';
        if (dependent)
            depVal = this.editor.getValue(this._getTargetName(fieldName, dependent));
        this._addOptions(this.focusElement, depVal);
    },
    _handleOnChange: function(e) {
        var parent = Event.element(e);
        var tableElement = TableElement.get(parent.name);
        var children = tableElement.getDependentChildren();
        for (var k in children) {
            var focusElement = gel("LIST_EDIT_" + this._getTargetName(parent.name, k));
            if (!focusElement)
                return;
            focusElement.setAttribute("dbVal", "");
            this._addOptions(focusElement, parent.options[parent.options.selectedIndex].value);
        }
    },
    _getTargetName: function(base, field) {
        var parts = base.split(".");
        parts[parts.length-1] = field;
        return  parts.join(".");
    },
    _addOptions: function(element, depValue) {
        var ajax = new GlideAjax('PickList');
        ajax.addParam('sysparm_chars', '*');
        ajax.addParam('sysparm_name', element.name);
        if (depValue)
            ajax.addParam('sysparm_value', depValue);
        ajax.addParam('sysparm_nomax', 'true');
        ajax.getXML(this._createOptions.bind(this, element));
    },
    _createOptions: function(element, response) {
        element.options.length = 0;
        element.style.width = '';
        var xml = response.responseXML;
        var items = xml.getElementsByTagName("item");
        var value = element.getAttribute("dbVal");
        var nullOverride = xml.documentElement.getAttribute("default_option");
        if (nullOverride != null && nullOverride.length > 0) {
            addOption(element, "", nullOverride, true);
        } else {
            var msg = new GwtMessage().getMessage("-- None --");
            addOption(element, "", msg, true);
        }
        for (var i = 0; i < items.length; i++) {
            var v = items[i].getAttribute("value");
            var l = items[i].getAttribute("label");
            addOption(element, v, l, (v == value));
        }
        if (this.controlsCount > 0)
            this.controlsCount--;
        if (this.controlsCount == 0) {
            setTimeout(this._resizeControls.bind(this), 0); //defer resizing controls for IE6
            GwtListEditWindow.prototype.createEditControlsComplete.call(this);
        }
    },
    save: function() {
        var tbody = gel("editControls");
        var choiceLists = tbody.getElementsByTagName("select");
        if (choiceLists) {
            for (var i = 0; i < choiceLists.length; i++) {
                var element = choiceLists[i];
                var option = element.options[element.selectedIndex];
                var fName = element.name.substring(this.editor.table.length + 1);
                this.editor.setFieldValue(fName, option.value);
                var dspValue;
                if (!option.value)
                    dspValue = '';
                else
                    dspValue = option.text;
                this.editor.setFieldRenderValue(fName, dspValue);
            }
        }
    },
    type: function() {
        return "GwtListEditDependent";
    }
});
var GwtListEditMultiText = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var input = this.createTextAreaInput();
        this.setTitle(input);
    },
    onKeyUp: function (me, e) {
    },
    createTextAreaInput: function() {
        var answer = cel("textarea");
        answer.value = this.editor.getDisplayValue();
        answer.rows = 4;
        answer.id = 'cell_edit_value';
        answer.style.width = this.preferredWidth;
        answer.style.overflow = "auto";
        this.focusElement = answer;
        return answer;
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input) {
            this.setValue(null, input.value);
            this.setRenderValue(this.truncateDisplayValue(input.value));
        }
    },
    type: function() {
        return "GwtListEditMultiText";
    }
});
var GwtListEditJournal = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var input = this.createTextAreaInput();
        this.setTitle(input);
    },
    onKeyUp: function (me, e) {
    },
    createTextAreaInput: function() {
        var answer = cel("textarea");
        answer.value = "";
        answer.rows = 3;
        answer.id = 'cell_edit_value';
        answer.style.width = this.preferredWidth;
        answer.style.overflow = "auto";
        this.focusElement = answer;
        return answer;
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input)
            this.setValue(null, input.value);
    },
    type: function() {
        return "GwtListEditJournal";
    }
});
var GwtListEditInternalType = Class.create(GwtListEditSelect, {
    addOptions: function() {
        var ga = new GlideAjax('AjaxClientHelper');
        ga.addParam('sysparm_name','generateChoice');
        ga.getXML(this._createOptions.bind(this));
    },
    type: function() {
        return "GwtListEditInternalType";
    }
});
var GwtListEditEncryptedText = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var input = this.createTextAreaInput();
        this.setTitle(input);
    },
    onKeyUp: function (me, e) {
    },
    createTextAreaInput: function() {
        var answer = cel("textarea");
        answer.value = this.editor.getDisplayValue();
        answer.rows = 4;
        answer.id = 'cell_edit_value';
        answer.style.width = this.preferredWidth;
        answer.style.overflow = "auto";
        this.focusElement = answer;
        return answer;
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input) {
            this.setValue(null, input.value);
            this.setRenderValue(this.truncateDisplayValue(input.value));
        }
    },
    type: function() {
        return "GwtListEditEncryptedText";
    }
});
var GwtListEditTranslatedField = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var input = this.createTextInput();
        input.value = this.editor.getDisplayValue();
        this.setTitle(input);
        if (this.editor.tableElement.maxLength > 0)
            input.setAttribute("maxLength", this.editor.tableElement.maxLength);
        var answer = input.value.replace(/\n/g, " ");
        answer = answer.replace(/\t/g, "");
        this.focusElement.value = answer;
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input) {
            this.setValue(null, input.value);
            this.setRenderValue(this.truncateDisplayValue(input.value));
        }
    },
    type: function() {
        return "GwtListEditTranslatedField";
    }
});
var GwtListEditPassword = Class.create(GwtListEditWindow, {
    createEditControls: function () {
        var input = this.createTextInput();
        input.type = "password";
        this.setTitle(input);
    },
    save: function() {
        var input = gel('cell_edit_value');
        if (input) {
            this.setValue(null, input.value);
        }
    },
    type: function() {
        return "GwtListEditPassword";
    }
});
var GwtListEditError = Class.create(GwtListEditWindow, {
    showUpdateMessage: function() {
        return;
    },
    createEditControls: function () {
        this.clearCellSelection();
        this.editor.saveAndClose = this.save.bind(this);
        var input = this.createTextInput();
        input.value = this.editor.errorMsg;
        input.style.backgroundColor = "LightGrey";
        input.style.width = input.value.length*7;
        input.readOnly = true;
        this.setTitle(input);
        var e = gel('cell_edit_ok');
        if (e)
            e.parentNode.removeChild(e);
        this.moveToCell();
    },
    focusEditor: function () {
        this.focusElement.focus();
    },
    save: function() {
        rel("cell_edit_window");
    },
    type: function() {
        return "GwtListEditError";
    },
    z: null
});
/**
* Manage editing of a cell on a list
*
* To change the save behavior of the cell editor, derive from this class and override;
*
*     _saveValues
*    _beforeSetValue
*    _afterSetValue
*/
var GwtCellEditor = Class.create();
GwtCellEditor.prototype = {
    REF_ELEMENT_PREFIX: 'ref_',
    PROCESSOR: 'com.glide.ui_list_edit.AJAXListEdit',
    WAIT_INITIAL_DELAY : 300,
    WAITING_IMAGE : 'images/loading_anim3.gifx',
    IGNORE_MSG : "This element type is not editable from the list.",
    ignoreTypes : [],
    initialize: function(element, ignoreTypes) {
        this._initElement(element);
        if (this._isDeletedRow(this.sysId))
            return;
        this.ignoreTypes = ignoreTypes;
        this.timer = setTimeout(this.showLoading.bind(this), this.WAIT_INITIAL_DELAY);
        this.valid = true;
        this.savingImages = [];
        this.errorMsg = this._checkIgnoreTypes();
        if (this.errorMsg) {
            this.renderErrorEditor();
            return;
        }
        if (this._checkMultipleDerivedOrExtended()) {
            this.renderErrorEditor();
            return;
        }
        this._getValues();
    },
    dismiss: function() {
        this.valid = false;
        this.hideLoading();
        if (this.editWindow)
            this.editWindow.dismiss();
    },
    saveAndClose: function () {
        this.valid = false;
        this.hideLoading();
        if (this.editWindow)
            this.editWindow.saveAndClose()
    },
    saveValues: function() {
        this._saveValues();
        this.cs.resetCellSelection();
    },
    getSysIds: function() {
        return this.sysIds;
    },
    getFields: function() {
        return this.fields;
    },
    getSecurityFields: function() {
        if (this.tableElement.isReference()) {
            var answer = [];
            answer.push(this.fieldName);
            return answer;
        }
        return this.fields;
    },
    getValue: function(field) {
        if (!field)
            field = this.fieldName;
        return this.glideList.getValue(this.sysId, field);
    },
    getDisplayValue: function(field) {
        if (!field)
            field = this.fieldName;
        return this.glideList.getDisplayValue(this.sysId, field);
    },
    getRenderValue: function(field) {
        if (!field)
            field = this.fieldName;
        return this.glideList.getRenderValue(this.sysId, field);
    },
    getCanWriteIds: function() {
        if (!this.canWriteIds) {
            this.canWriteIds = [];
            for (var i = 0; i < this.sysIds.length; i++) {
                if (this.glideList.checkSecurity(this.sysIds[i], this.getSecurityFields()))
                    this.canWriteIds.push(this.sysIds[i]);
            }
        }
        return this.canWriteIds;
    },
    getCell: function(sysId, fieldName) {
        return this.glideList.getCell(sysId, fieldName);
    },
    setValue: function(value, displayValue) {
        this.setFieldValue(this.fieldName, value, displayValue);
    },
    setFieldValue: function(name, value, displayValue) {
        var ids = this.getCanWriteIds();
        for (var i = 0; i < ids.length; i++) {
            this._beforeSetValue(ids[i], name, value, displayValue);
            if (value == null)
                this.glideList.setDisplayValue(ids[i], name, displayValue);
            else
                this.glideList.setValue(ids[i], name, value);
            this._afterSetValue(ids[i], name);
        }
    },
    setRenderValue: function(value, displayValue) {
        this.setFieldRenderValue(this.fieldName, value, displayValue);
    },
    setFieldRenderValue: function(name, value) {
        var ids = this.getCanWriteIds();
        for (var i = 0; i < ids.length; i++) {
            this.glideList.setRenderValue(ids[i], name, value);
            this.glideList.renderValue(ids[i], name);
        }
    },
    renderEditor: function() {
        if (!this.valid)
            return;
        if (this.glideList.getError())
            this.errorMsg = this.glideList.getError();
        else
            this._checkSecurity();
        if (this.errorMsg)
            this.editWindow = new GwtListEditError(this);
        else
            this._getEditor();
    },
    renderErrorEditor: function() {
        this.editWindow = new GwtListEditError(this);
        this.editWindow.moveToCell();
        this.hideLoading();
    },
    setErrorMsg: function(msg) {
        this.errorMsg = msg;
    },
    _checkIgnoreTypes: function() {
        var type = this.tableElement.getType();
        for (var i = 0; i < this.ignoreTypes.length; i++) {
            if (type == this.ignoreTypes[i])
                return new GwtMessage().getMessage(this.IGNORE_MSG);
        }
        if (this.tableElement.isArray())
            return new GwtMessage().getMessage(this.IGNORE_MSG);
        return null;
    },
    _checkSecurity: function() {
        var canWriteIds = this.getCanWriteIds();
        if (canWriteIds.length == 0) {
            if (this.sysIds.length == 1) {
                var field = this.glideList._getField(this.sysIds[0], this.fields[0]);
                if (!field.isOKExtension()) {
                    this.setErrorMsg(new GwtMessage().getMessage("Field does not exist for this record"));
                    return;
                }
            }
            this.setErrorMsg(new GwtMessage().getMessage("Security prevents writing to this field"));
        }
    },
    _checkMultipleDerivedOrExtended: function() {
        var parts = this.name.split('.');
        if ((this.sysIds.length > 1) && (parts.length > 2)) {
            if (parts[1].indexOf(this.REF_ELEMENT_PREFIX) == 0) {
                this.errorMsg = new GwtMessage().getMessage("Only one extended field can be list edited at a time");
                return true;
            }
            this.errorMsg = new GwtMessage().getMessage("Only one derived field can be list edited at a time");
            return true;
        }
        return false;
    },
    _getEditor: function() {
        if ((this.tableElement.isDependent() ||
            this.tableElement.hasDependentChildren()) &&
        this.tableElement.isChoice())
            this.editWindow = new GwtListEditDependent(this);
        else if (this.tableElement.isDate())
            this.editWindow = new GwtListEditCalendar(this);
        else if (this.tableElement.isReference())
            this.editWindow = new GwtListEditReference(this);
        else if (this.tableElement.isChoice())
            this.editWindow = new GwtListEditSelect(this);
        else if (this.tableElement.getType() == "boolean")
            this.editWindow = new GwtListEditBoolean(this);
        else if (this.tableElement.getType() == "glide_duration")
            this.editWindow = new GwtListEditDuration(this);
        else if (this.tableElement.getType() == "table_name")
            this.editWindow = new GwtListEditTablename(this);
        else if (this.tableElement.getType() == "glide_encrypted")
            this.editWindow = new GwtListEditEncryptedText(this);
        else if (this.tableElement.isMulti() &&
            this.tableElement.getType() != "journal_input")
            this.editWindow = new GwtListEditMultiText(this);
        else if (this.tableElement.getType() == "journal_input")
            this.editWindow = new GwtListEditJournal(this);
        else if (this.tableElement.getType() == "internal_type")
            this.editWindow = new GwtListEditInternalType(this);
        else if (this.tableElement.getType() == "translated_field")
            this.editWindow = new GwtListEditTranslatedField(this);
        else if (this.tableElement.getType().startsWith('password'))
            this.editWindow = new GwtListEditPassword(this);
        else
            this.editWindow = new GwtListEditText(this);
    },
    _beforeSetValue: function(sysId, name, value, displayValue) {
    },
    _afterSetValue: function(sysId, name) {
    },
    /* -------------------------------------------------
*    Loading/saving indicator support
* ------------------------------------------------- */
    showLoading: function() {
        this.loadingImage = this._showImage(this.element, this.WAITING_IMAGE);
    },
    hideLoading: function() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.loadingImage) {
            rel(this.loadingImage);
            this.loadingImage = null;
        }
    },
    showSaving: function() {
        this.timer = setTimeout(this._showSaving.bind(this), this.WAIT_INITIAL_DELAY);
    },
    hideSaving: function() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        for (var i = 0; i < this.savingImages.length; i++)
            rel(this.savingImages[i]);
        this.savingImages = [];
    },
    _showSaving: function() {
        this.savingImages = [];
        var ids = this.getCanWriteIds();
        var fields = this.getFields();
        for (var i = 0; i < ids.length; i++) {
            for (var j = 0; j < fields.length; j++) {
                var element = this.getCell(ids[i], this.table + "." + fields[j]);
                if (!element)
                    continue;
                var savingImage = this._showImage(element, this.WAITING_IMAGE);
                this.savingImages.push(savingImage);
            }
        }
    },
    _showImage: function(element, imgSrc) {
        var left = getOffset(element, "offsetLeft");
        var top = getOffset(element, "offsetTop");
        var w = element.offsetWidth;
        var h = element.offsetHeight;
        left += w - 11;
        top += h - 11;
        var img = cel('img');
        img.src = imgSrc;
        img.alt = '';
        img.style.position = 'absolute';
        img.style.left = left;
        img.style.top = top;
        addChild(img);
        return img;
    },
    /* -------------------------------------------------
*    Initialization code to set up field/cell info
* ------------------------------------------------- */
    _initElement: function(element) {
        this.element = element;
        this.tableElementDOM = this.element.offsetParent;
        this.glideList = getGlideListEditor(this.tableElementDOM);
        this.name = this.glideList.getNameFromColumn(this.element.cellIndex);
        this.tableElement = TableElement.get(this.name);
        var parts = this.name.split('.');
        this.table = parts[0];
        this.fieldName = parts.slice(1).join('.');
        this.fields = [];
        var topParent = this._findTopParent(this.name);
        this._initFields(topParent);
        this._addMe(this.fieldName);
        this.sysId = getAttributeValue(this.element.parentNode, 'sys_id');      // save the sysId of the record we will get the value for the editor from
        this.sysIds = [];
        this._initSelected();
        var found = false;
        for (var i = 0; i < this.sysIds.length; i++) {
            if (this.sysIds[i] == this.sysId) {
                found = true;
                break;
            }
        }
        if (!found)
            this.sysIds.push(this.sysId);
    },
    _addMe: function(name) {
        if (this._fieldInArray(name))
            return;
        this.fields.push(this.fieldName);
    },
    _findTopParent: function(name) {
        var topParent = name;
        var visited = new Object();
        while (name) {
            name = null;
            var tableElement = TableElement.get(topParent);
            if (tableElement) {
                name = tableElement.getDependent();
                if (name) {
                    topParent = this.table + "." + name;
                    if (visited[name])
                        return topParent;
                    visited[name] = topParent;
                }
            }
        }
        return topParent;
    },
    _initFields: function(fieldName) {
        var tableElement = TableElement.get(fieldName);
        if (!tableElement)
            return;
        var prefix = '';
        var parts = fieldName.split('.');
        if (parts.length > 2)
            prefix = parts.slice(1, -1).join('.') + '.';
        if (this._fieldInArray(prefix + tableElement.name))
            return;
        this.fields.push(prefix + tableElement.name);
        var children = tableElement.getDependentChildren();
        for (var k in children)
            this._initFields(this.table + "." + prefix + k);
    },
    _fieldInArray: function(fieldName) {
        for (var i = 0; i < this.fields.length; i++)
            if (this.fields[i] == fieldName)
                return true;
        return false;
    },
    _initSelected: function() {
        this.cs = this.tableElementDOM['GwtListEditCellSelector'];
        this.cs.clearRanges();
        var cellSelection = new Object();
        for (var key in this.cs.getSelected()) {
            var coords = key.split(",");
            var sysId = getAttributeValue(this.tableElementDOM.rows[coords[1]], 'sys_id');
            if (sysId && !this._isDeletedRow(sysId))
                this.sysIds.push(sysId);
        }
    },
    _isDeletedRow: function(sysId) {
        var record = this.glideList.getRecord(sysId);
        if (!record)
            return false;
        if ((record.operation == 'delete') || (record.operation == "delete_pending"))
            return true;
        else
            return false;
    },
    _getValues: function() {
        this.glideList.getValues(this.table, this.getSysIds(), this.getFields(), this.renderEditor.bind(this));
    },
    _saveValues: function() {
        this.showSaving();
        this._save();
    },
    _save: function() {
        var ajax = new GlideAjax(this.PROCESSOR);
        ajax.addParam("sysparm_type", 'set_value');
        ajax.addParam('sysparm_table', this.table);
        ajax.addParam('sysparm_first_field', this.glideList.firstField);
        ajax.addParam('sysparm_xml', this.glideList.serializeWritable());
        ajax.getXML(this._saveResponse.bind(this));
        this.glideList.clearModified();
    },
    _saveResponse: function(response) {
        this.hideSaving();
        if (!response || !response.responseXML) {
            return;
        }
        var xml = response.responseXML;
        var items = xml.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var sysId = item.getAttribute("sys_id");
            var field = item.getAttribute("fqField");
            var td = item.firstChild;
            var cell = this.getCell(sysId, field);
            if (!cell)
                continue;
            new GwtListEditReplaceContent(cell, td);
        }
    },
    type: function() {
        return "GwtCellEditor";
    }
};
/**
* Cell editor that serializes all changes into xml and saves the changes with the form the
* related list is associated with
*/
var GwtCellEditorSaveWithForm = Class.create(GwtCellEditor, {
    MODIFIED_IMAGE: "image/modified.gifx",
    initialize: function(element, ignoreTypes) {
        GwtCellEditor.prototype.initialize.call(this, element, ignoreTypes);
        this.glideList.markDirty = true;
    },
    _saveValues: function() {
        this.glideList.saveValuesInForm();
    },
    _afterSetValue: function(sysId, name) {
        g_form.fieldChanged(sysId + "_" + name, true);
    },
    type: function() {
        return "GwtCellEditorSaveWithForm";
    }
});
/**
* @author bwebb
*
* bwebb - 4/11/2008
*   - change references from Grid to List
*/
var GwtListEditCellSelector = Class.create(GwtCellSelector, {
    initialize: function(tableElement) {
        GwtCellSelector.prototype.initialize.call(this, tableElement);
        this.setBeforeSelect(true);
        this.setOnSelect(true);
        if (g_list_edit_version_2 != "true")
            this.setIgnoreColumn(1); // in list v1 column 1 is to be ignored
        this.setSelectColor("#ccccff");
        this.setSelectColumnOnly(true);
        this.setSelectNonContiguous(true);
        this.selectedCells = new Object();
    },
    clearCellSelection: function() {
        this.selectedCells = new Object();
    },
    resetCellSelection: function() {
        this.clearCellSelection();
        this.restoreCellColors();
    },
    handleOnSelect: function(selectedCells) {
        var isFirstCell = true;
        this.originalCell = new Object();
        for (var key in selectedCells) {
            var cell = key.split(",");
            if (isFirstCell) {
                this.originalCell.col = cell[0];
                this.originalCell.row = cell[1];
                isFirstCell = false;
            }
            this.selectedCells[key] = true;
        }
    },
    handleBeforeSelect: function(e) {
        this.selectedCellKey = this.getSelectedCellKey(e);
        if (e.shiftKey) {
            setTimeout(this.clearRanges.bind(this), 0);
            if (e.ctrlKey || e.metaKey) {
                var colIndex = Event.element(e).cellIndex;
                if (this.selectedCellKey && this.originalCell && colIndex == this.originalCell.col) {
                    this.selectedCells[this.selectedCellKey] = true;
                    return true;
                } else {
                    return false;
                }
            }
            if (this.selectedCells[this.selectedCellKey]) {
                return false;
            } else {
                this.clearCellSelection();
                return true;
            }
        }
        var selectedCellKey = this.getSelectedCellKey(e);
        if (this.selectedCells && !this.selectedCells[selectedCellKey])
            this.resetCellSelection();
        return false;
    },
    clearRanges: function() {
        if (ie5)
            document.selection.empty();
        else
            window.getSelection().removeAllRanges();
    },
    getSelectedCellKey: function(e) {
        return Event.element(e).cellIndex + "," + Event.element(e).parentNode.rowIndex;
    },
    getSelected: function() {
        return this.selectedCells;
    },
    z: null
});
var GwtListEditReplaceContent = Class.create();
GwtListEditReplaceContent.prototype = {
    initialize: function(element, td) {
        if (!element || !td)
            return;
        this._setCellContents(element, td);
    },
    _setCellContents: function(element, td) {
        element.style.backgroundColor = "";
        var style = td.getAttribute("style");
        element.style.cssText = style;
        var newText = "";
        for (var i = 0; i < td.childNodes.length; i++) {
            var tagName = td.childNodes[i].tagName;
            var strVal =  getXMLString(td.childNodes[i]);
            strVal = strVal.replace("/>","></" + tagName + ">");
            newText = newText + strVal;
        }
        element.innerHTML = newText;
        newText.evalScripts(true);
        removeClassName(element, 'list_edit_dirty');
    },
    z: null
}
/**
* Represents a record that is being managed by GlideListEditor (typically edited by GwtCellEditor)
*
* The fields within the record are indexed by field name and are represented by the GwtListEditField class.
* The field maintains information about three different values for the field:
*
*       value
*       displayValue
*       renderValue
*
* The value and displayValue are sent to the server and used to update the record.
*
*       If displayValue is set (by calling GwtListEditField.setDisplayValue), then the server will
*       call GlideElement.setDisplayValue to update the record.
*
*       If displayValue is not set, then the server will use GlideElement.setValue
*       (with the value specified by calling GwtListEditField.setValue) to update the record.
*
* In most cases, when a field is modified using the list editor the contents of the cell on the UI
* will be updated to contain the display value (if set) or, otherwise, the value.  However, there
* are cases where we need to tell the server to use setValue (no display value allowed) but we
* still want a 'display value' to show up in the modified cell.  In that case, we use setRenderValue
* to override the normal behavior.
*
* Choice lists are an example of needing the setRenderValue since we need to send the value to the
* server for update using setValue, but we want to show the display value in the modified cell. So,
* we call:
*
*       setValue(value)
*       setRenderValue(label)
*/
var GwtListEditRecord = Class.create();
GwtListEditRecord.prototype = {
    initialize: function(sysId) {
        this.sysId = sysId;
        if (sysId == "-1")
            this.operation = "default_values";
        else
            this.operation = "update";
        this.fields = {};
    },
    addField: function(name) {
        var f = this.getField(name);
        if (f)
            return f;
        this.fields[name] = new GwtListEditField(name);
        return this.fields[name];
    },
    getField: function(name) {
        return this.fields[name];
    },
    getFields: function() {
        return this.fields;
    },
    setOperation: function(operation) {
        if (this.sysId == "-1")
            return;
        this.operation = operation;
    },
    clearModified: function() {
        for (var n in this.fields)
            this.fields[n].clearModified();
    },
    type: 'GwtListEditRecord'
}
/**
* Represents a field within a record that is being edited by GwtCellEditor
*/
var GwtListEditField = Class.create();
GwtListEditField.prototype = {
    initialize: function(name) {
        this.name = name;
        this.label = name;
        this._clear();
    },
    getName: function() {
        return this.name;
    },
    getLabel: function() {
        return this.label;
    },
    getOriginalValue: function() {
        return this.originalValue;
    },
    getOriginalDisplay: function() {
        return this.originalDisplay;
    },
    getValue: function() {
        return this.value;
    },
    getDisplayValue: function() {
        return this.displayValue;
    },
    getRenderValue: function() {
        return this.renderValue;
    },
    isValueSet: function() {
        return this.valueSet;
    },
    isDisplayValueSet: function() {
        return this.displaySet;
    },
    isRenderValueSet: function() {
        return this.renderSet;
    },
    isModified: function() {
        return this.modified;
    },
    isWritable: function() {
        return this.canWrite;
    },
    isMandatory: function() {
        return this.mandatory;
    },
    isOKExtension: function() {
        return this.okExtension;
    },
    clearModified: function() {
        this.modified = false;
    },
    setWritable: function(canWrite) {
        this.canWrite = canWrite;
    },
    setMandatory: function(mandatory) {
        this.mandatory = mandatory;
    },
    setOKExtension: function(okExtension) {
        this.okExtension = okExtension;
    },
    setLabel: function(label) {
        this.label = label;
    },
    setInitialValues: function(v, dsp) {
        this._clear();
        this.originalValue = v;
        this.originalDisplay = dsp;
        this.value = v;
        this.displayValue = dsp;
        this._convertNullsToBlank();
    },
    setValue: function(v) {
        if (this.value != v)
            this.modified = true;
        this.value = v;
        this.valueSet = true;
        this.renderSet = false;
        this.renderValue = "";
        this._convertNullsToBlank();
    },
    setDisplayValue: function(v) {
        if (this.displayValue != v)
            this.modified = true;
        this.displayValue = v;
        this.displaySet = true;
        this.renderSet = false;
        this.renderValue = "";
        this._convertNullsToBlank();
    },
    setRenderValue: function(v) {
        this.renderValue = v;
        this.renderSet = true;
        this._convertNullsToBlank();
    },
    unsetValue: function() {
        this.value = '';
        this.valueSet = false;
    },
    unsetDisplayValue: function() {
        this.displayValue = '';
        this.displaySet = false;
    },
    unsetRenderValue: function() {
        this.renderValue = '';
        this.renderSet = false;
    },
    serialize: function(xml, parent, full) {
        var f = xml.createElement("field");
        f.setAttribute('name', this.name);
        f.setAttribute('modified', this.modified.toString());
        f.setAttribute('value_set', this.valueSet.toString());
        f.setAttribute('dsp_set', this.displaySet.toString());
        if (full) {
            f.setAttribute('label', this.label);
            f.setAttribute('can_write', this.canWrite.toString());
            f.setAttribute('mandatory', this.mandatory.toString());
            f.setAttribute('render_set', this.renderSet.toString());
        }
        parent.appendChild(f);
        this._convertNullsToBlank();
        this._createValueNode(xml, f, 'value', this.value);
        if (this.displaySet || full)
            this._createValueNode(xml, f, 'display_value', this.displayValue);
        if (full) {
            this._createValueNode(xml, f, 'render_value', this.renderValue);
            this._createValueNode(xml, f, 'original_value', this.originalValue);
            this._createValueNode(xml, f, 'original_display', this.originalDisplay);
        }
    },
    deserialize: function(item) {
        this._clear();
        this.label = item.getAttribute('label');
        this.canWrite = this._getXMLBoolean(item, 'can_write');
        this.mandatory = this._getXMLBoolean(item, 'mandatory');
        this.modified = this._getXMLBoolean(item, 'modified');
        this.valueSet = this._getXMLBoolean(item, 'value_set');
        this.displaySet = this._getXMLBoolean(item, 'dsp_set');
        this.renderSet = this._getXMLBoolean(item, 'render_set');
        this.originalValue = this._getValueFromNode(item, 'original_value');
        this.originalDisplay = this._getValueFromNode(item, 'original_display');
        this.value = this._getValueFromNode(item, 'value');
        this.displayValue = this._getValueFromNode(item, 'display_value');
        this.renderValue = this._getValueFromNode(item, 'render_value');
        this._convertNullsToBlank();
    },
    _createValueNode: function(xml, e, n, val) {
        if (!val)
            val = '';
        var node = xml.createElement(n);
        var text = xml.createTextNode(val);
        node.appendChild(text);
        e.appendChild(node);
    },
    _getValueFromNode: function(node, n) {
        var e = node.getElementsByTagName(n);
        if (e && e.length > 0)
            return getTextValue(e[0]);
        return '';
    },
    _getXMLBoolean: function(item, attr) {
        return (item.getAttribute(attr) == "true");
    },
    _clear: function() {
        this.value = '';
        this.displayValue = '';
        this.renderValue = '';
        this.valueSet = false;
        this.displaySet = false;
        this.renderSet = false;
        this.modified = false;
        this.canWrite = false;
        this.mandatory = false;
    },
    _convertNullsToBlank: function() {
        if (!this.value)
            this.value = '';
        if (!this.displayValue)
            this.displayValue = '';
        if (!this.renderValue)
            this.renderValue = '';
    },
    type: 'GwtListEditField'
}
var GwtListEditor = {
    ignoreTypes: [],
    edit: function(element){
        this.savePreviousEditor();
        this._createCellEditor(element);
    },
    _createCellEditor: function(element){
        var table = element.offsetParent;
        var type = getListEditTypeForTable(table);
        if (type == 'disabled')
            return;
        if (type == 'save_with_form') {
            this.cellEditor = new GwtCellEditorSaveWithForm(element, this.ignoreTypes);
        } else
            this.cellEditor = new GwtCellEditor(element, this.ignoreTypes);
    },
    savePreviousEditor: function(){
        if (!this.cellEditor)
            return;
        this.cellEditor.saveAndClose();
        this.cellEditor = null;
    },
    onClicked: function(e){
        var element = Event.element(e);
        if (element.tagName != 'TD')
            return true;
        if (!hasClassName(element, 'vt'))
            return true;
        if (e.ctrlKey || e.metaKey) {
            if (gel("cell_edit_window"))
                this.savePreviousEditor();
            return false;
        }
        this.edit(element);
    },
    onMouseDown: function(e){
        if (gel("cell_edit_window"))
            return this.savePreviousEditor();
    },
    setIgnoreTypes: function(types){
        if (!types)
            this.ignoreTypes = [];
        else
            this.ignoreTypes = types.split(',');
    },
    type: function(){
        return "GwtListEditor";
    }
}
var listEditorCache = {};
function editableListPartialLoad(targetSpan){
    GwtListEditor.savePreviousEditor();
    editableListOnLoad();
    if (isEditableList(targetSpan))
        editableListApplyUpdates(targetSpan);
    else {
        var e = targetSpan.firstChild;
        while (e) {
            if (isEditableList(e)) {
                editableListApplyUpdates(e);
                break;
            }
            e = e.firstChild;
        }
    }
}
function editableListApplyUpdates(table) {
    var glideList = new GlideListEditor(table);
    glideList.markDirty = true;
    glideList.applyUpdates();
    glideList = null;
}
function cellSelectorOnLoad(){
    var tableElements = document.getElementsByTagName("table");
    for (var i = 0; i < tableElements.length; i++) {
        var t = tableElements[i];
        if (isEditableList(t)) {
            if (t['GwtListEditCellSelector'])
                continue;
            var cs = new GwtListEditCellSelector(t);
            t['GwtListEditCellSelector'] = cs;
        }
    }
}
function cellSelectorUnLoad(){
    var tableElements = document.getElementsByTagName("table");
    for (var i = 0; i < tableElements.length; i++) {
        var t = tableElements[i];
        if (hasClassName(t, "wideDataList")) {
            if (t['GwtListEditCellSelector'])
                t['GwtListEditCellSelector'] = null;
        }
    }
    listEditorCache = null;
}
function editableListOnLoad(){
    if (!window['g_list_edit_enable'])
        return;
    cellSelectorOnLoad();
    var eventName = "click";
    if (g_list_edit_double)
        eventName = "dblclick";
    var tableElements = document.getElementsByTagName("table");
    var tLen = tableElements.length;
    for (var i = 0; i < tLen; i++) {
        var t = tableElements[i];
        if (isEditableList(t)) {
            Event.observe(t, eventName, GwtListEditor.onClicked.bindAsEventListener(GwtListEditor));
            Event.observe(t, "mousedown", GwtListEditor.onMouseDown.bindAsEventListener(GwtListEditor));
        }
    }
    GwtListEditor.setIgnoreTypes(window['g_list_edit_ignore_types']);
}
function editableListUnLoad(){
    cellSelectorUnLoad();
}
function editListSetGlideList(listId){
    var table = getListEditTable(listId);
    if (!table)
        return;
    g_list = new GlideListEditor(table);
    g_list.markDirty = true;
}
function editListRegisterOnSubmit(listId){
    if (!window['g_list_edit_enable'])
        return;
    if (typeof g_form == 'undefined')
        return;
    if (!g_form)
        return;
    var form = gel(g_form.getTableName() + '.do');
    if (!form)
        return;
    addOnSubmitEvent(form, function(){
        return editListOnSubmitWrapper(listId);
    });
}
function editListOnSubmitWrapper(listId){
    var table = getListEditTable(listId);
    if (!table)
        return;
    g_list = new GlideListEditor(table);
    var ret = g_list.callOnSubmit();
    if (ret !== false)
        g_list.saveUpdatesInForm();
    g_list = null;
    return ret;
}
function editListWithFormAddRow(listId){
    if (listEditorCache[listId])
        return listEditorCache[listId].addRow();
    var table = getListEditTable(listId);
    if (!table)
        return;
    listEditorCache[listId] = new GlideListEditor(table);
    listEditorCache[listId].addRow();
}
function editListWithFormDeleteRow(img, id, listId) {
    if (listEditorCache[listId])
        return listEditorCache[listId].deleteRowToggle(id);
    var table = getListEditTable(listId);
    if (!table)
        return;
    listEditorCache[listId] = new GlideListEditor(table);
    listEditorCache[listId].deleteRowToggle(id);
}
function isEditableList(e){
    if ((e.tagName != 'TABLE') || (!hasClassName(e, "wideDataList") && !hasClassName(e, "list_table")))
        return false;
    var type = getListEditTypeForTable(e);
    return (type != 'disabled');
}
function getListEditTypeForTable(table){
    var type = '';
    var ppId = getAttributeValue(table, 'partial_page_span');
    if (ppId) {
        var pp = gel(ppId);
        if (pp)
            type = getAttributeValue(pp, 'glide_list_edit_type');
    } else {
        type = getAttributeValue(table, 'glide_list_edit_type');
    }
    if (!type)
        type = '';
    return type;
}
function getListEditTable(listId){
    var table = gel(listId + "_table");
    if (!table)
        return null;
    if (!hasClassName(table, "wideDataList"))
        return null;
    return table;
}
function getGlideListEditor(tableDOM) {
    var tableId = tableDOM.identify();
    var id = tableId.substr(0,tableId.length-6);
    if (listEditorCache[id]) {
        var editor = listEditorCache[id];
        editor.initRows(tableDOM);
        return editor;
    }
    listEditorCache[id] = new GlideListEditor(tableDOM);
    return listEditorCache[id];
}
addLoadEvent(editableListOnLoad);
addUnloadEvent(editableListUnLoad);
CustomEvent.observe('partial.page.reload', editableListPartialLoad);
//include classes/event/GwtObservable.js
/**
* @class
*
* Allows the registration and firing of notification events.
*
* This is a very simple implementation in which a class can expose
* notifications of things occurring that someone else may be
* interested in.  This class follows the Ext.util.Observable model
* but is much simpler in its implementation right now.
*
* The following methods are the useful ones:
*       on - register to be called when an event is fired
*       un - unregister
*       fireEvent - fire an event to all registered listeners
*
* Listeners should return true/false.  Returning false will stop the
* firing of events to the listeners.
*/
var GwtObservable = Class.create({
    initialize: function() {
        this._init();
        this.suppressEvents = false;
    },
    on: function(name, func) {
        this._init();
        this._register(name, func);
    },
    forward: function(name, element, func) {
        this._init();
        this._initForward();
        if (!this._forwarding[name]) {
            Event.observe(element, name, this._onForwardFunc);
            this._forwarding[name] = true;
        }
        this._register(name, func);
    },
    un: function(name, func) {
        this._init();
        if (!this.events[name])
            return;
        this.events[name].removeItem(func);
    },
    unAll: function(name) {
        if (this.events[name])
            delete this.events[name];
    },
    fireEvent: function() {
        if (this.suppressEvents)
            return true;
        this._init();
        var event = this.events[arguments[0]];
        if (typeof event == "object") {
            var args = Array.prototype.slice.call(arguments, 1);
            this.firing = true;
            for (var i = 0; i < event.length; i++) {
                var ev = event[i];
                if (ev == null) {
                    continue;
                }
                if (ev.apply(this, args) === false) {
                    this.firing = false;
                    return false;
                }
            }
            this.firing = false;
        }
        return true;
    },
    _init: function() {
        if (!this.events)
            this.events = {};
    },
    _initForward: function() {
        if (!this._forwarding) {
            this._forwarding = {};
            this._onForwardFunc = this._onForward.bindAsEventListener(this);
        }
    },
    _register: function(name, func) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name].push(func);
    },
    _onForward: function(ev) {
        this.fireEvent(ev.type, this, ev);
    },
    toString: function() {
        return 'GwtObservable';
    }
});
//include classes/GwtMessage.js
var GwtMessage = Class.create({
    DEFAULT_LANGUAGE: "en",
    PREFETCH_ENTRY_KEY : "PREFETCH_ENTRY_KEY",
    initialize: function() {
    },
    getMessage: function(strVal) {
        var valList = new Array();
        valList.push(strVal);
        var messages = this.getMessages(valList);
        return messages[strVal];
    },
    getMessages: function(resolveList) {
        this._loadNewMessages(resolveList);
        return this._buildListFromCache(resolveList); // all keys should be in cache -- so just return cache
    },
    _loadNewMessages: function(resolveList) {
        var cachedMessages = this._findCachedKeys(resolveList);
        var keysToResolve = this._removeCachedEntries(resolveList, cachedMessages);
        if (keysToResolve.length == 0)
            return;
        var ajax = new GlideAjax("SysMessageAjax");
        ajax.addParam("sysparm_keys", keysToResolve.length);
        ajax.addParam("sysparm_prefetch", this._shouldPrefetch() ? "true" : "false");
        for(var i = 0; i < keysToResolve.length; i++) {
            var keyVal = "key" + i;
            ajax.addParam(keyVal, keysToResolve[i]);
        }
        var rxml = ajax.getXMLWait();
        this._processResponse(rxml);
    },
    _removeCachedEntries: function(resolveList) {
        var messagesToResolve = new Array();
        for(var i = 0; i < resolveList.length; i++) {
            var key = resolveList[i];
            if (this._getCache().get(key))
                continue;
            messagesToResolve.push(key);
        }
        return messagesToResolve;
    },
    _processResponse: function(rxml) {
        this._processItems(rxml, "preitem");
        this._processItems(rxml, "item");
    },
    /*
* We prefetch if we've never prefetched
* or the last time we prefeched was more than a minute ago
* Reduces "pointless" prefetching if we're requesting a lot of things that are not in the prefetch list
*
*/
    _shouldPrefetch : function() {
        var pf = this._getCache().get(this._PREFETCH_ENTRY_KEY);
        var now = new Date().getTime();
        if (typeof pf == 'undefined' || (pf + 60000) < now) {
            this._getCache().put(this._PREFETCH_ENTRY_KEY, now);
            return true;
        }
        return false;
    },
    _processItems: function(xml, name) {
        var items = xml.getElementsByTagName(name);
        for (var i=0; i < items.length; i++) {
            var key = items[i].getAttribute("key");
            var value = items[i].getAttribute("value");
            this.setMessage(key, value);
        }
    },
    setMessage: function(key, msg) {
        this._getCache().put(key, msg);
    },
    isDefaultLanguage: function() {
        return this.getLanguage() == this.getDefaultLanguage();
    },
    getLanguage: function() {
        return g_lang;
    },
    getDefaultLanguage: function() {
        return this.DEFAULT_LANGUAGE;
    },
    _findCachedKeys: function(resolveList) {
        var answer = new Array();
        var cache = this._getCache();
        for (var i =0; i<resolveList.length; i++) {
            var key = resolveList[i];
            var value = cache.get(key);
            if (value)
                answer.push(key);
        }
        return answer;
    },
    _buildListFromCache: function(resolveList) {
        var answer = new Object();
        var cache = this._getCache();
        for (var i =0; i<resolveList.length; i++) {
            var key = resolveList[i];
            var value = cache.get(key);
            answer[key] = value;
        }
        return answer;
    },
    _getCache: function() {
        try {
            if (getTopWindow().g_cache_message)
                return getTopWindow().g_cache_message;
        } catch (e) { }
        if (typeof(g_cache_message) != "undefined")
            return g_cache_message;
        g_cache_message = new GlideClientCache(500);
        return g_cache_message;
    },
    z: null
});
//include classes/GwtContextMenu.js
var gActiveContext;
var contextMenus = new Object();
var GwtContextMenu = Class.create({
    initialize: function(id, useBodyAsParent) {
        this.timeout = null;
        this.properties = new Object();
        this.setID(id);
        this.getMenu();
        this.onshow = null;
        this.onhide = null;
        this.beforehide = null;
        this.docRoot = this._getDocRoot();
        this.hasItems = false;
        this.hideOnlySelf = false;
        this.trackSelected = false;
        if (typeof useBodyAsParent == "undefined")
            useBodyAsParent = false;
        this._getParentElement(useBodyAsParent);
    },
    isEmpty: function() {
        return !this.hasItems;
    },
    /* if we have a record form up, that will be the parent for the menu otherwise it is document.body.
* This can be overriden with the useBodyAsParent parameter.
*/
    _getParentElement: function(useBodyAsParent) {
        if (useBodyAsParent) {
            this.parentElement = document.body;
            return;
        }
        this.parentElement = getFormContentParent();
    },
    _getDocRoot: function() {
        var docRoot = window.location.protocol + "//" + window.location.host;
        if (window.location.pathname.indexOf("/") > -1) {
            var fp = window.location.pathname;
            fp = fp.substring(0, fp.lastIndexOf("/"));
            if (fp.substring(0, 1).indexOf("/") != -1)
                docRoot = docRoot + fp;
            else
                docRoot = docRoot + "/" + fp;
        }
        docRoot += "/";
        return docRoot;
    },
    add: function(label, id) {
        this.hasItems = true;
        var m = this.getMenu();
        var d = document.createElement("div");
        d.setAttribute("item_id", id);
        d.className = "context_item";
        d.isMenuItem = true;
        d.innerHTML = label;
        m.appendChild(d);
        return d;
    },
    addHref: function(label, href, img, title, id) {
        var d = this.add(label, id);
        d.setAttribute("href", href);
        if (title && title != null)
            d.setAttribute("title", title);
        this.setImage(d, img);
        return d;
    },
    addFunc: function(label, func, id) {
        var d = this.add(label, id);
        d.setAttribute("func_set", "true");
        d.func = func;
        return d;
    },
    addURL: function(label, url, target, id) {
        var d = this.add(label, id);
        d.setAttribute("url", url);
        if (target)
            d.setAttribute("target", target);
        return d;
    },
    addHrefNoSort: function(label, href, id) {
        var item = this.addHref(label, href, null, null, id);
        item.setAttribute("not_sortable", "true");
        return item;
    },
    addHrefNoFilter: function(label, href, id) {
        var item = this.addHref(label, href, null, null, id);
        item.setAttribute("not_filterable", "true");
        return item;
    },
    addMenu: function(label, menu, id) {
        var item = this.add(label + "<img src='images/context_arrow.gifx' class='context_item_menu_img' alt='Add' />", id);
        item.setAttribute("label", "true");
        menu.setParent(this);
        item.subMenu = menu;
        return item;
    },
    addAction: function(label, action, id) {
        return this.addHref(label, "contextAction('" + this.getTableName() + "', '" + action + "')", null, null, id);
    },
    addConfirmedAction: function(label, action, id) {
        return this.addHref(label, "contextConfirm('" + this.getTableName() + "', '" + action + "')", null, null, id);
    },
    addLine: function() {
        this.hasItems = true;
        var m = this.getMenu();
        var d = document.createElement("div");
        d.className = "context_item_hr";
        d.isMenuItem = true;
        d.disabled = "disabled";
        m.appendChild(d);
        return d;
    },
    addLabel: function(label, id) {
        var m = this.getMenu();
        var d = document.createElement("div");
        d.setAttribute("item_id", id);
        d.className = "context_item";
        d.isMenuItem = true;
        d.innerHTML = label;
        d.disabled = "disabled";
        m.appendChild(d);
        return d;
    },
    /**
* Get a menu item by item ID
*/
    getItem: function(itemId) {
        var items = this.getMenu().getElementsByTagName("div");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getAttribute("item_id") == itemId)
                return item;
        }
        return null;
    },
    /**
* Set an image for an item just added via an 'add...' method:
*
*       var item = menu.add(label);
*       menu.setImage(item, 'images/abc.gifx');
*
*       var item = menu.getItem(item_id);
*       menu.setImage(item, 'images/abc.gifx');
*/
    setImage: function(item, img) {
        if (item && img) {
            item.style.backgroundImage = "url(" + this.docRoot + img + ")";
            item.style.backgroundRepeat = "no-repeat";
        }
    },
    /**
* Place check next to a menu item
*/
    setChecked: function(item) {
        if (item)
            this.setImage(item, "images/checked.pngx");
    },
    clearImage: function(item) {
        if (item) {
            item.style.backgroundImage = "";
            item.style.backgroundRepeat = "";
        }
    },
    setDisabled: function(item) {
        if (!item)
            return;
        this._dullItem(item);
    },
    setEnabled: function(item) {
        if (!item)
            return;
        this._undullItem(item);
    },
    setHidden : function(item) {
        if (!item)
            return;
        this._hideItem(item);
    },
    setVisible : function(item) {
        if (!item)
            return;
        this._showItem(item);
    },
    setLabel: function(item, label) {
        if (item)
            item.innerHTML = label;
    },
    /* if true, contextHide will only hide itself */
    setHideOnlySelf: function(hideSelf) {
        this.hideOnlySelf = hideSelf;
    },
    clearSelected: function() {
        var items = this.getMenu().getElementsByTagName("div");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.isMenuItem)
                this.clearImage(item);
        }
    },
    clear: function() {
        var m = this.getMenu();
        clearNodes(m);
        this._setMinWidth();
        this.hasItems = false;
    },
    destroy: function() {
        this.parentElement = null;
        this.menu.context = null;
        this.menu.onmouseover = null;
        this.menu.onmouseout = null;
        this.menu.onclick = null;
        if (isMSIE)
            this.menu.outerHTML = null;
        this.parentMenu = null;
        this.onshow = null;
        this.onhide = null;
        this.properties = null;
        this.timeout = null;
        this.menu = null;
        this.shim = null;
    },
    display: function(e) {
        if (!this.getParent())
            CustomEvent.fireAll('body_clicked', null);
        menuSort = true;
        this._dullMenu();
        this._toggleMenuItems("not_sortable", this.getProperty('sortable'));
        this._toggleMenuItems("not_filterable", this.getProperty('filterable'));
        this.setFiringObject(this._getElement(e));
        e = this._getRealEvent(e);
        var menu = this.getMenu();
        if (this._isEmpty(menu))
            return;
        menu.style.left = "0";
        menu.style.top = "0";
        this.parentElement.appendChild(menu);
        if (this.getProperty("top") > 0 && ((this.getProperty("left") > 0) || (this.getProperty("right") > 0))) {
            menu.style.visibility = 'hidden';
            menu.style.display = 'block';
            this.moveMenuToXY(e, this.getProperty("left"), this.getProperty("top"), this.getProperty("right"));
        } else if (this.getParent()) {
            var x = this._getElement(e);
            menu.style.visibility = 'hidden';
            menu.style.display = 'block';
            this.moveMenuToParent(e, x);
        } else {
            var x = this._getElement(e);
            menu.style.visibility = 'hidden';
            menu.style.display = 'block';
            this.moveMenuToCursor(e);
        }
        gActiveContext = this;
        showObject(menu);
        this._showShim(menu);
    },
    hide: function() {
        gActiveContext = "";
        this._hideShim();
        hideObject(this.getMenu());
        this.parentElement.removeChild(this.getMenu());
        if (this.onhide)
            this.onhide();
    },
    hideAll: function() {
        var m = this;
        while(m) {
            m.hide();
            m = m.getParent();
        }
    },
    execute: function(e) {
        var x = this._getElement(e);
        if (x.isMenuItem && !x.disabled) {
            if (x.getAttribute("label") == "true") {
                this._getRealEvent(e).cancelBubble = true;
                return;
            }
            if (x.getAttribute("target")) {
                window.open(x.getAttribute("url"), x.getAttribute("target"))
            } else if (x.getAttribute("href")) {
                var expression = x.getAttribute("href");
                gActiveContext = this;
                eval(expression);
            } else if (x.getAttribute("func_set") == "true") {
                x.func();
            } else {
                window.location = x.getAttribute("url");
            }
            if (this.trackSelected) {
                this.clearSelected();
                this.setChecked(x);
            }
        }
        if (x.subMenu)
            x.subMenu.hideAll();
        else
            this.hideAll();
    },
    menuLowLight: function(e) {
        var x = this._getElement(e);
        this._handleTimeout(false, x);
        if (!x.isMenuItem)
            return;
        if (!x.subMenu || x.subMenu.getMenu().style.display == 'none')
            this._disableItem(x);
        window.status = '';
    },
    menuHighLight: function(e) {
        var x = this._getElement(e);
        this._handleTimeout(true, x);
        if (!x.isMenuItem)
            return;
        this._hideAllSubs(x.parentNode);
        this._enableItem(x);
        if (x.subMenu)
            x.subMenu.display(e);
    },
    /**
* Specify 'right' to override 'left' in an attempt to position the right edge of the menu
*/
    moveMenuToXY: function(e, left, top, /*optional*/right) {
        var menu = this.getMenu();
        if (right)
            left = right - menu.offsetWidth;
        var offsetTop = ie5 ? this.parentElement.scrollTop + top : window.pageYOffset + top;
        var offsetLeft = ie5 ? this.parentElement.scrollLeft + left : window.pageXOffset + left;
        this.moveMenu(top, left, 0, 0, offsetTop, offsetLeft);
    },
    moveMenuToCursor: function(e) {
        var offsetTop = 0;
        var offsetLeft = 0;
        if (ie5) {
            offsetTop = this.parentElement.scrollTop + e.clientY;
            offsetLeft = this.parentElement.scrollLeft + e.clientX;
        } else if (isTouchDevice) {
            offsetTop = e.pageY;
            offsetLeft = e.pageX;
        } else if (this.parentElement.nodeName == "BODY") {
            offsetTop = window.pageYOffset + e.clientY;
            offsetLeft = window.pageXOffset + e.clientX;
        } else {
            offsetTop = this.parentElement.scrollTop + e.clientY;
            offsetLeft = this.parentElement.scrollLeft + e.clientX;
        }
        this.moveMenu(e.clientY, e.clientX, 0, 0, offsetTop, offsetLeft);
    },
    moveMenuToParent: function(e, firingObject) {
        var parent = this.getParent().getMenu();
        var offsetTop = grabOffsetTop(firingObject) - parent.scrollTop;
        var offsetLeft = grabOffsetLeft(parent);
        this.moveMenu(offsetTop, offsetLeft, firingObject.offsetHeight, parent.offsetWidth, offsetTop, offsetLeft);
    },
    moveMenu: function(top, left, height, width, offsetTop, offsetLeft) {
        var menu = this.getMenu();
        menu.style.overflowY = "visible";
        menu.setAttribute('gsft_has_scroll', false);
        if (menu.getAttribute('gsft_width'))
            menu.style.width = menu.getAttribute('gsft_width') + "px";
        if (menu.getAttribute('gsft_height'))
            menu.style.height = menu.getAttribute('gsft_height') + "px";
        var leftPos;
        var viewport = new WindowSize();
        if ((left + width + menu.offsetWidth) > viewport.width)
            leftPos = offsetLeft - menu.offsetWidth;
        else
            leftPos = offsetLeft + width;
        if (leftPos < this.parentElement.scrollLeft)
            leftPos = this.parentElement.scrollLeft;
        menu.style.left = leftPos + "px";
        var direction = 'down';
        var clip = 0;
        if ((top + menu.offsetHeight) > viewport.height) {
            var bottomClip = menu.offsetHeight - (viewport.height - top);
            var topClip = menu.offsetHeight - top + height;
            if (topClip < bottomClip) {
                direction = 'up';
                clip = topClip;
            } else
                clip = bottomClip;
        }
        var topPos;
        if (direction == 'up')
            topPos = offsetTop + height - menu.offsetHeight;
        else
            topPos = offsetTop;
        if (topPos < this.parentElement.scrollTop) {
            topPos = this.parentElement.scrollTop;
        }
        if ((topPos - this.parentElement.scrollTop + menu.offsetHeight) > viewport.height)
            clip = (topPos - this.parentElement.scrollTop + menu.offsetHeight) - viewport.height;
        menu.style.top = topPos + "px";
        if (clip > 0) {
            if (!menu.getAttribute('gsft_width')) {
                menu.setAttribute('gsft_width', menu.offsetWidth);
                menu.setAttribute('gsft_height', menu.offsetHeight);
            }
            menu.setAttribute('gsft_has_scroll', true);
            menu.style.overflowY = "auto";
            var w = menu.offsetWidth + 18;
            menu.style.width = w + "px";
            var h = menu.offsetHeight - clip - 4;  // 4 is for a bit of space and the border
            menu.style.height = h + "px";
        }
    },
    getFiringObject: function() {
        return this.eventObject;
    },
    getID: function() {
        return this.id;
    },
    getMenu: function() {
        if (!this.menu) {
            this.menu = contextMenus[this.getID()];
            if (!this.menu) {
                this._createMenu();
            }
            this._setMenuAttrs();
            this._setMinWidth();
        }
        return this.menu;
    },
    getParent: function() {
        return this.parentMenu;
    },
    getProperty: function(c) {
        return this.properties[c];
    },
    getTableName: function() {
        return this.tableName;
    },
    setFiringObject: function(e) {
        this.eventObject = e;
    },
    setID: function(id) {
        this.id = id;
    },
    /* set code to run when the menu is displayed */
    setOnShow: function(onshow) {
        this.onshow = onshow;
    },
    setOnHide: function(oh) {
        this.onhide = oh;
    },
    /* set code to run before a menu is hidden.  Should return false if the hide is not to take place. */
    setBeforeHide: function(beforeHide) {
        this.beforehide = beforeHide;
    },
    setParent: function(m) {
        this.parentMenu = m;
    },
    setProperty: function(c, v) {
        this.properties[c] = v;
    },
    setTableName: function(name) {
        this.tableName = name;
    },
    setTimeout: function(t) {
        this.timeout = t;
    },
    /**
* If flag is true, the menu will track the last selected item by placing a
* checkmark next to the item after it is selected after clearing the check
* from the previously selected item.
*
* Note: this is a rather simple implementation in that it does not keep
* track of the selected item for a menu, rather is just clears and adds
* a checkmark image for the selected item.  Keeping track of a selected
* item and allowing the caller to get and set the selected item requires
* that each item have an ID of some sort, which is not currently implemented
* as part of GwtContentMenu.
*/
    setTrackSelected: function(flag) {
        this.trackSelected = flag;
    },
    _createMenu : function() {
        this.menu = document.createElement("div");
        this.menu.name = this.menu.id = this.getID();
        contextMenus[this.getID()] = this.menu;
    },
    _disableItem: function(item) {
        if (item && !item.disabled) {
            removeClassName(item, "context_menu_hover");
        }
    },
    _dullMenu: function() {
        var items = this.getMenu().childNodes;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            this._disableItem(item);
        }
    },
    _enableItem: function(item) {
        if (item && !item.disabled) {
            addClassName(item, "context_menu_hover");
        }
    },
    _getElement: function(e) {
        e = this._getRealEvent(e);
        var x = ie5? e.srcElement : e.target;
        if (!x.isMenuItem && x.parentNode.isMenuItem)
            x = x.parentNode;
        return x;
    },
    _getRealEvent: function(e) {
        if (typeof e == 'undefined') e = window.event;
        return e;
    },
    _handleTimeout: function(lght, firingObject) {
        if (this.getProperty("timeout") > 0) {
            if (lght) {
                clearTimeout(this.timeout);
            } else {
                if (!firingObject.subMenu || firingObject.subMenu != gActiveContext)
                    this.timeout = setTimeout('contextHide()', this.getProperty("timeout"));
            }
        }
    },
    _hideAllSubs : function(el) {
        var list = el.getElementsByTagName("div");
        for (var i = 0; i < list.length; i++) {
            var element = list[i];
            if (element.subMenu) {
                var subMenu = element.subMenu.getMenu();
                this._hideAllSubs(element.subMenu.getMenu());
                element.subMenu._hideShim();
                hideObject(subMenu);
                this._disableItem(element);
            }
        }
    },
    _setMenuAttrs : function() {
        this.menu.context = this;
        this.menu.className = "context_menu";
        this.menu.style.display = "none";
        this.menu.style.zIndex = (this.getParent() ? 701 : 700);
        this.menu.onmouseover = this.menuHighLight.bind(this);
        this.menu.onmouseout = this.menuLowLight.bind(this);
        this.menu.onclick = this.execute.bind(this);
    },
    _setMinWidth: function() {
        var widther = document.createElement("div");
        widther.style.width = "120px";
        widther.style.height = "1px";
        widther.style.overflow = "hidden";
        this.menu.appendChild(widther);
    },
    _showShim: function(menu) {
        if (this._hasTabs() && !ie5)
            return;
        var shim = this._getShim();
        if (!shim) {
            shim = cel("iframe");
            shim.id = this.getID() + "_shim";
            shim.className = "popup";
            shim.style.width = "1px";
            shim.style.height = "1px";
            shim.scrolling = "no";
            shim.src = "javascript:false;";
            this.parentElement.appendChild(shim);
            this.shim = shim;
        }
        shim.style.zIndex = this.getMenu().style.zIndex - 1;
        shim.style.left = grabOffsetLeft(this.getMenu()) + "px";
        shim.style.top = grabOffsetTop(this.getMenu()) + "px";
        var zWidth = this.getMenu().offsetWidth;
        var zHeight = this.getMenu().offsetHeight;
        if (!ie5) {
            zWidth -= 4;
            zHeight -= 4;
        }
        if (menu.getAttribute('gsft_has_scroll'))
            zWidth -= 18;
        shim.style.width = zWidth + "px";
        shim.style.height = zHeight + "px";
        showObject(shim);
    },
    _hideShim : function () {
        var shim = this._getShim();
        if (shim)
            hideObject(shim);
    },
    _getShim: function () {
        if (this.shim)
            return this.shim;
        var shimName = this.getID() + "_shim";
        return gel(shimName);
    },
    _hasTabs: function() {
        if (gel('TabSystem1'))
            return true;
        return false;
    },
    _toggleMenuItems: function(attr, enabled) {
        var items = this.getMenu().childNodes;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getAttribute(attr) == "true") {
                if (enabled) {
                    this._undullItem(item);
                } else {
                    this._dullItem(item);
                }
            }
        }
    },
    _dullItem: function(item) {
        item.disabled = "disabled";
        item.style.color = "#cccccc";
        removeClassName(item, "context_menu_hover");
    },
    _undullItem: function(item) {
        item.disabled = "";
        item.style.color = "";
    },
    _hideItem: function(item) {
        item.style.display = 'none';
    },
    _showItem: function(item) {
        item.style.display = '';
    },
    _isEmpty: function(menu) {
        if (!menu)
            return true;
        if (!menu.firstChild)
            return true;
        return false;
    },
    z: function() {
    }
});
function _cli(e) {
    if (shouldSkipContextMenu(e))
        return true;
    e = getRealEvent(e);
    var element = Event.element(e);
    if (element.oncontextmenu)
        return; // don't show the global context menu if cell has specific one defined
    if (element.className != 'vt') {
        if (element.className == "linked") { // reference fields in lists should refer to their encompassing TD
            element = element.parentNode;
            if (element.className != 'vt')
                return;
        } else
            return; // only show on vt cells (list body)
    }
    var tableElementDOM = element.offsetParent;
    var glideList = new GlideListEditor(tableElementDOM);
    var name = glideList.getNameFromColumn(element.cellIndex);
    if (!name) // can happen on home page gauges
        return;
    var cell = tableElementDOM.rows[0].cells[element.cellIndex];
    var filterable = tableElementDOM.getAttribute('filterable') == '1';
    var id = tableElementDOM.getAttribute('list_id');
    var idx = name.indexOf(".");
    if (idx == -1) {
        alert('field name missing: ' + name);
        return;
    }
    var fieldName = name.substring(idx+1, name.length);
    var tableName = name.substring(0, idx);
    menuTable = tableName;
    menuField = fieldName;
    rowSysId = getRowID(e);
    var name = "context_item_" + id;
    if (getMenuByName(name)) {
        var contextMenu = getMenuByName(name).context;
        contextMenu.setProperty('sortable', true);
        contextMenu.setProperty('filterable', filterable);
        contextMenu.display(e);
    }
    return false;
}
function contextListHeader(e, tableName, sortable, label, id) {
    if (shouldSkipContextMenu(e))
        return true;
    e = getRealEvent(e);
    var fieldName = "";
    var idx = tableName.indexOf(".");
    if (idx > -1) {
        fieldname = tableName.substring(idx+1, tableName.length);
        tableName = tableName.substring(0, idx);
    }
    menuTable = tableName;
    menuField = fieldname;
    menuLabel = label;
    rowSysId = getRowID(e);
    var name = "context_header_" + id;
    if (getMenuByName(name)) {
        var contextMenu = getMenuByName(name).context;
        contextMenu.setProperty('sortable', sortable);
        contextMenu.setProperty('filterable', true);
        contextMenu.display(e);
    }
    return false;
}
function contextShow(e, tableName, timeoutValue, ttop, lleft, /*optional*/rright){
    if (shouldSkipContextMenu(e))
        return true;
    e = getRealEvent(e);
    menuTable = tableName;
    var name = tableName;
    if (name && name.substring(0, 8) != "context_")
        name = "context_" + name;
    if (document.readyState && document.readyState != "complete" && typeof window.g_hasCompleted == "undefined") {
        jslog("Ignored context menu show for " + name + " because document was not ready");
        return false;
    }
    window.g_hasCompleted = true; // made it to a readyState once
    if (getMenuByName(name)) {
        var contextMenu = getMenuByName(name).context;
        contextMenu.setProperty('timeout', timeoutValue);
        contextMenu.setProperty('top', ttop);
        contextMenu.setProperty('left', lleft);
        contextMenu.setProperty('right', rright);
        contextMenu.display(e);
        if (contextMenu.onshow)
            contextMenu.onshow();
    }
    return false;
}
function contextQuestionLabel(e, sys_id) {
    if (shouldSkipContextMenu(e))
        return true;
    e = getRealEvent(e);
    var name = "context_question_label";
    menuTable = "not_important";
    menuField = "not_important";
    rowSysId = sys_id;
    if (getMenuByName(name)) {
        var contextMenu = getMenuByName(name).context;
        contextMenu.setProperty('sysparm_sys_id', sys_id);
        contextMenu.display(e);
    }
    return false;
}
function shouldSkipContextMenu(e) {
    if (e.ctrlKey && trustCtrlKeyResponse())
        return true;
    return false;
}
function trustCtrlKeyResponse() {
    return isMacintosh || !isSafari;
}
function contextTimeout(e, tableName, /* optional */waitCount) {
    var name = "context_" + tableName;
    if (getMenuByName(name)) {
        var contextMenu = getMenuByName(name).context;
        if (typeof waitCount == "undefined")
            waitCount = 500;
        contextMenu.setProperty("timeout", waitCount);
        var hideParam;
        if (contextMenu.hideOnlySelf == true)
            hideParam = '"' + name + '"';
        contextMenu.setTimeout(setTimeout('contextHide(' + hideParam + ')', waitCount));
    }
}
function getMenuByName(name) {
    return contextMenus[name];
}
function getRowID(e) {
    var id = null;
    var cell = e.srcElement;
    if (cell == null)
        cell = e.target;
    var row = cell.parentNode;
    var id = row.id;
    if (id == null || id.length == 0)
        id = row.parentNode.id;
    return id;
}
function contextHide(/*optional*/ name) {
    if (gActiveContext) {
        if (typeof name != "undefined" && gActiveContext.getID() != name)
            return;
        if (gActiveContext.beforehide) {
            if (gActiveContext.beforehide()==false)
                return;
        }
        gActiveContext.hideAll();
    }
}
function elementAction(e, event, gcm) {
    var type = e.getAttribute("type");
    var choice = e.getAttribute("choice");
    var id = e.id;
    var fName = id.substring(id.indexOf('.')+1);
    var tableName = fName.substring(0, fName.indexOf('.'));
    var haveAccess = $("personalizer_" + tableName);
    if (typeof(g_user) != 'undefined') {
        var count = 1;
        if (!gcm)
            gcm = addActionItems(fName, tableName, type, choice);
        if (gcm)
            return contextShow(event, gcm.getID(), -1, 0, 0);
    }
    return true;
}
function addActionItems(id, table, type, choice) {
    var jr = new GlideAjax("AJAXJellyRunner", "AJAXJellyRunner.do");
    jr.addParam('template', 'element_context.xml');
    jr.addParam('sysparm_id', id);
    jr.addParam('sysparm_table', table);
    jr.addParam('sysparm_type', type);
    jr.addParam('sysparm_choice', choice);
    jr.addParam('sysparm_contextual_security', g_form.hasAttribute('contextual_security'));
    jr.setWantRequestObject(true);
    var response = jr.getXMLWait();
    if (!response)
        return;
    var html = response.responseText;
    html.evalScripts(true);
    return gcm;
}
Event.observe(window, 'unload', clearMenus, false);
function clearMenus() {
    for(av in contextMenus) {
        if (contextMenus[av]) {
            var c = contextMenus[av].context;
            if (c) {
                c.destroy();
            }
            contextMenus[av] = null;
        }
    }
}