(function() {
	"use strict";

	entropy.register("all", {
		check: /^\*$/,
		filter() { return true }
	});

	entropy.register("id", {
		check: /^#([\w\-_]+)$/,
		filter() { return true }
		hooks: {
			create() {
				this.data.id = "";
			}
		}
	});
})();
