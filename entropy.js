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
		var name, object;

		var args = Array.prototype.slice.call(arguments);

		if(args.length === 0){
			name = 'none';
			object = {};
		}

		if(args.length === 1){
			name = 'none';
			object = args[0];
		}

		if(args.length === 2){
			name = args[0];
			object = args[1];
		}

		var copy = this._collection.push(new this.Object(object));

		numObjects += 1;

		return this._collection[copy - 1];
	};

	entropy.register = function(test, handler){
		plugins.push({
			test: test,
			handler: handler
		});
	};

	entropy.list = function(){
		return this._collection;
	};

	entropy.Object = function(input){
		var object = entropy.copy(input);

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

	entropy.query = (function(S){
		var	query = function(selector){
			this.query(selector);
		};

		var	methods = query.prototype = new Array;

		methods.query = function(selector){
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
			var args = Array.prototype.slice.call(arguments),
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

//	S('#dog');
S.register(/^(#\w+)$/, function(){
	console.log('id', arguments);
	return '';
});
