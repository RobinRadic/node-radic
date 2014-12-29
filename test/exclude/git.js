var path = require('path'),
    fs = require('fs-extra'),

    async = require('async'),
    _ = require('lodash'),

    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),

    chaiConfig = require('./../helpers/config'),

    sinon = require('sinon'),
    EventEmitter = require('eventemitter2').EventEmitter,

    radic = require('../../lib/index');


describe('git', function () {


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
});
