"use strict";

function FreeCamera(game) {

    var self = this;

    var scene = game.scene;

    var speed = 1;

    var inertia = 0.9;

    //mouse sensibility (lower the better sensible)
    var angularSensibility = 3000;


    /*PUBLIC METHODS*/

    self.camera = initCamera();

    //scene.activeCameras.push( self.camera );

    //scene.activeCamera = self.camera;


    /*PRIVATE METHODS*/

    function initCamera() {

        $( "body" ).append( "<button class='btn' id='switchCamera'>Changer de vue (actual : camera <span>Player</span>)</button>" );

        $( "#switchCamera" ).click(function() {

            var activeCamera = scene.activeCamera;

            if ( activeCamera.id === "cameraPlayer" ) {

                $(this).find( "span" ).text( "Free" );

                scene.activeCamera = self.camera;
            }else{

                $(this).find( "span" ).text( "Player" );

                scene.activeCamera = scene.getCameraByID( "cameraPlayer" );
            }
        });

        var camera = new BABYLON.FreeCamera(
            "freeCamera",
            new BABYLON.Vector3(0, 60, 0),
            scene
        );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2, 3.5, 2 );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D


        camera.inertia = inertia;

        camera.speed = speed;

        camera.angularSensibility = angularSensibility;

        return camera;
    }
}

