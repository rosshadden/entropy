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
	speech: 'WORDS',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});