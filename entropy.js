(function(window, undefined){
	'use strict';

	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0,
		pluginList = entropy.plugins = {};

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

	entropy.register = function(selector, properties){
		pluginList[selector] = properties;
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
			selector = selector.replace(/\s/g, '') || '';

			var self = this;

			var	lexer, plugin,
				word = '',
				results = [],
				phrases = selector.split(',');

			phrases.forEach(function(phrase, p){
				var	relevant = [],
					lexers = [];

				for(var plugin in pluginList){
					if(pluginList[plugin].test.test(phrase)){
						relevant.push(plugin);

						if(pluginList[plugin].start){
							lexers.push(pluginList[plugin].start);
						}

						if(pluginList[plugin].stop){
							lexers.push(pluginList[plugin].stop);
						}
					}
				}

				console.log(relevant, lexers);

				if(typeof phrase === 'string'){
					var originalPhrase = phrase;

					while(phrase.length > 0){
						lexer = phrase[0];
						phrase = phrase.substr(1);

						var	isRegistered = lexers.indexOf(lexer) > -1,
							isPhrase = phrase.length === 0;

						if(isPhrase){
							word += lexer;
						}

						if(isPhrase || isRegistered){
							if(word.length === 0 || isRegistered){
								plugin = pluginList[lexer];
							}else if(word === originalPhrase){
								plugin = pluginList.word;
							}

							if(word.length > 0){
								results.push(plugin.method(word));
							}

							word = '';
						}else{
							word += lexer;
						}
					}
				}
			});

			S._collection.forEach(function(item, i){
				for(var result in results){
					if(typeof results[result].test === 'function' && results[result].test(item, results[result], results) || results[result].test === true){
						self.push(item);
					}
				}
			});

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

//	S('dog');
S.register('word', {
	test: /^\w+$/,
	method: function(word){
		return {
			word: word,
			test: function(item, result, results){
				return item.type === result.word;
			}
		};
	}
});

//	THESE ARE NOT WORKING YET:

//	S('!dog');
S.register('!', {
	test: /!\w+/,
	start: '!',
	method: function(word){
		var item = word.substr(word.indexOf('!') + 1).replace(/\s|\[|\]/g, '');

		this.except = this.except || [];

		this.except.push(item);

		var i = 0;
		while(i < this.length){
			if(this[i].type === item){
				this.splice(i, 1);

				i -= 1;
			}

			i += 1;
		}
	}
});

//	S('[name]');
//	S('[name=Fred]');
S.register('param', {
	test: /^\[.+\]$/,
	start: '[',
	stop: ']',
	method: function(word){
		var	param = word.replace(/\s|\[|\]/g, ''),
			parts = param.split('=');

		/*var i, length = S._collection.length;
		for(i = 0; i < length; i++){
			if(
				parts.length === 1 && S._collection[i].object[parts[0]]
			||	parts.length === 2 && S._collection[i].object[parts[0]] === parts[1]
			){
				this.push(S._collection[i]);
			}
		}*/
		console.log('word', word);
		return {
			word: word,
			test: function(item, result, results){
				console.log(item, result, results);
				return false;
			}
		};
	}
});
