"use strict";

function Player ( name, spawnPoint ) {

    var self = this;

    /*PUBLIC METHODS*/

    self.id = utils.guid();

    self.name = name;

    self.type = "player";

    self.alive = true;

    self.kills = 0;

    self.listBombs = [];

    self.position = {
        x: spawnPoint[0],
        y: 0,
        z: spawnPoint[1]
    };

    self.powerUp = {
        speed: 0.45,
        shoot: false,
        bombs: 2
    };

    self.setBomb = function ( bomb ){

        if ( self.listBombs.length < self.powerUp.bombs ) {

            self.listBombs.push( bomb );
            return true;
        }
        return false;
    };

    //TODO getBombeById

    /*PRIVATE METHODS*/
}