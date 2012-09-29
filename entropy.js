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

		copy: (function(){
			var root, current,
				path = [];

			return function(object, isNested){
				var i, output, length;

				if(!isNested){
					root = this;
				}

				if(Object.prototype.toString.call(object) === '[object Array]'){
					if(isNested){
						root['.manifest'][root['.manifest'].length - 1].type = 'array';
					}

					output = [];
					i = 0;
					length = object.length;

					for(; i < length; i++){
						root['.manifest'].push({
							name: i,
							path: path.slice(),
							type: typeof object[i],
							value: object[i]
						});

						path.push(i);

						output[i] = utilities.copy(object[i], true);

						path.pop();
					}

					return output;
				}

				if(typeof object === 'object'){
					output = {};

					for(i in object){
						root['.manifest'].push({
							name: i,
							path: path.slice(),
							type: typeof object[i],
							value: object[i]
						});

						path.push(i);

						output[i] = utilities.copy(object[i], true);

						path.pop();
					}

					return output;
				}

				return object;
			};
		})()
	};

	utilities.extend(Entity, {
		constructor: function(id, classes, contents){
			//	Setup unique properties.
			this['.isEntity'] = true;
			this['.set'] = [];
			this.id = '';
			this.classes = [];

			//	If an ID was assigned,
			//	set that shit as toString.
			(!!id) && (this.toString = function(){
				return id;
			});
		},

		//	Called when you invoke the instance as a function.
		//	This runs a query against the set of the instance.
		call: function(){
			return this.find.apply(this, arguments);
		},

		toString: function(){
			return 'Entity';
		},

		make: utilities.functionFactory(Entity),

		create: function(){
			var id, contents,
				classes = [];

			var args = Array.prototype.slice.call(arguments);

			var entity;

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
			if(doesExist){
				throw new Error('Item with the given ID already exists.');
			}

			//	Check if the item is already an Entity.
			var isEntity = typeof contents === 'function' && contents['.isEntity'];

			//	If it is not, make it one.
			//	Otherwise, dance profusely.
			if(isEntity){
				entity = contents;
			}else{
				entity = Entity.make(id, classes, contents);

				Object.defineProperty(entity, '.manifest', {
					value: [],
					enumerable: false,
					configurable: false
				});

				entity.set('id', id);
				entity.addClass(classes);
				entity.contents = utilities.copy.call(entity, contents);
			}

			return entity;
		},

		add: function(){
			var entity = Entity.create.apply(this, arguments);
			this['.set'].push(entity);

			return this;
		},

		find: function(selector){
			var self = this;

			var results = [];

			results.plugins = [];

			if(~[undefined, ''].indexOf(selector)){
				return results;
			}else{
				selector = selector.split(' ');

				selector.forEach(function(chunk, c){
					entropy['.plugins'].forEach(function(plugin, p){
						if(plugin.expression.test(chunk)){
							chunk = chunk.replace(plugin.expression, function(value){
								results.plugins.push({
									matches: results.slice.call(arguments).slice(0, -2),
									expression: plugin.expression,
									handler: plugin.handler
								});

								//	Just in case a plugin thinks it needs to consume?
								//	Not sure how I feel about this.  May remove.
								return (plugin.isConsuming) ? '' : value;
							});
						}
					});

					var	object,
						o = 0, length = self['.set'].length;
					for(; o < length; o++){
						object = self['.set'][o];

						if(results.plugins.length > 0 && results.plugins.every(function(plugin, p){
							if(plugin.handler.apply(object, [object.contents].concat(plugin.matches))){
								return true;
							}
						})){
							if(!~results.indexOf(object)){
								results.push(object);
							}
						}
					}
				});
			}

			var entity = this.make();
			entity.addClass('entropy results');

			results.forEach(function(result, r){
				entity.add(result);
			});

			// return results;
			return entity;
		},

		get: function(key){
			if(~['set', 'manifest'].indexOf(key)){
				key = '.' + key;
			}

			return this[key];
		},

		set: function(key, value){
			if(~['id'].indexOf(key)){
				this[key] = value;
			}

			return this;
		},

		attr: function(){
			var	action,
				args = Array.prototype.slice.call(arguments);

			if(args.length === 1){
				action = 'get';
			}else if(args.length === 2){
				action = 'set';
			}

			return this[action].apply(this, args);
		},

		addClass: function(){
			var	self = this,
				args = Array.prototype.slice.call(arguments);

			if(args.length === 1){
				if(args[0] instanceof Array){
					args = args[0];
				}else if(typeof args[0] === 'string'){
					args = args[0].split(' ');
				}
			}

			args.forEach(function(klass, k){
				if(!~self.classes.indexOf(klass)){
					self.classes.push(klass);
				}
			});

			return self;
		},

		removeClass: function(){
			var	index,
				self = this,
				args = Array.prototype.slice.call(arguments);

			args.forEach(function(klass, k){
				index = self.classes.indexOf(klass);

				if(~index){
					self.classes.splice(index, 1);
				}
			});

			return self;
		},

		toggleClass: function(klass){
			var	self = this,
				args = Array.prototype.slice.call(arguments);

			args.forEach(function(klass, k){
				if(!~self.classes.indexOf(klass)){
					self.addClass(klass);
				}else{
					self.removeClass(klass);
				}
			});

			return self;
		}
	});

	var entropy = (function(){
		var entropy = Entity.make();

		//	Give it something to write home about.
		entropy.set('id', 'root');
		entropy.addClass('root', 'entropy');

		//	Stuff unique to the entropic root.
		entropy.version = 0.2;
		entropy['.plugins'] = [];

		entropy.register = (function(){
			var plugins = entropy['.plugins'];

			//	Sort in descending length order.
			var sort = function(a, b){
				var lengthA = (''+a.expression).length,
					lengthB = (''+b.expression).length;

				if(lengthA < lengthB){
					return 1;
				}
				if(lengthA > lengthB){
					return -1;
				}
				return 0;
			};

			return function(expression, handler){
				plugins.push({
					expression: expression,
					handler: handler
				});

				plugins.sort(sort);
			};
		})();

		//	Aliases.
		entropy.Entity = Entity;

		return entropy;
	})();

	return entropy;
})();
