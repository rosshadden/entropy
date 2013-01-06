////////////////////////////////////////////////////////////////
//	ADAPTERS
////////////////////////////////////////////////////////////////
S.adapter('_', function(){
	var entity = this;

	var action = 'get';
	var __ = function(which){
		if(~[undefined, 'get'].indexOf(which)){
			action = 'get';
		}else if(~['list'].indexOf(which)){
			action = 'list';
		}else if(~['value', 'val', 'contents'].indexOf(which)){
			action = 'val';
		}

		//	Resets to 'get' if it's not in the same chain.
		setTimeout(function(){
			action = 'get';
		}, 1);

		return __;
	};

	_.methods(_).forEach(function(method, m){
		__[method] = function(){
			var args = Array.prototype.slice.call(arguments);
			return _[method].apply(_, [entity[action]()].concat(args));
		};
	});
	return __;
});

////////////////////////////////////////////////////////////////
//	SELECTORS
////////////////////////////////////////////////////////////////
//	All.
//	S('*');
S.register({
	name: 'all',
	description: 'Selects all entities in the set.',
	expression: /^\*$/,

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
		return $key === this['.key'];
	}
});

//	Property presence.
//	S('[property]');
S.register({
	name: 'property-presence',
	description: 'Returns true if a property is present.',
	expression: /^\[\s*([\w+-]+)\s*\]$/g,

	parser: function(object, expression, $property){
		return !!object && object.hasOwnProperty($property);
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
		var	test = ($isStrict) ? object[$property] : !!object && (''+object[$property]).toLowerCase(),
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

//	Length.
//	S('[property:{n,m}]');
//	S('[property:{n,}]');
//	S('[property:{,m}]');
//	S('[property:{n}]');
S.register({
	name: 'property-length',
	description: 'Returns true if a property is present and has length inclusively between bounds.',
	expression: /^\[\s*([\w+-]+):\{(\d*)(,?)(\d*)\}\s*\]$/g,

	parser: function(object, expression, $property, $min, $comma, $max){
		var min = -Infinity,
			max = Infinity;

		if($min !== ''){
			min = +$min;
		}

		if($max !== ''){
			max = +$max;
		}

		if($comma === ''){
			max = +$min;
		}

		return !!object && object.hasOwnProperty($property) && min <= object[$property].length && object[$property].length <= max;
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

//	Get.
//	S();
S.register({
	name: 'get',
	description: 'Returns a list of all items in the entity.',

	relevance: function(args){
		return args.length === 0;
	},

	hunter: function(results, args, entity){
		return entity.get();
	}
});

//	Function
//	S('[name]', 4);
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
//	S('~friends > [name]');
S.register({
	name: 'deep-find',
	description: 'Returns true if a given key1 exists as a parent to a given key2.',
	expression: /^(\S.+\S)(\s*)>\2(\S.+\S)$/g,

	hunter: function(results, args, entity){
		var	left = this.matches[1],
			right = this.matches[3];

		var result = entity.create();

		entity(left).each(function(child, c){
			if(this[c](right).size() > 0){
				result.add(child);
			}
		});

		return result;
	}
});

