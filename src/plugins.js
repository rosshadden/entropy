(function() {
	"use strict";

	entropy.register("all", {
		check: /^\*$/,
		filter() { return true }
	});

	entropy.register("id", {
		check: /^#([\w\-_]+)$/,
		filter(element, e, $id) {
			return element.data.id === $id;
		}
		hooks: {
			"element.create"(element, value, ...args) {
				args.forEach((arg) => {
					let match = (""+arg).match(this.check);
					if (match) element.data.id = match[1];
				});
			}
		}
	});
})();
