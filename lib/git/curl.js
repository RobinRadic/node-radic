'use strict';
var exec = require('child_process').exec;

function getNewError(mess, payload, err) {
    var ex = new Error(mess);
    ex.prevError = err;
    ex.payload = payload;
    return ex;
}

function parse(stdout, raw) {
    if (raw) {
        return {
            raw: stdout,
            lines: stdout.split('\n')
        };
    }
    if (stdout.indexOf('Oops! An error occurred.') !== -1) {
        throw getNewError(500, stdout);
    }
    if (stdout.indexOf('Not Found') !== -1) {
        throw getNewError(404, stdout);
    }
    if (stdout.indexOf('HTTP/1.1 204 NO CONTENT') !== -1) {
        return null;
    }
    try {
        return JSON.parse(stdout);
    } catch (e) {
        throw getNewError('Parse error', stdout, e);
    }
}

function run(command, raw, cb) {
    // console.log(command);
    exec(command, function (error, stdout, stderr) {
        try {
            var response = parse(stdout, raw);
            cb(null, response);
        } catch (e) {
            console.log(e.message, e, stderr);
            cb(e, null);
        }
    })
        .on('error', function (err) {
            cb(err, null);
        });
}

module.exports = function(credentials) {

    return {
        get: function (url, data, cb, raw) {
            var command = "curl --GET --user " + credentials + " " + url;
            if (cb) {
                var datums = data.split('&');
                datums.forEach(function (d) {
                    command += " --data " + d;
                });
            } else {
                cb = data;
            }
            run(command, raw, cb);
        },

        post: function (url, data, cb, raw) {
            var command = "curl --user " + credentials + " " + url + " -H \"Content-Type: application/json\" --data '" + JSON.stringify(data) + "'";
            //console.log(command);
            run(command, raw, cb);
        },

        put: function (url, data, cb, raw) {
            if (!data) {
                data = '""';
            }
            var command = "curl --request PUT --user " + credentials + " " + url + " -H \"Content-Type: application/json\" --data '" + JSON.stringify(data) + "'";
            run(command, raw, cb);
        },

        del: function (url, cb, raw) {
            var command = "curl --request DELETE --user " + credentials + " " + url;
            run(command, raw, cb);
        }
    };
};


