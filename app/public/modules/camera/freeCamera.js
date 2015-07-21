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

function PlayerCamera( scene ){

    var self = this;

    var _speed = 1;

    var _inertia = 0.9;

    var _angularInertia = 0;

    var angularSensibility = 5000;

    self.camera = initCamera();

    function initCamera(){
        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( 0, 8 , 0 ),
            scene
        );


        camera.setTarget( new BABYLON.Vector3( 0, 4, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2.5, 3.7, 2.5 );

        camera.ellipsoidOffset = new BABYLON.Vector3( 0, 6, 0);

        camera.inertia = _inertia;

        camera.speed = _speed;

        camera.applyGravity = true;

        camera.checkCollisions = true;

        camera.angularSensibility = angularSensibility;

        camera.angularInertia = _angularInertia;

        camera.rotation.x = 1;

        camera.noRotationConstraint = false;

        return camera;
    }

}

