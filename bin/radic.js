#!/usr/bin/env node
var radic = require('../lib'),
    _ = require('lodash'),
    cli = radic.cli;

require('../lib/commands')(cli);
cli.title('  |  ' + cli.green.bold('radic') + '  | ' + cli.yellow(radic.app.version) + ' |');

cli.usage('radic [command] ' + cli.gray('[[subcommands]]'));
cli.parse(process.argv);



sh.exec('VBoxManage createvm --name MyVM --register --basefolder ' + path.resolve(__dirname, '../myvm'));

radic.vboxmanage('createvm', {
    name: 'MyVM',
    register: true,
    basefolder: path.resolve(__dirname, '../myvm')
});


