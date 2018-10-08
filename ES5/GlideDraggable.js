//defer classes/ui/GlideDraggable.js
/**
* Class that provides dragging capability for a new or existing element across the screen.
*
* Example 1 -- Perform dragging on an existing element that exists on the screen:
*
*       var gd = new GlideDraggable($('id_of_hover_element'));
*       gd.setHoverCursor('move');
*       gd.setDragCursor('crosshair');
*       gd.setStartFunction(function(e, dragElem, pageCoords, shift, dragCoords) { console.log('Drag start ...'); });
*       gd.setDragFunction(function(e, dragElem, pageCoords, shift, dragCoords) { console.log('Dragging.'); });
*       gd.setEndFunction(function(e, dragElem, pageCoords, shift, dragCoords) { console.log('Drag end ...'); };
*
* Example 2 -- Dynamically create the Draggable after receiving the mousedown event in a pre-existing function.
*
*      function existingMouseDownListener(mouseDownEvent, otherParam1, otherParam2) {
*        // Do other processing
*        // ...
*        console.log('Mouse down event occurred from "existingMouseDownListener()" listener.');
*
*        // Now create the dragger to begin immediately
*         var gd = new GlideDraggable($('id_of_my_element'));
*         gd.setHoverCursor('move');
*         gd.setDragCursor('crosshair');
*         gd.setDragFunction(function(e, dragElm, pageCoords, shift, dragCoords) { console.log('Dragging.'); });
*         gd.setEndFunction(function(e, dragElm, pageCoords, shift, dragCoords) { console.log('Drag end ...'); };
*
*        // Notice there is no setStartFunction(). This is because the event has already occurred. We initiate the
*        // dragger by throwing executing the start(event) function manually.
*        gd.start(mouseDownEvent);
*      }
*
* CONSTRUCTOR API:
*  new GlideDraggable(objHover, objDrag) -- Instantiates a new GlideDraggable object
*     objHover   [Required]  -- Specifies the ID or the actual DOM element as the hover element.
*     objDrag    [Optional]  -- Specifies the ID or the actual DOM element for the draggable element. This is not required
*                               and, by default, will be set to the hover element if not specified.
*
* METHOD API:
*  setDragCursor(string) -- Sets the cursor style when the drag element is being moved.
*  setHoverCursor(string) -- Sets the cursor style for when the hover element is being hovered over.
*  setDragElm(element) -- Sets the current element that is being dragged. This is important for cursor manipulation. By
*                         default the drag element is the hover elm.
*  setStartFunction(function) -- Throws the specified function (instead of the default) when the 'domElement' is initially clicked.
*  setDragFunction(function) -- Throws the specified function (instead of the default) when dragging of the 'domElement' is occurring.
*  setEndFunction(function) -- Throws the specified function (instead of the default) when the user has released the mouse from dragging.
*  setAutoScrollLeft(f, x) -- Autoscroll function f when bounds left are exceeded. If x is not specified, it's calculated from the boundElem.
*  setAutoScrollRight(f, x) -- Autoscroll function f when bounds right are exceeded. If x is not specified, it's calculated from the boundElem.
*  setAutoScrollTop(f, y) -- Autoscroll function f when bounds top are exceeded. If x is not specified, it's calculated from the boundElem.
*  setAutoScrollBottom(f, y) -- Autoscroll function f when bounds left are exceeded. If x is not specified, it's calculated from the boundElem.
*  addAllowedTargetClass(string) -- Function that adds a specified class restriction that is applicable if a start function was specified. By
*                                   default the dragger will start upon mousedown for any classname. However, by specifying a class restriction
*                                   the dragger will only execute the start (and subsequent movements) only if the target element classname is
*                                   equal to one of the classes specified. This is very important for absolute positioned elements that overlap
*                                   and both perform dragging. This is because the event will continue to propagate through the DOM
*                                   (The first draggable will not stop the event).
*
* NOTE: Each function specified in the dragging setters (setStartFunction(), setDragFunction(), & setEndFunction()) will
*       receive function arguments in the following format:
*
*  function f(e, dragElem, pageCoords, shift, dragCoords)
*    e          -- Specifies the event that occurred.
*    dragElem   -- Specifies the current element that is being dragged.
*    pageCoords -- Object { x: , y: } that specifies the current x and y coordinates of the mouse pointer relative to the page.
*    shift      -- Object { x: , y: } that specifies the current shift amount from the last mouse movement.
*    dragCoords -- Object { x: , y: } that specifies the current x & y coordinates of the element relative to its initial position.
*
* NOTE: If the hover element has an existing double click event function ('ondblclick'), make sure the dragging element
*       is either the same element or has a lower z-index. If this is not possible, extend this class to handle
*       throwing a manually generated double click event after two successive mousedown/mouseup events. See
*       TimelineSpanCenterDragger.js for an example.
*
*/
var GlideDraggable = Class.create({
    V_SCROLL_REFRESH_FREQ_MS: 70,
    H_SCROLL_REFRESH_FREQ_MS: 50,
    initialize: function(hoverElem, dragElem) {
        this.setHoverElem(hoverElem);
        if (this.hoverElem == null)
            return;
        this.setDragElm(dragElem || this.hoverElem);
        this.boundElem = document.body;
        this.setDragFunction(this.genericDrag);
        this.onScroll = {};
        this.allowedClasses = [];
    },
    destroy: function() {
        this.reset();
        this.hoverElem = null;
        this.dragElem = null;
        this.boundElem = null;
        this.onStart = null;
        this.onDrag = null;
        this.onScroll = null;
        this.onEnd = null;
    },
    reset: function() {
        clearInterval(this.leftScrollId);
        clearInterval(this.rightScrollId);
        clearInterval(this.topScrollId);
        clearInterval(this.bottomScrollId);
        this.leftScrollId = null;
        this.rightScrollId = null;
        this.topScrollId = null;
        this.bottomScrollId = null;
        delete this._origDragElmCoords;
        delete this._origPageCoords;
        delete this._shift;
        delete this._pageCoords;
        delete this._dragElmCoords;
    },
    /** ============================================================================================================= */
    /** ----------------------------------------- GENERIC METHODS --------------------------------------------------- */
    /** ============================================================================================================= */
    genericDrag: function(e, dragElem, pageCoords, shift, dragCoords) {
        dragElem.style.left = dragCoords.x + 'px';
        dragElem.style.top = dragCoords.y + 'px';
    },
    /** ============================================================================================================= */
    /** ----------------------------------- PUBLIC DRAGGING FUNCTIONALITY  ------------------------------------------ */
    /** ============================================================================================================= */
    setHoverCursor: function(c) {
        this.hoverCursor = c;
        this.hoverElem.style.cursor = c;
    },
    setHoverElem: function(obj) {
        this.hoverElem = obj instanceof jQuery ? $(obj[0]) : $(obj);
        if (this.hoverElem) {
            this.hoverElem.onselectstart = function() {
                return false;
            }; // IE
            this.hoverElem.style.MozUserSelect = "none"; // FF
        }
    },
    getHoverElem: function() {
        return this.hoverElem;
    },
    setDragCursor: function(c) {
        this.dragCursor = c;
        if (this.pageShim)
            this.pageShim.style.cursor = this.dragCursor;
    },
    setDragElm: function(obj) {
        this.dragElem = !!(obj && obj.nodeType == 1) ? obj : document.getElementById(obj);
    },
    setStartFunction: function(f) {
        $j(this.hoverElem).unbind('mousedown.draggable').bind('mousedown.draggable', this._draggableStart.bind(this));
        this.onStart = f;
    },
    setDragFunction: function(f) {
        this.onDrag = f;
    },
    setEndFunction: function(f) {
        this.onEnd = f;
    },
    setAutoScrollLeft: function(f, x) {
        this.onScroll.LEFT = f;
        this.onScroll.LEFTX = x; // Optional
    },
    setAutoScrollRight: function(f, x) {
        this.onScroll.RIGHT = f;
        this.onScroll.RIGHTX = x; // Optional
    },
    setAutoScrollTop: function(f, y) {
        this.onScroll.TOP = f;
        this.onScroll.TOPX = y; // Optional
    },
    setAutoScrollBottom: function(f, y) {
        this.onScroll.BOTTOM = f;
        this.onScroll.BOTTOMX = y; // Optional
    },
    addAllowedTargetClass: function(className) {
        this.allowedClasses.push(className);
    },
    start: function(event) {
        this._getCoords(event);
        if (GlideContextMenu && typeof GlideContextMenu.closeAllMenus == 'function')
            GlideContextMenu.closeAllMenus();
        $j(document).bind('mousemove.draggable', this._draggableMove.bind(this));
        $j(document).bind('mouseup.dragggable', this._draggableEnd.bind(this));
        if (this.dragCursor)
            this.dragElem.style.cursor = this.dragCursor;
    },
    /** ============================================================================================================= */
    /** --------------------------------------- PRIVATE HELPER FUNCTIONS -------------------------------------------- */
    /** ============================================================================================================= */
    _createPageShim: function() {
        this.pageShim = document.createElement('div');
        this.boundElem.appendChild(this.pageShim);
        this.pageShim.style.top = 0;
        this.pageShim.style.left = 0;
        this.pageShim.style.width = '100%';
        this.pageShim.style.height = '100%';
        this.pageShim.style.position = 'absolute';
        this.pageShim.style.display = 'block';
        this.pageShim.style.zIndex = '9999';
        this.pageShim.style.backgroundColor = $j.browser.msie ? '#ccc' : 'transparent';
        this.pageShim.style.opacity = '0';
        this.pageShim.style.filter = 'alpha(opacity=0)';
        if (this.dragCursor) {
            this.pageShim.style.cursor = this.dragCursor;
            this.dragElem.style.cursor = this.dragCursor;
        }
    },
    _removePageShim: function() {
        if (this.pageShim)
            this.pageShim.parentNode.removeChild(this.pageShim);
        this.pageShim = null;
    },
    _getCoords: function(event) {
        event = event || window.event;
        if (!event.pageX) {
            event.pageX = event.clientX;
            event.pageY = event.clientY;
        }
        if (!this._origPageCoords)
            this._origPageCoords = {
                x:event.pageX,
                y:event.pageY
                };
        if (!this._origDragElmCoords) {
            if (this.dragElem.style.right) {
                var e = $j(this.dragElem);
                this.dragElem.style.left = (e.parent().width() - e.outerWidth() - parseInt(this.dragElem.style.right, 10)) + 'px';
                if (this.dragElem.style.removeAttribute)
                    this.dragElem.style.removeAttribute('right');
                else
                    this.dragElem.style.removeProperty('right');
            }
            this._origDragElmCoords = {
                x:parseInt(this.dragElem.style.left, 10) || $j(this.dragElem).offset().left,
                y:parseInt(this.dragElem.style.top, 10) || $j(this.dragElem).offset().top
                };
        }
        this._shift = !this._pageCoords ? {
            x:0,
            y:0
        } : {
            x:(event.pageX - this._pageCoords.x),
            y:(event.pageY - this._pageCoords.y)
            };
        this._pageCoords = {
            x:event.pageX,
            y:event.pageY
            };
        this._dragElmCoords = {
            x:this._origDragElmCoords.x + (this._pageCoords.x - this._origPageCoords.x),
            y:this._origDragElmCoords.y + (this._pageCoords.y - this._origPageCoords.y)
            };
    },
    _draggableStart: function(event) {
        event = event || window.event;
        event.target = event.target || event.srcElement;
        var l = this.allowedClasses.length;
        if (l > 0) {
            var boolCanStart = false;
            for (var i = 0; i < l; i++) {
                if (event.target.className == this.allowedClasses[i]) {
                    boolCanStart = true;
                    break;
                }
            }
            if (!boolCanStart)
                return true;
        }
        this.start(event);
        return this.onStart(event, this.dragElem, this._pageCoords, this._shift, this._dragElmCoords, this);
    },
    _draggableMove: function(event) {
        this._getCoords(event);
        if (!this.pageShim)
            this._createPageShim();
        if (this._shift.x == 0 && this._shift.y == 0)
            return;
        if (this.onScroll.LEFT && this._pageCoords.x < this.onScroll.LEFTX) {
            if (!this.leftScrollId)
                this.leftScrollId = setInterval(this._autoXScrollerInterceptor.bind(this, this.onScroll.LEFT, this.onScroll.LEFTX), this.H_SCROLL_REFRESH_FREQ_MS);
            if (this._shift.y == 0)
                return;
        } else if (this.onScroll.LEFT && this.leftScrollId && this._pageCoords.x >= this.onScroll.LEFTX) {
            clearInterval(this.leftScrollId);
            this.leftScrollId = null;
        }
        if (this.onScroll.RIGHT && this._pageCoords.x > this.onScroll.RIGHTX) {
            if (!this.rightScrollId)
                this.rightScrollId = setInterval(this._autoXScrollerInterceptor.bind(this, this.onScroll.RIGHT, this.onScroll.RIGHTX), this.H_SCROLL_REFRESH_FREQ_MS);
            if (this._shift.y == 0)
                return;
        } else if (this.onScroll.RIGHT && this.rightScrollId && this._pageCoords.x <= this.onScroll.RIGHTX) {
            clearInterval(this.rightScrollId);
            this.rightScrollId = null;
        }
        if (this.onScroll.TOP && this._pageCoords.y < this.onScroll.TOPX) {
            if (!this.topScrollId)
                this.topScrollId = setInterval(this._autoYScrollerInterceptor.bind(this, this.onScroll.TOP, this.onScroll.TOPX), this.V_SCROLL_REFRESH_FREQ_MS);
            if (this._shift.x == 0)
                return;
        } else if (this.onScroll.TOP && this.topScrollId && this._pageCoords.y >= this.onScroll.TOPX) {
            clearInterval(this.topScrollId);
            this.topScrollId = null;
        }
        if (this.onScroll.BOTTOM && this._pageCoords.y > this.onScroll.BOTTOMX) {
            if (!this.bottomScrollId)
                this.bottomScrollId = setInterval(this._autoYScrollerInterceptor.bind(this, this.onScroll.BOTTOM, this.onScroll.BOTTOMX), this.V_SCROLL_REFRESH_FREQ_MS);
            if (this._shift.x == 0)
                return;
        } else if (this.onScroll.BOTTOM && this.bottomScrollId && this._pageCoords.y <= this.onScroll.BOTTOMX) {
            clearInterval(this.bottomScrollId);
            this.bottomScrollId = null;
        }
        this.onDrag(event, this.dragElem, this._pageCoords, this._shift, this._dragElmCoords, this);
        return false; // For Non-IE & Non-FF based browsers to disable selection
    },
    _autoXScrollerInterceptor: function(f, boundaryX) {
        f(this.dragElem, this._pageCoords.x - boundaryX, this._pageCoords);
    },
    _autoYScrollerInterceptor: function(f, boundaryY) {
        f(this.dragElem, this._pageCoords.y - boundaryY, this._pageCoords);
    },
    _draggableEnd: function(event) {
        this._removePageShim();
        if (this.hoverCursor)
            this.hoverElem.style.cursor = this.hoverCursor;
        $j(document).unbind('mousemove.draggable mouseup.dragggable');
        event.stopPropagation();
        this._getCoords(event);
        var boolReturn = this.onEnd ? this.onEnd(event, this.dragElem, this._pageCoords, this._shift, this._dragElmCoords, this) : true;
        this.reset();
        return boolReturn;
    },
    toString: function() {
        return 'GlideDraggable';
    }
});