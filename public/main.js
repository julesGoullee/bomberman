"use strict";

requirejs.config({
    baseUrl: "modules",
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
    paths: {
        cfg: "config/config",
        babylonjs: "../external/babylonjs/babylon",
        jquery: "../external/jquery",
        socketIo: "../socket.io/socket.io"
    }
});

requirejs(["app"]);