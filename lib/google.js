var
    _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    temp = require('temp'),

    app = require('./app'),
    config = app.config,
    util = require('./util'),
    cli = require('./cli');


var open = require("open");
var _google = require('googleapis');
var createAPIRequest = require('../node_modules/googleapis/lib/apirequest');

/**
 * @namespace google
 */
var google = module.exports = {};

/**
 *
 * @type {{contacts: {readwrite: string, readonly: string}}}
 */
google.scopes = {
    contacts: {
        readwrite: 'https://www.google.com/m8/feeds/contacts',
        readonly: 'https://www.googleapis.com/auth/contacts.readonly'
    }
};

/**
 *
 * @type {{get: Function}}
 */
google.contacts = {
    /**
     *
     * @param params
     * @param callback
     * @returns {Request|*|exports}
     */
    get: function (params, callback) {
        var parameters = {
            options: {
                url: google.scopes.contacts.readonly, //'https://www.googleapis.com/oauth2/v2/userinfo',
                method: 'GET'
            },
            params: params,
            requiredParams: [],
            pathParams: [],
            context: self
        };

        return createAPIRequest(parameters, callback);
    }
};

var OAuth2 = _google.auth.OAuth2;


/**
 *
 * @memberOf google
 * @param clientId
 * @param clientSecret
 * @param redirectUrl
 * @returns {OAuth2|*}
 */
google.getClient = function (clientId, clientSecret, redirectUrl) {
    if (util.defined(google._client)) {
        return google._client;
    }
    var creds = config.get('credentials.google.oauth');
    if (!util.defined(clientId)) {
        clientId = creds.client_id;
    }
    if (!util.defined(clientSecret)) {
        clientSecret = creds.client_secret;
    }
    if (!util.defined(redirectUrl)) {
        var r = creds.redirect;
        redirectUrl = r.protocol + "://" + r.host + (typeof r.port === 'number' ? ':' + r.port : '') + "/" + r.uri;
    }
    google._client = new OAuth2(clientId, clientSecret, redirectUrl);

    return google._client;
};

/**
 *
 * @param scope
 * @param callback
 */
google.authorize = function (scope, callback) {
    var client = google.getClient();

    var redirect = config.get('credentials.google.oauth.redirect');

    // Create an temporary http server to intercept the code after redirect
    var http = require('http');
    var server = http.createServer(function (req, res) {
        if (req.url.indexOf('oauth2callback') === -1) return res.end();
        var code = req.url.replace('/oauth2callback?code=', '');

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Nice ouwe!\n');

        cli.log('Got code: ' + code);
        server.unref();
        server.close(function () {
            cli.log('Closed server');
        });
        client.getToken(code, function (err, tokens) {
            if (err) cli.log.fatal(err);
            client.setCredentials(tokens);
            callback(tokens);
        });
    });
    server.listen(redirect.port, redirect.host);
    cli.log('Server running at http://127.0.0.1:31337/');

    // Generate the url
    var url = client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        scope: scope // can be a space-delimited string or an array of scopes
    });

    // Visit the url
    cli.log.warn('Attempting to open browser');
    cli.log('Otherwise, manually open url: ' + cli.cyan(url));
    open(url);
    /*
     // Use the returned code to get the token
     cli.prompt({ type: 'input', name: 'code', message: 'Enter the code' }, function(answers){
     console.log(answers);
     client.getToken(answers.code, function(err, tokens){
     if(err) cli.log.fatal(err);
     client.setCredentials(tokens);
     callback(tokens);
     });
     });*/
}
