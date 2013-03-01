////////////////////////////////////////////////////////////////
//	SELECTORS
////////////////////////////////////////////////////////////////

//	ID.
//	S('#Jake');
S.register({
	name: 'id',
	description: 'ID selector.',
	expression: /^#([\w\-_]+)$/,

	relevance: function(){
		console.log('relevance', this);
		return true;
	},

	filter: function(item, i){
		console.log('id', i, item.id);
		return item.id === 'dog2';
	}
});
