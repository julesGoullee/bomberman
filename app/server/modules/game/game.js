"use strict";

var config = require( "../../config/config.js" );
var Room = require("../room/room.js" );
var socketHandler = require("../socketHandler/socketHandler.js");

var _callbackOnConnection = [];
var _roomList;

function onPlayerConnection( socket, name ) {

    if( _roomList.length === 0 || _roomList[ _roomList.length - 1 ].players.length === config.maxPlayerPeerParty ) {

        _roomList.push( new Room () );
    }

    _roomList[ _roomList.length -1 ].addPlayer( socket, name );

    for ( var i = 0; i < _callbackOnConnection.length; i ++ ){

        _callbackOnConnection[i]( name , _roomList[ _roomList.length -1].id);
    }
}


module.exports = {

    launch : function( ){

        _roomList = [];

        var nbPlayer = 0;

        var name = "player";

        socketHandler.launch();

        socketHandler.newConnect( function( socket ) {

            nbPlayer ++;

            onPlayerConnection( socket, name + nbPlayer );
        });
    },
    getRoomList: function() {

        return _roomList;
    },
    mockSocketHandler : function( mock ) {

        socketHandler = mock;
    },
    callbackOnConnection: function( callback ){

        _callbackOnConnection.push( callback );
    }
};
