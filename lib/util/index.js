'use strict';
var _util = require('util'),
    path = require('path'),
    os = require('os'),

    fs = require('fs-extra'),
    chalk = require('chalk'),
    _ = require('lodash'),
    ini = require('ini');

function util() {

}
_util._extend(util, _util);
module.exports = util;

_.extend(util, require('./general'));
_.extend(util, require('./dotaccess'));
