"use strict";

var config = require( "../../config/config.js" );

var server = require("../server/server.js" );

var game = require("../../modules/game/game.js");

function log(app){

    server.onListenStart(function(){

        console.log( "server listen on 3000 ..." );
    });

    game.callbackOnConnection( function( user, roomId){

        console.log( "New user: " + user + " on room: " + roomId );
    });

    app.use(function( req, res, next ){
//        console.log(req.method, req.url);
        next();
    });

}

module.exports ={
    start : function( app ){

        log( app );
    }
};