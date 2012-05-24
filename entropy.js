(function(window, undefined){
	var entropy = function(selector){
		return new entropy.query(selector);
	};

	var numObjects = 0;
	
	entropy._collection = [];
	
	entropy.create = function(prototype, values){
		var object = Object.create(prototype, values);
		
		var init = object.init || function(){};

		var wrap = {
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
	
	entropy.query = (function(entropy){
		var query = function(selector){
			this.query(selector);
		}
		
		var methods = query.prototype = new Array;
		
		methods.query = function(select){
			select = select || '';
			
			if(typeof select === 'string'){
				if(select === '*'){
			 		this.push.apply(this, entropy._collection.slice());
			 		
			 		return this;
				}
			}
			
			return this;
		};
		
		return query;
	})(entropy);
	
	window.entropy = window.S = entropy;
})(window);
