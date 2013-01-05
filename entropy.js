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

	utilities.extend(Entity, {
		constructor: function(){
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
		},

		//	Called when you invoke the instance as a function.
		//	This runs a query against the list of the instance.
		call: function(){
			return this.find.apply(this, arguments);
		},

		//	This is mainly useful when playing with entropy in the console.
		toString: function(){
			return 'Entity';
		},

		//	Makes a brand new Entity.
		'.make': utilities.functionFactory(Entity),

		//	Converts the contents of an entity (which can be any data type)
		//	into Items and adds them to the entity's bag of entities.
		bake: function(){
			var item;
			if(this.size() === 0){
				for(var key in this.contents){
					if(this.contents.hasOwnProperty(key)){
						item = new utilities.Item(key, this.contents[key]);

						this.add(item);
					}
				}
			}

			return this;
		},

		create: function(){},

		//	Adds an item to an entity's list of entities.
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

		//	Adds each item in a given array to an item's list of entities.
		//	This can take an optional configuration object as a first parameter,
		//	which can list certain properties like id and classes on each item.
		//	These properties can take a dynamic value like '/asdf' to make the
		//	value depend on the property specified.
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

		find: function(query){},

		//	Returns a specified property or key.
		get: function(key){
			var item;

			if(typeof key === 'undefined'){
				return this.map(function(element){
					return element.contents;
				});
			}

			return this[key];
		},

		//	Sets the given whitelisted property on the entity.
		set: function(key, value){
			if(~['id'].indexOf(key)){
				this[key] = value;
			}

			return this;
		},

		//	Either gets or sets a given property, ala jQuery.
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

		//	Returns a copy of the internal list.
		list: function(){
			return this.get('.list').slice();
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
		},

		//	Get or set the true value of an entity.
		val: function(value){
			if(~['', undefined].indexOf(value)){
				return this.contents;
			}else{
				this.contents = value;
			}
		}
	});

	var entropy = (function(){
		var entropy = {};

		return entropy;
	})();

	return entropy;
})();
