'use strict';
var _util = require('util'),
    path = require('path'),
    fs = require('fs-extra'),
//fs = require('fs'),
    chalk = require('chalk'),
    _ = require('lodash'),
    ini = require('ini'),
    os = require('os');

function util() {

}
_util._extend(util, _util);
module.exports = util;

_util.log = function () {
    var args = _.toArray(arguments);
    _.each(args, function (arg, i) {
        if (typeof arg === 'string') {
            if (i === 0) {
                args[i] = chalk.bold.green(arg);
            } else {
                args[i] = chalk.yellow(arg);
            }
        } else if (typeof arg !== 'undefined') {
            args[i] = this.inspect(arg, {hidden: true, colors: true, depth: 5});
        } else {
            args[i] = chalk.bold.cyan(' else: ' + typeof arg);
        }
    }.bind(this));
    console.log.apply(console, args);
};

util.getUserHomeDir = function () {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

util.defined = function (val) {
    return typeof val !== 'undefined';
};

util.resolveUserData = function () {
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

    var dir = this.getUserHomeDir();
    if (os.type() === 'Linux') {
        // we search for ~/.gitconfig, ~/.npmrc, ~/.composer/auth.json
        var paths = {
            git: path.join(dir, '.gitconfig'),
            npm: path.join(dir, '.npmrc'),
            composer: path.join(dir, '.composer/auth.json')
        };
        if (fs.existsSync(paths.git)) {
            var gitconfig = ini.parse(fs.readFileSync(paths.git, 'utf-8'));
            if (this.defined(gitconfig.user.email)) {
                data.email = gitconfig.user.email;
            }
            if (this.defined(gitconfig.user.name)) {
                data.name = gitconfig.user.name;
            }
        }
        if (fs.existsSync(paths.npm) && data.email.length == 0) {
            var npmconfig = ini.parse(fs.readFileSync(paths.npm, 'utf-8'));
            if (this.defined(npmconfig.email)) {
                data.email = npmconfig.email;
            }
        }
        if (fs.existsSync(paths.composer)) {
            var cconfig = fse.readJSONFileSync(paths.composer);
            if (this.defined(cconfig['http-basic'])) {
                _.each({github: 'github.com', bitbucket: 'bitbucket.org'}, function (provider, key) {
                    if (this.defined(cconfig['http-basic'][provider])) {
                        data[key].username = cconfig['http-basic'][provider].username || ''
                        data[key].password = cconfig['http-basic'][provider].password || ''
                    }
                }.bind(this));
            }
        }

    }
    return data;
};

util.check = function () {
    var args = _.toArray(arguments);
    _.each(args, function (arg, i) {
        args[i] = this.inspect(arg, {hidden: true, colors: true, depth: 5})
    }.bind(this));
    console.log.apply(console, args);
};




function getGitRemoteUrl(name, api, prefix) {
    prefix = prefix || '';
    var url = 'https://' + prefix;
    if (api && name == 'github') {
        url += 'api.github.com';
    } else if (api && name == 'bitbucket') {
        url += 'bitbucket.org/api/2.0'
    } else {
        url += name + (name === 'github' ? '.com' : '.org')
    }
    return url;
}

var configFilePath = path.join(util.getUserHomeDir(), '.radicrc');

function getConfig() {
    return fse.readJsonFileSync(configFilePath, {throws: false});
}
function writeConfig(content) {
    fse.outputJSONSync(configFilePath, content);
}

