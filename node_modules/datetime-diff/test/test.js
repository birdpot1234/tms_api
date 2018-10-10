var expect = require('chai').expect;
var assert = require('chai').assert;
var dateDiff = require('../index');

describe('assertions', function(){
    it('should  count days', function() {
        var date1 = new Date(2016, 10, 1);
        var date2 = new Date(2016, 10, 2);
        var result = dateDiff(date1, date2).days;
        expect(result).to.equal(1);
    });

    it('should count hours', function() {
        var date1 = new Date(2016, 10, 1, 12, 0, 0, 0);
        var date2 = new Date(2016, 10, 1, 11, 0, 0, 0);
        var result = dateDiff(date1, date2).hours;
        expect(result).to.equal(1);
    });

    it('should count minutes', function() {
        var date1 = new Date(2016, 10, 1, 12, 0, 0, 0);
        var date2 = new Date(2016, 10, 1, 11, 0, 0, 0);
        var result = dateDiff(date1, date2).minutes;
        expect(result).to.equal(60);
    });

    it('should count seconds', function() {
        var date1 = new Date(2016, 10, 1, 12, 0, 0, 0);
        var date2 = new Date(2016, 10, 1, 11, 0, 0, 0);
        var result = dateDiff(date1, date2).seconds;
        expect(result).to.equal(3600);
    });
});

