---
layout: page
title: Node Radic
minify_content: false
navigation:
  - name: Home
    link: /
    icon: fa fa-home
  - name: Overview
    link: /node-radic
    icon: fa fa-dashboard
  - name: Coverage
    link: /node-radic/coverage
    icon: fa fa-code
  - name: Tutorials
    link: null
    icon: fa fa-info
    children:
      - name: General
        link: /node-radic/tutorials
      - name: "Cli & Commands"
        link: /node-radic/tutorials/cli.html
      - name: "Config & DB"
        link: /node-radic/tutorials/config-db.html
      - name: Binwraps
        link: /node-radic/tutorials/binwraps.html
  - name: Modules
    link: "#"
    icon: fa fa-mortar-board
    children:
      - name: radic
        link: /node-radic/module-radic.html
  - name: Classes
    link: "#"
    icon: fa fa-mortar-board
    children:
      - name: Config
        link: /node-radic/Config.html
      - name: DB
        link: /node-radic/DB.html
      - name: Model
        link: /node-radic/Model.html
      - name: Table
        link: /node-radic/Table.html
  - name: Namespaces
    link: "#"
    icon: fa fa-mortar-board
    children:
      - name: binwraps
        link: /node-radic/binwraps.html
      - name: cli
        link: /node-radic/cli.html
      - name: git
        link: /node-radic/git.html
      - name: net
        link: /node-radic/net.html
      - name: sh
        link: /node-radic/sh.html
      - name: util
        link: /node-radic/util.html

---
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
