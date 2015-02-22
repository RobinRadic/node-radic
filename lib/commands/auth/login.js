var radic = require('../../'),
    config = radic.app.config,
    sh = radic.sh,
    util = radic.util,

    pm2 = require('pm2'),
    fs = require('fs-extra'),
    _ = require('lodash'),
    path = require('path');


/**
 * @param {cli} cli
 */
module.exports = function (cli) {


    cli.command('login')
        .description('Login')
        .usage({
            'service [command] ': '[list|kill]'
        })
        .optional('')
        .custom("\n")
        .method(function (cmd) {
            var stormpath = require('stormpath');
            var apiPath = config.get('auth.apiPath');
            if(!apiPath){
                var home = process.env[ (process.platform === 'win32' ? 'USERPROFILE' : 'HOME') ];
                apiPath = home + '/.stormpath/apiKey.properties';
                config.set('auth.apiPath', apiPath);
            }
            var client;
            stormpath.loadApiKey(apiPath, function apiKeyFileLoaded(err, apiKey){
                if(err){
                    cli.log.fatal(err);
                }
                client = new stormpath.Client({apiKey: apiKey});
            })
        });

}
