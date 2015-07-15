"use strict";

var logService = require("./services/log/log.js");
var config = require( "./config/config.js");
var express = require( "express");
var app = express();
var server = require("./services/server/server.js");
var game = require("./modules/game/game.js");

logService.start( app );

server.start( app );

server.onListenStart( function() {
    game.launch();
});




