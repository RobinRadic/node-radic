var app = require('../app'),
    sh = require('../sh'),
    _ = require('lodash'),
    util = require('../util'),
    config = app.config;
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.generateCommand('config', config);

};

