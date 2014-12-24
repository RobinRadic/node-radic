/**
 * Exports all objects for external libraries to use.
 * @module radic
 * @author Robin Radic
 * @copyright MIT
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
    /** Utility functions */
    util: util,
    Config: Config
};

