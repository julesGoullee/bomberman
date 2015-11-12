"use strict";

var express = require("express");
var router = express.Router();
var config = require("../config/config.js");

var dependances = {

    scripts:[
        "socket.io/socket.io",
        "external/jquery",
        "external/bootstrap",
        "external/jquery.bootstrap-growl",
        "external/babylonjs/oimo",
        "external/babylonjs/babylon",

        // ftc utilitaire
        "modules/utils/utils",
        "modules/config/config",
        "modules/notifier/notifier",
        "modules/popup/popup",

        //modules
        "modules/preloader/preloader",
        "modules/keyBinder/keyBinder",
        "modules/restore/restore",
        "modules/block/block",
        "modules/bomb/bomb",
        "modules/camera/cameraSwitcher",
        "modules/connector/connector",
        "modules/game/game",
        "modules/maps/maps",
        "modules/player/player",
        "modules/player/myPlayer",
        "modules/player/notifyMovePlayer",
        "modules/powerUp/powerUp",
        "modules/bot/bot",
        "modules/auth/auth",
        "modules/menuPlayers/menuPlayers",
        "modules/timer/timer",
        "modules/cursorCapture/cursorCapture",
        "modules/endGame/endGame",
        "modules/analitics/analitics",
        "main"
    ],
    css:[
        "external/bootstrap",
        "external/bootstrap-theme",

        "css/style"
    ]
};

router.get("/", function (req, res, next) {
    res.sendFile(config.rootPathPublic + "/index.html");
});


module.exports = router;
