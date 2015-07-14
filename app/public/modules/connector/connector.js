"use strict";

function Connector () {

    var self = this;

    var _socket = io();

    //PUBLIC METHODS//

    //Authentification
    self.setUser = function( userName ){

        _socket.emit( "setUser", userName );
    };

    self.onSetUser = function( callback ){

        _socket.on( "setUser", function( userProfil ){

            callback( userProfil );
        });
    };

    self.setTokenAndReturnUseProfil = function( token, callback ){

        _socket.on( "setToken", function( userProfil ){

            callback( userProfil );
        });

        _socket.emit( "setToken", token );
    };

    //Game
    self.getMap = function( callback ) {

        _socket.on( "map", function ( map ) {

            callback( map );
        });

    };

    self.ready = function(){
        _socket.emit( "ready", {} );
    };

    self.onReady = function( callback ){
        _socket.on( "ready", function( partyData ){
           callback( partyData.partyTimer );
        });
    };

    self.sendMyPosition = function( position ) {

        _socket.emit( "myPosition", position );
    };

    self.onNewPlayer = function( callback ) {

        _socket.on( "newPlayer", function( playerData ) {

            callback( playerData.id, playerData.name, playerData.position, playerData.powerUp, playerData.alive, playerData.kills );
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

        _socket.on( "setBomb" , function( bombeData ) {

            callback( bombeData.ownerId, bombeData.bombeId, bombeData.position );
        });
    };

    self.setBomb = function( bombTempId ){

        _socket.emit( "setBomb", bombTempId );
    };

    self.setPermanentBombId = function( callback ){
        _socket.on( "setPermanentBombId", function( data ){
            callback( data.tempId, data.id );
        });
    };

    self.onExplosion = function( callback ){

        _socket.on( "explosion", function( explosionData ) {
            callback( explosionData.ownerId, explosionData.bombesExplodedId, explosionData.playersIdKilled, explosionData.blocksIdDestroy );
        });
    };

    //PRIVATE METHODS//

}