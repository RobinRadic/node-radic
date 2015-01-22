var _ = require('lodash'),

    chalk = require('chalk');


var general = module.exports = {
    log: function () {
        var args = _.toArray(arguments);
        _.each(args, function (arg, i) {
            if (typeof arg === 'string') {
                if (i === 0) {
                    args[i] = chalk.bold.green(arg);
                } else {
                    args[i] = chalk.yellow(arg);
                }
            } else if (typeof arg !== 'undefined') {
                args[i] = this.inspect(arg, {showHidden: true, colors: true, depth: 5});
            } else {
                args[i] = chalk.bold.cyan(' else: ' + typeof arg);
            }
        }.bind(this));
        console.log.apply(console, args);
    },

    /**
     * Get the full path to the user home directory
     *
     * @memberOf util
     * @returns {string} path - Path to the user home directory
     */
    getUserHomeDir: function () {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    },

    defined: function (val) {
        return typeof val !== 'undefined';
    },


    createExecString: function (cmd, args) {
        //console.log('cmd', cmd, 'args', args);
        _.forEach(args, function (arg, i) {
            if (typeof arg === 'string') {
                cmd += ' ' + JSON.stringify(arg);
            } else if (typeof arg === 'number') {
                cmd += ' ' + arg;
            } else if (typeof arg === 'object') {
                _.forEach(arg, function (opt, optk) {
                    var dashes = '--'; // --orphan
                    if(optk.length === 1){  // -m
                        dashes = '-';
                    }
                    if (typeof opt === 'boolean') {
                        cmd += ' ' + dashes + optk;
                    } else {
                        cmd += ' ' + dashes + optk + ' ' + JSON.stringify(opt);
                    }
                });
            }
        });
        //console.log(cmd);
        return cmd;
    },

// util/string
    ucfirst: function (str) {

        str += '';
        var f = str.charAt(0)
            .toUpperCase();
        return f + str.substr(1);
    },

// util/cli
    getWindowWidthPercentage: function (percentage) {
        var width = process.stdout.getWindowSize()[0] - 10;
        return Math.floor((width / 100) * percentage);
    }
}
