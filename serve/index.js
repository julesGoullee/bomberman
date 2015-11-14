'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = require("./app");
var io = require("socket.io");
var http = require('http');

var config = require("./config/config.js");
require("./modules/log/log.js");

var game = require("./modules/game/game.js");
var socketHandler = require("./modules/socketHandler/socketHandler.js");

app.set( "port", config.port );
app.set("etag", "strong");

var server = http.createServer( app );
var _io = io( server );

server.listen( config.port, config.domaine );

server.on( "error", onError );
server.on( "listening", onListening );

function onListening(){
  var addr = server.address();
  log("Listening on port " + addr.port);
  game.launch();
  socketHandler.launch( _io );
}

function onError( error ){

  if( error.syscall !== "listen" ){
    throw error;
  }

  var bind = typeof config.port === "string"
    ? "Pipe " + config.port
    : "Port " + config.port;

  switch( error.code ){
    case "EACCES":
      console.error( bind + " requires root privileges" );
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error( bind + " is already in use" );
      process.exit(1);
      break;
    default:
      throw error;
  }
}
