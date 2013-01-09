var entropy = require('../entropy');

var assert = require('assert');
describe('entropy', function(){
	describe('#size()', function(){
		it('should return 0 when the list is empty', function(){
			assert.equal(0, entropy.size());
		});
	});
});
