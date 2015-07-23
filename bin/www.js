'use strict';

var app = require("../app");
var io = require("socket.io");
var https = require('https');

var fs = require('fs');
var privateKey  = fs.readFileSync( __dirname + "/../config/ssl/bomberman-key.pem", "utf8");
var certificate = fs.readFileSync( __dirname + "/../config/ssl/bomberman-cert.pem", "utf8");
var credentials = {key: privateKey, cert: certificate};

var config = require("../config/config.js");
require("../modules/log/log.js");

var game = require("../modules/game/game.js");
var socketHandler = require("../modules/socketHandler/socketHandler.js");

app.set( "port", config.port );

var server = https.createServer( credentials, app );
var _io = io( server );

server.listen( config.port, "0.0.0.0" );

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