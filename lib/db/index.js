var path = require('path'),
    util = require('../util'),
    Model = require('./model'),
    app = require('../app');

function DB(path, options){
    path = path || path.join(app.path, 'stores/' + name + '.db');
    options = options || {};
    this.defaults = {
        path: path
    };
    this.options = _.extend({}, this.defaults, options);
    this._models = {};
}

// Get or set models
DB.prototype.model = function(name, schema){
    if(util.defined(schema)){
        return this._models[name] = new Model(name, schema);
    } else if(this.hasModel(name)) {
        return this._models[name];
    } else {
        throw new Error('Could not get model "' + name + '".')
    }
};


DB.prototype.hasModel = function(name){
    return util.defined(this._models[name]);
};
