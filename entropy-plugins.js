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

	filter: function(item, i, selector, $id){
		return item.id === $id;
	}
});
