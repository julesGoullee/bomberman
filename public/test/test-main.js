"use strict";

var allTestFiles = [];

Object.keys(window.__karma__.files).forEach(function(file) {
    if (/\/test\//.test(file)) {
        allTestFiles.push(file);
    }
});


requirejs.config({
    baseUrl: '/base',
    shim : {
        bootstrap: {deps: ['jquery']},
        babylonjs: {
            exports: "BABYLON"
        }
    },
    paths: {
        mock: "test/mock",
        babylonjs: "external/babylonjs/babylon",
        jquery: "external/jquery"
    },

    deps: ['/base/modules/auth/test/testAuth.js'],

    callback: window.__karma__.start
});