var _ = require('lodash'),
    util = require('./util'),
    exec = require('child_process').exec,
    sh = require('./sh');

var bw = module.exports;

bw.createBinWrap = function (cmd){
    bw[cmd + 'Sync'] = function(){
        return sh.execSync(util.createExecString(cmd, _.toArray(arguments)));
    };
    bw[cmd] = function(){
        var args = _.toArray(arguments);
        var callback;
        _.forEach(args, function (arg, i) {
            if (typeof arg === 'function' && args.length === (i + 1)) {
                callback = arg;
            }
        });
        if (typeof callback !== 'function') {
            throw new Error(cmd + ' requires a callback')
        }
        exec(util.createExecString(cmd, args), function (err, stdout, stderr) {
            callback(err, stdout);
        });
    };
};

var commands = [
    'zip',
    '7z',
    'git',
    'apt-cache',
    'composer',
    'sudo',
    'unzip',
    'gzip',
    'vagrant',
    'VBoxManage'
];

commands.forEach(function(cmd){
    bw.createBinWrap(cmd);
});
