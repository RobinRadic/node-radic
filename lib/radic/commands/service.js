var
    path = require('path'),
    sh = require('radic/sh'),
    util = require('radic/util'),
    pm2 = require('pm2');


/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    var tree = cli.tree('#' + cli.green.bold('Available services information') + '\n' +
    '##monitor              - Monitors hardware/software on this machine. Is required for monitor-dashboard and remote connections\n' +
    '##monitor-dashboard    - Starts a local web-server (http://localhost:4200/) that reads the system performance\n' +
    '##services-dashboard   - Starts a local web-server (http://0.0.0.0:9000/) that can be used to control radic services\n');

    cli.command('service OR service :command OR service :name :command')
        .description('Manage radic services')
        .usage({
            'service [command] ': '[list|kill]',
            'service [name] [command] \n ': 'name:     [all|monitor|process-dashboard|monitor-dashboard]\n' +
                                            'command:  [stop|restart|delete|reload|reload-gracefull|describe]'
        })
        .optional('')
        .custom("\n" + tree)
        .method(function (cmd) {
            if(util.defined(cmd.name) === false && util.defined(cmd.command)){
                switch(cmd.command){
                    case "kill":
                        process.argv[2] = 'kill';
                        require('.bin/pm2');
                        break;
                    case "list":
                        process.argv[2] = 'list';
                        require('.bin/pm2');
                        break;

                }
            } else if(util.defined(cmd.name) && util.defined(cmd.command)) {
                switch (cmd.name) {
                    case "all":                     proc('all', cmd.command); break;
                    case "monitor":                 proc('monitor', cmd.command, srvPath('monitor.js')); break;
                    case "monitor-dashboard":       proc('monitor-dashboard', cmd.command, srvPath('monitor-dashboard.js')); break;
                    case "services-dashboard":       proc('services-dashboard', cmd.command, srvPath('services-dashboard.js')); break;
                }
            }

        });

    function srvPath(srvpath) {
        return path.resolve(__dirname, '../..', 'srv', srvpath);
    }
    function rootPath(rootpath){
        return path.resolve(__dirname, '../..', rootpath);
    }

    function pm2action(cmd, name, cb){
        pm2.connect(function (err) {
            pm2[cmd](name, function (err, proc) {
                if (err) throw new Error('err');
                if(proc.success === true){
                    cli.log.ok(cmd + ' ' + name + ' success');
                } else {
                    cli.log.warn(cmd + ' ' + name + ' not successfull');
                    console.log(proc);
                }
                cli.exit();
            });
        });
    }
    function proc(name, action, scriptPath){
        switch(action){
            case "start":
                if(util.defined(scriptPath) === false) return;
                pm2.connect(function (err) {
                    pm2.start(scriptPath, {name: name}, function (err, proc) {
                        if (err) throw new Error('err');
                        if(proc.success === true){
                            cli.log.ok(name + ' ' + action + ' success');
                        } else {
                            //cli.log.warn(name + ' ' + action + ' not successfull');
                        }
                        cli.exit();
                    });
                });
                break;
            case "restart":
                pm2action('restart', name);
                break;
            case "stop":
                pm2action('stop', name);
                break;
            case "delete":
                pm2action('delete', name);
                break;
            case "reload":
                pm2action('reload', name);
                break;
            case "reload-gracefull":
                pm2action('gracefulReload', name);
                break;
            case "describe":
                pm2action('describe', name);
                break;

        }
    }

}
