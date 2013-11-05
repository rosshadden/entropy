(function() {
	"use strict";

	window.a = [2, 8, 6, 4, "string", ["red", "blue", "green"]];
	window.s = S.from(a);
	s.add(10, "#ten");
	s[0].addChild(1234);
	s[1].addChild(5678);

	S.add({
		hello: "world",
		age: 32
	}, "hi");
})()
