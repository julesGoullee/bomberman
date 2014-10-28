/*global require, module*/
'use strict';
var config = require('./app/config/config.js');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        simplemocha: {
            all:{
                options: {
                    timeout: 3000,
                    ignoreLeaks: true,
                    reporter:'progress',
                    ui: 'bdd'
                },
                src: config.rootPath + '/app/module/**/*.js'
            }
        },
        karma: {
            game: {
                basePath: 'public',
                frameworks: ['jasmine'],
                options:{
                    files: [
                        //external
                        'external/angular-mocks/*.js',
                        //common
                        'main.js'
                    ]
                },
                reporters: ['dots', 'ubuntu'],
                autoWatch: true,
                browsers: ['PhantomJS']
            }
        },
        copy:{
            //bootstrapFiles: {
            //    files: [
            //        {
            //            expand: true,
            //            cwd:'bower_components/bootstrap/dist/css/',
            //            src: ['bootstrap-theme.css', 'bootstrap-theme.css.map', 'bootstrap.css.map'],
            //            dest: './public/external/bootstrap/',
            //            filter: 'isFile'
            //        }
            //    ]
            //},
            prod:{
                files : [
                    {
                        src: 'app/config/config_prod.js',
                        dest: 'app/config/config.js'
                    }
                ]
            },
            dev:{
                files : [
                    {
                        src: 'app/config/config_dev.js',
                        dest: 'app/config/config.js'
                    }
                ]
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './public/external/',
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        watch: {
            configFiles: {
                files: [config.rootPath + '/app/**/*.js', config.rootPath + '/Gruntfile.js'],
                options: {
                    reload: true
                },
                tasks: 'simplemocha:map'
            }
        }
    });

    grunt.registerTask('default', ['test_all']);
    grunt.registerTask('install_external', ['bower:install']);

    /*TEST*/
    grunt.registerTask('test_server_all', ['simplemocha:all']);
    grunt.registerTask('test_client_all', ['simplemocha:all']);
    grunt.registerTask('test_all', ['karma:all','simplemocha:all']);

    /*CONFIG*/
    grunt.registerTask('config_dev', ['copy:dev']);
    grunt.registerTask('config_prod', ['copy:prod']);
};


