var fs = require('fs');
var util = require('../../../util');
function capitalizeFirst(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

var helpMenu = function (cli) {

    var usage,
        title,
        subtitles = [],
        desc,
        custom,
        items = {},
        used = {},
        children = {};


    var self = {

        /**
         * description
         */

        description: function (value) {

            desc = value;

        },

        /**
         */

        usage: function (value) {

            usage = value;

        },

        title: function (value) {
            title = value;
        },

        subtitles: function(value){
            subtitles = value;
        },

        custom: function(val){ custom = val },

        /**
         * adds a help item
         */

        add: function (category, name, desc) {

            if (used[name]) return;
            used[name] = 1;

            if (!items[category]) items[category] = [];

            items[category].push({
                name: name,
                desc: desc
            });
        },

        /**
         */

        child: function (name) {
            return children[name] || (children[name] = helpMenu(cli));
        },

        /**
         */

        print: function () {

            //line break
            console.log();

            var width = process.stdout.getWindowSize()[0];
            var lines = '';
            for (var i = 0; i < width; i++) lines += '=';


                if (title) console.log(lines + '%s\n%s' + lines + '\n', title, subtitles.join('\n'));

                if (desc) {
                    console.log('%s\n'.bold, desc);
                }

                if (usage) console.log('%s: %s\n', 'Usage'.bold, usage);

                for (var category in items) {

                    console.log('%s:'.bold, capitalizeFirst(category));

                    var ops = {
                        ellipsis: true,
                        columns: {
                            name: 20,
                            desc: 70
                        },
                        pad: {
                            left: 2
                        }
                    };


                    cli.table(items[category], ops);
                    console.log();
                }

        }
    };

    return self;
}


exports.plugin = function (cli) {

    var help = helpMenu(cli);


    cli.addHelp = function (ops) {


        //fix the usage so it's turned from command :op to command [op]
        if (ops.usage)
            ops.usage = ops.usage.
                replace(/\:(\w+)/g, '[$1]').
                replace(/OR/g, 'OR'.bold);

        help.add(ops.category || 'options', ops.name, ops.description || ops.desc);

        //set the usage for the child help item
        var childHelp = help.child(ops.name);

        childHelp.usage(ops.usage);
        childHelp.custom(ops.custom || '');
        childHelp.description(ops.description);


        var k;


        if (ops.defaults) {
            for (var op in ops.optional) {

                k = op;

                if (ops.defaults[op]) {
                    k = k + "=" + ops.defaults[k];
                }


                childHelp.add('Optional Flags', "--" + k, ops.optional[op]);

            }
        }

        return cli;
    }

    cli.title = help.title;
    cli.subtitles = help.subtitles;


    cli.usage = help.usage;


    help.usage('[command] --arg=value --arg2')


    cli.help = function () {

        help.print();

    }

    cli.commandHelp = function (data, next) {


        //intercept commands that are :command help
        if (this.path.segments.length > 1 && (this.path.segments[1].value == 'help' || this.path.segments[1].value == '-h')) {

            help.child(this.path.segments[0].value).print();

            return;
        }

        next();
    }

    cli.option('help', cli.help).option(':command help OR **', cli.commandHelp);
    //cli.option('-h', cli.help).option(':command -h OR **', cli.commandHelp);

    cli.addHelp({
        category: 'help',
        name: '[cmd] help | [cmd] -h',
        description: 'Show command help menu'
    });

    cli.addHelp({
        category: 'help',
        name: 'help',
        description: 'Show help menu'
    });
}
