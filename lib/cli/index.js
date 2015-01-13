var path = require('path'),
    _ = require('lodash'),

    chalk = require('chalk'),

    util = require('../util'),
    app = require('../app'),

    celeri = require('./_celeri'),
    Command = require('./command'),
    Table = require('./table'),

    inquirer = require('inquirer');

/**
 * @namespace cli
 * @example
 * #!/usr/bin/env node
 * var radic = require('../lib'),
 *     cli = radic.cli;
 *
 * cli.command('version OR version :type')
 *    .description('Shows current version')
 *    .usage('radic version minor', 'shows version')
 *    .method(function (cmd) {
 *        if (typeof cmd.type === 'undefined') {
 *            cli.writeln(radic.app.version);
 *        } else {
 *            cli.log.ok('Yeah we done that');
 *            cli.log.debug('But this aswell');
 *        }
 *    });
 *
 * cli.parse(process.argv);
 */
var cli = {
    _commands: [],
    _usage: 'app [command] --optional=value',
    _title: '',
    _logFile: false,
    enableDebug: true,
    autoexit: false
};
module.exports = cli;

var chalkStyles = ['reset', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite'];
_.each(chalkStyles, function(style){
    cli[style] = chalk[style];
});

/**
 * Create a table from pre-defined styles
 * @param {string} [style=default] - Style to use for this table
 * @param {string} [design=default] - Design to use for this table
 * @param {object} [options] - Options
 * @memberOf cli
 * @returns {Table}
 * @see {@link Table}
 * @example
 * var cli = require('radic').cli;
 * cli.table('default', 'borderless');
 */
cli.table = function (style, design, options) {
    return new Table(style, design, options)
};

/**
 * Create a new Command
 * @param expr
 * @memberOf cli
 * @returns {Command}
 */
cli.command = function (expr) {
    return new Command(expr, cli);
};

/**
 * Set the help usage message
 * @param msg
 */
cli.usage = function(msg){
    cli._usage = msg;
};

/**
 * Set the title, displayed in help
 * @param msg
 */
cli.title = function(msg){
    cli._title = msg;
};

/**
 * Parse an array of parameters and trigger the right command.
 * @param argv
 */
cli.parse = function (argv) {
    cli._commands.forEach(function (command) {

        var option = {
            command: command.command,
            description: cli.bold.cyan(command.description),
            optional: command.optional
        };

        if (typeof(command.usage) == 'object') {
            var table = cli
                .table('default', 'default')
                .percWidth([33, 66], 100)
                .head('Command', 'Description');
            //.percWidth([33, 66], 100);

            //t.push([cli.bold(cli.cyan('Command')), cli.bold('Description')]);

            _.each(command.usage, function (val, key) {
                table.push([key, val]);
            });
            //"\n" + 'parameters: ' + "[required] {optional}\n" +
            option.usage = "\n" + table.toString();
        }
        else if (typeof(command.usage) == 'string') {
            option.usage = command.usage;
        }

        if (typeof(command.optional) == 'object') {
            var optionalTable = this.table('default', 'borderless');
            _.each(command.optional, function (val, key) {
                optionalTable.push([key, val]);
            });
            option.usage += "\n\n" + cli.bold('Optional flags') + ":\n" + optionalTable.toString();
        }
        celeri.option(option, command.method);


    }.bind(this));

    celeri.title(cli._title);

    //console.log(utils.logSymbols.warn + 'asdf');
    celeri.usage(cli._usage);

    //_.contains(_.toArray(arg))
    celeri.parse(argv);

    if (cli.autoexit === true) {
        process.exit(1);
    }
};

cli.exit = function(exitCode){
    if(util.defined(exitCode) === false) exitCode = 1;
    process.exit(exitCode);
};

cli.prompt = inquirer.prompt;

var outputs = {
    ok: ["green", "√ "],
    info: ["cyan", "i "],
    warn: ["yellow", "! "],
    debug: ["blue", "＃"],
    error: ["red", "✖ "],
    fatal: ["red", "✖✖ "]
};
cli.log = function(){
    var args = _.toArray(arguments);
    var level, msg;
    level = args.length == 1 ? 'info' : args[0];
    msg = args.length == 1 ? args[0] : args[1];
    cli.log[level](msg);
};
cli.debug = function(msg){
    cli.log('debug', msg);
};
cli.write = function(msg){
    util.print(msg);
};
cli.writeln = function(msg){
    cli.write(msg + "\n");
};

/* Print status messsages */
_.each(outputs, function (opts, type) {
    cli.log[type] = function (msg) {

        if(cli._logFile !== false){

        }
        var output = outputs[type];
        output = chalk[output[0]](chalk.bold(output[1].toString()));
        if (type === 'debug') {
            if (cli.enableDebug === true) {
                cli.writeln(output + msg);
            }
        } else {
            cli.writeln(output + msg);
        }
        if (type == 'fatal') process.exit();
    };
});
