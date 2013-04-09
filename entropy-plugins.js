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

	filter: function(contents, index, selector, $id){
		return this.id === $id;
	}
});

//	Class.
//	S('.mammal');
S.register({
	name: 'class',
	description: 'Class selector.',
	expression: /^\.([\w\-_]+)$/,

	filter: function(contents, index, selector, $klass){
		return !!~this.hasClass($klass);
	}
});

//	Key.
//	S('mammal');
S.register({
	name: 'key',
	description: 'Key selector.',
	expression: /^([\w\-_]+)$/,

	filter: function(contents, index, selector, $key){
		return $key === this['.key'];
	}
});

//	Property presence.
//	S('[property]');
S.register({
	name: 'property-presence',
	description: 'Returns true if a property is present.',
	expression: /^\[\s*(!?[\w+\-]+)\s*\]$/,

	filter: function(contents, index, selector, $property){
		return this.get($property);
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
//	S('[property<2]');
//	S('[property>2]');
//	S('[property<=2]');
//	S('[property>=2]');
S.register({
	name: 'property-comparison',
	description: 'Returns true if a specified property meets the specified in/equality.',
	expression: /^\[\s*(!?[\w\-_]+)\s*(=|\^=|\$=|\*=|<|>)(=?)\s*(["']?)([^\4]+)\4\]$/,

	filter: function(contents, index, selector, $property, $operator, $isStrict, $quote, $value){
		var property = this.get($property);
		var	test = ($isStrict) ? property : !!contents && (''+property).toLowerCase(),
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
			//	Less than:
			'<': function(){
				return ($isStrict) ? parseInt(test, 10) <= parseInt(control, 10) : parseInt(test, 10) < parseInt(control, 10);
			},
			//	Greater than:
			'>': function(){
				return ($isStrict) ? parseInt(test, 10) >= parseInt(control, 10) : parseInt(test, 10) > parseInt(control, 10);
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

	filter: function(contents, index, expression, $type){
		var type = Object.prototype.toString.call(contents).replace(/\[object (\w+)\]/, '$1');
		return type.toLowerCase() === $type.toLowerCase();
	}
});

//	Index.
//	S(4);
S.register({
	name: 'index',
	description: 'Retrieves an entity at a specific index of its parent.',
	expression: /^(\d+)$/,
	type: 'number',

	filter: function(contents, index, selector, $index){
		return index == $index;
	}
});

//	Lineage.
//	S('#friends > [name]');
S.register({
	name: 'lineage',
	description: 'Returns an item if a given key1 exists as a parent to a given key2.',
	expression: /^(\S.+\S)(\s?)>\2(\S.+\S)$/,

	filter: function(contents, index, selector, $left, _space, $right){
		return entropy['.plugins'].some(function(plugin){
			return plugin.relevance(selector);
		}) || this.matches($left) && this.some($right);
	}
});
