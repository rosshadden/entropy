(function(){
	var entropy = (function(){
		'use strict';

		//	Subtype Function.
		var Entity = Object.create(Function.prototype);

		//	Subtype Array.
		var Set = function(values){
			var instance = (typeof values === 'number') ? new Array(values) : new Array();
			instance.__proto__ = Set.prototype;
			if(typeof values === 'object'){
				for(var item in values){
					instance.add(values[item]);
				}
			}
			return instance;
		};
		Set.prototype = Object.create(Array.prototype);

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
					Object.defineProperty(
						destination,
						key,
						Object.getOwnPropertyDescriptor(source, key)
					);
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
						if(Array.isArray(object)){
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
			},

			sort: function(){
				var args = Array.prototype.slice.call(arguments);

				var sort = function(left, right, options){
					var temp = {};
					var areStrings = typeof left === 'string' && typeof right === 'string';
					var areNumbers = typeof left === 'number' && typeof right === 'number';

					if(options.expression && areStrings){
						left = left.replace(options.expression, '');
						right = right.replace(options.expression, '');
					}

					if(options.numeric && areStrings){
						temp.left = parseInt(left.replace(/[$,]/g, '').match(/^\d+/));
						temp.right = parseInt(right.replace(/[$,]/g, '').match(/^\d+/));
						if(!isNaN(temp.left)) left = temp.left;
						if(!isNaN(temp.right)) right = temp.right;
					}

					if(options.ignoreCase && areStrings){
						left = left.toLowerCase();
						right = right.toLowerCase();
					}

					return (left < right) ? -1 : (left > right) ? 1 : 0;
				};

				var options = {};
				if(typeof args[args.length - 1] === 'object'){
					options = args.splice(-1, 1)[0];
				}

				if(args.length === 0){
					return function(left, right){
						return sort(left, right, options);
					};
				}

				var left, right;
				return function(a, b){
					var results = args.map(function(property, p){
						left = a[property];
						right = b[property];

						return sort(left, right, options);
					});

					for(var r = 0; r < results.length; r++){
						if(results[r] !== 0) return results[r];
					}

					return 0;
				};
			}
		};

		var __eid__ = -1;
		utilities.extend(Entity, {
			constructor: function(){
				var args = Array.prototype.slice.call(arguments);

				//	Setup unique properties.
				this.index = -1;
				Object.defineProperty(this, '.eid', {
					value: ++__eid__,
					writable: false,
					enumerable: false,
					configurable: false
				});
				var set = (args[0] && args[0]['.type'] === 'set') ? args[0] : new Set();
				Object.defineProperty(this, '.set', {
					value: set,
					writable: false,
					enumerable: false,
					configurable: false
				});
				Object.defineProperty(this, '.parents', {
					value: new Set(),
					writable: false,
					enumerable: false,
					configurable: false
				});
				Object.defineProperty(this, '.type', {
					get: function(){
						return 'entity';
					}
				});

				/*
				 * ##### size
				 *
				 * Returns the size of the set.
				 */
				Object.defineProperty(this, 'size', {
					get: function(){
						return this.get('!set').size;
					}
				});

				//	Defaults.
				this.id = '';
				this['.key'] = '';
				this.classes = [];
				this['.value'] = {};
			},

			//	Called when you invoke the instance as a function.
			//	This runs a query against the set of the instance.
			call: function(){
				return this.filter.apply(this, arguments);
			},

			//	This is mainly useful when playing with entropy in the console.
			toString: (function(){
				var buildString = function(item){
					var string = 'e';
					if(item.size === 0){
						string = '∅';
					}

					var id = item.id,
						key = item.get('!key'),
						value = item.get();
					if(id){
						string += '#' + id;
					}
					if(key){
						string += '~' + key;
					}
					string += item.classes.reduce(function(list, klass){
						return list += '.' + klass;
					}, '');

					return string;
				};

				return function(){
					var string = buildString(this);
					if(this.size){
						var items = this.map(buildString);
						string += ':[' + items.join(', ') + ']';
					}
					return string;
				};
			})(),

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
				var isEntity = typeof value === 'function' && value['.type'] === 'entity';
				var isSet = typeof value === 'object' && value['.type'] === 'set';

				//	If it is, dance profusely.
				//	Otherwise, make it one.
				if(isEntity){
					entity = value;
				}else{
					//	Make the base entity.
					if(isSet){
						entity = Entity['.create'](value);
						value = {};
					}else{
						entity = Entity['.create']();
					}

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
					entity['.bake']();
				}

				return entity;
			},

			/**
			 * ##### bake
			 *
			 * Converts the value of an entity (which can be any data type) into Items and adds them to the entity's bag of entities.
			 *
			 * @api private
			 */
			'.bake': function(){
				var item, key, value, shouldWeProceed;
				//	Only do this if the entity has no entities already, IE if this has not been run yet.
				if(this.size === 0){
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

			/*
			 * ##### add
			 *
			 * Adds an item to an entity's set of entities.
			 */
			add: function(){
				var self = this;
				var entity = this.create.apply(this, arguments);
				this.get('!set').add(entity);
				entity.get('!parents').add(this);

				var index = this.get('!set').indexOf(entity);
				if(!this.hasClass('results')){
					entity.index = index;
				}

				Object.defineProperty(this, index, {
					enumerable: true,

					get: function(){
						return self.children()[index];
					}
				});

				return this;
			},

			/*
			 * ##### addEach
			 *
			 * Adds each item in a given array to an item's set of entities.
			 *
			 * This can take an optional configuration object as a first parameter,
			 * which can set certain properties like id and classes on each item.
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

			/*
			 * ##### remove
			 *
			 * Removes an item from an entity's set.
			 */
			remove: function(){
				var args = Array.prototype.slice.call(arguments);
				var entity = this.cd.apply(this, args);
				this.get('!set').remove(entity);
				return this;
			},

			/*
			 * ##### indexOf
			 *
			 * Returns the index of the specified item in the set.
			 * If no arguments are passed, returns the index of the entity itself.
			 */
			indexOf: function(){
				var args = Array.prototype.slice.call(arguments);

				if(!args.length){
					return this.index;
				}
				var item = this.cd.apply(this, args);
				return this.get('!set').indexOf(item);
			},

			/*
			 * ##### _getRelevantPlugins
			 *
			 * Decides which plugins are relevant to the specified action and selector.
			 *
			 * @api private
			 */
			_getRelevantPlugins: function(action){
				var args = Array.prototype.slice.call(arguments, 1);
				return entropy['.plugins'].filter(function(plugin, p){
					return plugin[action] && plugin.relevance.apply(plugin, args);
				});
			},

			/*
			 * ##### filter
			 *
			 * Performs a single-level filter based on a query.
			 */
			filter: function(){
				var self = this,
					args = Array.prototype.slice.call(arguments);

				var results, parameters;
				if(typeof args[0] === 'function'){
					results = this.create().addClass('results');
					this.forEach(function(contents, e){
						parameters = [contents, e].concat(args.slice(1));
						if(args[0].apply(this, parameters)){
							results.add(this);
						}
					});
				}else{
					//	Get list of relevant plugins.
					var relevant = this._getRelevantPlugins.apply(this, ['filter'].concat(args));
					//	Build list of results.
					results = (relevant.length ? this : this.create()).addClass('results');
					relevant.forEach(function(plugin, p){
						results = results.filter.apply(results, [plugin.filter].concat(plugin.matches));
						delete plugin.matches;
					});
				}

				return results;
			},

			/*
			 * ##### find
			 *
			 * Performs a deep-find on entity.
			 * Returns a new entity of entities matching a query.
			 */
			find: function(){
				var args = Array.prototype.slice.call(arguments);
				var self = this;

				// var results;
				// var runPlugin = function(plugin, action){
				// 	var addChildren = function(entity){
				// 		var filter = entity.filter.apply(entity, [plugin[action]].concat(plugin.matches));
				// 		results.addEach(filter.children());
				// 		entity.forEach(addChildren);
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

				var results = this.create().addClass('results');
				var addChildren = function(){
					var filter = this.filter.apply(this, args);
					results.addEach(filter.children());
					this.forEach(addChildren);
				};
				addChildren.call(this);

				return results;
			},

			/*
			 * ##### goto
			 *
			 * Traverses to an entity if it is the sole result of the passed query.
			 */
			goto: function(){
				var args = Array.prototype.slice.call(arguments);

				var entity,
					index = 0;
				if(args.length >= 1){
					if(typeof args[0] === 'object'){
						return this.create(args[0]);
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

				if(entity.size > index){
					return entity[index];
				}
				return false;
			},

			/*
			 * ##### matches
			 *
			 * Returns whether an entity matches a given selector.
			 */
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

			/*
			 * ##### get
			 *
			 * Returns a specified property or key.
			 */
			get: function(key){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 0){
					//	Return entity's value.
					return this['.value'];
				}else if(args.length === 1){
					//	Get a whitelist of "magic" proeprties.
					if(/^!/.test(key)){
						key = key.substr(1);
						if(~['id', 'classes', 'index', 'size'].indexOf(key)){
							return this[key];
						}else if(~['key', 'set', 'eid', 'parents'].indexOf(key)){
							return this['.' + key];
						}
						return undefined;
					}
					//	Return a property on the current entity.
					return this['.value'] && this['.value'][key];
				}
			},

			/*
			 * ##### set
			 *
			 * Sets the given blacklisted property on the entity.
			 * If no arguments are passed, returns the entity's set.
			 */
			set: function(key, value){
				var args = Array.prototype.slice.call(arguments);

				if(args.length === 0){
					return this.children();
				}

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

			/*
			 * ##### map
			 *
			 * Get a value from all children entities.
			 */
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
						return this.children().map(key, this);
					}
					//	Return an array of properties of child entities.
					return this.map(function(entity){
						return entity.get(key);
					});
				}

				return new Set();
			},

			/*
			 * ##### setAll
			 *
			 * Set a value from all children entities.
			 */
			setAll: function(key, value){
				var	args = Array.prototype.slice.call(arguments);

				if(args.length === 2){
					//	Set properties on child entities.
					this.forEach(function(entity){
						return entity.set(key, value);
					});
				}

				return this;
			},

			/*
			 * ##### parents
			 *
			 * Returns a copy of the internal set of parents.
			 * When given a query, returns a filtered set.
			 */
			parents: function(){
				var args = Array.prototype.slice.call(arguments);

				if(!args.length){
					return this.get('!parents').slice();
				}
			},

			/*
			 * ##### children
			 *
			 * Returns a copy of the internal set of entities.
			 * When given a query, returns a filtered set.
			 */
			children: function(){
				var args = Array.prototype.slice.call(arguments);

				if(!args.length){
					return this.get('!set').slice();
				}else{
					return this.filter.apply(this, args).children();
				}
			},

			/*
			 * ##### sort
			 *
			 * Sorts the internal set.
			 */
			sort: function(){
				var set = this.get('!set');
				var args = Array.prototype.slice.call(arguments);
				set.sort.apply(set, args);
				return this;
			},

			/*
			 * ##### slice
			 *
			 * Slices the entity, returning a new entity.
			 */
			slice: function(){
				var args = Array.prototype.slice.call(arguments);
				var set = this.children();
				set = set.slice.apply(set, args);
				return this.create(set);
			},

			/*
			 * ##### clone
			 *
			 * Create a clone of the entity.
			 */
			clone: function(){
				var clone = this.create();
				this.forEach(function(entity, e){
					clone.add(entity);
				});
				return clone;
			},

			/*
			 * ##### addClass
			 *
			 * Adds class(es) (purely for convenience) to the entity.
			 * Accepts infinite arguments, space-delimited lists, or arrays.
			 *
			 * @param {String|Array} class(es)
			 * @param {String} class...
			 */
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

			/*
			 * ##### removeClass
			 *
			 * Removes class(es) from the entity.
			 */
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

			/*
			 * ##### toggleClass
			 *
			 * Adds/removes a class based on whether it is already present.
			 */
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

			/*
			 * ##### hasClass
			 *
			 * Checks for the existence of a class.
			 *
			 * @param {String} class
			 * @return {Boolean}
			 */
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

			/*
			 * ##### forEach
			 *
			 * Calls a function for each entity in the set.
			 */
			forEach: function(){
				var args = Array.prototype.slice.call(arguments);
				var e, entity,
					length = this.size;
				for(e = 0; e < length; e++){
					entity = this[e];
					if(typeof args[0] === 'function'){
						try{
							args[0].call(entity, entity.get(), e);
						}catch(error){
							//	Allows for s.forEach(console.log, console), s.forEach(alert), etc.
							args[0].call(args[1] || null, entity.get(), e);
						}
					}
				}
				return this;
			},

			/*
			 * ##### every
			 *
			 * Returns true if every entity in this entity satisfies the provided testing function.
			 *
			 * @param {String} query
			 * @return {Boolean}
			 */
			every: function(){
				var args = Array.prototype.slice.call(arguments);
				var e, entity,
					length = this.size;
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

			/**
			 * ##### some
			 *
			 * Returns true if at least one entity in this entity satisfies the provided testing function.
			 *
			 * @param {String} query
			 * @return {Boolean}
			 */
			some: function(){
				var args = Array.prototype.slice.call(arguments);
				var e, entity,
					length = this.size;
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

			//	Apply a function simultaneously against two entities of the entity (from left-to-right) as to reduce it to a single value.
			// reduce: function(){
				// var args = Array.prototype.slice.call(arguments);
				// return this.children().reduce.apply(this.children(), args);
			// }
		});

		utilities.extend(Set.prototype, {
			get '.type'(){
				return 'set';
			},

			get size(){
				return this.reduce(function(size){ return size + 1; }, 0);
			},

			slice: function(start, end){
				var set = new Set();

				start = start || 0;
				end = end || Infinity;

				if(start < 0){
					start += this.size;
				}
				if(end < 0){
					end += this.size;
				}

				return this.map(function(item, i){
					if(i >= start && i < end){
						return item;
					}
				}).filter(function(item){
					return typeof item !== 'undefined';
				});
			},

			add: function(){
				var set = this;
				var args = Array.prototype.slice.call(arguments);
				args.forEach(function(arg){
					if(!set.has(arg)){
						Array.prototype.push.call(set, arg);
					}
				});
				return this;
			},

			remove: function(){
				var set = this;
				var args = Array.prototype.slice.call(arguments);
				args.forEach(function(arg){
					if(set.has(arg)){
						var index = set.indexOf(arg);
						set.splice(index, 1);
					}
				});
				return this;
			},

			has: function(value){
				return this.some(function(item){
					return item === value;
				});
			},

			clear: function(){
				this.splice(0, this.size);
				return this;
			},

			sort: function(){
				var args = Array.prototype.slice.call(arguments);
				return Array.prototype.sort.apply(this, utilities.sort.apply(null, args));
			},

			map: function(callback, thisArg){
				var T, A, k;

				if (this == null) {
					throw new TypeError(" this is null or not defined");
				}

				var O = Object(this);
				var len = O.length >>> 0;

				if (typeof callback !== "function") {
					throw new TypeError(callback + " is not a function");
				}
				if (thisArg) {
					T = thisArg;
				}

				A = new Set(len);
				k = 0;

				while (k < len) {
					var kValue, mappedValue;
					if (k in O) {
						kValue = O[k];
						mappedValue = callback.call(T, kValue, k, O);
						A[k] = mappedValue;
					}
					k++;
				}
				return A;
			},

			filter: function(fun) {
				if (this == null) throw new TypeError();

				var t = Object(this);
				var len = t.length >>> 0;
				if (typeof fun != "function") throw new TypeError();

				var res = new Set();
				var thisp = arguments[1];
				for (var i = 0; i < len; i++) {
					if (i in t) {
						var val = t[i];
						if (fun.call(thisp, val, i, t)) Array.prototype.push.call(res, val);
					}
				}
				return res;
			},

			union: function(){
				var set = this.slice();
				var args = Array.prototype.slice.call(arguments);
				args.forEach(function(arg){
					if(Array.isArray(arg)){
						arg.forEach(function(item){
							set.add(item);
						});
					}else{
						set.add(arg);
					}
				});
				return set;
			},

			intersection: function(){
				var set = this.slice();
				var args = Array.prototype.slice.call(arguments);
				this.forEach(function(item){
					if(!args.every(function(set){
						return set.has(item);
					})){
						set.remove(item);
					}
				})
				return set;
			},

			difference: function(){
				var set = this.slice();
				var args = Array.prototype.slice.call(arguments);
				args.forEach(function(arg){
					arg.forEach(function(item){
						set.remove(item);
					});
				});
				return set;
			},

			symmetricDifference: function(){
				var args = Array.prototype.slice.call(arguments);
				return new Set(args).reduce(function(result, set){
					return result.union(set).minus(result.intersection(set));
				}, this);
			},

			toArray: function(){
				return Array.prototype.slice.call(this);
			}
		});

		////////////////////////////////
		//	Aliases.
		////////////////////////////////
			//	ENTITY
			//	Filesystem metaphor.
			// Entity.find;
			Entity.grep = Entity.filter;
			Entity.cd = Entity.goto;
			Entity.ls = Entity.children;
			Entity.cp = Entity.clone;
			Entity.rm = Entity.remove;
			Entity.make = Entity.create;
			//	Other.
			Entity.has = Entity.some;
			//	SET
			Set.prototype.push = Set.prototype.add;
			Set.prototype.concat = Set.prototype.union;
			Set.prototype.plus = Set.prototype.union;
			Set.prototype.minus = Set.prototype.difference;
			Set.prototype.intersect = Set.prototype.intersection;

		var entropy = (function(){
			var entropy = Entity.create();

			//	Give it something to write home about.
			entropy
			// .set('!id', 'root')
			// .addClass('root', 'entropy');

			//	Stuff unique to the entropic root.
			entropy.VERSION = 0.6845;
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
			entropy.Set = Set;

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
