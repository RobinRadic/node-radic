/**
 * Exports all objects for external libraries to use.
 * @module radic
 * @type {exports.exec}
 */

var exec = require('child_process').exec,
    path = require('path'),

    async = require('async'),
    fs = require('fs-extra'),
    _ = require('lodash'),

    app = require('./app'),
    util = require('./util'),
    Config = require('./config');



module.exports = {
    /** Application data */
    app: app,

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
    util: util,

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
    git: require('./git'),


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
    cli: require('./cli'),

    /**
     *  VirtualBox manager api
     *  @see {@link vboxmanage}
     */
    vboxmanage: require('./vboxmanage'),

    /**
     * The database class
     * @see {@link DB}
     * @example
     * var radic = require('radic'),
     *     db = new radic.DB('fileDB2');
     */
    DB: require('./db'),

    /**
     * The config class
     * @see {@link Config}
     * @example
     * var radic = require('radic'),
     *     config = new radic.Config('myconf');
     */
    Config: Config
};

