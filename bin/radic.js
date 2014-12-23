#!/usr/bin/env node


var radic = require('../lib');

var config = new radic.Config('test');


function testConfig() {
    config.set('b.a.c', 'ovessr', true);

    var b = config.get('b.a.c');
    console.log('b.a.c', b);

    config.del('b.a.c', true);

    b = config.get('b.a.c');
    console.log('b.a.c', b);


    b = config.get('b');
    console.log('b', b);

    config.clear(true);


    b = config.get('b');
    console.log('b', b);
}

