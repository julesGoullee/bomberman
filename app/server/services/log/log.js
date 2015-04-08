"use strict";

var config = require( "../../config/config.js" );

var server = require("../server/server.js" );

var game = require("../../modules/game/game.js");

function log(app){

    server.onListenStart(function(){

        console.log( "server listen on " + config.port + "..." );
    });

    game.callbackOnConnectionInRoom( function( userProfil, room ){

        console.log( "New user: " + userProfil.name + " on room: " + room.id );
    });

}

module.exports ={
    start : function( app ){

        log( app );
    }
};