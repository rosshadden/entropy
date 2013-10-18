(function() {
	"use strict";

	class Set extends Array {
		constructor() {}

		// PROPERTIES
			get type() { return "set"; }

		// RETRIEVAL
			has(item) {
				return !!~this.indexOf(item);
			}

		// MANIPULATION
			// DIRECT
			add(...items) {
				items.forEach((item) => {
					if (!this.has(item)) {
						Array.prototype.push.call(this, item);
					}
				})
				return this;
			}

			remove(...items) {
				items.forEach((item) => {
					if (this.has(item)) {
						Array.prototype.splice(null, this.indexOf(item), 1);
					}
				})
				return this;
			}

			// INDIRECT
			slice(start = 0, end = Infinity) {
				if (start < 0) start += this.length;
				if (end < 0) end += this.length;

				return this.filter((item, i) => {
					return i >= start && i < end;
				});
			}

		// ITERATION
			map(callback, self) {
				if (this == null) throw new TypeError(" this is null or not defined");

				var O = Object(this);
				var len = O.length >>> 0;

				if (typeof callback !== "function") {
					throw new TypeError(callback + " is not a function");
				}

				let s = new Set();
				let k = 0;
				while(k < len) {
					let kValue, mappedValue;
					if (k in O) {
						kValue = O[ k ];
						mappedValue = callback.call(self, kValue, k, O);
						s.add(mappedValue);
					}
					k++;
				}
				return s;
			}

			filter(callback, self) {
				if (this == null) throw new TypeError();
				if (typeof callback !== "function") throw new TypeError();

				var set = new Set();
				var O = Object(this);
				for (let i in O) {
					if (O.hasOwnProperty(i) && callback.call(self, O[i], i, O)) {
						set.add(O[i]);
					}
				}
				return set;
			}

		// PATCHING
			pop() {}
			push() {}
			shift() {}
			unshift() {}
			splice() {}
			concat() {}

		// CONVERSION
			toArray() { return Array.prototype.slice.call(this); }

			toString() {
				return (!this.length) ? "∅" : `{ ${this.join(", ")} }`;
			}
	}


	var entropy = (function() {
		var entropy = new Set();

		entropy.version = 0.7;
		entropy.plugins = [];

		return entropy;
	})();


	// Assign globally, whether in a browser or node.js.
	if (typeof module !== "undefined" && typeof require !== "undefined") {
		module.exports = entropy;
	} else {
		window.entropy = window.S = entropy;
	}
})();
