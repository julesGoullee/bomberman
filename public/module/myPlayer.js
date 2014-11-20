"use strict";

function MyPlayer ( game, name, spawnPoint ) {

    var self = this;

    var scene = game.scene;

    //player speed
    var speed = 1;

    //player inertia
    var inertia = 0.9;

    //player angular inertia
    var angularInertia = 0;

    //mouse sensibility (lower the better sensible)
    var angularSensibility = 3000;


    /*PUBLIC METHODS*/

    self.player = new Player( name, spawnPoint );

    // player camera
    self.camera = initCamera();

    scene.activeCameras.push( self.camera );

    scene.activeCamera = self.camera;


    /*PRIVATE METHODS*/

    function initCamera(){

        //var camera = new BABYLON.FreeCamera(
        //    "cameraPlayer",
        //    //new BABYLON.Vector3(-46, 127, -70),
        //    new BABYLON.Vector3(0, 60, 0),
        //    scene
        //);

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( self.player.position.x, self.player.position.y, self.player.position.z ),
            scene
        );

        camera.attachControl( scene.getEngine().getRenderingCanvas() );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2, 3.5, 2 );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D


        camera.inertia = inertia;

        camera.speed = speed;

        //camera.applyGravity = true;
        //
        //camera.checkCollisions = true;

        camera.angularSensibility = angularSensibility;

        //cam.angularInertia = angularInertia;

        //cam.layerMask = 2;

        return camera;
    }
}

