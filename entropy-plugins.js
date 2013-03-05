////////////////////////////////////////////////////////////////
//	SELECTORS
////////////////////////////////////////////////////////////////

//	All.
//	S('*');
S.register({
	name: 'all',
	description: 'Selects all entities in the set.',
	expression: /^\*$/,

	filter: function(){
		return true;
	}
});

//	ID.
//	S('#Jake');
S.register({
	name: 'id',
	description: 'ID selector.',
	expression: /^#([\w\-_]+)$/,

	filter: function(value, index, selector, $id){
		return this.id === $id;
	}
});

//	Class.
//	S('.mammal');
S.register({
	name: 'class',
	description: 'Class selector.',
	expression: /^\.([\w\-_]+)$/,

	filter: function(value, index, selector, $klass){
		return !!~this.classes.indexOf($klass);
	}
});

//	Key.
//	S('mammal');
// S.register({
// 	name: 'key',
// 	description: 'Key selector.',
// 	expression: /^([\w\-_]+)$/,

// 	filter: function(value, index, selector, $key){
// 		return $key === this['.key'];
// 	}
// });

//	Property presence.
//	S('[property]');
S.register({
	name: 'property-presence',
	description: 'Returns true if a property is present.',
	expression: /^\[\s*([\w+-]+)\s*\]$/,

	filter: function(value, index, selector, $property){
		return !!value && value.hasOwnProperty($property);
	}
});

//	Property comparison.
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
	name: 'property-comparison',
	description: 'Returns true if a specified property meets the specified in/equality.',
	expression: /^\[\s*([\w\-_]+)\s*(=|\^=|\$=|\*=)(=?)\s*(["']?)([^\4]+)\4\]$/,

	filter: function(value, index, selector, $property, $operator, $isStrict, $quote, $value){
		var	test = ($isStrict) ? value[$property] : !!value && (''+value[$property]).toLowerCase(),
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
//	S('~Array');
S.register({
	name: 'type',
	description: 'Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).',
	expression: /^~(\w+)$/,

	filter: function(value, index, expression, $type){
		var type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, '$1');
		return type.toLowerCase() === $type.toLowerCase();
	}
});

//	Index.
//	S(4);
S.register({
	name: 'index',
	description: 'Retrieves an entity at a specific index of its parent.',
	expression: /^(\d+)$/,

	filter: function(value, index, selector, $index){
		return $index == this.get('!index');
	}
});
