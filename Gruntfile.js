module.exports = function(grunt) {
	var input = "src/**/*.js";
	if (grunt.option("file")) {
		input = grunt.option("file").split("/").reverse();
		input = input[1] + "/" + input[0];
	}

	// Project configuration.
	grunt.initConfig({
		watch: {
			scripts: {
				files: [input],
				tasks: ["compile"]
			}
		},

		compile: {
			custom: {
				files: [{
					src: [input],
					dest: "dist/"
				}]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadTasks("tasks");

	// Default task(s).
	grunt.registerTask("default", ["compile"]);
};
