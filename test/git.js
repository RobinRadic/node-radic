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

    radic = require('../lib'),
    git = radic.git;


describe('git', function () {

    describe('command line', function(){
        it('executes commands', function(){
            var result = git('version');
            expect(result.code).to.equal(0, 'The command should return the exit code 0');
            assert.isString(result.stdout);
        });
    });
/*
    describe('api', function () {

        function testApi(provider) {
            var api = radic.git.getApi(provider);
            describe(provider, function () {
                it('should get a list of repositories', function(done){
                    api.user.repos({}, function(err, data){
                        expect(err).to.equal(null, 'The error parameter should be of type "null"');
                        _.each(data, function(repo){
                            assert.typeOf(repo.id, 'number', 'The repository ID needs to be a number');
                        });
                        done();
                    })
                });
            });
        }

        testApi('github');
       // testApi('bitbucket');

    });
    */
});
