function ImportMesh(url, scene, colision , position, callback){
    var meshReturn = {};

    BABYLON.SceneLoader.ImportMesh("", "/content/", url+'.babylon', scene, function (newMeshes) {
        for (var i in newMeshes) {
            if (newMeshes.hasOwnProperty(i)) {
                //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);
                if(position){
                    newMeshes[i].position = new BABYLON.Vector3(0,0,0);
                }
                newMeshes[i].checkCollisions = colision ? false : true;
            }
        }
        meshReturn.shape = newMeshes;
    });

    if(colision) {
        BABYLON.SceneLoader.ImportMesh("", "/content/", url+'Colision.babylon', scene, function (newMeshes) {
            for (var i in newMeshes) {
                if (newMeshes.hasOwnProperty(i)) {
                    //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);
                    if(position){
                        newMeshes[i].position = new BABYLON.Vector3(0,0,0);
                    }
                    newMeshes[i].checkCollisions = true;

                }
            }
            meshReturn.colision = newMeshes;
        });
    }
    callback && callback(meshReturn);
}

