var blessed = require('blessed'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    util = require('util');

var form = blessed.form({
    keys: true,
    fg: 'white',
    bg: 'blue',
    border: false,
    left: 17,
    top: 1,
    tags: true,
    width: '86%',
    height: '97%'
});

function createInput(options) {
    var input = blessed.input(_.defaults(options, {
        fg: 'white',
        bg: 'yellow',
        border: {
            type: 'line',
            fg: '#ffffff'
        },
        left: 19,
        top: 5,
        tags: true,
        width: '15%',
        height: '15%'
    }));
};


var bitbucket = {
    username: createInput({
        parent: form
    })
};

module.exports = {
    form: form,
    bitbucket: bitbucket
};
