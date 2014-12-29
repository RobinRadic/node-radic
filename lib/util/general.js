var _ = require('lodash'),

    chalk = require('chalk');

exports.log = function () {
    var args = _.toArray(arguments);
    _.each(args, function (arg, i) {
        if (typeof arg === 'string') {
            if (i === 0) {
                args[i] = chalk.bold.green(arg);
            } else {
                args[i] = chalk.yellow(arg);
            }
        } else if (typeof arg !== 'undefined') {
            args[i] = this.inspect(arg, {hidden: true, colors: true, depth: 5});
        } else {
            args[i] = chalk.bold.cyan(' else: ' + typeof arg);
        }
    }.bind(this));
    console.log.apply(console, args);
};

exports.getUserHomeDir = function () {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

exports.defined = function (val) {
    return typeof val !== 'undefined';
};

// util/string
exports.ucfirst = function (str) {

    str += '';
    var f = str.charAt(0)
        .toUpperCase();
    return f + str.substr(1);
};

// util/cli
exports.getWindowWidthPercentage = function (percentage) {
    var width = process.stdout.getWindowSize()[0] - 10;
    return Math.floor((width / 100) * percentage);
};
