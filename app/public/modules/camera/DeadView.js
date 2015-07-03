"use strict";

function DeadView( scene ) {

    var self = this;

    var _scene = scene;

    var _speed = 1;

    var _inertia = 0.9;

    var angularSensibility = 3000;


    //PUBLIC METHODS//

    self.camera = initCamera();


    //PRIVATE METHODS//

    function initCamera() {

        var camera = new BABYLON.ArcRotateCamera( "cameraDead", 0, 0, 0, BABYLON.Vector3.Zero(), _scene );

        camera.setPosition( new BABYLON.Vector3( -86, 117, 0 ) );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D

        camera.inertia = _inertia;

        camera.speed = _speed;

        camera.angularSensibility = angularSensibility;

        camera.lowerRadiusLimit = 5;

        camera.upperRadiusLimit = 200;

        camera.lowerBetaLimit = 0.1;

        camera.upperBetaLimit = (Math.PI / 2) * 0.9;

        return camera;
    }
}
