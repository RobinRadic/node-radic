var APIClient = require('./apiclient'),
    githubRoutes = require('./routes/github'),
    util = require('../util/index'),
    _ = require('lodash'),
    app = require('../app'),
    config = app.config;


function GithubClient(user, pass){
    user = user || config.get('credentials.github.username');
    pass = pass || config.get('credentials.github.password');
    APIClient.call(this, githubRoutes);
    var credentials = user + ':' + pass;
    this.curl = require('./curl')(credentials, 'https://api.github.com');
}
util.inherits(GithubClient, APIClient);
module.exports = GithubClient;

GithubClient.prototype.request = function(args, fields, req) {
    console.log(args, fields, req);
    args = [].slice.call(args);
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : this.callback;
    fields.forEach(function (p, i) {
        if (typeof args[i] != null) {
            req[p] = args[i];
        }
    });

    util.log('req', req, req.path, 'args', args, 'fields', fields);
    this.curl.get(req.path, req, callback);

    /*var transport = decorate(Object.create(this.transport), {
        path: req.path,
        data: req
    });

    return transport.send(callback);*/
};
