var _ = require('lodash'),
    util = require('./util'),
    exec = require('child_process').exec,
    sh = require('./sh');


function createExecString(args){
    var cmd = 'VBoxManage';
    _.forEach(args, function(arg, i){
        if(typeof arg === 'string'){
            cmd += ' ' + JSON.stringify(arg);
        } else if(typeof arg === 'number'){
            cmd += ' ' + arg;
        } else if(typeof arg === 'object'){
            _.forEach(arg, function(opt, optk){
                if(typeof opt === 'boolean') {
                    cmd += ' --' + optk;
                } else {
                    cmd += ' --' + optk + ' ' + JSON.stringify(opt);
                }
            });
        }
    });
    console.log(cmd);
    return cmd;
}

/**
 * @namespace vboxmanage
 * @returns {object} result - An object containing `code` and `stdout`
 */
function vboxmanage(){
    return sh.execSync(createExecString(_.toArray(arguments)));
}
module.exports = vboxmanage;

vboxmanage.async = function(){
    var args = _.toArray(arguments);
    _.forEach(args, function(arg, i){
        console.log('vboxm async', args.length, ' with i ', i);
        if(typeof arg === 'function'){
            console.log('vbo!!!xm async', args.length, ' with i ', i);
        }
    });
    exec(createExecString(args), function(err, stdout, stderr){
        if(err) throw Error(err);
        if(typeof callback === 'function'){
            callback(stdout);
        }
    });

};

/*
var result = vboxmanage('createvm', {
    name: 'vboxmanagetest',
    register: true,
    basefolder: require('path').resolve(__dirname, '..', 'test')
});
console.log(result.stdout);
console.log(result.code);



var result2 = vboxmanage('unregistervm', 'vboxmanagetest', {
    delete: true
});
console.log(result2.stdout);
console.log(result2.code);

//util.print(util.inspect(result));
*/
