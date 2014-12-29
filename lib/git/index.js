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

var resolveUserData = function () {
    var data = {
        email: '',
        name: '',
        github: {
            username: '',
            password: ''
        },
        bitbucket: {
            username: '',
            password: ''
        }
    };

    var dir = util.getUserHomeDir();
    if (os.type() === 'Linux') {
        // we search for ~/.gitconfig, ~/.npmrc, ~/.composer/auth.json
        var paths = {
            git: path.join(dir, '.gitconfig'),
            npm: path.join(dir, '.npmrc'),
            composer: path.join(dir, '.composer/auth.json')
        };
        if (fs.existsSync(paths.git)) {
            var gitconfig = ini.parse(fs.readFileSync(paths.git, 'utf-8'));
            if (util.defined(gitconfig.user.email)) {
                data.email = gitconfig.user.email;
            }
            if (util.defined(gitconfig.user.name)) {
                data.name = gitconfig.user.name;
            }
        }
        if (fs.existsSync(paths.npm) && data.email.length == 0) {
            var npmconfig = ini.parse(fs.readFileSync(paths.npm, 'utf-8'));
            if (util.defined(npmconfig.email)) {
                data.email = npmconfig.email;
            }
        }
        if (fs.existsSync(paths.composer)) {
            var cconfig = fse.readJSONFileSync(paths.composer);
            if (util.defined(cconfig['http-basic'])) {
                _.each({github: 'github.com', bitbucket: 'bitbucket.org'}, function (provider, key) {
                    if (util.defined(cconfig['http-basic'][provider])) {
                        data[key].username = cconfig['http-basic'][provider].username || ''
                        data[key].password = cconfig['http-basic'][provider].password || ''
                    }
                }.bind(util));
            }
        }

    }
    return data;
};

function git() {
    git.config = config.get('git');
}
module.exports = git;

git.getApi = function (provider) {
    return api(provider);
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
