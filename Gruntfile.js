module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		compile: {
			custom: {
				files: {
					"dist/": ["src/**.js"]
				}
			}
		}
	});

	grunt.loadTasks("tasks");

	// Default task(s).
	grunt.registerTask("default", ["compile"]);
};
