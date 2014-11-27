"use strict";

function FreeCamera(game) {

    var self = this;

    var _scene = game.scene;

    var _speed = 1;

    var _inertia = 0.9;

    //mouse sensibility (lower the better sensible)
    var angularSensibility = 3000;


    /*PUBLIC METHODS*/

    self.camera = initCamera();

    //_scene.activeCameras.push( self.camera );

    //_scene.activeCamera = self.camera;


    /*PRIVATE METHODS*/

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraFree",
            new BABYLON.Vector3(0, 60, 0),
            _scene
        );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2, 3.5, 2 );

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

