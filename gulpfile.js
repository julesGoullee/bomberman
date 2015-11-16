"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var webpack = require("webpack");
var merge = require("merge-stream");
var runSequence = require("run-sequence");
var production = process.argv.indexOf("--production") > -1;
console.log(production,"production");

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
    js: [
      "client/external/babylon.js",
      "client/external/iomo.js",
      "client/bower_components/jquery/dist/jquery.min.js",
      "client/bower_components/bootstrap/dist/js/bootstrap.min.js",
      "client/bower_components/bootstrap-growl/jquery.bootstrap-growl.min.js"
    ],
    css:[
      "client/bower_components/bootstrap/dist/css/bootstrap.min.css",
      "client/bower_components/bootstrap/dist/css/bootstrap-theme.min.css"
    ]
  },
  webpack:{
    rootDir: ["./client/src/modules", "./client/bower_components"]
  },
  assets: "client/assets/**",
  css: "client/css/app.css"
};


gulp.task("jshint", function() {
  return gulp.src([
    "client/src/**/*.js",
    "serve/**/*.js",
    "config/**/*.js"
  ])
    .pipe($.jshint())
    .pipe($.jshint.reporter(require("jshint-stylish")))
    .pipe($.jshint.reporter("fail"));
});

gulp.task("mocha", function() {
  return gulp.src([
    "serve/modules/**/test/*.js",
    "!serve/modules/player/test/*.js",
    "!serve/modules/maps/test/*.js",
    "!serve/modules/game/test/*.js",
    "!serve/modules/bomb/test/*.js",
    "!serve/modules/room/test/*.js"
  ])
    .pipe($.mocha({
      timeout: 3000,
      ignoreLeaks: true,
      reporter: "progress",
      tdd: "tdd"
    }));
});

gulp.task("karma", function(callback){

  new (require("karma")).Server({
    basePath: "client/src/modules",
    frameworks: ["jasmine"],
    files: [
      "../../dist/scripts/external.js",
      "./**/test/*.js"
    ],
    preprocessors: {
      "./**/test/*.js": ["webpack"]
    },
    plugins: [
      "karma-webpack",
      "karma-jasmine",
      "karma-ubuntu-reporter",
      "karma-phantomjs-launcher"
    ],
    webpack: {
      resolve: {
        modulesDirectories: paths.webpack.rootDir,
        extensions: ["", ".js", ".json"]
      }
    },
    webpackMiddleware: { noInfo: true},
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


gulp.task("copyConfig", function() {
  return merge(
    gulp.src(paths.configSrc.front)
      .pipe($.rename("config.js"))
      .pipe(gulp.dest(paths.configFront)),

    gulp.src(paths.configSrc.back)
      .pipe($.rename("config.js"))
      .pipe(gulp.dest(paths.configBack)),

    gulp.src(paths.manifest)
      .pipe($.rename("common.manifest"))
      .pipe(gulp.dest(paths.dist + "/assets"))
  );
});

gulp.task("assets", function(){
  return merge(
    gulp.src(paths.externals.js)
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
      .pipe(gulp.dest(paths.dist))
  );
});

gulp.task("webpack", ["copyConfig"], function(cb) {
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
      modulesDirectories: paths.webpack.rootDir,
      extensions: ["", ".js", ".json"]
    },
    plugins: [
      new webpack.optimize.DedupePlugin()
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
    cb();
  });
});

gulp.task("build", function(cb){
  runSequence("clean", ["assets", "webpack"], cb);
});

gulp.task("dev", function(cb){
  runSequence("test", "webpack", cb);
});

gulp.task("watch", ["dev"], function() {
  gulp.watch([
    "client/src/**/*.js",
    "serve/modules/**/*.js"
  ], ["dev"]);

});

gulp.task("test", function(cb){
  return runSequence("jshint", "karma", "mocha", cb);
});

gulp.task("default", ["watch"]);
