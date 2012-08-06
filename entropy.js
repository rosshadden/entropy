(function(window, undefined){
	'use strict';

	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0,
		plugins = entropy.plugins = [];

	entropy.version = 0.01;

	entropy._collection = [];

	//	TODO: Merge with S.add.
	entropy.create = function(type, prototype, values){
		var	object = Object.create(prototype, values),
			init = object.init || function(){};

		var	item = {
			type: type,

			object: object,

			init: function(){
				entropy._collection.push(this);

				init.call(this);
			}
		};

		numObjects += 1;

		entropy._collection.push(item);

		return item;
	};

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

	entropy.register = function(expression, handler){
		plugins.push({
			expression: expression,
			handler: handler
		});

		//	TODO: Sort by (''+expression).length.
	};

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

				if(self.plugins.some(function(plugin, p){
					if(plugin.handler.apply(object, [object.object].concat(plugin.matches))){
						self.push(object);

						return true;
					}
				})){
					continue;
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
