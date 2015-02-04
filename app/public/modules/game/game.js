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
        //"animBombTest",
        "bombColision",
        //"personnage",
        "persocourse",
        "personnageColision",
        "tourColision"
    ];

    var _pointerLocked = false;

    var _blockDim = 8;

    //PUBLIC METHODS//

    self.scene = initScene();

    self.connector = new Connector();

    self.assets = {};

    self.init = function () {

        var preloader = new Preloader( self.scene, _meshPreload, self.assets);

        preloader.onFinish( function(){

            //var spawnPoint = playersSpawnPoint[3];

            var notifier = new Notifier();

            var keyBinder = new KeyBinder();

            var map = new Maps( self.assets, _blockDim , self.scene);

            var cameraSwitcher = new CameraSwitcher( self.scene, _canvas );

            self.connector.onNewPlayer( function( id, name, position ){

                var player = new Player( id, name, position, self.assets, _blockDim );

                map.addObject( player );

            });

            self.connector.onPlayerDisconnect( function( playerId ){

                map.delPlayerById( playerId );
            });

            self.connector.getMyPosition( function( position ){

                // Creation du game

                var myPlayer = new MyPlayer( self.scene, _blockDim, "myPlayer" , position, self.assets, self.connector );

                var freeCamera = new FreeCamera(self);

                var restore = new Restore( notifier, map, myPlayer );

                restore.showRestartButton();

                cameraSwitcher.showSwitchButton();

                keyBinder.onSwitchCamera( cameraSwitcher.switchCamera );

                keyBinder.onRestore( restore.run );

                map.create();

                map.addObject( myPlayer.player );

                keyBinder.onSetBomb( function() {

                    if ( _pointerLocked ) {

                        map.setBomb( myPlayer.player );
                    }
                });

                initPointerLock();

                _engine.runRenderLoop( function () {

                    self.scene.render();

                    myPlayer.renderMyPlayer();

                    //todo ameliorer le debug des positions
                    document.getElementById( "debug" ).innerHTML = "fps : " + _engine.getFps().toFixed() + " Position camera Player: " + self.scene.activeCamera  .position.toString();
                });

                self.connector.onPlayerMove( function( id, position ){

                    var player = map.getPlayerById( id );

                    if( player) {

                        player.move(position);
                    }
                });

                //var bot = new Bot(playersSpawnPoint[2], map, self.scene, _blockDim, self.assets);
            });

        });

    };


    //PRIVATE METHODS//

    window.addEventListener( "resize", function () {

        _engine && _engine.resize();
    }, false);

    function initScene () {

        function enableLight(){
            //light
            var light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3( 0, 1, 0 ), scene );

            light.intensity = 0.8;
        }

        function enableSkybox(){

            var skybox = BABYLON.Mesh.CreateBox( "skyBox", 1000.0, scene );

            skybox.position = new BABYLON.Vector3( 0, 100, 0 );

            var skyboxMaterial = new BABYLON.StandardMaterial( "skyBox", scene );

            skyboxMaterial.backFaceCulling = false;

            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture( "content/skybox/skybox", scene );

            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

            skyboxMaterial.diffuseColor = new BABYLON.Color3( 0, 0, 0 );

            skyboxMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );

            skybox.material = skyboxMaterial;
        }

        var scene = new BABYLON.Scene( _engine );

        //scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

        scene.collisionsEnabled = true;

        enableLight();

        enableSkybox();

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
}