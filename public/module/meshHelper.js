"use strict";
function MeshHelper(){
    var self = this;
    self.importMesh = function (url, colision , position, callback){
        /* Optional : colision, position,callback*/
        var meshReturn = {};

        BABYLON.SceneLoader.ImportMesh("", "/content/", url+'.babylon', _scene, function (newMeshes) {
            for (var i in newMeshes) {
                if (newMeshes.hasOwnProperty(i)) {
                    //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);
                    if(position){
                        newMeshes[i].position = new BABYLON.Vector3(position.x, position.y, position.z);
                    }
                    newMeshes[i].checkCollisions = colision ? false : true;
                }
            }
            meshReturn.shape = newMeshes;
        });

        if(colision) {
            BABYLON.SceneLoader.ImportMesh("", "/content/", url+'Colision.babylon', _scene, function (newMeshes) {
                for (var i in newMeshes) {
                    if (newMeshes.hasOwnProperty(i)) {
                        //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);
                        if(position){
                            newMeshes[i].position = new BABYLON.Vector3(position.x, position.y, position.z);
                        }
                        newMeshes[i].checkCollisions = true;

                    }
                }
                meshReturn.colision = newMeshes;
            });
        }
        callback && callback(meshReturn);
    };

    self.tempBlockMesh = self.importMesh("tempBlock", _scene, true);
    //self.tempBlockMesh.visibility = false;
}