var radic = require('../../lib'),
    Config = radic.Config;

module.exports = function (chai, utils) {
    var Assertion = chai.Assertion;
    Assertion.addProperty('model', function () {
        var obj = utils.flag(this, 'object');
        new chai.Assertion(obj).to.be.instanceof(Config);
    });
};
