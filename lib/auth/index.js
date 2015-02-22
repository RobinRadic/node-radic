var radic = require('../'),
    util = radic.util,

    config = radic.app.config,

    fs = require('fs-extra'),
    path = require('path'),
    stormpath = require('stormpath');



function getHomeDir() {
    var home = process.env[ (process.platform === 'win32' ? 'USERPROFILE' : 'HOME') ];
    return home + '/.stormpath/apiKey.properties';
}


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


function setup(){
    var isConfigured = config.get('auth.isConfigured');
    if(!isConfigured){
        fs.ensureDirSync('')
    }
}

function login() {

}

