//defer classes/ajax/AJAXTableCompleter.js
var AJAXTableCompleter = Class.create(AJAXReferenceCompleter, {
    appendElement: function(element) {
        this.tbody.appendChild(element);
    },
    createChild: function(item) {
        if ( this.currentMenuCount == 0) {
            this._createTable();
            this._showMax();
        }
        var tr = cel("tr");
        this._createTD(tr, item['label']);
        this._addColumns(tr, item);
        return tr;
    },
    onDisplayDropDown: function() {
        var width = this.table.offsetWidth + 2;
        var height = this.table.offsetHeight + 2;
        this.getDropDown().style.width = width;
        if (!g_isInternetExplorer) {
            width = width - 4;
            height = height - 4;
        }
        this.getIFrame().style.width = width;
        this.getIFrame().style.height = height;
    },
    _addColumns: function(tr, item) {
        var xml = item["XML"];
        var fields = xml.getElementsByTagName("field");
        for(var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var value    = field.getAttribute("value");
            if (this.prevText[i] == value)
                value = ""
            else
                this.prevText[i] = value;
            var td = this._createTD(tr, value);
            td.style.color = "darkblue";
            td.style.backgroundColor = "white";
        }
    },
    _showMax: function() {
        var max = 1 * this.max;
        if (this.rowCount <= max)
            return;
        var tr = cel("tr");
        tr.style.backgroundColor = "lightgrey";
        tr.style.color = "white";
        var td = cel("td", tr);
        td.setAttribute("colSpan", 99);
        td.setAttribute("width", "100%");
        var a = cel("a", td);
        a.onmousedown = this._showAll.bindAsEventListener(this);
        var x = "";
        if (this.rowCount >= 250)
            x = " more than ";
        a.innerHTML = "Showing 1 through " + this.max + " of " + x + this.rowCount;
        this.appendElement(tr);
    },
    _showAll: function() {
        this.clearTimeout();
        this.max = this.rowCount;
        this.timer = setTimeout(this.ajaxRequest.bind(this), g_key_delay);
    },
    _createTD: function(tr, text) {
        var td = cel("td", tr);
        td.style.whiteSpace = "nowrap";
        td.innerHTML = text.escapeHTML();
        return td;
    },
    _createTable: function() {
        this.table = cel("table");
        this.tbody = cel("tbody", this.table);
        this.dropDown.appendChild(this.table);
        this.prevText = new Object();
    }
});