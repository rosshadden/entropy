(function(window, undefined){
	'use strict';

	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0,
		pluginList = entropy.plugins = {};

	entropy.version = 0.01;
	
	entropy._collection = [];
	
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

	entropy.register = function(selector, properties){
		pluginList[selector] = properties;
	};
	
	entropy.query = (function(S){
		var	query = function(selector){
			this.query(selector);
		}
		
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
					}
				}

				if(typeof phrase === 'string'){
					var originalPhrase = phrase;

					while(phrase.length > 0){
						lexer = phrase[0];
						phrase = phrase.substr(1);

						var	isRegistered = relevant.indexOf(lexer) > -1,
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
								plugin.method.call(self, word, results);
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

			console.log('results', results);
			
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

S.register('*', {
	test: /^\*/,
	start: '*',
	method: function(word, results){
		results.push({
			word: word,
			test: true,
			select: true
		});
	}
});

S.register('word', {
	test: /^\w+$/,
	method: function(word, results){
		results.push({
			word: word,
			test: function(item, result, results){
				return item.type === result.word;
			}
		});
	}
});

S.register('!', {
	test: /!\w+/,
	start: '!',
	method: function(word, results){
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

S.register('param', {
	test: /^\[.+\]$/,
	start: '[',
	end: ']',
	method: function(word, results){
		var	param = word.replace(/\s|\[|\]/g, ''),
			parts = param.split('=');

		this.testing = 'qwer';

		var i, length = S._collection.length;
		for(i = 0; i < length; i++){
			if(
				parts.length === 1 && S._collection[i].object[parts[0]]
			||	parts.length === 2 && S._collection[i].object[parts[0]] === parts[1]
			){
				this.push(S._collection[i]);
			}
		}
	}
});