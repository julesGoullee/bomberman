function Light(){
    // Create a hemisphericLight
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), _scene);
    // set the light intensity
    light.intensity = 0.7;
}