"use strict";

function Connector () {

    var self = this;

    var _socket = io();

    /*PUBLIC METHODS*/

    self.getMyPosition = function( callback ) {

        _socket.on( "myPosition", function ( myPosition ) {
            callback(myPosition);
        });
    };

    self.sendMyPosition = function( position ) {

        socket.emit( "myPosition", position );
    };

    self.onNewPlayer = function( callback ) {

        socket.on( "newPlayer", function( playerData ) {
            callback(playerData);
        });
    };
    /*PRIVATE METHODS*/


}