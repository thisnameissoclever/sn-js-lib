var Class = (function() {
		var d = (function() {
				for (var e in {
					toString: 1
				}) {
					if (e === "toString") {
						return false
					}
				}
				return true
			}
		)();
		function a() {}
		function b() {
			var h = null
				, g = $A(arguments);
			if (Object.isFunction(g[0])) {
				h = g.shift()
			}
			function e() {
				this.initialize.apply(this, arguments)
			}
			Object.extend(e, Class.Methods);
			e.superclass = h;
			e.subclasses = [];
			if (h) {
				a.prototype = h.prototype;
				e.prototype = new a;
				h.subclasses.push(e)
			}
			for (var f = 0, j = g.length; f < j; f++) {
				e.addMethods(g[f])
			}
			if (!e.prototype.initialize) {
				e.prototype.initialize = Prototype.emptyFunction
			}
			e.prototype.constructor = e;
			return e
		}
		function c(l) {
			var g = this.superclass && this.superclass.prototype
				, f = Object.keys(l);
			if (d) {
				if (l.toString != Object.prototype.toString) {
					f.push("toString")
				}
				if (l.valueOf != Object.prototype.valueOf) {
					f.push("valueOf")
				}
			}
			for (var e = 0, h = f.length; e < h; e++) {
				var k = f[e]
					, j = l[k];
				if (g && Object.isFunction(j) && j.argumentNames()[0] == "$super") {
					var m = j;
					j = (function(i) {
							return function() {
								return g[i].apply(this, arguments)
							}
						}
					)(k).wrap(m);
					j.valueOf = (function(i) {
							return function() {
								return i.valueOf.call(i)
							}
						}
					)(m);
					j.toString = (function(i) {
							return function() {
								return i.toString.call(i)
							}
						}
					)(m)
				}
				this.prototype[k] = j
			}
			return this
		}
		return {
			create: b,
			Methods: {
				addMethods: c
			}
		}
	}
)();