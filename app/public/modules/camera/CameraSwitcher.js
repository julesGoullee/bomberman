"use strict";

function CameraSwitcher ( scene , canvas ) {

    var self = this;

    var _scene = scene ;

    var _canvas = canvas;

    var _button;
    //PUBLIC METHODS//

    self.showSwitchButton = function () {

        $( "body" ).append( "<button class='btn btn-default' id='switchCameraButton'>Change view or press key C (actual : camera <span>" + _scene.activeCamera.id + "</span>)</button>" );

        _button = $( "#switchCameraButton" );

        _button.click( function() {

            self.switchCamera();
        });
    };

    self.switchCamera = function () {

        var activeCamera = _scene.activeCamera;

        activeCamera.detachControl( _canvas );

        if ( activeCamera.id === "cameraPlayer" ) {

            _button.find( "span" ).text( "Free" );

            _scene.activeCamera = _scene.getCameraByID( "cameraFree" );

        } else if( activeCamera.id === "cameraFree" ) {

            _button.find( "span" ).text( "Player" );

            _scene.activeCamera = _scene.getCameraByID( "cameraPlayer" );

        }
        else if( activeCamera.id === "cameraDead" ) {

            _button.find( "span" ).text( "Player" );

            _scene.activeCamera = _scene.getCameraByID( "cameraPlayer" );

        }

        _scene.activeCamera.attachControl( _canvas );

    };

    self.deadView = function () {

        _button.find( "span" ).text( "Dead" );

        _scene.activeCamera = _scene.getCameraByID( "cameraDead" );

        _scene.activeCamera.attachControl( _canvas );
    }
}