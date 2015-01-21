'use strict';
var _util = require('util'),
    path = require('path'),
    os = require('os'),

    fs = require('fs-extra'),
    chalk = require('chalk'),
    _ = require('lodash'),
    ini = require('ini');

/**
 * @namespace util
 */
var util = module.exports;
_util._extend(util, _util);

_.extend(util, require('./general'));
_.extend(util, require('./dotaccess'));
util.requireDirectory = require('./require-directory');
