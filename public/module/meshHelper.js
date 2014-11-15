"use strict";
function MeshHelper(){
    var self = this;
    var importLoading = false;
    var importStack = [];
    self.importMesh = function (url, colision , position, callback){
        /* Optional : colision, position,callback*/
        //importStack.push({
        //    url : url,
        //    colision :colision ,
        //    position: position,
        //    callback:callback
        //});
        //if(!importLoading){
            importMesh(url, colision , position, callback);
        //}
    };

    var importMesh = function(url, colision , position, callback){
        //debugger;
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

            if(colision) {
                console.log(url,_scene);
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
                        end();
                });
            }
            else{
                end();
            }
            function end(){
                //debugger;
                callback && callback(meshReturn);
                //importStack.shift();
                //if(importStack.length > 0){
                //    importMesh(importStack[0].url, importStack[0].colision , importStack[0].position, importStack[0].callback );
                //}else{
                //    importLoading = false;
                //}
            }
        });



    };

    self.importTempMesh = function(callback){
      if(self.tempBlockMesh) {
          callback(self.tempBlockMesh);
      }
        else{
            importStack.push(callback);
        }
    };

    self.importMesh("tempBlock", true, false, function(mesh){
        self.tempBlockMesh = mesh;
        //self.tempBlockMesh.shape[0].position = {x: 0, y: 0, z: 0};
        //self.tempBlockMesh.colision[0].position = {x: 0, y: 0, z: 0};
        self.tempBlockMesh.shape[0].visibility = false;
        self.tempBlockMesh.colision[0].visibility = false;
        for(var i = 0; i < importStack.length; i++){
                importStack[i](self.tempBlockMesh);
        }
    });
}