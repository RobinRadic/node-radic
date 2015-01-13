var app = require('../app'),
    _ = require('lodash'),
    util = require('../util'),
    config = app.config;
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.command('resources OR resources :action')
        .description('Copy/edit/link resource files to customise generated files.')
        .usage({
            'resources info': 'Displays the current resources configuration and status',
            'resources copy': 'Copies the default resources to a directory you specify.',
            'resources link': 'Marks a directory you specify as file resource.'
        })
        .method(function (cmd) {
            if (typeof cmd.action === 'undefined') {
                cli.log.fatal('Not enough arguments, config requires an action');
            } else {
                switch (cmd.action) {
                    case "copy":
                        cli.log('Not yet implemented');
                        break;
                    case "link":
                        cli.log('Not yet implemented');
                        break;
                    case "info":
                        config.clear(true);
                        cli.log.ok('Configuration cleared');
                        break;
                }
            }
        });



};
