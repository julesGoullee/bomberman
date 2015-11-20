"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
var app = require("./app");
var io = require("socket.io");
var http = require("http");

var config = require("./config/config");
var serveLog = require("./modules/log/log").serve;

var game = require("./modules/game/game");
var socketHandler = require("./modules/socketHandler/socketHandler");

var server = http.createServer( app );

var _io = io( server ).use(function( socket, next ){
  //GET session for websocket
  require("./middlewares/auth").check( socket.request, {}, function(err){
    if(err){
      socket.disconnect();
    }
    else{
      next();
    }
  });
});


function onListening(){
  serveLog.info("Listening on port " + server.address().port );
  game.launch();
  socketHandler.launch( _io );
}

function onError( err ){

  if( err.syscall !== "listen" ){
    throw err;
  }

  switch( err.code ){
    case "EACCES":
      console.error( config.port + " requires root privileges" );
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error( config.port + " is already in use" );
      process.exit(1);
      break;
    default:
      throw err;
  }
}


server.listen( config.port, config.domaine );

server.on( "error", onError );
server.on( "listening", onListening );
