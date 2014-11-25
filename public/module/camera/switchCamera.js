"use strict";

function switchCamera (scene) {
    $( "body" ).append( "<button class='btn' id='switchCamera'>Changer de vue (actual : camera <span>scene.activeCamera.id</span>)</button>" );

    $( "#switchCamera" ).click(function() {

        var activeCamera = scene.activeCamera;

        if ( activeCamera.id === "cameraPlayer" ) {

            $(this).find( "span" ).text( "Free" );

            scene.activeCamera = scene.getCameraByID( "cameraFree" );
        }else{

            $(this).find( "span" ).text( "Player" );

            scene.activeCamera = scene.getCameraByID( "cameraPlayer" );
        }
    });
}