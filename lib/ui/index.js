var blessed = require('blessed'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    util = require('util');

var screen = blessed.screen({ term: 'xterm'});

// get all UI components
var main = require('./main')('radic', '1.0.0'),
    ContentBox = require('./content-box'),

    content = {
        welcome: ContentBox('Welcome', {
            content: '\n{left}This is the UI tool for radic. \nThis UI is also usable by external applications if they have {green-fg}{bold}radic{/bold}{/green-fg} as dependency{/left}'
        }),
        configuration: require('./content/configuration')
    };



// Construct it
screen.append(main.container);
main.container.append(content.welcome);
content.welcome.append(content.configuration);

// Left menu
main.menu.setItems([
    'Welcome',
    'Configuration',
    'Github',
    'Bitbucket'
]);
main.menu.select(0);
main.menu.focus();
main.menu.on('select', function(item, index){
    var itemSlug = item.content.toLowerCase();


});

// Screen
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
screen.render();


/*
 exports.xterm = [
 '#000000', // black
 '#cd0000', // red3
 '#00cd00', // green3
 '#cdcd00', // yellow3
 '#0000ee', // blue2
 '#cd00cd', // magenta3
 '#00cdcd', // cyan3
 '#e5e5e5', // gray90
 '#7f7f7f', // gray50
 '#ff0000', // red
 '#00ff00', // green
 '#ffff00', // yellow
 '#5c5cff', // rgb:5c/5c/ff
 '#ff00ff', // magenta
 '#00ffff', // cyan
 '#ffffff'  // white
 ];
 */
