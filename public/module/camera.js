"use strict";
function CameraPlayer (position){
    //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(position[0], 15, position[1]), scene);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-46, 127, -70), _scene);
    camera.setTarget(new BABYLON.Vector3(0, 15, -65));
    camera.attachControl(_canvas, false);
    //camera.checkCollisions = true;
    // create a sphere for the camera collision
    camera.ellipsoid = new BABYLON.Vector3(2,3,2);
    //camera.applyGravity = true;
    //camera.inertia = 0.4;
    //camera.angularSensibility = 1000;
    camera.speed = 1;

    return camera
}