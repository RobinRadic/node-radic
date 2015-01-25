var Download = require('download'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    util = require('../util/index');

module.exports = Download;

Download.prototype.res = function (url, res, cb) {
    var ret = [];
    var len = 0;
    var filePath = path.resolve(this._dest, path.basename(url));
    var wstream = fs.createWriteStream(filePath);
    fs.writeFileSync(filePath, '');
    if (res.statusCode < 200 || res.statusCode >= 300) {
        var err = new Error([
            'Couldn\'t connect to ' + url,
            '(' + res.statusCode + ')'
        ].join(' '));

        err.code = res.statusCode;
        res.destroy();
        cb(err);
        return;
    }

    res.on('error', cb);
    res.on('data', function (data) {
        //ret.push(data);
        wstream.write(data);
        // fs.appendFileSync(filePath, data);
        len += data.length;
    });

    this.ware.run(res, url);

    res.on('end', function () {
        //fs.copySync(filePath + '.tmp', path.resolve(this._dest, path.basename(url)));
        wstream.end();
        cb(null, {
            path: path.basename(url),
            // contents: Buffer.concat(ret, len),
            url: url
        });
    }.bind(this));
};
