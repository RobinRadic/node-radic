var _ = require('lodash'),
    util = require('./util'),
    exec = require('child_process').exec,
    sh = require('./sh');


function createExecString(args) {
    var cmd = 'VBoxManage';
    _.forEach(args, function (arg, i) {
        if (typeof arg === 'string') {
            cmd += ' ' + JSON.stringify(arg);
        } else if (typeof arg === 'number') {
            cmd += ' ' + arg;
        } else if (typeof arg === 'object') {
            _.forEach(arg, function (opt, optk) {
                if (typeof opt === 'boolean') {
                    cmd += ' --' + optk;
                } else {
                    cmd += ' --' + optk + ' ' + JSON.stringify(opt);
                }
            });
        }
    });
    //console.log(cmd);
    return cmd;
}

/**
 * @returns {object} result - An object containing `code` and `stdout`
 */
function _vboxmanage() {
    return sh.execSync(createExecString(_.toArray(arguments)));
}

/**
 * Uses VBoxManage command to manage virtualboxes. Commands and options are straight from `VBoxManage --help `
 * @namespace vboxmanage
 * @example
 *
 * var radic = require('radic'),
 *     vm = radic.vboxmanage,
 *     async = require('async');
async.waterfall([
    function (next) {
        vm.async('createvm', {
            name: ops.name,
            ostype: 'Debian_64',
            basefolder: path.resolve(process.cwd()),
            register: true
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('modifyvm', ops.name, {
            pae: 'on',
            cpus: 6,
            memory: 4100,
            boot1: 'dvd',
            boot2: 'disk',
            boot3: 'none',
            boot4: 'none',
            vram: 12,
            rtcuseutc: 'on'
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('storagectl', ops.name, {
            name: 'IDE Controller',
            add: 'ide',
            controller: 'PIIX4',
            hostiocache: 'on'
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('storageattach', ops.name, {
            storagectl: 'IDE Controller',
            port: 1,
            device: 0,
            type: 'dvddrive',
            medium: path.resolve(process.cwd(), ops.dvddrive)
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('storagectl', ops.name, {
            name: 'SATA Controller',
            add: 'sata',
            controller: 'IntelAhci',
            sataportcount: 1,
            hostiocache: 'off'
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('createhd', {
            filename: path.resolve(process.cwd(), ops.hd),
            size: ops.hd_size
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('storageattach', ops.name, {
            storagectl: 'SATA Controller',
            port: 0,
            device: 0,
            type: 'hdd',
            medium: path.resolve(process.cwd(), ops.hd)
        }, function (err, stdout) {
            next(err)
        });
    },
    function (next) {
        vm.async('controlvm', ops.name, 'nic1', 'bridged', config.get('network_interface'), function (err, stdout) {
            next(err)
        });
    }
], function(err, res){
    // do something
})
 */
var vboxmanage = module.exports = _vboxmanage;


/**
 * Execute async
 */
vboxmanage.async = function () {
    var args = _.toArray(arguments);
    var callback;
    _.forEach(args, function (arg, i) {
        if (typeof arg === 'function' && args.length === (i + 1)) {
            callback = arg;
        }
    });
    if (typeof callback !== 'function') {
        throw new Error('vboxmanage.async requires a callback')
    }
    exec(createExecString(args), function (err, stdout, stderr) {
        callback(err, stdout);
    });

};

/*
 var result = vboxmanage('createvm', {
 name: 'vboxmanagetest',
 register: true,
 basefolder: require('path').resolve(__dirname, '..', 'test')
 });
 console.log(result.stdout);
 console.log(result.code);



 var result2 = vboxmanage('unregistervm', 'vboxmanagetest', {
 delete: true
 });
 console.log(result2.stdout);
 console.log(result2.code);

 //util.print(util.inspect(result));
 */
