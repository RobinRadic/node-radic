var Datastore = require('nedb');
var path = require('path'),
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
 */
function Model(name, schema, db){
    this.name = name;
    this.schema = schema;
    this.db = db;
}
module.exports = Model;

Model.prototype.create = function(data, callback){
    //util.log('345345 data', data);
    //util.log('-------------------------------------');
    inspector.sanitize(this.schema, data);
    //util.log('sanitized data', data);
    inspector.validate(this.schema, data, function (err, result) {
        //util.log('valdated', err, result, result.format());
        if(err) return callback(err);
        if(result.valid !== true) return callback(result.error, result.format());
        //util.log('inserting data', data);

        this.db.insert(data, function(error, newDoc){
            //util.log('data inserted', typeof error, newDoc);
            callback(null, newDoc)
        });
    }.bind(this));
};

Model.prototype.remove = function(id, callback){
    this.get(id, function(err, doc){
        //util.log('remove get callback', id, err, doc);
        if(err) return callback(err);
        this.db.remove({ _id: id }, {}, callback);
    }.bind(this))
};

Model.prototype.edit = function(id, data, callback){

};

Model.prototype.get = function(id, callback){
    //util.log('getting', this.name, ' with id', id);
    this.db.findOne({ _id: id }, callback)
};

Model.prototype.getAll = function(callback){
    this.db.find({}, callback);
};
