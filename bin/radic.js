#!/usr/bin/env node
var radic = require('../lib'),
    cli = radic.cli;

cli.command('version OR version :type')
    .description('Shows current version')
    .usage('radic version minor', 'shows version')
    .method(function (cmd) {
        if (typeof cmd.type === 'undefined') {
            cli.writeln(radic.app.version);
        } else {
            cli.log.ok('Yeah we done that');
            cli.log.debug('But this aswell');
        }
    });

cli.command('test')
    .description('test')
    .usage('test')
    .method(function (cmd) {
        var result;

        result = radic.sh.inlineScript('echo "hai"\n\
        echo "bai" \n\
        echo "draai"');
        console.log(result.code);
        console.log(result.stdout);


        result = radic.sh.inlineScript(function(){/*
        echo "hai"
        echo "bai"
        echo "draai"
        #apt-cache search mono
        */});
        console.log(result.code);
        console.log(result.stdout);
    });
cli.parse(process.argv);


