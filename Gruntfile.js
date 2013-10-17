module.exports = function(grunt) {
	var input = "src/**/*.js";
	if (grunt.option("file")) {
		input = grunt.option("file").split("/").reverse();
		input = input[1] + "/" + input[0];
	}

	// Project configuration.
	grunt.initConfig({
		compile: {
			custom: {
				files: [{
					src: [input],
					dest: "dist/"
				}]
			}
		}
	});

	grunt.loadTasks("tasks");

	// Default task(s).
	grunt.registerTask("default", ["compile"]);
};
