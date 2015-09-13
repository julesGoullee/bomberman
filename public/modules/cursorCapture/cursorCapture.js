"use strict";

define(["jquery"], function($) {
    return function CursorCapture(scene, canvas) {


        var self = this;

        var _autoRequestOnRelache = false;

        var _backDropShow = false;

        var _scene = scene;
        var _canvas = canvas;

        //JQ Element
        var _backdrop;
        var _backdropMessage;


        //PUBLIC METHODS//

        self.pointerLocked;

        self.autoRequestCapture = function () {

            _autoRequestOnRelache = true;

            showBackDrop();
        };

        self.stopCapture = function () {


            _autoRequestOnRelache = false;

            if (self.pointerLocked) {

                document.exitPointerLock();
                detachControlCamera(_scene.activeCamera);
            } else {
                hideBackDrop();
            }
        };


        //PRIVATE METHODS//

        function pointerLockChange() {

            self.pointerLocked = document.pointerLockElement === _canvas ||
                document.mozPointerLockElement === _canvas ||
                document.webkitPointerLockElement === _canvas ||
                document.msPointerLockElement === _canvas;


            if (_autoRequestOnRelache) {
                var cameraActive = _scene.activeCamera;
                if (self.pointerLocked) {

                    attachControlCamera(cameraActive);
                    hideBackDrop();

                } else {

                    showBackDrop();
                    detachControlCamera(cameraActive);
                }
            }
        }

        function detachControlCamera(camera) {

            camera.detachControl(_canvas);

            camera.keysUp = [];

            camera.keysLeft = [];

            camera.keysDown = [];

            camera.keysRight = [];
        }

        function attachControlCamera(camera) {

            camera.attachControl(_canvas);

            camera.keysUp = [90]; // Z

            camera.keysLeft = [81]; // Q

            camera.keysDown = [83]; // S

            camera.keysRight = [68]; // D
        }

        function showBackDrop() {
            _backdropMessage.css('marginTop', ( $(_canvas).height() / 2 ) - ( _backdropMessage.height() / 2));

            _backdrop.show();
            _backDropShow = true;
        }

        function hideBackDrop() {

            _backdrop.hide();
            _backDropShow = false;
        }

        function init() {

            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

            _canvas.requestPointerLock = _canvas.requestPointerLock ||
                _canvas.mozRequestPointerLock ||
                _canvas.webkitRequestPointerLock ||
                _canvas.msRequestPointerLock;

            document.exitPointerLock = document.exitPointerLock ||
                document.mozExitPointerLock ||
                document.msExitPointerLock ||
                document.webkitExitPointerLock;

            var backdropHtml = "<div id='backdrop' class='row'>" +
                "<div class='panel panel-default' id='backdrop-message'>" +
                "<div class='panel-body'>" +
                "Clique pour prendre le controle du chat!" +
                "</div>" +
                "<div class='panel-footer'>" +
                "Utilise Q Z D et ta souris pour te déplacer, la barre d'espace pour poser une bombe!" +
                "</div>" +
                "</div>" +
                "</div>";

            $('body').append(backdropHtml);

            _backdropMessage = $("#backdrop-message");

            _backdrop = $("#backdrop");

            _backdrop.click(function () {

                if (_autoRequestOnRelache) {

                    _canvas.requestPointerLock();
                }
            });
        }

        init();
    };
});