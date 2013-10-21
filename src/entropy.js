(function() {
	"use strict";

	class Set extends Array {
		constructor(...args) {
			this.add(...args)
		}

		// PROPERTIES
			get type() { return "set"; }

		// RETRIEVAL
			has(element) {
				return !!~this.indexOf(element);
			}

		// MANIPULATION
			// DIRECT
			add(...elements) {
				elements.forEach((element) => {
					if (!this.has(element)) {
						Array.prototype.push.call(this, element);
					}
				})
				return this;
			}

			remove(...elements) {
				elements.forEach((element) => {
					if (this.has(element)) {
						Array.prototype.splice.call(this, this.indexOf(element), 1);
					}
				})
				return this;
			}

			splice(...args) {
				var spliced = Array.prototype.splice.apply(this, args);
				return new Set(...spliced);
			}

			empty() {
				this.splice(0, this.length);
				return this;
			}

			// INDIRECT
			slice(begin = 0, end = Infinity) {
				if (begin < 0) begin += this.length;
				if (end < 0) end += this.length;
				return this.filter((element, e) => (e >= begin && e < end));
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

		// SET OPERATIONS
			union(...sets) {
				var s = this.slice();
				sets.forEach((set) => set.forEach((element) => s.add(element)))
				return s;
			}

			intersection(...sets) {
				return this.slice()
					.filter((element) =>
						sets.every((set) => {
							if (Array.isArray(set)) set = new Set(...set);
							return set && set.type === "set" && set.has(element);
						})
					);
			}

			difference(...sets) {
				var s = this.slice();
				sets.forEach((set) => set.forEach((element) => s.remove(element)));
				return s;
			}

			symmetricDifference(...sets) {
				return new Set(...sets).reduce((result, set) => {
					return result.union(set).difference(result.intersection(set));
				}, this);
			}

		// PATCHING
			pop() {}
			push() {}
			shift() {}
			unshift() {}
			concat() {}

		// CONVERSION
			toArray() { return Array.prototype.slice.call(this); }

			toString() {
				return (!this.length) ? "∅" : `{ ${this.join(", ")} }`;
			}
	}


	class entropy extends Set {
		constructor() {
			this.Set = Set;
			this.plugins = [];
		}

		get version() { return 0.7; }

		create(...elements) {
			return new Set(...elements);
		}
	};


	// Assign globally, whether in a browser or node.js.
	if (typeof module !== "undefined" && typeof require !== "undefined") {
		module.exports = new entropy();
	} else {
		window.entropy = window.S = new entropy();
	}
})();
