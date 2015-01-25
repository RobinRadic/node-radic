var blessed = require('blessed');

function main(name, version) {
    var container = blessed.box({
        fg: 'blue',
        bg: 'default',
        border: {
            type: 'line',
            fg: '#ffffff'
        },
        tags: true,
        width: '98%',
        height: '98%',
        top: 'center',
        left: 'center'
    });
    var top = blessed.box({
        parent: container,
        fg: 'blue',
        bg: '#ffffff',
        border: false,
        tags: true,
        content: '{left}{red-fg} {bold}' + name + '{/bold} v' + version + '{/red-fg}{/left}',
        width: '99%',
        height: 1,
        top: 0,
        left: 1
    });

// LEFT MENU
    var menu = blessed.list({
        parent: container,
        width: 15,
        height: '97%',
        top: 1,
        left: 1,
        align: 'left',
        fg: 'yellow',
        border: false,
        selectedBg: 'green',
        mouse: true,
        keys: true,
        vi: true
    });
    var menu_border_right = blessed.line({
        parent: container,
        width: 1,
        height: '97.5%',
        top: 1,
        left: 16,
        orientation: 'vertical',
        type: 'line',
        fg: '#ffffff'
    });

    return {
        container: container,
        top: top,
        menu: menu,
        menu_border_right: menu_border_right
    };
}
module.exports = main;
