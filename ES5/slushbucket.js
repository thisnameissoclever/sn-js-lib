//defer slushbucket.js
function moveSelectElement3(
    sourceSelect,
    targetSelect,
    sourceLabel,
    targetLabel,
    keepTarget) {
    if (sourceSelect.selectedIndex > -1) {
        for (i = 0; i < sourceSelect.length; ++i) {
            var selectedOption = sourceSelect.options[i];
            if (selectedOption.selected) {
                if (selectedOption.text != sourceLabel) {
                    var newOption = new Option(selectedOption.text, selectedOption.value);
                    if (targetSelect.options.length > 0
                        && targetSelect.options[0].text == targetLabel) {
                        targetSelect.options[0] = newOption;
                        targetSelect.selectedIndex = 0;
                    } else {
                        targetSelect.options[targetSelect.options.length] = newOption;
                        targetSelect.selectedIndex = targetSelect.options.length - 1;
                    }
                } else {
                    sourceSelect.selectedIndex = -1;
                }
            }
        }
        if (!keepTarget) {
            removeSelectElement3(sourceSelect, sourceLabel);
        }
    }
}
function moveOptionToSelected(
    sourceSelect,
    targetSelect,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel) {
    moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, "to");
}
var SLUSHBUCKET_LABELED_PREFIX = ".labeled.";
var SLUSHBUCKET_LABELED_DISPLAY = "* ";
function moveOptionToSelectedLabeled(
    sourceSelect,
    targetSelect,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel) {
    moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, "to", SLUSHBUCKET_LABELED_PREFIX);
}
function moveOptionFromSelected(
    sourceSelect,
    targetSelect,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel) {
    moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, "from");
}
function moveCorrespondingOption(sourceSelect, targetSelect,
    correspondingSelect, correspondingTarget,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel) {
    var selectedIds = moveOptionReturnIdArray(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel);
    moveSelectedOptions(selectedIds, correspondingSelect, correspondingTarget, keepSourceLabel, unmovableSourceValues, keepTargetLabel);
}
function moveOption(
    sourceSelect,
    targetSelect,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel,
    direction,
    property) {
    moveOptionReturnIdArray(sourceSelect, targetSelect, keepSourceLabel,
        unmovableSourceValues,
        keepTargetLabel, direction, property);
}
function moveOptionReturnIdArray(
    sourceSelect,
    targetSelect,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel,
    direction,
    property) {
    var sourceOptions = sourceSelect.options;
    var canMove;
    var option;
    var selectedIds = new Array();
    var index = 0;
    for (var i = 0; i < sourceOptions.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            var optText = option.text;
            canMove = (option.text != keepSourceLabel);
            if (canMove && getHeaderAttr(option))
                canMove = false;
            if (canMove && getDoNotMove(option) == 'true')
                canMove = false;
            if (canMove && unmovableSourceValues != null) {
                for (var j = 0; j < unmovableSourceValues.length; j++) {
                    if (unmovableSourceValues[j] == option.value) {
                        canMove = false;
                        break;
                    }
                }
            }
            if (canMove) {
                selectedIds[index] = i;
                index++;
            } else {
                option.selected = false;
            }
        }
    }
    moveSelectedOptions(selectedIds, sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel,
        direction, property);
    return selectedIds;
}
function moveSelectedOptions(selectedIds, sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel,
    direction, property) {
    var sourceOptions = sourceSelect.options;
    var group = targetSelect.getElementsByTagName("optgroup");
    if (group != null && group.length > 1)
        group = document.getElementById('ac');
    else
        group = null;
    if (selectedIds.length > 0) {
        var targetOptions = targetSelect.options;
        targetSelect.selectedIndex = -1;
        for (var i = 0; i < selectedIds.length; i++) {
            var soption = sourceOptions[selectedIds[i]];
            if (group == null ) {
                var label = getTrueLabel(soption);
                if (label === undefined || label == null)
                    label = soption.text;
                var optionValue = soption.value;
                if (typeof property != "undefined" && property != null) {
                    if (optionValue.substring(0, 1) != ".") { // do not double up properties
                        optionValue = property + optionValue;
                        if (property==SLUSHBUCKET_LABELED_PREFIX)
                            label = SLUSHBUCKET_LABELED_DISPLAY + label;
                    }
                }
                if (direction == "from" && optionValue.startsWith(SLUSHBUCKET_LABELED_PREFIX)) {
                    optionValue = optionValue.substring(SLUSHBUCKET_LABELED_PREFIX.length);
                    label = label.substring(SLUSHBUCKET_LABELED_DISPLAY.length);
                }
                option =
                new Option(
                    label,
                    optionValue);
                option.cl = label;
                var title = getTitle(soption);
                option.title = title;
                if (option.value.indexOf("ref_") != -1)
                    option.style.color = 'darkred';
                else
                    option.style.color = soption.style.color;
                if (getCopyAttributes(soption)) {
                    option = soption.cloneNode();
                    option.text = label;
                } else if (getMultipleAllowed(soption)) {
                    option.setAttribute("multipleAllowed", true);
                }
                if (getShowAnnotation(soption)) {
                    option.setAttribute("showAnnotation", true);
                }
                var skipAdd = false;
                var ov = option.value;
                if ((direction != "to") || !getMultipleAllowed(soption)) {
                    for (var ti=0; ti < targetOptions.length; ti++) {
                        var toption = targetOptions[ti];
                        if (toption.value == ov || ov.indexOf("annotation") > -1) {
                            skipAdd = true;
                            break;
                        }
                    }
                }
                if (skipAdd)
                    continue;
                if (targetOptions.length == 1 && targetOptions[0].text == keepTargetLabel) {
                    targetOptions[0] = option;
                    targetOptions[0].selected = true;
                } else {
                    targetOptions[targetOptions.length] = option;
                    targetOptions[targetOptions.length - 1].selected = true;
                }
            } else {
                var t = soption.value;
                var label = soption.text;
                appendSelectOption(group, t, document.createTextNode(label));
            }
        }
    }
    removeSelectedOptions(selectedIds, sourceSelect, direction);
    if (sourceSelect.options.length == 0)
        addOption(sourceSelect, "", "--" + new GwtMessage().getMessage("None") + "--");
    if (selectedIds.length > 0)
        try {
            targetSelect.focus();
        } catch (e) { /* this can fail in IE if the element is hidden */ }
    if (targetSelect["onLocalMoveOptions"])
        targetSelect.onLocalMoveOptions();
    if (sourceSelect["onLocalMoveOptions"])
        sourceSelect.onLocalMoveOptions();
}
function removeSelectedOptions(selectedIds, sourceSelect, direction) {
    for (var i = selectedIds.length - 1; i > -1; i--) {
        var option = sourceSelect[selectedIds[i]];
        if (!getDoNotDelete(option) && (direction != "to" || !getMultipleAllowed(option))) {
            sourceSelect.remove(selectedIds[i]);
        }
    }
    if (sourceSelect["onchange"])
        sourceSelect.onchange();
    sourceSelect.disabled = true;
    sourceSelect.disabled = false;
}
function moveOptionAndSort(
    sourceSelect,
    targetSelect,
    keepSourceLabel,
    unmovableSourceValues,
    keepTargetLabel) {
    moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel);
    sortSelect(targetSelect);
}
function removeSelectElement3(sourceSelect, sourceLabel) {
    if (sourceSelect.selectedIndex > -1) {
        for (i = sourceSelect.length - 1; i > -1; i--) {
            if (sourceSelect.options[i].selected)
                sourceSelect.options[i] = null;
        }
        if (sourceSelect.length == 0)
            addOption(sourceSelect, "", sourceLabel);
    }
}
function removeSection(sourceSelect) {
    var option = getSingleSelectedOption(sourceSelect);
    if (option) {
        var gajax = new GlideAjax("RemoveFormSectionAjax");
        gajax.addParam("sysparm_value",option.value);
        gajax.getXML();
    }
}
function moveUp(sourceSelect) {
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
        sourceSelect.focus();
        if (sourceSelect["onLocalMoveUp"])
            sourceSelect.onLocalMoveUp();
    }
}
function moveDown(sourceSelect) {
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
        sourceSelect.focus();
        if (sourceSelect["onLocalMoveDown"])
            sourceSelect.onLocalMoveDown();
    }
}
function moveTop(sourceSelect) {
    var selIndex = sourceSelect.selectedIndex;
    if (sourceSelect.length > 1 && selIndex > 0) {
        var options = sourceSelect.options;
        for (var i = selIndex; i > 0; i--) {
            privateMoveUp(options, i);
        }
        sourceSelect.focus();
        sourceSelect.selectedIndex = 0;
        if (sourceSelect["onLocalMoveTop"])
            sourceSelect.onLocalMoveTop();
    }
}
function moveBottom(sourceSelect) {
    var selIndex = sourceSelect.selectedIndex;
    if (sourceSelect.length > 1 && selIndex > -1 && selIndex < sourceSelect.length - 1) {
        var options = sourceSelect.options;
        for (var i = selIndex; i < sourceSelect.length - 1; i++) {
            privateMoveDown(options, i);
        }
        sourceSelect.focus();
        sourceSelect.selectedIndex = sourceSelect.length - 1;
        if (sourceSelect["onLocalMoveBottom"])
            sourceSelect.onLocalMoveBottom();
    }
}
function copyOption (sourceSelect, targetSelect,
    keepSourceLabel, unmovableSourceValues,
    keepTargetLabel) {
    var sourceOptions = sourceSelect.options;
    var canMove;
    var option;
    var selectedIds = new Array ();
    var index = 0;
    for (var i = 0; i < sourceSelect.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            canMove = (option.text != keepSourceLabel);
            if (canMove && unmovableSourceValues != null) {
                for (var j = 0; j < unmovableSourceValues.length; j++) {
                    if (unmovableSourceValues[j] == option.value) {
                        canMove = false;
                        break;
                    }
                }
            }
            if (canMove) {
                selectedIds[index] = i;
                index++;
            } else {
                option.selected = false;
            }
        }
    }
    var targetOptions = targetSelect.options;
    if (selectedIds.length > 0) {
        targetSelect.selectedIndex = -1;
        for (var i = 0; i < selectedIds.length; i++) {
            option = new Option (sourceOptions[selectedIds[i]].text, sourceOptions[selectedIds[i]].value);
            if (targetOptions.length == 1 && targetOptions[0].text == keepTargetLabel) {
                targetOptions[0] = option;
                targetOptions[0].selected = true;
            } else {
                targetOptions[targetOptions.length] = option;
                targetOptions[targetOptions.length-1].selected = true;
            }
        }
    }
    if (targetSelect["onchange"]) {
        targetSelect.onchange();
    }
    if (sourceSelect["onchange"]) {
        sourceSelect.onchange();
    }
}
function simpleRemoveOption(sourceSelect) {
    var sourceOptions = sourceSelect.options;
    var selectedIds = new Array ();
    var index = 0;
    for (var i = 0; i < sourceSelect.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            selectedIds[index] = i;
            index++;
        }
    }
    for (var i = selectedIds.length - 1; i > -1; i--) {
        sourceSelect.remove(selectedIds[i]);
    }
    sourceSelect.disabled = true;
    sourceSelect.disabled = false;
}
function removeOption (sourceSelect, targetSelect,
    keepSourceLabel, unmovableSourceValues,
    keepTargetLabel) {
    var sourceOptions = sourceSelect.options;
    var canMove;
    var option;
    var selectedIds = new Array ();
    var index = 0;
    for (var i = 0; i < sourceSelect.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            canMove = (option.text != keepSourceLabel);
            if (canMove && unmovableSourceValues != null) {
                for (var j = 0; j < unmovableSourceValues.length; j++) {
                    if (unmovableSourceValues[j] == option.value) {
                        canMove = false;
                        break;
                    }
                }
            }
            if (canMove) {
                selectedIds[index] = i;
                index++;
            } else {
                option.selected = false;
            }
        }
    }
    for (var i = selectedIds.length - 1; i > -1; i--) {
        var option = sourceSelect[selectedIds[i]];
        if (!getDoNotDelete(option))
            sourceSelect.remove(selectedIds[i]);
    }
    sourceSelect.disabled = true;
    sourceSelect.disabled = false;
    if (sourceOptions.length == 0)
        addOption(sourceOptions, "", keepSourceLabel);
}
/*
* Do not call this function directly.
* As it does NO bounds checking.
* Please use the moveUp or moveTop calls.
*/
function privateMoveUp(options, index) {
    privateSwapOptions(options[index - 1], options[index]);
}
/*
* Do not call this function directly.
* As it does NO bounds checking.
* Please use the moveDown or moveBottom calls.
*/
function privateMoveDown(options, index) {
    privateSwapOptions(options[index], options[index + 1]);
}
function privateSwapOptions(option1, option2) {
    var newOption = new Option(option1.text, option1.value);
    newOption.cl = getTrueLabel(option1);
    newOption.showAnnotation = getShowAnnotation(option1);
    newOption.style.color = option1.style.color;
    newOption.doNotMove = getDoNotMove(option1);
    newOption.title = getTitle(option1);
    option1.text = option2.text;
    option1.value = option2.value;
    option1.setAttribute("doNotMove",getDoNotMove(option2));
    option1.cl = getTrueLabel(option2);
    option1.setAttribute("cl",getTrueLabel(option2));
    option1.setAttribute("title",getTitle(option2));
    option1.showAnnotation = getShowAnnotation(option2);
    option1.style.color = option2.style.color;
    option2.text = newOption.text;
    option2.value = newOption.value;
    option2.style.color = newOption.style.color;
    option2.setAttribute("doNotMove",getDoNotMove(newOption));
    option2.cl = getTrueLabel(newOption);
    option2.setAttribute("cl",getTrueLabel(newOption));
    option2.setAttribute("title",getTitle(newOption));
    option2.showAnnotation = getShowAnnotation(newOption);
}
/**
* Used when submitting a dueling list boxes element.
* Stores all the values into hidden form parameters so we can get them out
*/
function saveAllSelected(fromSelectArray, toArray, delim, escape, emptyLabel) {
    var i, j, escapedValue;
    for (i = 0; i < fromSelectArray.length; i++) {
        if (typeof fromSelectArray[i] == 'undefined') {
            toArray[i].value = '';
            continue;
        }
        var toValue = "";
        var translatedEmptyLabel = new GwtMessage().getMessage(emptyLabel);
        for (j = 0; j < fromSelectArray[i].length; j++) {
            if (!(fromSelectArray[i].length == 1
                && fromSelectArray[i].options[0].value == translatedEmptyLabel)) {
                var val =
                fromSelectArray[i].options[j].value.replace(
                    new RegExp(escape + escape, "g"),
                    escape + escape);
                toValue += val.replace(new RegExp(delim, "g"), escape + delim);
            }
            if (j + 1 < fromSelectArray[i].length) {
                toValue += delim;
            }
        }
        toArray[i].value = toValue;
    }
}
function saveAllActuallySelected (fromSelectArray, toArray, delim, escape, emptyLabel) {
    var i,j,escapedValue;
    var translatedEmptyLabel = new GwtMessage().getMessage(emptyLabel);
    for (i = 0; i < fromSelectArray.length; i++) {
        toArray[i].value = ''; // clear out the value to start
        var count = 0;
        for (j = 0; j < fromSelectArray[i].length; j++) {
            var option = fromSelectArray[i].options[j];
            if (!option.selected)
                continue;
            if (!(fromSelectArray[i].length == 1 && fromSelectArray[i].options[0].value == translatedEmptyLabel)) {
                var val = fromSelectArray[i].options[j].value.replace(new RegExp(escape+escape,"g"), escape+escape);
                if (count != 0) {
                    toArray[i].value += delim;
                }
                count = count+1;
                toArray[i].value += val.replace(new RegExp(delim,"g"), escape+delim);
            }
        }
    }
}
function clearAllSelected(fromSelectArray) {
    var i,j,escapedValue;
    for (i = 0; i < fromSelectArray.length; i++) {
        var count = 0;
        for (j = 0; j < fromSelectArray[i].length; j++) {
            var option = fromSelectArray[i].options[j];
            option.selected = false;
        }
    }
}
/**
* add a new field
*/
function addNewField(selectBox, formElement) {
    var title = formElement.newOption.value;
    formElement.newOption.value = ""; // reset for next time
    if (title == '')
        return;
    var type = formElement.newType.value;
    var refTable = formElement.refTable.value;
    var length = formElement.lengthSelect.value;
    var fieldName = title;
    var prefix = 'true';
    var fnid = formElement.fieldName;
    if (fnid != null) {
        fieldName = fnid.value;
        if (fieldName != '')
            prefix = 'false';
        else
            fieldName = title;
        fnid.value = "";
    }
    var opt = document.createElement("option");
    var safetitle = makeitsafe(title);
    fieldName = makeitsafe(fieldName);
    opt.value = "TBD-" + type + "-" + length + "-" + safetitle + "-" + refTable + "-" + fieldName + "-" + prefix;
    opt.text = title;
    selectBox.options.add(opt);
}
function makeitsafe(title) {
    title = title.replace(/&/g,"");
    title = title.replace(/</g,"");
    title = title.replace(/>/g,"");
    title = title.replace(/\"/g,"");
    var safetitle = title.replace(/-/g,"!DASH!");
    return safetitle;
}
/**
* handle the input box for a choice add entry
*/
function addChoiceKeyPress(event, input, selectBox) {
    if (event.keyCode != 13)
        return true;
    addChoiceOption(selectBox, input);
    return false;
}
function ignoreEnter(event) {
    if (event.keyCode != 13)
        return true;
    return false;
}
function addNumericChoiceKeyPress(event, formElement, selectBox) {
    if (event.keyCode != 13)
        return true;
    addNumericChoiceOption(selectBox, formElement);
    return false;
}
function addChoiceOption(selectBox, input) {
    var title = input.value;
    input.value = "";
    var opt = document.createElement("option");
    opt.value = "TBD-" + title;
    opt.text = title;
    selectBox.options.add(opt);
}
/**
* add a new choice
*/
function addChoice(selectBox, formElement, selectTable) {
    var input = formElement.newOption;
    var title = input.value;
    input.value = "";
    var opt = document.createElement("option");
    opt.value = "TBD-" + title;
    opt.text = title;
    addTargetedChoice(selectBox, opt, selectTable);
}
function addNumericChoice(selectBox, formElement, selectTable) {
    var input = formElement.newOption.value;
    formElement.newOption.value = '';
    var number = formElement.newOptionValue.value;
    formElement.newOptionValue.value = '';
    var opt = document.createElement("option");
    opt.value = "TBD-" + input + "-TBDVALUE-" + number;
    opt.text = input;
    addTargetedChoice(selectBox, opt, selectTable);
}
function addTargetedChoice(selectBox, opt, selectTable) {
    if (selectTable != null && selectTable.selectedIndex > -1) {
        opt.value += "-TBDTARGET-" + selectTable.options[selectTable.selectedIndex].value;
    }
    selectBox.options.add(opt);
}
/**
* add choice from input field and clear the input value
*/
function addChoiceFromInput(selectBox, inputElement) {
    var title;
    if (inputElement.tagName == 'SELECT') {
        title = inputElement.options[inputElement.selectedIndex].value;
        inputElement.selectedIndex = 0;
    } else {
        title = inputElement.value;
        inputElement.value = '';
    }
    var opt = document.createElement("option");
    opt.value = title;
    opt.text = title;
    selectBox.options.add(opt);
}
/**
* add choice given an input value
*/
function addChoiceFromValue(selectBox, title) {
    var opt = document.createElement("option");
    opt.value = title;
    opt.text = title;
    selectBox.options.add(opt);
}
function addChoiceFromValueAndDisplay(selectBox, value, title) {
    var opt = document.createElement("option");
    opt.value = value;
    opt.text = title;
    selectBox.options.add(opt);
}
function sortSelect(obj) {
    if (!sortSupported(obj)) {
        return;
    }
    if (!hasOptions(obj)) {
        return;
    }
    var o = new Array();
    var o2 = new Array();
    var o3 = new Array();
    for (var i=0; i<obj.options.length; i++) {
        var newOption = new Option( obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected);
        copyAttributes(obj.options[i], newOption);
        if (newOption.value.indexOf('split') > 0)
            o2[o2.length] = newOption;
        else if (newOption.value.indexOf('formatter') > 0 || newOption.value.indexOf('component') > 0 ||
            newOption.value.indexOf('annotation') > 0)
            o3[o3.length] = newOption;
        else
            o[o.length] = newOption;
    }
    if (o.length == 0)
        return;
    o = o.sort(
        function(a,b) {
            if ((a.text.toLowerCase()+"") < (b.text.toLowerCase()+"")) {
                return -1;
            }
            if ((a.text.toLowerCase()+"") > (b.text.toLowerCase()+"")) {
                return 1;
            }
            return 0;
        }
        );
    o3 = o3.sort(
        function(a,b) {
            if ((a.text.toLowerCase()+"") < (b.text.toLowerCase()+"")) {
                return -1;
            }
            if ((a.text.toLowerCase()+"") > (b.text.toLowerCase()+"")) {
                return 1;
            }
            return 0;
        }
        );
    for (var i=0; i<o.length; i++) {
        var newOption = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
        copyAttributes(o[i], newOption);
        obj.options[i] = newOption;
    }
    var counter = 0;
    for (var i=o.length; i< (o.length + o2.length); i++) {
        var newOption = new Option(o2[counter].text, o2[counter].value, o2[counter].defaultSelected, o2[counter].selected);
        copyAttributes(o2[counter], newOption);
        obj.options[i] = newOption;
        counter++;
    }
    var counter = 0;
    for (var i=(o.length + o2.length); i< (o.length + o2.length + o3.length); i++) {
        var newOption = new Option(o3[counter].text, o3[counter].value, o3[counter].defaultSelected, o3[counter].selected);
        copyAttributes(o3[counter], newOption);
        obj.options[i] = newOption;
        counter++;
    }
}
function copyAttributes(from, to) {
    var attributes = from.attributes;
    for (var n = 0; n < attributes.length; n++) {
        var attr = attributes[n];
        var aname = attr.nodeName;
        var avalue = attr.nodeValue;
        to.setAttribute(aname, avalue);
    }
    if (from.style.cssText)
        to.style.cssText = from.style.cssText;
}
function hasOptions(obj) {
    if (obj != null && obj.options != null)
        return true;
    return false;
}
function sortSupported(obj) {
    if (obj != null) {
        var noSort = obj.no_sort || obj.getAttribute('no_sort');
        if (noSort) {
            return false;
        }
        return true;
    }
    return false;
}
function removeUsedSlush(avail, used, mainID) {
    var itemCnt = avail.options.length;
    for (var ib=0; ib<itemCnt; ib++) {
        if (itemExists(used, avail.options[ib].value) || avail.options[ib].value == mainID) {
            avail.options[ib] = null;
            itemCnt--;
            ib--;
        }
    }
}
function itemExists(sel, value) {
    if (!sel || !value)
        return false;
    for (var i=0; i<sel.options.length; i++) {
        if (sel.options[i].value == value)
            return true;
    }
    return false;
}
function slushChanged(avail, used, mainID) {
    removeUsedSlush(avail, used, mainID);
    populateIfEmpty(avail);
    populateIfEmpty(used);
}
function slushLoaded(fA, fB) {
    sortSelect(fA);
    sortSelect(fB);
    populateIfEmpty(fA);
    populateIfEmpty(fB);
}
function populateIfEmpty(sbox) {
    if (sbox.options && sbox.options.length == 0)
        addOption(sbox, "", "--" + new GwtMessage().getMessage("None") + "--")
}
function getColumns(select) {
    var sourceOptions = select.options;
    var index = 0;
    var selectedIndex = -1;
    for (var i = 0; i < select.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            selectedIndex = i;
            index++;
            if ( index > 1 )
                break;
        }
    }
    if ( index == 1 ) {
        var option = sourceOptions[selectedIndex];
        var colName = option.value;
        var colLabel = getTrueLabel(option);
        var tableName = getTablenameFromOption(option);
        if (tableName === undefined || tableName == null || tableName == '' )
            tableName = "";
        if ( tableName.length > 0 ) {
            var bt = getBaseTable(option);
            var btl = getBaseTableLabel(option);
            var tableLabel = getTablelabelFromOption(option);
            var tableParent = getParentTable(option)
            var tableDef = Table.get(tableName, tableParent);
            var ext = getHeaderAttr(option);
            processColumns(tableDef, new Array(colName, colLabel, tableName, tableLabel, bt, btl, 'replace', ext));
        }
    }
}
function refreshAvailable() {
    var button = document.getElementById('expand_x0');
    button.style.display = "none";
    button = document.getElementById('expand_x0s');
    button.style.display = "block";
    var select = document.getElementById('select_0');
    var tableName = select.getAttribute("gsft_basetable");
    if (tableName.length > 0) {
        var tableDef = Table.get(tableName, tableName);
        var tableLabel = tableDef.getLabel();
        processColumns(tableDef, new Array(tableName, tableLabel + " fields", tableName, tableLabel, tableName, tableLabel, 'append', true));
    }
}
function expandFile(select, prefix) {
    if (!prefix)
        prefix = "";
    var button = document.getElementById(prefix+'expand_x0');
    button.style.display = "none";
    button = document.getElementById(prefix+'expand_x0s');
    button.style.display = "block";
    var select = document.getElementById(prefix+'select_0');
    var option = getSingleSelectedOption(select);
    if (option != null) {
        var colName = option.value;
        var colLabel = getTrueLabel(option);
        var tableName = getTablenameFromOption(option);
        var tableLabel = getTablelabelFromOption(option);
        var bt = getBaseTable(option);
        var btl = getBaseTableLabel(option);
        var ext = getHeaderAttr(option);
        if (tableName.length > 0) {
            var tableParent = getParentTable(option)
            var tableDef = Table.get(tableName, tableParent);
            processColumns(tableDef, new Array(colName, colLabel, tableName, tableLabel, bt, btl, 'append', ext, prefix));
        }
    }
}
function showExpandFile(select, prefix) {
    if (!prefix)
        prefix = "";
    var select = document.getElementById(prefix+'select_0');
    var option = getSingleSelectedOption(select);
    if ( option != null ) {
        if (option.value == "ext_separator") {
            setPreference("show_extended_fields","false");
            showExtFields = "false";
            setSingleSelectOption(select.options[0],prefix+'select_0');
            refreshAvailable();
            return;
        }
        if (option.value == "ext_separator_show") {
            deletePreference("show_extended_fields");
            showExtFields = "true";
            setSingleSelectOption(select.options[0],prefix+'select_0');
            refreshAvailable();
            return;
        }
        var tableName = getTablenameFromOption(option);
        var isHeader = getHeaderAttr(option);
        if (isHeader) {
            expandFile(select, prefix);
            return;
        }
        if ( tableName.length > 0 ) {
            var button = document.getElementById(prefix+'expand_x0');
            button.style.display = "block";
            button = document.getElementById(prefix+'expand_x0s');
            button.style.display = "none";
            setSingleSelectOption(option, prefix+'select_1');
            return;
        }
    }
    var button = document.getElementById(prefix+'expand_x0');
    button.style.display = "none";
    button = document.getElementById(prefix+'expand_x0s');
    button.style.display = "block";
}
function setSingleSelectOption(soption, sid) {
    var select = document.getElementById(sid);
    select.selectedIndex = -1;
    var sourceOptions = select.options;
    for (var i = 0; i < sourceOptions.length; i++) {
        option = sourceOptions[i];
        if (option.value == soption.value) {
            option.selected = true;
            select.disabled = true;
            select.disabled = false;
            break;
        }
    }
}
function getSingleSelectedOption(select) {
    var sourceOptions = select.options;
    var index = 0;
    var selectedIndex = -1;
    for (var i = 0; i < select.length; i++) {
        option = sourceOptions[i];
        if (option.selected) {
            selectedIndex = i;
            index++;
            if ( index > 1 )
                break;
        }
    }
    if ( index == 1 ) {
        var option = sourceOptions[selectedIndex];
        return option;
    }
    return null;
}
function processColumns(tableDef, args) {
    var colName = args[0];
    var colLabel = args[1];
    var tableName = args[2];
    var tableLabel = args[3];
    var baseTable = args[4];
    var baseTableLabel = args[5];
    var append = args[6];
    var ext = args[7];
    var prefix = args[8];
    if (!prefix)
        prefix = "";
    var idx = colLabel.indexOf("-->");
    if (idx > -1)
        colLabel = colLabel.substring(0, idx);
    else if (colLabel.indexOf(" fields") > -1) {
        colLabel = '';
        colName = '';
    }
    var select = document.getElementById(prefix+'select_0');
    var si = 0;
    var tFile = tableLabel + " fields";
    if (colLabel != '' )
        tFile = colLabel + "-->" + tFile
    var si = 0;
    if (append == 'append') {
        for (si = 0; si < select.options.length; si++) {
            var option = select.options[si];
            var optValue = option.value;
            var optLabel = getTrueLabel(option);
            var isHeader = getHeaderAttr(option);
            if (!isHeader)
                break;
            if (optLabel == tFile)
                break;
        }
    }
    while (select.length > si) {
        select.remove(si);
    }
    var selectType = gel('sysparm_form');
    if (!selectType || selectType.value != 'list')
        ext = false;
    if (colLabel != '') {
        if (si == 0) {
            appendSelectOption(select, baseTable, document.createTextNode(baseTableLabel + " fields"));
            var xxx = select.options[select.options.length-1];
            xxx.style.color = 'blue';
            xxx.reference = baseTable;
            xxx.tl = baseTableLabel;
            xxx.cl = baseTableLabel + " fields";
            xxx.btl = baseTableLabel;
            xxx.bt = baseTable;
            xxx.cv = '';
            xxx.headerAttr = 'true';
            si = 1;
        }
        var idx = tFile.lastIndexOf(".");
        if (idx > -1)
            tFile = tFile.substring(idx+1);
        if (si > 6)
            si = 6;
        tFile = ".......".substring(0, si)+tFile;
        appendSelectOption(select, colName, document.createTextNode(tFile));
        var xxx = select.options[select.options.length-1];
        var lastpart = colName.substring(colName.lastIndexOf('.') + 1);
        if (lastpart.indexOf("ref_") == 0) {
            xxx.style.color = 'darkred';
            xxx.title="Extended fields from " + tableLabel + " table";
        } else {
            xxx.style.color = 'blue';
            xxx.title="Derived fields from " + colLabel + " reference field";
        }
        xxx.reference = tableName;
        xxx.tl = tableLabel;
        xxx.cl = tFile;
        xxx.cv = colName;
        xxx.headerAttr = 'true';
    }
    var items;
    if (ext && si > 0)
        items = tableDef.getTableElements(tableName);
    else
        items = tableDef.getElements();
    if (selectType && selectType.value == 'section') {
        var reqFields = gel("required_fields");
        if (reqFields)
            var reqFieldsArray = reqFields.value.split(",");
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var t = item.getName();
        if (t == 'sys_id')
            continue;
        if (colLabel != '')
            t = colName + "." + t;
        var label = item.getLabel();
        var leftLabel = item.getClearLabel();
        var rawLabel = item.getClearLabel();
        if (colLabel != '')
            rawLabel = colLabel + "." + rawLabel;
        while (rawLabel.indexOf(".") == 0)
            rawLabel = rawLabel.substring(1);
        var curOptions = document.getElementById(prefix+'select_1').options;
        var ref = item.getReference();
        var type = item.getType();
        if (item.getNamedAttribute("slushbucket_ref_no_expand") == "true")
            ref = null;
        var skipAdd = false;
        if (ref == null || ref.length == 0) {
            for (var oi = 0; oi < curOptions.length; oi++) {
                var ov = curOptions[oi].value;
                if (t == ov) {
                    skipAdd = true;
                    break;
                }
            }
        }
        if (selectType && selectType.value == 'list' && item.getNamedAttribute("list_layout_ignore") == "true")
            skipAdd = true;
        if (skipAdd == false) {
            if (ref != null && ref.length) {
                label += " [+]";
                leftLabel += " [+]";
            }
            appendSelectOption(select, t, document.createTextNode(leftLabel));
            var opt = select.options[select.options.length - 1];
            var yyy = opt.innerHTML;
            if (colLabel != '')
                opt.innerHTML = "&nbsp;&nbsp;&nbsp;" + yyy;
            opt.cl = rawLabel;
            opt.cv = t;
            var title = item.getAttribute("title");
            opt.reference = ref;
            if (ref != null && ref.length) {
                opt.parentTable = tableDef.getName();
                opt.style.color = 'green';
                opt.doNotDelete = 'true';
                opt.tl = item.getAttribute("reflabel");
                opt.bt = baseTable;
                opt.btl = baseTableLabel;
            }
            if (typeof reqFieldsArray != 'undefined') {
                for (var r = 0; r < reqFieldsArray.length; r++) {
                    if (reqFieldsArray[r] == opt.value) {
                        opt.style.color = 'grey';
                        if (title != "")
                            title = title + " - " + "Required on form";
                        else
                            title = "Required on form";
                    }
                }
            }
            opt.title = title;
        }
    }
    if (append != 'append')
        return;
    if (!selectType || selectType.value != 'list')
        return;
    items = tableDef.getExtensions();
    if (items.length > 0) {
        appendSelectOption(select, t, document.createTextNode("Extended field header"));
        var opt = select.options[select.options.length - 1];
        var extHeader = "-- Hide Extended Fields --";
        opt.value = "ext_separator";
        var extPref = getPreference("show_extended_fields");
        if ((typeof showExtFields == 'undefined' && extPref == "false") ||
            (typeof showExtFields != 'undefined' && showExtFields == "false")) {
            extHeader = "-- Show Extended Fields --"
            opt.value = "ext_separator_show";
        }
        if (colLabel != '')
            extHeader = "&nbsp;&nbsp;&nbsp;" + extHeader;
        opt.innerHTML = extHeader;
        opt.style.color = "darkred";
        opt.doNotMove = 'true';
        opt.doNotDelete = 'true';
        if ((typeof showExtFields == 'undefined' && extPref != "false") ||
            (typeof showExtFields != 'undefined' && showExtFields == "true")) {
            var addMe = new Array();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var exttable = item.getName();
                var tab = Table.get(exttable);
                var extfields = tab.getTableElements(exttable);
                for (var j = 0; j < extfields.length; j++) {
                    var obj = new Object();
                    var extfield = extfields[j];
                    obj.label = extfield.getLabel();
                    obj.ext = item.getExtName();
                    obj.extlabel = item.getLabel();
                    obj.field = extfield;
                    obj.ref = extfield.isReference();
                    addMe.push(obj);
                }
            }
            sortedAddMe = addMe.sort(sortExtendedFieldsByLabel);
            for (var i = 0; i < sortedAddMe.length; i++) {
                var efield = sortedAddMe[i];
                var field = efield.field.getAttribute("value");
                var label = efield.field.getClearLabel() + " [" + efield.extlabel + "]";
                var ext = efield.ext;
                if (colName && colName != '')
                    ext = colName + "." + ext;
                appendSelectOption(select, ext + "." + field, document.createTextNode("extended field option"));
                var opt = select.options[select.options.length-1];
                var innerHTML = label;
                if (efield.field.isReference()) {
                    opt.reference = efield.field.getReference();
                    opt.doNotDelete = 'true';
                    innerHTML = innerHTML + " [+]"
                }
                if (colLabel != '')
                    innerHTML = "&nbsp;&nbsp;&nbsp;" + innerHTML;
                opt.innerHTML = innerHTML;
                opt.style.color = 'darkred';
                if (colLabel && colLabel != '')
                    opt.cl = colLabel + "." + label;
                else
                    opt.cl = label;
                opt.bt = tableDef.getName();
                opt.btl = tableDef.getLabel();
            }
        }
    }
}
function sortExtendedFieldsByLabel(a,b) {
    if (a.label > b.label)
        return 1;
    if (a.label < b.label)
        return -1;
    return 0;
}
function switchOrder(sourceSelect, forceAscending) {
    if (sourceSelect.selectedIndex > -1) {
        var option = sourceSelect.options[sourceSelect.selectedIndex];
        var text = option.text;
        var newtext = text;
        var index = text.indexOf('(');
        if ( index != -1 )
            newtext = text.substring(0, index);
        if ( forceAscending == 1 || text.indexOf('(z to a)') > -1 ) {
            newtext = newtext+'(a to z)';
        } else
            newtext = newtext+'(z to a)';
        option.text = newtext;
    } else
        alert('Please select an item from the list first');
}
function showSelected(element, divname, table) {
    if (element.selectedIndex > -1) {
        var option = element.options[element.selectedIndex];
        var url = "xmlhttp.do?sysparm_processor=SingleRecord" + "&sysparm_name=" +
        table + "&sysparm_sys_id=" + option.value
        serverRequest(url, singleRecordResponse, new Array(divname));
    }
}
function singleRecordResponse(request, args) {
    var divname = args[0];
    var preview = document.getElementById(divname);
    clearNodes(preview);
    if (request.responseXML.documentElement) {
        var items = request.responseXML.getElementsByTagName("item");
        for(var iCnt = 0; iCnt < items.length; iCnt++) {
            var item = items[iCnt];
            var name = item.getAttribute("label");
            var tr = document.createElement('tr');
            var tdLabel = document.createElement('td');
            tdLabel.className = "label";
            tdLabel.setAttribute('noWrap', 'true');
            var label = document.createElement('label');
            label.appendChild(document.createTextNode(name));
            tdLabel.appendChild(label);
            tr.appendChild(tdLabel);
            var tdValue = document.createElement('td');
            tr.appendChild(tdValue);
            label = document.createElement('label');
            var evalue = item.getAttribute("value");
            label.appendChild(document.createTextNode(evalue));
            tdValue.appendChild(label);
            preview.appendChild(tr);
        }
        _frameChanged();
    }
}
function getTrueLabel(o) {
    return o.cl || o.getAttribute('cl');
}
function getTitle(o) {
    return o.title || o.getAttribute('title');
}
function getBaseTable(o) {
    return o.bt || o.getAttribute('bt');
}
function getBaseTableLabel(o) {
    return o.btl || o.getAttribute('btl');
}
function getParentTable(o) {
    return o.parentTable || o.getAttribute('parentTable') || o.getAttribute('parenttable');
}
function getHeaderAttr(o) {
    var isHeader = o.headerAttr || o.getAttribute('headerAttr') || o.getAttribute('headerattr');
    if ('true' == isHeader)
        return true;
    else
        return false;
}
function getDoNotDelete(o) {
    return o.doNotDelete || o.getAttribute("doNotDelete") || o.getAttribute("donotdelete")
}
function getDoNotMove(o) {
    return o.doNotMove || o.getAttribute('doNotMove') || o.getAttribute('donotmove');
}
function getMultipleAllowed(o) {
    return o.multipleAllowed || o.getAttribute('multipleAllowed') || o.getAttribute('multipleallowed');
}
function getCopyAttributes(o) {
    return o.copyAttributes || o.getAttribute('copyAttributes') || o.getAttribute('copyattributes');
}
function getShowAnnotation(o) {
    return o.showAnnotation || o.getAttribute('showAnnotation') || o.getAttribute('showannotation');
}
function getAnnotationTextLabel(o) {
    return o.text_label || o.getAttribute('text_label');
}
function getTablelabelFromOption(option) {
    var tableName = option.tl || option.getAttribute('tl');
    if (tableName === undefined || tableName == null || tableName == '' )
        tableName = "";
    return tableName;
}
function getTablenameFromOption(option) {
    var tableName = option.reference || option.getAttribute('reference');
    if (tableName === undefined || tableName == null || tableName == '' )
        tableName = "";
    return tableName;
}
var SLUSHBUCKET_ANNOTATION_PREFIX = ".annotation.";
function slushbucket_onSelect(select) {
    var eSpan = gel("slushbucket_annotation_span");
    if (eSpan == null)
        return;
    var eTxt = gel("slushbucket_annotation_text");
    if (eTxt == null)
        return;
    var eType = gel("slushbucket_annotation_type");
    if (eType == null)
        return;
    hideObject(eSpan);
    var option = getSingleSelectedOption(select);
    if (option != null) {
        var showAnnotation = getShowAnnotation(option);
        if (showAnnotation) {
            var annotation = option.value.substring(SLUSHBUCKET_ANNOTATION_PREFIX.length);
            var typeIndex = 0;
            var text = "";
            var type = "";
            label = getAnnotationTextLabel(eType.options[0]);
            var pos = annotation.indexOf(".");
            if (pos > 0) {
                type = annotation.substring(0, pos);
                for (var i = 0; i < eType.options.length; i++) {
                    if (eType.options[i].value == type) {
                        typeIndex = i;
                        label = getAnnotationTextLabel(eType.options[i]);
                        break;
                    }
                }
                text = annotation.substring(pos + 1);
            }
            eType.selectedIndex = typeIndex;
            eTxt.value = text;
            slushbucket_setAnnotationLabel(label);
            showObject(eSpan);
            slushbucket_annotation_onChange(select);
        }
    }
}
function slushbucket_setAnnotationLabel(label) {
    var eTxtSpan = gel("slushbucket_annotation_text_span");
    if (eTxtSpan == null) {
        return;
    }
    eTxtSpan.innerHTML = label;
}
function slushbucket_annotation_onChange(select) {
    var eTxt = gel("slushbucket_annotation_text");
    if (eTxt == null) {
        return;
    }
    var eType = gel("slushbucket_annotation_type");
    if (eType == null) {
        return;
    }
    var option = getSingleSelectedOption(select);
    if (option != null) {
        var showAnnotation = getShowAnnotation(option);
        if (showAnnotation) {
            var type = eType.options[eType.selectedIndex].value;
            option.value = SLUSHBUCKET_ANNOTATION_PREFIX + type + "." + eTxt.value;
            slushbucket_setAnnotationLabel(getAnnotationTextLabel(eType.options[eType.selectedIndex]));
        }
    }
}