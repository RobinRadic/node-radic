---
layout: page
title: Node-Radic
navigation:
  - name: Home
    link: /
    icon: fa fa-home

  - name: Readme
    link: /node-radic
    icon: fa fa-mortar-board

  - name: API
    link: /node-radic/api
    icon: fa fa-code

  - name: Coverage
    link: /node-radic/coverage/lcov-report
    icon: fa fa-mortar-board

---

=============
[![Build Status](https://travis-ci.org/RobinRadic/node-radic.svg?branch=master)](http://travis-ci.org/RobinRadic/node-radic)
[![GitHub version](https://badge.fury.io/gh/robinradic%2Fnode-radic.svg)](http://badge.fury.io/gh/robinradic%2Fnode-radic)
[![Coverage Status](https://img.shields.io/coveralls/RobinRadic/node-radic.svg)](https://coveralls.io/r/RobinRadic/node-radic)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://radic.mit-license.org)

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
- cli
  
  
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

