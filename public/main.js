"use strict";

function Game ( canvasId ) {

    var self = this;

    var canvas = document.getElementById( canvasId ) ;

    var engine = new BABYLON.Engine( canvas, true );

    var meshPreload = [
        'ground',
        'permanentBlocks',
        'permanentBlocksColision',
        'tempBlock',
        'tempBlockColision',
        'tour',
        'tourColision'
    ];

    self.scene = self._initScene( engine );

    self.loader =  new BABYLON.AssetsManager( this.scene );

    self.assets = {};

    self.pointerLocked = false;

    for ( var iMesh = 0 ; iMesh < meshPreload.length ; iMesh++ ) {

        var currentMeshs = this.loader.addMeshTask( meshPreload[iMesh], "", "/content/", meshPreload[iMesh] + ".babylon" );

        currentMeshs.onSuccess = function( task ) {

            self._initMesh(task);
        };
    }

    self.loader.onFinish = function (tasks) {

        // Player and arena creation when the loading is finished
        var playsersSpawnPoint = [
            [50, -65],
            [42, 72],
            [-50, 65],
            [-42, -72]
        ];

        var spawnPoint = playsersSpawnPoint[3];

        var myPlayer = new MyPlayer(self, 'myPlayer' , spawnPoint);

        var map = new Maps(self);

        map.create();

        self._initPointerLock();

        engine.runRenderLoop( function () {

            self.scene.render();

            document.getElementById( "debug" ).innerHTML = "fps : " + BABYLON.Tools.GetFps().toFixed() + " Position: " + myPlayer.camera.position.toString();
        });

    };

    self.loader.load();


    window.addEventListener( "resize", function () {

        engine && engine.resize();
    },false);

}

Game.prototype = {

    _initScene : function( engine ) {

        var scene = new BABYLON.Scene( engine );

        //light
        var light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3( 0, 1, 0 ), scene );

        light.intensity = 0.7;

        return scene;
    },

    _initMesh : function( task ) {

        this.assets[task.name] = task.loadedMeshes;

        for ( var i=0 ; i<task.loadedMeshes.length ; i++ ){

            var mesh = task.loadedMeshes[i];

            mesh.checkCollisions = false;

            mesh.isVisible = false;
        }
    },

    _initPointerLock : function() {

        var self = this;

        // Request pointer lock
        var canvas = self.scene.getEngine().getRenderingCanvas();

        var cameraPlayer = self.scene.getCameraByID("cameraPlayer");

        canvas.addEventListener("click", function(event) {

            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;

            if (canvas.requestPointerLock) {

                canvas.requestPointerLock();
            }
        }, false);

        var pointerlockchange = function (event) {

            self.pointerLocked = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);

            if ( !self.pointerLocked ) {

                cameraPlayer.detachControl(canvas);
            } else {

                cameraPlayer.attachControl(canvas);
            }
        };

        document.addEventListener("pointerlockchange", pointerlockchange, false);

        document.addEventListener("mspointerlockchange", pointerlockchange, false);

        document.addEventListener("mozpointerlockchange", pointerlockchange, false);

        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }
};

document.addEventListener( "DOMContentLoaded", function () {

    new Game( "renderCanvas" );

}, false);