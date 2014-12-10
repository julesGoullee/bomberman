"use strict";

var config = require( "./config/config.js" );
var express = require( "express" );
var app = express();
var logService = require( config.rootPath + "./services/log/log.js" );
var gameService = require( config.rootPath + "./modules/game/game.js" );

logService.start( app );

server.start( app );

server.onListenStart(function(){
    gameService( server.getSocketIo() );
});




