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
		},

		array: Array.prototype
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

		add: function(){
			var id, contents,
				classes = [];

			var args = Array.prototype.slice.call(arguments);

			//	Adds an empty object (for some reason?).
			if(args.length === 0){
				id = '';
				contents = {};
			}

			//	Adds the passed in object, with no ID or classes.
			if(args.length === 1){
				id = '';
				contents = args[0];
			}

			//	Adds an object with an ID.
			if(args.length === 2){
				id = args[0];
				contents = args[1];
			}

			//	Adds an object with an ID and some classes.
			if(args.length === 3){
				id = args[0];
				classes = args[1];
				contents = args[2];

				if(typeof classes === 'string'){
					classes = classes.split(' ');
				}
			}

			//	Check for existence of a duplicate ID.
			var doesExist = this['.set'].some(function(item){
				return (id === '') ? false : id === item.id;
			});

			//	If ID does not exist in the set, add it.
			//	Otherwise, bitch about it.
			if(!doesExist){
				this['.set'].push({
					id: id,
					classes: classes,
					contents: contents
				});
			}else{
				throw new Error('Item with the given ID already exists.');
			}

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
