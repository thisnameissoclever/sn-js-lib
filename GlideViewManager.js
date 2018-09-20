var GlideViewManager = Class.create({
    initialize: function(table, view) {
        this.table = table;
        this.title = null;
        this.view = view;
        this.collection = null;
        this.sections = null;
        this.modified = false;
        this.orderModified = false;
        this.viewChange = false;
        var msg = new GwtMessage();
        var labels = ["New...", "Create New View", "Save changes", "Save changes before continuing?",
        "Enter the name for the view", "Create new section", "Enter the caption for the new section"];
        this.newMsg = msg.getMessages(labels);
        this.prompt = this.newMsg["Enter the name for the view"];
        this.sectionPrompt = this.newMsg["Enter the caption for the new section"];
        this.checkPrompt = this.newMsg["Save changes before continuing?"];
        this.ga = null;
    },
    refreshList: function() {
        var form = getControlForm(this.table);
        addHidden(form, 'sysparm_view', this.view);
        addHidden(form, 'sysparm_referring_url', '');
        addHidden(form, 'sysparm_userpref.' + this.table + '.view', this.view);
        addHidden(form, 'sysparm_userpref.' + this.table + '_list.view', this.view);
        form.submit();
    },
    refreshDetail: function() {
        var form = document.forms[this.table+'.do'];
        addHidden(form, 'sysparm_view', this.view);
        addHidden(form, 'sysparm_userpref.' + this.table + '.view', this.view);
        addHidden(form, 'sysparm_userpref.' + this.table + '_list.view', this.view);
        gsftSubmit(document.getElementById('sysverb_view_change'), form);
    },
    refreshSelect: function() {
        var ga = this._vmInit();
        ga.addParam('sysparm_action','refreshSelected');
        ga.addParam('sysparm_view',this.view);
        this._vmExecuteResponse(ga, this.refreshSelectResponse.bind(this));
    },
    refreshSelectResponse: function(response) {
        if (!response || !response.responseXML)
            return;
        this._addViews(response.responseXML);
        this._showAddWithLabel();
    },
    refreshSections: function() {
        if (this.sections == null)
            return;
        if (this.orderModified)
            return;
        var ga = this._vmInit();
        ga.addParam('sysparm_action','refreshSection');
        ga.addParam('sysparm_view',this.view);
        this._vmExecuteResponse(ga, this.refreshSectionsResponse.bind(this));
    },
    refreshSectionsResponse: function(response) {
        if (!response || !response.responseXML)
            return;
        this._addSections(response.responseXML);
    },
    setPrompt: function(p) {
        this.prompt = p;
    },
    setSectionPrompt: function(p) {
        this.sectionPrompt = p;
    },
    setCheckPrompt: function(p) {
        this.checkPrompt = p;
    },
    setSelect: function(s) {
        this.select = s;
    },
    setAvailable: function(s) {
        this.available = s;
    },
    setSelected: function(s) {
        this.selected = s;
    },
    setSections: function(s) {
        this.sections = s;
    },
    setForm: function(s) {
        this.form = s;
    },
    setCollection: function(s) {
        this.collection = s;
    },
    setModified: function() {
        this.modified = true;
    },
    setOrderModified: function() {
        this.orderModified = true;
    },
    changeView: function() {
        this.viewChange = true;
        var prompt = "<div><b>The '";
        for (var i = 0; i < this.select.options.length; i++)
            if (this.select.options[i].value == this.view) {
                if(this.select.options[i].text.toLowerCase().indexOf('view') > 0)
                    prompt += this.select.options[i].text + "' has been modified";
                else
                    prompt += this.select.options[i].text + "' view has been modified";
            }
        prompt += "</b><br/>" + this.checkPrompt + "</div>";
        if (this._saveRequired())
            gsftConfirm(this.newMsg["Save changes"], prompt,
                function(answer) {
                    this._promptModifiedOk(this._checkNewView.bind(this));
                }.bind(this), this._promptCancel.bind(this),
                this._checkNewView.bind(this));
        else
            this._checkNewView();
        this.modified = false;
        this.viewChange = false;
        this._showAddWithLabel();
    },
    _showAddWithLabel: function() {
        var showLabelButton = (this.view=="Mobile" && this.form=="list");
        var labelButton = gel("addWithLabel");
        if (showLabelButton)
            show(labelButton);
        else
            hide(labelButton);
    },
    getView: function() {
        this.view = this.select.value;
        this.orderModified = false;
        var ga = this._vmInit();
        ga.addParam('sysparm_action','getView');
        ga.addParam('sysparm_view',this.view);
        ga.addParam('sysparm_collection',this.collection);
        this._vmExecuteResponse(ga, this.getViewResponse.bind(this));
    },
    getViewResponse: function(response) {
        if (!response || !response.responseXML)
            return;
        this._setSelected(response.responseXML);
        this._showAddWithLabel();
    },
    _checkNewView: function() {
        if (this.select.value == '.new')
            var view = gsftPrompt(this.newMsg["Create New View"], this.prompt,
                this._promptOk.bind(this), this._promptCancel.bind(this));
        else
            this.getView();
    },
    _promptOk : function(view) {
        var thisView = view.toLowerCase();
        if (thisView == "default view")
            view = "";
        this.title = view;
        this.view = view.toLowerCase().replace(new RegExp(" ", "g"), "_");
        this.createView();
    },
    _promptCancel : function(view) {
        for (var i = 0; i < this.select.options.length; i++)
            if (this.select.options[i].value == this.view)
                this.select.options[i].selected = true;
        this.getView();
    },
    changeSection: function() {
        if (this.table == this.sections.value)
            return;
        var prompt = "<div><b>The '";
        for (var i = 0; i < this.sections.options.length; i++)
            if (this.sections.options[i].value == this.table)
                prompt += this.sections.options[i].text + "' section has been modified</b><br/>" + this.checkPrompt + "</div>";
        if (this._saveRequired())
            gsftConfirm(this.newMsg["Save changes"], prompt,
                function(answer) {
                    this._promptModifiedOk(this._checkNewSection.bind(this));
                }.bind(this),
                this._getSection.bind(this),
                this._checkNewSection.bind(this));
        else
            this._checkNewSection();
        this.modified = false;
    },
    _getSection: function() {
        var ga = this._vmInit();
        ga.addParam("sysparm_action",'getSection');
        ga.addParam("sysparm_view",this.view);
        this._vmExecuteResponse(ga, this._getSectionResponse.bind(this));
    },
    _getSectionResponse: function(response) {
        if (!response || !response.responseXML)
            return;
        this._setSelected(response.responseXML);
    },
    _checkNewSection: function() {
        if (!this._newSectionRequest()) {
            this.table = this.sections.value;
            this._getSection();
            return;
        }
        var section = gsftPrompt(this.newMsg["Create new section"], this.sectionPrompt,
            this._promptNewSectionOk.bind(this), this._getSection.bind(this));
    },
    _promptNewSectionOk : function(section) {
        this.sectionCaption = section;
        if (this.sectionCaption == null || this.sectionCaption == '')
            return;
        this.createSection();
    },
    _promptModifiedOk: function(callback) {
        this.orderModified = false;
        var ga = this._vmInit();
        ga.addParam('sysparm_action','promptModifiedOk');
        this._saveView(ga);
        this._vmExecuteResponse(ga, this._promptModifiedOkResponse.bind(this, callback));
    },
    _promptModifiedOkResponse: function(callback, response) {
        callback();
    },
    _saveView: function(ga) {
        var avail = gel('lcodes_0');
        var selected = gel('lcodes_1');
        var sections = gel('lcodes_2');
        sections.value = "";
        saveAllSelected([ this.available, this.selected ], [ avail, selected ], ',', '\\', '--None--');
        if (this.sections)
            saveAllSelected([ this.sections ], [ sections ], ',', '\\', '--None--');
        ga.addParam('sysparm_view',this.view);
        ga.addParam('sysparm_collection',this.collection);
        ga.addParam('sysparm_avail',avail.value);
        ga.addParam('sysparm_selected',selected.value);
        ga.addParam('sysparm_sections',sections.value);
    },
    _saveRequired: function() {
        if (this.modified)
            return true;
        if (!this.orderModified)
            return false;
        if (this._newSectionRequest())
            return true;
        if (this.viewChange)
            return true;
        return false;
    },
    _newSectionRequest: function() {
        if (this.sections.value == '.new')
            return true;
        return false;
    },
    createView: function() {
        var ga = this._vmInit();
        ga.addParam('sysparm_action','createView');
        ga.addParam('sysparm_view',this.view);
        ga.addParam('sysparm_title',this.title);
        this._saveView(ga);
        this._vmExecuteResponse(ga, this.createViewResponse.bind(this));
    },
    createViewResponse: function(response) {
        if (!response || !response.responseXML)
            return;
        this._addViews(response.responseXML);
        this.getView();
    },
    createSection: function() {
        var ga = this._vmInit();
        ga.addParam('sysparm_action','createSection');
        ga.addParam('sysparm_view',this.view);
        ga.addParam('sysparm_caption',this.sectionCaption);
        this._vmExecuteResponse(ga, this.createSectionResponse.bind(this));
    },
    createSectionResponse: function(response) {
        if (!response || !response.responseXML)
            return;
        this._addSections(response.responseXML);
        this._getSection();
    },
    _vmInit: function() {
        var ga = new GlideAjax("GlideViewManager");
        ga.addParam("sysparm_name","execute");
        ga.addParam("sysparm_table",this.table);
        ga.addParam("sysparm_form",this.form);
        return ga;
    },
    _vmExecute: function(ga) {
        return ga.getXMLWait();
    },
    _vmExecuteResponse: function(ga, response) {
        ga.getXML(response);
    },
    _addViews: function(xml) {
        if (!this.select)
            return;
        if (!this.select.options)
            return;
        var thisView = this.view.toLowerCase();
        this.select.disabled = false;
        this.select.options.length = 0;
        var root = xml.documentElement;
        var items = xml.getElementsByTagName("choice");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var v = item.getAttribute("value");
            var l = item.getAttribute("label");
            selected = thisView == v.toLowerCase();
            addOption(this.select, v, l, selected);
        }
        addOption(this.select, ".new", this.newMsg["New..."], false);
    },
    _addSections: function(xml) {
        this.sections.disabled = false;
        this.sections.options.length = 0;
        var root = xml.documentElement;
        var items = xml.getElementsByTagName("choice");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var v = item.getAttribute("value");
            var l = item.getAttribute("label");
            var selected = item.getAttribute("selected");
            if (selected == 'true')
                selected = true;
            else
                selected = false;
            addOption(this.sections, v, l, selected);
            if (selected)
                this._setTargetValue(v);
        }
        addOption(this.sections, ".new", this.newMsg["New..."], false);
        this.sections.size = items.length + 1;
    },
    _setSelected: function(xml) {
        this._moveCurrentContentsBack();
        this._buildNewSelectedList(xml);
        var target = xml.getElementsByTagName("choice_list_set")[0];
        var a = target.getAttribute("section_id");
        if (a && a != '')
            this._setTargetValue(a);
        this.refreshSections();
    },
    _setTargetValue: function(v) {
        gel('sys_target').value = v;
        this.table = v;
    },
    _buildNewSelectedList: function(xml) {
        var selected = xml.getElementsByTagName("selected")[0];
        this.selected.options.length = 0;
        var items = selected.getElementsByTagName("choice");
        for (var i = 0; i < items.length; i++ ) {
            var item = items[i];
            var value = item.getAttribute('value');
            var label = item.getAttribute('label');
            var required = item.getAttribute('required');
            if (value.startsWith(".labeled."))
                label = "* " + label;
            this._setAvailableItemSelected(label, value);
            var o = new Option(label, value);
            o.setAttribute("title", item.getAttribute('title'));
            o.setAttribute("cv", value);
            o.setAttribute("cl", label);
            if (required == "true") {
                if (!g_user.hasRole('admin'))
                    o.setAttribute("doNotMove", "true");
                o.style.color = "grey";
            }
            this.selected.options[this.selected.options.length] = o;
        }
        selectedIds = this._buildSelected(this.available, false);
        removeSelectedOptions(selectedIds, this.available, "to");
        this._clearSelected(this.selected);
        this._clearSelected(this.available);
        this.available.options[0].selected = true;
        this.available.disabled = true;
        this.available.disabled = false;
        this.available.options[0].selected = false;
    },
    _setAvailableItemSelected: function(label, value) {
        var options = this.available.options;
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            if (o.value == value)
                o.selected = true;
        }
    },
    _moveCurrentContentsBack: function() {
        var option = this.available.options[0];
        var tableName = getTablenameFromOption(option);
        var isHeader = getHeaderAttr(option);
        if (isHeader)
            return;
        selectedIds = this._buildSelected(this.selected, true);
        moveSelectedOptions(selectedIds, this.selected, this.available, '--None--',['home'],'--None--', 'from');
        this._clearSelected(this.available);
        sortSelect(this.available);
    },
    _buildSelected: function(select, allItems) {
        var options = select.options;
        var selectedIds = new Array();
        var index = 0;
        for (var i = 0; i < options.length; i++)
            if (allItems || options[i].selected == true)
                selectedIds[index++] = i;
        return selectedIds;
    },
    _clearSelected: function(selected) {
        var options = selected.options;
        for (var i = 0; i < options.length; i++)
            options[i].selected = false;
    },
    z:null
});