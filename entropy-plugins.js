//	SELECTORS

//	All.
//	S('*'), S('all');
S.register({
	name: 'all',
	expression: /^\*$|^all$/,

	parser: function(object, expression){
		return true;
	}
});

//	ID.
//	S('#Jake');
S.register({
	name: 'id',
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
	expression: /^\.?([\w\-_]+)$/g,

	parser: function(object, expression, $klass){
		return ~this.classes.indexOf($klass);
	}
});

//	Key.
//	S('~mammal');
S.register({
	name: 'key',
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
//	Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).
S.register({
	name: 'type',
	expression: /^@(\w+)$/g,

	parser: function(object, expression, $type){
		var type = Object.prototype.toString.call(object).replace(/\[object (\w+)\]/, '$1');

		return type.toLowerCase() === $type.toLowerCase();
	}
});

//	Index
//	Retrieves an entity at a specific index.
//	S(4);
S.register({
	name: 'index',
	type: 'number',
	args: 1,

	hunter: function(results, args, entity){
		return entity[args[0]];
	}
});

//	Entity wrapper
//	Wraps arbitrary objects as an Entity, which allows for querying, adding, etc.
//	S({foo: 'bar'}).find();
//	S([2, 4, 6, 8])(0);
S.register({
	name: 'wrap',

	relevance: function(args){
		return args.length === 1 && typeof args[0] === 'object';
	},

	hunter: function(results, args, entity){
		var newEntity = entity.create(args[0]).bake();

		return newEntity;
	}
});

//	Function
//	Runs a function.  This is useful if you wish to execute a function in the middle of a chain.
//	S(function(){  console.log('asdf'); });
S.register({
	name: 'function',

	type: 'function',

	hunter: function(results, args, entity){
		args[0].apply(entity);

		return entity;
	}
});
