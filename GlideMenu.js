/**
* This class is used to add items for a context menu and submenus before the
* menu is displayed. After the items are added, the context menu may be shown
* with this class handling issues such not showing two separators next to each
* other.
*
* In addition to displaying the context menus properly, including sorting the
* items in each menu by their order value, this class supports calling methods
* each time a context menu is shown so that special handling may be
* implemented. This allows for disabling, hiding, etc. specific menu items in
* the context menu based on the state of the system at the time the menu is
* being displayed. For example, the list header context menu might need to
* disable or hide certain items based on the field that the context menu is
* being displayed for.
*
* This class is used by the List V2 context menus in order to bridge the context
* menu definitions in the database (see sys_ui_context_menu.xml) with the
* GwtContextMenu class that is used to display and control the context menus.
*/
var GlideMenu = Class.create();
GlideMenu.prototype = {
    initialize: function(idSuffix) {
        this.suffix = idSuffix;
        this.clear();
    },
    destroy: function() {
        this.clear();
    },
    clear: function() {
        this.menuItems = [];
        this.variables = {};
        this.onShowScripts = [];
    },
    isEmpty: function() {
        for ( var i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].parentId == '')
                return false;
        }
        return true;
    },
    addItem: function(id, parentId, label, type, action, order, img, trackSelected, onShowScript) {
        var item = {};
        item.id = id;
        item.parentId = parentId;
        item.label = label;
        item.type = type;
        item.action = action;
        item.image = img;
        item.trackSelected = (trackSelected == "true");
        item.onShowScript = onShowScript;
        if (!order)
            item.order = 0;
        else
            item.order = order;
        this.menuItems.push(item);
    },
    addAction: function(label, action, order) {
        this.addItem("", "", label, "action", action, order);
    },
    showContextMenu: function(evt, id, variables) {
        this.variables = variables;
        id += this.suffix;
        if (!getMenuByName(id))
            this._createMenu(id);
        var cm = getMenuByName(id);
        if (cm.context.isEmpty())
            return;
        this._loadVariables(variables);
        for ( var i = 0; i < this.onShowScripts.length; i++) {
            var onShow = this.onShowScripts[i];
            g_menu = getMenuByName(onShow.menuId);
            if (!g_menu)
                continue;
            g_menu = g_menu.context;
            if (!g_menu)
                continue;
            g_item = g_menu.getItem(onShow.itemId);
            if (!g_item)
                continue;
            this._runOnShowScript(onShow.script, onShow.itemId);
        }
        this._clearVariables(variables);
        g_menu = null;
        g_item = null;
        return contextShow(evt, id, 0, 0, 0);
    },
    _createMenu: function(id) {
        var cm = new GwtContextMenu(id);
        cm.clear();
        this._sort();
        this._buildMenu("", cm);
    },
    _sort: function() {
        this.menuItems = this.menuItems.sort(function(a, b) {
            var aOrder = parseInt("0" + a.order, 10);
            var bOrder = parseInt("0" + b.order, 10);
            if ((aOrder) < (bOrder)) {
                return -1;
            }
            if ((aOrder) > (bOrder)) {
                return 1;
            }
            return 0;
        });
    },
    _buildMenu: function(parentId, cm) {
        var lastType;
        var itemsAfterLine = 0;
        for ( var i = 0; i < this.menuItems.length; i++) {
            var item = this.menuItems[i];
            if (parentId != item.parentId)
                continue;
            if (lastType == "line" && item.type == "line")
                continue;
            if (lastType == "line" && itemsAfterLine > 0) {
                this._addLine(cm);
                itemsAfterLine = 0;
            }
            lastType = item.type;
            if (lastType == "line")
                continue;
            if (this._addMenuItem(cm, item))
                itemsAfterLine++;
        }
    },
    _addLine: function(cm) {
        cm.addLine();
    },
    _addMenuItem: function(cm, item) {
        var added = true;
        var mi;
        if (item.type == "action") {
            if (!item.action)
                mi = cm.addLabel(item.label);
            else
                mi = cm.addFunc(item.label, this._runMenuAction.bind(this, item), item.id);
        } else if (item.type == "label") {
            mi = cm.addLabel(item.label);
        } else if (item.type == "menu") {
            var sm = new GwtContextMenu(item.id + '_' + this.suffix);
            if (item.trackSelected)
                sm.setTrackSelected(true);
            this._buildMenu(item.id, sm);
            if (sm.isEmpty())
                added = false;
            else
                mi = cm.addMenu(item.label, sm, item.id);
        }
        if (mi && item.image)
            cm.setImage(mi, item.image);
        if (added && item.onShowScript) {
            var o = {};
            o.menuId = cm.id;
            o.itemId = item.id;
            o.script = item.onShowScript;
            this.onShowScripts.push(o);
        }
        return added;
    },
    _runMenuAction: function(item) {
        this._loadVariables(this.variables);
        try {
            eval(item.action);
        } catch (ex) {
            jslog("Error running context menu '" + item.label + "': " + ex);
        }
        this._clearVariables(this.variables);
    },
    _runOnShowScript: function(script, itemId) {
        try {
            eval(script);
        } catch (ex) {
            jslog("Error running onShow script for item '" + itemId + "': " + ex);
        }
    },
    _loadVariables: function(variables) {
        for ( var n in variables) {
            var s = n + '=variables["' + n + '"]';
            eval(s);
        }
    },
    _clearVariables: function(variables) {
        for ( var n in variables) {
            var s = n + '=null;'
            eval(s);
        }
    },
    type: 'GlideMenu'
};