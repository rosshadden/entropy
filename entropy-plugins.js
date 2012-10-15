//	SELECTORS

//	All.
//	S('*'), S('');
S.register({
	name: 'all',
	description: 'Selects all entities in the set.',
	expression: /^\*$|^$/,

	parser: function(object, expression){
		return true;
	}
});

//	ID.
//	S('#Jake');
S.register({
	name: 'id',
	description: 'ID selector.',
	expression: /^#([\w\-_]+)$/g,
	numResults: 1,

	parser: function(object, expression, $id){
		return this.id === $id;
	}
});

//	Class.
//	S('.mammal');
S.register({
	name: 'class',
	description: 'Class selector.',
	expression: /^\.([\w\-_]+)$/g,

	parser: function(object, expression, $klass){
		return ~this.classes.indexOf($klass);
	}
});

//	Key.
//	S('~mammal');
S.register({
	name: 'key',
	description: 'Key selector.',
	expression: /^~([\w\-_]+)$/g,
	numResults: 1,

	parser: function(object, expression, $key){
		return $key === this.get('key');
	}
});

//	Property presence.
//	S('[property]');
S.register({
	name: 'property-presence',
	description: 'Returns true if a property is present.',
	expression: /^\[\s*([\w+-]+)\s*\]$/g,

	parser: function(object, expression, $property){
		return object.hasOwnProperty($property);
	}
});

//	Property equivalence.
//	let property = 'VaLuE':
//	S('[property="value"]');
//	S('[property=="VaLuE"]');
//	S("[property^='va']");
//	S("[property^=='Va']");
//	S("[property*='lu']");
//	S("[property*=='Lu']");
//	S('[property$=ue]');
//	S('[property$==uE]');
S.register({
	name: 'property-equivalence',
	description: 'Returns true if a specified property meets the specified in/equality.',
	expression: /^\[\s*([\w\-_]+)\s*(=|\^=|\$=|\*=)(=?)\s*(["']?)([^\4]+)\4\]$/g,

	parser: function(object, expression, $property, $operator, $isStrict, $quote, $value){
		var	test = ($isStrict) ? object[$property] : (''+object[$property]).toLowerCase(),
			control = ($isStrict) ? $value : (''+$value).toLowerCase();

		var cases = {
			//	Equality:
			'=': function(){
				return test == control;
			},
			//	Starts with:
			'^=': function(){
				var regex = new RegExp('^' + control);
				return regex.test(test, 'i');
			},
			//	Ends with:
			'$=': function(){
				var regex = new RegExp(control + '$');
				return regex.test(test, 'i');
			},
			//	Contains:
			'*=': function(){
				var regex = new RegExp(control);
				return regex.test(test, 'i');
			}
		};

		//	Run the relevant function based on the operator, and return pass/fail.
		return cases[$operator]();
	}
});

//	Type.
//	S('@Array');
S.register({
	name: 'type',
	description: 'Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).',
	expression: /^@(\w+)$/g,

	parser: function(object, expression, $type){
		var type = Object.prototype.toString.call(object).replace(/\[object (\w+)\]/, '$1');

		return type.toLowerCase() === $type.toLowerCase();
	}
});

//	Index.
//	S(4);
S.register({
	name: 'index',
	description: 'Retrieves an entity at a specific index.',
	type: 'number',

	hunter: function(results, args, entity){
		return entity[args[0]];
	}
});

//	Entity wrapper.
//	S({foo: 'bar'}).find();
//	S([2, 4, 6, 8])(0);
S.register({
	name: 'wrap',
	description: 'Wraps arbitrary objects as an Entity, which allows for querying, adding, etc.',
	type: 'object',

	hunter: function(results, args, entity){
		var newEntity = entity.create(args[0]).bake();

		return newEntity;
	}
});

//	Function
//	S(function(){  console.log('asdf'); });
S.register({
	name: 'function',
	description: 'Runs a function.  This is useful if you wish to execute a function in the middle of a chain.',
	type: 'function',

	hunter: function(results, args, entity){
		args[0].apply(entity);

		return entity;
	}
});

//	Function
//	S(function(){  console.log('asdf'); });
S.register({
	name: 'string-and-a-num-ber--two-bits',
	description: 'Returns a query limited to the specified number of results.',

	relevance: function(args){
		return args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'number';
	},

	hunter: function(response, args, entity){
		var	results = entity(args[0]).list(),
			filter = results.slice(0, args[1]),
			newEntity = entity.create();

		filter.forEach(function(item, i){
			newEntity.add(item);
		});

		return newEntity;
	}
});

//	Deep find.
//	S('key1 ~ key2');
S.register({
	name: 'deep-find',
	description: 'Returns true if a given key1 exists as a parent to a given key2.',
	expression: /^([\w\-_]+)(\s*)~\2([\w\-_]+)$/g,

	parser: function(object, expression, $key1, $_space, $key2){
		var traverse = function(item){
			for(var i in item){
				if(i == $key1 && item[i].hasOwnProperty($key2)){
					return true;
				}
			}
		};

		return traverse(object);
	}
});
