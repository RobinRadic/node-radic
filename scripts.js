#!/usr/bin/env node
var path = require('path'),
    exec = require('child_process').exec,
    async = require('async'),
    _ = require('lodash'),
    fs = require('fs'),
    fse = require('fs-extra');

var args = process.argv;
console.log(args);

if (args[2] === 'jsdoc2') {
    var readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
    var jsdocReadme = readme
        .replace(/\`\`\`[\w]{1,}/g, '<pre class="prettyprint">')
        .replace(/\`\`\`\n/g, '</pre><br>');
    fs.writeFileSync(path.join(__dirname, '_README.md'), jsdocReadme, 'utf-8');
    exec('jsdoc -c ./jsdoc.json ./_README.md');
    //fs.unlinkSync(path.join(__dirname, '_README.md'));
}


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
