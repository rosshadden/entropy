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

	filter: function(value, e, selector, $id){
		return this.id === $id;
	}
});

//	Class.
//	S('.mammal');
S.register({
	name: 'class',
	description: 'Class selector.',
	expression: /^\.([\w\-_]+)$/,

	filter: function(value, e, selector, $klass){
		return !!~this.classes.indexOf($klass);
	}
});

//	Property presence.
//	S('[property]');
S.register({
	name: 'property-presence',
	description: 'Returns true if a property is present.',
	expression: /^\[\s*([\w+-]+)\s*\]$/,

	filter: function(value, e, selector, $property){
		return !!value && value.hasOwnProperty($property);
	}
});
