"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
var passport = require("passport"); 
var app = require("./app");
var io = require("socket.io");
var http = require("http");

var config = require("./config/config.js");
require("./modules/log/log.js");

var game = require("./modules/game/game.js");
var socketHandler = require("./modules/socketHandler/socketHandler.js");

var server = http.createServer( app );
var _io = io( server ).use(function( socket, next ){

  require("./middlewares/auth/session").prototype.getMiddleware()( socket.request, {}, function(){
    passport.initialize()(socket.request, {}, function(){
      passport.session()(socket.request, {}, function(){
        log("Check cookie: x" + socket.request.isAuthenticated(), "ws-auth");

        if(socket.request.isAuthenticated()){
          next();
        }
        else{
          socket.disconnect();
        }
      });
    });
  });//GET session for websocket
});


function onListening(){
  log("Listening on port " + server.address().port , "srv");
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
