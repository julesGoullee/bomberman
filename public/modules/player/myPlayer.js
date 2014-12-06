"use strict";

function MyPlayer( scene, blockDim, name, spawnPoint, assets ) {

    var self = this;

    var _scene = scene;

    //player speed
    var _speed = 0.5;

    //player inertia
    var _inertia = 0.9;

    //player angular inertia
    var _angularInertia = 0;

    //mouse sensibility (lower the better sensible)
    var angularSensibility = 4000;


    //PUBLIC METHODS//

    self.player = new Player( name, spawnPoint, assets, blockDim );



    //PRIVATE METHODS//
    function init(){
        cameraPlayerAttach();
    }

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( spawnPoint[0], 13 ,spawnPoint[1] ),
            _scene
        );


        camera.setTarget( new BABYLON.Vector3( 0, 6.5, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2.5, 6.5, 2.5 );

        //camera.ellipsoidOffset = new BABYLON.Vector3( 0,0, 0);

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D

        camera.inertia = _inertia;

        camera.speed = _speed;

        camera.applyGravity = true;

        camera.checkCollisions = true;

        camera.angularSensibility = angularSensibility;

        camera.angularInertia = _angularInertia;

        return camera;
    }

    function cameraPlayerAttach(){
        // player camera
        self.camera = initCamera();
        self.camera.rotation.x = 1;
        self.player.position = self.camera.position;
        _scene.activeCamera = self.camera;
        self.camera.noRotationConstraint = false;
        //self.player.meshs.shape.translate(BABYLON.Axis.X, 10, BABYLON.Space.LOCAL);
        self.player.meshs.shape.rotationQuaternion = null;

        self.renderMyPlayer = function() {
            if(self.camera.rotation.x <  -0.5){
                self.camera.rotation.x = -0.5;
            }
            if(self.camera.rotation.x > 1.2){
                self.camera.rotation.x = 1.2;
            }
            self.player.meshs.shape.position.x = self.camera.position.x  + Math.PI/4;
            self.player.meshs.shape.position.z = self.camera.position.z;
            self.player.meshs.shape.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, self.camera.rotation.y+ Math.PI);
        };
    }

    init();
}

