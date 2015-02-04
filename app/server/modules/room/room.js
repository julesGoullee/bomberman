"use strict";

var config = require("../../config/config.js");
var Player = require("../player/player.js");
var utils = require("../utils/utils.js");

function Room() {

    var self = this;

    var _playersSpawnPoint = [
        [50, -64.5],
        [36, -63],
        [-53, 64.5],
        [-39.5, -75 ]
    ];

    /*PUBLIC METHODS*/

    self.players = [];

    self.id = utils.guid();

    self.addPlayer = function( socket, name) {

        var player = new Player( socket, name);

        self.players.push( player );

        addEventListener( player );
    };

    /*PRIVATE METHODS*/

    function addEventListener( player ){

        player.socket.on( "getMyPosition" ,function(){

            var newPlayerPosition  = _playersSpawnPoint[ self.players.length ];

            player.position.x = newPlayerPosition[0];

            player.position.z = newPlayerPosition[1];

            player.socket.emit( "myPosition" , player.position );

            broadcastWithoutMe( player, "newPlayer", { id: player.id, name: player.name, position: player.position } );
        });

        player.socket.on( "myPosition" , function (){

        });

    }

    function broadcastWithoutMe ( player, event, params){

        for ( var i = 0 ; i < self.players.length; i++ ){
            if( player.id !== self.players[i].id ){

                self.players[i].socket.emit( event, params );
            }
        }
    }
}

module.exports = Room;