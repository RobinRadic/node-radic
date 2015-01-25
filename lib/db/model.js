var Datastore = require('nedb');
var path = require('path'),
    EventEmitter = require('eventemitter2').EventEmitter,
    _ = require('lodash'),
    inspector = require('schema-inspector'),
    util = require('./../util');

function store(storePath, name){
    return path.join(storePath, name + '.db');
}

/**
 * The Model class
 *
 * @class
 * @param name
 * @param schema
 * @param db
 * @constructor
 * @example
 * var schema = {
 *     type: 'object',
 *     properties: {
 *         username: { type: 'string', eq: 'ipsum' },
 *         email: { type: 'string', eq: 'ipsum' },
 *         password: {
 *             type: 'array',
 *             items: { type: 'number' }
 *         }
 *     }
 * };
 *
 * // This
 * var radic = require('radic'),
 *     util = radic.util,
 *     db = new radic.DB('mydb2'),
 *     user = db.model('user', schema);
 *
 * // Or something like this
 * function MyModel(){
 *
 * }
 * util.inherits(MyModel, radic.DB.Model);
 *
 * var my = new MyModel('user', schema, db._db);
 */
function Model(name, schema, db){
    EventEmitter.call(this, {
        maxListeners: 30,
        wildcard: true,
        newListener: true
    });
    this.name = name;
    this.schema = schema;
    this.db = db;
}
util.inherits(Model, EventEmitter);
module.exports = Model;

function createErrorCallback(functionName, err, callback){
    this.emit(functionName + '.error', { error: err });
    return callback(err);
}
function createInvalidCallback(functionName, result, callback){
    this.emit(functionName + '.invalid', { error: result.error, format: result.format() });
    return callback(result.error, result.format());
}
function createSuccessCallback(functionName, data, callback){
    this.emit(functionName, { data: data });
    return callback(null, data);
}


/**
 * @event insert
 * @event
 * @callback Model~createCallback
 * @param {boolean|string|undefined|null} error - If there's an error, it will contain an error string
 * @param {object} newDoc - The created record/document after sanitation and insertion
 */
/**
 * Create a document/record
 * @param {object} data - key/value object containing all required data
 * @param {Model~createCallback} callback - the callback that handles the response
 * @fires Model#create.error - Fires if there's an error
 * @fires Model#create.invalid - Fires if invalid
 * @fires Model#create - Fires if successfull insert
 */
Model.prototype.create = function(data, callback){
    inspector.sanitize(this.schema, data);
    inspector.validate(this.schema, data, function (err, result) {
        /**
         * Error create event
         *
         * @event Model#create.error
         * @type {object}
         * @property {string} error - The error
         */
        if(err) return createErrorCallback.apply(this, 'create', err, callback);
        /**
         * Invalid create event
         *
         * @event Model#create.invalid
         * @type {object}
         * @property {string} error - The validation error
         * @property {string} format - Format
         */
        if(result.valid !== true) return createInvalidCallback.apply(this, 'create', result, callback);
        this.db.insert(data, function(error, newDoc){
            /**
             * Create event
             *
             * @event Model#create
             * @type {object}
             * @property {object} data - The record/document
             */
            createSuccessCallback.apply(this, 'create', newDoc, callback);
        });
    }.bind(this));
};

/**
 * @callback Model~removeCallback
 * @param {boolean|string|undefined|null} error - If there's an error, it will contain an error string
 */
/**
 * Remove a document/record
 * @param {string} id - The ID of the doc to delete
 * @param {Model~removeCallback} callback - the callback that handles the response
 */
Model.prototype.remove = function(id, callback){
    this.get(id, function(err, doc){
        if(err) return callback(err);
        this.db.remove({ _id: id }, {}, callback);
    }.bind(this))
};

Model.prototype.edit = function(id, data, callback){

};

Model.prototype.get = function(id, callback){
    this.db.findOne({ _id: id }, callback)
};

Model.prototype.getAll = function(callback){
    this.db.find({}, callback);
};
