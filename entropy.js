(function(window, undefined){
	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0;

	entropy.version = 0.01;
	
	entropy._collection = [];
	
	entropy.create = function(prototype, values){
		var	object = Object.create(prototype, values),
			init = object.init || function(){};

		var	wrap = {
			object: object,

			init: function(){
				entropy._collection.push(this);
				
				init.call(this);
			}
		};

		numObjects += 1;
		
		entropy._collection.push(wrap);
		
		return wrap;
	};
	
	entropy.query = (function(S){
		var	query = function(selector){
			this.query(selector);
		}
		
		var	methods = query.prototype = new Array;
		
		methods.query = function(selector){
			selector = selector || '';
			
			if(typeof selector === 'string'){
				if(selector === '*'){
			 		this.push.apply(this, S._collection.slice());
			 		
			 		return this;
				}

				if(/^\[.+\]$/.test(selector)){
					var	param = selector.replace(/\s|\[|\]/g, ''),
						parts = param.split('=');

					var i, length = S._collection.length;
					for(i = 0; i < length; i++){
						if(
							parts.length === 1 && S._collection[i].object[parts[0]]
						||	parts.length === 2 && S._collection[i].object[parts[0]] === parts[1]
						){
							this.push(S._collection[i]);
							continue;
						}
					}

					return this;
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
		};

		methods.run = function(){
			var args = Array.prototype.slice.call(arguments),
				method = args.splice(0, 1);

			this.forEach(function(item, i){
				if(item.object[method]){
					item.object[method].apply(item.object, args);
				}
			});
		};
		
		return query;
	})(entropy);
	
	window.entropy = window.S = entropy;
})(window);
