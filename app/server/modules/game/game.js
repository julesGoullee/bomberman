"use strict";
var config = require( "../../config/config.js" );
var Room = require("../room/room.js" );

var _roomList;

function onPlayerConnection( socket ) {

    if( _roomList.length === 0 || _roomList[_roomList.length -1].players.length === config.maxPlayerPeerParty ) {
        _roomList.push( new Room () );

    }
        //socket.on('myPosition', function(position){
        //   console.log(position);
        //});
    _roomList[_roomList.length -1].addPlayer( socket );
}


module.exports = {
    launch : function( socketHandler ){

        _roomList = [];

        socketHandler.newConnect( function( socket ){
            onPlayerConnection(socket);
        });

    },
    getRoomList: function(){
        return _roomList;
    }

};
