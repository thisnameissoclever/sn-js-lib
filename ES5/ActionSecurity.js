//defer classes/ActionSecurity.js
var ActionSecurity = Class.create({
    initialize: function() {
    },
    execute: function(form) {
        var ids = form.sysparm_checked_items.value;
        var table = form.sys_target.value;
        var action = form.sys_action.value;
        var map = this._canExecute(ids, table, action);
        map = map[action];
        var yes = 0;
        var no = 0;
        for (key in map) {
            if (map[key] == 'true')
                yes++;
            else
                no++;
        }
        if (no == 0)
            return true;
        if (yes == 0) {
            this._alertNone(no);
            return false;
        }
        var answer =  this._alertPartial(yes, no);
        if (answer) {
            var al = new Array();
            for (key in map)
                if (map[key] == 'true')
                    al.push(key);
            form.sysparm_checked_items.value = al.join(',');
        }
        return answer;
    },
    pruneSelect: function(select, form) {
        var ids = getChecked(form);
        if (ids == '') {
            this._disableAll(select);
            select.focus(); // IE6 closes the dropdown after we've changed it so we'll help it open it
            return;
        }
        this._enableAll(select);
        var options = select.options;
        var actionList = new Array();
        for (var i = 0; i < options.length; i++) {
            var cond = options[i].getAttribute('gsft_condition');
            if (cond != 'true')
                continue;
            actionList.push(options[i].getAttribute('gsft_id'));
        }
        if (actionList.length == 0)
            return;
        var table = form.sys_target.value;
        var map = this._canExecute(ids, table, actionList.join(','));
        for (var i = 0; i < options.length; i++) {
            var cond = options[i].getAttribute('gsft_condition');
            if (cond != 'true')
                continue;
            var submap = map[options[i].getAttribute('gsft_id')];
            this._checkMap(submap, options[i]);
        }
        select.focus(); // IE6 closes the dropdown after we've changed it so we'll help it open it
    },
    _disableAll: function(select) {
        var options = select.options;
        for (var i =0; i < options.length; i++) {
            var row = options[i].getAttribute('gsft_row');
            if (row != 'true')
                continue;
            this._disableOption(options[i]);
        }
    },
    _disableOption: function(option) {
        option.disabled = true;
        option.style.color =  '#777';
        option.innerHTML = '&nbsp;&nbsp;&nbsp;' + option.getAttribute('gsft_base_label');
    },
    _enableAll: function(select) {
        var options = select.options;
        for (var i =0; i < options.length; i++) {
            var row = options[i].getAttribute('gsft_row');
            if (row != 'true')
                continue;
            this._enableOption(options[i]);
        }
    },
    _enableOption : function(option) {
        option.disabled = false;
        option.style.color =  '';
    },
    _checkMap: function(map, option) {
        var yes = 0;
        var no = 0;
        var legit = new Array();
        for (key in map)
            if (map[key] == 'true') {
                yes++;
                legit.push(key);
            } else
                no++;
        if (yes == 0) {
            this._disableOption(option);
            return;
        }
        this._enableOption(option);
        if (no == 0) {
            option.innerHTML = '&nbsp;&nbsp;&nbsp;' + option.getAttribute('gsft_base_label');
            option.setAttribute('gsft_allow', legit.join(','));
            return;
        }
        option.innerHTML = '&nbsp;&nbsp;&nbsp;' + option.getAttribute('gsft_base_label') + ' (' + yes + ' of ' + (yes + no) + ')';
        option.setAttribute('gsft_allow', legit.join(','));
    },
    _alertNone: function(no) {
        var m = 'Security does not allow the execution of that action against the specified record';
        if (no > 1)
            m = m + 's';
        alert(m);
    },
    _alertPartial: function(yes, no) {
        var total = yes + no;
        var m = 'Security allows the execution of that action against ' + yes + ' of ' + total + ' records. Proceed?';
        return confirm(m);
    },
    _canExecute: function(ids, table, action_list) {
        var ajax = new GlideAjax("AJAXActionSecurity");
        ajax.addParam("sysparm_checked_items", ids);
        ajax.addParam("sys_target", table);
        ajax.addParam("sys_action", action_list);
        var xml = ajax.getXMLWait();
        var answer = new Object();
        var al = action_list.split(',');
        for (var n =0; n < al.length; n++) {
            var work = new Object();
            var root = xml.getElementsByTagName("action_"+ al[n])[0];
            var keys = root.childNodes;
            for (var i =0; i < keys.length; i++) {
                var key = keys[i].getAttribute('sys_id');
                work[key] = keys[i].getAttribute('can_execute');
            }
            answer[al[n]] = work;
        }
        return answer;
    }
});