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
    Config = radic.Config;

chai.use(chaiConfig);

describe('Config', function () {
    var config = new Config('testing', {
        path: __dirname
    });
    var configFilePath = path.join(__dirname, 'testing.json');

    // Remove generated config file
    after(function () {
        fs.unlinkSync(configFilePath);
    });

    describe('construct', function () {
        it('requires the name parameter to be set', function(){
            var errored = false;
            try {
                var testcfg = new Config();
            } catch (e) {
                errored = true;
            }
            assert.isTrue(errored, 'should have thrown an error');
        });
        it('should create a new instance of Config', function () {
            should.exist(config);
            config.should.be.an('object');
            expect(config).to.be.a.config;
        });
        it('should overide the default options', function () {
            should.exist(config.options);
            config.options.path.should.equal(__dirname);
        });
        it('should have set the file path', function () {
            should.exist(config.path);
            config.path.should.equal(configFilePath);
        });
        it('should have created a json config file', function () {
            should.exist(config.path);
            assert.isTrue(fs.existsSync(configFilePath), 'file exists');
            var file = fs.readFileSync(configFilePath, 'utf-8');
            try {
                JSON.parse(file);
            } catch (e) {
                assert.notOk(file, 'should parse into JSON')
            } finally {
                assert.ok(file, 'parses into json');
            }
        });

    });
    describe('setting and getting', function () {
        it('should set config values', function () {
            config.set('a', 'foo');
            config.config.a.should.equal('foo');

            config.set('b.a', 'foo');
            config.set('b.b', 'bar');
            config.config.b.a.should.equal('foo');
            config.config.b.b.should.equal('bar');

            config.set('c.a.a', 'foo');
            config.config.c.a.a.should.equal('foo');

            config.set('c.b.a', 1);
            config.config.c.b.a.should.equal(1);

            config.set('c.c', {a: 'foo', b: 'bar'});
            config.config.c.c.a.should.equal('foo');
            config.config.c.c.b.should.equal('bar');
        });
        it('should get the config values', function () {
            config.get('a').should.equal('foo');
            config.get('b.a').should.equal('foo');
            config.get('b.b').should.equal('bar');
            config.get('c.a.a').should.equal('foo');
            config.get('c.b.a').should.equal(1);
            config.get('c.c.a').should.equal('foo');
            config.get('c.c.b').should.equal('bar');
        });
        it('should merge the config values, overriding the values', function () {
            config.set('c', {
                a: {
                    b: {
                        a: 'foo'
                    }
                },
                b: {
                    a: 2,
                    b: 1
                },
                c: {
                    a: {
                        a: 'foo',
                        b: 'bar'
                    },
                    c: 'foobar'
                }
            });
            config.get('c.a.a').should.equal('foo');
            config.get('c.a.b.a').should.equal('foo');
            config.get('c.b.a').should.equal(2);
            config.get('c.b.b').should.equal(1);
            config.get('c.c.a.a').should.equal('foo');
            config.get('c.c.a.b').should.equal('bar');
            config.get('c.c.c').should.equal('foobar');
        });
        it('should unset the config values', function(){
            config.del('c.c.a');
            expect(config.get('c.c.a')).to.be.undefined;
            var backup = _.cloneDeep(config.config);
            config.clear();
            expect(config.get('a')).to.be.undefined;
            config.config = backup;
        });
        function tests(cfg) {
            cfg.a.should.equal('foo');
            cfg.b.a.should.equal('foo');
            cfg.b.b.should.equal('bar');
            cfg.c.a.a.should.equal('foo');
            cfg.c.a.b.a.should.equal('foo');
            cfg.c.b.a.should.equal(2);
            cfg.c.b.b.should.equal(1);
            cfg.c.c.c.should.equal('foobar');
            expect(cfg.c.c.a).to.be.undefined;
        }
        it('should save the config values', function (done) {
            var backup = _.cloneDeep(config.config);
            function load(){
                return fs.readJsonFileSync(configFilePath)
            }
            config.save();
            tests(load());
            config.config = _.cloneDeep(backup);

            async.waterfall([
                function(next){
                    config.save(function(){
                        tests(load());
                        next();
                    });
                },
                function(next){
                    config.set('d', {a:'foo', b:'bar'}, true);
                    var cfg = load();
                    tests(cfg);
                    cfg.d.a.should.equal('foo');
                    cfg.d.b.should.equal('bar');
                    next();
                },
                function(next){
                    config.set('e', {a:'foo', b:'bar'}, function(){
                        var cfg = load();
                        tests(cfg);
                        cfg.e.a.should.equal('foo');
                        cfg.e.b.should.equal('bar');
                        next();
                    });
                },
                function(next){
                    config.del('d', true);
                    var cfg = load();
                    tests(cfg);
                    expect(cfg.d).to.be.undefined;
                    next();
                },
                function(next){
                    config.del('e', function(){
                        var cfg = load();
                        tests(cfg);
                        expect(cfg.e).to.be.undefined;
                        next();
                    });
                },
                function(next){
                    config.clear(true);
                    expect(load().a).to.be.undefined;
                    config.config = _.cloneDeep(backup);
                    next();
                },
                function(next){
                    config.clear(function(){
                        expect(load().a).to.be.undefined;
                        config.config = _.cloneDeep(backup);
                        next();
                    });
                },
                function(next){
                    config.set('d', {a:'foo', b:'bar'}, true);
                    next();
                }
            ], function(err, result){
                done();
            });

        });
        it('should reuse the config file when constructed', function(){
            var newconfig = new Config('testing', {
                path: __dirname
            });
            newconfig.get('a').should.equal('foo');
            newconfig.get('b.a').should.equal('foo');
            newconfig.get('b.b').should.equal('bar');
            newconfig.get('c.a.a').should.equal('foo');
            newconfig.get('c.a.b.a').should.equal('foo');
            newconfig.get('c.b.a').should.equal(2);
            newconfig.get('c.b.b').should.equal(1);
            newconfig.get('c.c.c').should.equal('foobar');
        });
    });
});
