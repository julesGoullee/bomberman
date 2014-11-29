"use strict";

function Player ( name, spawnPoint, assets, blockDim ) {

    var self = this;

    var _blockDim = blockDim;

    /*PUBLIC METHODS*/

    self.id = utils.guid();

    self.name = name;

    self.type = "player";

    self.alive = true;

    self.kills = 0;

    self.listBombs = [];

    self.position = { x: 0, y: 0, z: 0 };

    self.meshs = {};

    self.powerUp = {
        speed: 0.45,
        shoot: false,
        bombs: 2
    };

    self.roundPosition = function () {

        function roundValue ( value ) {

            return Math.round( Math.round( value ) / _blockDim ) *  _blockDim;

        }

        return {
            x: roundValue( self.position.x ),
            z: roundValue( self.position.z )
        }
    };

    self.shouldSetBomb = function () {

        return self.listBombs.length < self.powerUp.bombs ;
    };

    /*PRIVATE METHODS*/

    function init() {
        createMesh();
    }

    function createMesh() {

        if ( assets["personnage"] === undefined ) {

            throw new Error( "Mesh personnage is not preload" );
        }

        var meshPlayer = assets["personnage"][0].clone();

        meshPlayer.isVisible = true;

        meshPlayer.position = {
            x: spawnPoint[0],
            y: 11.5,
            z: spawnPoint[1]
        };

        self.meshs.shape = meshPlayer;

        self.position = meshPlayer.position;
    }

    init();
}