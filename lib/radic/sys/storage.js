var radic = require('../index'),
    _ = require('lodash'),
    path = require('path'),
    sh = require('../sh'),
    bin = require('../binwraps'),
    temp = require('temp'),
    disk = require('disk'),
    util = require('../util/index');

var storage = exports.data = {};

exports.scanAll = function(){

    exports.scanVirtualGroups();
    exports.scanLogicalVolumes();
    exports.scanPhysicalVolumes();
};

exports.scanVirtualGroups = function(){

    // Virtual Groups
    storage.vgs = {};
    var tmpVgs;
    sh.execSync("sudo lvm vgs  | tr -s ' ' | cut -d ' ' -f 1,2,3,4,5,6,7,8 --output-delimiter='|'").stdout.split('\n').forEach(function(vgLine, i){
        if(i === 0) return;
        var vgd = vgLine.replace('|', '').split('|');
        if(vgd.length < 2) return;

        storage.vgs[vgd[0]] = {
            name: vgd[0],
            physicalVolumes: vgd[1],
            logicalVolumes: vgd[2],
            sn: vgd[3],
            attributes: vgd[4],
            size: vgd[5],
            free: vgd[6]
        }
    });
};

exports.scanLogicalVolumes = function(){
    storage.lvms = {};
    var lvms = bin.sudo.lvm('lvdisplay').stdout.split('--- Logical volume ---');
    for(var i = 1; i < lvms.length; i++){
        var d = lvms[i];
        function glv(a){
            return d.match(new RegExp(a + '\\s*(.*)'))[1];
        }
        storage.lvms[glv('Path')] = {
            path: glv('Path'),
            name: glv('LV Name'),
            vg: glv('VG Name'),
            uuid: glv('UUID'),
            writeAccess: glv('LV Write Access'),
            creationHostTime: glv('LV Creation host, time'),
            status: glv('LV Status'),
            open: glv('# open'),
            size: glv('LV Size'),
            currentLe: glv('Current LE'),
            segments: glv('Segments'),
            allocation: glv('Allocation'),
            readAheadSectors: glv('Read ahead sectors'),
            rasTo: glv('- currently set to'),
            blockDevice: glv('Block device')

        }
    }
    console.log(storage);
};

exports.scanPhysicalVolumes = function(){
    storage.devs = {};
    sh.execSync("lsblk | grep disk | awk '{print $1}'").stdout.split('\n').forEach(function(diskName){
        if(diskName.length < 1) return;
        var dev = '/dev/' + diskName;
        try {
            var diskData = disk.load(dev);
        }
        catch(e){
            console.log(e.message);
        }
        finally {
            storage.devs[dev] = diskData;
        }
    });

};
exports.scanAll();
