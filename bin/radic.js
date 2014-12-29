#!/usr/bin/env node
var radic = require('../lib'),
   cli = radic.cli;



cli.command('version OR version :when :type')
    .description('Shows current version')
    .usage('asdfasdf')
    .method(function (cmd) {
        if (typeof cmd.type === 'undefined') {
            console.log(radic.app.version);
        } else {
            var when = cmd.when === 'next' ? 1 : 0; // next or current
            when = cmd.when === 'previous' ? -1 : when; // previous or keep

            var part = cmd.type === 'minor' ? 1 : 2; // minor or patch
            part = cmd.type === 'major' ? 0 : part; // major or keep

            console.log(parseInt(radic.app.version.split('.')[part]) + when);
        }
    });


cli.log.ok(radic.app.config.get());

cli.usage('radic [command] --optionals');
cli.parse(process.argv);


