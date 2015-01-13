var radic = require('../');
/**
 * @param {cli} cli
 */
module.exports = function(cli){

    cli.command('version OR version :type')
        .description('Shows current version')
        .usage('radic version minor', 'shows version')
        .method(function (cmd) {
            if (typeof cmd.type === 'undefined') {
                cli.writeln(radic.app.version);
            } else {
                cli.log.ok('Yeah we done that');
                cli.log.debug('But this aswell');
            }
        });


}
