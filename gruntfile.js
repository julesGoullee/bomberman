"use strict";
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
                    tdd: "tdd"
                },
                src: [
                    "app/server/test/mock.js",
                    "app/server/modules/**/test/*.js"
                ]
            }
        },
        karma: {
            autoRun: {
                basePath: "app/public",
                frameworks: ["jasmine"],
                options:{
                    files: [
                        //external
                        "external/jquery.js",
                        "external/bootstrap.js",
                        "external/babylonjs/babylon.js",
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
                autoWatch: true,
                browsers: ["PhantomJS"]
            },
            singleRun: {
                basePath: "app/public",
                frameworks: ["jasmine"],
                options:{
                    files: [
                        //external
                        "external/jquery.js",
                        "external/bootstrap.js",
                        "external/babylonjs/babylon.js",
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
                autoWatch: false,
                singleRun: true,
                browsers: ["PhantomJS"]
            }
        },
        copy:{
            confProd:{
                files : [
                    {
                        src: "config/prod/configServer_prod.js",
                        dest: "app/server/config/config.js"
                    },
                    {
                        src: "config/prod/configClient_prod.js",
                        dest: "app/public/modules/config/config.js"
                    }
                ]
            },
            confDev:{
                files : [
                    {
                        src: "config/dev/configServer_dev.js",
                        dest: "app/server/config/config.js"
                    },
                    {
                        src: "config/dev/configClient_dev.js",
                        dest: "app/public/modules/config/config.js"
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
                        src: "bower_components/bootstrap/dist/js/bootstrap.min.js",
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
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "app/public/external/jquery.min.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "app/public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "app/public/fonts/glyphicons-halflings-regular.woff"
                    },
                    {
                        src: "config/prod/commonProd.babylon.manifest",
                        dest: "app/public/content/common.babylon.manifest"
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
                        src: "bower_components/bootstrap/dist/js/bootstrap.js",
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
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "app/public/external/jquery.min.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "app/public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "app/public/fonts/glyphicons-halflings-regular.woff"
                    },
                    {
                        src: "config/dev/commonDev.babylon.manifest",
                        dest: "app/public/content/common.babylon.manifest"
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

    grunt.registerTask("test_all", ["karma:singleRun","simplemocha:all"]);

    //ONLY CONFIG
    grunt.registerTask("config_dev", ["copy:confDev"]);
    grunt.registerTask("config_prod", ["copy:confProd"]);

    //INSTALLATION
    grunt.registerTask("install_dev", ["bower:install","copy:confDev", "copy:bowerDev"]);
    grunt.registerTask("install_prod", ["bower:install","copy:confProd", "copy:bowerProd"]);
};


