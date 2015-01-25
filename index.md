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
  - name: Events
    link: "#"
    icon: fa fa-mortar-board
    children:
      - name: error
        link: "/node-radic/Model.html#create#event:error"
      - name: invalid
        link: "/node-radic/Model.html#create#event:invalid"
      - name: create
        link: "/node-radic/Model.html#event:create"
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
# radic
[![Travis build status](https://img.shields.io/travis/RobinRadic/node-radic.svg)](http://travis-ci.org/RobinRadic/node-radic)
[![NPM Version](https://img.shields.io/npm/v/radic.svg)](http://npmjs.org/package/radic)
[![NPM Downloads](https://img.shields.io/npm/dm/radic.svg)](http://npmjs.org/package/radic)
[![Goto documentation](http://img.shields.io/badge/goto-documentation-orange.svg)](http://robin.radic.nl/node-radic)
[![Goto repository](http://img.shields.io/badge/goto-repository-orange.svg)](https://github.com/robinradic/node-radic)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://radic.mit-license.org)


### Overview
`radic` is the core library and application for many of my node applications.
 
- It exports a variety of objects, classes and instances for external use.   
- `radic` is also a stand-alone application which manages global configuration and such.
  
  
## How to use

### Documentation
- [Detailed documentation](http://robin.radic.nl/node-radic)
- [Tutorials and examples](http://robin.radic.nl/node-radic/tutorial-radic.html)
- [Test coverage](http://robin.radic.nl/node-radic/coverage/)
  
  
### Installation
{% highlight bash %}
# Globally install radic for using radic command line tools
sudo npm install -g radic

# Local install into project for using libraries and helpers
npm install --save radic
{% endhighlight %}
  
  
  
### Overview
  
| Module | Description |
|:-------|:------------|
| [config](http://robin.radic.nl/node-radic/Config.html) | persitent file based configuration |
| [db](http://robin.radic.nl/node-radic/DB.html) | file based database. Uses models/schemas with validation |
| [git](http://robin.radic.nl/node-radic/git.html) | local commands like add, commit etc. also includes API for github/bitbucket |
| [util](http://robin.radic.nl/node-radic/util.html) | extends the core util functionality with extras |
| [ui](http://robin.radic.nl/node-radic/ui.html) | .. |
| [cli](http://robin.radic.nl/node-radic/cli.html) | cli commands, output, input etc |
| [net](http://robin.radic.nl/node-radic/net.html) | network functionality, like downloading |
| [sh](http://robin.radic.nl/node-radic/sh.html) | shell exec, execsync, execlist etc |
| [binwraps](http://robin.radic.nl/node-radic/binwraps.html) | wraps cli commands in a nice coat. |
  
  
### Basic usage
  
##### Config
{% highlight javascript %}
var radic = require('radic'),
    Config = radic.Config,
    config = new Config('config', { /** options */ });
    
var abc = config.get('a.b.c'); 
config.set('a.b', 'c'); 
config.set('a', { b: 'c' }, true); // saves the modified configuration to file
config.del('a.b');
config.clear();
config.save(); // or this
{% endhighlight %}
  
  
##### Cli
{% highlight javascript %}
#!/usr/bin/env node
var radic = require('radic'),
    cli = radic.cli;

cli.command('version OR version :type')
    .description('Shows current version')
    .usage('radic version minor', 'shows version')
    .method(function (cmd) {
        cli.log.info(cli.red.bold('1.0.0'));
    });
    
cli.parse(process.argv);
{% endhighlight %}
  
  
##### SH
{% highlight javascript %}
var radic = require('radic');
var result;

// Synchronous exec
result = radic.sh.execSync('apt-cache search mono | grep develop');
console.log(result.code); console.log(result.stdout);

// Inline scripts

result = radic.sh.inlineScript('echo "hai"\n\
echo "bai" \n\
echo "draai"');
console.log(result.code);
console.log(result.stdout);

result = radic.sh.inlineScript(function(){/*
       echo "hai"
       echo "bai"
       echo "draai"
       #apt-cache search mono
*/});
console.log(result.code);
console.log(result.stdout);
{% endhighlight %}
  
  
##### Net
{% highlight javascript %}
var radic = require('radic');
radic.net.download('http://download.gigabyte.ru/driver/mb_driver_marvell_bootdisk_w7w8.exe', __dirname, { /* options */ }, function(){
    // optional callback to make function execute asynchronously
});
{% endhighlight %}
  
  
##### Binwraps
{% highlight javascript %}
var radic = require('radic');    
var binwraps = radic.binwraps;

binwraps.createBinWrap('VBoxManage');
     
var vbox = binwraps.vboxmanage;
var result = vbox('createvm', {
  name: ops.name,
  ostype: 'Debian_64',
  basefolder: path.resolve(process.cwd()),
  register: true
});
console.log(result.stdout, result.code);


binwraps.autoSyncExec = false;
vbox('createvm', {
  name: ops.name,
  ostype: 'Debian_64',
  basefolder: path.resolve(process.cwd()),
  register: true
}, function(){
     // callllback
});


var commands = binwraps.getCommands();
binwraps[ commands[0] ]('arg', { weed: 'bad' }); // just an example..
{% endhighlight %}
  
  
##### DB
File based database 

{% highlight javascript %}
var db = new require('radic').DB('myfileDB4', {
    path: 'HOMEDIR/.radic/stores',
    ext: '.db',
    onLoaded: function(){}
});

var user = db.model('user', {
    type: 'object',
    properties: {
        username: { type: 'string', eq: 'ipsum' },
        email: { type: 'string', eq: 'ipsum' },
        password: {
            type: 'array',
            items: { type: 'number' }
        }
    }
});
{% endhighlight %}

  

### License
Copyright 2014 Robin Radic 

[MIT Licensed](http://radic.mit-license.org)

