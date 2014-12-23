var path = require('path'),
    fs = require('fs-extra'),
    util = require('./util');

module.exports = function () {
    function App(){
        this.path = path.join(util.getUserHomeDir(), '.radic');
        fs.ensureDirSync(this.path);
        util._extend(this, require('../package'));
    }


    App.prototype.get = function(name){
        return require('./' + name);
    };

    return new App();
}.call();
