var
    path = require('path'),
    sh = require('radic/sh'),
    util = require('radic/util'),
    pm2 = require('pm2');

var generator = module.exports = {};

generator.config = function(config) {
    var cli = this;
    cli.command('config OR config :action OR config :action :key OR config :action :key :value')
        .description('Configures radic')
        .usage({
            'config show': 'dumps config to output',
            'config wizard': 'interactive wizard to configure required stuff',
            'config open': 'opens the configuration file in a text editor',
            'config get': 'Get a config key',
            'config set': 'Set a config key',
            'config del': 'Remove a config key',
            'config clear': 'clears the configuration'
        })
        .method(function (cmd) {
            if (typeof cmd.action === 'undefined') {
                cli.log.fatal('Not enough arguments, config requires an action');
            } else {
                switch (cmd.action) {
                    case "show":
                        util.log(config.get());
                        break;
                    case "wizard":
                        configWizard();
                        break;
                    case "open":
                        cli.log('Opening configuration file in text editor (' + config.get('textEditorCommand') + ')');
                        var result = sh.execSync(config.get('textEditorCommand') + ' ' + config.path)
                        if (result.code == 1) {
                            cli.log.fatal('An error occurred while trying to open the configuration file: "' + result.stdout + '"')
                        }
                        break;
                    case "get":
                        if (util.defined(cmd.key)) {
                            var val = config.get(cmd.key);
                            if (typeof val === 'object') {
                                cli.writeln(util.inspect(val, {colors: true}));
                            } else {
                                cli.writeln(val.toString());
                            }
                        }
                        break;
                    case "set":
                        if (util.defined(cmd.key) && util.defined(cmd.value)) {
                            config.get(cmd.key, cmd.value, true);
                            cli.log.ok('Config key added');
                        }
                        break;
                    case "del":
                        if (util.defined(cmd.key)) {
                            config.del(cmd.key, true);
                            cli.log.ok('Config key deleted');
                        }
                        break;
                    case "clear":
                        cli.prompt([{
                            name: 'clear',
                            type: 'confirm',
                            message: 'Are you sure you want to delete all configuration values?',
                            default: false
                        }], function (answer) {
                            if (answer.clear === true) {
                                config.clear(true);
                                cli.log.ok('Configuration cleared');
                            } else {
                                cli.log.info('Operation canceled. Configuration has not been altered')
                            }
                        });

                        break;
                }
            }
        });

};

generator.service = function(name, scriptPath){
    var self = this,
        cli = this

    var actions = ['start', 'stop', 'reload', 'reload-gracefull', 'delete', 'describe'];
    var usage = {};
    actions.forEach(function(action){
        usage[name + ' ' + action] = action + ' the service';
    });

    cli.command(name + ' OR ' + name + ' :action')
        .description('Manage radic services')
        .usage(usage)
        .optional('')
        .custom("\n" + tree)
        .method(function (cmd) {

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
