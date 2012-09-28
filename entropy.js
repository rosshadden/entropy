window.entropy = window.S = (function(){
	var utilities = {
		functionFactory: function(proto){
			return function(){
				var f = function(){
					return f.call.apply(f, arguments);
				};

				Object.keys(proto).forEach(function(key){
					f[key] = proto[key];
				});

				f.constructor.apply(f, arguments);

				return f;
			};
		},

		extend: function(dest, source){
			Object.getOwnPropertyNames(source).forEach(function(key){
				dest[key] = source[key];
			});
		}
	};

	var Entity = Object.create(Function.prototype);

	utilities.extend(Entity, {
		constructor: function(){
			this['.set'] = [];
		},

		call: function(){
			//	This get's called when you invoke the "function" that is the instance.
			return this;
		},

		toString: function(){
			return 'Entity';
		},

		create: utilities.functionFactory(Entity),

		add: function(what){
			this['.set'].push(what);

			return this;
		},

		print: function(){
			console.log('set:', this['.set']);

			return this;
		}
	});

	var entropy = Entity.create();

	entropy.version = 0.1;
	entropy.create = Entity;

	return entropy;
})();
