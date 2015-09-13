"use strict";
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

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
                    "modules/test/mock.js",
                    "modules/**/test/*.js"
                ]
            }
        },
        karma: {
            autoRun: {
                basePath: "public",
                frameworks: ["jasmine", "requirejs"],
                options:{
                    files: [
                        {pattern: 'external/**/*.js', included: false},
                        {pattern: 'modules/**/*.js', included: false},
                        {pattern: 'test/mock.js', included: false},
                        'test/test-main.js'
                    ],
                    exclude:['main.js','modules/app.js']
                },
                // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                reporters: ["dots", "ubuntu"],
                //reporters: ["dots", "growl"],
                autoWatch: true,
                browsers: ["PhantomJS"]
            },
            singleRun: {
                basePath: "public",
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
                        dest: "config/config.js"
                    },
                    {
                        src: "config/prod/configClient_prod.js",
                        dest: "public/modules/config/config.js"
                    }
                ]
            },
            confDev:{
                files : [
                    {
                        src: "config/dev/configServer_dev.js",
                        dest: "config/config.js"
                    },
                    {
                        src: "config/dev/configClient_dev.js",
                        dest: "public/modules/config/config.js"
                    }
                ]
            },
            bowerProd:{

                files : [
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.min.css",
                        dest: "public/external/bootstrap.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
                        dest: "public/external/bootstrap-theme.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/js/bootstrap.min.js",
                        dest: "public/external/bootstrap.js"
                    },
                    {
                        src: "bower_components/bootstrap-growl/jquery.bootstrap-growl.min.js",
                        dest: "public/external/jquery.bootstrap-growl.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "public/fonts/glyphicons-halflings-regular.woff"
                    },
                    {
                        src: "config/prod/commonProd.babylon.manifest",
                        dest: "public/content/common.babylon.manifest"
                    }

                ]
            },
            bowerDev:{
                files : [
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.css",
                        dest: "public/external/bootstrap.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.css.map",
                        dest: "public/external/bootstrap.css.map"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.css.map",
                        dest: "public/external/bootstrap-theme.css.map"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.css",
                        dest: "public/external/bootstrap-theme.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/js/bootstrap.js",
                        dest: "public/external/bootstrap.js"
                    },
                    {
                        src: "bower_components/bootstrap-growl/jquery.bootstrap-growl.js",
                        dest: "public/external/jquery.bootstrap-growl.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "public/fonts/glyphicons-halflings-regular.woff"
                    },
                    {
                        src: "config/dev/commonDev.babylon.manifest",
                        dest: "public/content/common.babylon.manifest"
                    },
                    {
                        src: "bower_components/requirejs/require.js",
                        dest: "public/external/require.js"
                    }

                ]
            }
        },
        clean: {
            build: ["bower_components"]
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
                files: ["modules/**/*.js", "Gruntfile.js"],
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
    grunt.registerTask("install_dev", ["bower:install","copy:confDev", "copy:bowerDev", "clean:build"]);
    grunt.registerTask("install_prod", ["bower:install","copy:confProd", "copy:bowerProd", "clean:build"]);
};


