var TableExtension = Class.create({
    REF_ELEMENT_PREFIX: 'ref_',
    initialize: function(elementName, elementLabel) {
        this.name = elementName;
        this.label = elementLabel;
        this.table = null;
        this.fields = null;
    },
    getName: function() {
        return this.name;
    },
    getExtName: function() {
        return this.REF_ELEMENT_PREFIX + this.getName();
    },
    getLabel: function() {
        return this.label;
    },
    setTable: function(t) {
        this.table = t;
    },
    addOption: function(select, namePrefix, labelPrefix) {
        var t = this.getName();
        var ext = this.getExtName();
        if (namePrefix && namePrefix != '') {
            var idx = namePrefix.lastIndexOf(".");
            var s = namePrefix.substring(idx + 1);
            var previousIsExtension = true;
            if (s.indexOf(this.REF_ELEMENT_PREFIX) == 0)
                ext = namePrefix.substring(0,idx + 1) + ext;
            else {
                ext = namePrefix + "." + ext;
                previousIsExtension = false;
            }
        }
        var label = this.getLabel();
        var reflabel = label;
        if (labelPrefix && labelPrefix != '')
            if (previousIsExtension)
                reflabel = labelPrefix.substring(0,labelPrefix.lastIndexOf(".")) + "." + reflabel;
            else
                reflabel = labelPrefix + "." + reflabel;
        tlabel = label + " (+)";
        appendSelectOption(select, ext, document.createTextNode(tlabel));
        var opt = select.options[select.options.length-1];
        if (labelPrefix != '')
            opt.innerHTML = "&nbsp;&nbsp;&nbsp;"+tlabel;
        else
            opt.innerHTML = tlabel;
        opt.cl = reflabel;
        opt.cv = ext;
        opt.tl = reflabel;
        opt.style.color = 'darkred';
        opt.style.cursor = 'pointer';
        opt.title = "Show extended fields from " + label + " table";
        opt.doNotDelete = 'true';
        opt.doNotMove = 'true'
        opt.reference =  t;
        opt.bt = this.table.getName();
        opt.btl = this.table.getLabel();
        opt.headerAttr = 'true';
        opt.tl = reflabel;
    },
    type : function() {
        return "TableExtension";
    }
});