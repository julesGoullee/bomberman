"use strict";

function powerUp ( position, pouvoir, valeur, assets ) {

    var self = this;

    // PUBLIC METHODS //

    self.position = position;

    self.pouvoir = pouvoir;

    self.valeur = valeur;

    self.destroy = function () {

        self.meshs.shape.dispose();

        self.meshs.colisionBlock.dispose();

    };

    self.init = function () {
        createMesh();
        createMeshColision();
    };

    // PRIVATE METHODS //

    function createMesh() {

        if ( assets["powerUp"] === undefined ) {

            throw new Error( "Mesh powerUp is not preload" );
        }

        var meshPowerUp = assets["powerUp"][0].clone();

        meshPowerUp.isVisible = true;

        meshPowerUp.position = {
            x: position.x,
            y: 0,
            z: position.z
        };

        self.mesh.shape = meshPowerUp;
    }

    function createMeshColision() {

        var meshTempColision = assets["tempBlockColision"][0].clone();

        meshTempColision.isVisible = cfg.showBlockColision;

        meshTempColision.checkCollisions = false;

        meshTempColision.position = {
            x: position.x,
            y: 0,
            z: position.z
        };

        self.meshs.colisionBlock = meshTempColision;
    }

    self.init();

}