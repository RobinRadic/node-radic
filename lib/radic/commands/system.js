var radic = require('../index'),
    _ = require('lodash'),
    path = require('path'),
    sh = require('../sh'),
    bin = require('../binwraps'),
    util = require('../util/index');
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.command('system')
        .description('Shows system info')
        .usage('radic version minor', 'shows version')
        .method(function (cmd) {
            var disk = require('disk'),
                Monitor = require('monitor'),
                pm2 = require('pm2');

            var storage = {};


            // Physical disk devicesmap
            storage.devs = {};
            sh.execSync("lsblk | grep disk | awk '{print $1}'").stdout.split('\n').forEach(function(diskName){
                        if(diskName.length < 1) return;
                        var dev = '/dev/' + diskName;
                        try {
                            var diskData = disk.load(dev);
                            storage.devs[dev] = diskData;
                        }
                        catch(e){
                            cli.log.warn('could not load ' + dev + ': ' + e.message);
                        }
                        finally {
                            cli.log.debug('loaded ' + dev + ' information');
                            //util.log(dev, diskData);
                        }
            });
            cli.log('Found ' + _.toArray(storage.devs).length + ' physical disk devices');

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
            // Logical Volumes
            storage.lvms = {};
            sh.execSync("sudo lvdisplay | grep 'LV Path' | awk '{print $3}'").stdout.split('\n').forEach(function(lvPath){
                if(lvPath.length < 1) return;
                function lvi(colName, colNum) {
                    return sh.execSync("sudo lvdisplay " + lvPath + " | grep '" + colName + "' | awk '{print $" + colNum + "}'").stdout.replace(/\n/, '');
                }
                storage.lvms[lvPath] = {
                    path: lvi('LV Path', 3),
                    name: lvi('LV Name', 3),
                    vg: lvi('VG Name', 3),
                    uuid: lvi('LV UUID', 3),
                    writeAccess: lvi('LV Write Access', 4),
                    hostTime: lvi('LV Creation host, time', 5),
                    status: lvi('LV Status', 3),
                    size: lvi('LV Size', 3)
                };
            });
            cli.log('Found ' + _.toArray(storage.lvms).length + ' logical volumes devices accros ' + _.toArray(storage.vgs).length + ' virtual groups');
            console.log(storage);


        });


}
