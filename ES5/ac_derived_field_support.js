//defer ac_derived_field_support.js
function refFieldChangeResponse(request, args)  {
    if (request == null)
        return;
    var elementName = args[0];
    var parts = elementName.split(".");
    parts.shift();
    var sName = parts.join(".") +".";
    var nodes = new Array();
    if (args[1]) {
        var fields = args[1].split(',');
        nodes = setNodes(sName, fields, request);
        return;
    }
    jslog("************** WHAT ARE WE DOING HERE *********************");
}
function setNodes(sName, array, request) {
    for (var i=0; i<array.length; i++) {
        var fn = array[i];
        var eln = sName + fn;
        var elo = g_form.getGlideUIElement(eln);
        if (!elo)
            continue;
        var field = request.responseXML.getElementsByTagName(fn);
        if (field.length != 1) {
            g_form.clearValue(eln);
            continue;
        }
        var dv = field[0].getAttribute('value')
        var v = field[0].getAttribute('db_value')
        if (elo.getType() == 'glide_list' || elo.getType() == 'reference') {
            var v = field[0].getAttribute('db_value')
            g_form._setValue(eln, v, dv.split(","), false);
        } else if (v)
            g_form.setValue(eln, v, dv);
        else
            g_form.setValue(eln, dv);
    }
}