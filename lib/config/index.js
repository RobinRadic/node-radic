var Configstore = require('configstore'),
    _ = require('lodash'),
    path = require('path'),

    fs = require('fs'),
    fse = require('fs-extra'),
    util = require('./../util/index'),
    app = require('./../app');


function Config(name, options) {
    if (!util.defined(name)) throw new Error('radic Config cannot be created. Missing the required first parameter "name".');

    // process options
    this.options = options || {};
    _.defaults(this.options, {
        name: name,
        path: path.join(util.getUserHomeDir(), '.radic/config')
    });
    this.path = path.join(this.options.path, name + '.json')

    // Ensure the given config file exists
    if (fs.existsSync(this.path) !== true) {
        fse.outputJSONSync(this.path, {});
    }

    this.config = fse.readJsonFileSync(this.path);
}
module.exports = Config;

Config.prototype.set = function (dotPath, value, save) {
    save = save || false;

    //console.log('path', dotPath, 'value', value);
    var old = this.get(dotPath);
    //console.log('old', old);
    if(typeof old === 'object'){
        value = _.merge(old, value);
    }
    //console.log('value', value);
    util.dot_set(this.config, dotPath, value, true);
    if(typeof save === 'function'){
        this.save(save);
    } else if(save === true) {
        this.save();
    }
};

Config.prototype.get = function (dotPath, defaults) {
    return util.dot_get(this.config, dotPath, defaults);
};

Config.prototype.del = function (dotPath, save) {
    save = save || false;

    util.dot_del(this.config, dotPath);
    if(typeof save === 'function'){
        this.save(save);
    } else if(save === true) {
        this.save();
    }
    return this;
};

Config.prototype.clear = function (save) {
    save = save || false;
    this.config = {};
    if(typeof save === 'function'){
        this.save(save);
    } else if(save === true) {
        this.save();
    }
    return this;
};


Config.prototype.save = function (callback) {
    var self = this;
    callback = callback || false;
    if (typeof callback === 'function') {
        fse.outputJson(this.path, this.config, function(err){
            callback.call(self, err)
        })
    } else {
        fse.outputJsonSync(this.path, this.config);
    }
    return this;
};

