


var exec = require('child_process').exec,
    path = require('path'),

    async = require('async'),
    fs = require('fs-extra'),
    _ = require('lodash');


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
 * Exports all objects for external libraries to use.
 * @module radic
 * @type {module.exports}
 */
module.exports = {
    /**
     * Application data
     * @see {@link App}
     * @type App
     * @instance
     */
    app: require('./app'),

    /**
     * Utility functions. Extends the native nodejs utilities module.
     * @see {@link util}
     * @type util
     */
    util: require('./util'),

    /**
     * Command wrapper. Wraps terminal commands.
     * @see {@link binwraps}
     * @type binwraps
     */
    binwraps: require('./binwraps'),

    /**
     * Git tools
     * @see {@link git}
     * @type git
     */
    git: require('./git'),

    /**
     * Google api tools
     * @see {@link google}
     * @type google
     */
    google: require('./google'),

    /**
     * Shell interaction
     * @see {@link sh}
     * @type sh
     */
    sh: require('./sh'),

    /**
     * Cli functions
     * @see {@link cli}
     * @type cli
     */
    cli: require('./cli'),

    /**
     * Network functions
     * @see {@link net}
     * @type net
     */
    net: require('./net'),

    /**
     * The database class
     * @see {@link DB}
     * @type DB
     */
    DB: require('./db'),

    /**
     * The config class
     * @see {@link Config}
     * @type Config
     */
    Config: require('./config'),

    /**
     * Lodash export
     * Not advisable to use, you should install it yourself
     * @see {@link https://lodash.com/docs}
     * @extends lodash
     * @type lodash
     */
    _: require('lodash'),

    /**
     * String manipulation helpers from underscore.string
     * Not advisable to use, you should install it yourself
     * @see {@link https://github.com/epeli/underscore.string}
     * @extends underscore.string
     * @type underscore.string
     */
    _s: require('underscore.string'),

    /**
     * tmp export
     * Not advisable to use, you should install it yourself
     * @see {@link https://github.com/raszi/node-tmp}
     * @extends tmp
     * @type tmp
     */
    tmp: require('tmp'),

    /**
     * Async export
     * Not advisable to use, you should install it yourself
     * @see {@link https://github.com/caolan/async}
     * @extends async
     * @type async
     */
    async: require('async')
};
