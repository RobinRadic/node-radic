var app = require('../app'),
    sh = require('../sh'),
    _ = require('lodash'),
    util = require('../util'),
    config = app.config;
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.command('config OR config :action')
        .description('Configures radic')
        .usage({
            'config show': 'dumps config to output',
            'config wizard': 'interactive wizard to configure required stuff',
            'config clear': 'clears the configuration',
            'config open': 'opens the configuration file in a text editor'
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
                    case "clear":
                        config.clear(true);
                        cli.log.ok('Configuration cleared');
                        break;
                    case "open":
                        cli.log('Opening configuration file in text editor (' + config.get('textEditorCommand') + ')');
                        var result = sh.execSync(config.get('textEditorCommand') + ' ' + config.path)
                        if(result.code == 1){
                            cli.log.fatal('An error occurred while trying to open the configuration file: "' + result.stdout + '"')
                        }
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
