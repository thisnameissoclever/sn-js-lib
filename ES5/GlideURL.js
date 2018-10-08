//defer classes/ajax/GlideURL.js
/**
* Use this to create URLs with properly encoded URI components.
*
* Usage:
*
*       var url = new GlideURL('table.do');
*       url.addParam(name, value);
*       url.addParam(name, value);
*       ...
*       var s = url.getURL();
*
* Some notes on using this class:
*
*    The purpose of this class is to make it easy to build URLs and URI strings
*    without having to worry about proper encoding.  Typically, you will use
*    addParam to add name value pairs to your query string where the value is
*    properly encoded for you.
*
*    In some cases, you have a string that is already encoded (such as g_form.serialize).
*    To add an already encoded string, call addEncodedString(s) instead of addParam.
*    The encoded string will be added to the final query string (see getQueryString()).
*
* Here is an example of using the addEncodedString method:
*
*     var url = new GlideURL('table.do');
*    url.addParam('name1', 'value1');
*    url.addParam('name2', '+#$%<>"');
*     url.addEncodedString('name3=%2Btest%3Atest&name4=abcdefg');
*     var s = url.getURL();
*
* would result in 's' being:
*
*             |- name1  -| |- name2                 -| |- encoded string               -|
*    table.do?name1=value1&name2=%2B%23%24%25%3C%3E%22&name3=%2Btest%3Atest&name4=abcdefg
*/
var GlideURL = Class.create({
    initialize: function(contextPath) {
        this.contextPath = contextPath;
        this.params = new Object();
        this.encodedString = '';
        this.encode = true;
    },
    setFromCurrent :function() {
        this.setFromString(window.location.href);
    },
    setFromString: function(href) {
        var pos = href.indexOf('?');
        if (pos < 0) {
            this.contextPath = href;
            return;
        }
        this.contextPath = href.slice(0, pos);
        var hashes = href.slice(pos + 1).split('&');
        var i = hashes.length;
        while (i--) {
            hash = hashes[i].split('=');
            this.params[hash[0]] = hash[1];
        }
    },
    getContexPath: function() {
        return this.contextPath;
    },
    setContextPath: function(c) {
        this.contextPath = c;
    },
    getParams: function() {
        return this.params;
    },
    /*
     * addParam(String, String) <br />
     * Add a parameter to send to the client side code.
     * @param parameter -- Name of variable to add.
     * @param value -- Value of variable to include.
     */
    addParam: function(name, value) {
        this.params[name] = value;
    },
    addToken: function() {
        if (typeof g_ck != 'undefined' && g_ck != "")
            this.addParam('sysparm_ck', g_ck);
    },
    deleteParam: function(name) {
        delete this.params[name];
    },
    addEncodedString: function(s) {
        if (!s)
            return;
        if (s.substr(0, 1) != "&")
            this.encodedString += "&";
        this.encodedString += s;
    },
    getQueryString: function(additionalParams) {
        qs = this._getParamsForURL(this.params);
        qs += this._getParamsForURL(additionalParams);
        qs += this.encodedString;
        if (qs.length == 0)
            return "";
        return qs.substring(1);
    },
    _getParamsForURL: function(params) {
        if (!params)
            return "";
        var url = "";
        for (n in params) {
            if (params[n]) {
                url += "&" + n + "=";
                if (this.encode)
                    url += encodeURIComponent(params[n] + '');
                else
                    url += params[n];
            } else
                url += "&" + n + "=";
        }
        return url;
    },
    getURL: function(additionalParams) {
        var url = this.contextPath;
        var qs = this.getQueryString(additionalParams);
        if (qs)
            url += "?" + qs;
        return url;
    },
    setEncode: function(b) {
        this.encode = b;
    },
    toString: function() {
        return 'GlideURL';
    }
});