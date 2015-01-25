var blessed = require('blessed');
var _ = require('lodash');

function ContentBox(label, options) {
    var box = blessed.box(_.defaults(options, {
        fg: 'white',
        bg: 'blue',
        border: false,
        left: 17,
        top: 1,
        tags: true,
        width: '86%',
        height: '97%',
        padding: {
            left: 2
        }
    }));
    return box;
}

module.exports = ContentBox;
