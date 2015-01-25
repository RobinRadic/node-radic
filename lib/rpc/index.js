var manager = require('daemon-manager'),
    path = require('path'),;



/**
 * @namespace rpc
 * @type {{}}
 */
var rpc = module.exports = {};

rpc.serverScript = path.resolve(__dirname, 'server.js');
rpc.server = null;

rpc.startServer = function() {
    rpc.controller = new manager.Controller({
        script: rpc.serverScript
    });

    controller.on('ready', function () {
        console.log('Ready for communication on port ' + controller.port.toString() + '....');
    });

    controller.launch();
};


rpc.stopServer = function() {

};

rpc.getClient =- function(){

};
