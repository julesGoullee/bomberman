"use strict";

function MyPlayer( scene, blockDim, name, spawnPoint, assets, connector ) {

    var self = this;

    var _scene = scene;

    var _speed = 1;

    var _inertia = 0.9;

    var _angularInertia = 0;

    var angularSensibility = 5000;

    var notifyMovePlayer = new NotifyMovePlayer(connector, spawnPoint);

    //PUBLIC METHODS//

    self.player = new Player( 0, name, spawnPoint, assets, blockDim );

    //scene.beginAnimation(self.player.meshs.shape.skeleton, 0, 100, true);


    self.renderMyPlayer = function() {

        if( self.player.alive == true ){

            if ( self.camera.rotation.x <  -0.5 ) {

                self.camera.rotation.x = -0.5;
            }

            if ( self.camera.rotation.x > 1.4 ) {

                self.camera.rotation.x = 1.4;
            }

            self.player.meshs.shape.rotationQuaternion = BABYLON.Quaternion.RotationAxis( BABYLON.Axis.Y, self.camera.rotation.y + Math.PI/2);
            self.player.meshs.colisionBlock.rotationQuaternion = BABYLON.Quaternion.RotationAxis( BABYLON.Axis.Y, self.camera.rotation.y + Math.PI/2);

            self.player.meshs.colisionBlock.position.x = self.camera.position.x;
            self.player.meshs.colisionBlock.position.z = self.camera.position.z;
            self.player.meshs.shape.position.x = self.camera.position.x ;
            self.player.meshs.shape.position.z = self.camera.position.z;

        }else{

            deadView();

        }
    };

    self.restoreInit = function () {

            self.camera.position.x = spawnPoint.x;

            self.camera.position.y = 8.04;

            self.camera.position.z = spawnPoint.z;

            self.camera.setTarget(new BABYLON.Vector3(0, 6.5, -65));


    };
    
    //PRIVATE METHODS//
    function init(){

        self.camera = initCamera();

        _scene.activeCamera = self.camera;

        cameraPlayerAttach();

        checkMovePlayer();
    }

    function initCamera() {

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( spawnPoint.x, 8 , spawnPoint.z ),
            _scene
        );


        camera.setTarget( new BABYLON.Vector3( 0, 4, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2.5, 3.7, 2.5 );

        camera.ellipsoidOffset = new BABYLON.Vector3( 0, 6, 0);

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


        var pivot = BABYLON.Matrix.Translation(1.3,0,0.2);

        self.player.meshs.colisionBlock.setPivotMatrix( pivot );
        self.player.meshs.shape.setPivotMatrix( pivot );

        self.player.meshs.colisionBlock.rotationQuaternion = null;
        self.player.meshs.shape.rotationQuaternion = null;


    }

    function deadView(){

        self.camera.position.x = 65;

        self.camera.position.y = 147;

        self.camera.position.z = 0;

        self.camera.setTarget(new BABYLON.Vector3(0.1, 0.1, 0.1));

    }

    function checkMovePlayer() {

        notifyMovePlayer.notifyNewPosition( self.camera.position );

        setTimeout( checkMovePlayer, 100);
    }
    init();
}

