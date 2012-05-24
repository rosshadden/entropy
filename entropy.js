(function(window, undefined){
	var	entropy = function(selector){
		return new entropy.query(selector);
	};

	var	numObjects = 0;
	
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
		
		methods.query = function(select){
			select = select || '';
			
			if(typeof select === 'string'){
				if(select === '*'){
			 		this.push.apply(this, S._collection.slice());
			 		
			 		return this;
				}

				if(/^\[.+\]$/.test(select)){
					var param = select.replace(/\[|\]/g, '');

					var i, length = S._collection.length;
					for(i = 0; i < length; i++){
						if(S._collection[i].object[param]){
							this.push(S._collection[i]);
						}
					}

					return this;
				}
			}
			
			return this;
		};
		
		return query;
	})(entropy);
	
	window.entropy = window.S = entropy;
})(window);
