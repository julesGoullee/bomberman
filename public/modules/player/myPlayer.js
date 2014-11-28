"use strict";

function MyPlayer( game, name, spawnPoint, assets ) {

    var self = this;

    var _scene = game.scene;

    //player speed
    var _speed = 1;

    //player inertia
    var _inertia = 0.9;

    //player angular inertia
    var _angularInertia = 0;

    //mouse sensibility (lower the better sensible)
    var angularSensibility = 3000;


    /*PUBLIC METHODS*/

    self.player = new Player( name, spawnPoint, assets );

    // player camera
    self.camera = initCamera();

    // attache camera to player mesh
    //self.player.meshs.shape.parent = self.camera;
    //scene.activeCameras.push( self.camera );

    _scene.activeCamera = self.camera;
    self.camera.noRotationConstraint = true;

    self.renderMyPlayer = function() {
        self.player.meshs.shape.position.x = self.camera.position.x -10;
        self.player.meshs.shape.position.z = self.camera.position.z;
    };

    /*PRIVATE METHODS*/

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( spawnPoint[0], 7 ,spawnPoint[1] ),
            _scene
        );

        //var camera = new BABYLON.FreeCamera(
        //    "cameraPlayer",
        //    new BABYLON.Vector3( self.player.position.x, self.player.position.y, self.player.position.z ),
        //    scene
        //);

        camera.attachControl( _scene.getEngine().getRenderingCanvas() );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 3, 3.5, 3 );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D


        camera.inertia = _inertia;

        camera.speed = _speed;

        camera.applyGravity = true;

        camera.checkCollisions = true;

        camera.angularSensibility = angularSensibility;

        //cam.angularInertia = angularInertia;

        //cam.layerMask = 2;

        return camera;
    }
}

