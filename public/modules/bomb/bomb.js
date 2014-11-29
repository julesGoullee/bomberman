"use strict";

function Bombe ( owner, position, assets ) {

    var self = this;


    /*PUBLIC METHODS*/

    self.id = utils.guid();

    self.power = 1;

    self.type = "bombs";

    self.countdown = 2000;

    self.exploded = false;

    self.duration = 800;

    self.owner = owner;

    self.position = { x: 0, y: 0, z: 0 };

    self.meshs = {};

    self.destroy = function () {

        self.exploded = true;
    };


    /*PRIVATE METHODS*/

    function init() {

        createMeshColision();

        createMesh();
    }

    function createMesh () {

        if ( assets["bomb"] === undefined ) {

            throw new Error( "Mesh bomb is not preload" );
        }

        var meshBomb =  assets["bomb"][0].clone();

        meshBomb.position =  {
            x: position.x,
            y: 3,
            z: position.z
        };

        meshBomb.isVisible = true;

        meshBomb.checkCollisions = false;

        self.meshs.shape = meshBomb;

    }

    function createMeshColision() {

        if ( assets["bombColision"] === undefined ) {

            throw new Error( "Mesh bombColision is not preload" );
        }

        var meshBombColision = assets["bombColision"][0].clone();

        meshBombColision.position = {
            x: position.x,
            y: 0,
            z: position.z
        };

        meshBombColision.isVisible = true;

        //meshBombColision.checkCollisions = true;

        self.meshs.colisionBlock = meshBombColision;

        self.position = meshBombColision.position;

    }

    init();
}