"use strict";
var config = require( "../../config/config.js" );
var Room = require( config.rootPath + "../room/room.js" );

function Game( io ) {

    var self = this;

    var _maxPlayerPeerParty = 4;

    var _roomList  = [];


    /*PRIVATE METHODS*/

    io.on( "connection", function( socket ) {

        console.log( "player connected" );

        onPlayerConnection( socket );
    });

    function onPlayerConnection( socket ) {
        if( _roomList.length === 0 || _roomList[_roomList.length -1].players.length === _maxPlayerPeerParty ) {
            _roomList.push( new Room () );

        }
        socket.on('myPosition', function(position){
           console.log(position);
        });
        _roomList[_roomList.length -1].addPlayer( socket );
    }

}

module.exports = Game;
