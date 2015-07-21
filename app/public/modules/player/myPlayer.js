"use strict";

function MyPlayer( scene, spawnPoint, connector, cameraSwitcher ) {

    var self = this;

    var _scene = scene;

    var _cameraSwitcher = cameraSwitcher;

    var notifyMovePlayer = new NotifyMovePlayer( connector, spawnPoint );


    //PUBLIC METHODS//

    self.player = null;

    self.attachControl = function(){

        self.camera.position.x = spawnPoint.x;
        self.camera.position.z = spawnPoint.z;

        self.camera.setTarget( new BABYLON.Vector3( 0, 4, 0) );

        self.player.position = self.camera.position;

        var pivot = BABYLON.Matrix.Translation(1.3,0,0.2);

        self.player.meshs.colisionBlock.setPivotMatrix( pivot );
        self.player.meshs.shape.setPivotMatrix( pivot );

        self.player.meshs.colisionBlock.rotationQuaternion = null;
        self.player.meshs.shape.rotationQuaternion = null;
    };

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
            self.player.position.x = self.camera.position.x ;
            self.player.position.z = self.camera.position.z;

        }else{

            _cameraSwitcher.deadView();
        }
    };

    self.restoreInit = function () {

        _scene.activeCamera = _scene.getCameraByID( "cameraPlayer" );

        _cameraSwitcher.switchCamera();

        self.camera.position = new BABYLON.Vector3( spawnPoint.x, 8 , spawnPoint.z );

        self.camera.setTarget(new BABYLON.Vector3( 0, 4, -65 ));

    };
    
    //PRIVATE METHODS//

    function checkMovePlayer() {

        notifyMovePlayer.notifyNewPosition( self.camera.position );

        setTimeout( checkMovePlayer, 100);
    }

    function init(){

        self.camera =  _scene.getCameraByID( "cameraPlayer" );

        checkMovePlayer();
    }

    init();
}

