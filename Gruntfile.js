'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var util = require('util');
var path = require('path');

module.exports = function (grunt) {


    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        package: require('./package.json'),
        radic_jsdoc: {
            docs: {
                options: {
                    docsPath: 'docs'
                }
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
        },
        changelog: {
            sample: {
                options: {
                template: '{{date}}\n\n{{> features}}{{> fixes}}',
                    partials: {
                        features: '{{#each features}}{{> feature}}{{/each}}',
                        feature: '[NEW] {{this}}\n',
                        fixes: '{{#each fixes}}{{> fix}}{{/each}}',
                        fix: '[FIX] {{this}}\n'
                    }
                }

            }
        }
    });


    grunt.registerTask('docs', ['radic_jsdoc:docs', 'radic_jsdoc_mdpages:docs',  'git:docs']);

    grunt.registerTask('default', []);

};
