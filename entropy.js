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
				return destination;
			},

			copy: (function(){
				var root, current,
					path = [];

				return function(object, isNested){
					var i, response, length;

					if(!isNested){
						root = this;
					}

					if(window.HTMLElement && (!(object instanceof HTMLElement) && !(object instanceof Node)) || object && !object.nodeType){
						if(Object.prototype.toString.call(object) === '[object Array]'){
							response = [];
							i = 0;
							length = object.length;

							for(; i < length; i++){
								if(object === object[i]){
									continue;
								}

								path.push(i);

								if(window.HTMLElement && (!(object[i]  instanceof HTMLElement)) || object[i] && !object[i].nodeType){
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

								path.push(i);

								if(window.HTMLElement && !(object[i]  instanceof HTMLElement) || object[i] && !object[i].nodeType){
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
			},

			parseClasses: function(args){
				args = args || [];
				if(args.length === 1){
					if(args[0] instanceof Array){
						args = args[0];
					}else if(typeof args[0] === 'string'){
						args = args[0]
							.replace(/\s*\./g, ' ')
							.trim()
							.split(' ');
					}
				}
				return args;
			}
		};

		utilities.extend(Entity, {
			_length: 0,

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
				return this.find.apply(this, arguments);
			},

			//	This is mainly useful when playing with entropy in the console.
			toString: function(){
				return 'entity';
			},

			'.create': utilities.functionFactory(Entity),

			/**
			 * ##### create
			 *
			 * Makes a brand new Entity.
			 *
			 * Examples:
			 *
			 * 		S.create();
			 *
			 * @param {String} id
			 * @param {Array} classes
			 * @param {*} value
			 * @return {Entity} \[ \left\{ s \in S \right\} \]
			 */
			create: function(){
				var args = Array.prototype.slice.call(arguments);

				var	id = '',
					value = args[0] || {},
					classes = [];

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

				//	Check if the item is already an Entity.
				var isEntity = typeof value === 'function' && value['.isEntity'];

				//	If it is not, make it one.
				//	Otherwise, dance profusely.
				if(isEntity){
					entity = value;
				}else{
					//	Make the base entity.
					entity = Entity['.create']();

					//	Setup the usual suspects.
					entity
					.set('!id', id)
					.addClass(classes);

					//	If the item being added is added directly by an entity,
					//	we don't need to do the deep copy.
					if(value instanceof utilities.Item){
						entity['.key'] = value.key;

						value = value.value;
					}else{
						//	TODO:  Store the original object as a dotfile,
						//	and expose the copy with getters/setters that modify
						//	the original themselves.
						utilities.copy.call(entity, value);
					}

					entity['.value'] = value;
				}

				return entity;
			},

			//	Converts the value of an entity (which can be any data type)
			//	into Items and adds them to the entity's bag of entities.
			'.bake': function(){
				var item, key, value, shouldWeProceed;
				//	Only do this if the entity has no entities already, IE if this has not been run yet.
				if(this.size() === 0){
					for(key in this.get()){
						value = this.get(key);

						shouldWeProceed = this.get().hasOwnProperty(key);
						shouldWeProceed = shouldWeProceed && (typeof value !== 'string' || value.length > 1);

						if(shouldWeProceed){
							item = new utilities.Item(key, value);
							this.add(item);
						}
					}
				}
				return this;
			},

			/**
			 * Adds an item to an entity's list of entities.
			 */
			add: function(){
				var entity = this.create.apply(this, arguments)['.bake']();
				var index = this['.list'].push(entity) - 1;

				Object.defineProperty(this, index, {
					enumerable: true,

					get: function(){
						return entity;
					}
				});

				this._length += 1;
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
			remove: function(query){
			},

			//	Returns the size of the list.
			size: function(){
				return this.list().length;
			},

			//	Returns the index of the specified item in the list.
			indexOf: function(item){
			},

			//	Decides which plugins are relevant to the specified action and selector.
			_getRelevantPlugins: function(action){
				var args = Array.prototype.slice.call(arguments, 1);
				return entropy['.plugins'].filter(function(plugin, p){
					return plugin[action] && plugin.relevance.apply(plugin, args);
				});
			},

			//	Performs a single-level filter based on a query.
			filter: function(){
				var self = this,
					args = Array.prototype.slice.call(arguments);

				var results, parameters;
				if(typeof args[0] === 'function'){
					results = this.create();
					this.each(function(contents, e){
						parameters = [contents, e].concat(args.slice(1));
						if(args[0].apply(this, parameters)){
							results.add(this);
						}
					});
				}else{
					//	Get list of relevant plugins.
					var relevant = this._getRelevantPlugins.apply(this, ['filter'].concat(args));
					//	Build list of results.
					results = (relevant.length ? this : this.create());
					relevant.forEach(function(plugin, p){
						results = results.filter.apply(results, [plugin.filter].concat(plugin.matches));
						delete plugin.matches;
					});
				}

				return results;
			},

			//	Performs a deep-find on entity.
			//	Returns a new entity of entities matching a query.
			find: function(){
				var args = Array.prototype.slice.call(arguments);
				var self = this;

				// var results;
				// var runPlugin = function(plugin, action){
				// 	var addChildren = function(entity){
				// 		var filter = entity.filter.apply(entity, [plugin[action]].concat(plugin.matches));
				// 		results.addEach(filter.list());
				// 		entity.each(addChildren);
				// 	};
				// 	return addChildren;
				// };

				// //	Get list of relevant plugins.
				// var relevant = this._getRelevantPlugins.apply(this, ['find'].concat(args));
				// //	Build list of results.
				// results = this.create();
				// relevant.forEach(function(plugin, p){
				// 	var action = (typeof plugin.find === 'string') ? plugin.find : 'find';
				// 	runPlugin(plugin, action)(self);
				// 	delete plugin.matches;
				// });

				var results = this.create();
				var addChildren = function(){
					var filter = this.filter.apply(this, args);
					results.addEach(filter.list());
					this.each(addChildren);
				};
				addChildren.call(this);

				return results;
			},

			//	Traverses to an entity if it is the sole result of the passed query.
			goto: function(){
				var args = Array.prototype.slice.call(arguments);

				var entity,
					index = 0;
				if(args.length >= 1){
					if(typeof args[0] === 'object'){
						return this.create(args[0])['.bake']();
					}
					if(typeof args.slice(-1)[0] === 'number'){
						index = args.splice(-1)[0];
					}
				}

				if(args.length >= 1){
					entity = this.filter.apply(this, args);
				}else{
					entity = this;
				}

				if(entity.size() > index){
					return entity[index];
				}
				return false;
			},

			//	Returns whether an entity matches a given selector.
			matches: function(){
				var self = this,
					args = Array.prototype.slice.call(arguments);
				//	Get list of relevant plugins.
				var relevant = this._getRelevantPlugins.apply(this, ['filter'].concat(args));
				//	Build list of results.
				return relevant.some(function(plugin, p){
					return plugin.filter.apply(self, [self.get(), 0].concat(plugin.matches));
				});
			},

			//	Returns a specified property or key.
			get: function(key){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 0){
					//	Return entity's value.
					return this['.value'];
				}else if(args.length === 1){
					//	Get a whitelist of "magic" proeprties.
					if(/^!/.test(key)){
						key = key.substr(1);
						if(~['id', 'classes'].indexOf(key)){
							return this[key];
						}else if(~['key', 'list', 'index'].indexOf(key)){
							return this['.' + key];
						}
						return undefined;
					}
					//	Return a property on the current entity.
					return this['.value'] && this['.value'][key];
				}
			},

			//	Sets the given blacklisted property on the entity.
			set: function(key, value){
				var args = Array.prototype.slice.call(arguments);

				if(args.length === 1){
					this['.value'] = key;
				}

				if(args.length === 2){
					if(/^!/.test(key)){
						key = key.substr(1);
						//	Set a whitelist of "magic" properties.
						if(~['id'].indexOf(key)){
							this[key] = value;
						}else if(~['key'].indexOf(key)){
							this['.' + key] = value;
						}
					}else{
						//	Set a property on the entity's value.
						this['.value'][key] = value;
					}
				}

				return this;
			},

			//	Get a value from all children entities.
			map: function(key){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 0){
					//	Return an array of values of child entities.
					return this.map(function(entity){
						return entity.get();
					});
				}else if(args.length === 1){
					//	ES5 Array.map.
					if(typeof key === 'function'){
						return this.list().map(key, this);
					}
					//	Return an array of properties of child entities.
					return this.map(function(entity){
						return entity.get(key);
					});
				}

				return [];
			},

			//	Set a value from all children entities.
			setAll: function(key, value){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 2){
					//	Set properties on child entities.
					this.each(function(entity){
						return entity.set(key, value);
					});
				}

				return this;
			},

			//	Returns a copy of the internal list of entities.
			list: function(){
				return this.get('!list').slice();
			},

			//	Create a clone of the entity.
			clone: function(){
				var clone = this.create();
				this.each(function(entity, e){
					clone.add(entity);
				});
				return clone;
			},

			//	Adds class(es) (purely for convenience) to the entity.
			//	Accepts infinite arguments, space-delimited lists, or arrays.
			addClass: function(){
				var	self = this,
					args = Array.prototype.slice.call(arguments);

				args = utilities.parseClasses(args);
				args.forEach(function(klass, k){
					if(!~self.classes.indexOf(klass)){
						self.classes.push(klass);
					}
				});

				return this;
			},

			//	Removes class(es) from the entity.
			removeClass: function(){
				var	index,
					self = this,
					args = Array.prototype.slice.call(arguments);

				args = utilities.parseClasses(args);
				args.forEach(function(klass, k){
					index = self.classes.indexOf(klass);

					if(~index){
						self.classes.splice(index, 1);
					}
				});

				return self;
			},

			//	Adds/removes a class based on whether it is already present.
			toggleClass: function(){
				var	self = this,
					args = Array.prototype.slice.call(arguments);

				args = utilities.parseClasses(args);
				args.forEach(function(klass, k){
					if(!~self.classes.indexOf(klass)){
						self.addClass(klass);
					}else{
						self.removeClass(klass);
					}
				});

				return self;
			},

			//	Checks for the existence of a class.
			hasClass: function(){
				var self = this,
					args = Array.prototype.slice.call(arguments);

				args = utilities.parseClasses(args);
				return args.every(function(klass, k){
					return !!~self.classes.indexOf(klass);
				});
			},

			////////////////////////////////
			//	ES5 Corner.
			////////////////////////////////

			//	Calls a function for each entity in the list.
			each: function(){
				var args = Array.prototype.slice.call(arguments);
				var e, entity,
					length = this.size();
				for(e = 0; e < length; e++){
					entity = this[e];
					if(typeof args[0] === 'function'){
						args[0].call(entity, entity.get(), e);
					}
				}
				return this;
			},

			//	Returns true if every entity in this entity satisfies the provided testing function.
			every: function(){
				var args = Array.prototype.slice.call(arguments);
				var e, entity,
					length = this.size();
				for(e = 0; e < length; e++){
					entity = this[e];
					if(typeof args[0] === 'function' && !args[0].call(entity, entity.get(), e)){
						return false;
					}
					if(!entity.matches.apply(entity, args)){
						return false;
					}
				}
				return true;
			},

			//	Returns true if at least one entity in this entity satisfies the provided testing function.
			some: function(){
				var args = Array.prototype.slice.call(arguments);
				var e, entity,
					length = this.size();
				for(e = 0; e < length; e++){
					entity = this[e];
					if(typeof args[0] === 'function' && args[0].call(entity, entity.get(), e)){
						return true;
					}
					if(entity.matches.apply(entity, args)){
						return true;
					}
				}
				return false;
			}

			/*//	Apply a function simultaneously against two entities of the entity (from left-to-right) as to reduce it to a single value.
			reduce: function(){
				var args = Array.prototype.slice.call(arguments);
				return this.list().reduce.apply(this.list(), args);
			}*/
		});

		////////////////////////////////
		//	Aliases.
		////////////////////////////////
			//	Filesystem metaphor.
			// Entity.find;
			Entity.grep = Entity.filter;
			Entity.cd = Entity.goto;
			Entity.ls = Entity.list;
			Entity.cp = Entity.clone;
			Entity.rm = Entity.remove;
			Entity.make = Entity.create;
			//	Other.
			Entity.has = Entity.some;

		var entropy = (function(){
			var entropy = Entity.create();

			//	Give it something to write home about.
			entropy
			// .set('!id', 'root')
			// .addClass('root', 'entropy');

			//	Stuff unique to the entropic root.
			entropy.VERSION = 0.602;
			entropy['.plugins'] = [];
			entropy['.adapters'] = [];
			entropy.utilities = utilities;

			entropy.register = (function(){
				var plugins = entropy['.plugins'];

				var defaults = {
					name: '',
					expression: false,
					type: 'string',

					filter: function(){ return false; },
					find: 'filter',
					goto: 'filter',

					relevance: function(){
						var args = Array.prototype.slice.call(arguments);
						var self = this;
						this.matches = [];
						if(~['string', 'number'].indexOf(this.type)){
							if(typeof args[0] === this.type && this.expression && this.expression.test(args[0])){
								(''+args[0]).replace(this.expression, function(value){
									self.matches = Array.prototype.slice.call(arguments).slice(0, -2);
									return;
								});
								return true;
							}
						}else{
							return this.type === typeof args[0];
						}
						return false;
					}
				};

				return function(parameters){
					var options = utilities.copy(defaults);
					plugins.push(utilities.extend(options, parameters));

					return entropy;
				};
			})();

			//	Accessibility alias.
			entropy.Entity = Entity;

			return entropy;
		})();

		return entropy;
	})();

	//	Assign globally, whether in a browser or node.js.
	if(typeof module !== 'undefined' && typeof require !== 'undefined'){
		module.exports = entropy;
	}else{
		window.entropy = window.S = entropy;
	}
})();
