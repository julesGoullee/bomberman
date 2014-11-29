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
        "bombColision",
        "personnage",
        "tourColision"
    ];

    var _pointerLocked = false;

    var _blockDim = 8;

    //todo coté serv
    var playsersSpawnPoint = [
        [50, -65],
        [42, 72],
        [-50, 65],
        [-38, -77]
    ];


    /*PUBLIC METHODS*/

    self.scene = initScene();

    self.assets = {};

    self.init = function () {
        var connector = new Connector();

        var preloader = new Preloader( self.scene, _meshPreload, self.assets);

        preloader.onFinish( function(){

            // Player and arena creation when the loading is finished

            var spawnPoint = playsersSpawnPoint[3];

            var myPlayer = new MyPlayer( self.scene, _blockDim, "myPlayer" , spawnPoint, self.assets, _blockDim );

            var freeCamera = new FreeCamera(self);

            var map = new Maps( self.assets, _blockDim );

            map.create();

            var keyBinder = new Keybinder();

            var cameraSwitcher = new CameraSwitcher( self.scene, _canvas );

            cameraSwitcher.showSwitchButton();

            keyBinder.onSetBomb( function() {

                if ( _pointerLocked ) {

                    map.setBomb( myPlayer.player );
                }
            });


            keyBinder.onSwitchCamera( cameraSwitcher.switchCamera );

            initPointerLock();

            _engine.runRenderLoop( function () {

                self.scene.render();

                myPlayer.renderMyPlayer();

                //todo ameliorer le debug des positions
                document.getElementById( "debug" ).innerHTML = "fps : " + BABYLON.Tools.GetFps().toFixed() + " Position camera Player: " + myPlayer.camera.position.toString();
            });

        });

    };


    /*PRIVATE METHODS*/

    window.addEventListener( "resize", function () {

        _engine && _engine.resize();
    }, false);

    function initScene () {

        var scene = new BABYLON.Scene( _engine );

        scene.collisionsEnabled = true;

        //light
        var light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3( 0, 1, 0 ), scene );

        light.intensity = 0.8;

        //skybox
        var skybox = BABYLON.Mesh.CreateBox( "skyBox", 500.0, scene );

        var skyboxMaterial = new BABYLON.StandardMaterial( "skyBox", scene );

        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture( "content/skybox/skybox", scene );

        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        skyboxMaterial.diffuseColor = new BABYLON.Color3( 0, 0, 0 );

        skyboxMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );

        skybox.material = skyboxMaterial;

        return scene;
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
            console.log(_pointerLocked);
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
            switch(e.which){
                case 32 :
                    if( _pointerLocked){
                        callback(player);
                    }
                    break;

                default:
                    break;
            }
        }, false);
    }

}