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
  

  
#### Documentation
You can check [the documentation here](http://robin.radic.nl/node-radic)
  
    
    
#### Included functionality

| Module | Description |
|:-------|:------------|
| [config](http://robin.radic.nl/node-radic/Config.html) | persitent file based configuration `config.get('a.b.c'); config.set('a.b', 'c'); config.set('a', { b: 'c' });` |
| [db](http://robin.radic.nl/node-radic/DB.html) | file based database. Uses models/schemas with validation |
| [git](http://robin.radic.nl/node-radic/git.html) | local commands like add, commit etc. also includes API for github/bitbucket |
| [util](http://robin.radic.nl/node-radic/util.html) | extends the core util functionality with extras |
| [ui](http://robin.radic.nl/node-radic/ui.html) | .. |
| [cli](http://robin.radic.nl/node-radic/cli.html) | cli commands, output, input etc |
| [net](http://robin.radic.nl/node-radic/net.html) | network functionality, like downloading |
| [sh](http://robin.radic.nl/node-radic/sh.html) | shell exec, execsync, execlist etc |
| [vboxmanage](http://robin.radic.nl/node-radic/vboxmanage.html) | virtual box manager api |
  
  
### How to use
  
#### Installation
```bash
# Globally install radic for using radic command line tools
sudo npm install -g radic

# Local install into project for using libraries and helpers
npm install --save radic
```
  
  
#### Command line tools
```bash
radic -h
```
  
#### Implementing `radic` in an external application
```javascript
var radic = require('radic'),
    // Classes
    Config = radic.Config,
    DB = radic.DB,
    
    // Stand-alone helpers
    git = radic.git,
    util = radic.util,
    
    // Radic helpers (require's global installation and configuration)
    services = radic.gitServices, // bitbucket/github REST API 
    config = radic.config;   
 
 
// Example usage
var config = new Config('config', { /** options */ });
var db = new DB('name');
```
  
### License
Copyright 2014 Robin Radic 

[MIT Licensed](http://radic.mit-license.org)

