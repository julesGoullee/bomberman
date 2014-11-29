/*global require, module*/
"use strict";
var config = require("./app/config/config.js");

module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-simple-mocha");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.initConfig({
        simplemocha: {
            all:{
                options: {
                    timeout: 3000,
                    ignoreLeaks: true,
                    reporter: "progress",
                    ui: "bdd"
                },
                src: config.rootPath + "/app/modules/**/*.js"
            }
        },
        karma: {
            autoRun: {
                basePath: "public",
                frameworks: ["jasmine"],
                options:{
                    files: [
                        //external
                        "external/jquery/*.js",
                        "external/bootstrap/*.js",
                        //MOCK
                        "modules/test/mock.js",
                        //modules
                        "modules/**/test/*.js",
                        "modules/**/*.js"
                    ]
                },
                // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                reporters: ["dots", "ubuntu"],
                //reporters: ["dots", "growl"],
                //reporters: ["dots"],
                autoWatch: true,
                browsers: ["PhantomJS"]
            }
        },
        copy:{
            prod:{
                files : [
                    {
                        src: "app/config/config_prod.js",
                        dest: "app/config/config.js"
                    }
                ]
            },
            dev:{
                files : [
                    {
                        src: "app/config/config_dev.js",
                        dest: "app/config/config.js"
                    }
                ]
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: "./public/external/",
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        watch: {
            mochaTest: {
                files: ["app/**/*.js", "Gruntfile.js"],
                options: {
                    reload: true
                },
                tasks: "simplemocha:all"
            }
        }
    });

    grunt.registerTask("default", ["test_all"]);
    grunt.registerTask("install_external", ["bower:install"]);

    /*TEST*/
    grunt.registerTask("test_server", ["simplemocha:all", "watch:mochaTest"]);
    grunt.registerTask("test_client", ["karma:autoRun"]);
    grunt.registerTask("test_all", ["karma:all","simplemocha:all"]);

    /*CONFIG*/
    grunt.registerTask("config_dev", ["copy:dev"]);
    grunt.registerTask("config_prod", ["copy:prod"]);
};


