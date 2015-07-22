"use strict";

function CameraSwitcher ( scene , canvas ) {

    var self = this;

    var _scene = scene ;

    var _canvas = canvas;

    var _cameraFree;
    var _cameraPlayer;
    var _cameraDead;


    //PUBLIC METHODS//

    self.switchCamera = function () {

        var activeCamera = _scene.activeCamera;

        activeCamera.detachControl( _canvas );

        if ( activeCamera.id === "cameraPlayer" ) {

            _scene.activeCamera = _scene.getCameraByID( "cameraFree" );

        } else if( activeCamera.id === "cameraFree" ) {

            _scene.activeCamera = _scene.getCameraByID( "cameraPlayer" );

        }
        else if( activeCamera.id === "cameraDead" ) {

            _scene.activeCamera = _scene.getCameraByID( "cameraFree" );

        }

        _scene.activeCamera.attachControl( _canvas );

    };

    self.playerView = function ( position, callback ) {

        var cameraDead = _scene.getCameraByID( "cameraDead" );

        cameraDead.target = new BABYLON.Vector3( position.x, 1, position.z) ;

        var animationAlpha = new BABYLON.Animation( cameraDead, "radius", 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT );

        var keysAnimAlpha = [];
        var newAlpha = 50;

        keysAnimAlpha.push( { frame: 0, value: cameraDead.radius } );
        keysAnimAlpha.push( { frame: 50, value: newAlpha/2 } );
        keysAnimAlpha.push( { frame: 100, value: newAlpha } );

        animationAlpha.setKeys( keysAnimAlpha );
        cameraDead.animations.push(animationAlpha);

        _scene.beginAnimation( cameraDead, 0, 100, false, 1, function(){
            _scene.activeCamera = _scene.getCameraByID( "cameraPlayer" );
            //_scene.collisionsEnabled = true;
            //cameraDead.checkCollisions = true;
            callback();
        });
    };

    self.deadView = function () {

        _scene.activeCamera = _scene.getCameraByID( "cameraDead" );

    };


    //PRIVATE METHODS//

    function initCameraDead() {

        var speed = 1;
        var inertia = 0.9;
        var angularSensibility = 3000;

        var camera = new BABYLON.ArcRotateCamera( "cameraDead", 1, 0.8, 400, new BABYLON.Vector3( 0, 0, 0 ), _scene );

        camera.inertia = inertia;

        camera.speed = speed;

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

    function initCameraPlayer() {

        var speed = 1;

        var inertia = 0.9;

        var angularInertia = 0;

        var angularSensibility = 5000;

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            new BABYLON.Vector3( 0, 8 , 0 ),
            _scene
        );

        camera.setTarget( new BABYLON.Vector3( 0, 4, 0 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2.5, 3.7, 2.5 );

        camera.ellipsoidOffset = new BABYLON.Vector3( 0, 6, 0);

        camera.inertia = inertia;

        camera.speed = speed;

        camera.applyGravity = true;

        camera.checkCollisions = true;

        camera.angularSensibility = angularSensibility;

        camera.angularInertia = angularInertia;

        camera.rotation.x = 1;

        camera.noRotationConstraint = false;

        camera.keysUp = [];

        camera.keysLeft = [];

        camera.keysDown = [];

        camera.keysRight = [];

        return camera;

    }

    function initCameraFree() {

        var speed = 1;
        var inertia = 0.9;
        var angularSensibility = 3000;

        var camera = new BABYLON.FreeCamera(
            "cameraFree",
            new BABYLON.Vector3( 0, 60, 0 ),
            _scene
        );

        camera.setTarget( new BABYLON.Vector3( 0, 15, 0 ) );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D

        camera.inertia = inertia;

        camera.speed = speed;

        camera.angularSensibility = angularSensibility;

        return camera;

    }


    function init() {
        _cameraDead = initCameraDead();
        _cameraPlayer = initCameraPlayer();
        _cameraFree = initCameraFree();
    }

    init();
}