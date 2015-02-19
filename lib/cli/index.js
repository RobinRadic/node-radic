var path = require('path'),
    _ = require('lodash'),

    chalk = require('chalk'),

    util = require('../util'),
    app = require('../app'),

    celeri = require('./_celeri'),
    Command = require('./commands/command'),
    generator = require('./commands/generator'),
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
var cli = module.exports = {
    _commands: [],
    _usage: 'app [command] --optional=value',
    _title: '',
    _subtitles: [],
    _logFile: false,
    enableDebug: false,
    autoexit: false
};

/**
 * Integrates all chalk styles into the cli object, making it possible to use chalk functions using `cli`
 * @memberOf cli
 * @type {string[]}
 * @example
 * cli.writeln(cli.bold('This is bold ') + cli.blue.bgGreen.bold('Chainable as if it is chalk'));
 */
var chalkStyles = ['reset', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite'];
_.each(chalkStyles, function (style) {
    cli[style] = chalk[style];
});


var art = require('ascii-art');
cli.art = art;
cli.art.fontPath = path.resolve(__dirname, 'art-fonts');

cli.header = function (string, callback) {
    art.font(string, 'Basic', 'red', callback)
};

/**
 * Generate a tree
 * @param str
 * @returns {str} tree - The generated tree
 */
cli.tree = function (str) {
    return require('ascii-tree').generate(str);
};

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
 * @param {string} expr - The commmand expression
 * @memberOf cli
 * @returns {Command}
 */
cli.command = function (expr) {
    return new Command(expr, cli);
};

/**
 * Generate a new Command
 * @param {string} type - The commmand expression
 * @memberOf cli
 * @returns {Command}
 */
cli.generateCommand = function () {
    var args = _.toArray(arguments);
    var type = args.splice(0, 1);
    var gargs = args;
    //util.log('args', args, 'type', type, 'gargs', gargs);
    return generator[type].apply(cli, gargs);
};

/**
 * Set the help usage message
 * @param {string} msg - The message to write
 */
cli.usage = function (msg) {
    cli._usage = msg;
};

/**
 * Set the title, displayed in help
 * @param {string} msg - The message to write
 */
cli.title = function (msg) {
    cli._title = msg;
};

cli.subtitle = function (str) {
    cli._subtitles.push(str);
};

/**
 * Parse an array of parameters and trigger the right command.
 * @param {array} argv - The command line arguments to parse
 * @example
 * cli.parse(process.argv);
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

        if (typeof command.custom === 'string') {
            option.usage += '\n' + command.custom;
        }

        celeri.option(option, command.method);


    }.bind(this));

    celeri.title(cli._title);
    celeri.subtitles(cli._subtitles);

    //console.log(utils.logSymbols.warn + 'asdf');
    celeri.usage(cli._usage);

    //_.contains(_.toArray(arg))
    celeri.parse(argv);

    if (cli.autoexit === true) {
        process.exit(1);
    }
};

/**
 * Stops/halts
 * @param {int} [exitCode=0] - Exitcode to exit with
 */
cli.exit = function (exitCode) {
    if (util.defined(exitCode) === false) exitCode = 1;
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

/**
 * Writes a log message to the terminal
 * @example
 * cli.log('Haaai'); // equals cli.log.info
 * cli.log.ok('Haaai');
 * cli.log.info('Haaai');
 * cli.log.warn('Haaai');
 * cli.log.debug('Haaai'); // only shows if cli.debug is true
 * cli.log.error('Haaai');
 * cli.log.fatal('Haaai'); // Will also exit (cli.exit) the process
 */
cli.log = function () {
    var args = _.toArray(arguments);
    var level, msg;
    level = args.length == 1 ? 'info' : args[0];
    msg = args.length == 1 ? args[0] : args[1];
    cli.log[level](msg);
};

/**
 * Equals cli.log.debug('');
 * @param {string} msg - The message to write
 */
cli.debug = function (msg) {
    cli.log('debug', msg);
};

/**
 * Writes a string in the terminal
 * @param {string} msg - The message to write
 */
cli.write = function (msg) {
    process.stdout.write(msg);
};

/**
 * Writes a string in the terminal followed by a newline
 * @param {string} msg - The message to write
 */
cli.writeln = function (msg) {
    msg = msg || '';
    cli.write(msg + "\n");
};

/** clear the cli */
cli.clear = function () {
    process.stdout.write = '\u001B[2J\u001B[0;0f'
};

/* Print status messsages */
_.each(outputs, function (opts, type) {
    cli.log[type] = function (msg) {

        if (cli._logFile !== false) {

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
