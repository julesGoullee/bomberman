"use strict";
function CameraPlayer (position){
    //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(position[0], 15, position[1]), scene);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-46, 127, -70), _scene);
    camera.setTarget(new BABYLON.Vector3(0, 15, -65));
    camera.attachControl(_canvas, false);
    //camera.checkCollisions = true;
    // create a sphere for the camera collision
    camera.ellipsoid = new BABYLON.Vector3(2,3,2);
    //camera.applyGravity = true;
    //camera.inertia = 0.4;
    //camera.angularSensibility = 1000;
    camera.speed = 1;
    var originCamera = _scene.activeCamera;
    _scene.activeCamera = null;
    _scene.activeCameras = [];
    _scene.autoClear = true;
    BABYLON.OculusOrientedCamera.BuildOculusStereoCamera(     _scene,     "Oculus",     originCamera.minZ,     originCamera.maxZ,     originCamera.position,     { yaw: 3, pitch: 0, roll: 0 });

    //_canvas.addEventListener("click", function(evt) {
    //    _canvas.requestPointerLock = _canvas.requestPointerLock || _canvas.msRequestPointerLock || _canvas.mozRequestPointerLock || _canvas.webkitRequestPointerLock;
    //    if (_canvas.requestPointerLock) {
    //        _canvas.requestPointerLock();
    //    }
    //}, false);
    //
    //// Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    //var pointerlockchange = function (event) {
    //    _this.controlEnabled = (
    //    document.mozPointerLockElement === _canvas
    //    || document.webkitPointerLockElement === _canvas
    //    || document.msPointerLockElement === _canvas
    //    || document.pointerLockElement === _canvas);
    //    // If the user is alreday locked
    //    if (!_this.controlEnabled) {
    //        _this.camera.detachControl(_canvas);
    //    } else {
    //        _this.camera.attachControl(_canvas);
    //    }
    //};
    //
    //// Attach events to the document
    //document.addEventListener("pointerlockchange", pointerlockchange, false);
    //document.addEventListener("mspointerlockchange", pointerlockchange, false);
    //document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    //document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    return camera
}