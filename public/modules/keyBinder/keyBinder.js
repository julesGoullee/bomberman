"use strict";

function KeyBinder(){

    var self = this;

    var _callbackSetBombe = [];

    var _callbackCameraSwitch = [];

    /*PUBLIC METHODS*/

    self.onSetBomb = function ( callback ) {

        _callbackSetBombe.push( callback );
    };

    self.onSwitchCamera = function ( callback ) {
        _callbackCameraSwitch.push( callback );
    };


    /*PRIVATE METHODS*/

    function init(){

        listenKeyDown();
    }

    function listenKeyDown () {

        function launchCallbackEvent( callbackList ){

            for ( var i = 0 ; i < callbackList.length ; i++ ) {

                callbackList[i]();
            }
        }

        document.addEventListener( "keydown", function( e ) {

            switch ( e.which ) {

                case 32:
                    
                    launchCallbackEvent( _callbackSetBombe );
                    break;

                case 67:

                    launchCallbackEvent( _callbackCameraSwitch );
                    break;
            }

        }, false);
    }

    init();
}