var app = require('../app'),
    sh = require('../sh'),
    _ = require('lodash'),
    util = require('../util'),
    config = app.config;
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

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
                        if(result.code == 1){
                            cli.log.fatal('An error occurred while trying to open the configuration file: "' + result.stdout + '"')
                        }
                        break;
                    case "get":
                        if(util.defined(cmd.key)){
                            var val = config.get(cmd.key);
                            if(typeof val === 'object'){
                                cli.writeln(util.inspect(val, { colors: true }));
                            } else {
                                cli.writeln(val.toString());
                            }
                        }
                        break;
                    case "set":
                        if(util.defined(cmd.key) && util.defined(cmd.value)){
                            config.get(cmd.key, cmd.value, true);
                            cli.log.ok('Config key added');
                        }
                        break;
                    case "del":
                        if(util.defined(cmd.key)){
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
                        }], function(answer){
                            if(answer.clear === true){
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


    function configItem(name, type, message, options) {
        options = options || {};
        var defaults = {
            type: type,
            name: name,
            message: message,
            default: config.get(name)
        };
        return _.merge(defaults, options);
    }

    function configWizard() {
        cli.prompt([
            configItem('user.fullname', 'input', 'Your full name'),
            configItem('user.email', 'input', 'Your public email'),
            configItem('user.website', 'input', 'Your website (full url, use http://)'),
            configItem('credentials.github.username', 'input', 'Github username'),
            configItem('credentials.github.password', 'password', 'Github password'),
            configItem('credentials.bitbucket.username', 'input', 'Bitbucket password'),
            configItem('credentials.bitbucket.password', 'password', 'Bitbucket password')
        ], function (answers) {
            _.forEach(answers, function (val, key) {
                config.set(key, val);
            });
            config.save();
            cli.log.ok('Configuration saved!');
        });
    }

};
