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
  - name: Modules
    link: "#"
    icon: fa fa-mortar-board
    children:
      - name: radic
        link: /node-radic/module-radic.html
      - name: radic/cli
        link: /node-radic/cli.html
      - name: radic/config
        link: /node-radic/config.html
      - name: radic/db
        link: /node-radic/db.html
  - name: Classes
    link: "#"
    icon: fa fa-mortar-board
    children:
      - name: Config
        link: /node-radic/config-Config.html
      - name: DB
        link: /node-radic/db-DB.html

---

[![Build Status](https://travis-ci.org/RobinRadic/node-radic.svg?branch=master)](http://travis-ci.org/RobinRadic/node-radic)
[![GitHub version](https://badge.fury.io/gh/robinradic%2Fnode-radic.svg)](http://badge.fury.io/gh/robinradic%2Fnode-radic)
[![Coverage Status](https://img.shields.io/coveralls/RobinRadic/node-radic.svg)](https://coveralls.io/r/RobinRadic/node-radic)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://radic.mit-license.org)

### Overview
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
- cli
  
  
### How to use
  
#### Installation
{% highlight bash %}
# Globally install radic for using radic command line tools
sudo npm install -g radic

# Local install into project for using libraries and helpers
npm install --save radic
{% endhighlight %}
  
  
#### Command line tools
{% highlight bash %}
radic -h
{% endhighlight %}
  
#### Implementing `radic` in an external application
{% highlight javascript %}
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
{% endhighlight %}
 
**More documentation soon**

### License
Copyright 2014 Robin Radic 

[MIT Licensed](http://radic.mit-license.org)

