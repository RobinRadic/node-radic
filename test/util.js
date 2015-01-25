var path = require('path'),
    fs = require('fs-extra'),

    async = require('async'),
    _ = require('lodash'),

    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),

    chaiConfig = require('./helpers/config'),

    sinon = require('sinon'),
    EventEmitter = require('eventemitter2').EventEmitter,

    radic = require('../');


describe('util', function () {
    var util = radic.util;
    describe('extends', function () {
        it('should extend the native util module', function(){
            util.format.should.be.a('function');
            util.debug.should.be.a('function');
            util.error.should.be.a('function');
            util.puts.should.be.a('function');
            util.print.should.be.a('function');
            util.log.should.be.a('function');
            util.inspect.should.be.a('function');
            util.isArray.should.be.a('function');
            util.isRegExp.should.be.a('function');
            util.isDate.should.be.a('function');
            util.isError.should.be.a('function');
            util.pump.should.be.a('function');
            util.inherits.should.be.a('function');
        });
    });

    describe('main functions', function () {
        it('getUserHomeDir should return an existing path to the current user home directory', function(done){
            var dir = util.getUserHomeDir();
            fs.exists(dir, function(exists){
                expect(exists).to.equal(true, 'The path should exist');
                done();
            });
        });
        it('defined should return true or false if an object is defined', function(){
            var undefinedObj;
            var definedObj = { foo: 'bar' };
            expect(util.defined(undefinedObj)).to.equal(false, 'Passsing undefined objects should return false');
            expect(util.defined(definedObj)).to.equal(true, 'Passsing defined objects should return true');
        })
    });

    describe('dotaccess', function () {
        var data = {};
        describe('set', function () {
            it('should set JSON parsable values/datatypes within a deeply nested object using "dot" notation.', function () {
                util.dot_set(data, 'a.a', 'asdf');
                util.dot_set(data, 'b.a', false);
                util.dot_set(data, 'c.a', 1);
                util.dot_set(data, 'd.a', /abc/g);
                data.a.a.should.equal('asdf');
                data.b.a.should.equal(false);
                data.c.a.should.equal(1);
                expect(data.d.a).to.eql(/abc/g);
                expect(util.isRegExp(data.d.a)).to.eql(true);
            });
            it('should not override data already set by default.', function () {
                util.dot_set(data, 'a.a', 'asdf2');
                data.a.a.should.equal('asdf');
                //util.dot_get(data, 'a.a')
            });
            it('should override data if the overide parameter is true.', function () {
                util.dot_set(data, 'a.a', 'asdf3', true);
                data.a.a.should.equal('asdf3');
            });
        });
        describe('get', function () {
            it('should retrieve a given value from a deeply nested array using "dot" notation.', function () {
                util.dot_get(data, 'a.a').should.equal('asdf3');
                util.dot_get(data, 'b.a').should.equal(false);
                util.dot_get(data, 'c.a').should.equal(1);
                expect(util.dot_get(data, 'd.a')).to.eql(/abc/g);
            });
            it('should be able to define a default value that will be returned if the path does not exists.', function () {
                util.dot_get(data, 'asdf.one', 'bar').should.equal('bar');
                util.dot_get(data, 'asdf.two', false).should.equal(false);
                util.dot_get(data, 'asdf.three', 1).should.equal(1);
                expect(util.dot_get(data, 'asdf.four', /abc/g)).to.eql(/abc/g);
            });
        });
        describe('unset', function () {
            it('should unset data', function () {
                util.dot_del(data, 'a.a');
                expect(data.a.a).to.be.undefined;
                expect(data.b.a).to.not.be.undefined;
            });
        });
    });
});
