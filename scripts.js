#!/usr/bin/env node
var path = require('path'),
    exec = require('child_process').exec,
    async = require('async'),
    _ = require('lodash'),
    fs = require('fs'),
    fse = require('fs-extra'),

    radic = require('./lib');

var args = process.argv;
console.log(args);


var ascmd = function(cmd){
    return function(next){
        exec(cmd, function(err, stdin, stdout){
            next(err);
        });
    }
};

if (args[2] === 'publish') {
    var type = args[3]; // major, minor, patch
    var version;

    async.waterfall([
        function(next){
            exec('npm version ' + type, function(err, stdin, stdout){
                next(err);
            });
        },
        function(next){
            var pkg = fse.readJsonFileSync(path.join(__dirname, 'package.json'));
            version = pkg.version;
            exec('git push -u origin v' + version, function(err, stdin, stdout){
                next(err);
            });
        },
        function(next){
            exec('commit v' + version, function(err, stdin, stdout){
                next(err);
            });
        },
        function(next){
            exec('npm publish', function(err, stdin, stdout){
                next(err);
            });
        }
    ], function(err, result){
        if(err) throw new Error(err);
        console.log('done');
    });
}
