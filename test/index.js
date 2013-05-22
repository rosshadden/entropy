var S = require('../entropy');

var should = require('should');

describe('entropy', function(){
	describe('#size', function(){
		it('should return 0 when children is empty', function(){
			should.equal(0, S.size);
		});
	});
});
