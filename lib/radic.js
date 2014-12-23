/**
 * radic.js exports all objects for external libraries to use.
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



var radic = module.exports = function(){
    return {
        app: app,
        util: util,
        Config: Config
    };
}.call();

