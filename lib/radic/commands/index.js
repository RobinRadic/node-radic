var requireDirectory = require('radic/util').requireDirectory;

module.exports = function (cli) {
    requireDirectory(module, {
        visit: function (obj) {
            obj(cli);
        }
    });
};
