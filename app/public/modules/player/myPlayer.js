"use strict";

function MyPlayer( scene, blockDim, name, spawnPoint, assets ) {

    var self = this;

    var _scene = scene;

    var _speed = 1;

    var _inertia = 0.9;

    var _angularInertia = 0;

    var angularSensibility = 5000;


    //PUBLIC METHODS//

    self.player = new Player( name, spawnPoint, assets, blockDim );
    self.renderMyPlayer = function() {

        if ( self.camera.rotation.x <  -0.5 ) {

            self.camera.rotation.x = -0.5;
        }

        if ( self.camera.rotation.x > 1.4 ) {

            self.camera.rotation.x = 1.4;
        }

        self.player.meshs.shape.rotationQuaternion = BABYLON.Quaternion.RotationAxis( BABYLON.Axis.Y, self.camera.rotation.y);
        self.player.meshs.colisionBlock.rotationQuaternion = BABYLON.Quaternion.RotationAxis( BABYLON.Axis.Y, self.camera.rotation.y);

        self.player.meshs.colisionBlock.position.x = self.camera.position.x;
        self.player.meshs.shape.position.x = self.camera.position.x;

        self.player.meshs.colisionBlock.position.z = self.camera.position.z;
        self.player.meshs.shape.position.z = self.camera.position.z;
    };

    self.restoreInit = function ( position ) {

        if ( position ) {

            self.camera.position.x = spawnPoint[0];

            self.camera.position.z = spawnPoint[1];

            self.camera.setTarget(new BABYLON.Vector3(0, 6.5, -65));
        }

    };

    //PRIVATE METHODS//
    function init(){

        self.camera = initCamera();

        _scene.activeCamera = self.camera;

        cameraPlayerAttach();
    }

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( spawnPoint[0], 13 , spawnPoint[1] ),
            _scene
        );


        camera.setTarget( new BABYLON.Vector3( 0, 6.5, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2.5, 6.5, 2.5 );

        camera.ellipsoidOffset = new BABYLON.Vector3( 0,6, 0);

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

        camera.rotation.x = 1;

        camera.noRotationConstraint = false;

        return camera;
    }

    function cameraPlayerAttach(){

        self.player.position = self.camera.position;

        var pivot = BABYLON.Matrix.Translation( 0,0 ,2.5 );

        self.player.meshs.colisionBlock.setPivotMatrix( pivot );
        self.player.meshs.shape.setPivotMatrix( pivot );

        self.player.meshs.colisionBlock.rotationQuaternion = null;
        self.player.meshs.shape.rotationQuaternion = null;


    }

    init();
}

