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

if (args[2] === 'jsdoc2') {
    var readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
    var jsdocReadme = readme
        .replace(/\`\`\`[\w]{1,}/g, '<pre class="prettyprint">')
        .replace(/\`\`\`\n/g, '</pre><br>');
    fs.writeFileSync(path.join(__dirname, '_README.md'), jsdocReadme, 'utf-8');
    exec('jsdoc -c ./jsdoc.json ./_README.md');
    //fs.unlinkSync(path.join(__dirname, '_README.md'));
}

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

if (args[2] === 'docs') {
    var msg = args[3];

    var cwd = process.cwd();
    function chdirReset(){
        process.chdir(cwd);
    }

    async.waterfall([
        //ascmd('npm run-script coverage'),
        //ascmd('npm run-script doc'),
        function(next){
            var fm = fs.readFileSync(path.join(__dirname, 'docs/_index'), 'utf-8');
            var readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8')
                .replace('# radic', fm)
                .replace(/```(?=\w)(\w*)/g, '{% highlight $1 %}')
                .replace(/```\n/g, '{% endhighlight %}\n');

            fse.outputFileSync(path.join(__dirname, 'docs/index.md'), readme, 'utf-8');
            process.chdir(path.join(__dirname, 'docs'));
            next(null);
        },
        ascmd('git add -A'),
        ascmd('git commit -m "' + msg + '"'),
        ascmd('git push -u origin gh-pages'),
        function(next){
            chdirReset();
            next();
        }
    ], function(err, result){
        if(err) throw new Error(err);

        console.log('done');
    });
}

if (args[2] === 'cover') {

    var istanbul = require('istanbul');
    var RadicReport = require('./istanbul-radic-report');


    var Report = istanbul.Report;
    Report.register(RadicReport);

    var report = Report.create('radic', { dir: path.join(__dirname, 'docs/coverage' )}),
        collector = new istanbul.Collector;


    //radic.util.log('getit', report);
    //radic.util.log('report', );
    collector.add(JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/coverage/coverage.json'), 'utf8')));

    report.on('done', function () { console.log('done'); });
    report.writeReport(collector, true, function () { console.log('done'); });


}
