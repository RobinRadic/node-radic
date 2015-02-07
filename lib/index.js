/**
 * Exports all objects for external libraries to use.
 *
 * @type {exports.exec}
 */

var exec = require('child_process').exec,
    path = require('path'),

    async = require('async'),
    fs = require('fs-extra'),
    _ = require('lodash');


/**
 * @param path
 * @returns {*}
 */
function radic(path) {
    try {
        return require('./' + path);
    }
    catch(err){
        try {
            return require('./../node_modules/' + path);
        }
        catch(err){
            throw new Error('radic("' + path + '") could not resolve into a valid module. Looked in both radic and radic node modules');
        }
    }
}

/**
 * @module
 */
module.exports = radic;

// Deprecated stuff.
/** Application data */
radic.app = require('./app');

/**
 * Utility functions. Extends the native nodejs utilities module.
 * @see {@link util}
 * @example
 * var radic = require('radic'),
 *     util = radic.util;
 *
 * util.inspect(util);
 * var value = util.dot_get(obj, 'path.to.value', 'default');
 */
radic.util = require('./util');

/**
 * Command wrapper. Wraps terminal commands.
 * @example
 * var radic = require('radic'),
 *     gzip = radic.binwraps.gzipSync,  // Each command has async and sync methods.
 *     zip = radic.binwraps.zip,        // Async command, just the binary name
 *     vagrant = radic.binwraps.vagrantSync;
 *
 * // Easily create wrappers for other commands
 * radic.binwrap.createBinWrap('yum');
 * var yum = radic.binwrap.yum,
 *     yumSync = radic.binwrap.yumSync;
 *
 * var result = vagrant('init');
 * console.log('Vagrant ran synchronously, returned exit code: ' + result.code + ' and output: ' + result.stdout);
 *
 * gzip({ c: true, d: true, suffix: 'myunpacked_'}, 'filename');
 * // equals gzip -c -d --suffix "myunpacked_" filename
 */
radic.binwraps = require('./binwraps');

/**
 * Git tools
 * @see {@link git}
 * @example
 * var radic = require('radic'),
 *     git = radic.git;
 *
 * git.init(function(err, output){ console.log(err, output); });
 * git.getApi('bitbucket').user.repos(null, function(err, data){
     *      data.forEach(function(repo){
     *          console.log(repo.id);
     *      });
     * });
 */
radic.git = require('./git');

/**
 * Google api tools
 * @see {@link google}
 *
 */
radic.google = require('./google');

/**
 * Shell interaction
 * @see {@link sh}
 */
radic.sh = require('./sh');

/**
 * Cli functions
 * @see {@link cli}
 * @type cli
 */
radic.cli = require('./cli');

/**
 * Network functions
 * @see {@link net}
 */
radic.net = require('./net');

/**
 * The database class
 * @see {@link DB}
 * @example
 * var radic = require('radic'),
 *     db = new radic.DB('fileDB2');
 */
radic.DB = require('./db');

/**
 * The config class
 * @see {@link Config}
 * @example
 * var radic = require('radic'),
 *     config = new radic.Config('myconf');
 */
radic.Config =  require('./config');

/**
 * Lodash export
 * Not advisable to use, you should install it yourself
 * @see {@link https://lodash.com/docs}
 * @type lodash
 */
radic._ = require('lodash');

/**
 * String manipulation helpers from underscore.string
 * Not advisable to use, you should install it yourself
 * @see {@link https://github.com/epeli/underscore.string}
 * @type underscore.string
 */
radic._s = require('underscore.string');

/**
 * tmp export
 * Not advisable to use, you should install it yourself
 * @see {@link https://github.com/raszi/node-tmp}
 * @type tmp
 */
radic.tmp = require('tmp');

/**
 * Async export
 * Not advisable to use, you should install it yourself
 * @see {@link https://github.com/epeli/underscore.string}
 * @type async
 */
radic.async = async;
