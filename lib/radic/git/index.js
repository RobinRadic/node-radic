var exec = require('child_process').exec,
    _ = require('lodash'),
    os = require('os'),
    app = require('../app'),
    util = require('../util/index'),
    sh = require('../sh'),
    binwraps = require('../binwraps'),
    config = app.config;

/**
 * Git command line api and github/bitbucket api.
 *
 * @namespace git
 * @returns {object} result - An object containing `code` as exitcode, `stdout` for output
 * @example
 // Simple command line api, basicly the same as vboxmanage. utilises util.createExecString
 // Commands are executed synchronously
 console.log(git('init').stdout);
 console.log(git('add', { A: true }).stdout);
 console.log(git('status').stdout);
 console.log(git('commit', { m: 'Testing 123'}).stdout);
 console.log(git('status').stdout);
 console.log(git('remote', 'add', 'origin', 'https://github.com/test/test').stdout);
 */
var git = module.exports = binwraps.create('git');

git.config = config.get('git');

/**
 * Get an API object for the given provider
 * @param {string} provider - The provider (bitbucket or github)
 * @returns {api}
 * @memberOf git
 */
git.getApi = function (provider) {
    return require('./' + provider);
};
