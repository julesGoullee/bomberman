"use strict";

function Game ( canvasId ) {

    var self = this;

    var _canvas = document.getElementById( canvasId ) ;

    var _engine = new BABYLON.Engine( _canvas, true );

    var _meshPreload = [
        "ground",
        "permanentBlocks",
        "permanentBlocksColision",
        "tempBlock",
        "tempBlockColision",
        "tour",
        "tourColision"
    ];

    var _loader;


    /*PUBLIC METHODS*/

    self.scene = initScene();

    self.assets = {};

    self.init = function(){

        //todo a remplacer par le mesh
        var sphereMock = BABYLON.Mesh.CreateSphere( "player2", 16, 4, self.scene );

        sphereMock.isVisible = false;

        self.assets["spherePlayer"] = [sphereMock];

        _loader = new BABYLON.AssetsManager( self.scene );

        _loader.useDefaultLoadingScreen = true;//todo creer un loader qui attend les webSockets

        for ( var iMesh = 0 ; iMesh < _meshPreload.length ; iMesh++ ) {

            var currentMeshs = _loader.addMeshTask( _meshPreload[iMesh], "", "/content/", _meshPreload[iMesh] + ".babylon" );

            currentMeshs.onSuccess = function( task ) {

                initMesh( task );
            };
        }
        _loader.load();

        _loader.onFinish = function() {

            // Player and arena creation when the loading is finished
            var playsersSpawnPoint = [
                [50, -65],
                [42, 72],
                [-50, 65],
                [-38, -77]
            ];

            var spawnPoint = playsersSpawnPoint[3];

            var myPlayer = new MyPlayer( self, "myPlayer" , spawnPoint, self.assets );

            var freeCamera = new FreeCamera(self);

            switchCamera(self.scene);

            var map = new Maps( self );

            map.create();

            initPointerLock();

            _engine.runRenderLoop( function () {

                self.scene.render();
                //todo ameliorer le debug des positions
                document.getElementById( "debug" ).innerHTML = "fps : " + BABYLON.Tools.GetFps().toFixed() + " Position camera Player: " + myPlayer.camera.position.toString();
            });

        };
    };


    /*PRIVATE METHODS*/

    window.addEventListener( "resize", function () {

        _engine && _engine.resize();
    }, false);

    function initScene () {

        var scene = new BABYLON.Scene( _engine );

        //light
        var light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3( 0, 1, 0 ), scene );

        light.intensity = 0.8;

        return scene;
    }

    function initMesh ( task ) {

        self.assets[task.name] = task.loadedMeshes;

        for ( var i=0 ; i < task.loadedMeshes.length ; i++ ) {

            var mesh = task.loadedMeshes[i];

            mesh.checkCollisions = false;

            mesh.isVisible = false;
        }
    }

    function initPointerLock() {
        var pointerLocked = false;

        // Request pointer lock
        _canvas.addEventListener("click", function() {

            _canvas.requestPointerLock = _canvas.requestPointerLock || _canvas.msRequestPointerLock || _canvas.mozRequestPointerLock || _canvas.webkitRequestPointerLock;

            if ( _canvas.requestPointerLock ) {

                _canvas.requestPointerLock();
            }
        }, false);

        var pointerlockchange = function () {
            var cameraActive = self.scene.activeCamera;

            pointerLocked = document.mozPointerLockElement === _canvas || document.webkitPointerLockElement === _canvas || document.msPointerLockElement === _canvas || document.pointerLockElement === _canvas;

            if ( !pointerLocked ) {

                cameraActive.detachControl( _canvas );
            } else {

                cameraActive.attachControl( _canvas );
            }
        };

        document.addEventListener( "pointerlockchange", pointerlockchange, false );
        document.addEventListener( "mspointerlockchange", pointerlockchange, false );
        document.addEventListener( "mozpointerlockchange", pointerlockchange, false );
        document.addEventListener( "webkitpointerlockchange", pointerlockchange, false );
    }

}