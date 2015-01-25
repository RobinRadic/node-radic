'use strict';
var _util = require('util'),
    path = require('path'),
    os = require('os'),

    fs = require('fs-extra'),
    chalk = require('chalk'),
    _ = require('lodash'),
    ini = require('ini');

/**
 * @module radic/util
 */
var util = module.exports;
_util._extend(util, _util);

_.extend(util, require('radic/util/general'));
_.extend(util, require('radic/util/dotaccess'));
util.requireDirectory = require('radic/util/require-directory');
