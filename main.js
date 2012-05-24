S.create('dog', {
	name: 'Fred',
	speech: 'bark',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.create('dog', {
	name: 'Bob',
	speech: 'bark',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.create('human', {
	name: 'Jake',
	handedness: 'right',
	speech: 'WORDS',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.register('*', function(){
	this.push.apply(this, S._collection.slice());
}, true);

S.register(/^\[.+\]$/, function(selector){
	var	param = selector.replace(/\s|\[|\]/g, ''),
		parts = param.split('=');

	var i, length = S._collection.length;
	for(i = 0; i < length; i++){
		if(
			parts.length === 1 && S._collection[i].object[parts[0]]
		||	parts.length === 2 && S._collection[i].object[parts[0]] === parts[1]
		){
			this.push(S._collection[i]);
			continue;
		}
	}
});