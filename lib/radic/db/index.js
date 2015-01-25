var path = require('path'),
    EventEmitter = require('eventemitter2').EventEmitter2,
    _ = require('lodash'),
    Datastore = require('nedb'),
    sqlite = require('sqlite3').verbose(),
    util = require('../util/index'),
    Model = require('./model'),
    app = require('../app');


var types = {};
types.sqlite = function(DB){
    return new sqlite.Database(DB._dbPath);
};

types.file = function(DB){
    var db = new Datastore(DB._dbPath); //{ filename: DB._dbPath, autoload: true });
    db.loadDatabase(DB.options.onLoaded);
    return db;
};
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
    EventEmitter.call(this, {
        maxListeners: 30,
        wildcard: true,
        newListener: true,
        delimiter: ':'
    });
    options = options || {};
    this.defaults = {
        path: path.join(app.path, 'stores'),
        type: 'file',
        name: name,
        ext: '.db',
        onLoaded: function(){}
    };
    this.options = _.extend({}, this.defaults, options);
    this._dbPath = path.resolve(this.options.path, this.options.name + this.options.ext);
    this._db = new Datastore(this._dbPath);
    this._models = {};
    this._db.loadDatabase(this.options.onLoaded);
}
util.inherits(DB, EventEmitter);
/**
 * The Model class
 * @see {@link Model}
 * @type {Model|exports}
 */
DB.Model = Model;
DB.types = types;
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
    if(this.options.type !== 'file') throw new Error('Models are only available for file type database. This is a ' + this.options.type + ' type');
    if(util.defined(schema)){
        this._models[name] = new Model(name, schema, this._db);
        this.emit('model.create.' + name);
        return this._models[name];
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
    if(this.options.type !== 'file') throw new Error('Models are only available for file type database. This is a ' + this.options.type + ' type');
    return util.defined(this._models[name]);
};
