"use strict";

function Block ( assets, position ) {

    var self = this;


    /*PUBLIC METHODS*/

    self.position = position;

    self.meshsData = {

        colision : function() {

            var meshTempColision = assets["tempBlockColision"][0].clone();

            meshTempColision.isVisible = true;

            meshTempColision.checkCollisions = true;

            meshTempColision.position = {
                x: self.position.x,
                y: 0, z: self.position.z
            };

            return meshTempColision;
        }(),

        shape : function () {

            //var meshTemp = assets["tempBlock"][0].clone();
            //
            //meshTemp.isVisible = true;
            //
            //meshTemp.position = {x: self.position.x, y: 0, z: self.position.z};
        }()
    };

    /*PRIVATE METHODS*/

}