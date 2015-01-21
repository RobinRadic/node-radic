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
    DB = radic.DB,
    Model = DB.Model;

describe('DB', function () {
    var util = radic.util;
    var dbPath = __dirname;
    var dbName = 'testDB';
    var db;
    after(function(){
        fs.unlinkSync(path.join(dbPath, dbName + '.database'));
        fs.unlinkSync(path.join(dbPath, dbName + '.db'));

    });
    describe('create', function () {
        function testFile(filePath, cb){
            fs.exists(filePath, function(exists){
                expect(exists).to.eql(true);
                cb();
            })
        }
        it('should create a database file in the given path', function(done){
            db = new DB(dbName, { path: dbPath, onLoaded: function(){
                testFile(path.join(dbPath, dbName + '.db'), done);
            }});
        });
        it('should create a database file with the given extension', function(done){
            var db2 = new DB(dbName, { path: dbPath, ext: '.database', onLoaded: function(){
                testFile(path.join(dbPath, dbName + '.database'), done);
            } });
        });
    });

    describe('models', function(){
        var person;
        it('should define models', function(){
            db.model('person', {
                type: 'object',
                properties: {
                    lorem: { type: 'string', eq: 'ipsum' },
                    dolor: {
                        type: 'array',
                        items: { type: 'number' }
                    }
                }
            });
            assert.instanceOf(db._models.person, Model, 'person is an instance of Model');
        });
        it('should get defined models', function(){
            person = db.model('person');
            assert.instanceOf(person, Model, 'person is an instance of Model');
        });
        it('should validate on creation of records', function(done){
            person.create({
                lorem: 'will fail',
                dolor: [1, 2, 44]
            }, function(err){
                expect(err).to.not.eql(null);
                done();
            });
        });
        var id;
        it('should create a record and return the new record', function(done){
            person.create({
                lorem: 'ipsum',
                dolor: [1, 2, 44]
            }, function(err, doc){
                expect(err).to.eql(null);
                expect(doc._id).to.be.a('string');
                id = doc._id;
                done();
            });
        });
        it('should get records', function(done){
            person.get(id, function(err, doc){
                expect(err).to.eql(null);
                expect(doc._id).to.eql(id);
                expect(doc.lorem).to.eql('ipsum');
                expect(doc.dolor).to.eql([1, 2, 44]);
                done();
            })
        });
        it('should remove records', function(done){
            person.remove(id, function(err, removed){
                expect(err).to.eql(null);
                expect(removed).to.eql(1);
                done();
            })
        });
    });

});
