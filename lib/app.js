var path = require('path'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    util = require('./util'),
    semver = require('semver'),
    Config = require('./config');

var configVersion = '1.0.0';
var configDefaults = {
    resources: {
        activeDir: path.resolve(__dirname, '..', 'resources')
    },
    textEditorCommand: 'storm'
};



var app = module.exports = function () {
    function App(){
        this.path = path.join(util.getUserHomeDir(), '.radic');
        fs.ensureDirSync(this.path);
        util._extend(this, require('../package'));
        this.config = new Config('radic');
        if(util.defined(this.config.get('configversion')) === false || semver.lt(this.config.get('configversion'), configVersion)){
            this.config.config = _.merge(configDefaults, this.config.config);
            this.config.set('configversion', configVersion);
            this.config.save();
        }
    }

    App.prototype.get = function(name){
        return require('./' + name);
    };



    return new App();
}.call();
