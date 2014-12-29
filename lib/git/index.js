var exec = require('child_process').exec,
    _ = require('lodash'),
    os = require('os'),
    api = require('./api'),
    app = require('../app'),
    util = require('../util'),
    config = app.config;

function createCallback(callback) {
    return function (error, stdout, stderr) {
        if (error !== null) {
            callback(error, stderr);
        }
        callback(null, stdout);
    }
}

/**
 * @namespace git
 * @requires api
 */
var git = {
    config: config.get('git')
};

module.exports = git;

/**
 * Get an API object for the given provider
 * @param {string} provider - The provider (bitbucket or github)
 * @returns {api}
 * @memberOf git
 */
git.getApi = function (provider) {
    return api(provider);
};

/**
 * Initializes git in the current directory
 * @param cb
 */
git.init = function init(cb) {
    exec('git init', createCallback(cb));
};

/**
 * Adds all files
 * @param cb
 */
git.addAll = function commit(cb) {
    exec('git add -A', createCallback(cb));
};

/**
 *
 * @param message
 * @param cb
 */
git.commit = function commit(message, cb) {
    exec('git commit -m "' + message + '"', createCallback(cb));
};

/**
 * Pushes the commits
 * @param remote
 * @param branch
 * @param cb
 */
git.push = function push(remote, branch, cb) {
    exec('git push -u "' + remote + '" "' + branch + '"', createCallback(cb));
};

/**
 *
 * @type {{add: Function}}
 */
git.remote = {
    add: function (type, url, cb) {
        exec('git remote add ' + type + ' ' + url, createCallback(cb));
    }
};

/**
 * Checkout a branch
 * @param branchName
 * @param cb
 */
git.checkout = function(branchName, cb){
    exec('git checkout ' + branchName, createCallback(cb));
};
