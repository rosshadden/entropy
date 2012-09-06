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
		var id, object,
			classes = [];

		var args = Array.prototype.slice.call(arguments);

		//	Adds an empty object (for some reason?).
		if(args.length === 0){
			id = '';
			object = {};
		}

		//	Adds the passed in object, with no ID or classes.
		if(args.length === 1){
			id = '';
			object = args[0];
		}

		//	Adds an object with an ID.
		if(args.length === 2){
			id = args[0];
			object = args[1];
		}

		//	Adds an object with an ID and some classes.
		if(args.length === 3){
			id = args[0];
			classes = args[1];
			object = args[2];

			if(typeof classes === 'string'){
				classes = classes.split(' ');
			}
		}

		var copy = this._collection.push(new this.Entity(id, classes, object));

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

	entropy.copy = (function(){
		var root, current,
			path = [];

		return function(object, isNested){
			var i, output, length;

			if(!isNested){
				root = this;
			}

			if(Object.prototype.toString.call(object) === '[object Array]'){
				if(isNested){
					root.manifest[root.manifest.length - 1].type = 'array';
				}

				output = [];
				i = 0;
				length = object.length;

				for(; i < length; i++){
					root.manifest.push({
						name: i,
						path: path.slice(),
						type: typeof object[i],
						value: object[i]
					});

					path.push(i);

					output[i] = entropy.copy(object[i], true);

					path.pop();
				}

				return output;
			}

			if(typeof object === 'object'){
				output = {};

				for(i in object){
					root.manifest.push({
						name: i,
						path: path.slice(),
						type: typeof object[i],
						value: object[i]
					});

					path.push(i);

					output[i] = entropy.copy(object[i], true);

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

			if(~[undefined, ''].indexOf(selector)){
				return self;
			}else{
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

					if(self.plugins.length > 0 && self.plugins.every(function(plugin, p){
						if(plugin.handler.apply(object, [object.contents].concat(plugin.matches))){
							return true;
						}
					})){
						self.push(object);
					}
				}
			}

			return self;
		};

		methods.get = function(index){
			return this[index];
		};

		methods.eq = function(index){
			this.splice(index, index + 1);

			return this;
		};

		methods.add = methods.concat = function(selector){
			return this.query(selector);
		};

		methods.remove = function(index){
			this.splice(index, 1);

			return this;
		};

		methods.each = methods.forEach;

		methods.run = function(){
			var args = this.slice.call(arguments),
				method = args.splice(0, 1);

			this.forEach(function(item, i){
				if(item.contents[method]){
					item.contents[method].apply(item.contents, args);
				}
			});

			return this;
		};

		return query;
	})(entropy);

	entropy.Entity = (function(){
		var Entity = function(id, classes, object){
			this.create(id, classes, object);
		};

		var methods = Entity.prototype = new Object;

		methods.create = function(id, classes, object){
			this.id = id;
			this.classes = classes;

			Object.defineProperty(this, 'manifest', {
				value: [],
				enumerable: false,
				configurable: false
			});

			this.contents = entropy.copy.call(this, object);

			return this;
		};

		methods.addClass = function(klass){
			var index = this.classes.indexOf(klass);

			if(!~index){
				this.classes.push(klass);
			}

			return this;
		};

		methods.removeClass = function(klass){
			var index = this.classes.indexOf(klass);

			if(~index){
				this.classes.splice(index, 1);
			}

			return this;
		};

		methods.has = function(query){
			return this.manifest.some(function(item, i){
				return query === item.name;
			});
		};

		methods.children = function(query){
			var output = [];

			for(var child in this.contents){
				output.push(this.contents[child]);
			}

			return output;
		};

		methods.find = methods.filter = function(query){
			return this.manifest.filter(function(item, i){
				return query === item.name;
			});
		};

		methods.map = function(path){
			var current = this;

			path.forEach(function(level, l){
				current = current[level];
			});
		};

		return Entity;
	})();

	window.entropy = window.S = entropy;
})(window);

//	SELECTORS

//	All.
//	S('*'), S('all');
S.register(/^\*|all$/, function(object, expression){
	return true;
});

//	ID.
//	S('#Jake');
S.register(/[#]([\w\-_]+)/g, function(object, expression, $id){
	return this.id === $id;
});

//	Property presence.
//	S('[property]');
S.register(/\[\s*([^\s]+)\s*\]/g, function(object, expression, $property){
	return object.hasOwnProperty($property);
});

//	Property equivalence.
//	let property = 'VaLuE':
//	S('[property="value"]');
//	S('[property=="VaLuE"]');
//	S("[property^='va']");
//	S("[property^=='Va']");
//	S("[property*='lu']");
//	S("[property*=='Lu']");
//	S('[property$=ue]');
//	S('[property$==uE]');
S.register(/\[\s*([\w\-_]+)\s*(=|\^=|\$=|\*=)(=?)\s*(["']?)([^\4]+)\4\]/g, function(object, expression, $property, $operator, $isStrict, $quote, $value){
	var	test = ($isStrict) ? object[$property] : (''+object[$property]).toLowerCase(),
		control = ($isStrict) ? $value : (''+$value).toLowerCase();

	var cases = {
		//	Equality:
		'=': function(){
			return test == control;
		},
		//	Starts with:
		'^=': function(){
			var regex = new RegExp('^' + control);
			return regex.test(test, 'i');
		},
		//	Ends with:
		'$=': function(){
			var regex = new RegExp(control + '$');
			return regex.test(test, 'i');
		},
		//	Contains:
		'*=': function(){
			var regex = new RegExp(control);
			return regex.test(test, 'i');
		}
	};

	//	Run the relevant function based on the operator, and return pass/fail.
	return cases[$operator]();
});

//	Class.
//	S('.mammal');
S.register(/[\#]{0}\.?([\w\-_]+)/g, function(object, expression, $klass){
	return ~this.classes.indexOf($klass);
});


//	Type.
//	S('@Array');
//	Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).
S.register(/@(\w+)/g, function(object, expression, $type){
	var type = Object.prototype.toString.call(object).replace(/\[object (\w+)\]/, '$1');

	return type.toLowerCase() === $type.toLowerCase();
});
