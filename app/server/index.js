"use strict";

var config = require( "./config/config.js" );
var express = require( "express" );
var app = express();
var server = require("./services/server/server.js" );
var logService = require("./services/log/log.js" );
var gameService = require("./modules/game/game.js" );

logService.start( app );

server.start( app );

server.onListenStart(function(){
    gameService();
});




