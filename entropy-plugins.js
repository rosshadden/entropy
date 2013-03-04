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

	filter: function(entity, e, selector, $id){
		return item.id === $id;
	}
});

//	Class.
//	S('.mammal');
S.register({
	name: 'class',
	description: 'Class selector.',
	expression: /^\.([\w\-_]+)$/,

	filter: function(entity, e, selector, $klass){
		return !!~entity.classes.indexOf($klass);
	}
});
