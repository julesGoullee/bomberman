"use strict";

var config = require("../../config/config.js");
var utils = require("../utils/utils.js");

function Player( token, socket, name, room ) {

    var self = this;


    //PUBLIC METHODS//

    self.id = utils.guid();

    self.token = token;

    self.socket = socket;

    self.room = room;

    self.kills = 0;

    self.totalNbBombe = 0;

    self.alive = true;

    self.listBombs = [];

    self.position = {};

    self.powerUp = {
        speed: 0.45,
        shoot: false,
        bombs: 2
    };

    self.name = name;

    self.type = "player";

    self.roundPosition = function () {

        function roundValue ( value ) {

            return Math.round( Math.round( value ) / config.blockDim ) *  config.blockDim;

        }

        return {
            x: roundValue( self.position.x ),
            z: roundValue( self.position.z )
        }
    };

    self.shouldSetBomb = function () {

        return ( self.alive == true ) && (self.listBombs.length < self.powerUp.bombs );

    };

    self.destroy = function () {

        self.alive = false;

    };

    self.move = function( position ) {

        self.position.x = position.x;
        self.position.z = position.z;

    };

    self.addBomb = function ( bomb ) {

        self.listBombs.push( bomb );

        self.totalNbBombe ++;

    };

    self.delBombById = function ( Bombid ) {

        for ( var i = 0; i < self.listBombs.length ; i++ ) {

            if ( self.listBombs[i].id === Bombid ) {

                self.listBombs.splice( i, 1 );

                return true;
            }
        }

        return false;
    };

    self.delBombs = function ( ){

        for ( var i = 0; i < self.listBombs.length ; i++ ) {

            self.listBombs[i].deleted();
        }

        self.listBombs = [];

        return true;
    };


    //PRIVATE METHODS//

    function init(){

        var newPosition = room.playersSpawnPoint.getFreePosition();
        newPosition.playerId = self.id;
        self.position = { x: newPosition.x, z: newPosition.z };
    }

    init();
}

module.exports = Player;