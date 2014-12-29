var _ = require('lodash'),
    curl = require('./curl'),
    util = require('./../util'),
    config = require('../app').config;


var c, bcurl, gcurl, burl, gurl;

var defaults = {
    user: {
        repos: {
            type: 'all',
            sort: 'full_name',
            direction: 'asc'
        }
    },
    repos: {
        create: {
            description: 'a repo',
            has_issues: true,
            has_wiki: false
        }
    }
};
function opts(options, defaults) {
    options = options || {};
    return _.extend(options, defaults);
}
var providers = {
    bitbucket: {
        user: {
            repos: function(options, cb){
                options = opts(options, defaults.repos.create);
                //bcurl.post(burl + '/repositories/' + owner + '/' + name, options, cb);

            }
        },
        repos: {
            create: function (owner, name, options, cb) {
                options = opts(options, defaults.repos.create);
                options.name = name;
                bcurl.post('repositories/' + owner + '/' + name, options, cb);
            }
        }
    },
    github: {
        user: {
            repos: function(options, cb){
                options = opts(options, defaults.user.repos);
                gcurl.get('user/repos', options, cb);
            }
        },
        repos: {
            create: function (owner, name, options, cb) {
                options = opts(options, defaults.repos.create);
                options.name = name;
                if (owner.toLowerCase() === c.github.username.toLowerCase()) {
                    gcurl.post('user/repos', options, cb);
                } else {
                    gcurl.post('orgs/' + owner + '/repos', options, cb);
                }
            }
        }
    }
};


module.exports = function (provider) {
    c = config.get('git.providers');

    bcurl = curl(c.bitbucket.username + ':' + c.bitbucket.password, 'https://bitbucket.org/api/2.0');
    gcurl = curl(c.github.username + ':' + c.github.password, 'https://api.github.com');

    return providers[provider];
};
