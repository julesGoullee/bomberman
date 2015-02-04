"use strict";

var config = require("../../config/config.js");
var Player = require("../player/player.js");
var utils = require("../utils/utils.js");

function Room() {

    var self = this;

    var _playersSpawnPoint = [
        [50, -64.5],
        [-50, 64.5],
        [38, 75],
        [-38, -75 ]
    ];

    /*PUBLIC METHODS*/

    self.players = [];

    self.id = utils.guid();

    self.addPlayer = function( socket, name) {

        var player = new Player( socket, name, self);

        self.players.push( player );

        addEventListener( player );
    };

    self.delPlayerById = function( id ){

        for( var i = 0 ; i < self.players.length ; i ++ ){

            if ( self.players[i].id === id ) {

               self.players.splice( i , 1);
            }
        }
    };
    /*PRIVATE METHODS*/

    function addEventListener( player ){


        var newPlayerPosition  = _playersSpawnPoint[ self.players.length-1 ];

        player.position.x = newPlayerPosition[0];

        player.position.z = newPlayerPosition[1];

        player.socket.emit( "myPosition" , player.position );

        sendOldPlayers( player );

        broadcastWithoutMe( player, "newPlayer", { id: player.id, name: player.name, position: player.position } );

        player.socket.on( "myPosition" , function ( position){

            broadcastWithoutMe( player, "onPlayerMove",{ id: player.id, position: position } );
        });

        player.socket.on( "disconnect", function(){

            console.log("Player disconnect: " + player.name + " on room: " + self.id);

            broadcastWithoutMe( player, "playerDisconnect", { id: player.id} );

            self.delPlayerById( player.id );

        });
    }

    function broadcastWithoutMe ( player, event, params){

        for ( var i = 0 ; i < self.players.length; i++ ){

            if( player.id !== self.players[i].id ){

                self.players[i].socket.emit( event, params );
            }
        }
    }

    function sendOldPlayers ( player ) {

        var otherPlayers = getOtherPlayer( player );

        for ( var i = 0; i < otherPlayers.length ; i++) {

            player.socket.emit("newPlayer", { id: otherPlayers[i].id, name: otherPlayers[i].name, position: otherPlayers[i].position }  );
        }
    }

    function getOtherPlayer( player ){

        var players = [];

        for ( var i = 0; i < self.players.length; i++ ) {

            if ( player.id !== self.players[i].id ){

                players.push( self.players[i] );
            }
        }

        return players;
    }
}

module.exports = Room;