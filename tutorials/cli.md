#### Creating a CLI application

I recommend using the method below to create commands. This is also utilized in `node-radic` itself.


When using the following structure, with a little code it's possible to let all commands in the `src/commands` directory auto-register.

**Directory structure**  
..bin   
....myclicmd.js  
..src  
....commands  
......index.js  
......mycmd1.js  
......mycmd2.js  


**bin/myclicmd.js**
{% highlight javascript %}
var radic = require('radic'),
    cli = radic.cli;

require('../src/commands')(cli);
cli.title('  |  ' + cli.green.bold('myclicmd title') + '  | ' + cli.yellow('v1.0.5') + ' |');

cli.usage('myclicmd [command] ' + cli.gray('[[subcommands]]'));
cli.parse(process.argv);
{% endhighlight %}


**src/commands/index.js**
{% highlight javascript %}
var radic = require('radic'),
    util = radic.util,
    requireDirectory = util.requireDirectory;

// This will recursively require all javascript files in the current directory and below
module.exports = function (cli) {
    requireDirectory(module, {
        visit: function (obj) {
            obj(cli);
        }
    });
};
{% endhighlight %}


**src/commands/mycmd1.js**
{% highlight javascript %}
module.exports = function (cli) {

    cli.command('resources OR resources :action')
        .description('Copy/edit/link resource files to customise generated files.')
        .usage({
            'resources info': 'Displays the current resources configuration and status',
            'resources copy': 'Copies the default resources to a directory you specify.',
            'resources link': 'Marks a directory you specify as file resource.'
        })
        .method(function (cmd) {
            if (typeof cmd.action === 'undefined') {
                cli.log.fatal('Not enough arguments, config requires an action');
            } else {
                switch (cmd.action) {
                    case "copy":
                        cli.log('Not yet implemented');
                        break;
                    case "link":
                        cli.log('Not yet implemented');
                        break;
                    case "info":
                        cli.log.ok('Configuration cleared');
                        break;
                }
            }
        });



};
{% endhighlight %}
