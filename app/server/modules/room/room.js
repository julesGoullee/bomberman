"use strict";

var config = require("../../config/config.js");
var Player = require("../player/player.js");
var utils = require("../utils/utils.js");
var Map = require("../map/map.js");

function Room() {

    var self = this;

    var _map = new Map();

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

    self.addPlayer = function( userProfil ) {

        var player = new Player( userProfil.socket, userProfil.name, self );

        self.players.push( player );

        sendPlayerPosition( player );

        sendOldPlayersToNew( player );

        sendNewPlayerToOld( player );

        listenPlayerPosition( player );

        listenDisconnect( player );

        listenBomb( player );
    };

    self.delPlayerById = function( id ) {

        for ( var i = 0 ; i < self.players.length ; i ++ ) {

            if ( self.players[i].id === id ) {

               self.players.splice( i , 1);
            }
        }
    };

    //PRIVATE METHODS

    function broadcastWithoutMe ( player, event, params ) {

        for ( var i = 0 ; i < self.players.length; i++ ) {

            if ( player.id !== self.players[i].id ) {

                self.players[i].socket.emit( event, params );
            }
        }
    }

    function sendOldPlayersToNew ( player ) {

        var otherPlayers = getOtherPlayer( player );

        for ( var i = 0; i < otherPlayers.length ; i++ ) {

            player.socket.emit( "newPlayer", {
                id: otherPlayers[i].id,
                name: otherPlayers[i].name,
                position: otherPlayers[i].position
            });
        }
    }

    function sendNewPlayerToOld ( player ){

        broadcastWithoutMe( player, "newPlayer", {
            id: player.id,
            name: player.name,
            position: player.position
        });

    }

    function getOtherPlayer( player ) {

        var players = [];

        for ( var i = 0; i < self.players.length; i++ ) {

            if ( player.id !== self.players[i].id ) {

                players.push( self.players[i] );
            }
        }

        return players;
    }


    //Player event
    function sendMapNewPlayer( newPlayer ){

    }

    function sendPlayerPosition( newPlayer ){

        newPlayer.socket.emit( "myPosition" , newPlayer.position );

    }

    function listenPlayerPosition( player ){

        player.socket.on( "myPosition" , function ( position ) {

            broadcastWithoutMe( player, "onPlayerMove", { id: player.id, position: position } );
        });
    }

    function listenDisconnect( player ){

        player.socket.on( "disconnect", function() {

            //console.log( "Player disconnect: " + player.name + " on room: " + self.id );

            self.playersSpawnPoint.liberatePlayerPosition( player.id );

            broadcastWithoutMe( player, "playerDisconnect", { id: player.id } );

            self.delPlayerById( player.id );

        });

    }

    function listenBomb( player ){

        player.socket.on( "setBomb", function(){

            broadcastWithoutMe( player, "setBomb", { id: player.id } );

        });

    }
}

module.exports = Room;