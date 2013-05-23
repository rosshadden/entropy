////////////////////////////////////////////////////////////////
//	SELECTORS
////////////////////////////////////////////////////////////////

/**
 * ##### all
 *
 * Returns all entities in the set.
 *
 * Examples:
 *
 * 		S.filter('*');
 * 		S('*');
 *
 * @param {String} *
 * @return {Entity} \[ \left\{ s \in S \right\} \]
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
 * ##### id
 *
 * Returns all entities in the set with a given `id`.
 *
 * Examples:
 *
 * 		S.filter('#Jake')
 * 		S('#Jake')
 *
 * @param {String} #id id of an entity
 * @return {Entity} \[ \left\{ s \in S \mid s.id = \text{id} \right\} \]
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
 * ##### class
 *
 * Returns all entities in the set with a given `class`.
 *
 * Examples:
 *
 * 		S.filter('.mammal')
 * 		S('.mammal')
 *
 * @param {String} .class class of an entity
 * @return {Entity} \[ \left\{ s \in S \mid s.hasClass(\text{class}) \right\} \]
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
 * ##### key
 *
 * Returns all entities in the set with a given `key`.
 *
 * Examples:
 *
 * 		S.filter('name')
 * 		S('name')
 *
 * @param {String} key keys of entities that are defined in objects
 * @return {Entity} \[ \left\{ s \in S \mid s.get(\text{`!key'}) = \text{key} \right\} \]
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
 * ##### property presence
 *
 * Returns all entities in the set with a given `property`.
 *
 * Examples:
 *
 * 		S.filter('[property]')
 * 		S('[property]')
 *
 * @param {String} [property] name of a property
 * @return {Entity} \[ \left\{ s \in S \mid \exists p \in s.get() \ni p = \text{property} \right\} \]
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
 * ##### property comparison
 *
 * Returns all entities in the set with a given `property` set to a specified `value`.
 *
 * Examples:
 *
 * 		// let property = 'VaLuE':
 * 		S('[property="value"]');
 * 		S('[property=="VaLuE"]');
 * 		S("[property^='va']");
 * 		S("[property^=='Va']");
 * 		S("[property*='lu']");
 * 		S("[property*=='Lu']");
 * 		S('[property$=ue]');
 * 		S('[property$==uE]');
 * 		S('[property<2]');
 * 		S('[property>2]');
 * 		S('[property<=2]');
 * 		S('[property>=2]');
 *
 * @param {String} [property="value"] property/value comparison pair
 * @return {Entity} \[ \left\{ s \in S \mid \exists p \in s.get() \land \exists v \in s.map() \ni p = \text{property} \land s.get(p) = v \right\} \]
 */
S.register({
	name: 'property-comparison',
	description: 'Returns true if a specified property meets the specified (in)equality.',
	expression: /^\[\s*(!?[\w\-_]+)\s*(!?)(=|\^=|\$=|\*=|<|>)(=?)(['"]?)(.*)\5\]$/,

	filter: function(contents, index, selector, $property, $not, $operator, $isStrict, $quote, $value){
		var property = this.get($property);
		var	test = ($isStrict) ? property : !!contents && (''+property).toLowerCase(),
			control = ($isStrict) ? $value : (''+$value).toLowerCase(),
			isNegated = !!$not;

		var cases = {
			//	Equality:
			'=': function(){
				return test == control;
			},
			//	Starts with:
			'^=': function(){
				var regex = new RegExp('^' + control);
				return regex.test(test, ($isStrict) ? '' : 'i');
			},
			//	Ends with:
			'$=': function(){
				var regex = new RegExp(control + '$');
				return regex.test(test, ($isStrict) ? '' : 'i');
			},
			//	Contains:
			'*=': function(){
				var regex = new RegExp(control);
				return regex.test(test, ($isStrict) ? '' : 'i');
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
		var result = cases[$operator]();
		return (isNegated) ? !result : result;
	}
});

/**
 * ##### type
 *
 * Returns all entities in the set that are a given `type`.
 * Note: `type` is case insensitive, but currently only native types (and arrays) are supported.
 *
 * Examples:
 *
 * 		S.filter('~array')
 * 		S('~date')
 *
 * @param {String} ~type type of an object
 * @return {Entity} \[ \left\{ s \in S \mid s.get()\ instanceof \text{ type} \right\} \]
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
 * ##### index
 *
 * Returns all entities in the set at a specified `index` of their respective parents.
 *
 * Examples:
 *
 * 		S.filter(4)
 * 		s(4)
 *
 * @param {Number} index index of an entity
 * @return {Entity} \[ \left\{ s \in S \mid S[\text{index}] = s \right\} \]
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
 * ##### lineage
 *
 * Returns all entities in the set where a specified `key1` exists as a parent to a given `key2`.
 * Note: I think this is broken, though it's likely worthless even when working.
 *
 * Examples:
 *
 * 		S.filter('#friends > [name]')
 * 		S('#friends > [name]')
 *
 * @param {String} query1>query2
 * @return {Entity} \[ \left\{ s \in S \mid s.matches(\text{query1}) \land s.has(\text{query2}) \right\} \]
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
