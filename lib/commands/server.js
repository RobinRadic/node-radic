var radic = require('../'),
    path = require('path'),
    sh = require('../sh'),
    util = require('../util'),
    pm2 = require('pm2');
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    var serviceCommand = 'server [' + cli.yellow('server all') + '] [' + cli.yellow('server all') + ']';
    cli.command('server OR server :command OR server :service :command')
        .description('Manage radic server services')
        .usage({
            'server [command] ': 'list|kill',
            'server [service] [command] ': 'services: all|monitor|webui\ncommands: stop|restart|delete|reload|reload-gracefull|describe'
        })
        .method(function (cmd) {
            if(util.defined(cmd.command)){
                switch(cmd.command){
                    case "list":
                        process.argv[2] = 'list';
                        require('../../node_modules/.bin/pm2');
                       // cli.writeln(sh.execSync(rootPath('node_modules/.bin/pm2') + ' list').stdout.replace('Use `pm2 info <id|name>` to get more details about an app\n', ''));
                        break;

                }
            } else if(util.defined(cmd.name) && util.defined(cmd.action)) {
                switch (cmd.name) {
                    case "all":         proc('all', cmd.action); break;
                    case "monitor":     proc('monitor', cmd.action, srvPath('monitor.js')); break;
                    case "webui":       proc('webui', cmd.action, srvPath('webui.js')); break;
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
