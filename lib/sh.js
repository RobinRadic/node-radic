var execsync = require('execSync'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    temp = require('temp'),
    heredoc = require('heredoc'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    util = require('./util');


// Automatically track and cleanup files at exit
temp.track();


/**
 * @namespace sh
 */
var sh = module.exports;

/**
 * Execute a command
 *
 * @param command
 * @param args
 * @param ops
 * @param callback
 * @returns {*}
 */
sh.exec = exec;
sh.exec2= function (command, args, ops, callback) {

    if (typeof args == 'function') {
        callback = args;
        args = [];
        ops = {};
    } else if (!(args instanceof Array)) {
        callback = ops;
        ops = args;
        args = [];
    }


    if (typeof ops == 'function') {
        callback = ops;
        ops = {};
    }

    //no callbacks? THEY MUST EXIST!!!!
    if (!callback) callback = ops.callback || ops;

    var callbacks = {};

    if (typeof callback != 'function') {
        callbacks = callback;
    }

    if (!callbacks.error) callbacks.error = function () {
    };
    if (!callbacks.exit) callbacks.exit = function () {
    };
    if (!callbacks.data) callbacks.data = function () {
    };


    var procOps = {
        cwd: ops.cwd,
        env: ops.env,
        customFds: ops.customFds
    };


    var proc = spawn(command, ops.args || args, procOps), errors = [], buffer = [];

    proc.stdout.on('data', function (data) {
        buffer.push(data);

        callbacks.data(data);
    });

    proc.stderr.on('data', function (data) {
        errors.push(data);

        callbacks.error(data);
    });

    proc.on('exit', function (code) {

        if (typeof callback == 'function') {
            callback(errors.length ? errors.join(' ') : false, buffer.length ? buffer.join(' ') : false);
        } else if (callbacks.exit) {
            callbacks.exit(code);
        }
    });

    return proc;

};

/**
 * Execute a command on the command line, synchronously
 * @returns {object} - Result of the execution.
 * @example
 * var result = radic.sh.execSync('echo $USER; echo some_err 1>&2; exit 1');
 * console.log('return code ' + result.code);
 * console.log('stdout + stderr ' + result.stdout);
 */
sh.execSync = function () {
    return execsync.exec.apply(sh, _.toArray(arguments))
};

/**
 * Similair to execSync, but instead does not capture output, only the exit code
 * @param cmd
 * @param exitOnlyOnError
 * @returns {int} exitcode
 */
sh.run = function (cmd, exitOnlyOnError) {
    return execsync.run(cmd + exitOnlyOnError === true ? '1>&2; exit 1' : '');

};

/**
 * Execute an inline bash script
 * @param {string|function} script - the inline script
 * @param {function} [asyncCallback] - If provided, the function will execute asynchronously
 * @returns {*}
 * @example
 var result;

 result = radic.sh.inlineScript('echo "hai"\n\
 echo "bai" \n\
 echo "draai"');
 console.log(result.code);
 console.log(result.stdout);


 result = radic.sh.inlineScript(function(){/*
        echo "hai"
        echo "bai"
        echo "draai"
        #apt-cache search mono
        *\/});
 console.log(result.code);
 console.log(result.stdout);
 */
sh.inlineScript = function (script, asyncCallback) {
    var async = typeof asyncCallback === 'function';
    var tmp = temp.openSync('radic_inline_script');

    fs.writeSync(tmp.fd, (typeof script === 'function' ? heredoc(script) : script));
    fs.closeSync(tmp.fd);
    return execsync.exec('chmod +x ' + tmp.path + ' && bash ' + tmp.path);


};
