var path = require('path'),

    _ = require('lodash'),
    Datastore = require('nedb'),

    util = require('../util'),
    Model = require('./model'),
    app = require('../app');

/**
 * Database object. Creates and manages database files, models etc.
 *
 * @class
 * @param {string} name - The name of the database (and file)
 * @param {object} [options] - Database options
 * @constructor
 * @example
 * var db = new require('radic').DB('myfileDB4', {
 *     path: 'HOMEDIR/.radic/stores',
 *     ext: '.db',
 *     onLoaded: function(){}
 * });;
 *
 */
function DB(name, options){
    options = options || {};
    this.defaults = {
        path: path.join(app.path, 'stores'),
        name: name,
        ext: '.db',
        onLoaded: function(){}
    };
    this.options = _.extend({}, this.defaults, options);
    this._models = {};
    this._db = new Datastore(path.join(this.options.path, this.options.name + this.options.ext));
    this._db.loadDatabase(this.options.onLoaded);
}

/**
 * The Model class
 * @see {@link Model}
 * @type {Model|exports}
 */
DB.Model = Model;
module.exports = DB;

/**
 * Get or define a model
 * @param {string} name - The name of the model
 * @param {object} schema - The model schema. Uses schema-inspector
 * @returns {Model}
 * @throws Error
 * @see {@link http://atinux.github.io/schema-inspector|Schema inspector documentation}
 * @see {@link Model} for examples
 */
DB.prototype.model = function(name, schema){
    if(util.defined(schema)){
        return this._models[name] = new Model(name, schema, this._db);
    } else if(this.hasModel(name)) {
        return this._models[name];
    } else {
        throw new Error('Could not get model "' + name + '".')
    }
};

/**
 * Checks if a model with the given name has been defined
 * @param {string} name - The name for the model
 * @returns {boolean} - Returns true if model is defined, otherwise false
 */
DB.prototype.hasModel = function(name){
    return util.defined(this._models[name]);
};
