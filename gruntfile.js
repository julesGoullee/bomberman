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
            confProd:{
                files : [
                    {
                        src: "config/prod/config_prod.js",
                        dest: "app/server/config/config.js"
                    }
                ]
            },
            confDev:{
                files : [
                    {
                        src: "config/dev/config_dev.js",
                        dest: "app/server/config/config.js"
                    }
                ]
            },
            bowerProd:{

                files : [
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.min.css",
                        dest: "app/public/external/bootstrap.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
                        dest: "app/public/external/bootstrap-theme.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.min.js",
                        dest: "app/public/external/bootstrap.js"
                    },
                    {
                        src: "bower_components/bootstrap-growl/jquery.bootstrap-growl.min.js",
                        dest: "app/public/external/jquery.bootstrap-growl.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "app/public/external/jquery.js"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "app/public/external/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "app/public/external/fonts/glyphicons-halflings-regular.woff"
                    }

                ]
            },
            bowerDev:{
                files : [
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.css",
                        dest: "app/public/external/bootstrap.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.css.map",
                        dest: "app/public/external/bootstrap.css.map"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.css.map",
                        dest: "app/public/external/bootstrap-theme.css.map"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.css",
                        dest: "app/public/external/bootstrap-theme.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.js",
                        dest: "app/public/external/bootstrap.js"
                    },
                    {
                        src: "bower_components/bootstrap-growl/jquery.bootstrap-growl.js",
                        dest: "app/public/external/jquery.bootstrap-growl.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.js",
                        dest: "app/public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.js.map",
                        dest: "app/public/external/jquery.js.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "app/public/external/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "app/public/external/fonts/glyphicons-halflings-regular.woff"
                    }

                ]
            }
        },
        bower: {
            install: {
                options: {
                    copy:false
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

    //TEST//
    grunt.registerTask("test_server", ["simplemocha:all", "watch:mochaTest"]);
    grunt.registerTask("test_client", ["karma:autoRun"]);

    grunt.registerTask("test_all", ["karma:all","simplemocha:all"]);

    //CONFIG//
    grunt.registerTask("config_dev", ["copy:confDev", "copy:bowerDev"]);
    grunt.registerTask("config_prod", ["copy:confProd", "copy:bowerProd"]);


    //INSTALLATION
    grunt.registerTask("dev", ["bower:install", "config_dev"]);
    grunt.registerTask("prod", ["bower:install", "config_prod"]);

};


