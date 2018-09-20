//defer popupdivs.js
var PopupCursors = Class.create( {
    WAITING_WEBKIT : "wait",
    WAITING_OTHER : "progress",
    initialize: function() {
        if (isWebKit)
            this.cursor = this.WAITING_WEBKIT;
        else
            this.cursor = this.WAITING_OTHER;
    },
    startWaiting: function(target) {
        if (target == null)
            return;
        this.oldCurosr = target.style.cursor;
        target.style.cursor = this.cursor;
    },
    stopWaiting: function(target) {
        if (!target)
            return;
        target.style.cursor = this.oldCursor ? this.oldCursor : '';
    }
});
var GlidePopup = Class.create({
    POPUP_PREFIX: "popup_",
    initialize: function() {
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.thinking;
        this.thinkingAbout;
        this.sys_id;
    },
    mousePositionSaveRelative: function(e) {
        var answer = getEventCoords(e);
        this.lastMouseX = answer.getX();
        this.lastMouseY = answer.getY();
    },
    shouldSkip: function(e, sys_id) {
        if (e.ctrlKey)
            return true;
        if (sys_id != null) {
            var div = gel(this.POPUP_PREFIX + sys_id);
            if (div)
                return true;
        }
        return false;
    },
    startThinking: function(e, sys_id) {
        this.thinking = true;
        this.thinkingAbout = sys_id;
        this.eventTarget = e.srcElement ? e.srcElement : e.target;
    },
    enqueue: function(e, sys_id, url, parms, width) {
        this.mousePositionSaveRelative(e);
        if (this.shouldSkip(e, sys_id))
            return;
        if (isNaN(width))
            width = 0;
        this.startThinking(e, sys_id);
        var evalMe = "g_popup_manager.queuePop('" + url + "','" + parms + "'," + this.lastMouseX + "," + this.lastMouseY + ", '" + sys_id + "', '" + width + "')";
        setTimeout(evalMe, g_popup_timeout);
    },
    queuePop: function(url, parms, lastX, lastY, sys_id, width) {
        if (!this.thinking)
            return; // we're not thinking at all atm
        if (this.lastMouseX != lastX || this.lastMouseY != lastY)
            return; // we moved the cursor;
        this.cursor = new PopupCursors();
        this.cursor.startWaiting(this.eventTarget);
        serverRequestPost(url, parms, this.renderPopup.bind(this), [sys_id, width, this.eventTarget]);
        this.eventTarget = null;
    },
    renderPopup: function(response, args) {
        var sys_id = args[0];
        var width = args[1];
        var eventTarget = args[2];
        this.cursor.stopWaiting(eventTarget);
        if (!this.thinking)
            return;
        if (this.thinkingAbout.indexOf(sys_id) < 0)
            return; // we're thinking about something else
        this.destroypopDiv();
        this.sys_id = sys_id;
        this.createPopupDiv(sys_id, width, response);
    },
    createPopupDiv: function(sys_id, width, response) {
        var div = cel("div");
        div.id = this.POPUP_PREFIX + sys_id;
        div.className = "popup";
        var newData = response.responseText;
        if (newData == null || newData == '')
            newData = "None Available";
        div.innerHTML = newData;
        if (isMSIE || isChrome || isSafari) {
            addChild(div);
            newData.evalScripts(true);
        }
        addChild(div);
        if (width && width > 0)
            this._setMinWidth(div, width);
        this.placeDiv(div);
        this.createPopupShim(div);
        div.style.visibility = "visible";
    },
    createPopupShim: function(parentDiv) {
        if (!isMSIE)
            return;
        var height = parentDiv.offsetHeight;
        var width = parentDiv.offsetWidth;
        var shim = cel("iframe");
        shim.id = parentDiv.id + "SHIM";
        shim.className = "popup";
        shim.scrolling = "no";
        shim.src = "javascript:false;";
        shim.style.zIndex = 4999; // cannot parse, zIndex not readable at this point on IE
        shim.style.left = parentDiv.style.left;
        shim.style.top = parentDiv.style.top;
        shim.style.height = height;
        shim.style.width = width;
        addChild(shim);
    },
    placeDiv: function(div) {
        this._sizePopup(div);
        var height = div.offsetHeight;
        var width = div.offsetWidth;
        var topLeft = getRelativeTop();
        var targetTop = this.lastMouseY + 4;
        var rect = getViewableArea();
        var overFlow = (targetTop + height) - (topLeft.getY() + rect.getHeight());
        if (overFlow > 0)
            targetTop = targetTop - overFlow;
        targetTop = Math.max(targetTop, topLeft.getY());
        var targetLeft = this.lastMouseX +4;
        var parentElement = getFormContentParent();
        if (parentElement != document.body && isMSIE)
            targetTop = Math.max(targetTop, 35 + parentElement.scrollTop);
        if ((targetLeft + width) > (topLeft.getX() + rect.getWidth())) {
            targetTop = this.lastMouseY + 4;
            targetLeft = this.lastMouseX - (width + 4)
            targetLeft = Math.max(targetLeft, 0);
        }
        div.style.top = targetTop +'px';
        div.style.left = targetLeft +'px';
    },
    _sizePopup: function(div) {
        if (div.offsetWidth < 300)
            return;
        if (!isMSIE)
            div.style.display="table";
        div.style.width = "300px";
        for (var i = div.scrollWidth; i < 1200; i += 50) {
            div.style.width = i + '.px';
            if (div.offsetWidth >= div.scrollWidth)
                return;
        }
        div.style.width = '';
    },
    exitPopup: function(e) {
        if (e.shiftKey) {
            var div = gel(this.POPUP_PREFIX + this.sys_id);
            if (div) {
                var firstChild = div.childNodes[0];
                if (firstChild.name == 'close_anchor')
                    return;
                var child = cel("div");
                child.innerHTML = "<a onclick=\"g_popup_manager.destroypopDiv(event, '" + this.sys_id + "')\"><img src='images/closex.gifx' alt='" + new GwtMessage().getMessage('Close') + "'/></a>";
                child.name = "close_anchor";
                div.insertBefore(child, firstChild);
                child.className = 'float_right';
            }
        } else {
            this.destroypopDiv();
        }
        this.thinking = false;
        if (this.cursor)
            this.cursor.stopWaiting(this.eventTarget);
        this.eventTarget = null;
    },
    destroypopDiv: function() {
        var div = gel(this.POPUP_PREFIX + this.sys_id);
        if (div) {
            var parentNode = div.parentNode;
            parentNode.removeChild(div);
        }
        var shim = gel(this.POPUP_PREFIX + this.sys_id + "SHIM");
        if (shim) {
            var parentNode = shim.parentNode;
            parentNode.removeChild(shim);
        }
    },
    popDiv: function(e, sys_id) {
        var url = "service_catalog.do";
        var parms = "sysparm_action=popup&sysparm_sys_id=" + sys_id;
        this.enqueue(e, sys_id, url, parms, 600);
    },
    popCatDiv: function(e, sys_id) {
        var url = "service_catalog.do";
        var parms = "sysparm_action=popupCat&sysparm_sys_id=" + sys_id;
        this.enqueue(e, sys_id, url, parms, 600);
    },
    popKnowledgeDiv: function(e, sys_id) {
        var url = "kb_preview.do";
        var parms = "sys_kb_id=" + sys_id + "&sysparm_nostack=true";
        this.enqueue(e, sys_id, url, parms, 600);
    },
    popIssueDiv: function (e, sys_id) {
        var url = "issuespopup.do";
        var parms = "sysparm_issues=" + sys_id;
        this.enqueue(e, sys_id, url, parms);
    },
    popListDiv: function(e, tableName, sys_id, viewName, width) {
        var url = "popup.do";
        var parms = "sysparm_sys_id=" + sys_id + "&sysparm_table_name=" + tableName + "&sysparm_field_name=sys_id&sysparm_view=" + viewName + "&sysparm_popup_direct=true";
        sys_id = sys_id + "POPPER";
        this.enqueue(e, sys_id, url, parms, width);
    },
    popReferenceDiv: function(e, inputid, viewName) {
        var temp = gel(inputid);
        var sys_id = temp.value;
        if (sys_id == '' || sys_id == null)
            return;
        var temp = inputid.split('.');
        var tableName = temp[0];
        var x = inputid.indexOf('.');
        var fieldName = inputid.substring(x+1);
        var url = "popup.do";
        var parms = "sysparm_sys_id=" + sys_id + "&sysparm_table_name=" + tableName + "&sysparm_field_name=" + fieldName + "&sysparm_view=" + viewName;
        this.enqueue(e, sys_id, url, parms);
    },
    popRecordDiv: function(e, tableName, sys_id) {
        var viewName = null;
        var url = "popup.do";
        var parms = "sysparm_sys_id=" + sys_id + "&sysparm_table_name=" + tableName + "&sysparm_field_name=sys_id&sysparm_view=" + viewName + "&sysparm_popup_direct=true";
        this.enqueue(e, sys_id, url, parms);
    },
    popLightWeightReferenceDiv: function(e, inputid) {
        var temp = gel(inputid);
        var sys_id = temp.value;
        if (sys_id == '' || sys_id == null)
            return;
        var temp = gel(inputid+"TABLE");
        var tableName = temp.value;
        var fieldName='sys_id';
        var viewName = null;
        var url = "popup.do";
        var parms = "sysparm_sys_id=" + sys_id + "&sysparm_table_name=" + tableName + "&sysparm_field_name=sys_id&sysparm_view=" + viewName + "&sysparm_popup_direct=true";
        this.enqueue(e, sys_id, url, parms);
    },
    popHistoryDiv: function (e, tableName, sys_id, checkpoint, internalCP) {
        var url = "historypopup.do";
        var parms = "sysparm_table_name=" + tableName + "&sysparm_sys_id=" + sys_id + "&checkpoint=" + checkpoint + "&internalCP=" + internalCP;
        sys_id  = sys_id + checkpoint + internalCP
        this.enqueue(e, sys_id, url, parms);
    },
    _setMinWidth: function(div, width) {
        var widther = cel("div");
        widther.style.width = width + "px";
        widther.style.height = "1px";
        widther.style.overflow = "hidden";
        div.appendChild(widther);
        widther = null;
    },
    type: "GlidePopup"
});
var g_popup_manager = new GlidePopup();
function popDiv(e, sys_id) {
    g_popup_manager.popDiv(e, sys_id);
}
function popCatDiv(e, sys_id) {
    g_popup_manager.popCatDiv(e, sys_id);
}
function popKnowledgeDiv(e, sys_id) {
    g_popup_manager.popKnowledgeDiv(e, sys_id);
}
function lockPopupID(e, sys_id) {
    g_popup_manager.sys_id = sys_id;
    lockPopup(e);
}
function lockPopup(e) {
    g_popup_manager.exitPopup(e);
}
function popReferenceDiv(e, inputid, viewName) {
    g_popup_manager.popReferenceDiv(e, inputid, viewName);
}
function popHistoryDiv(e, tableName, sys_id, checkpoint, internalCP) {
    g_popup_manager.popHistoryDiv(e, tableName, sys_id, checkpoint, internalCP);
}
function popRecordDiv(e, tableName, sys_id) {
    g_popup_manager.popRecordDiv(e, tableName, sys_id);
}
function popIssueDiv(e, issues) {
    g_popup_manager.popIssueDiv(e, issues);
}
function popLightWeightReferenceDiv(e, inputid) {
    g_popup_manager.popLightWeightReferenceDiv(e, inputid);
}
function popListDiv(e, tableName, sys_id, viewName, width) {
    g_popup_manager.popListDiv(e, tableName, sys_id, viewName, width);
}