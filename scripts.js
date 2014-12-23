#!/usr/bin/env node
var path = require('path'),
    exec = require('child_process').exec,
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
