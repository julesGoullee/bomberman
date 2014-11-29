"use strict";

function MyPlayer( scene, blockDim, name, spawnPoint, assets ) {

    var self = this;

    var _scene = scene;

    //player speed
    var _speed = 1;

    //player inertia
    var _inertia = 0.9;

    //player angular inertia
    //var _angularInertia = 0;

    //mouse sensibility (lower the better sensible)
    var angularSensibility = 3000;


    /*PUBLIC METHODS*/

    self.player = new Player( name, spawnPoint, assets, blockDim );

    // player camera
    self.camera = initCamera();

    // attache camera to player mesh
    //self.player.meshs.shape.parent = self.camera;
    //scene.activeCameras.push( self.camera );

    _scene.activeCamera = self.camera;

    self.camera.noRotationConstraint = false;

    self.renderMyPlayer = function() {

        self.player.meshs.shape.position.x = self.camera.position.x;
        self.player.meshs.shape.position.z = self.camera.position.z;
        //self.player.mesh.rotate(BABYLON.Axis.Z, self.camera.rotation.z + Math.PI/2, BABYLON.Space.LOCAL);
    };

    /*PRIVATE METHODS*/

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( spawnPoint[0], 7 ,spawnPoint[1] ),
            _scene
        );

        //camera.attachControl( _scene.getEngine().getRenderingCanvas(), true );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2.5, 3.5, 2.5 );

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
