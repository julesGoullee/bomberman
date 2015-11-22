'use strict';

const config = require('../../config/config');
const Room = require('../room/room');
const SocketHandler = require('../socketHandler/socketHandler.es6');

class Game {

  constructor(io){
    this._roomList = [];
    new SocketHandler(io);
    SocketHandler.newConnect( (socket) => {
      this._onPlayerConnectionRoom( socket );
    });
  }

  getRoomList (){
    return this._roomList;
  }

  _onPlayerConnectionRoom (socket) {
    var room = this._getFirstRoomForPlayer(socket);

    room.addPlayer(socket);
  }

  _getFirstRoomForPlayer( socket ) {
    var room = null;

    if (this._roomList.length === 0) {
      room = new Room ();
      room.onDestroy( (room) => { this._onRoomDestroy(room); });
      this._roomList.push( room );
    }
    else {
      for (var i = 0; i < this._roomList.length; i++) {
        var currentRoom = this._roomList[i];
        if (!currentRoom.isStartFrom &&
          currentRoom.players.length !== config.maxPlayerPeerParty &&
          !currentRoom.alreadyJoined( socket.request.user._id.toString() ) ){
          room = currentRoom;
          break;
        }
      }

      if (!room) {
        room = new Room();
        room.onDestroy((room) => { this._onRoomDestroy(room); });
        this._roomList.push(room);
      }
    }

    return room;
  }

  _onRoomDestroy (room) {
    this._delRoomById(room.id);
  }

  _delRoomById( roomId ){
    for (var i = 0; i < this._roomList.length; i++) {
      var currentRoom = this._roomList[i];
      if( currentRoom.id === roomId ){
        this._roomList.splice( i, 1);
        return true;
      }
    }
    return false;
  }
}

module.exports = Game;