"use strict";

function Player ( name, spawnPoint ) {

    var self = this;

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
        bombs: 1
    };

    self.setBomb = function ( bomb ){

        if ( self.powerUp.bombs > 0 ) {

            self.powerUp.bombs -= 1;

            if ( bomb.exploded = true ) {

                self.powerUp.bomb += 1;
            }
        }
    };


}