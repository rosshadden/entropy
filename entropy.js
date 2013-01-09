(function(){
	var entropy = (function(){
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
							if(isNested){
								root['.manifest'][root['.manifest'].length - 1].type = 'array';
							}

							response = [];
							i = 0;
							length = object.length;

							for(; i < length; i++){
								if(object === object[i]){
									continue;
								}

								root['.manifest'].push({
									key: i,
									path: path.slice(),
									type: typeof object[i],
									value: object[i]
								});

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

								if(object.hasOwnProperty(i)){
									root['.manifest'].push({
										key: i,
										path: path.slice(),
										type: typeof object[i],
										value: object[i]
									});
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
			constructor: function(id, classes, value){
				//	Setup unique properties.
				Object.defineProperty(this, '.isEntity', {
					value: true,
					writable: false,
					enumerable: false,
					configurable: false
				});

				Object.defineProperty(this, '.list', {
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
				//	Note that I am doing the typeof undefined check in case value is boolean.
				this['.value'] = (typeof value !== 'undefined') ? value : {};
			},

			//	Called when you invoke the instance as a function.
			//	This runs a query against the list of the instance.
			call: function(){
				return this.filter.apply(this, arguments);
			},

			//	This is mainly useful when playing with entropy in the console.
			toString: (function(){
				var buildString = function(item, i){
					var string = '';

					if(item.get('!id')){
						string = '#' + item.get('!id');
					}

					if(item.get('!key')){
						string += '~' + item.get('!key');
					}

					if(item.value() instanceof Array){
						string += '@array';
					}else{// if(typeof item.value() !== 'object'){
						string += '@' + typeof item.value();
					}

					item.classes.forEach(function(klass, c){
						string += '.' + klass;
					});

					return string;
				};

				return function(){
					var	items = this.list().map(buildString);

					var string = buildString(this);
					if(items.length){
						string += ': [\n\n' + items.join(', ') + '\n\n]';
					}
					return string;
				};
			})(),

			//	Makes a brand new Entity.
			'.make': utilities.functionFactory(Entity),

			//	Converts the value of an entity (which can be any data type)
			//	into Items and adds them to the entity's bag of entities.
			bake: function(){
				var item;
				if(this.size() === 0){
					for(var key in this.value()){
						if(this.value().hasOwnProperty(key)){
							item = new utilities.Item(key, this.value()[key]);

							this.add(item);
						}
					}
				}

				return this;
			},

			//	Creates an entity.
			//	Honestly, I forget why this is different than s.make,
			//	but this calls s.make.
			create: function(){
				var	id = '',
					value = {},
					classes = [];

				var args = Array.prototype.slice.call(arguments);

				var entity;

				//	Adds an empty object (for some reason?).
				if(args.length === 0){}

				//	Adds the passed in object, with no ID or classes.
				if(args.length === 1){
					value = args[0];
				}

				//	Adds an object with an ID.
				if(args.length === 2){
					value = args[1];
					//	Has a configuration object.
					if(typeof args[0] === 'object' && typeof args[1] === 'object'){
						id = args[0].id || id;
						classes = args[0].classes || classes;

						if(/^\/\w+$/.test(id)){
							id = value[id.substr(1)] || id;
						}

						if(/^\/\w+$/.test(classes)){
							classes = typeof value[classes.substr(1)] === 'string' && value[classes.substr(1)].replace(' ', '-') || classes;
						}
					}else{
						id = args[0];
					}
				}

				//	Adds an object with an ID and some classes.
				if(args.length === 3){
					id = args[0];
					classes = args[1];
					value = args[2];
				}

				//	Standardize classes.
				if(typeof classes === 'string'){
					classes = classes.split(' ');
				}

				//	Check for existence of a duplicate ID.
				var doesExist = this.list().some(function(item){
					return (id === '') ? false : id === item.id;
				});

				//	If ID does not exist in the set, bitch about it.
				if(doesExist){
					throw new Error('Entropy:  Item with the given ID already exists.');
				}

				//	Check if the item is already an Entity.
				var isEntity = typeof value === 'function' && value['.isEntity'];

				//	If it is not, make it one.
				//	Otherwise, dance profusely.
				if(isEntity){
					entity = value;
				}else{
					//	Make the base entity.
					entity = Entity['.make']();

					//	Setup the usual suspects.
					entity
					.adapt()
					.set('!id', id)
					.addClass(classes);

					//	If the item being added is added directly by an entity,
					//	we don't need to do the deep copy for the manifest.
					if(value instanceof utilities.Item){
						//	If possible, we copy the manifest from the parent,
						//	starting at the relevant level and with the relevant items.
						/*this.get('manifest').forEach(function(item, i){
							if(item.path.length === 0){
								if(item.key == value.key){
								}
							}else if(item.path[0] === value.key){
								//	BUG:  S[7][0].get('manifest');
								// entity.get('manifest').push(item.path.slice(1));
							}
						});*/

						entity['.key'] = value.key;

						value = value.value;
					}else{
						//	TODO:  Store the original object as a dot-file,
						//	and expose the copy with getters/setters that modify
						//	the original themselves.
						// value = utilities.copy.call(entity, value);
						utilities.copy.call(entity, value);
					}

					entity['.value'] = value;
				}

				return entity;
			},

			//	Apply adapters to the entity.
			adapt: (function(){
				var entity;
				var adaptation = function(adapter, a){
					if(!(adapter.name in entity)){
						entity[adapter.name] = adapter.adaptation.call(entity);
					}
				};

				return function(adapter){
					entity = this;
					//	If an adapter was passed, just add that specific one.
					if(typeof adapter !== 'undefined'){
						adaptation(adapter);
					//	Otherwise, add all adapters.
					}else{
						entropy['.adapters'].forEach(adaptation);
					}
					return this;
				};
			})(),

			/**
			 * Adds an item to an entity's list of entities.
			 */
			add: function(){
				var entity = this.create.apply(this, arguments);
				var index = this.list().push(entity) - 1;

				Object.defineProperty(this, index, {
					enumerable: true,

					get: function(){
						return entity.bake();
					}
				});

				return this;
			},

			/*
			 * Adds each item in a given array to an item's list of entities.
			 *
			 * This can take an optional configuration object as a first parameter,
			 * which can list certain properties like id and classes on each item.
			 *
			 * These properties can take a dynamic value like '/asdf' to make the value depend on the property specified.
			 */
			addEach: function(){
				var args = Array.prototype.slice.call(arguments);

				var	items,
					config = false;

				if(args.length === 1){
					items = args[0];
				}

				if(args.length === 2){
					config = args[0];
					items = args[1];
				}

				if(typeof items === 'object'){
					var item;
					for(var i in items){
						item = items[i];
						if(items.hasOwnProperty(i)){
							if(!(item instanceof Array)){
								item = [item];
							}

							if(config !== false){
								item = [config].concat(item);
							}

							this.add.apply(this, item);
						}
					}
				}

				return this;
			},

			//	Removes an item from an entity's list.
			//	TODO:  This doesn't update entity[n].
			remove: function(query){
				if(typeof query === 'number'){
					this.list().splice(query, 1);
				}else if(typeof query === 'string'){
					this.list().forEach(function(entity, e){
						if(entity.id === query){
							this.list().splice(e, 1);
						}
					});
				}
			},

			//	Returns the size of the list.
			size: function(){
				return this.list().length;
			},

			//	Returns the index of the specified item in the list.
			indexOf: function(item){
				return this.list().indexOf(item);
			},

			//	Returns a new entity of entities matching a query.
			filter: function(){
				var self = this;

				var args = Array.prototype.slice.call(arguments),
					relevant = [];

				var result = self['.make']();
				result
				.adapt()
				.addClass('entropy results');

				relevant = entropy['.plugins'].filter(function(plugin, p){
					return plugin.relevance.call(plugin, args);
				});

				var plugin,
					p, length = relevant.length;
				for(p = 0; p < length; p++){
					plugin = relevant[p];
					result = plugin.filter.call(plugin, result, args, this);
				}

				return result;
			},

			//	Returns an entity traversed to by a query.
			find: function(){
				var self = this;

				var args = Array.prototype.slice.call(arguments),
					relevant = [];

				var result = self['.make']();
				result
				.adapt()
				.addClass('entropy results');

				relevant = entropy['.plugins'].filter(function(plugin, p){
					return plugin.setCategory('find').relevance.call(plugin, args);
				});

				var plugin,
					p, length = relevant.length;
				for(p = 0; p < length; p++){
					plugin = relevant[p];
					result = plugin.find.call(plugin, result, args, this);
				}

				return result;
			},

			value: function(){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 0){
					//	Return entity's value.
					return this['.value'];
				}else if(args.length === 1){
					//	Return a property on the current entity.
					return this['.value'][args[0]];
				}else if(args.length === 2){
					//	Set a property on the entity.
					this['.value'][args[0]] = args[1];
				}

				return this;
			},

			values: function(){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 0){
					//	Return an array of values of child entities.
					return this.map(function(element){
						return element.value();
					});
				}else if(args.length === 1){
					//	Return an array of properties of child entities.
					return this.map(function(element){
						return element.value(args[0]);
					});
				}else if(args.length === 2){
					//	Set properties on child entities.
					this.each(function(element){
						return element.value(args[0], args[1]);
					});
				}

				return this;
			},

			//	Returns a specified property or key.
			get: function(key){
				if(typeof key === 'undefined'){
					return this.values();
				//	Return property on the current entity.
				//	Return a magic property on the current entity.
				}else if(/^!/.test(key)){
					key = key.substr(1);
					if(~['id'].indexOf(key)){
						return this[key];
					}else if(~['value', 'key', 'list'].indexOf(key)){
						return this['.' + key];
					}
				}
				return this.value(key);
			},

			//	Sets the given blacklisted property on the entity.
			set: function(key, value){
				var args = Array.prototype.slice.call(arguments);

				if(args.length === 1){
					this['.value'] = args[0];
				}

				if(args.length === 2){
					if(/^!/.test(key)){
						key = key.substr(1);
						if(~['id'].indexOf(key)){
							this[key] = value;
						}else if(~['value', 'key', 'list'].indexOf(key)){
							this['.' + key] = value;
						}
					}
				}

				return this;
			},

			//	Returns a copy of the internal list.
			list: function(){
				return this.get('!list');
			},

			//	Returns whether or not an entity meets a query.
			has: function(){
				return this.apply(this, arguments).size() > 0;
			},

			//	Sorts the list of entities by id.
			//	Optionally accepts a sorting function.
			sort: function(sorter){
				sorter = (typeof sorter === 'function') ? sorter : function(one, two){
					if(one.id && two.id){
						if(one.id < two.id){ return -1; }
						if(one.id > two.id){ return 1; }
					}
					return 0;
				};

				this.list().sort(sorter);

				return this;
			},

			//	Loops through each item in the list,
			//	accepting either a function or function name.
			each: function(){
				var args = Array.prototype.slice.call(arguments);

				if(typeof args[0] === 'function'){
					this.list().forEach(args[0], this);
				}else if(typeof args[0] === 'string'){
					this.list().forEach(function(item, i){
						item[args[0]].apply(item, args.slice(1));
					});
				}

				return this;
			},

			//	Returns an array based on a passed-in function.
			map: function(){
				var args = Array.prototype.slice.call(arguments);

				if(typeof args[0] === 'function'){
					return this.list().map(args[0], this);
				}

				return [];
			},

			//	Adds a class (purely for convenience) to the entity.
			//	Accepts infinite arguments, space-delimited lists, or arrays.
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

			//	Removes a class from the entity.
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

			//	Adds/removes a class based on whether it is already present.
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
			var entropy = Entity['.make']();

			//	Give it something to write home about.
			entropy
			.set('!id', 'root')
			.addClass('root', 'entropy');

			//	Stuff unique to the entropic root.
			entropy.VERSION = 0.502;
			entropy['.plugins'] = [];
			entropy['.adapters'] = [];

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

				return function(options){
					plugins.push({
						name: options.name || '',
						type: options.type || 'string',
						args: options.args || 1,
						expression: options.expression || false,
						numResults: options.numResults || 'n',

						category: 'filter',
						setCategory: function(category){
							this.category = category;
							return this;
						},
						current: 'filter',
						setCurrent: function(current){
							this.current = current;
							return this;
						},

						parser: options.parser || function(){ return true; },

						relevance: options.relevance || function(args){
							var self = this;

							//	This obviously looks shit-tastic.
							//	I wanted to write it like this first because it was so effing complex.
							//	TODO:  Make this a single `return (boolean);` type shindig.
							if(this[this.category] && args.length === this.args){
								if(this.args === 1){
									if(typeof args[0] === this.type){
										if(this.expression){
											if(this.expression.test(args[0])){
												args[0].replace(this.expression, function(value){
													self.matches = Array.prototype.slice.call(arguments).slice(0, -2);
													return;
												});

												return true;
											}else{
												return false;
											}
										}else{
											return true;
										}
									}else{
										return false;
									}
								}else{
									return true;
								}
							}else{
								return false;
							}
						},

						filter: options.filter || function(results, args, entity){
							var isSingular = false;

							var	object,
								o = 0, length = entity.size();
							for(; o < length; o++){
								object = entity.list()[o];

								var parserArgs = [object.value()];
								if(this.matches){
									parserArgs = parserArgs.concat(this.matches);
								}

								if(this.parser.apply(object, parserArgs)){
									if(!~results.indexOf(object)){
										results.add(object);
									}

									if(this.numResults === 1){
										isSingular = true;
										break;
									}
								}
							}

							//	Return results.
							//	If the selector wishes there to be one result,
							//	we just return the first one.
							if(isSingular){
								return results[0];
							}else{
								return results;
							}

							return results;
						},

						find: options.find || false
					});

					plugins.sort(sort);

					return entropy;
				};
			})();

			entropy.adapter = (function(){
				var adapters = entropy['.adapters'];

				return function(name, adaptation){
					var adapter = {
						name: name,
						adaptation: adaptation
					};

					adapters.push(adapter);
					entropy.adapt(adapter);

					return entropy;
				};
			})();

			//	Accessibility alias.
			entropy.Entity = Entity;

			return entropy;
		})();

		return entropy;
	})();

	if(typeof module !== 'undefined' && typeof require !== 'undefined'){
		module.exports = entropy;
	}else{
		window.entropy = window.S = entropy;
	}
})();
