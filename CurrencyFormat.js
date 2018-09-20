var CurrencyFormat = Class.create();
/*
* Formats one or more prices in a single ajax call to CurrencyAjaxProcessor
* Upon completion, calls the specified callback function, passing a map of formatted prices as arg0
* example usage:
*  var cf = new CurrencyFormat(this.priceResponse.bind(this));
*      cf.addPrice('unit_price', 1000);
*      cf.addPrice('total_price', 123456);
*      cf.formatPrices();
*
* Upon comnpletion of the asychronous ajax call, the provided callback function will be invoked
* and handed off a map in the form:
*
* responsemap = { unit_price : "$1,000.00", total_price : "$123,456.00" }
*
*
*/
CurrencyFormat.prototype = {
    _PROCESSOR : "com.glideapp.servicecatalog.CurrencyAjaxProcessor",
    initialize: function(callBack) {
        this._callBack = callBack;
        this._map = new Object();
    },
    addPrice: function (key, value) {
        this._map[key] = value + '';
    },
    formatPrices: function () {
        var ajax = new GlideAjax(this._PROCESSOR);
        ajax.addParam("sysparm_action", "calcprice");
        for (key in this._map)
            ajax.addParam("sysparm_price_" + key, this._map[key]);
        ajax.getXML(this.handleResponse.bind(this));
    },
    handleResponse: function(request) {
        responseMap = new Object();
        var xml = request.responseXML;
        for (key in this._map) {
            var items = xml.getElementsByTagName("sysparm_price_" + key);
            if (items.length == 1) {
                var price = items[0].getAttribute("price");
                responseMap[key] = price;
            }
        }
        this._callBack.call(this, responseMap);
    }
}