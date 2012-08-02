(function(window, undefined){
	'use strict';

	var	entropy = function(){};

	var	numObjects = 0;

	entropy.version = 0.01;

	entropy._collection = [];

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

		var copy = this._collection.push(this.copy(object));

		numObjects += 1;

		return this._collection[copy - 1];
	};

	entropy.list = function(){
		return this._collection;
	};

	entropy.copy = (function(){
		var root, current;

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

					root = object;
				}

				for(i in object){
					output[i] = this.copy(object[i], true);
				}

				return output;
			}

			return object;
		};
	})();

	window.entropy = window.S = entropy;
})(window);
