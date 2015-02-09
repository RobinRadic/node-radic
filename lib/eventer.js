var
    _             = require('lodash'),
    fs            = require('fs-extra'),
    path          = require('path'),
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    app           = require('./app'),
    config        = app.config,
    util          = require('./util'),
    cli           = require('./cli');

module.exports = eventer;

function assign(obj, assignToProperty, methodName){
    return function(){
        obj[ assignToProperty ][ methodName ].apply(obj[ assignToProperty ], _.toArray(arguments));
    }

}

function eventer( obj, options ){
    var c = _.merge({
        assignMethods       : [ 'on', 'once', 'off' ],
        assignPrivateMethods: [ 'emit' ],
        assignToProperty    : '_events',
        privateMethodPrefix : '_',

        assignByAliases: false,
        aliases: {
            on: [ 'onEvent', 'addListener' ]
        },

        eventClass       : EventEmitter2,
        eventClassOptions: null,
        assignToPrototype: false,

        debug: false

    }, options);

    function debug(){
        if( c.debug === true ){
            console.log.apply(console, _.toArray(arguments));
        }
    }

    // instanciate and assign the event class to a property of the object
    if( c.assignToPrototype === false ){
        if( _.isNull(c.eventClassOptions) ){
            obj[ c.assignToProperty ] = new c['eventClass']();
        } else {
            obj[ c.assignToProperty ] = new c['eventClass'](c.eventClassOptions);
        }
    } else {
        throw new Error('assignToPrototype not implemented yet')
    }

    if( c.assignByAliases ){
        debug('assigning by aliases');
        _.each(c.aliases, function(aliases, methodName){
            // if the aliasses definition is a string, make it into an array with the string as array item
            if( _.isString(aliases) ){
                aliases = [ aliases ];
            }

            debug('aliases methodname', methodName, 'aliases', aliases);

            aliases.forEach(function(methodAssignmentName){
                obj[ methodAssignmentName ] = assign(obj, c.assignToProperty, methodName);
            })
        });

    } else {
        debug('assigning by methods');

        [ 'assignMethods', 'assignPrivateMethods' ].forEach(function( methodType ){
            c[ methodType ].forEach(function( methodName ){
                // if we assign to prototype of object, we do not assign private methods, we will return some other way
                if( methodType === 'assignPrivateMethods' && c.assignToPrototype === true ){
                    return;
                }

                // if the aliasses definition is a string, make it into an array with the string as array item
                if( _.isString(c.aliases[ methodName ]) ){
                    c.aliases[ methodName ] = [ c.aliases[ methodName ] ];
                }

                if( !_.isArray(c.aliases[ methodName ]) ){
                    c.aliases[ methodName ] = [ methodName ]
                } else {
                    c.aliases[ methodName ].push(methodName);
                }

                c.aliases[ methodName ].forEach(function( methodAssignmentName ){
                    // if method should be privately assigned, we prefix it with (default): _
                    if( methodType === 'assignPrivateMethods' ){
                        methodAssignmentName = c.privateMethodPrefix + methodAssignmentName;
                    }

                    // assign the shortcut method to the object
                    obj[ methodAssignmentName ] = assign(obj, c.assignToProperty, methodName);


                });
            })
        });
    }
    return obj;
}


// test stuff if script is invoked directly
if (!module.parent) {

    var objName = '', testEvent = '';
    function makecb(method){
        return function(){
            util.log.apply(util, [objName + ':' + testEvent, 'listener "' + method + '" got invoked' ].concat(_.toArray(arguments)));
        }
    }
    function ev(obj,method){
        obj[method](testEvent, makecb(method));
    }


    var myobj = {}; objName = 'myobj'; testEvent = 'hello';
    myobj = eventer(myobj, {
        debug: true
    });
    ev(myobj, 'on');
    ev(myobj, 'onEvent');
    myobj._emit(testEvent);


    var second = {}; objName = 'second'; testEvent = 'testevent';
    second = eventer(second, {
        debug: true,
        assignByAliases: true,
        aliases: {
            on: ['on', 'onEvent', 'whenEventHappens'],
            onAny: 'any',
            off: 'off',
            once: 'once',
            emit: '_emit'
        }
    });

    ev(second, 'once');
    ev(second, 'on');
    ev(second, 'onEvent');
    ev(second, 'whenEventHappens');
    second._emit(testEvent);
    second._emit(testEvent);


    //console.log(second)

}
