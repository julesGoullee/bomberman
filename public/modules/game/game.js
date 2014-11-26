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
        "bomb",
        "persoTest",
        "tourColision"
    ];

    var _loader;

    var _pointerLocked = false;

    /*PUBLIC METHODS*/

    self.scene = initScene();

    self.assets = {};

    self.init = function(){

        //todo a remplacer par le mesh

        ////player
        //var spherePlayerMock = BABYLON.Mesh.CreateSphere( "playerSphere", 16, 4, self.scene );
        //spherePlayerMock.isVisible = false;
        //
        ////bombe
        //var sphereBombeMock = BABYLON.Mesh.CreateSphere( "bombeSphere", 16, 5, self.scene );
        //var materialBombeSphere = new BABYLON.StandardMaterial("textureBombe", self.scene);
        //materialBombeSphere.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
        //materialBombeSphere.emissiveColor = new BABYLON.Color3(1, .2, .7);
        //sphereBombeMock.material = materialBombeSphere;
        //sphereBombeMock.isVisible = false;

        //self.assets["spherePlayer"] = [spherePlayerMock];
        //self.assets["sphereBombe"] = [sphereBombeMock];

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

            var connector = new Connector();

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

            listenSpaceDown( map.setBomb, myPlayer.player );


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

        // Request pointer lock
        _canvas.addEventListener( "click", function() {

            _canvas.requestPointerLock = _canvas.requestPointerLock || _canvas.msRequestPointerLock || _canvas.mozRequestPointerLock || _canvas.webkitRequestPointerLock;

            if ( _canvas.requestPointerLock ) {

                _canvas.requestPointerLock();
            }
        }, false);

        var pointerlockchange = function () {
            var cameraActive = self.scene.activeCamera;

            _pointerLocked = document.mozPointerLockElement === _canvas || document.webkitPointerLockElement === _canvas || document.msPointerLockElement === _canvas || document.pointerLockElement === _canvas;

            if ( !_pointerLocked ) {

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

    function listenSpaceDown( callback, player ){
        document.addEventListener( "keydown", function( e ) {
            if( _pointerLocked && e.which === 32){
                callback(player);
            }

        }, false);
    }

}