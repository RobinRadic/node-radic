'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var util = require('util');
var path = require('path');

module.exports = function (grunt) {


    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        radic_jsdoc: {
            docs: {
                docsPath: 'docs'
            }
        },
        radic_jsdoc_mdpages: {
            docs: {
                files: [{
                    src: 'README.md',
                    dest: 'docs/index.md'
                }]
            }
        },
        git: {
            docs: {
                options: {
                    cwd: 'docs',
                    ignoreErrors: true
                },
                commands: [
                    ['add', { A: true }],
                    ['commit', { m: 'Auto commit & push' }],
                    ['push', { u: 'origin' }, 'gh-pages']
                ]
            }
        }

    });


    grunt.registerTask('docs', ['radic_jsdoc:docs', 'radic_jsdoc_mdpages:docs', 'git:docs']);

    var cfgold = {
        radic_jsdoc: {
            docs: {
                tutorials: true
            }
        },
        radic_coverage: {
            docs: {
                options: {
                    exclude: ['lib/cli/_celeri/**'],
                    frontMatterPath: 'docs/processed-front-matter.yml'
                }
            }
        },
        radic_ghpages_publish: {
            docs: {
                options: {
                    dir: 'docs',
                    indexName: 'index.md',
                    frontMatterPath: 'docs/processed-front-matter.yml',
                    readmePath: 'README.md',
                    replacer: '# radic'
                }
            }
        }
    };
    grunt.registerTask('publish_old', function () {
        grunt.task.run(['radic_jsdoc:docs']);
        fs.copySync(path.join(__dirname, 'tutorials'), path.join(__dirname, 'docs/tutorials'), null, true);
        grunt.task.run(['radic_coverage:docs', 'radic_ghpages_publish:docs']);
    });

};
