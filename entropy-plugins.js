//	SELECTORS

//	All.
//	S('*'), S('all');
S.register(/^\*$|^all$/, function(object, expression){
	return true;
});

//	ID.
//	S('#Jake');
S.register(/^#([\w\-_]+)$/g, function(object, expression, $id){
	return this.id === $id;
});

//	Property presence.
//	S('[property]');
S.register(/^\[\s*([\w+-]+)\s*\]$/g, function(object, expression, $property){
	return object.hasOwnProperty($property);
});

//	Property equivalence.
//	let property = 'VaLuE':
//	S('[property="value"]');
//	S('[property=="VaLuE"]');
//	S("[property^='va']");
//	S("[property^=='Va']");
//	S("[property*='lu']");
//	S("[property*=='Lu']");
//	S('[property$=ue]');
//	S('[property$==uE]');
S.register(/^\[\s*([\w\-_]+)\s*(=|\^=|\$=|\*=)(=?)\s*(["']?)([^\4]+)\4\]$/g, function(object, expression, $property, $operator, $isStrict, $quote, $value){
	var	test = ($isStrict) ? object[$property] : (''+object[$property]).toLowerCase(),
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
		//	Contains:
		'*=': function(){
			var regex = new RegExp(control);
			return regex.test(test, 'i');
		}
	};

	//	Run the relevant function based on the operator, and return pass/fail.
	return cases[$operator]();
});

//	Class.
//	S('.mammal');
S.register(/^\.?([\w\-_]+)$/g, function(object, expression, $klass){
	return ~this.classes.indexOf($klass);
});

//	Key.
//	S('~mammal');
S.register(/^~([\w\-_]+)$/g, function(object, expression, $key){
	return $key === this.get('key');
});


//	Type.
//	S('@Array');
//	Case insensitive, but ONLY WORKS WITH BUILT-IN TYPES (Object, Array, Date, Number, String, Boolean, Function).
S.register(/^@(\w+)$/g, function(object, expression, $type){
	var type = Object.prototype.toString.call(object).replace(/\[object (\w+)\]/, '$1');

	return type.toLowerCase() === $type.toLowerCase();
});
