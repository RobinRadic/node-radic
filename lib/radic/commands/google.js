var app = require('radic/app'),
    sh = require('radic/sh'),
    _ = require('lodash'),
    util = require('radic/util'),
    google = require('radic/google'),
    config = app.config,
    GoogleContacts = require('google-contacts').GoogleContacts;
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.command('google OR google :action OR google :action :key OR google :action :key :value')
        .description('Configures radic')
        .usage({
            'google contacts': 'Shows all contacts',
            'google contacts <filter>': 'Shows all contacts'
        })
        .method(function (cmd) {
            if (typeof cmd.action === 'undefined') {
                cli.log.fatal('Not enough arguments, config requires an action');
            } else {
                //var client = google.getClient();
                switch (cmd.action) {
                    case "contacts":
                        google.authorize(google.scopes.contacts.readwrite, function (token) {
                         //   console.log('tokens', token);
                            var c = new GoogleContacts({token: token.access_token});
                            c._get({type: 'contacts'}, function (err, contacts) {
                                if (util.defined(contacts)) {

                                    // console.log(util.inspect(contacts.feed, {showHidden: true, color: false, depth: 3}));
//                                    var table = cli.table('default', 'borderless', {}).head('Naam', 'Telefoon');

                                    var colPairs = 3,
                                        cols = colPairs * 2;
                                    var colW = 100 / 6;
                                    var table = cli
                                        .table('default', 'borderless')
                                        .head();
                                    var colPair,
                                        colPairsContent = [];

                                    if (process.stdout.getWindowSize()[0] - 10 < 200) {
                                        colPairs = 3;
                                    }

                                    var entries = {};
                                    var names = []
                                    _.forEach(contacts.feed.entry, function (contact, i) {
                                        entries[contact.title['$t']] = _.pluck(contact['gd$phoneNumber'], '$t').join("\n");
                                        names.push(contact.title['$t']);
                                    });
                                    //var sorted = _.map(_.sortBy(entries, [0, 1]), _.values);

                                    if (typeof cmd.key === 'string' && !util.defined(cmd.value)) {
                                        names = _.filter(names.sort(), function (val) {
                                           // console.log(val);
                                            return val.toLowerCase().indexOf(cmd.key) > -1;
                                        })
                                    }
                                    _.forEach(names,
                                        function (name, i) {
                                            var entry = entries[name];
                                           // console.log(name, i, entry)
                                            colPair = (i % 3) + 1;
                                            colPairsContent.push(name, entry);
                                            if (colPair < colPairs) {
                                                colPairsContent.push(cli.red('||'));
                                            }

                                            if (colPairs == colPair) {
                                                table.push(colPairsContent);
                                                colPairsContent = [];
                                            }
                                        });

                                    while (colPair < colPairs) {
                                        colPair++;
                                        colPairsContent.push('-', '-');
                                        table.options.head.push('Naam', 'Telefoonnr')
                                        if (colPairs != colPair) {
                                            table.options.head.push('')
                                        }
                                    }

                                    table.push(colPairsContent);
                                    util.print('\u001B[2J\u001B[0;0f')
                                    console.log("\n" + table.toString());

                                }
                                cli.exit();
                            });

                        });
                        break;
                    case "contacts2":
                        google.authorize(google.scopes.contacts.readonly, function (client) {
                            cli.log.ok('YES');
                            util.log(client);
                            require('http').request({
                                url: 'https://www.googleapis.com/auth/contacts.readonly'
                            }, function (a, b) {
                                console.log(a, b);
                                cli.exit();
                            })
                        });

                        break;

                }
            }
        });

};
