S.register(/^\*/, function(){
	this.push.apply(this, S._collection.slice());
}, false);

S.register(/!\w+/, function(selector){
	var item = selector.substr(selector.indexOf('!') + 1).replace(/\s|\[|\]/g, '');

	this.except = this.except || [];

	this.except.push(item);

	var i = 0;
	while(i < this.length){
		if(this[i].type === item){
			this.splice(i, 1);

			i -= 1;
		}

		i += 1;
	}
});

S.register(/^\[.+\]$/, function(selector){
	var	param = selector.replace(/\s|\[|\]/g, ''),
		parts = param.split('=');

	this.testing = 'qwer';

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