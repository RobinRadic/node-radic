'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var util = require('util');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        radic_jsdoc: {
            docs: {
                options: {
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
    });

    grunt.registerTask('docs:api', function(){
        grunt.task.run(['radic_jsdoc:docs'])
    });
    grunt.registerTask('docs:cover', function(){
        grunt.task.run(['radic_coverage:docs'])
    });
    grunt.registerTask('publish', ['radic_jsdoc:docs', 'radic_coverage:docs', 'radic_ghpages_publish:docs']);

};
