//include classes/ui/GlideContextMenu.js
/**
* Primary class for display a context menu. The class allows for dynamic creation, icon styles, text styles,
* event handling, conditional logic prior to and after closing of menus. To create a GlideContextMenu create a
* new object using the following syntax:
*
*   var menu = new GlideContextMenu(config);
*
* The constructor takes one argument that is defined as follows.
* config = {
*    id:                String      Specifies the id attribute of the menu to be created.
*    appendTo:          Element     Specifies the parent element to bind the current context menu.
*    openOnClick: {
*      elem:            Element     Specifies the element that will trigger opening the context menu when clicked.
*      delegate:        String      A string selector that will be used to delegate the event from the specified element to the selector.
*      right:           Boolean     If <tt>true</tt>, will open the menu on right click. (Default == false)
*      reOpenOnClick    Boolean     A boolean that specifies whether or not to re-open the context menu in the case
*                                  when the menu is OPEN and the specified [elem/delegate] is registered. If <tt>false</tt>
*                                  the menu will be closed. (Default == true).
*    }
*    openOnHover: {
*      elem:            Element     Specifies the element that will trigger opening the context menu when hovered.
*      delegate:        String      A string selector that will be used to delegate the event from the specified element to the selector.
*    }
*
*    // The following events are callbacks that are thrown appropriately before and after a context menu is opened or closed.
*    // Each event callback receives the following two arguments:
*    //   event: The event object that triggered the opening or closing of the menu.
*    //    elem: The element that triggered the opening of the context menu. Note that the same element will be thrown
*    //          for reference when the context menu's are closed.
*    onBeforeOpen:      Function(event, elem)
*    onAfterOpen:       Function(event, elem)
*    onBeforeClose: Function(event, elem)
*    onAfterOpen:       Function(event, elem)
* }
*
* Public API Methods:
*    clear()                // Removes all GlideContextMenuElements associated with this context menu.
*    getID()                // Returns the unique ID for the context menu.
*    getContextMenu()       // Returns the context menu element.
*    getDelegatedElement()  // Returns the element that was used to open the current context menu.
*    isSubMenu()            // Returns a boolean that specifies whether or not the current menu is a sub-menu.
*    isVisible()            // Returns a boolean specifying whether the current context menu is visible or not.
*    isPositionedVerticallyBelow()  // Returns a boolean that specifies if the current menu is positioned below the cursor.
*    isPositionedHorizontallyRight()    // Returns a boolean that specifies if the current menu is positioned right of the cursor.
*
* Row Manipulation Public API Methods:
*    addRow(config)
*    prependRow(config)
*    addHtmlBlock(config)
*    prependHtmlBlock(config)
*    addSeparator(config)
*    prependSeparator(config)
*    removeRow(id)
*/
var _glideContextMenus = [];
var GlideContextMenu = Class.create({
    initialize: function(config) {
        this.config = Object.extend({
            id: guid(),
            appendTo: null,
            onBeforeOpen: Prototype.emptyFunction,
            onAfterOpen: Prototype.emptyFunction,
            onBeforeClose: Prototype.emptyFunction,
            onAfterClose: Prototype.emptyFunction,
            display: {
                openedElem: null,
                isPositionedVerticallyBelow: true,
                isPositionedHorizontallyRight: true,
                isSubMenu: false,
                isVisible: false
            }
        }, config || {});
        this.config.openOnClick = Object.extend({
            elem: null,
            delegate: null,
            right: false,
            reOpenOnClick: true
        }, this.config.openOnClick || {});
        this.config.openOnHover = Object.extend({
            elem: null,
            delegate: null
        }, this.config.openOnHover || {});
        this.rowElements = [];
        this.contextWrapper = $(document.createElement('div'));
        this.contextWrapper.className = 'cm_menuwrapper';
        this.contextWrapper.id = this.config.id;
        this.contextWrapper.innerHTML = '<div class="cm_menu"><table class="cm_table"><tbody class="cm_body"></tbody></table></div>';
        (this.config.appendTo || document.body).appendChild(this.contextWrapper);
        this.contextMenu = this.contextWrapper.select('.cm_menu')[0];
        this.contextBody = this.contextWrapper.select('.cm_body')[0];
        if (this.config.openOnClick.elem && this.config.openOnClick.right === true)
            this._bindMenuListener('contextmenu', this.config.openOnClick, this._menuClickOpener);
        else if (this.config.openOnClick.elem)
            this._bindMenuListener('click', this.config.openOnClick, this._menuClickOpener);
        else if (this.config.openOnHover.elem)
            this._bindMenuListener('mouseover', this.config.openOnHover, this._menuHoverOpener);
        _glideContextMenus.push(this);
    },
    clear: function() {
        this.rowElements = [];
        var i = this.contextBody.rows.length;
        while (i--)
            this.contextBody.deleteRow(i);
    },
    getID: function() {
        return this.config.id;
    },
    getContextMenu: function() {
        return this.contextWrapper;
    },
    getDelegatedElement: function() {
        return this.config.display.openedElem;
    },
    isSubMenu: function() {
        return this.config.display.isSubMenu;
    },
    isPositionedVerticallyBelow: function() {
        return this.config.display.isPositionedVerticallyBelow;
    },
    isPositionedHorizontallyRight: function() {
        return this.config.display.isPositionedHorizontallyRight;
    },
    isVisible: function() {
        return this.config.display.isVisible;
    },
    addRow: function(config) {
        return this._injectRow(GlideContextMenuText, config);
    },
    prependRow: function(config) {
        config = config || {};
        config.position = 0;
        return this._injectRow(GlideContextMenuText, config);
    },
    addHtmlBlock: function(config) {
        return this._injectRow(GlideContextMenuHtmlBlock, config);
    },
    prependHtmlBlock: function(config) {
        config = config || {};
        config.position = 0;
        return this._injectRow(GlideContextMenuHtmlBlock, config);
    },
    addSeparator: function(config) {
        return this._injectRow(GlideContextMenuSeparator, config);
    },
    prependSeparator: function(config) {
        config = config || {};
        config.position = 0;
        return this._injectRow(GlideContextMenuSeparator, config);
    },
    removeRow: function(obj) {
        switch (typeof obj) {
            case  'GlideContextMenuElement':
                return this._removeByRow(obj);
            case 'string':
                return this._removeRowById(obj);
        }
    },
    _removeRowByRow: function(r) {
        var i = this.rowElements.length;
        while (i--) {
            if (this.rowElements[i] == r) {
                this.rowElements.splice(i, 1);
                return;
            }
        }
    },
    _removeRowById: function(id) {
        var i = this.rowElements.length;
        while (i--) {
            if (this.rowElements[i].getID() == id) {
                this.rowElements.splice(i, 1);
                this.contextBody.deleteRow(i);
                return;
            }
        }
    },
    _injectRow: function(klass, config) {
        config = config || {};
        var arrayPos = this._getRowArrayPosition(config.position);
        switch (arrayPos) {
            case -1:
                var item = new klass(config, this.contextBody.insertRow(this.contextBody.rows.length));
                this.rowElements.push(item);
                break;
            case 0:
                var item = new klass(config, this.contextBody.insertRow(0));
                this.rowElements.unshift(item);
                break;
            default:
                var item = new klass(config, this.contextBody.insertRow(arrayPos));
                this.rowElements.splice(arrayPos, 0, item);
                break;
        }
        return item;
    },
    _getRowArrayPosition: function(rowConfigPosition) {
        if (typeof rowConfigPosition === "undefined")
            return -1;
        for (var i = 0, l = this.rowElements.length; i < l; i++) {
            var r = this.rowElements[i];
            if (r.config.position >= rowConfigPosition || r.config.position == -1)
                return i;
        }
        return -1;
    },
    _bindMenuListener: function(eventName, openConfig, f) {
        if (openConfig.delegate) {
            $(openConfig.elem).on(eventName, openConfig.delegate, function(event, elem) {
                return f.call(this, event, elem);
            }.bind(this));
            return;
        } else {
            $(openConfig.elem).observe(eventName, function(event) {
                return f.call(this, event, openConfig.elem);
            }.bind(this));
        }
    },
    _menuClickOpener: function(event, elem) {
        if (this.config.display.isVisible && this.config.openOnClick.reOpenOnClick === false)
            return this._documentClickHandler(event);
        GlideContextMenu.closeAllMenus(event);
        event.stop();
        this._documentListener = this._documentClickHandler.bindAsEventListener(this);
        $(document).observe('click', this._documentListener);
        this._show(event, elem);
    },
    _menuHoverOpener: function(event, elem) {
        if (this.config.display.isVisible)
            return;
        event.stop();
        this._elemListener = this._elementMouseLeaveHandler.bindAsEventListener(this),
        elem.observe('mouseleave', this._elemListener);
        this._show(event, elem);
    },
    _elementMouseLeaveHandler: function(event) {
        this._hide(event);
    },
    _documentClickHandler: function(event) {
        if (this.config.openOnClick.reOpenOnClick !== true || this.config.display.isVisible !== true ||
            (this.config.openOnClick.right === true && event.which === 1))
            event.stop();
        this._hide(event);
    },
    _show: function(event, elem) {
        this.config.onBeforeOpen.call(this, event, elem);
        for (var i = 0, l = this.rowElements.length, r, lastVisible = null; i < l; i++) {
            r = this.rowElements[i];
            if (r.isSeparator() && (lastVisible == null || lastVisible.isSeparator()))
                r.getRowElement().hide();
            else if (!r.isSeparator() && !r.showRow())
                r.getRowElement().hide();
            else {
                r.getRowElement().show();
                lastVisible = r;
            }
        }
        if (lastVisible && lastVisible.isSeparator())
            lastVisible.getRowElement().hide();
        this.autoPosition(event);
        this.contextWrapper.setStyle({
            display: 'block',
            visibility: ''
        });
        this.config.display.openedElem = elem; // Save the element that initiated the open
        this.config.display.isVisible = true;
        this.config.onAfterOpen.call(this, event, elem);
    },
    _hide: function(event) {
        if (this.config.display.isVisible !== true)
            return;
        this.config.onBeforeClose.call(this, event, this.config.display.openedElem);
        if (this._documentListener) {
            $(document).stopObserving('click', this._documentListener);
            this._documentListener = null;
        }
        else if (this._elementListener) {
            this.config.display.openedElem.stopObserving('mouseleave', this._elemListener);
            this._elementListener = null;
        }
        this.contextWrapper.style.visibility = 'hidden';
        this.config.onAfterClose.call(this, event, this.config.display.openedElem);
        this.config.display.openedElem = null;
        this.config.display.isVisible = false;
        setTimeout(function() {
            if (this.config.display.isVisible !== true)
                this.contextWrapper.setStyle({
                    display: 'none',
                    visibility: ''
                });
        }.bind(this), 0);
    },
    autoPosition: function(event) {
        var clone = Element.clone(this.contextMenu, true);
        $(clone).removeAttribute('style');
        clone.setStyle({
            top:0,
            left:0,
            display:'block',
            visibility:'visible'
        });
        $(document.body).appendChild(clone);
        this.contextWrapper.removeAttribute('style');
        this.contextMenu.removeAttribute('style');
        var winDimensions = document.viewport.getDimensions();
        var winScrollOffsets = document.viewport.getScrollOffsets();
        var winWidth = winDimensions.width;
        var winHeight = winDimensions.height;
        var winSL = winScrollOffsets.left;
        var winST = winScrollOffsets.top;
        var layout = clone.getLayout();
        var width = layout.get('border-box-width') + 2;     // +2 For Shading
        var height = layout.get('border-box-height') + 2;   // +2 For Shading
        clone.remove();
        if (this.isSubMenu()) {
            var tmpParent = this.contextWrapper.up('.cm_menuwrapper', 0).parentNode;
            var tmpOffset = Element.cumulativeOffset(tmpParent);
            var pLayout = Element.getLayout(tmpParent);
            this._positionHorizontal(tmpOffset.left, pLayout.get('width'), width, winWidth, winSL);
            this._positionVertical(tmpOffset.top, width, height, winHeight, winST);
        } else if (this.config.appendTo) {
            var tmpParent = this.contextWrapper.parentNode;
            var tmpOffset = Element.cumulativeOffset(tmpParent);
            var pLayout = Element.getLayout(tmpParent);
            this._positionHorizontalBoundedPrimary(tmpOffset.left, pLayout.get('width'), width, winWidth, winSL);
            this._positionVerticalBoundedPrimary(tmpOffset.top, pLayout.get('height'), width, height, winHeight, winST);
        } else {
            this._positionHorizontal(event.pageX, 0, width, winWidth, winSL);
            this._positionVertical(event.pageY, width, height, winHeight, winST);
        }
    },
    _positionHorizontal: function(cL, pW, cW, winWidth, winSL) {
        if (cL + pW + cW + 2 < winWidth + winSL) {
            this.contextWrapper.setStyle(this.config.appendTo ? {
                right:0
            }: {
                left:cL + 'px'
                });
            this.contextMenu.style.left = 0;
            this.config.display.isPositionedHorizontallyRight = true;
        } else {
            var r = cL - cW - winSL;
            this.contextWrapper.setStyle(this.config.appendTo ? {
                left:0
            } : {
                left:cL + 'px'
                });
            this.contextMenu.style.right = (r < 0 ? r : 0) + 'px';
            this.config.display.isPositionedHorizontallyRight = false;
        }
    },
    _positionHorizontalBoundedPrimary: function(cL, pW, cW, winWidth, winSL) {
        var l = winWidth + winSL - cW - 2;
        if (cL + cW + 2 < winWidth + winSL) {
            this.contextWrapper.style.left = '0px';
            this.contextMenu.style.left = '0px';
            this.config.display.isPositionedHorizontallyRight = false;
        } else {
            var r = cL + pW - cW;
            this.contextWrapper.style.right = '0px';
            this.contextMenu.style.right = (r > 0 ? 0 : r) + 'px';
            this.config.display.isPositionedHorizontallyRight = true;
        }
    },
    _positionVertical: function(cT, cW, cH, winHeight, winST) {
        if (cT + cH < winHeight + winST) {
            this.contextWrapper.setStyle({
                top:(this.config.appendTo ? 0 : cT) + 'px',
                bottom:''
            });
            this.contextMenu.setStyle({
                top:0,
                bottom:''
            });
            this.config.display.isPositionedVerticallyBelow = true;
        } else if (cT - cH > winST) {
            this.contextWrapper.setStyle(this.config.appendTo ? {
                bottom:0
            } : {
                top:cT + 'px'
                });
            this.contextMenu.setStyle({
                bottom:0,
                top:''
            });
            this.config.display.isPositionedVerticallyBelow = false;
        } else if (cH < winHeight) {
            this.contextWrapper.setStyle({
                top:(winHeight - cH - (this.config.appendTo ? cT : 0) + winST) + 'px'
                });
            this.contextMenu.setStyle({
                top:0
            });
            this.config.display.isPositionedVerticallyBelow = true;
        } else {
            this.contextWrapper.setStyle({
                top:(1 - (this.config.appendTo ? cT : 0) + winST) + 'px'
                });
            this.contextMenu.setStyle({
                top:0,
                height:(winHeight - 3) + 'px',
                overflowY:'auto',
                width:(cW + getScrollBarWidthPx()) + 'px'
                });
            this.config.display.isPositionedVerticallyBelow = true;
        }
    },
    _positionVerticalBoundedPrimary: function(cT, pH, cW, cH, winHeight, winST) {
        if (cT + pH + cH < winHeight + winST) {
            this.contextWrapper.setStyle({
                bottom:0,
                top:''
            });
            this.contextMenu.setStyle({
                top:'-1px',
                bottom:''
            });
            this.config.display.isPositionedVerticallyBelow = true;
        } else if (cT - cH > winST) {
            this.contextWrapper.setStyle({
                top:0,
                bottom:''
            });
            this.contextMenu.setStyle({
                bottom:'-1px',
                top:''
            });
            this.config.display.isPositionedVerticallyBelow = false;
        } else {
            this.contextWrapper.setStyle({
                bottom:0,
                top:''
            });
            this.contextMenu.setStyle({
                top:'-1px',
                bottom:'',
                height:(winHeight + winST - cT - pH - 3) + 'px',
                overflowY:'auto',
                width:(cW + getScrollBarWidthPx()) + 'px'
                });
            this.config.display.isPositionedVerticallyBelow = true;
        }
    }
});
GlideContextMenu.closeAllMenus = function(event) {
    for (var i = 0, l = _glideContextMenus.length; i < l; i++)
        _glideContextMenus[i]._hide(event);
}
GlideContextMenu.getMenu = function(id) {
    for (var i = 0, l = _glideContextMenus.length; i < l; i++) {
        if (_glideContextMenus[i].getId() == id)
            return _glideContextMenus[i];
    }
    return null;
}
//include classes/ui/GlideContextMenuElement.js
/**
* Abstract glide context menu element that defines core functions that are referenced by the GlideContextMenu
* class. This object defines the structure and injection methods such that different rows can be created
* with appropriate style within a GlideContextMenu. The base configuration that is used by the menu element
* includes the following configuration options:
*
* new GlideContextMenuElement(config = {
*    id:                String      // Specifies a unique ID for the row cell
*    showCondition:     Function    // A function that can determine whether or not to show the row at run-time
*                                   // Note: This function should return a boolean. (Default == null)
*    position:          Number      // Specifies the order position of the context menu. Special values:
*                                   //   -1:    The row will be injected at the end of the menu.
*                                   //    0:    The row will be injected at the beginning of the menu.
*                                   // (Default == -1)
* });
*
* Public API Methods:
*    getID();               // Returns the ID for the current context menu element.
*    getRowElement();       // Returns the prototype wrapped row element (<tr>).
*    getCellElement();      // Returns the prototype wrapped cell element (<td>)
*    isSeparator();     // Returns a boolean that specifies whether or not the current row is a separator.
*    hasSubMenu();          //
*    showRow();         //
*    setRowData();          //
*/
var GlideContextMenuElement = Class.create({
    initialize: function(config, tr) {
        this.config = Object.extend({
            id: guid(),
            showCondition: null,
            position: -1,
            isSeparator: false
        }, config || {});
        this.rowElement = $(tr);
        this.cellElement = this.rowElement.insertCell(0);
        this.cellElement.className = 'cm_row';
        this.cellElement.id = this.config.id;
    },
    getID: function() {
        return this.config.id;
    },
    getRowElement: function() {
        return this.rowElement;
    },
    getCellElement: function() {
        return this.cellElement;
    },
    isSeparator: function() {
        return this.config.isSeparator;
    },
    showRow: function() {
        if (this.config.showCondition && typeof this.config.showCondition == 'function')
            return this.config.showCondition.call(this);
        return true;
    },
    setRowData: function(s) {
        this.cellElement.innerHTML = s;
    },
    toString: function() {
        return 'GlideContextMenuElement';
    }
});
//include classes/ui/GlideContextMenuHtmlBlock.js
/**
* Glide context menu html block used by the GlideContextMenu. Since elements are built live, callers must
* delegate event handlers to the top level parents outside the GlideContextMenu to ensure the events are thrown.
* Additionally, callers should implement their own styles and overrides for the row/column blocks for hovering
* and mouse positions. To emulate similar behavior to the defualt context menu, use styles from
* [ theme_context_menu.css ].
*
* config = {
*    html           String      Specifies the innerHTML to inject into the row column cell.
* }
*/
var GlideContextMenuHtmlBlock = Class.create(GlideContextMenuElement, {
    initialize: function($super, config, tr) {
        $super(config, tr);
        this.setRowData(this.config.html);
    },
    toString: function() {
        return 'GlideContextMenuHtmlBlock';
    }
});
//include classes/ui/GlideContextMenuSeparator.js
/**
* Specific type of GlideContextMenuElement that displays horizontal separators.
*/
var GlideContextMenuSeparator = Class.create(GlideContextMenuElement, {
    initialize: function($super, config, tr) {
        $super(Object.extend({
            isSeparator: true
        }, config || {}), tr);
        this.setRowData('<div class="cm_separator_div"></div>');
    },
    toString: function() {
        return 'GlideContextMenuSeparator';
    }
});
//include classes/ui/GlideContextMenuText.js
/**
* Glide context menu row used by the GlideContextMenu. The constructor accepts an object that can have the following
* parameters that are additional to those allowed by the GlideContextMenuElement.
*
* config = {
*    className          String      Specifies the class name for the anchor element.
*    text               String      Specifies the text to display inside the row.
*    link               String      Specifies an explicit link to redirect the user when the row is clicked.
*    showCondition      Function    Specifies a function that determines whether the row is shown based upon the return value.
*    onclick            Function    Specifies the function to execute if clicked
*    enabled            Boolean     Prevent the link href or callback from happening. (Default == true).
*    iconClass          String      Specifies the name of the class to use for the icon. If not specified, no icon will be displayed.
*    data               Object      Object with one or many name-value pairs that will be joined into an attribute as "data-name" for each.
*    dataIcon           Object      Object with one or many name-value pairs that will be joined into an attribute as "data-name" for each on the icon span.
*    checked            Boolean     If true, a checkmark is shown to the left of the text.
* }
*
* Public API Methods:
*    isEnabled()
*    enableRow()
*    disableRow()
*    setText(strText)
*    setChecked(Boolean)
*    setIconClass()
*    setIconDataAttribute()
*    getAnchorLink()
*    setAnchorLink(String)
*    setOnClick(Function)
*/
var GlideContextMenuText = Class.create(GlideContextMenuElement, {
    initialize: function($super, config, tr) {
        $super(Object.extend({
            link: '#',
            className: null,
            iconClass: null,
            data: {},
            dataIcon: {},
            checked: false,
            enabled: true,
            onclick: Prototype.emptyFunction
        }, config || {}), tr);
        this.setRowData('<a href="' + this.config.link + '"' +
            (this._getDataAttributes(this.config.data)) +
            (this.config.className ? ' class="' + this.config.className + '"' : '') +
            '><span class="cm_rowcontainer"><span class="cm_iconspacer"></span><span class="cm_textspacer">' +
            this.config.text + '</span></span></a>');
        this.setOnClick(this.config.onclick);
        this._updateIcon();
        if (this.config.enabled === false)
            this.disableRow();
    },
    isEnabled: function() {
        return this.config.enabled;
    },
    enableRow: function() {
        this.getRowElement().removeClassName('cm_disabled');
        this.config.enabled = true;
    },
    disableRow: function() {
        this.getRowElement().addClassName('cm_disabled');
        this.config.enabled = false;
    },
    setText: function(t) {
        this.getRowElement().select('span.cm_textspacer')[0].innerHTML = t;
    },
    setChecked: function(flag) {
        this.config.checked = !!flag;
        this._updateIcon();
    },
    setIconClass: function(c) {
        this.config.iconClass = c;
        this._udpateIcon();
    },
    setIconDataAttribute: function(prop) {
        this.config.dataIcon = prop;
        this._udpateIcon();
    },
    _updateIcon: function() {
        var s = '';
        if (this.config.checked || this.config.iconClass || this.config.dataIcon) {
            s += '<span';
            if (this.config.checked || this.config.iconClass)
                s += ' class="' + (this.config.checked ? 'i16 i16_check_small' : this.config.iconClass) + '"';
            s += this._getDataAttributes(this.config.dataIcon) + '></span>'
        }
        this.getRowElement().select('span.cm_iconspacer')[0].innerHTML = s;
    },
    _getDataAttributes: function(d) {
        var s = '';
        for (var i in d)
            s += ' ' + 'data-' + i + '="' + d[i] + '"';
        return s;
    },
    addSubMenu: function(config) {
        this.getRowElement().select('a:first')[0].addClassName('cm_arrow');
        config = Object.extend({
            appendTo: this.getCellElement(),
            openOnHover: {
                elem: this.getRowElement()
            },
            display: {
                isSubMenu: true
            }
        }, config || {});
        return new GlideContextMenu(config);
    },
    getAnchorLink: function(l) {
        return this.config.link;
    },
    setAnchorLink: function(anchor) {
        this.config.link = anchor;
        this.getRowElement().select('a:first').setAttribute('href', anchor);
    },
    setOnClick: function(f) {
        if (typeof f != 'function')
            return;
        var self = this;
        this.getRowElement().select('a')[0].observe('click', function(event) {
            if (!self.config.enabled)
                return;
            f.call(self, event, this);
        });
    },
    toString: function() {
        return 'GlideContextMenuText';
    }
});