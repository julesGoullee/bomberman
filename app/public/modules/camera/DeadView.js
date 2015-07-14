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

        var camera = new BABYLON.ArcRotateCamera( "cameraDead", 1, 0.8, 400, new BABYLON.Vector3( 0, 0, 0 ), _scene );

        camera.inertia = _inertia;

        camera.speed = _speed;

        camera.angularSensibility = angularSensibility;

        camera.lowerRadiusLimit = 5;

        camera.upperRadiusLimit = 400;

        camera.lowerBetaLimit = 0.1;

        camera.upperBetaLimit = (Math.PI / 2) * 0.9;

        camera.keysUp = [];

        camera.keysLeft = [];

        camera.keysDown = [];

        camera.keysRight = [];


        return camera;
    }
}
