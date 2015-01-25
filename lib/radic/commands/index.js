var requireDirectory = require('../util/index').requireDirectory;

module.exports = function (cli) {
    requireDirectory(module, {
        visit: function (obj) {
            obj(cli);
        }
    });
};
