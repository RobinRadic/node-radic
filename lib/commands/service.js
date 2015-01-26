var radic = require('../'),
    sh = require('../sh'),
    util = require('../util'),
    pm2 = require('pm2'),
    fs = require('fs-extra'),
    _ = require('lodash'),
    path = require('path'),
    config = radic.app.config;


/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    var tree = cli.tree('#' + cli.green.bold('Available services information') + '\n' +
    '##monitor              - Monitors hardware/software on this machine. Is required for monitor-dashboard and remote connections\n' +
    '##monitor-dashboard    - Starts a local web-server (http://localhost:4200/) that reads the system performance\n' +
    '##services-dashboard   - Starts a local web-server (http://0.0.0.0:9000/) that can be used to control radic services\n');

    cli.command('service :action OR service :action :name')
        .description('Manage radic services')
        .usage({
            'service [command] ': '[list|kill]',
            'service [name] [command] \n ': 'name:     [all|monitor|process-dashboard|monitor-dashboard]\n' +
            'command:  [stop|restart|delete|reload|reload-gracefull|describe]'
        })
        .optional('')
        .custom("\n" + tree)
        .method(function (cmd) {

            switch (cmd.action) {
                case "list":
                    var services = config.get('services') || [];
                    if (!services || services.length == 0) {
                        cli.log.fatal('No services registered yet. Use ' + cli.yellow.bold('radic service register <name>'));
                    }

                    var treeStr = '#' + cli.green.bold('Registered services') + "\n";
                    _.each(services, function (service) {
                        treeStr += "##" + service.name + ' - ' + service.path;
                    });

                    var serviceTree = cli.tree(treeStr);
                    cli.writeln(serviceTree);
                    cli.writeln();
                    cli.writeln(cli.green.bold('Running services'));

                    process.argv[2] = 'list';
                    require('../../node_modules/.bin/pm2');
                    break;

                case "register":
                    if (!util.defined(cmd.name)) {
                        cli.log.fatal('No name defined. To register a service, use ' + cli.yellow.bold('radic service register <name>'))
                    }
                    cli.prompt([
                        {type: 'input', name: 'path', message: 'Script path (relative to this directory or full path)'}
                    ], function (op) {
                        var scriptPath = path.resolve(op.path);
                        var stat = fs.statSync(scriptPath);
                        if (!fs.existsSync(scriptPath) || stat.isFile() === false) {
                            cli.log.fatal('Could not find script ' + cli.bold.green(scriptPath));
                        }
                        var service = {name: cmd.name, path: scriptPath};
                        config.set('services.' + cmd.name, service, true);
                        cli.log.ok('Service ' + service.name);
                    });
                    break;

                case "unregister":
                    cli.prompt([
                        {type: 'list', name: 'name', message: 'Select service to unregister', choices: _.pluck(config.get('services'), 'name') }
                    ], function (op) {
                        var services = config.get('services.' + op.name);
                        if (!util.defined() == 0) {
                            cli.log.fatal('Service is already unregistered');
                        }

                        config.del('services.' + op.name, true);
                        pm2action('describe', op.name, function (err, proc) {
                            if (proc.length !== 0) {
                                pm2action('delete', op.name, function () {
                                    cli.log.ok('Removed service ' + op.name);
                                    cli.exit();
                                });
                            } else {
                                cli.exit();
                            }
                        });
                    });
                    break;

                default:
                    if (!util.defined(cmd.name)) {
                        cli.prompt([
                            {type: 'list', name: 'name', message: 'Select service?', choices: _.pluck(config.get('services'), 'name') }
                        ], function (op) {
                            cli.log('name: ' + op.name);
                            var service = config.get('services.' + op.name);
                            proc(service.name, cmd.action, service.path)
                        });
                    }
                    break;
            }

        });

    function srvPath(srvpath) {
        return path.resolve(__dirname, '../..', 'srv', srvpath);
    }

    function rootPath(rootpath) {
        return path.resolve(__dirname, '../..', rootpath);
    }

    function pm2action(cmd, name, cb) {
        pm2.connect(function (err) {
            pm2[cmd](name, function (err, proc) {
                if (util.defined(cb) && typeof cb == 'function') {
                    return cb(err, proc);
                }
                if (err) throw new Error('err');
                if (proc.success === true) {
                    cli.log.ok(cmd + ' ' + name + ' success');
                } else {
                    cli.log.warn(cmd + ' ' + name + ' not successfull');
                    console.log(proc);
                }
                cli.exit();
            });
        });
    }

    function proc(name, action, scriptPath, opts) {
        opts = opts || {};
        switch (action) {
            case "start":
                if (util.defined(scriptPath) === false) return;
                pm2.connect(function (err) {
                    pm2.start(scriptPath, _.merge({name: name}, opts), function (err, proc) {
                        if (err) throw new Error('err');
                        if (proc.success === true) {
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
