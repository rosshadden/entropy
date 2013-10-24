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
		filter(element, e, $class) {
			return !!~element.data.classes.indexOf($class);
		}
	});
})();
