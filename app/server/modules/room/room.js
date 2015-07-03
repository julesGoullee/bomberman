"use strict";

var config = require("../../config/config.js");
var Player = require("../player/player.js");
var utils = require("../utils/utils.js");
var Maps = require("../maps/maps.js");

function Room() {

    var self = this;

    var _map;


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

    self.players = [];//TODO synchronisé avec la map

    self.id = utils.guid();

    self.addPlayer = function( userProfil ) {

        var player = new Player( userProfil.socket, userProfil.name, self );

        _map.addObject( player );

        self.players.push( player );

        sendMapToNewPlayer( player );

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
            player: playersJson,
            blockTemp: blocksTempJson
        });
    }

    function listenPlayerPosition( player ){

        player.socket.on( "myPosition" , function ( position ) {
            //TODO l'actualiser dans la carte
            broadcastWithoutMe( player, "onPlayerMove", { id: player.id, position: position } );
        });
    }

    function listenDisconnect( player ){

        player.socket.on( "disconnect", function() {
            _map.delPlayerById( player.id );

            //console.log( "Player disconnect: " + player.name + " on room: " + self.id );

            broadcastWithoutMe( player, "playerDisconnect", { id: player.id } );

        });

    }

    function listenBomb( player ){

        player.socket.on( "setBomb", function(){
            //TODO  l'actualiser dans la carte
            broadcastWithoutMe( player, "setBomb", { id: player.id } );

        });

    }

    function init(){
        _map = new Maps();
        _map.create();
    }

    init();
}

module.exports = Room;