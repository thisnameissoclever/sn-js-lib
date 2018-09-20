//defer functions_reference.js
function updateAndFlip(select, elementName) {
    var option = setSelectValue(select, elementName);
    onChange(elementName);
    refFlipImage(option, elementName);
}
function setSelectValue(select, elementName) {
    var value = '';
    var text = '';
    var option;
    if (select.selectedIndex != -1) {
        option = select.options[select.selectedIndex];
        value = option.value;
        text = option.text;
    }
    var id = gel(elementName);
    id.value = value;
    var idd = gel('sys_display.' + elementName);
    if (value == '')
        idd.value = '';
    else
        idd.value = text;
    return option;
}
function refFlipImage(element, elementName, useText) {
    var viewField = gel("view." + elementName);
    if (!viewField)
        return;
    var viewRField = gel("viewr." + elementName);
    var viewHideField = gel("view." + elementName + ".no");
    var refid = gel(elementName);
    var value = element.value;
    if (!value) {
        hideObject(viewField);
        hideObject(viewRField);
        showObjectInline(viewHideField);
    } else {
        showObjectInline(viewField);
        showObjectInline(viewRField);
        hideObject(viewHideField);
    }
}
function refFlipImageDisplay(element, dsp) {
    if (element)
        element.style.display = dsp;
}