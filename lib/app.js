var path = require('path'),
    fs = require('fs-extra'),
    util = require('./util'),
    Config = require('./config');

module.exports = function () {
    function App(){
        this.path = path.join(util.getUserHomeDir(), '.radic');
        fs.ensureDirSync(this.path);
        util._extend(this, require('../package'));
        this.config = new Config('radic');

    }

    App.prototype.get = function(name){
        return require('./' + name);
    };

    return new App();
}.call();
