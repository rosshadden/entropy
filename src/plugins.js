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
			"create-element"() {
				this.data.id = "";
			}
		}
	});
})();
