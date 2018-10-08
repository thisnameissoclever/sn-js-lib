//include classes/GlideTabs2.js
/**
* Manage a tabstrip and the tab sections
*
* Usage:
*    tabs2 = new GlideTabs2(classNameOfTabbedElements, parentElement, offset);
*
* Requires:
*    The following for the tab strip:
*       <div class="tabs2_strip" id="must_match_the_classNameOfTabbedElements_from_above">
*           <!-- hack for IE bug when tab strip causes a horizontal scroll bar to appear -->
*           <img src="images/s.gifx" height="1px" width="1px" style="margin-right: 0px;" />
*        </div>
*
*       ... things that go into the tab ...
*
*      <div id="tabs2_spacer" style="visibility: hidden;"/>
*
*    Note: The tabs2_spacer is optional and only used to keep a form from jumping when it is scrolled
*          down and the tabs are changed causing the page to become shorter.  The spacer keeps the form
*          the same height for any tab change.
*/
var GlideTabs2 = Class.create({
    initialize: function(className, parentElement, offset, tabClassPrefix) {
        this.tabs = [];
        this.className = className;  // css class name
        if (parentElement == null)
            return;
        this.tabs = $(parentElement).select("." + className);
        if (offset == 1)
            this.tabs.shift();
        CustomEvent.observe("form.loaded", this.markMandatoryTabs.bind(this));
        CustomEvent.observe("ui_policy.loaded", this.startCatchingMandatory.bind(this));
        CustomEvent.observe("change.handlers.run", this.showTabs.bind(this));
        CustomEvent.observe("change.handlers.run.all", this.showTabs.bind(this));
        CustomEvent.observe("partial.page.reload", this.updateTabs.bind(this));
        this.activated = false;
        this.tabDiv = gel(className);
        this.activeTab = -1;
        this.createTabs(tabClassPrefix);
        this.state = new GlideTabs2State(className + "_" + g_tabs_reference);
    },
    setActive: function(index) {
        if (index < 0 || index > this.tabs.length - 1)
            index = 0;
        var tab = this.tabs[index];
        var newHeight = getHeight(tab);
        var heightDifference = 0;
        if (this.activeTab != -1) {
            var previousTab = this.tabs[this.activeTab];
            this._bumpSpacer(newHeight);
            hide(previousTab);
            this.tabsTabs[this.activeTab].setActive(false);
        }
        show(tab);
        this.activeTab = index;
        this.state.set(index);
        this.tabsTabs[index].setActive(true);
    },
    isActivated: function() {
        return this.activated;
    },
    deactivate: function() {
        if (this.tabs.length == 0)
            return;
        hide(this.tabDiv);
        this.showAll();
        this.activated = false;
    },
    activate: function() {
        if (this.tabs.length < 2) {
            this.deactivate();
            return;
        }
        show(this.tabDiv);
        this.hideAll();
        var index = this.state.get();
        if (index == null)
            index = 0;
        this.setActive(index);
        this.activated = true;
    },
    hideAll: function() {
        var tabs = this.tabs;
        for (var i = 0; i < tabs.length; i++)
            hide(tabs[i]);
    },
    showAll: function() {
        var tabs = this.tabs;
        for (var i = 0; i < tabs.length; i++)
            show(tabs[i]);
    },
    createTabs: function(tabClassPrefix) {
        var tabs = this.tabs;
        this.tabsTabs = new Array();
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var t = this._getCaption(tab)
            this.tabsTabs[i] = new GlideTabs2Tab(this, i, t, tabClassPrefix);
            var header = document.createElement('h3');
            header.className = 'tab_header';
            header.appendChild(this.tabsTabs[i].getElement());
            this.tabDiv.appendChild(header);
            var img = document.createElement("img");
            img.className = 'tab_spacer';
            img.src = 'images/s.gifx';
            img.width = '4';
            img.height = '24';
            this.tabDiv.appendChild(img);
        }
        this.showTabs();
    },
    showTabs: function() {
        for (var i = 0; i < this.tabs.length; i++) {
            var tab = this.tabs[i];
            var s = tab.firstChild;
            var displayed = s.style.display != 'none';
            this.tabsTabs[i].showTab(displayed);
        }
        this._setActiveTab();
    },
    updateTabs: function() {
        var tabs = this.tabs;
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var t = this._getCaption(tab)
            this.tabsTabs[i].updateCaption(t);
        }
    },
    _setActiveTab: function() {
        if (this.activeTab == -1)
            return;
        var currentTab = this.tabsTabs[this.activeTab];
        if (currentTab.isVisible())
            return;
        for (var i = 0; i < this.tabsTabs.length; i++) {
            var t = this.tabsTabs[i];
            if (!t.isVisible())
                continue;
            this.setActive(i);
            break;
        }
    },
    startCatchingMandatory: function() {
        this.markMandatoryTabs();
        CustomEvent.observe("mandatory.changed", this.markMandatoryTabs.bind(this));
    },
    markMandatoryTabs: function() {
        this.markAllTabsOK();
        var missingFields = g_form.getMissingFields();
        for (var i = 0; i < missingFields.length; i++)
            this.markTabMandatoryByField(missingFields[i]);
    },
    markTabMandatoryByField: function(field) {
        var i = this.findTabIndex(field);
        if (i == -1)
            return;
        this.tabsTabs[i].markAsComplete(false);
    },
    findTabIndex: function(fieldName) {
        var answer = -1;
        var element = g_form.getControl(fieldName);
        var tabSpan = findParentByTag(element, "span");
        while (tabSpan) {
            if (hasClassName(tabSpan, 'tabs2_section'))
                break;
            tabSpan = findParentByTag(tabSpan, "span");
        }
        for (i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i] == tabSpan) {
                answer = i;
                break;
            }
        }
        return answer;
    },
    markAllTabsOK: function() {
        for (var i = 0; i < this.tabsTabs.length; i++)
            this.tabsTabs[i].markAsComplete(true);
    },
    hasTabs: function() {
        return this.tabs.length > 1;
    },
    _bumpSpacer: function(newHeight) {
        var spacerDiv = gel('tabs2_spacer');
        if (!spacerDiv)
            return;
        var spacerHeight = spacerDiv.offsetHeight;
        if (newHeight < spacerHeight)
            newHeight = spacerHeight;
        spacerDiv.style.height = newHeight;
        spacerDiv.style.minHeight = newHeight;
    },
    _getCaption: function(tab) {
        var caption = tab.getAttribute('tab_caption');
        var rows = this._getRowCount(tab);
        if (!rows || rows == 0)
            return caption;
        var rows = formatNumber(rows);
        if (rows == 0)
            return caption;
        return caption + " (" + rows + ")";
    },
    _getRowCount: function(tab) {
        if (tab.firstChild && (tab.firstChild.tagName.toLowerCase() == "span") && tab.id && tab.id.endsWith("_tab")) {
            var rows = tab.getAttribute('tab_rows');
            if (!rows)
                return null;
            var span = tab.firstChild;
            if (!span)
                return null;
            var f;
            for (var i = 0; i < span.childNodes.length; i++) {
                f = span.childNodes[i];
                if (f.tagName.toLowerCase() == "form")
                    break;
            }
            if (!f || !f[rows])
                return 0;
            return f[rows].value;
        }
        var id = tab.id.substring(0, tab.id.length - 5) + "_table";
        var tab = gel(id);
        if (tab)
            return tab.getAttribute('total_rows');
        return "";
    },
    type: 'GlideTabs2'
});
//include classes/GlideTabs2Tab.js
/**
* The html for a single tab
*
* To control the styles used for the tabs, specify the classPrefix constructor parameter.
* By default, the classPrefix is 'tabs2' and the following classes are used:
*
*       tabs2_tab       - tab style
*       tabs2_active    - tab style when active
*       tabs2_hover     - tab style when hovering over the tab
*
* If you specify a classPrefix, then the classes used will be:
*       <classPrefix>_tab
*       <classPrefix>_active
*       <classPrefix>_hover
*/
var GlideTabs2Tab = Class.create({
    initialize: function(parent, index, caption, classPrefix) {
        this.caption = caption.replace(/\s/g, "\u00a0");
        this.parent = parent;
        this.index = index;
        this.element = cel("span");
        var e = this.element;
        if (!classPrefix)
            this.classPrefix = "tabs2";
        else
            this.classPrefix = classPrefix;
        e.className = this.classPrefix + '_tab';
        this.mandatorySpan = this._createMandatorySpan();
        e.appendChild(this.mandatorySpan);
        var c = document.createTextNode(this.caption );
        e.appendChild(c);
        Event.observe(e, 'click', this.onClick.bind(this));
        Event.observe(e, 'mouseover', this.onMouseOver.bind(this));
        Event.observe(e, 'mouseout', this.onMouseOut.bind(this));
    },
    setActive: function(yesNo) {
        if (yesNo) {
            addClassName(this.element, this.classPrefix + '_active');
            CustomEvent.fire("tab.activated", this.parent.className + (this.index+1));
        } else
            removeClassName(this.element, this.classPrefix + '_active');
    },
    showTab: function(yesNo) {
        if (yesNo)
            this.element.style.display = '';
        else
            this.element.style.display = 'none';
    },
    updateCaption: function(caption) {
        this.caption = caption;
        this.getElement().innerHTML = this.caption;
    },
    isVisible: function() {
        return this.element.style.display == '';
    },
    getElement: function() {
        return this.element;
    },
    onClick: function() {
        if (ns6)
            var left = this.element.parentNode.scrollLeft;
        this.parent.setActive(this.index);
        if (ns6)
            this.element.parentNode.scrollLeft = left;
    },
    onMouseOver: function() {
        addClassName(this.element, this.classPrefix + '_hover');
    },
    onMouseOut: function() {
        removeClassName(this.element, this.classPrefix + '_hover');
    },
    markAsComplete: function(yesNo) {
        if (yesNo)
            this.mandatorySpan.style.display = 'none';
        else
            this.mandatorySpan.style.display = '';
    },
    _createMandatorySpan: function() {
        var answer = cel("span");
        answer.style.display = 'none';
        answer.className = 'mandatory';
        var img = cel("img", answer);
        img.src = 'images/s.gifx';
        img.alt = '';
        img.style.width = '3px';
        img.style.height = '12px';
        img.style.margin = '0px';
        return answer;
    }
});
//include classes/GlideTabs2State.js
var GlideTabs2State = Class.create({
    initialize: function(name) {
        this.name = name;
        this.cj = new CookieJar();
    },
    get: function() {
        return this.cj.get(this.name);
    },
    set: function(value) {
        this.cj.put(this.name, value);
    },
    type: 'GlideTabs2State'
});