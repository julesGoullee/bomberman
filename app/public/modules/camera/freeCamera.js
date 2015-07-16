"use strict";

function FreeCamera( scene ) {

    var self = this;


    var _speed = 1;

    var _inertia = 0.9;

    var angularSensibility = 3000;


    //PUBLIC METHODS//

    self.camera = initCamera();


    //PRIVATE METHODS//

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraFree",
            new BABYLON.Vector3( 0, 60, 0 ),
            scene
        );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D

        camera.inertia = _inertia;

        camera.speed = _speed;

        camera.angularSensibility = angularSensibility;

        return camera;
    }
}

