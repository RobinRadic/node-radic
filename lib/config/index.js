var _ = require('lodash'),
    path = require('path'),

    fs = require('fs'),
    fse = require('fs-extra'),
    util = require('./../util/index'),
    app = require('./../app');

/**
 * Configuration
 *
 * @class
 * @param {string} name - Name for this config
 * @param {object} [options] - Configuration options
 * @constructor
 * @example
 * var radic = require('radic'),
 *     config = new radic.Config('my-syper-app', {
 *          // optional configuration
 *          path: '/path/to/config/folder' // defaults to ~/.radic/config
 *     });
 *
 * config.set('c', { b: 'bar' });
 * config.get('c.b'); //> returns bar
 * config.get('c'); //> returns { b: 'bar' }
 * config.save(); //> configuration will be permanently saved to the config file.
 *
 * config.set('save', 'i will be saved synchronised', true);
 * config.set('save2', 'i will be saved asynchronised', function(){
 *      this.config.set('save3', 'and synchronised again', true);
 * });
 *
 */
function Config(name, options) {
    if (!util.defined(name)) throw new Error('radic Config cannot be created. Missing the required first parameter "name".');

    // process options
    this.options = options || {};
    _.defaults(this.options, {
        name: name,
        path: path.join(util.getUserHomeDir(), '.radic/config'),
        ext: '.json'
    });
    this.path = path.join(this.options.path, name + this.options.ext);

    // Ensure the given config file exists
    if (fs.existsSync(this.path) !== true) {
        fse.outputJSONSync(this.path, {});
    }

    this.config = fse.readJsonFileSync(this.path);

}
module.exports = Config;

/**
 * Set a configuration value
 * @param {string} path - The key/path, converts dot to child members
 * @param {any} value - The value. Supports all JSON allowable values
 * @param {boolean|function} [save] - Saves the current configuration to file if set to true. Can pass a function to make it write asynchronously
 */
Config.prototype.set = function (path, value, save) {
    save = save || false;

    //console.log('path', dotPath, 'value', value);
    var old = this.get(path);
    //console.log('old', old);
    if(typeof old === 'object'){
        value = _.merge(old, value);
    }
    //console.log('value', value);
    util.dot_set(this.config, path, value, true);
    if(typeof save === 'function'){
        this.save(save);
    } else if(save === true) {
        this.save();
    }
};

/**
 * Get a configuration item.
 *
 * @param {string} path - The key/path, converts dot to child members
 * @param {any} [defaults] - The default value if the config key does not exist
 * @returns {*}
 */
Config.prototype.get = function (path, defaults) {
    return util.dot_get(this.config, path, defaults);
};

/**
 * Deletes a configuration item.
 *
 * @param {string} path - The key/path, converts dot to child members
 * @param {boolean|function} [save] - Saves the current configuration to file if set to true. Can pass a function to make it write asynchronously
 * @returns {Config}
 */
Config.prototype.del = function (path, save) {
    save = save || false;

    util.dot_del(this.config, path);
    if(typeof save === 'function'){
        this.save(save);
    } else if(save === true) {
        this.save();
    }
    return this;
};

/**
 * Clears out the whole configuration.
 *
 * @param {boolean|function} [save] - Saves the current configuration to file if set to true. Can pass a function to make it write asynchronously
 * @returns {Config}
 */
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

/**
 * Save the current configuration to file.
 *
 * @param {function} [callback] - If given, it will asynchronously write the config file.
 * @returns {Config}
 */
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

