"use strict";

define(["config/config"],function( cfg ){
    return function Block ( id, position, assets) {

        var self = this;


        //PUBLIC METHODS//

        self.id = id;

        self.type = "block";

        self.position = { x: 0, y: 0, z: 0 };

        self.meshs = {};

        self.destroy = function () {

            self.meshs.shape.dispose();

            self.meshs.colisionBlock.dispose();
        };


        //PRIVATE METHODS//

        function init() {

            createMeshColision();

            createMesh();

        }

        function createMesh () {

            var meshTemp = assets["tempBlock"][0].clone();

            meshTemp.isVisible = true;

            meshTemp.checkCollisions = false;

            meshTemp.position =  {
                x: position.x,
                y: 0,
                z: position.z
            };

            self.meshs.shape = meshTemp;

            self.position = meshTemp.position;

        }

        function createMeshColision() {

            var meshTempColision = assets["tempBlockColision"][0].clone();

            meshTempColision.isVisible = cfg.showBlockColision;

            meshTempColision.checkCollisions = true;

            meshTempColision.position = {
                x: position.x,
                y: 0,
                z: position.z
            };

            self.meshs.colisionBlock = meshTempColision;
        }

        init();
    };
});