//defer classes/SlushBucket.js
var SlushBucket = Class.create({
    initialize: function(id) {
        this.id = id;
        this.leftSelectJustify = "";
        this.rightSelectJustify = "";
        this.rightValues = "";
        this.evenOddColoring = false;
        this.ignoreDuplicates = false;
    },
    getLeftSelectJustify: function() {
        return this.leftSelectJustify;
    },
    setLeftSelectJustify: function(justify) {
        this.leftSelectJustify = justify;
        this.getLeftSelect().style.textAlign = justify;
    },
    getRightSelectJustify: function() {
        return this.rightSelectJustify;
    },
    setRightSelectJustify: function(justify) {
        this.rightSelectJustify = justify;
        this.getRightSelect().style.textAlign = justify;
    },
    getEvenOddColoring: function() {
        return this.evenOddColoring;
    },
    setEvenOddColoring: function(evenOdd) {
        this.evenOddColoring = evenOdd;
    },
    addLeftChoice: function(value, text) {
        var opt = cel("option");
        opt.value = value;
        opt.text = text;
        this.getLeftSelect().options.add(opt);
    },
    clear: function() {
        this.clearSelect(this.getLeftSelect());
        this.clearSelect(this.getRightSelect());
    },
    clearSelect: function(selectBox) {
        selectBox.options.length = 0;
    },
    getValues: function(selectBox) {
        var values = new Array();
        var options = selectBox.options;
        for (var i = 0; i < options.length; i++) {
            values[i] = options[i].value;
        }
        return values;
    },
    saveRightValues: function(values) {
        this.values = values;
    },
    getRightValues: function() {
        return this.rightValues;
    },
    getSelected: function(selectBox) {
        var selectedIds = new Array();
        var index = 0;
        var sourceOptions = selectBox.options;
        for (var i = 0; i < sourceOptions.length; i++) {
            option = sourceOptions[i];
            if (option.selected) {
                var optText = option.text;
                var canMove = true;
                if (canMove) {
                    selectedIds[index] = i;
                    index++;
                } else {
                    option.selected = false;
                }
            }
        }
        return selectedIds;
    },
    getRightSelect: function() {
        return gel(this.id + "_right");
    },
    getLeftSelect: function() {
        return gel(this.id + "_left");
    },
    moveLeftToRight: function() {
        this.moveOptions(this.getLeftSelect(), this.getRightSelect());
    },
    moveRightToLeft: function() {
        this.moveOptions(this.getRightSelect(), this.getLeftSelect());
    },
    copyLeftToRight: function() {
        this.moveOptions(this.getLeftSelect(), this.getRightSelect(), true);
    },
    moveOptions: function (sourceSelect, targetSelect, copyFlag) {
        var selectedIds = this.getSelected(sourceSelect);
        if (selectedIds.length < 1)
            return;
        var sourceOptions = sourceSelect.options;
        var targetOptions = targetSelect.options;
        targetSelect.selectedIndex = -1;
        for (var i = 0; i < selectedIds.length; i++) {
            var soption = sourceOptions[selectedIds[i]];
            var label = soption.text;
            if ((this.ignoreDuplicates) && (this._isDuplicate(targetOptions, soption.value)))
                continue;
            option =
            new Option(
                label,
                sourceOptions[selectedIds[i]].value);
            option.cl = label;
            option.style.color = sourceOptions[selectedIds[i]].style.color;
            targetOptions[targetOptions.length] = option;
            targetOptions[targetOptions.length - 1].selected = true;
        }
        if (!copyFlag) {
            for (var i = selectedIds.length - 1; i > -1; i--)
                sourceSelect.remove(selectedIds[i]);
        }
        this.evenOddColorize();
        if (targetSelect["onchange"])
            targetSelect.onchange();
        if (sourceSelect["onchange"])
            sourceSelect.onchange();
        sourceSelect.disabled = true;
        sourceSelect.disabled = false;
        if (selectedIds.length > 0)
            targetSelect.focus();
    },
    moveUp: function() {
        sourceSelect = this.getRightSelect();
        if (sourceSelect.length > 1) {
            var options = sourceSelect.options;
            var selectedIds = new Array();
            var index = 0;
            for (var i = 1; i < sourceSelect.length; i++) {
                if (options[i].selected) {
                    selectedIds[index] = i;
                    index++;
                }
            }
            var selId;
            for (var i = 0; i < selectedIds.length; i++) {
                selId = selectedIds[i];
                privateMoveUp(options, selId);
                options[selId].selected = false;
                options[selId - 1].selected = true;
            }
            this.evenOddColorize();
            sourceSelect.focus();
            if (sourceSelect["onLocalMoveUp"])
                sourceSelect.onLocalMoveUp();
        }
    },
    moveDown: function() {
        sourceSelect = this.getRightSelect();
        if (sourceSelect.length > 1) {
            var options = sourceSelect.options;
            var selectedIds = new Array();
            var index = 0;
            for (var i = sourceSelect.length - 2; i >= 0; i--) {
                if (sourceSelect.options[i].selected) {
                    selectedIds[index] = i;
                    index++;
                }
            }
            var selId;
            for (var i = 0; i < selectedIds.length; i++) {
                selId = selectedIds[i];
                privateMoveDown(options, selId);
                options[selId].selected = false;
                options[selId + 1].selected = true;
            }
            this.evenOddColorize();
            sourceSelect.focus();
            if (sourceSelect["onLocalMoveDown"])
                sourceSelect.onLocalMoveDown();
        }
    },
    evenOddColorize: function() {
        if (this.evenOddColoring) {
            rightSelect = this.getRightSelect();
            if (rightSelect.length > 1) {
                var options = rightSelect.options;
                for (var i = 0; i < rightSelect.length; i++) {
                    if ((i % 2) == 0) {
                        rightSelect.options[i].style.background = "white";
                    } else {
                        rightSelect.options[i].style.background = "#dddddd";
                    }
                }
            }
        }
    },
    _isDuplicate: function(options, value) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].value == value)
                return true;
        }
        return false;
    },
    getClassName : function() {
        return "SlushBucket";
    }
});