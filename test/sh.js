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
    sh = radic.sh,
    git = radic.git;


describe('sh', function () {

    describe('execute commands synchronous', function(){
        var result = sh.execSync('echo yo');
        it('executes a command', function(){
            expect(result.code).to.equal(0, 'The command should return the exit code 0');
            assert.isString(result.stdout);
        });
    });

    describe('inline bash script', function(){
        var result = sh.execSync('echo yo');
        it('executes a inline script synchronously using regular string notation', function(){

            result = sh.inlineScript('echo "hai"\n\
 echo "bai" \n\
 echo "draai"');
            console.log(result.code);
            console.log(result.stdout);

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
