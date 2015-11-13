"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var webpack = require("webpack");
var Server = require("karma").Server;
var merge = require("merge-stream");

var production = process.argv.indexOf("--production") > -1;

var paths = {
  dist: "client/dist",
  configSrc:{
    front: production ? "config/prod/configClient_prod.js" : "config/dev/configClient_dev.js",
    back: production ? "config/prod/configServer_prod.js": "config/dev/configServer_dev.js"
  },
  manifest: production ? "config/prod/commonProd.babylon.manifest" : "config/dev/commonDev.babylon.manifest",
  configFront: "client/src/modules/config",
  configBack: "serve/config",
  index: "client/index.html",
  externals: {
    js:[
      "client/external/babylon.js",
      "client/external/iomo.js",
      "bower_components/jquery/dist/jquery.min.js",
      "bower_components/bootstrap/dist/js/bootstrap.min.js",
      "bower_components/bootstrap-growl/jquery.bootstrap-growl.min.js"
    ],
    css:[
      "bower_components/bootstrap/dist/css/bootstrap.min.css",
      "bower_components/bootstrap/dist/css/bootstrap-theme.min.css"
    ]
  },
  assets: "client/assets/**",
  css: "client/css/app.css"
};


gulp.task("jshint", ["build"], function() {
  return gulp.src([
    "client/src/**/*.js",
    "serve/modules/**/*.js"
  ])
    .pipe($.jshint())
    .pipe($.jshint.reporter(require("jshint-stylish")))
    .pipe($.jshint.reporter('fail'));
});

gulp.task("mocha", ["build", "jshint"], function() {
  return gulp
    .src("serve/modules/**/test/*.js")
    .pipe($.mocha({
      timeout: 3000,
      ignoreLeaks: true,
      reporter: "progress",
      tdd: "tdd"
    })).once("error", function(){
      process.exit(1);
    })
    .once("end", function(){
      process.exit();
    });
});

gulp.task("karma", ["build", "jshint"], function(callback){

  new Server({
    basePath: "client/src/modules",
    frameworks: ["jasmine"],
    files: [
      "../../dist/scripts/external.js",
      {pattern: "./**/*.js", included: false},
      "testConfig/test-main.js"
    ],
    preprocessors: {
      "testConfig/test-main.js": ["webpack"]
    },
    plugins: [
      "karma-webpack",
      "karma-jasmine",
      "karma-ubuntu-reporter",
      "karma-phantomjs-launcher"
    ],
    webpack: {
      resolve: {
        modulesDirectories: ["./client/src/modules"],
        extensions: [
          "",
          ".js",
          ".json"
        ]
      }
    },
    webpackMiddleware: {
      noInfo: false
    },
    reporters: ["dots","ubuntu"],
    singleRun: true,
    browsers: ["PhantomJS"]
  }, callback).start();
});


gulp.task("clean", function() {
  return gulp.src([
    paths.configBack + "/config.js",
    paths.configFront + "/config.js",
    paths.dist,
    "./client/src/assets/common.manifest"
  ]).pipe($.rimraf());
});


gulp.task("copyConfig", ["clean"], function() {
  return merge(gulp.src(paths.configSrc.front)
    .pipe($.rename("config.js"))
    .pipe(gulp.dest(paths.configFront)),

  gulp.src(paths.configSrc.back)
    .pipe($.rename("config.js"))
    .pipe(gulp.dest(paths.configBack)),

  gulp.src(paths.manifest)
    .pipe($.rename("common.manifest"))
    .pipe(gulp.dest(paths.dist + "/assets")));
});

gulp.task("assets", ["clean"], function(){
  return merge(gulp.src(paths.externals.js)
    .pipe($.concat("external.js"))
    .pipe(gulp.dest(paths.dist + "/scripts/")),

  gulp.src(paths.externals.css)
    .pipe($.concat("external.css"))
    .pipe(gulp.dest(paths.dist + "/css")),

  gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist + "/assets")),

  gulp.src(paths.css)
    .pipe(gulp.dest(paths.dist + "/css")),

  gulp.src(paths.index)
    .pipe(gulp.dest(paths.dist)));
});


gulp.task("webpack", ["copyConfig", "assets"], function(callback) {
  webpack({
    entry: {
      index: [
        "./client/src/app.js"
      ]
    },
    output: {
      path: paths.dist,
      filename: "scripts/bundle.js",
      publicPath: "./client/src/modules"
    },
    resolve: {
      modulesDirectories: ["./client/src/modules"],
      extensions: [
        "",
        ".js",
        ".json"
      ]
    },
    plugins: [
      //common plugins
    ].concat( production ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })] : [])

  }, function(err, stats) {
    if(err){
      throw new $.util.PluginError("webpack", err);
    }
    $.util.log("[webpack]", stats.toString());
    callback();
  });
});

gulp.task("build", ["clean", "copyConfig", "assets", "webpack"]);


gulp.task("watch", function() {
  gulp.watch([
    "client/src/**/*.js",
    "serve/modules/**/*.js"
  ], ["test"]);

  //gulp.watch([
  //], ["mocha"]);

  //gulp.watch([
  //  paths.configSrc.front,
  //  paths.configSrc.back
  //], ["copyConfig"]);
});

gulp.task("test", ["karma", "mocha"]);

gulp.task("default", ["watch"]);
