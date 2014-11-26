"use strict";

function Player ( name, spawnPoint, assets ) {

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

    self.setBomb = function () {
        var bomb = new Bombe( self, { x:0, z:0 }, assets);

        if ( self.listBombs.length < self.powerUp.bombs ) {

            self.listBombs.push( bomb );
            return true;
        }
        return false;
    };

    //TODO getBombeById

    /*PRIVATE METHODS*/
    function init() {
        createMesh();
        //self.setBomb();
    }

    function createMesh() {
        self.mesh = assets["spherePlayer"][0].clone();
        self.mesh.isVisible = true;
    }

    init();
}