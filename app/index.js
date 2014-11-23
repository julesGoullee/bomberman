"use strict";

var config = require( "./config/config.js" );
var express = require( "express" );
var app = express();
var server = require( config.rootPath + "/app/module/server/server.js" );
var logService = require( config.rootPath + "/app/module/log/log.js" );

logService.start( app );

server.start( app );

server.onListenStart(function(){

});




