window.entropy = window.S = (function(){
	'use strict';

	var Entity = Object.create(Function.prototype);

	var utilities = {
		functionFactory: function(prototype){
			return function(){
				var f = function(){
					return f.call.apply(f, arguments);
				};

				Object.keys(prototype).forEach(function(key){
					f[key] = prototype[key];
				});

				f.constructor.apply(f, arguments);

				return f;
			};
		},

		extend: function(destination, source){
			Object.getOwnPropertyNames(source).forEach(function(key){
				destination[key] = source[key];
			});
		},

		copy: (function(){
			var root, current,
				path = [];

			return function(object, isNested){
				var i, response, length;

				if(!isNested){
					root = this;
				}

				if(!(object instanceof HTMLElement) && !(object instanceof Node)){
					if(Object.prototype.toString.call(object) === '[object Array]'){
						response = [];
						i = 0;
						length = object.length;

						for(; i < length; i++){
							if(object === object[i]){
								continue;
							}

							path.push(i);

							if(!(object[i]  instanceof HTMLElement)){
								response[i] = utilities.copy(object[i], true);
							}else{
								response[i] = object[i];
							}

							path.pop();
						}

						return response;
					}

					if(typeof object === 'object'){
						response = {};

						for(i in object){
							if(object === object[i]){
								continue;
							}

							if(!(object[i]  instanceof HTMLElement)){
								response[i] = utilities.copy(object[i], true);
							}else{
								response[i] = object[i];
							}
						}

						return response;
					}
				}

				return object;
			};
		})(),

		Item: function(key, value){
			this.key = key;
			this.value = value;
		}
	};

	var entropy = (function(){
		var entropy = {};

		return entropy;
	})();

	return entropy;
})();
