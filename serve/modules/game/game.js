"use strict";

var config = require( "../../config/config.js" );
var Room = require("../room/room.js" );
var socketHandler = require("../socketHandler/socketHandler.js");

var _roomList;

function delRoomById( roomId ){
  for (var i = 0; i < _roomList.length; i++) {
    var currentRoom = _roomList[i];
    if( currentRoom.id === roomId ){
      _roomList.splice( i, 1);
      return true;
    }
  }
  return false;
}

function onRoomDestroy( room ){

  delRoomById( room.id );
}

function getFirstRoomForPlayer( socket ){

  var room = null;

  if ( _roomList.length === 0){
    room = new Room ();
    room.onDestroy( onRoomDestroy );
    _roomList.push( room );
  }
  else {
    for (var i = 0; i < _roomList.length; i++) {
      var currentRoom = _roomList[i];
      if( !currentRoom.isStartFrom &&
        currentRoom.players.length !== config.maxPlayerPeerParty &&
        !currentRoom.alreadyJoined( socket.request.user._id.toString() ) ){
        room = currentRoom;
        break;
      }
    }

    if( !room ){
      room = new Room ();
      room.onDestroy( onRoomDestroy );
      _roomList.push( room );
    }
  }

  return room;
}

function onPlayerConnectionRoom( socket ) {

  var room = getFirstRoomForPlayer( socket );

  room.addPlayer( socket );

}


module.exports = {

  launch: function( ){

    _roomList = [];

    socketHandler.newConnect( function( socket ) {

      onPlayerConnectionRoom( socket );
    });
  },
  getRoomList: function() {

    return _roomList;
  },
  mockSocketHandler: function( mock ) {

    socketHandler = mock;
  }
};
