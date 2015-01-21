var _ = require('lodash'),
    util = require('./util'),
    exec = require('child_process').exec,
    sh = require('./sh');


var commands = [
    'zip',
    '7z',
    'ifconfig',
    'git',
    'lsblk',
    'apt-cache',
    'composer',
    'unzip',
    'blkid',
    'lvm',
    'gzip',
    'vagrant',
    'VBoxManage'
];

/**
 * @constructs
 * @func blkid
 * @func zip
 */
var bw = module.exports;
bw.autoSyncExec = true;

/**
 * @func blkid
 * @func zip
 */
bw.sudo = {};
bw.sudo.autoSyncExec = true;

var createBinWrap = function (key, cmd){
    var self = this;
    this[key + 'Sync'] = function(){
        var cm = util.createExecString(cmd, _.toArray(arguments));
        console.log('cm', cm);
        return sh.execSync(cm);
    };
    this[key] = function(){
        if(self.autoSyncExec == true){
            return self[key + 'Sync'].apply(self, arguments);
        }
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

bw.createBinWrap = function(cmd){
    createBinWrap.call(bw, cmd, cmd);
    createBinWrap.call(bw.sudo, cmd, 'sudo ' + cmd);
}

commands.forEach(function(cmd){
    bw.createBinWrap(cmd);
});


//console.log(bw.sudo.blkid().stdout);

//console.log(bw);
