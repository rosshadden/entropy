var terminal = $('#console').console({
	promptLabel: 'λ ',
	autofocus: true,
	animateScroll: true,
	promptHistory: true,
	commandValidate: function(line){
		if (line === "") return false;
		else return true;
	},
	commandHandle: function(line){
		return [{
			msg: "=> [12,42]",
			className: "jquery-console-message-value"
		},{
			msg: ":: [a]",
			className: "jquery-console-message-type"
		}];
	},
	charInsertTrigger: function(key, line){
		console.log(key);
		return(
			!line.length
			&& key === 115
			||(
				!!line.match(/^s/)
				&& key === 46
			)||(
				!!line.match(/^s\.[\w(),.:|]*$/)
			)
		);
	}
});
