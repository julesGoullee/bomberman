"use strict";

function Game( canvasId ) {

    var self = this;

    var canvas = document.getElementById( canvasId ) ;

    var engine = new BABYLON.Engine( canvas, true );

    var meshPreload = [
        "ground",
        "permanentBlocks",
        "permanentBlocksColision",
        "tempBlock",
        "tempBlockColision",
        "tour",
        "tourColision"
    ];

    var loader;

    /*PUBLIC METHODS*/

    self.scene = initScene();

    self.assets = {};

    self.init = function(){
        self.assets["spherePlayer"] = BABYLON.Mesh.CreateSphere("player2", 16, 4, self.scene);//todo a remplacer par le mesh

        loader = new BABYLON.AssetsManager( self.scene );

        for ( var iMesh = 0 ; iMesh < meshPreload.length ; iMesh++ ) {

            var currentMeshs = loader.addMeshTask( meshPreload[iMesh], "", "/content/", meshPreload[iMesh] + ".babylon" );

            currentMeshs.onSuccess = function( task ) {

                initMesh( task );
            };
        }

        loader.load();

        loader.onFinish = function() {

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

            engine.runRenderLoop( function () {

                self.scene.render();
                //todo ameliorer le debug des positions
                document.getElementById( "debug" ).innerHTML = "fps : " + BABYLON.Tools.GetFps().toFixed() + " Position camera Player: " + myPlayer.camera.position.toString();
            });

        };
    };


    /*PRIVATE METHODS*/

    window.addEventListener( "resize", function () {

        engine && engine.resize();
    }, false);

    function initScene () {

        var scene = new BABYLON.Scene( engine );

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
        canvas.addEventListener("click", function() {

            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;

            if ( canvas.requestPointerLock ) {

                canvas.requestPointerLock();
            }
        }, false);

        var pointerlockchange = function () {
            var cameraActive = self.scene.activeCamera;

            pointerLocked = document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas;

            if ( !pointerLocked ) {

                cameraActive.detachControl( canvas );
            } else {

                cameraActive.attachControl( canvas );
            }
        };

        document.addEventListener( "pointerlockchange", pointerlockchange, false );
        document.addEventListener( "mspointerlockchange", pointerlockchange, false );
        document.addEventListener( "mozpointerlockchange", pointerlockchange, false );
        document.addEventListener( "webkitpointerlockchange", pointerlockchange, false );
    }

}