(function() {
	"use strict";

	private @hooks;
	var hooks = {
		@hooks: {},

		on(event, handler, plugin) {
			if (!(event in this.@hooks)) this.@hooks[event] = [];
			this.@hooks[event].push({ handler, plugin });
		}

		trigger(event, ...data) {
			if (event in this.@hooks) {
				this.@hooks[event].forEach((hook) => hook.handler.apply(hook.plugin, data));
			}
		}
		get list() {return this.@hooks}
	};

	var isSet = (value = null) => {
		return value != null && value.type === "set";
	};
	var isElement = (value = null) => {
		return value != null && value.type === "element";
	};


	class Element {
		constructor(value = null, ...args) {
			Object.defineProperty(this, "data", {
				writable: true,
				enumerable: false,
				configurable: false,
				value: {}
			});

			this.value = value;
			hooks.trigger("element.create", this, value, ...args);
		}

		get type() { return "element" }
		toString() {
			if (Array.isArray(this.value)) return `[${this.value.toString()}]`;
			if (typeof this.value === "object") return `{${Object.keys(this.value)}}`;
			return ""+this.value;
		}

		get(key) {
			if (typeof key === "undefined") return this.value;
			if (/^!/.test(key)) {
				key = (""+key).slice(1);
				if (~["type"].indexOf(key)) return this[key];
				return this.data[key];
			}
			return this.value[key];
		}

		set(key, value) {
			this.value[key] = value;
			return this;
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

			Object.defineProperty(this, "data", {
				writable: true,
				enumerable: false,
				configurable: false,
				value: {}
			});

			hooks.trigger("set.create", this);
			if (args.length) this.addAll(...args);
		}

		// PROPERTIES
			get type() { return "set" }

		// CONVERSION
			toArray() { return Array.prototype.slice.call(this) }

			toString() {
				return (!this.length) ? "∅" : `{ ${this.join(", ")} }`;
			}

		// RETRIEVAL
			get(index = 0) {
				return this[index] && this[index].value || undefined;
			}

			has(value) {
				return !!~this.indexOf(value);
			}

			contains(value) {
				return !!this.filter(value).length;
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
			set(...args) {
				return this.forEach(function() {
					this.set(...args)
				});
			}

			add(item, ...args) {
				if (!this.has(item)) {
					if (!isElement(item)) item = new Element(item, ...args);
					Array.prototype.push.call(this, item) - 1;
					hooks.trigger("set.add", this, item, ...args);
				}
				return this;
			}
			addAll(...items) {
				if (items.length === 1 && (Array.isArray(items[0]) || isSet(items[0]))) items = items[0];
				items.forEach(this.add, this);
				return this;
			}

			remove(...items) {
				items.forEach((item) => {
					if (this.has(item)) {
						Array.prototype.splice.call(this, this.indexOf(item), 1);
						hooks.trigger("set.remove", this, item);
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
				return this.filter((item, i) => (i >= begin && i < end));
			}

		// ITERATION
			map(to) {
				if (typeof to === "function") {
					var O = Object(this);
					var len = O.length >>> 0;

					let s = new Set();
					let k = 0;
					while(k < len) {
						let mappedValue;
						if (k in O) {
							mappedValue = to.call(self || O[k], O[k].value, k, this);
							s.add(mappedValue);
						}
						k++;
					}
					return s;
				} else if (~["string", "number", "date"].indexOf(typeof to)) {
					return this.toArray().map((element) => element.get(to));
				} else if (Array.isArray(to)) {
					return this.toArray().map((element) => {
						return to.reduce((output, property) => {
							output[property] = element.get(property);
							return output;
						}, {});
					});
				} else if (typeof to === "object") {
					return this.toArray().map((element) => {
						return Object.keys(to).reduce((output, property) => {
							if (property == to[property]) {
								output[property] = element.get(property);
							} else {
								output[property] = to[property].replace(/\[([\w .-]*)\]/g, function(string, $property) {
									return element.get($property) || "";
								});
							}
							return output;
						}, {});
					});
				}
				return this.toArray().map((element) => element.value);
			}

			filter(...selectors) {
				var s;
				if (typeof selectors[0] === "function") {
					s = new Set();
					let O = Object(this);
					for (let i in O) {
						if (O.hasOwnProperty(i) && selectors[0].call(selectors[1] || O[i], O[i].value, i, this)) {
							s.add(O[i]);
						}
					}
				} else {
					s = this.slice();
					let existRelevantPlugins = entropy.plugins.map().some((plugin) => {
						if (typeof plugin.filter === "function") {
							let match = plugin.relevance(...selectors);
							if (match && match.length) {
								s = s.filter(function(item, i) {
									return plugin.filter.call(this, item, i, ...match);
								});
								return true;
							}
						}
					});
					if (!existRelevantPlugins) s = new Set();
				}
				return s;
			}

			forEach(fn, self) {
				let e, length = this.length;
				for(e = 0; e < length; e++) {
					let element = this[e];
					if (typeof fn === "function") {
						try {
							fn.call(self || element, element.value, e, this);
						} catch(error) {
							// Allows for s.forEach(console.log, console), s.forEach(alert), etc.
							fn.call(self || null, element.value, e, this);
						}
					}
				}
				return this;
			}

		// SET OPERATIONS
			union(...sets) {
				var s = this.slice();
				sets.forEach((set) => set.forEach(function(item) { s.add(this) }));
				return s;
			}

			intersection(...sets) {
				return this.slice()
					.filter(function(item) {
						sets.every((set) => {
							if (Array.isArray(set)) set = new Set(...set);
							return set && set.type === "set" && set.has(this);
						})
					});
			}

			difference(...sets) {
				var s = this.slice();
				sets.forEach((set) => set.forEach(function(item) { s.remove(this) }));
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

		let writable = false, configurable = false, enumerable = false;
		Object.defineProperties(entropy, {
			version: {
				value: 0.7,
				writable, configurable, enumerable
			},

			Set: {
				value: Set,
				writable, configurable, enumerable
			},
			Element: {
				value: Element,
				writable, configurable, enumerable
			},
			plugins: {
				value: new Set(),
				writable, configurable, enumerable
			},

			hooks: {
				value: hooks,
				writable: true, configurable, enumerable
			},

			create: {
				value: (...items) => new Set(...items),
				writable, configurable, enumerable
			},
			of: {
				value: (...items) => new Set(...items),
				writable, configurable, enumerable
			},
			from: {
				value: (iterable) => {
					if (iterable == null) iterable = [];
					var s = new Set(...iterable);
					if (!Array.isArray(iterable)) {
						for (let item in iterable) {
							s.add(iterable[item], item);
						}
					}
					return s;
				},
				writable, configurable, enumerable
			},

			register: {
				value: function(name, plugin) {
					if (!plugin.type) plugin.type = "string";
					if (!plugin.relevance) {
						plugin.relevance = function(...selectors) {
							let match = (""+selectors[0]).match(plugin.check);
							return (
								selectors.length === 1 && (
									plugin.type === "array" && Array.isArray(selectors[0]) ||
									plugin.type === typeof selectors[0]
								) &&
								match && match.slice(1) ||
								[]
							);
						}
					}

					this.plugins.add(plugin);
					for (let hook in plugin.hooks) {
						hooks.on(hook, plugin.hooks[hook], plugin);
					}
					if (plugin.init) plugin.init();
					return this;
				},
				writable, configurable, enumerable
			}
		});

		return entropy;
	})();


	// Assign globally, whether in a browser or node.js.
	if (typeof module !== "undefined" && typeof require !== "undefined") {
		module.exports = entropy;
	} else {
		window.entropy = window.S = entropy;
	}
})();
