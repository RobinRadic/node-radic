var allow = [ 'app', 'util', 'binwraps', 'sh', 'cli', 'git', 'google', 'net', 'DB', 'Config', 'eventer' ];
allow.push([ 'async', 'lodash', 'underscore.string', 'tmp' ]);


function radic( path ){

    if( allow.indexOf(path) !== -1 ){
        path = path.toLowerCase();
        try {
            return require('./' + path);
        }
        catch(err) {
            try {
                return require('./../node_modules/' + path);
            }
            catch(err) {
                throw new Error('radic("' + path + '") could not resolve into a valid module. Looked in both radic and radic node modules');
            }
        }

    } else {
        throw new Error('Could not find [' + path + ']. Allowed: {' + allow.join(', ') + '}');
    }

}
module.exports = radic;

/**
 * Application data
 * @see {@link App}
 * @type App
 * @instance
 */
radic.app = require('./app');

/**
 * Utility functions. Extends the native nodejs utilities module.
 * @see {@link util}
 * @type util
 */
radic.util = require('./util');

/**
 * Command wrapper. Wraps terminal commands.
 * @see {@link binwraps}
 * @type binwraps
 */
radic.binwraps = require('./binwraps');

/**
 * Shell interaction
 * @see {@link sh}
 * @type sh
 */
radic.sh = require('./sh');

/**
 * Cli functions
 * @see {@link cli}
 * @type cli
 */
radic.cli = require('./cli');

