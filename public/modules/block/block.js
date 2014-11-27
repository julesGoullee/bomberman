"use strict";

function Block ( assets, position ) {

    var self = this;

    /*PUBLIC METHODS*/

    self.position = {
        x: position.x,
        y: 0,
        z: position.z
    };

    self.meshs = {};


    //TODO destroy
    /*PRIVATE METHODS*/
     function init() {

        createMeshColision();

        createMesh();

    }

    function createMesh () {

        var meshTemp = assets["tempBlock"][0].clone();

        meshTemp.isVisible = true;

        meshTemp.checkCollisions = false;

        meshTemp.position =  self.position;

        self.meshs.shape = meshTemp;

    }

    function createMeshColision() {

        var meshTempColision = assets["tempBlockColision"][0].clone();

        meshTempColision.isVisible = true;

        meshTempColision.checkCollisions = true;

        meshTempColision.position = {
            x: self.position.x,
            y: 0,
            z: self.position.z
        };

        self.meshs.colisionBlock = meshTempColision;
    }

    init();
}