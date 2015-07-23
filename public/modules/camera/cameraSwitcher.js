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

        var cameraLastPosition = {
            x: _cameraDead.position.x,
            y: _cameraDead.position.y,
            z: _cameraDead.position.z
        };

        _cameraDead.target = new BABYLON.Vector3( position.x, 0, position.z);

        //TODO pas sur de ça
        _cameraDead.setPosition( new BABYLON.Vector3( cameraLastPosition.x, cameraLastPosition.y, cameraLastPosition.z));

        var animationRaduis = new BABYLON.Animation( _cameraDead, "radius", 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT );

        var keysAnimRaduis = [];
        var newRaduis = 50;

        keysAnimRaduis.push( { frame: 0, value: _cameraDead.radius } );
        keysAnimRaduis.push( { frame: 25, value: newRaduis/2 } );
        keysAnimRaduis.push( { frame: 50, value: newRaduis } );

        animationRaduis.setKeys( keysAnimRaduis );

        _scene.beginDirectAnimation( _cameraDead, [animationRaduis], 0, 50, false, 1, function(){
            _scene.activeCamera = _cameraPlayer;
            //_scene.collisionsEnabled = true;
            //cameraDead.checkCollisions = true;
            callback();
        });
    };

    self.deadView = function () {

        _cameraDead.alpha = 800;
        _cameraDead.radius = 400;
        _cameraDead.target = new BABYLON.Vector3( 0, 1, 0 );
        _scene.activeCamera = _cameraDead;

    };

    self.animFromPlayerToDeadView = function( playerPosition, callback ){

        //_cameraDead.alpha = 10;
        _cameraDead.target = new BABYLON.Vector3( playerPosition.x, 8, playerPosition.z );
        _scene.activeCamera = _cameraDead;

        var animationRaduis = new BABYLON.Animation( _cameraDead, "radius", 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT );

        var keysAnimRaduis = [];
        var newRaduis = 400;

        keysAnimRaduis.push( { frame: 0, value: 10 } );
        keysAnimRaduis.push( { frame: 50, value: newRaduis/2 } );
        keysAnimRaduis.push( { frame: 100, value: newRaduis } );

        animationRaduis.setKeys( keysAnimRaduis );

        _scene.beginDirectAnimation( _cameraDead, [animationRaduis], 0, 100, false, 1, function(){
            callback && callback();
        });
    };

    //PRIVATE METHODS//

    function initCameraDead() {

        var speed = 1;
        var inertia = 0.9;
        var angularSensibility = 3000;

        var camera = new BABYLON.ArcRotateCamera( "cameraDead", 800, 0.8, 400, new BABYLON.Vector3( 0, 0, 0 ), _scene );

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

        camera.setTarget( new BABYLON.Vector3( 0, 6, 0 ) );

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
        //initLightDark( _cameraPlayer );
        _cameraFree = initCameraFree();
    }

    function initLightDark( camera ) {

        var light = new BABYLON.HemisphericLight("omni", new BABYLON.Vector3(0, 1, 0.1), _scene);
        light.diffuse = new BABYLON.Color3(0.1, 0.1, 0.17);
        light.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
        var light2 = new BABYLON.HemisphericLight("dirlight", new BABYLON.Vector3(1, -0.75, 0.25), _scene);
        light2.diffuse = new BABYLON.Color3(0.95, 0.7, 0.4);
        light.specular = new BABYLON.Color3(0.7, 0.7, 0.4);

        var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
            edge_blur: 1.0,
            chromatic_aberration: 1.0,
            distortion: 1.0,
            dof_focus_distance: 50,
            dof_aperture: 6.0,			// set this very high for tilt-shift effect
            grain_amount: 1.0,
            dof_pentagon: true,
            dof_gain: 1.0,
            dof_threshold: 1.0,
            dof_darken: 0.25
        }, _scene, 1.0, camera);
    }

    init();
}