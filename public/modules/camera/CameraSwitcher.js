"use strict";

function CameraSwitcher ( scene , canvas ) {

    var self = this;

    var _scene = scene ;

    var _canvas = canvas;

    /*PUBLIC METHODS*/

    self.showSwitchButton = function () {

        $( "body" ).append( "<button class='btn' id='switchCameraButton'>Change view or press key C (actual : camera <span>" + _scene.activeCamera.id + "</span>)</button>" );

        $( "#switchCameraButton" ).click( function() {

            self.switchCamera();
        });
    };

    self.switchCamera = function () {

        var activeCamera = _scene.activeCamera;

        activeCamera.detachControl( _canvas );

        if ( activeCamera.id === "cameraPlayer" ) {

            $(this).find( "span" ).text( "Free" );

            _scene.activeCamera = _scene.getCameraByID( "cameraFree" );

        } else {

            $(this).find( "span" ).text( "Player" );

            _scene.activeCamera = _scene.getCameraByID( "cameraPlayer" );
        }


        _scene.activeCamera.attachControl( _canvas );

    };

}