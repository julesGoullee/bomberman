"use strict";

var allTestFiles = [];

Object.keys(window.__karma__.files).forEach(function(file) {
    if (/\/test\//.test(file)) {
        allTestFiles.push(file);
    }
});

requirejs.config({
    baseUrl: "/base/modules",
    shim : {
        bootstrap: {deps: ["jquery"]},
        babylon: {
            exports: "BABYLON"
        },
        jquery: {
            exports: "$"
        }
    },
    paths: {
        cfg: "config/config",
        utils: "utils/utils",
        mock: "../test/mock",
        babylon: "../external/babylonjs/babylon",
        jquery: "../external/jquery"
    },

    deps: allTestFiles,

    callback: window.__karma__.start
});