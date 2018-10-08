//include classes/GlideDuration.js
var GlideDuration = Class.create({
    initialize: function(value) {
        this.values = new Array();
        var gMessage = new GwtMessage();
        var values = ["Hours", "Days"];
        var answer = gMessage.getMessages(values);
        this.hourMessage = answer["Hours"];
        this.daysMessage = answer["Days"];
        if (value) {
            if (value.indexOf("javascript:") == 0) {
                var s = value.split("'");
                value = s[1];
            }
            this.values = value.split(" ");
            if (this.values.length == 2) {
                var times = this.values[1].split(":");
                for (var i=0; i < times.length; i++)
                    this.values[1+i] = times[i];
            }
        }
        for (var i = this.values.length; i < 4; i++)
            this.values[i] = "0";
    },
    buildHTML: function(parent) {
        this.parent = parent;
        this._addSpan(this.daysMessage);
        this.days = this._addInput("dur_day", this.getDays());
        this.days.maxLength = "5";
        this.days.style.marginRight = "5px";
        this._addSpan(this.hourMessage);
        this.hour = this._addInput("dur_hour", this.getHours());
        this._addSpan(":");
        this.minute = this._addInput("dur_min", this.getMinutes());
        this._addSpan(":");
        this.second = this._addInput("dur_sec", this.getSeconds());
    },
    _addInput: function (id, value) {
        var ic = cel("input", this.parent);
        ic.className = 'filerTableInput';
        ic.id = id;
        ic.size = "2";
        ic.maxLength = "2";
        ic.value = value;
        return ic;
    },
    _addSpan: function(text) {
        var sp = cel("label", this.parent);
        sp.className = 'condition';
        sp.innerHTML = text;
    },
    getDays: function() {
        return this.values[0];
    },
    getHours: function() {
        return this.values[1];
    },
    getMinutes: function() {
        return this.values[2];
    },
    getSeconds: function() {
        return this.values[3];
    },
    getValue: function() {
        var day = this.days.value;
        var hour = this.hour.value;
        var min = this.minute.value;
        var sec = this.second.value;
        if (!day || day == null || !isNumber(day))
            day = 0;
        if (!hour || hour == null || !isNumber(hour))
            hour = 0;
        if (!min || min == null || !isNumber(min))
            min = 0;
        if (!sec || sec == null || !isNumber(sec))
            sec = 0;
        this.values[0] = day;
        this.values[1] = hour;
        this.values[2] = min;
        this.values[3] = sec;
        return day + " " + hour + ":" + min + ":" + sec;
    }
});