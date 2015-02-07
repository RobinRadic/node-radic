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


            make: {
                options: {
                    logArguments: [
                        '--pretty=[%ad](https://github.com/robinradic/node-radic/commit/%H): %s',
                        '--no-merges',
                        '--date=short'
                    ],
                    dest: 'CHANGELOG.md',
                    template: '\n\n{{> features}}',
                    after: 'v0.1.0',
                    fileHeader: '# Changelog',
                    featureRegex: /^(.*)$/gim,
                    partials: {
                        features: '{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}\n',
                        feature: '- {{this}}  \n'
                    }
                }
            }

        }
    });


    grunt.registerTask('docs', ['radic_jsdoc:docs', 'radic_jsdoc_mdpages:docs', 'git:docs']);

    grunt.registerTask('version:patch', ['changelog:make', 'docs', 'publish:patch']);

};
