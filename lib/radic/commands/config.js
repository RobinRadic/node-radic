var _ = require('lodash'),
    app = require('radic/app'),
    sh = require('radic/sh'),
    util = require('radic/util'),
    config = app.config;
/**
 * @module radic/commands/config
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.generateCommand('config', config);

};

