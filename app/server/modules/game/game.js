"use strict";

var config = require( "../../config/config.js" );
var Room = require("../room/room.js" );
var socketHandler = require("../socketHandler/socketHandler.js");

var _callbackOnConnectionRoom = [];
var _roomList;
var _playerInHome;

function onPlayerConnectionRoom( userProfil ) {

    if ( _roomList.length === 0 || _roomList[ _roomList.length - 1 ].players.length === config.maxPlayerPeerParty ) {

        _roomList.push( new Room () );
    }

    _roomList[ _roomList.length -1 ].addPlayer( userProfil );

    for ( var i = 0; i < _callbackOnConnectionRoom.length; i ++ ) {

        _callbackOnConnectionRoom[i]( userProfil, _roomList[ _roomList.length -1 ] );
    }
}


module.exports = {

    launch: function( ){

        _roomList = [];

        _playerInHome = [];

        socketHandler.launch();

        socketHandler.newConnect( function( userProfil ) {

            onPlayerConnectionRoom( userProfil );
        });
    },
    getRoomList: function() {

        return _roomList;
    },
    mockSocketHandler: function( mock ) {

        socketHandler = mock;
    },
    callbackOnConnectionInRoom: function( callback ){

        _callbackOnConnectionRoom.push( callback );
    }
};
