var app = require('../../app'),
    _ = require('lodash'),
    async = require('async'),
    util = require('../../util'),
    git = require('../../git'),
    resources = require('../../resources'),
    config = app.config;
/**
 * @param {cli} cli
 */
module.exports = function (cli) {

    cli.command('yo:gitinit')
        .description('Fast repository creation')
        .usage('radic version minor', 'shows version')
        .method(function (cmd) {
            var prompts = {
                generate: {
                    name: 'generate',
                    type: 'checkbox',
                    message: 'Which files should i generate?',
                    choices: resources.fileList('gitinit'),
                    default: resources.fileList('gitinit')
                },
                add: {
                    name: 'add',
                    type: 'confirm',
                    message: 'Git add all?',
                    default: true
                },
                commit: {
                    name: 'commit',
                    type: 'confirm',
                    message: 'Commit?',
                    default: true
                },
                commitMessage: {
                    name: 'commitMessage',
                    type: 'input',
                    message: 'Commit message',
                    default: 'Initial commit'
                },
                remote: {
                    name: 'remote',
                    type: 'list',
                    message: 'Do you want to define/create a remote?',
                    choices: ['create', 'add', 'skip'],
                    default: 'create'
                },
                remoteProvider: {
                    name: 'remoteProvider',
                    type: 'list',
                    message: 'Remote provider',
                    choices: ['github', 'bitbucket'],
                    default: 'github'
                },
                remoteOwner: {
                    name: 'remoteOwner',
                    type: 'input',
                    message: 'Remote owner/user',
                    default: 'Initial commit'
                },
                remoteRepo: {
                    name: 'remoteRepo',
                    type: 'input',
                    message: 'Repository name',
                    default: path.basename(process.cwd())
                },
                push: {
                    name: 'push',
                    type: 'confirm',
                    message: 'Do you want to push to remote?',
                    default: true
                }
            };
            var answers = {};
            async.waterfall([
                function(next){
                    cli.prompt([prompts.generate, prompts.add, prompts.commit], function(opts){
                        _.merge(answers, opts);
                        next();
                    })
                },
                function(next){
                    var proms = [];
                    if(answers.commit === true){
                        proms.push(prompts.commitMessage);
                    }
                    proms.push(prompts.remote);
                    cli.prompt(proms, function(opts){
                        _.merge(answers, opts);
                        next();
                    })
                },
                function(next){
                    if(answers.remote === 'skip') return next();
                    cli.prompt([prompts.remoteProvider], function(opts){
                        _.merge(answers, opts);
                        next();
                    })
                },
                function(next){
                    if(answers.remote === 'skip') return next();
                    prompts.remoteOwner.default = config.get('credentials.' + answers.remoteProvider + '.username');
                    cli.prompt([prompts.remoteOwner, prompts.remoteRepo, prompts.push], function(opts){
                        _.merge(answers, opts);
                        next();
                    })
                }
            ], function(err, opts){
                if(err) throw new Error(err);
                git('init');
                answers.generate.forEach(function(fileName){
                    resources.copy('gitinit/' + fileName, fileName);
                    cli.log.info('Generated file: ' + fileName);
                });
                if(answers.add === true) {
                    git('add', { A: true });
                    cli.log('Added all files to git')
                }
                if(answers.commit === true) {
                    git('commit', { m: answers.commitMessage })
                    cli.log('Created a commit with message "' + answers.commitMessage + '"');
                }
                if(answers.remote !== 'skip'){
                    var url = (answers.remoteProvider === 'github' ? 'https://github.com' : 'https://bitbucket.org') + "/:owner/:repo";
                    url = url.replace(':owner', answers.remoteOwner).replace(':repo', answers.remoteRepo);
                    git('remote', 'add', 'origin', url);
                    cli.log('Added remote origin ' + url);
                    if(answers.remote === 'create'){
                        var api = git.getApi(answers.remoteProvider);

                        api.repos.post('sdf', 'asdf', function(err, res){
                            console.log(err, res);
                        })
                    }
                    if(answers.push === true){
                        git('push', { u: 'origin master'});
                    }
                }
                cli.log.ok('Done!')
            })

        });


};
