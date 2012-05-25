(function(window, undefined){
	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0,
		plugins = [];

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

	entropy.register = function(test, method, isBreaking){
		plugins.push({
			test: test,
			method: method,
			isBreaking: isBreaking
		});
	};
	
	entropy.query = (function(S){
		var	query = function(selector){
			this.query(selector);
		}
		
		var	methods = query.prototype = new Array;
		
		methods.query = function(selector){
			selector = selector || '';
			
			if(typeof selector === 'string'){
				var p, plugin,
					length = plugins.length;
				for(p = 0; p < length; p++){
					plugin = plugins[p];

					if(
						typeof plugin.test === 'string' && selector === plugin.test
					||	(plugin.test instanceof RegExp) && plugin.test.test(selector)
					){
						plugin.method.call(this, selector);
					}
				}

/*				if(/^\[.+\]$/.test(selector)){
					// var	params = selector.replace(/\s|\[|\]/g, ''),
					var	parts, property,
						properties = selector.match(/\[[\w=]+\]/gi);

					var i, length = properties.length;
					for(i = 0; i < length; i++){
						property = properties[i].replace(/\s|\[|\]/g, '');
						parts = property.split('=');

						var j, lenCollection = S._collection.length;
						for(j = 0; j < lenCollection; j++){
							if(
								parts.length === 1 && S._collection[j].object[parts[0]]
							||	parts.length === 2 && S._collection[j].object[parts[0]] === parts[1]
							){
								this.push(S._collection[j]);
								continue;
							}
						}
					}

					return this;
				}*/
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

S.register(/^\*/, function(){
	this.push.apply(this, S._collection.slice());
});

S.register(/^\w+$/, function(selector){
	var self = this;
	
	S._collection.forEach(function(item, i){
		if(item.type === selector){
			self.push(S._collection[i]);
		}
	});
});

S.register(/!\w+/, function(selector){
	var item = selector.substr(selector.indexOf('!') + 1).replace(/\s|\[|\]/g, '');

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
});

S.register(/^\[.+\]$/, function(selector){
	var	param = selector.replace(/\s|\[|\]/g, ''),
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
});