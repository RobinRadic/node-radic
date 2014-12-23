radic
=============
**version:** 0.0.1

## Overview
`radic` is the core library and application for many of my node applications.
 
- It exports a variety of objects, classes and instances for external use.   
- `radic` is also a stand-alone application which manages global configuration and such.
  
  
#### Library classes that can be instantieted in external applications 
- config
- db
- git
- utilities
  
  
#### Helper objects/functions that can be called in external applications
- config (global `radic` configuration)
- github
- bitbucket
- ui
  
  
## How to use
#### Installation
```bash
# Globally install radic for using radic command line tools
sudo npm install -g radic

# Local install into project for using libraries and helpers
npm install --save radic
```
  
  
#### Usage
##### Command line tools
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
 
**More documentation soon**

## License
Copyright 2014 Robin Radic 

[MIT Licensed](http://radic.mit-license.org)

