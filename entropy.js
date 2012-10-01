window.entropy = window.S = (function(){
	'use strict';

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
				var i, response, length;

				if(!isNested){
					root = this;
				}

				if(Object.prototype.toString.call(object) === '[object Array]'){
					if(isNested){
						root['.manifest'][root['.manifest'].length - 1].type = 'array';
					}

					response = [];
					i = 0;
					length = object.length;

					for(; i < length; i++){
						root['.manifest'].push({
							key: i,
							path: path.slice(),
							type: typeof object[i],
							value: object[i]
						});

						path.push(i);

						response[i] = utilities.copy(object[i], true);

						path.pop();
					}

					return response;
				}

				if(typeof object === 'object'){
					response = {};

					for(i in object){
						root['.manifest'].push({
							key: i,
							path: path.slice(),
							type: typeof object[i],
							value: object[i]
						});

						path.push(i);

						response[i] = utilities.copy(object[i], true);

						path.pop();
					}

					return response;
				}

				return object;
			};
		})(),

		Item: function(key, value){
			this.key = key;
			this.value = value;
		}
	};

	utilities.extend(Entity, {
		constructor: function(id, classes, contents){
			//	Setup unique properties.
			Object.defineProperty(this, '.isEntity', {
				value: true,
				writable: false,
				enumerable: false,
				configurable: false
			});

			Object.defineProperty(this, '.set', {
				value: [],
				writable: false,
				enumerable: false,
				configurable: false
			});

			Object.defineProperty(this, '.manifest', {
				value: [],
				writable: false,
				enumerable: false,
				configurable: false
			});

			//	These are set if the relelvant arguments are passed,
			//	though I prefer to call Entity['.make']() without arguments,
			//	and set them afterward.
			this.id = (typeof id !== 'undefined') ? id : 'Entity';
			this['.key'] = '';
			//	TODO:  This should parse classes instead of assuming array.
			this.classes = (typeof classes !== 'undefined') ? classes : [];
			//	Note that I am doing the typeof undefined check in case contents is boolean.
			this.contents = (typeof contents !== 'undefined') ? contents : {};
		},

		//	Called when you invoke the instance as a function.
		//	This runs a query against the set of the instance.
		call: function(){
			return this.find.apply(this, arguments);
		},

		toString: function(){
			var	items = [];

			this.get('set').forEach(function(item, i){
				var string = '';

				if(item.get('id') !== 'Entity'){
					string = '#' + item.get('id');
				}

				if(item.get('key')){
					string += '~' + item.get('key');
				}

				if(item.contents instanceof Array){
					string += '@Array';
				}else if(typeof item.contents !== 'object'){
					string += '@' + typeof item.contents;
				}

				item.classes.forEach(function(klass, c){
					string += '.' + klass;
				});

				items.push(string);
			});

			return this.id + ':[' + items.join(', ') + ']';
		},

		'.make': utilities.functionFactory(Entity),

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
				entity = Entity['.make']();

				entity.set('id', id);
				entity.addClass(classes);

				//	If the item being added is added directly by an entity,
				//	we don't need to do the deep copy for the manifest.
				if(contents instanceof utilities.Item){
					//	If possible, we copy the manifest from the parent,
					//	and starting at the relevant level and with the relevant items.
					this['.manifest'].forEach(function(item, i){
						if(item.path.length === 0){
							if(item.key == contents.key){
							}
						}else if(item.path[0] === contents.key){
							//	BUG:  S.get(7).get(0).get('manifest');
							// entity['.manifest'].push(item.path.slice(1));
						}
					});

					entity['.key'] = contents.key;

					contents = contents.value;
					contents = utilities.copy.call(entity, contents);
				}else{
					contents = utilities.copy.call(entity, contents);
				}

				entity.contents = contents;
			}

			return entity;
		},

		add: function(){
			var entity = Entity.create.apply(this, arguments);
			var index = this['.set'].push(entity) - 1;

			Object.defineProperty(this, index, {
				enumerable: true,

				get: function(){
					var item;

					if(entity.list().length === 0){
						for(var key in entity.contents){
							item = new utilities.Item(key, entity.contents[key]);

							entity.add(item);
						}
					}

					return entity;
				}
			});

			return this;
		},

		//	Removes an item from a set.
		//	TODO:  This doesn't update entity[n].
		remove: function(query){
			if(typeof query === 'number'){
				this['.set'].splice(query, 1);
			}else if(typeof query === 'string'){
				this['.set'].forEach(function(entity, e){
					if(entity.id === query){
						this['.set'].splice(e, 1);
					}
				});
			}
		},

		find: function(query){
			var self = this;

			var results = [],
				isSingular = false;

			results.plugins = [];

			if(!~[undefined, ''].indexOf(query)){
				query = query.split(' ');

				query.forEach(function(chunk, c){
					entropy['.plugins'].forEach(function(plugin, p){
						if(plugin.expression.test(chunk)){
							chunk = chunk.replace(plugin.expression, function(value){
								results.plugins.push({
									matches: results.slice.call(arguments).slice(0, -2),
									expression: plugin.expression,
									handler: plugin.handler,
									results: plugin.results
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
								if(plugin.results === 1){
									isSingular = true;
								}

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

			var entity = this['.make']();
			entity.addClass('entropy results');

			results.forEach(function(result, r){
				entity.add(result);
			});

			//	Return results.
			//	If the selector wishes there to be one result,
			//	we just return the first one.
			if(isSingular){
				return entity[0];
			}else{
				return entity;
			}
		},

		get: function(key){
			var item;

			if(~['set', 'manifest', 'key'].indexOf(key)){
				key = '.' + key;
			}

			if(typeof key === 'undefined'){
				return this.contents;
			}

			return this[key];
		},

		set: function(key, value){
			if(~['id'].indexOf(key)){
				if(!value){
					value = 'Entity';
				}

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

		list: function(){
			return this.get('set');
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
		},

		has: function(query){
			return this['.manifest'].some(function(item, i){
				return query === item.key;
			});
		},

		children: function(type){
			var	item,
				response = [];

			for(var child in this.contents){
				if(~['key', 'keys'].indexOf(type)){
					item = child;
				}else if(~['value', 'values'].indexOf(type)){
					item = this.contents[child];
				}else if(~['', undefined, 'extract'].indexOf(type)){
					item = {
						key: child,
						value: this.contents[child]
					};
				}else{
					throw new Error('Your parameter is retarded.');
				}

				response.push(item);
			}

			return response;
		},

		keys: function(){
			return this.children('key');
		},

		values: function(){
			return this.children('value');
		},

		extract: function(){
			return this.children('extract');
		},

		//	TEMP:  The general idea behind this will be used later.
		findInManifest: function(query){
			return this['.manifest'].filter(function(item, i){
				return query === item.key;
			});
		}
	});

	var entropy = (function(){
		var entropy = Entity['.make']();

		//	Give it something to write home about.
		entropy.set('id', 'root');
		entropy.addClass('root', 'entropy');

		//	Stuff unique to the entropic root.
		entropy.version = 0.3;
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

			return function(expression, handler, results){
				plugins.push({
					expression: expression,
					handler: handler,
					results: results || 'n'
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
