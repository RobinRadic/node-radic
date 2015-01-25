var _ = require('lodash'),
    util = require('./util/index'),
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
 * @namespace binwraps
 * @example
 * var binwraps = radic.binwraps;
 * binwraps.createBinWrap('VBoxManage');
 *
 * var vbox = binwraps.vboxmanage;
 * var result = vbox('createvm', {
 *   name: ops.name,
 *   ostype: 'Debian_64',
 *   basefolder: path.resolve(process.cwd()),
 *   register: true
 * });
 * console.log(result.stdout, result.code);
 *
 * binwraps.autoSyncExec = false;
 * vbox('createvm', {
 *   name: ops.name,
 *   ostype: 'Debian_64',
 *   basefolder: path.resolve(process.cwd()),
 *   register: true
 * }, function(){
 *      // callllback
 * });
 *
 * var commands = binwraps.getCommands();
 * binwraps[ commands[0] ]('arg', { weed: 'bad' }); // just an example..
 */
var binwraps = module.exports = {};

/**
 * If true, executing a binwrapped function will be executed synchronously, without the need to use the 'xxxSync' function.
 * @type {boolean}
 */
binwraps.autoSyncExec = true;


binwraps.sudo = {};
binwraps.sudo.autoSyncExec = true;

var createBinWrap = function (key, cmd){
    var self = this;
    this[key + 'Sync'] = function(){
        var cm = util.createExecString(cmd, _.toArray(arguments));
        //console.log('cm', cm);
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

/**
 * Creates a new binwrapped object
 * @param {string} cmd - The executable name
 */
binwraps.createBinWrap = function(cmd){
    if(typeof binwraps[cmd] === 'undefined') {
        createBinWrap.call(binwraps, cmd, cmd);
        createBinWrap.call(binwraps.sudo, cmd, 'sudo ' + cmd);
        commands.push(cmd);
    }
    return binwraps[cmd];
};
binwraps.create = binwraps.createBinWrap;

/**
 * Returns all binwrapped commands
 * @returns {string[]}
 */
binwraps.getCommands = function(){
    return commands;
};

commands.forEach(function(cmd){
    binwraps.createBinWrap(cmd);
});


//console.log(bw.sudo.blkid().stdout);

//console.log(bw);
