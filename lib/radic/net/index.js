var Download = require('radic/net/download'),
    util = require('radic/util'),
    progress = require('download-status'),
    _ = require('lodash'),
    path = require('path'),
    async = require('async');


function _download(url, destDir, opts, callback) {
    var download = new Download(_.merge({extract: false, strip: 1, mode: '755'}, opts))
        .dest(path.resolve(destDir))
        .get(url)
        .use(progress());

    download.run(function (err, files, stream) {
        if (err) {
            throw err;
        }

        if (typeof callback === 'function') {
            callback(err, files, stream);
        }
    });
}


/**
 * @namespace net
 */
var net = module.exports;
var ll = console.log;


/**
 * Download one or more files, with progressbar
 * @see {@link https://github.com/request/request#requestoptions-callback} Possible options accepted by the request module
 *
 * @param {string|array} url - Either a URL or an array of URL's
 * @param {string} destDir - Path to destination directory
 * @param {object|function} opts - Options or callback
 * @param {function} [callback] - Callback
 */
net.download = function (url, destDir, opts, callback) {

    if(typeof callback === 'undefined'){
        callback = opts;
        opts = {};
    }
    //console.log(path.resolve(path.dirname(dest)));
    //console.log(path.basename(dest));
    // https://github.com/request/request#requestoptions-callback

    /*
    For some reason async.each doesnt work as it should.
     */
    if (_.isArray(url)) {
        var falls = [];
        _.forEach(url, function (link, i) {
            falls.push(function(next){
                _download(link, destDir, opts, function () {
                    next();
                });
            })
        });
        async.waterfall(falls, function (err) {
            if (err) throw err;
            callback(err);
        });
    } else {
        _download(url, destDir, opts, callback);
    }
};
