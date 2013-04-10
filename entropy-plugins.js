////////////////////////////////////////////////////////////////
//	SELECTORS
////////////////////////////////////////////////////////////////

/**
 * All selector.
 * Returns all entities in the set.
 *
 * Examples:
 *
 * 		s.filter('*')
 * 		// => [all, entities, directly, contained, by, `s`]
 * 		s('*')
 * 		// => [all, entities, contained, at, any, level, by, `s`]
 */
S.register({
	name: 'all',
	description: 'Returns all entities in the set.',
	expression: /^\*$/,

	filter: function(){
		return true;
	}
});

/**
 * ID selector.
 * Returns all entities in the set with a given ID.
 *
 * Examples:
 *
 * 		s.filter('#Jake')
 * 		// => [#Jake]
 * 		s('#Jake')
 * 		// => [#Jake]
 */
S.register({
	name: 'id',
	description: 'ID selector.',
	expression: /^#([\w\-_]+)$/,

	filter: function(contents, index, selector, $id){
		return this.id === $id;
	}
});

/**
 * Class selector.
 * Returns all entities in the set with a given class.
 *
 * Examples:
 *
 * 		s.filter('.mammal')
 * 		// => [#dog1, #dog2, #Jake]
 * 		s('.mammal')
 * 		// => [#dog1, #dog2, #Jake, #test]
 */
S.register({
	name: 'class',
	description: 'Class selector.',
	expression: /^\.([\w\-_]+)$/,

	filter: function(contents, index, selector, $klass){
		return !!this.hasClass($klass);
	}
});

/**
 * Key selector.
 * Returns all entities in the set with a given key.
 *
 * Examples:
 *
 * 		s.filter('name')
 * 		// => []
 * 		s('name')
 * 		// => ["Fred", "Jim", "Matt", "Jake", "Steve", "Peter", "Tyler", "SUCCESSFUL"]
 */
S.register({
	name: 'key',
	description: 'Key selector.',
	expression: /^([\w\-_]+)$/,

	filter: function(contents, index, selector, $key){
		return $key === this['.key'];
	}
});

/**
 * Property presence selector.
 * Returns all entities in the set with a given property.
 *
 * Examples:
 *
 * 		s.filter('[property]')
 * 		// => [#dog1, #dog2, #Jake]
 * 		s('[property]')
 * 		// => [#dog1, #dog2, #Jake, ...]
 */
S.register({
	name: 'property-presence',
	description: 'Returns true if a property is present.',
	expression: /^\[\s*(!?[\w+\-]+)\s*\]$/,

	filter: function(contents, index, selector, $property){
		return this.get($property);
	}
});

/**
 * Property comparison selector.
 * Returns all entities in the set with a given property set to a specified value.
 *
 * Examples:
 *
 * 		// let property = 'VaLuE':
 * 		s('[property="value"]');
 * 		s('[property=="VaLuE"]');
 * 		s("[property^='va']");
 * 		s("[property^=='Va']");
 * 		s("[property*='lu']");
 * 		s("[property*=='Lu']");
 * 		s('[property$=ue]');
 * 		s('[property$==uE]');
 * 		s('[property<2]');
 * 		s('[property>2]');
 * 		s('[property<=2]');
 * 		s('[property>=2]');
 */
S.register({
	name: 'property-comparison',
	description: 'Returns true if a specified property meets the specified (in)equality.',
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

/**
 * Type selector.
 * Returns all entities in the set that are a given type.
 *
 * Examples:
 *
 * 		s.filter('~array')
 * 		// => [[2, 4, 16, 256, 65536]]
 * 		s('~array')
 * 		// => [[], [], [], ..., []]
 *
 * @return {String} testing stuff
 */
S.register({
	name: 'type',
	description: 'Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).',
	expression: /^~(\w+)$/,

	filter: function(contents, index, expression, $type){
		var type = Object.prototype.toString.call(contents).replace(/\[object (\w+)\]/, '$1');
		return type.toLowerCase() === $type.toLowerCase();
	}
});

/**
 * Index selector.
 * Returns all entities in the set at a specified index of their respective parents.
 *
 * Examples:
 *
 * 		s.filter(4)
 * 		// => [the fourth element of `s`]
 * 		s(4)
 * 		// => [all, entities, that, are, the, 4th, index, of, their, respective, parents]
 *
 * @return {Entity} \[ \{ a | (a,b) \in R \} \]
 */
S.register({
	name: 'index',
	description: 'Retrieves an entity at a specific index of its parent.',
	expression: /^(\d+)$/,
	type: 'number',

	filter: function(contents, index, selector, $index){
		return index == $index;
	}
});

/**
 * Lineage selector.
 * Returns all entities in the set where a specified `key1` exists as a parent to a given `key2`.
 *
 * Examples:
 *
 * 		s.filter('#friends > [name]')
 * 		// => [ASDF]
 * 		s('#friends > [name]')
 * 		// => [ASDF]
 *
 * @return {Entity} \[ \{ s \in S \} \]
 */
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
