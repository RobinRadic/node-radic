var radic = require('../'),
    path = require('path'),
    util = require('../util');
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.command('client OR client :action')
        .description('Shows current version')
        .usage('radic version minor', 'shows version')
        .method(function (cmd) {
            cli.autoexit = false;
            switch (cmd.action) {
                case "monitor":
                    //process.chdir('')
                    var Monitor = require('monitor');
                    var processMonitor = new Monitor({probeClass:'Process'});
                    processMonitor.connect(function(){
                        console.log('connect');
                        console.log(arguments);
                        util.log('free mem', processMonitor.get('freemem'));

                        var stuff = processMonitor.toJSON();
                        console.log(stuff);
                    });
                    break;
            }
        });


}
