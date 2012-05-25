(function(window, undefined){
	'use strict';

	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0,
		helperList = entropy.helpers = {};

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
		helperList[selector] = properties;
	};
	
	entropy.query = (function(S){
		var	query = function(selector){
			this.query(selector);
		}
		
		var	methods = query.prototype = new Array;
		
		methods.query = function(selector){
			selector = selector.replace(/\s/g, '') || '';

			var self = this;
			
			var	lexer, helper,
				word = '',
				results = [],
				phrases = selector.split(',');

			phrases.forEach(function(phrase, p){
				var	relevant = [],
					lexers = [];

				for(var helper in helperList){
					if(helperList[helper].test.test(phrase)){
						relevant.push(helper);

						if(helperList[helper].start){
							lexers.push(helperList[helper].start);
						}

						if(helperList[helper].stop){
							lexers.push(helperList[helper].stop);
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
								helper = helperList[lexer];
							}else if(word === originalPhrase){
								helper = helperList.word;
							}

							if(word.length > 0){
								results.push(helper.method(word));
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

//	S('*');
S.register('*', {
	test: /^\*/,
	start: '*',
	method: function(word){
		return {
			word: word,
			test: true,
			select: true
		};
	}
});

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
		}
	}
});