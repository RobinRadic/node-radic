var _ = require('lodash'),
    fse = require('fs-extra'),
    fs = require('fs'),
    async = require('async'),
    path = require('path');



var res = module.exports;


/**
 * Resolves a path within the resources folder
 * @param {string} loc - The path you want to go to inside the resource foilder
 * @returns {string} full path to file within resource folder
 */
function rdir(loc){
    return path.resolve(__dirname, '../resources', loc)
}

/**
 * Resolves a path within the project directory
 * @param {string} loc - The path relative to the project directory
 * @returns {string} full path to the given path
 */
function todir(loc){
    return path.resolve(process.cwd(), loc)
}

res.dest = todir;
res.path = rdir;

res.copy = function(resourcePath, projectPath){
    fse.copySync(rdir(resourcePath), todir(projectPath))
};

res.template = function(resourcePath, projectPath, data){
    if(typeof data !== 'object'){
        data = projectPath;
        projectPath = resourcePath;
    }
    data = data || {};
    var raw = fs.readFileSync(rdir(resourcePath));
    var template = _.template(raw, data);
    fs.writeFileSync(todir(projectPath), template, 'utf-8');
};

res.fileList = function(resourcePath){
    return fs.readdirSync(rdir(resourcePath));
};
