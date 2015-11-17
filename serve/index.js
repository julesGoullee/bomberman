"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
var passport = require("passport"); 
var app = require("./app");
var io = require("socket.io");
var http = require("http");

var config = require("./config/config");
var serveLog = require("./modules/log/log").serve;

var game = require("./modules/game/game");
var socketHandler = require("./modules/socketHandler/socketHandler");

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
