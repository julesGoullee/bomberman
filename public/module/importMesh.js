function ImportMesh(url, scene, collision){
    BABYLON.SceneLoader.ImportMesh("", "/content/scenes/map/", url+'.babylon', scene, function (newMeshes) {

        if(collision) {
            for (var i in newMeshes) {
                if (newMeshes.hasOwnProperty(i)) {
                    //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);
                    // set collision system on
                    newMeshes[i].checkCollisions = true;
                }
            }
        }
        return newMeshes;
    });
}

