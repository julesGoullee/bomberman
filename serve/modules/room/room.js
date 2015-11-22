"use strict";
/*jshint -W079 */
var config = require("../../config/config.js");
var Player = require("../player/player.js");
var utils = require("../utils/utils.js");
var Maps = require("../maps/maps.js");
var ga = require("../analitics/analitics.js");

function Room() {

  var self = this;
  var timeoutToStart;
  var _limitToCheckNumberPlayer = config.limitToCheckNumberPlayer;
  var _nbPlayersToStart = config.nbPlayersToStart;

  var _map;
  var _timeoutPartie;

  var _callbackDestroy = [];

  //PUBLIC METHODS

  self.playersSpawnPoint = [
    {
      x: 50,
      z: -64.5,
      playerId: false
    },
    {
      x: -50,
      z: 64.5,
      playerId: false
    },
    {
      x: 38,
      z: 75,
      playerId: false
    },
    {
      x: -38,
      z: -75,
      playerId: false
    }
  ];

  self.playersSpawnPoint.getFreePosition = function() {

    for ( var i = 0; i < self.playersSpawnPoint.length ; i++ ) {

      if ( self.playersSpawnPoint[i].playerId === false ) {

        return self.playersSpawnPoint[i];
      }
    }
  };

  self.playersSpawnPoint.liberatePlayerPosition = function( playerId ) {

    for ( var i = 0 ; i < self.playersSpawnPoint.length; i++ ) {

      if ( self.playersSpawnPoint[i].playerId === playerId ) {

        self.playersSpawnPoint[i].playerId = false;

        return true;
      }
    }

    return false;
  };

  self.players = [];

  self.id = utils.guid();

  self.timerToStart = config.timerToStartParty;

  self.isStartFrom = false;

  self.addPlayer = function( socket ) {
    var player = new Player( socket, socket.request.user, self );

    _map.addObject( player );

    //log( "Player connected: " + player.id + " on room: " + self.id, "info" );

    self.players.push( player );

    listenDisconnect( player );

    sendMapToNewPlayer( player );

    sendNewPlayerToOld( player );

  };

  self.alreadyJoined = function( id ){
    for ( var i = 0; i < self.players.length; i++ ) {
      var player = self.players[i];
      if( player.id === id ){
        return true;
      }
    }
    return false;
  };

  self.delPlayerById = function( id ) {

    for ( var i = 0 ; i < self.players.length ; i ++ ) {

      if ( self.players[i].id === id ) {

        _map.delPlayerById( id );

        self.players.splice( i , 1);
      }
    }
  };

  self.onDestroy = function ( callback ){
    _callbackDestroy.push( callback );
  };


  //PRIVATE METHODS

  function broadcastWithoutMe ( player, event, params ) {

    for ( var i = 0 ; i < self.players.length; i++ ) {

      if ( player.id !== self.players[i].id ) {

        self.players[i].socket.emit( event, params );
      }
    }
  }

  function broadcast( event, params ){
    for ( var i = 0 ; i < self.players.length; i++ ) {
      self.players[i].socket.emit( event, params );
    }
  }

  function sendNewPlayerToOld ( player ){

    broadcastWithoutMe( player, "newPlayer", {
      id: player.id,
      kills: player.kills,
      alive: player.alive,
      position: player.position,
      powerUp: player.powerUp,
      name: player.name
    });

  }

  //function getOtherPlayer( player ) {
  //
  //    var players = [];
  //
  //    for ( var i = 0; i < self.players.length; i++ ) {
  //
  //        if ( player.id !== self.players[i].id ) {
  //
  //            players.push( self.players[i] );
  //        }
  //    }
  //
  //    return players;
  //}


  //Player event

  function sendMapToNewPlayer( newPlayer ){

    var blocksTempJson = [];
    var playersJson = [];

    var players = _map.getPlayers();

    for ( var i = 0; i < players.length; i++ ) {
      var player = players[i];

      var playerJson = {
        id: player.id,
        kills: player.kills,
        alive: player.alive,
        position: player.position,
        powerUp: player.powerUp,
        name: player.name
      };

      if( player.id === newPlayer.id ){
        playerJson.isMine = true;
      }

      playersJson.push( playerJson );
    }

    var blocksTemp = _map.getBlocks();
    for ( var j = 0; j < blocksTemp.length; j++ ) {
      var blockTemp = blocksTemp[j];
      blocksTempJson.push({
        id: blockTemp.id,
        position: blockTemp.position
      });
    }

    newPlayer.socket.emit("map", {
      players: playersJson,
      blockTemp: blocksTempJson,
      timerToStart: self.timerToStart,
      limitToCheckNumberPlayer: _limitToCheckNumberPlayer,
      nbPlayersToStart: _nbPlayersToStart
    });
  }

  function listenPlayerPosition( player ){

    player.socket.on( "myPosition" , function ( position ) {

      player.move( position );
      broadcastWithoutMe( player, "onPlayerMove", { id: player.id, position: position } );
    });
  }

  function listenDisconnect( player ){

    player.socket.on( "disconnect", function() {

      //log( "Player disconnect: " + player.id + " on room: " + self.id, "info" );

      broadcastWithoutMe( player, "playerDisconnect", { id: player.id } );

      removeAllListener( player );

      if( !self.isStartFrom ){
        self.delPlayerById( player.id );
        if( self.players.length === 0 ){
          launchDestroyCallback();
        }
      }
      else{
        _map.killPlayerById( player.id );
        checkPlayersAlive();
      }

    });

  }

  function listenBomb( player ){

    function onExplosion( degats ){

      var blocksIdDestroy = [];
      for ( var i = 0; i < degats.blocks.length; i++ ) {

        blocksIdDestroy.push( degats.blocks[i].id );
      }

      var playersIdKilled = [];

      for ( var j = 0; j < degats.players.length; j++ ) {

        playersIdKilled.push( degats.players[j].id );
      }

      var bombesId = [];

      for ( var k = 0; k < degats.bombes.length; k++ ) {

        bombesId.push( degats.bombes[k].id );
      }

      broadcast( "explosion", {
        ownerId: player.id,
        bombesExplodedId: bombesId,
        playersIdKilled: playersIdKilled,
        blocksIdDestroy: blocksIdDestroy
      });

      checkPlayersAlive();
    }

    player.socket.on( "setBomb", function( tempId ){

      var bombe = _map.setBomb( player , onExplosion );

      if ( bombe ) {
        broadcastWithoutMe(player, "setBomb", {
          ownerId: player.id,
          bombeId : bombe.id,
          position: {
            x: bombe.position.x,
            z: bombe.position.z
          }
        });

        player.socket.emit("setPermanentBombId", {
          tempId: tempId,
          id: bombe.id
        });
      }else{
        //log("peut pas poser " + tempId, "err");
      }

    });

  }

  function removeAllListener( player ){
    player.socket.removeAllListeners("connection");
    //player.socket.removeAllListeners("ready");
    player.socket.removeAllListeners("setUser");
    player.socket.removeAllListeners("myPosition");
    player.socket.removeAllListeners("setBomb");
  }

  function startTimer( callback ){

    timeoutToStart = setTimeout(function () {

      if( self.timerToStart  > 0 ){
        self.timerToStart = self.timerToStart - 1000;

        if( self.timerToStart <= _limitToCheckNumberPlayer &&
          self.players.length < _nbPlayersToStart ) {

          self.timerToStart = _limitToCheckNumberPlayer;
          //block le timer a 10s en attendant un autre joueur
        }

        if(  self.players.length === 0 ){
          clearTimeout( timeoutToStart );

        } else if( self.timerToStart  === 0 ){
          clearTimeout( timeoutToStart );
          callback();
        }
        else
        {
          startTimer( callback );
        }
      }
      else{
        clearTimeout( timeoutToStart );
        callback();
      }
    }, 1000);

  }

  function launchDestroyCallback(){

    clearTimeout(_timeoutPartie);

    for ( var i = 0; i < _callbackDestroy.length; i++ ) {
      _callbackDestroy[i]( self );
    }
  }

  function endPartie(){

    for ( var i = 0; i < self.players.length; i++ ) {
      var player = self.players[i];
      removeAllListener( player );
    }

    broadcast("endPartie", {});
    launchDestroyCallback();

    ga.event("partie", "end", self.isStartFrom)
      .event("partie", "nbPlayer", self.players.length )
      .send();
  }

  function launchPartie(){

    self.isStartFrom = config.timerToPlaying;

    _timeoutPartie = setTimeout(function(){
      endPartie();
    }, self.isStartFrom );
  }

  function checkPlayersAlive(){
    if( _map.getPlayersAlive().length <=1 ){

      endPartie();
    }
  }

  function init(){
    _map = new Maps();
    _map.create();

    startTimer(function () {

      for ( var i = 0; i < self.players.length; i++ ) {
        var player = self.players[i];

        listenPlayerPosition( player );
        listenBomb( player );
      }

      launchPartie();

      broadcast("ready", { partyTimer : self.isStartFrom } );

    });

    ga.event("partie", "new", utils.dateToString( new Date() ) );
  }

  init();
}

module.exports = Room;
