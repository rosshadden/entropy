module.exports = function(grunt) {
	var traceur = require("traceur/src/node/compiler");

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		traceur: {
			options: {
				test: 4
			},

			custom: {
				files: [{
					src: ["src/**/*.js"],
					dest: "dist/"
				}]
			}
		}
	});

	grunt.registerTask("traceur", "Transpile ES6 code to ES5.", function() {
		var options = this.options({
			arrayComprehension: true,
			arrowFunctions: true,
			blockBinding: true,
			blockBindings: true,
			cascadeExpression: true,
			classes: true,
			debug: false,
			defaultParameters: true,
			deferredFunctions: true,
			destructuring: true,
			experimental: true,
			forOf: true,
			freeVariableChecker: false,
			generatorComprehension: true,
			generators: true,
			ignoreNolint: false,
			modules: false,
			privateNames: true,
			privateNameSyntax: true,
			propertyMethods: true,
			propertyNameShorthand: true,
			propertyOptionalComma: false,
			restParameters: true,
			sourceMaps: true,
			spread: true,
			strictSemicolons: false,
			templateLiterals: true,
			trapMemberLookup: false,
			types: true,
			unstarredGenerators: false,
			validate: false
		});

		console.log(process.cwd());
		traceur.compileToDirectory("./dist", ["./src/entropy.js"])
	});

	// Default task(s).
	grunt.registerTask("default", ["traceur"]);
};
