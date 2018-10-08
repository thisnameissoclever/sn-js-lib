var CartItemList = Class.create();
CartItemList.prototype = {
    initialize: function(cart) {
        this.processor = "com.glideapp.servicecatalog.CartAjaxProcessor";
        this.urlPrefix = "xmlhttp.do?sysparm_processor=" +  this.processor;
        this.cartBody = null;
        this.backbutton = true;
        this.cart = cart;
        this._setOptions();
        var gwt = new GwtMessage();
        var values = ["Shopping Cart", "Empty", "Edit Cart", "Continue Shopping", "Proceed to Checkout", "Save and Checkout"];
        this.answer = gwt.getMessages(values);
        CustomEvent.observe("catalog_cart_changed", this._cartResponse.bind(this));
    },
    _setOptions: function() {
        this.backbutton = true;
        var no_checkout = gel('sysparm_no_checkout');
        var no_proceed_checkout = gel('no_proceed_checkout');
        this.no_checkout = no_checkout && no_checkout.value == 'true';
        this.no_proceed_checkout = no_proceed_checkout && no_proceed_checkout == 'true';
        this.show_proceed = !(this.no_checkout || this.no_proceed_checkout);
    },
    create: function() {
        var w = new GlideWindow('cartContent', true);
        w.setClassName('sc_cart_window');
        this.cartBody = w.getBody();
        w.setPosition("relative");
        w.setSize(200, 10);
        w.setTitle(this.answer["Shopping Cart"]);
        w.setBody(this.answer["Empty"]);
        w.insert(gel('cart'));
    },
    get: function() {
        serverRequest(this.urlPrefix, this._cartResponse.bind(this));
    },
    notify: function(event, response) {
        if (event == 'cart_change')
            this._cartResponse(response);
    },
    _cartResponse: function(request) {
        var xml = request.responseXML;
        this.cartBody.innerHTML = "";
        var gwt = new GwtMessage();
        var subtotal = xml.getElementsByTagName("subtotal");
        var hasprice = subtotal[0].getAttribute("has_price");
        subtotal = subtotal[0].getAttribute("text");
        var items = xml.getElementsByTagName("item");
        if (items.length < 1) {
            this.cartBody.innerHTML = this.answer["Empty"];
            this._afterChange();
            return;
        }
        var catItem = xml.getElementsByTagName("cat_item");
        if (catItem.length > 0) {
            var itemGuid = catItem[0].getAttribute("item_guid");
            var itemParm = gel("sysparm_item_guid");
            if (itemParm)
                itemParm.value = itemGuid;
        }
        var table = new GwtTable();
        for(var i = 0; i < items.length; i++) {
            var q = items[i].getAttribute("quantity");
            var d = items[i].getAttribute("description");
            table.addRowWithClassName("sc_cart_cell", q, d);
        }
        this.cartBody.appendChild(table.htmlElement);
        if (hasprice == 'true') {
            var span = cel("div");
            if (isMSIE)
                span.style.fontSize = "x-small";
            else
                span.style.fontSize = "small";
            span.innerHTML = "<hr/><strong>" + subtotal + "</strong><br/>&nbsp;";
            this.cartBody.appendChild(span);
        }
        span = cel("span");
        span.innerHTML = "<button id=\"catalog_cart_edit_button\" onclick=\"window.location='com.glideapp.servicecatalog_cart_view.do'\" class='catalog catalog_cart_edit'>" + this.answer["Edit Cart"] + "</button>";
        this.cartBody.appendChild(span);
        if (this.show_proceed) {
            cel("br", this.cartBody);
            cel("br", this.cartBody);
            var span = cel("span");
            if (this.editID) {
                span.innerHTML = "<a id=\"catalog_cart_save_checkout\" onclick=\"proceedCheckout('" + this.editID + "')\">" +
                "<img src='images/save_and_checkout.pngx' alt='" + this.answer["Save and Checkout"] + "'/>" +
                "</a>";
            } else {
                var gurl = new GlideURL("service_catalog.do");
                gurl.addParam('sysparm_action', 'checkout');
                gurl.addToken();
                span.innerHTML = "<a id=\"catalog_cart_proceed_checkout\" href='" + gurl.getURL() + "'>" +
                "<img src='images/checkout.pngx' alt='" + this.answer["Proceed to Checkout"] + "'/>" +
                "</a>";
            }
            this.cartBody.appendChild(span);
        }
        if (this.backbutton) {
            cel("br", this.cartBody);
            cel("br", this.cartBody);
            span = cel("span");
            var gurl = new GlideURL("service_catalog.do");
            gurl.addParam('sysparm_action', 'continue_shopping');
            gurl.addToken();
            span.innerHTML = "<a id=\"catalog_cart_continue_shopping\" href='" + gurl.getURL() + "'>" +
            "<img src='images/continue_shopping.pngx' alt='" + this.answer["Continue Shopping"] + "'/>" +
            "</a>";
            this.cartBody.appendChild(span);
        }
        this._afterChange();
    },
    _afterChange : function() {
        if (this.cart)
            this.cart._changed();
        _frameChanged();
    },
    initForm: function() {
        var form = addForm();
        form.action = this.fAction;
        form.name = this.fAction;
        form.id = this.fAction;
        form.method = "POST";
        return form;
    },
    setContentElement: function (cartBody) {
        this.cartBody = $(cartBody);
    }
};
function catalogTextSearch(e) {
    if (e != null && e.keyCode != 13)
        return;
    var f = document.forms['search_form'];
    if (!f['onsubmit'] || f.onsubmit())
        f.submit();
}
function catReqFor(name) {
    var v = gel(name);
    v = v.value;
    var processor = "com.glideapp.servicecatalog.CartAjaxProcessor";
    var url = "xmlhttp.do?sysparm_processor=" + processor;
    url +=  "&sysparm_action=" + "req_for";
    url +=  "&sysparm_value=" + v;
    serverRequest(url);
    var diamond = gel('catalog_super_diamond');
    var vis = 'none';
    if (v != null && v != '')
        vis = '';
    diamond.style.display = vis;
}
function superLink(inputname) {
    var superinput = gel(inputname);
    var sys_id = superinput.value;
    var url = "sys_user.do?sys_id=" + sys_id;
    var frame = top.gsft_main;
    if (!frame)
        frame = top;
    frame.location = url;
}
function saveCartAttachment(sys_id) {
    saveAttachment("sc_cart", sys_id)
}
function guideNext(item) {
    var m = g_form.catalogOnSubmit();
    if (!m) {
        return;
    }
    var action = "init_guide";
    var guide = gel('sysparm_guide').value;
    if (guide != item)
        action = 'next_guide';
    guideSubmit(action, item) ;
}
function guideSubmit(action, item) {
    var active = gel('sysparm_active').value;
    var edit = gel('sysparm_cart_edit').value;
    var guide = gel('sysparm_guide').value;
    var quantity = 1;
    if (gel('quantity'))
        quantity = gel('quantity').value;
    var form = addForm();
    form.action = "service_catalog.do";
    form.name = "service_catalog.do";
    form.id = "service_catalog.do";
    form.method = "POST";
    addInput(form, "HIDDEN", "sysparm_action", action);
    addInput(form, "HIDDEN", "sysparm_id", item);
    addInput(form, "HIDDEN", "sysparm_guide", guide);
    addInput(form, "HIDDEN", "sysparm_active", active);
    addInput(form, "HIDDEN", "sysparm_cart_edit", edit);
    addInput(form, "HIDDEN", "sysparm_quantity", quantity);
    addSequence(form);
    g_cart.addInputToForm(form);
    form.submit();
}
function addSequence(form) {
    var s = gel('variable_sequence');
    var seq = '';
    if (s)
        seq = s.value;
    addInput(form, "HIDDEN", "variable_sequence1", seq);
}
function guidePrevious(item) {
    var action = "previous_guide";
    guideSubmit(action, item);
}
function contextCatalogHeader(e, sys_id) {
    var name = "context_catalog_header";
    menuTable = "VARIABLE_catalog_header";
    menuField = "not_important";
    rowSysId = sys_id;
    if (getMenuByName(name)) {
        var contextMenu = getMenuByName(name).context;
        contextMenu.setProperty('sysparm_sys_id', sys_id);
        contextMenu.display(e);
    }
    return false;
}
function saveAndNavigate(target) {
    var m = g_form.catalogOnSubmit();
    if (!m) {
        return;
    }
    var action = "nav_guide";
    var active = gel('sysparm_active').value;
    var edit = gel('sysparm_cart_edit').value;
    var guide = gel('sysparm_guide').value;
    var item = gel('current_item').value;
    var quan = gel('quantity');
    var form = addForm();
    form.action = "service_catalog.do";
    form.name = "service_catalog.do";
    form.id = "service_catalog.do";
    form.method = "POST";
    addInput(form, "HIDDEN", "sysparm_action", action);
    addInput(form, "HIDDEN", "sysparm_target", target);
    addInput(form, "HIDDEN", "sysparm_id", item);
    addInput(form, "HIDDEN", "sysparm_guide", guide);
    addInput(form, "HIDDEN", "sysparm_active", active);
    addInput(form, "HIDDEN", "sysparm_cart_edit", edit);
    if (quan)
        addInput(form, "HIDDEN", "sysparm_quantity", quan.value);
    addSequence(form);
    g_cart.addInputToForm(form);
    form.submit();
}
function saveCatAttachment(item_sys_id, tableName) {
    if (!g_cart)
        return;
    g_cart.addAttachment(item_sys_id, tableName);
}
function variableOnChange(variableName) {
    doCatOnChange(variableName);
    if (g_form && g_form.notifyCatLabelChange) {
        g_form.notifyCatLabelChange(variableName);
        if (g_form.hasPricingImplications(variableName))
            calcPrice();
    }
}
function doCatOnChange(variableName) {
    for (var x=0; x< g_event_handlers.length; x++) {
        var handler = g_event_handlers[x];
        var vName = handler.fieldName;
        if (vName == variableName) {
            var original = gel('sys_original.' + variableName);
            var oValue = 'unknown';
            if (original)
                oValue = original.value;
            var nValue = g_form.getValue(variableName);
            var eChanged = g_form.getControl(variableName);
            var realFunction = handler.handler;
            realFunction.call(this, eChanged, oValue, nValue, false);
        }
    }
}
function toggleVariableSet(id) {
    var img = gel('img_' + id);
    if (!img)
        return;
    var src = img.src;
    var display = '';
    if (src.indexOf('reveal') > -1 ) {
        img.src = "images/filter_hide.gifx";
        img.at = new GwtMessage().getMessage('Expand');
        display='none';
    } else {
        img.src = "images/filter_reveal.gifx";
        img.alt = new GwtMessage().getMessage('Collapse');
    }
    var setRow = gel('row_' + id);
    setRow.style.display = display;
    _frameChanged();
}
function expandCollapseAllSets(expand) {
    var rows = $(document.body).select('.variable_set_row');
    for (var i =0; i < rows.length; i++) {
        var row = rows[i];
        var toggle = false;
        if (expand && row.style.display=='none')
            toggle = true;
        else if (!expand && row.style.display != 'none')
            toggle = true;
        if (toggle)
            toggleVariableSet(row.id.substring(4));
    }
}
function lineItemVeto(sc_req_item, state) {
    var form = addForm();
    form.action = 'service_catalog.do';
    form.name = 'service_catalog.do';
    form.id = 'service_catalog.do';
    form.method = "POST";
    addInput(form, "HIDDEN", "sysparm_action", "veto");
    addInput(form, "HIDDEN", "sysparm_id", sc_req_item);
    addInput(form, "HIDDEN", "sysparm_state", state);
    form.submit();
}
var SCCart = Class.create();
SCCart.prototype = {
    initialize: function() {
        this.htmlElement = null;
        this.fAction = "service_catalog.do";
        this.processor = "com.glideapp.servicecatalog.CartAjaxProcessor";
        this.urlPrefix = "xmlhttp.do?sysparm_processor=" +
        this.processor;
        this.showCart = true;
        this.enhanceLabels = false;
    },
    attachWindow: function(qtyName, cartName, windowTitle) {
        var w = new GlideWindow('adder', true);
        w.setClassName('sc_cart_window');
        w.setPosition("relative");
        w.setSize(200, 10);
        w.setTitle(windowTitle);
        var qty = gel(qtyName);
        qty.style.display='';
        w.setBody(qty);
        w.insert(gel(cartName));
    },
    setCartVisible : function(showCart) {
        this.showCart = showCart;
    },
    addCartContent: function() {
    },
    order: function(item, quantity, sc_cart_item_id) {
        this._postAction(null, quantity,item, "order", sc_cart_item_id);
    },
    orderUpdate: function(cart_item, quantity) {
        var item_id = gel("sysparm_id").value;
        this._postAction(cart_item, quantity, item_id, "update_proceed");
    },
    add: function(item, quantity, itemId) {
        var url = this.urlPrefix +
        "&sysparm_action=" + "add" +
        "&sysparm_id=" + item +
        "&sysparm_quantity=" + quantity +
        "&sysparm_item_guid=" + itemId;
        var hint = gel('sysparm_processing_hint');
        if (hint && hint.value)
            url += "&sysparm_processing_hint=" + hint.value;
        var postString = this.generatePostString();
        serverRequestPost(url, postString, this._addResponse.bind(this));
    },
    _addResponse : function(response) {
        CustomEvent.fire("catalog_cart_changed", response);
    },
    generatePostString : function() {
        var postString = "";
        var optionsElements = $(document.body).select(".cat_item_option");
        var seq = 0;
        for (i = 0; i < optionsElements.length; i++) {
            var element = optionsElements[i];
            var n = element.name;
            if ("variable_sequence" == n) {
                seq++;
                n = n + seq;
            }
            if (element.type == "radio" && element.checked)
                postString += n + "=" + encodeURIComponent(element.value) + "&";
            else if (element.type != "radio")
                postString += n + "=" + encodeURIComponent(element.value) + "&";
        }
        return postString;
    },
    recalcPrice: function(item, quantity) {
        price = new CatalogPricing(item, this);
        price.refreshCart(quantity, this.enhanceLabels);
    },
    edit: function(cart_item, quantity) {
        var item_id = $F("sysparm_id");
        this._postAction(cart_item, quantity, item_id, "update");
    },
    addAttachment : function(item_sys_id, tableName) {
        saveAttachment(tableName, item_sys_id);
    },
    showReferenceForm : function(inputName, tableName) {
        if (!g_form.catalogOnSubmit())
            return;
        var quantity = 1;
        var quan_widget = gel("quantity");
        if (quan_widget)
            quantity = quan_widget.value;
        var item_id = $F("sysparm_id");
        var ref_sys_id = gel(inputName).value;
        var form = this.initForm();
        addInput(form, "HIDDEN", "sysparm_table", tableName);
        addInput(form, "HIDDEN", "sysparm_ref_lookup", ref_sys_id);
        addInput(form, "HIDDEN", "sysparm_action", "show_reference");
        addInput(form, "HIDDEN", "sysparm_quantity", quantity);
        addInput(form, "HIDDEN", "sysparm_id", item_id);
        var hint = gel('sysparm_processing_hint');
        if (hint && hint.value)
            addInput(form, "HIDDEN", "sysparm_processing_hint", hint.value);
        this.addInputToForm(form);
        form.submit();
    },
    _postAction: function(cart_item, quantity, item_id, action, sc_cart_item_id) {
        var form = this.initForm();
        addInput(form, "HIDDEN", "sysparm_action", action);
        if (cart_item)
            addInput(form, "HIDDEN", "sysparm_cart_id", cart_item);
        addInput(form, "HIDDEN", "sysparm_quantity", quantity);
        addInput(form, "HIDDEN", "sysparm_id", item_id);
        var hint = gel('sysparm_processing_hint');
        if (hint && hint.value)
            addInput(form, "HIDDEN", "sysparm_processing_hint", hint.value);
        if (sc_cart_item_id)
            addInput(form, "HIDDEN", "sysparm_item_guid", sc_cart_item_id);
        this.addInputToForm(form);
        form.submit();
    },
    addInputToForm: function(form) {
        var optionsElements = $(document.body).select(".cat_item_option");
        var seq = 0;
        for (i = 0; i < optionsElements.length; i++) {
            var element = optionsElements[i];
            var n = element.name;
            if ("variable_sequence" == n) {
                seq++;
                n = n + seq;
            }
            if (element.type == "radio" && element.checked)
                addInput(form, "HIDDEN", n, element.value);
            else if (element.type != "radio")
                addInput(form, "HIDDEN", n, element.value);
        }
    },
    getWithBackButton: function() {
        if (!this.showCart)
            return;
        var i = new CartItemList(this);
        i.create();
        i.get();
    },
    _changed : function() {
        var args = new Object();
        args['html'] = gel("cart").innerHTML;
        args['window'] = window;
        CustomEvent.fireTop('cart.loaded', args);
    },
    initForm: function() {
        var form = addForm();
        form.action = this.fAction;
        form.name = this.fAction;
        form.id = this.fAction;
        form.method = "POST";
        return form;
    },
    setContentElement: function (htmlElement) {
        this.htmlElement = $(htmlElement);
    }
};
/*
* Handles the client side updating of lookup select type questions
* potentially need to reset their list of choices if they A) have an advanced reference qualifier
* and B) you change one of those fields on the client side
*/
var CatalogReferenceChoice = Class.create(AJAXReferenceChoice, {
    initialize: function(element, reference, dependentReference, refQualElements, targetTable) {
        if (!element)
            element = gel('sys_original.' + reference);
        AJAXReferenceCompleter.prototype.initialize.call(this, element, reference, dependentReference, refQualElements, targetTable);
    },
    addSysParms: function() {
        var sp = "sysparm_processor=LookupSelectProcessor" +
        "&sysparm_name=" + this.elementName +
        "&sysparm_timer=" + this.timer +
        "&sysparm_max=" + this.max +
        "&sysparm_chars=" + encodeText(this.searchChars);
        return sp;
    },
    ajaxResponse: function(response) {
        var e = response.responseXML.documentElement;
        var vn = e.getAttribute("variable_name");
        var v = e.getAttribute("variable");
        if (isMSIE && gel('sysparm_id')) {
            var island = getXMLIsland('pricing_' + gel('sysparm_id').value);
            var vars = island.getElementsByTagName('variable');
            for (var i = 0; i < vars.length; i++) {
                if (vars[i].getAttribute('id') == vn) {
                    var xml = loadXML(v);
                    var root = xml.documentElement;
                    var p = vars[i].parentNode;
                    p.removeChild(vars[i]);
                    p.appendChild(root.cloneNode(true));
                    gel('pricing_' + gel('sysparm_id').value).innerHTML = island.xml;
                }
            }
        } else {
            var t = gel(vn);
            if (t)
                t.innerHTML = v;
        }
        if ("true" == e.getAttribute("radio"))
            this._updateRadio(e);
        else
            this._updateSelect(e);
    },
    _updateSelect : function(e) {
        var options = e.getAttribute("options");
        var td = findParentByTag(this.element, 'td');
        td.innerHTML = options;
        this.element = td.getElementsByTagName("select")[0];
        this.element.onchange.call();
    },
    _updateRadio : function(e) {
        var t = findParentByTag(this.element, 'table');
        var td = findParentByTag(t, "td");
        var options = e.getAttribute("options");
        td.innerHTML = options;
        var inputs = $(td).select(".cat_item_option");
        for (var i =0; i < inputs.length;i++) {
            var element = inputs[i];
            if (element.checked) {
                this.element = element;
                this.element.onclick.call();
                return;
            }
        }
    },
    getKeyElement: function() {
        if (this.keyElement)
            return this.keyElement;
        return this.element;
    }
});
var CatalogPricing = Class.create();
CatalogPricing.prototype = {
    initialize: function(cat_item_id, cart) {
        this.cat_item_id = cat_item_id;
        this.xml = getXMLIsland('pricing_' + cat_item_id);
        this.variables = [];
        this._initPriceVars();
        this.messenger = new GwtMessage();
        this.labels = true;
        this.cart = cart;
    },
    _initPriceVars: function() {
        if (!this.xml)
            return;
        var allVars = this.xml.getElementsByTagName('variable');
        for (var i =0; i < allVars.length; i++) {
            var v = allVars[i];
            var longName = v.getAttribute('id');
            var name = longName.substring('price_of_'.length);
            if (g_form.hasPricingImplications(name))
                this.variables.push(v);
        }
    },
    enhanceLabels: function() {
        this._getAllPrices();
    },
    refreshCart : function(quantity, labels) {
        if (typeof(labels) != 'undefined')
            this.labels = labels;
        var ga = new GlideAjax("CartAjaxProcessor");
        ga.addParam('sysparm_action', 'price');
        ga.addParam('sysparm_quantity', quantity);
        ga.addParam('sysparm_id', this.cat_item_id);
        ga.addEncodedString(g_cart.generatePostString());
        ga.getXML(this._priceResponse.bind(this), null, quantity);
    },
    _enhanceLabels: function (priceMap) {
        var msg = [ 'lowercase_add', 'subtract' ];
        var answer = this.messenger.getMessages(msg);
        this.add = answer['lowercase_add'];
        this.subtract = answer['subtract'];
        for (var i =0; i < this.variables.length; i++) {
            var v = this.variables[i];
            var longName = v.getAttribute('id');
            var name = longName.substring('price_of_'.length);
            var realThing = document.getElementsByName(name);
            if (!realThing)
                continue;
            for (var j = 0; j < realThing.length; j++) {
                if (realThing[j].type == 'radio')
                    this._enhanceRadio(realThing[j], v, priceMap)
                else if (realThing[j].options)
                    this._enhanceSelect(realThing[j], v, priceMap);
            }
        }
    },
    _enhanceSelect: function(select, v, priceMap) {
        for (var i=0; i < select.options.length; i++) {
            var option = select.options[i];
            var price = this._priceOfVar(v, option.value);
            var currentPrice = this._currentPriceOf(select.name);
            price = price - currentPrice;
            var pt = this._attributeOfVar(v, option.value, 'display_currency');
            pt = this._getPriceToken(price, pt);
            var baseLabel = this._labelOfVar(v, option.value);
            if (!baseLabel)
                continue;
            var enhancement = this._getEnhancement(price, priceMap, pt);
            option.text = baseLabel + ' ' + enhancement;
        }
    },
    _enhanceRadio: function(radio, v, priceMap) {
        var l = radio.nextSibling;
        var value = radio.value;
        var price = this._priceOfVar(v, value);
        var currentPrice = this._currentPriceOf(radio.name);
        price = price - currentPrice;
        var pt = this._attributeOfVar(v, value, 'display_currency');
        pt = this._getPriceToken(price, pt);
        var baseLabel = this._labelOfVar(v, value);
        if (!baseLabel)
            return;
        var enhancement = this._getEnhancement(price, priceMap,pt);
        l.nodeValue = baseLabel + ' ' + enhancement;
    },
    _getEnhancement: function(price, priceMap, priceToken) {
        if (price == 0)
            return '';
        var term = this.add;
        if (price < 0)
            term = this.subtract;
        var nicePrice = priceMap[priceToken];
        return '[' + term + ' ' + nicePrice + ']';
    },
    _getAllPrices: function() {
        var cf = new CurrencyFormat(this._enhanceLabels.bind(this), this.cat_item_id);
        if (this.fillFormat(cf))
            cf.formatPrices();
    },
    fillFormat : function(cf) {
        var epp = new Object();
        var doIt = false;
        for (var i =0; i < this.variables.length; i++) {
            var costs = this.variables[i].childNodes;
            var vName = this.variables[i].getAttribute('id');
            vName = vName.substring('price_of_'.length);
            var currentPrice = this._currentPriceOf(vName);
            for (var j=0; j < costs.length; j++) {
                var price = costs[j].getAttribute('price');
                price = parseFloat(price);
                price = price - currentPrice;
                Math.abs(price)
                var sc = costs[j].getAttribute('session_currency');
                var dc = costs[j].getAttribute('display_currency');
                var pt = this._getPriceToken(price, dc);
                cf.addPrice(pt, sc + ';' + price);
                doIt = true;
            }
        }
        return doIt;
    },
    _getPriceToken : function(price, displayCurrency) {
        var answer = price;
        if (displayCurrency)
            answer = displayCurrency +'_' + price;
        return answer;
    },
    _currentPriceOf : function(vName) {
        var realThing = document.getElementsByName(vName);
        if (!realThing)
            return 0;
        for (var i = 0; i < realThing.length; i++) {
            if (realThing[i].type == 'radio' && realThing[i].checked)
                return this._priceOf(vName, realThing[i].value);
            else if (realThing[i].options) {
                if (realThing[i].selectedIndex != '-1')
                    return this._priceOf(vName, realThing[i].options[realThing[i].selectedIndex].value);
            }
        }
        return 0;
    },
    _priceResponse : function(response, quantity) {
        var xml = response.responseXML;
        var items = xml.getElementsByTagName("item");
        if (items.length == 1) {
            var s = items[0].getAttribute("show_price");
            var p = items[0].getAttribute("display_price");
            var t = items[0].getAttribute("display_total");
            this._setTotals(s,p,t);
        }
        var cf = new CurrencyFormat(this._updateCart.bind(this));
        this.fillFormat(cf);
        cf.formatPrices();
    },
    _priceOf : function(name, value) {
        var test = 'price_of_' + name;
        for (var i =0; i < this.variables.length; i++) {
            if (this.variables[i].getAttribute('id') != test)
                continue;
            return this._priceOfVar(this.variables[i], value);
        }
        return 0;
    },
    _priceOfVar : function(v, value) {
        var p =  this._attributeOfVar(v, value, 'price');
        try {
            return parseFloat(p);
        } catch (e){
            return 0;
        }
    },
    _attributeOfVar : function(v, value, attribute) {
        var options = v.getElementsByTagName('cost');
        for (var n = 0; n < options.length; n++) {
            if (options[n].getAttribute('value') == value)
                return options[n].getAttribute(attribute);
        }
        return null;
    },
    _labelOfVar : function(v, value) {
        var options = v.getElementsByTagName('cost');
        for (var n = 0; n < options.length; n++) {
            if (options[n].getAttribute('value') == value)
                return options[n].getAttribute('base_label');
        }
        return 0;
    },
    _setTotals : function(show_price, display_price, total) {
        var style = "none";
        if(show_price == "true")
            style = "block";
        var price_label_span = gel('price_label_span');
        if (price_label_span) {
            price_label_span.style.display = style;
            var price_span = gel('price_span');
            if (price_span) {
                price_span.innerHTML = display_price;
                price_span.style.display = style;
            }
        }
        var total_label_span = gel('price_subtotal_label_span');
        if (total_label_span) {
            total_label_span.style.display = style;
            var total_span = gel('price_subtotal_span');
            if (total_span) {
                total_span.innerHTML = total;
                total_span.style.display = style;
            }
        }
    },
    _updateCart : function(responseMap) {
        if (this.labels)
            this._enhanceLabels(responseMap);
        this.cart._changed();
    }
}
var CartProxy = Class.create();
CartProxy.prototype = {
    initialize: function(id) {
        this.target = id;
        CustomEvent.observe('cart.loaded', this.onCartChange.bind(this));
        CustomEvent.observe('cart.edit', this.onCartEdit.bind(this));
    },
    proxy : function(html, win) {
        this.targetWindow = win;
        gel(this.target).innerHTML = html;
        this._cleanup();
    },
    reload : function() {
        gel(this.target).innerHTML = "";
    },
    onCartEdit : function() {
        this.reload();
    },
    onCartChange : function(args) {
        var html = args['html'];
        var win = args['window'];
        if (win == window)
            return;
        this.proxy(html, win);
    },
    _cleanup : function() {
        var quanThere = this.targetWindow.gel("quantity");
        if (quanThere)
            gel("quantity").selectedIndex = quanThere.selectedIndex;
        var shopping = gel('catalog_cart_continue_shopping');
        if (shopping)
            shopping.style.display="none";
        var pc = gel('catalog_cart_proceed_checkout');
        if (pc) {
            pc.onclick = function() {
                proceedCheckout()
            }
            pc.removeAttribute("href");
        }
        var edit = gel('catalog_cart_edit_button');
        if (edit)
            edit.onclick = function() {
                editCart()
            };
    }
};
function addToCart() {
    if (window.g_cart_proxy)
        window.g_cart_proxy.targetWindow.addToCart();
}
function orderEdit() {
    if (window.g_cart_proxy)
        window.g_cart_proxy.targetWindow.orderEdit();
}
function orderNow() {
    if (window.g_cart_proxy)
        window.g_cart_proxy.targetWindow.orderNow();
}
function proceedCheckout() {
    if (window.g_cart_proxy) {
        var targetWin = window.g_cart_proxy.targetWindow;
        var href = targetWin.gel('catalog_cart_proceed_checkout').href;
        targetWin.location = href;
    }
}
function editCart() {
    if (window.g_cart_proxy) {
        var targetWin = window.g_cart_proxy.targetWindow;
        targetWin.gel('catalog_cart_edit_button').onclick();
    }
}
function calcPrice() {
    if (window.g_cart_proxy) {
        var quan = g_cart_proxy.targetWindow.gel("quantity");
        quan.selectedIndex = gel("quantity").selectedIndex;
        g_cart_proxy.targetWindow.calcPrice();
    }
}
function expandCollapseAllSections(expandFlag) {
    var spans = document.getElementsByTagName('span');
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].id.substr(0, 8) != "section.")
            continue;
        var id = spans[i].id.substring(8);
        var state = collapsedState(id);
        if (state == expandFlag)
            toggleSectionDisplay(id);
    }
    CustomEvent.fire('toggle.sections', expandFlag);
}
function setCollapseAllIcons(action, sectionID) {
    var exp = gel('img.' + sectionID + '_expandall');
    var col = gel('img.' + sectionID + '_collapseall');
    if (!exp || !col)
        return;
    if (action == "expand") {
        exp.style.display = "none";
        col.style.display = "inline";
        return;
    }
    exp.style.display = "inline";
    col.style.display = "none";
}
function toggleSectionDisplay(id,imagePrefix,sectionID) {
    var collapsed = collapsedState(id);
    setPreference("collapse.section." + id, !collapsed, null);
    hideReveal(id, imagePrefix);
    toggleDivDisplay(id + '_spacer');
    collapseExpand('section_head_right.' + id, 'inline');
    if (collapsed) {
        CustomEvent.fire("section.expanded", id);
        setCollapseAllIcons("expand",sectionID);
    }
}
function collapseExpand(name, type){
    var el = gel(name);
    if (!el)
        return;
    if (el.style.display == type){
        el.style.display = "none";
    } else {
        el.style.display = type;
    }
}