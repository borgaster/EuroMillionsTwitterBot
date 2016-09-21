/**
* EuroMillions.js unit tests
* 1) Should not an empty key
* 2) Should get exactly 5 numbers and 2 stars
* 3) Numbers should be between 1 and 50
* 4) Stars should be between 1 and 11
**/
/*jshint expr: true*/

let chai = require('chai');
let expectRes;
chai.should();
chai.use(require('chai-things'));
let expect = chai.expect; // we are using the "expect" style of Chai
let EuroMillionsKey = require('../EuroMillions.js');
let key = EuroMillionsKey.generateKey();
describe('EuroMillionsKey', function() {
    it('Should get a not empty EuroMillions key', function() {
        expect(key).to.not.be.undefined;
        expect(key.numbers).to.not.be.undefined;
        expect(key.stars).to.not.be.undefined;
    });
    it('Should get 5 numbers and 2 stars', function() {
        expect(key.numbers.length).to.be.equal(5);
        expect(key.stars.length).to.be.equal(2);
    });
    it('Numbers should be between 1 and 50', function() {
        key.numbers.should.all.be.within(1, 50);
    });
    it('Stars should be between 1 and 11', function() {
        key.stars.should.all.be.within(1, 11);
    });
});