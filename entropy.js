(function(window, undefined){
	'use strict';

	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0,
		plugins = entropy.plugins = [];

	entropy.version = 0.1;

	entropy._collection = [];

	//	Adds a new object to Entropy.
	//	Optionally accepts an ID string as the first argument.
	entropy.add = function(){
		var id, object;

		var args = Array.prototype.slice.call(arguments);

		if(args.length === 0){
			id = '';
			object = {};
		}

		if(args.length === 1){
			id = '';
			object = args[0];
		}

		if(args.length === 2){
			id = args[0];
			object = args[1];
		}

		var copy = this._collection.push(new this.Object(id, object));

		numObjects += 1;

		return this._collection[copy - 1];
	};

	entropy.register = (function(){
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

	entropy.list = function(){
		return this._collection;
	};

	entropy.Object = function(id, input){
		var object = {
			id: id,
			object: entropy.copy(input)
		};

		object.has = function(query){
			return object.manifest.some(function(item, i){
				return query === item.name;
			});
		};

		object.find = function(query){
			return object.manifest.filter(function(item, i){
				return query === item.name;
			});
		};

		object.map = function(path){
			var current = object;

			path.forEach(function(level, l){
				current = current[level];
			});
		};

		return object;
	};

	entropy.copy = (function(){
		var root, current,
			path = [];

		return function(object, isNested){
			var i, output, length;

			if(Object.prototype.toString.call(object) === '[object Array]'){
				output = [];
				i = 0;
				length = object.length;

				for(; i < length; i++){
					output[i] = this.copy(object[i], true);
				}

				return output;
			}

			if(typeof object === 'object'){
				output = {};

				if(!isNested){
					Object.defineProperty(output, 'manifest', {
						value: [],
						enumerable: false,
						configurable: false
					});

					root = output;
				}

				for(i in object){
					root.manifest.push({
						name: i,
						path: path.slice()
					});

					path.push(i);

					output[i] = this.copy(object[i], true);

					path.pop();
				}

				return output;
			}

			return object;
		};
	})();

	entropy.query = (function(entropy){
		var	query = function(selector){
			this.query(selector);
		};

		var	methods = query.prototype = new Array;

		methods.query = function(selector){
			var self = this;

			self.plugins = [];

			entropy.plugins.forEach(function(plugin, p){
				if(plugin.expression.test(selector)){
					selector = selector.replace(plugin.expression, function(){
						self.plugins.push({
							matches: self.slice.call(arguments).slice(0, -2),
							expression: plugin.expression,
							handler: plugin.handler
						});

						return '';
					});
				}
			});

			var	object,
				o = 0, length = entropy._collection.length;
			for(; o < length; o++){
				object = entropy._collection[o];

				if(self.plugins.every(function(plugin, p){
					if(plugin.handler.apply(object, [object.object].concat(plugin.matches))){
						return true;
					}
				})){
					self.push(object);
				}
			}

			return this;
		};

		methods.each = function(object, method, context){
			if(object.forEach){
				object.forEach(method, context);
			}else{
				for(var key in object){
					if(object.hasOwnProperty(key)){
						method.call(context, object[key], object);
					}
				}
			}

			return this;
		};

		methods.run = function(){
			var args = this.slice.call(arguments),
				method = args.splice(0, 1);

			this.forEach(function(item, i){
				if(item.object[method]){
					item.object[method].apply(item.object, args);
				}
			});

			return this;
		};

		return query;
	})(entropy);

	window.entropy = window.S = entropy;
})(window);

//	SELECTORS

//	ID.
//	S('#dog');
S.register(/#(\w+)/g, function(object, string, $1){
	return this.id === $1;
});

//	Property presence.
//	S('[name]');
S.register(/\[(\w+)\]/g, function(object, string, $1){
	return object.hasOwnProperty($1);
});

//	Property presence.
//	S('[name]');
S.register(/\s*\[\s*(\w+)\s*(=|==|\^=|\$=|\*=)\s*(\w+)\s*\]\s*/g, function(object, string, $property, $operator, $value){
	var cases = {
		//	Case-insensitive equality:
		'=': function(test, control){
			return (''+test).toLowerCase() == (''+control).toLowerCase();
		},
		//	Case-sensitive equality:
		'==': function(test, control){
			return test == control;
		},
		//	Starts with:
		'^=': function(test, control){
			var regex = new RegExp('^' + control);
			return regex.test(test, 'i');
		},
		//	Ends with:
		'$=': function(test, control){
			var regex = new RegExp(control + '$');
			return regex.test(test, 'i');
		},
		//	Contains:
		'*=': function(test, control){
			var regex = new RegExp(control);
			return regex.test(test, 'i');
		}
	};

	//	Run the relevant function based on the operator, and return pass/fail.
	return cases[$operator](object[$property], $value);
});

//	Type.
//	S('Array');
//	Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).
S.register(/(\w+)/g, function(object, string, $1){
	var type = Object.prototype.toString.call(object).replace(/\[object (\w+)\]/, '$1');

	return type.toLowerCase() === $1.toLowerCase();
});
