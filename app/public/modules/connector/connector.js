"use strict";

function Connector () {

    var self = this;

    var _socket = io();

    /*PUBLIC METHODS*/

    self.getMyPosition = function( callback ) {

        _socket.on( "myPosition", function ( myPosition ) {
            callback(myPosition);
        });

        _socket.emit("getMyPosition", {});

    };

    self.sendMyPosition = function( position ) {

        _socket.emit( "myPosition", position );
    };

    self.onNewPlayer = function( callback ) {

        _socket.on( "newPlayer", function( playerData ) {

            callback( playerData.id, playerData.name, playerData.position );
        });
    };

    self.onPlayerMove = function( callback ) {

        _socket.on( "onPlayerMove", function( playerData ) {

            callback( playerData.id, playerData.position );
        });
    };

    self.onPlayerDisconnect = function( callback ){

        _socket.on( "playerDisconnect" , function( playerData ) {

              callback( playerData.id );
        });
    };

    self.onPlayerSetBomb = function( callback ){

        _socket.on( "setBomb" , function( playerData ) {

            callback( playerData.id );
        });
    };

    self.setBomb = function( id ) {

        _socket.emit( "setBomb", id );
    };

    /*PRIVATE METHODS*/


}