"use strict";

function Block ( game, position ) {

    var self = this;

    self.position = position;

    self.game = game;

    self.meshs = {

        colision : function() {
            var meshTempColision = self.game.assets["tempBlockColision"][0].clone();

            meshTempColision.isVisible = true;

            meshTempColision.checkCollisions = true;

            meshTempColision.position = {
                x: self.position.x,
                y: 0, z: self.position.z
            };

            return meshTempColision;
        }(),

        shape : function () {
            var meshTemp = self.game.assets["tempBlock"][0].clone();

            meshTemp.isVisible = true;

            meshTemp.position = {x: self.position.x, y: 0, z: self.position.z};
        }()
    };
}