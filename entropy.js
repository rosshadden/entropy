window.entropy = window.S = (function(){
	var Entity = Object.create(Function.prototype);

	var utilities = {
		functionFactory: function(proto){
			return function(){
				var f = function(){
					return f.call.apply(f, arguments);
				};

				Object.keys(proto).forEach(function(key){
					f[key] = proto[key];
				});

				f.constructor.apply(f, arguments);

				return f;
			};
		},

		extend: function(dest, source){
			Object.getOwnPropertyNames(source).forEach(function(key){
				dest[key] = source[key];
			});
		}
	};

	utilities.copy = (function(){
		var root, current,
			path = [];

		return function(object, isNested){
			var i, output, length;

			if(!isNested){
				root = this;
			}

			if(Object.prototype.toString.call(object) === '[object Array]'){
				if(isNested){
					root['.manifest'][root['.manifest'].length - 1].type = 'array';
				}

				output = [];
				i = 0;
				length = object.length;

				for(; i < length; i++){
					root['.manifest'].push({
						name: i,
						path: path.slice(),
						type: typeof object[i],
						value: object[i]
					});

					path.push(i);

					output[i] = utilities.copy(object[i], true);

					path.pop();
				}

				return output;
			}

			if(typeof object === 'object'){
				output = {};

				for(i in object){
					root['.manifest'].push({
						name: i,
						path: path.slice(),
						type: typeof object[i],
						value: object[i]
					});

					path.push(i);

					output[i] = utilities.copy(object[i], true);

					path.pop();
				}

				return output;
			}

			return object;
		};
	})();

	utilities.extend(Entity, {
		constructor: function(id, classes, contents){
			this['.set'] = [];

			//	If an ID was assigned,
			//	set that shit as toString.
			(!!id) && (this.toString = function(){
				return id;
			});
		},

		//	Called when you invoke the instance as a function.
		//	This runs a query against the set of the instance.
		call: function(selector){
			return this;
		},

		toString: function(){
			return 'Entity';
		},

		create: utilities.functionFactory(Entity),

		makeEntity: function(){
			var id, contents,
				classes = [];

			var args = Array.prototype.slice.call(arguments);

			//	Adds an empty object (for some reason?).
			if(args.length === 0){
				id = '';
				contents = {};
			}

			//	Adds the passed in object, with no ID or classes.
			if(args.length === 1){
				id = '';
				contents = args[0];
			}

			//	Adds an object with an ID.
			if(args.length === 2){
				id = args[0];
				contents = args[1];
			}

			//	Adds an object with an ID and some classes.
			if(args.length === 3){
				id = args[0];
				classes = args[1];
				contents = args[2];

				if(typeof classes === 'string'){
					classes = classes.split(' ');
				}
			}

			var entity =  Entity.create(id, classes, contents);

			entity.id = id;
			entity.classes = classes;

			Object.defineProperty(entity, '.manifest', {
				value: [],
				enumerable: false,
				configurable: false
			});

			entity.contents = utilities.copy.call(entity, contents);

			// //	Check for existence of a duplicate ID.
			// var doesExist = this['.set'].some(function(item){
			// 	return (id === '') ? false : id === item.id;
			// });

			// //	If ID does not exist in the set, add it.
			// //	Otherwise, bitch about it.
			// if(doesExist){
			// 	throw new Error('Item with the given ID already exists.');
			// }

			return entity;
		},

		add: function(){
			var entity = Entity.makeEntity.apply(this, arguments);
			this['.set'].push(entity);

			return this;
		},

		getSet: function(){
			return this['.set'];
		}
	});

	window.Entity = Entity;

	var entropy = (function(){
		var entropy = Entity.create();

		entropy.version = 0.1;
		entropy['.plugins'] = [];

		entropy.register = (function(){
			var plugins = entropy['.plugins'];

			//	Sort in descending length order.
			var sort = function(a, b){
				var lengthA = (''+a.expression).length,
					lengthB = (''+b.expression).length;

				if(lengthA < lengthB){
					return 1;
				}
				if(lengthA > lengthB){
					return -1;
				}
				return 0;
			};

			return function(expression, handler){
				plugins.push({
					expression: expression,
					handler: handler
				});

				plugins.sort(sort);
			};
		})();

		return entropy;
	})();

	return entropy;
})();
