//defer classes/util/StopWatch.js
var StopWatch = Class.create({
    MILLIS_IN_SECOND: 1000,
    MILLIS_IN_MINUTE: 60 * 1000,
    MILLIS_IN_HOUR: 60 * 60 * 1000,
    initialize: function(started) {
        this.started = started || new Date();
    },
    getTime: function() {
        var now = new Date();
        return now.getTime() - this.started.getTime();
    },
    restart: function() {
        this.initialize();
    },
    jslog: function(msg, src, date) {
        jslog('[' + this.toString() + '] ' + msg, src, date);
    },
    toString : function() {
        return this.formatISO(this.getTime());
    },
    formatISO: function(millis) {
        var hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
        if (millis >= this.MILLIS_IN_HOUR) {
            hours = parseInt(millis / this.MILLIS_IN_HOUR);
            millis = millis - (hours * this.MILLIS_IN_HOUR);
        }
        if (millis >= this.MILLIS_IN_MINUTE) {
            minutes = parseInt(millis / this.MILLIS_IN_MINUTE);
            millis = millis - (minutes * this.MILLIS_IN_MINUTE);
        }
        if (millis >= this.MILLIS_IN_SECOND) {
            seconds = parseInt(millis / this.MILLIS_IN_SECOND);
            millis = millis - (seconds * this.MILLIS_IN_SECOND);
        }
        milliseconds = parseInt(millis);
        return doubleDigitFormat(hours) + ":" + doubleDigitFormat(minutes) + ":" + doubleDigitFormat(seconds) +
        "." + tripleDigitFormat(milliseconds);
    },
    type: "StopWatch"
});