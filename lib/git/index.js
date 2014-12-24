var exec = require('child_process').exec,
    _ = require('lodash'),
    api = require('./api');

function createCallback(callback) {
    return function (error, stdout, stderr) {
        if (error !== null) {
            callback(error, stderr);
        }
        callback(null, stdout);
    }
}

function git() {

}
module.exports = git;

git.getApi = function (provider) {
    return api[provider];
};

git.init = function init(cb) {
    exec('git init', createCallback(cb));
};

git.addAll = function commit(cb) {
    exec('git add -A', createCallback(cb));
};

git.commit = function commit(message, cb) {
    exec('git commit -m "' + message + '"', createCallback(cb));
};

git.push = function push(remote, branch, cb) {
    exec('git push -u "' + remote + '" "' + branch + '"', createCallback(cb));
};

git.remote = {
    add: function (type, url, cb) {
        exec('git remote add ' + type + ' ' + url, createCallback(cb));
    }
};
