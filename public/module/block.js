"use strict";
function Block(position){
    var self = this;
    self.position = position;
    var init = function(){
         _meshHelper.importTempMesh(function(mesh){
             self.mesh = mesh.shape[0].clone();
             //self.mesh.visibility = true;
             self.mesh.position = {x: self.position.x, y: 0, z: self.position.z};

             self.meshColision = mesh.colision[0].clone();
             //self.meshColision.visibility = true;
             self.meshColision.position = {x: self.position.x, y: 0, z: self.position.z};

         });
    };

    init()

}