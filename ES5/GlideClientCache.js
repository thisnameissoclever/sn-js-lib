//defer classes/GlideClientCache.js
var GlideClientCacheEntry = Class.create({
    initialize: function(value) {
        this.value = value;
        this.bump();
    },
    bump: function() {
        this.stamp = new Date().getTime();
    }
});
var GlideClientCache = Class.create({
    _DEFAULT_SIZE : 50,
    initialize: function(maxEntries) {
        if (maxEntries)
            this.maxEntries = maxEntries;
        else
            this.maxEntries = this._DEFAULT_SIZE;
        this._init('default');
    },
    _init : function(stamp) {
        this._cache = new Object();
        this._stamp = stamp;
    },
    put: function(key, value) {
        var entry = new GlideClientCacheEntry(value);
        this._cache[key] = entry;
        this._removeEldest();
    },
    get : function(key) {
        var entry = this._cache[key];
        if (!entry)
            return null;
        entry.bump();
        return entry.value;
    },
    stamp : function(stamp) {
        if (stamp == this._stamp)
            return;
        this._init(stamp);
    },
    _removeEldest : function() {
        var count = 0;
        var eldest = null;
        var eldestKey = null;
        for (key in this._cache) {
            count++;
            var current = this._cache[key];
            if (eldest == null || eldest.stamp > current.stamp) {
                eldestKey = key;
                eldest = current;
            }
        }
        if (count <= this.maxEntries)
            return;
        if (eldest != null)
            delete this._cache[key];
    }
});