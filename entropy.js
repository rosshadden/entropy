var functionFactory = function(proto){
	return function(){
		var f = function(){
			return f.call.apply(f, arguments);
		};

		Object.keys(proto).forEach(function(key){
			f[key] = proto[key];
		});

		f.constructor.apply(f, arguments);

		return f;
	};
};

Object.extend = function(dest, source){
	Object.getOwnPropertyNames(source).forEach(function(key){
		dest[key] = source[key];
	});
};

var EntityProto = Object.create(Function.prototype);

Object.extend(EntityProto, {
	constructor: function(){
		this['.set'] = [];
	},

	call: function(){
		// this get's called when you invoke the "function" that is the instance
		return this;
	},

	add: function(what){
		this['.set'].push(what);

		return this;
	},

	print: function(){
		console.log('set:', this['.set']);

		return this;
	}
});

window.Entity = functionFactory(EntityProto);
window.entropy = window.S = Entity();

entropy.version = 0.1;
