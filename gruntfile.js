"use strict";
var config = require("./app/server/config/config.js");

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
                basePath: "app/public",
                frameworks: ["jasmine"],
                options:{
                    files: [
                        //external
                        "external/jquery/*.js",
                        "external/bootstrap/*.js",
                        //utils
                        "modules/utils/*.js",
                        //MOCK
                        "modules/test/mock.js",
                        //config
                        "modules/config/config.js",
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
                        src: "config/prod/config_prod.js",
                        dest: "app/server/config/config.js"
                    }
                ]
            },
            dev:{
                files : [
                    {
                        src: "config/dev/config_dev.js",
                        dest: "app/server/config/config.js"
                    }
                ]
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: "app/public/external/",
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

    //TEST//
    grunt.registerTask("test_server", ["simplemocha:all", "watch:mochaTest"]);
    grunt.registerTask("test_client", ["karma:autoRun"]);
    grunt.registerTask("test_all", ["karma:all","simplemocha:all"]);

    //CONFIG//
    grunt.registerTask("config_dev", ["copy:dev"]);
    grunt.registerTask("config_prod", ["copy:prod"]);
};


