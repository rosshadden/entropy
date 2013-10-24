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
				args.forEach((arg) => {
					element.data.classes = [];
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
})();
