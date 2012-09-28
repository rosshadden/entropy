window.entropy = window.S = (function(){
	var Entity = Object.create(Function.prototype);

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

	utilities.createEntity = utilities.functionFactory(Entity);

	utilities.extend(Entity, {
		constructor: function(id, classes, contents){
			this['.set'] = [];

			//	If an ID was assigned,
			//	set that shit as toString.
			(!!id) && (this.toString = function(){
				return id;
			});
		},

		//	Called when you invoke the instance as a function.
		call: function(){
			return this;
		},

		toString: function(){
			return 'Entity';
		},

		create: utilities.createEntity,

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
				// this['.set'].push({
				// 	id: id,
				// 	classes: classes,
				// 	contents: contents
				// });

				var entity = Entity.create(id, classes, contents);
				this['.set'].push(entity);
			}else{
				throw new Error('Item with the given ID already exists.');
			}

			return this;
		},

		getSet: function(){
			return this['.set'];
		}
	});

	window.Entity = Entity;
	var entropy = Entity.create();

	entropy.version = 0.1;

	return entropy;
})();
