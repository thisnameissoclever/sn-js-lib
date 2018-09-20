//include classes/event/CustomEventManager.js
var CustomEventManager = Class.create(GwtObservable, {
    trace: false,
    observe: function(eventName, fn){
        if (this.trace)
            jslog("$CustomEventManager observing: " + eventName);
        this.on(eventName, fn);
    },
    fire: function(eventName, args){
        if (this.trace)
            jslog("$CustomEventManager firing: " + eventName + " args: " + arguments.length);
        return this.fireEvent.apply(this, arguments);
    },
    fireTop: function(eventName, args){
        if (this.trace)
            jslog("$CustomEventManager firing: " + eventName + " args: " + arguments.length);
        this.fireEvent.apply(this, arguments);
        var t = getTopWindow();
        if (t != null && window != t)
            t.CustomEvent.fireEvent(eventName, args);
    },
    fireAll: function(eventName, args) {
        if (this.trace)
            jslog("$CustomEventManager firing: " + eventName + " args: " + arguments.length);
        var t = getTopWindow();
        if (t == null) {
            this.fireEvent.apply(this, arguments);
            return;
        }
        t.CustomEvent.fireEvent(eventName, args);
        for (var i = 0; i < t.length; i++) {
            if (!t[i])
                continue;
            if (t[i].CustomEvent && typeof t[i].CustomEvent.fireEvent == "function")
                t[i].CustomEvent.fireEvent(eventName, args);
        }
    },
    toString: function() {
        return 'CustomEventManager';
    }
});
var CustomEvent = new CustomEventManager();