var fs = require("fs");
var path = require("path");

var traceur = require("traceur");

module.exports = function(grunt) {
	grunt.registerMultiTask("compile", "Transpile ES6 code to ES5.", function() {
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
			modules: true,
			privateNames: true,
			privateNameSyntax: true,
			propertyMethods: true,
			propertyNameShorthand: true,
			propertyOptionalComma: true,
			restParameters: true,
			sourceMaps: false,
			spread: true,
			strictSemicolons: false,
			templateLiterals: true,
			trapMemberLookup: false,
			types: true,
			unstarredGenerators: false,
			validate: false
		});

		traceur.options.setFromObject(options);

		this.files.forEach(function(group) {
			var reporter = new traceur.util.ErrorReporter(),
				project = new traceur.semantics.symbols.Project(".");

			console.log(group.src, "=>", group.dest);

			group.src.forEach(function(filename) {
				var data = grunt.file.read(filename).toString("utf8");
				var sourceFile = new traceur.syntax.SourceFile(filename, data);
				project.addFile(sourceFile);
			});

			var results = traceur.codegeneration.Compiler.compile(reporter, project, false);
			if (reporter.hadError()) {
				console.error("ERROR");
				return false;
			}

			results.keys().forEach(function(file) {
				var traceurOptions = {};

				if (options.sourceMaps) {
					traceurOptions.sourceMapGenerator = new traceur.outputgeneration.SourceMapGenerator({
						file: file.name
					});
				}

				var tree = results.get(file);
				var source = traceur.outputgeneration.TreeWriter.write(tree, traceurOptions);
				var output = group.dest + file.name;
				grunt.file.write(output, source);

				if (traceurOptions.sourceMap) {
					grunt.file.write(output + '.map', traceurOptions.sourceMap);
				}

				console.log("✔", output);
			});
		});
	});
};
