(function() {
	"use strict";

	var
		isSet = (value = null) => {
			return value != null && value.type === "set";
		},
		isElement = (value = null) => {
			return value != null && value.type === "element";
		}
	;

	class Element {
		constructor(value = null) {
			this.value = value;
		}

		get type() { return "element" }
		toString() {
			if (Array.isArray(this.value)) return `[${this.value.toString()}]`;
			if (typeof this.value === "object") return `{${Object.keys(this.value)}}`;
			return ""+this.value;
		}
	}

	class Set extends Array {
		constructor(...args) {
			Object.defineProperty(this, "length", {
				enumerable: false,
				configurable: false,
				get() {
					return Object.keys(this).filter((key) => /^\d+$/.test(key)).length;
				}
			});

			if (args.length) this.add(...args);
		}

		// PROPERTIES
			get type() { return "set" }

		// CONVERSION
			toArray() { return Array.prototype.slice.call(this) }

			toString() {
				return (!this.length) ? "∅" : `{ ${this.join(", ")} }`;
			}

		// RETRIEVAL
			has(value) {
				return !!~this.indexOf(value);
			}

			indexOf(value) {
				if (value && value.type === "element") return Array.prototype.indexOf.call(this, value);
				for (let element in this) {
					if (this[element].value === value) return +element;
				}
				return -1;
			}

		// MANIPULATION
			// DIRECT
			add(...elements) {
				elements.forEach((element) => {
					if (!this.has(element)) {
						if (!isElement(element)) element = new Element(element);
						Array.prototype.push.call(this, element) - 1;
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
						kValue = O[k];
						mappedValue = callback.call(self, kValue, k, O);
						s.add(mappedValue);
					}
					k++;
				}
				return s;
			}

			filter(selector, self) {
				if (this == null) throw new TypeError();

				var s;
				if (typeof selector === "function") {
					s = new Set();
					let O = Object(this);
					for (let i in O) {
						if (O.hasOwnProperty(i) && selector.call(self, O[i], i, O)) {
							s.add(O[i]);
						}
					}
				} else {
					s = this.slice();
					entropy.plugins.forEach((plugin) => {
						let match = (""+selector).match(plugin.value.check);
						if (match) {
							s = s.filter(plugin.value.filter);
						}
					});
				}
				return s;
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
	}


	var entropy = (function() {
		var entropy = new Set();
		entropy.version = 0.7;

		entropy.Set = Set;
		entropy.Element = Element;
		entropy.plugins = new Set();

		entropy.of = (...items) => new Set(...items);
		entropy.from = (iterable) => new Set(...iterable);

		entropy.register = function(name, options) {
			this.plugins.add(options);
			return this;
		}

		return entropy;
	})();


	// Assign globally, whether in a browser or node.js.
	if (typeof module !== "undefined" && typeof require !== "undefined") {
		module.exports = entropy;
	} else {
		window.entropy = window.S = entropy;
	}
})();
