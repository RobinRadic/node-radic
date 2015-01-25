/**
 * Exports all objects for external libraries to use.
 * @module radic
 * @type {exports.exec}
 */

var exec = require('child_process').exec,
    path = require('path'),

    async = require('async'),
    fs = require('fs-extra'),
    _ = require('lodash');



module.exports = {
    /** Application data */
    app: require('./app'),

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
    util: require('./util/index'),

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
    binwraps: require('./binwraps'),

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
    git: require('./git/index'),

    /**
     * Shell interaction
     * @see {@link sh}
     */
    sh: require('./sh'),

    /**
     * Cli functions
     * @see {@link cli}
     *
     */
    cli: require('./cli/index'),

    /**
     * Network functions
     * @see {@link net}
     */
    net: require('./net/index'),

    /**
     * The database class
     * @see {@link DB}
     * @example
     * var radic = require('radic'),
     *     db = new radic.DB('fileDB2');
     */
    DB: require('./db/index'),

    /**
     * The config class
     * @see {@link Config}
     * @example
     * var radic = require('radic'),
     *     config = new radic.Config('myconf');
     */
    Config: require('./config/index')
};

