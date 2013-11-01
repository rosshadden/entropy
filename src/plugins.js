(function() {
	"use strict";

	entropy.register("all", {
		check: /^\*$/,
		filter() { return true }
	});

	entropy.register("id", {
		check: /^#([\w\-_]+)$/,
		hooks: {
			"element.create"(element, value, ...args) {
				args.forEach((arg) => {
					element.data.id = "";
					let match = (""+arg).match(this.check);
					if (match) element.data.id = match[1];
				});
			}
		},
		filter(element, e, $id) {
			return element.data.id === $id;
		}
	});

	entropy.register("class", {
		check: /^\.([\w\-_]+)$/,
		hooks: {
			"element.create"(element, value, ...args) {
				element.data.classes = [];
				args.forEach((arg) => {
					let match = (""+arg).match(this.check);
					if (match) element.data.classes.push(match[1]);
				});
			}
		},
		init() {
			entropy.Element.prototype.hasClass = function(klass) {
				return !!~this.data.classes.indexOf(klass);
			};
			entropy.Element.prototype.addClass = function(...classes) {
				classes.forEach((klass) => {
					if (!this.hasClass(klass)) this.data.classes.push(klass);
				});
				return this;
			};
			entropy.Element.prototype.removeClass = function(...classes) {
				classes.forEach((klass) => {
					let index = this.data.classes.indexOf(klass);
					if (!!~index) this.data.classes.splice(index, 1);
				});
				return this;
			};
			entropy.Element.prototype.toggleClass = function(...classes) {
				classes.forEach((klass) => {
					let hasClass = this.hasClass(klass);
					if (!hasClass) return this.addClass(klass);
					if (hasClass) return this.removeClass(klass);
				});
				return this;
			};
		}
		filter(element, e, $class) {
			return element.hasClass($class);
		}
	});

	entropy.register("key", {
		check: /^([\w\-_]+)$/,
		hooks: {
			"element.create"(element, value, ...args) {
				args.forEach((arg) => {
					element.data.key = "";
					let match = (""+arg).match(this.check);
					if (match) element.data.key = match[1];
				});
			}
		},
		filter(element, e, $key) {
			return element.data.key === $key;
		}
	});

	entropy.register("property-presence", {
		check: /^\[\s*(!?[\w+\-]+)\s*\]$/,
		filter(element, e, $property) {
			return $property in element.value;
		}
	});

	entropy.register("property-comparison", {
		check: /^\[\s*(!?[\w\-_]+)\s*(!?)(=|\^=|\$=|\*=|<|>)(=?)\s*([""]?)(.*)\5\s*\]$/,
		filter(element, e, $property, $not, $operator, $isStrict, $quote, $value) {
			var property = element.value[$property];
			var test = ($isStrict) ? property : !!element.value && (""+property).toLowerCase(),
				control = ($isStrict) ? $value : (""+$value).toLowerCase(),
				isNegated = !!$not;

			var cases = {
				// Equality:
				"=": function(){
					return test == control;
				},
				// Starts with:
				"^=": function(){
					var regex = new RegExp("^" + control);
					return regex.test(test, ($isStrict) ? "" : "i");
				},
				// Ends with:
				"$=": function(){
					var regex = new RegExp(control + "$");
					return regex.test(test, ($isStrict) ? "" : "i");
				},
				// Contains:
				"*=": function(){
					var regex = new RegExp(control);
					return regex.test(test, ($isStrict) ? "" : "i");
				},
				// Less than:
				"<": function(){
					return ($isStrict) ? parseInt(test, 10) <= parseInt(control, 10) : parseInt(test, 10) < parseInt(control, 10);
				},
				// Greater than:
				">": function(){
					return ($isStrict) ? parseInt(test, 10) >= parseInt(control, 10) : parseInt(test, 10) > parseInt(control, 10);
				}
			};

			// Run the relevant function based on the operator, and return pass/fail.
			var result = cases[$operator]();
			return (isNegated) ? !result : result;
		}
	});

	entropy.register("type", {
		check: /^~(\w+)$/,
		filter(element, e, $type) {
			var type = Object.prototype.toString.call(element.value).replace(/\[object (\w+)\]/, "$1");
			return type.toLowerCase() === $type.toLowerCase();
		}
	});

	entropy.register("index", {
		check: /^(\d+)$/,
		type: "number",
		filter(element, e, $index) {
			return e == $index;
		}
	});

	entropy.register("children", {
		hooks: {
			"element.create"(element, value, ...args) {
				var children;
				if (typeof value === "object" && value !== null) {
					children = entropy.from(value);
				} else {
					children = new entropy.Set();
				}
				element.data.children = children;
			}
		},
		init() {
			entropy.Set.prototype.find = function(...args) {
				var s = new entropy.Set();
				var addChildren = function() {
					let filter = this.filter(...args);
					s.addAll(filter);
					this.forEach((element) => addChildren.call(element.data.children));
				};
				addChildren.call(this);
				return s;
			};
			entropy.Element.prototype.cd = function(...selectors) {
				let children = this.data.children.filter(...selectors);
				if (children.length) return children[0];
				return new entropy.Element(new Error("The requested child does not exist."));
			};
			entropy.Element.prototype.addChild = function(...args) {
				this.data.children.add(...args);
				return this;
			};
			entropy.Element.prototype.addChildren = function(...args) {
				this.data.children.addAll(...args);
				return this;
			};
			entropy.Element.prototype.removeChild = function(...args) {
				this.data.children.remove(...args);
				return this;
			};
		}
	});
})();
