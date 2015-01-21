#!/usr/bin/env node
var radic = require('../lib'),
    _ = require('lodash'),
    cli = radic.cli;

require('../lib/commands')(cli);
cli.title('  |  ' + cli.green.bold('radic') + '  | ' + cli.yellow(radic.app.version) + ' |');

cli.usage('radic [command] ' + cli.gray('[[subcommands]]'));
cli.parse(process.argv);

