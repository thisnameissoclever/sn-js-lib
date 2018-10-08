/*
 * This replicates the outline of the GlideAjax object for help in autocompletion.
 * http://http://wiki.service-now.com/index.php?title=GlideAjax
 */

//defer classes/ajax/GlideAjax.js
/**
* Convenience class used to manage parameters and requests for AJAX calls
*/
var GlideAjax = Class.create(GlideURL, {
    URL: "xmlhttp.do",
    initialize: function($super, processor, url) {
        var u = this.URL;
        if (url)
            u = url;
        $super(u);
        this.setProcessor(processor);
        this.callbackFunction;
        this.callbackArgs;
        this.additionalProcessorParams;
        this.errorCallbackFunction;
        this.wantRequestObject = false;
    },
    getProcessor: function() {
        return this.processor;
    },
    /*
     * getAnswer() <br />
     * Used in conjunction with getXMLWait() -- used for synchronous calls. Gets the callback response.
     */
    getAnswer: function() {
        if (!(this.requestObject && this.requestObject.responseXML))
            return null;
        return this.requestObject.responseXML.documentElement.getAttribute("answer");
    },
    setProcessor: function(p) {
        this.processor = p;
        this.addParam("sysparm_processor", p);
    },
    preventLoadingIcon: function() {
        this._preventLoadingIcon = true;
    },
    /*
     * getXMLWait() <br />
     * Initiate the AJAX call, NOT ASYNCHRONOUS -- WAITS for the response.
     */
    getXMLWait: function(additionalParams) {
        this.additionalProcessorParams = additionalParams;
        this._makeRequest(false);
        if (this.requestObject.status != 200)
            this._handleError();
        return this._responseReceived();
    },
    /*
     * getXML(callbackFunctionName) <br />
     * Initiate the AJAX call, without waiting for the response.
     * @param callbackFunctionName -- Name of callback function.
     */
    getXML: function(callbackFunctionName) { },
    /*
     * getXML(callbackFunctionName, optionalArgument1) <br />
     * Initiate the AJAX call, without waiting for the response.
     * @param callbackFunctionName -- Name of callback function.
     * @param optionalArgument1 -- An optional argument to send to the callback function only.
     */
    getXML: function(callbackFunctionName, optionalArgument1) { },
    /*
     * getXML(callback, additionalParams, responseParams) <br />
     * On completion, invokes callback with args (response, requestParams)<br />
     * where request is the "raw" response object
     * Initiate the AJAX call, without waiting for the response.
     * @param callbackFunctionName -- Name of callback function.
     * @param optionalArgument1 -- An optional argument to send to the callback function only.
     * @param optionalArgument2 -- An optional argument to send to the callback function only.
     */
    getXML: function(callback, additionalParams, responseParams) {
        this.wantAnswer = false;
        this._getXML0(callback, additionalParams, responseParams);
    },
    /*
* Makes an asynchronous call to the server.
* On completion, invokes callback with args (answer, requestParams)
* where request is the "answer" value extracted from the response object since
* that's a very common code pattern
*/
    getXMLAnswer:function(callback, additionalParams, responseParams) {
        this.wantAnswer = true;
        this._getXML0(callback, additionalParams, responseParams);
    },
    _getXML0: function(callback, additionalParams, responseParams) {
        this.callbackFunction = callback;
        this.callbackArgs = responseParams;
        this.additionalProcessorParams = additionalParams;
        setTimeout(function() {
            this._makeRequest(true)
            }.bind(this), 0);
    },
    _makeRequest: function(async) {
        this.requestObject = this._getRequestObject();
        if (this.requestObject == null)
            return null;
        var refUrl = this._buildReferringURL();
        if (refUrl != "") { // IE6 will get an error if you try to set a blank value
            this.addParam('ni.nolog.x_referer', 'ignore');
            this.addParam('x_referer', refUrl);
        }
        this.postString = this.getQueryString(this.additionalProcessorParams);
        this._showLoading();
        if (async && (this.callbackFunction != null))
            this.requestObject.onreadystatechange = this._processReqChange.bind(this);
        CustomEvent.fireTop("request_start", document);
        this.requestObject.open("POST", this.contextPath, async);
        this.requestObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        if (typeof g_ck != 'undefined' && g_ck != "")
            this.requestObject.setRequestHeader('X-UserToken', g_ck);
        this.requestObject.send(this.postString);
        if (!async || (this.callbackFunction == null))
            this._hideLoading();
        return this.requestObject;
    },
    _processReqChange: function() {
        if (this.requestObject.readyState != 4)
            return;
        this.requestObject.onreadystatechange = function() { };
        this._hideLoading();
        if (this.requestObject.status == 200) {
            this._responseReceived();
            return;
        }
        try {
            this._handleError();
        } catch (e) {
            jslog("GlideAjax error: " + e);
        }
    },
    _handleError: function() {
        if (this.requestObject.status == 401) {
            var requestedToken = this.requestObject.getResponseHeader("X-UserToken-Request");
            var respondedToken = this.requestObject.getResponseHeader("X-UserToken-Response");
            if (requestedToken && respondedToken && requestedToken != respondedToken)
                CustomEvent.fireAll("ck_updated", respondedToken);
        }
        if (this.errorCallbackFunction)
            this.errorCallbackFunction(this.requestObject, this.callbackArgs);
    },
    _getRequestObject: function() {
        var req = null;
        if (window.XMLHttpRequest)
            req = new XMLHttpRequest();
        else if (window.ActiveXObject)
            req = new ActiveXObject("Microsoft.XMLHTTP");
        return req;
    },
    _responseReceived: function() {
        lastActivity = new Date();
        CustomEvent.fireTop("request_complete", document);
        if (this.callbackFunction) {
            if (this.wantAnswer)
                this.callbackFunction(this.getAnswer(), this.callbackArgs);
            else
                this.callbackFunction(this.requestObject, this.callbackArgs);
        }
        if (this.wantRequestObject)
            return this.requestObject;
        return this.requestObject? this.requestObject.responseXML : null;
    },
    _showLoading: function() {
        if (!this._preventLoadingIcon)
            CustomEvent.fireAll("ajax.loading.start", this);
    },
    _hideLoading: function() {
        if (!this._preventLoadingIcon)
            CustomEvent.fireAll("ajax.loading.end", this);
    },
    _buildReferringURL: function() {
        var path = location.pathname;
        var args = location.search;
        if (path.substring(path.length-1) == '/') {
            if (args)
                return args;
            return "";
        }
        return path.substring(path.lastIndexOf('/') + 1) + args;
    },
    setErrorCallback: function(callback) {
        this.errorCallbackFunction = callback;
    },
    setWantRequestObject: function(want) {
        this.wantRequestObject = want;
    },
    toString: function() {
        return "GlideAjax";
    }
});
//defer classes/ajax/GlideAjaxForm.js
/**
* This class extends GlideAjax to help request a Glide template form and receive the corresponding XML/text
* for direct manipulation.
*/
var GlideAjaxForm = Class.create(GlideAjax, {
    PROCESSOR: 'RenderInfo',
    initialize: function($super, templateName) {
        $super(this.PROCESSOR);
        this._formPreferences = {};
        this._templateName = templateName;
        this.setPreference('renderer', 'RenderForm');
        this.setPreference('type', 'direct');
        this.setPreference('table', templateName);
        this.addParam('sysparm_name', templateName);
        this.addParam('sysparm_value', this.getSysparmValue())
    },
    getRenderedBodyText: function(callback) {
        this._renderedBodyCallback = callback;
        this.getXML(this._parseTemplate.bind(this));
    },
    _parseTemplate: function(response) {
        s = response.responseText;
        s = s.substring(s.indexOf('<rendered_body>') + 15);
        s = s.substring(0, s.indexOf('</rendered_body>'));
        s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&apos;/g, "'");
        this._renderedBodyCallback(s);
    },
    setPreference: function(k, v) {
        this._formPreferences[k] = v;
    },
    getPreferences: function() {
        return this._formPreferences;
    },
    getSysparmValue: function() {
        var gxml = document.createElement('gxml');
        var sec = document.createElement('section');
        sec.setAttribute('name', this._templateName);
        gxml.appendChild(sec);
        for (var i in this._formPreferences) {
            var e = document.createElement('preference');
            e.setAttribute('name', i);
            e.setAttribute('value', this._formPreferences[i]);
            sec.appendChild(e);
        }
        return gxml.innerHTML;
    },
    toString: function() {
        return 'GlideAjaxForm';
    }
});