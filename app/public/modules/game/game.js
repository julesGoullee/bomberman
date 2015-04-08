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
        "powerUpBallon",
        "persocourse",
        "personnageColision",
        "tourColision"
    ];

    var _pointerLocked = false;

    var _blockDim = 8;

    //PUBLIC METHODS//

    self.scene = initScene();

    self.popup = new Popup();

    self.connector = new Connector();

    self.auth = new Auth( self.connector, self.popup );

    self.menuPlayers = new MenuPlayers();
    
    self.assets = {};

    self.init = function () {

        self.auth.ready( function( userProfil ) {

            var preloader = new Preloader( self.scene, _meshPreload, self.assets);

            preloader.onFinish( function(){

                var notifier = new Notifier();

                var keyBinder = new KeyBinder();

                var map = new Maps( self.assets, _blockDim, self.scene, self.menuPlayers );

                var cameraSwitcher = new CameraSwitcher( self.scene, _canvas );

                self.connector.onNewPlayer( function( id, name, position ){

                    var player = new Player( id, name, position, self.assets, _blockDim );

                    self.menuPlayers.addPlayer( player );

                    map.addObject( player );

                });

                self.connector.onPlayerDisconnect( function( playerId ){

                    map.delPlayerById( playerId );

                    self.menuPlayers.delPlayer( playerId );

                });

                self.connector.getMyPosition( function( position ){

                    // Creation du game

                    var myPlayer = new MyPlayer( self.scene, _blockDim, userProfil.name , position, self.assets, self.connector, cameraSwitcher );

                    var freeCamera = new FreeCamera( self );

                    var restore = new Restore( notifier, map, myPlayer );

                    self.menuPlayers.addPlayer( myPlayer.player );

                    restore.showRestartButton();

                    cameraSwitcher.showSwitchButton();

                    keyBinder.onSwitchCamera( cameraSwitcher.switchCamera );

                    keyBinder.onRestore( restore.run );

                    map.create();

                    map.addObject( myPlayer.player );

                    keyBinder.onSetBomb( function() {

                        if ( _pointerLocked ) {

                            if( map.setBomb( myPlayer.player ) ){

                                self.connector.setBomb( myPlayer.player.id );
                            }
                        }
                    });

                    initPointerLock();

                    _engine.runRenderLoop( function () {

                        self.scene.render();

                        myPlayer.renderMyPlayer();

                        map.playerLootPowerUp();

                        //todo ameliorer le debug des positions
                        document.getElementById( "debug" ).innerHTML = "fps : " + _engine.getFps().toFixed() + " Position camera Player: " + self.scene.activeCamera.position.toString();
                    });

                    self.connector.onPlayerMove( function( id, position ) {

                        var player = map.getPlayerById( id );

                        if( player) {

                            player.move( position );

                            var animable =  self.scene.getAnimatableByTarget( player.meshs.shape);

                            if( player.timeOut ){

                                clearTimeout( player.timeOut );
                            }

                            if( player.lastAnimRun ){

                                animable && animable.stop();
                                delete player.lastAnimRun ;
                            }

                            if( !animable ) {

                                self.scene.beginAnimation( player.meshs.shape, 0, 20, false, 1, function(){

                                    if( player.timeOut ){
                                        clearTimeout(player.timeOut );
                                    }

                                    player.timeOut = setTimeout( function(){

                                        if( player.lastAnim ) {

                                            player.lastAnimRun = true;

                                            self.scene.beginAnimation( player.meshs.shape,308, 458, true, 1 );

                                        }
                                    },100);

                                    player.lastAnim = true;
                                });

                            }
                        }
                    });

                    self.connector.onPlayerSetBomb( function( id ) {

                        var player = map.getPlayerById( id );

                        if( player ) {

                            map.setBomb( player );
                        }
                    });

                    //var bot = new Bot(playersSpawnPoint[2], maps, self.scene, _blockDim, self.assets);
                });

            });

        });
    };


    //PRIVATE METHODS//

    window.addEventListener( "resize", function () {

        _engine && _engine.resize();
    }, false);

    function initScene () {

        function enableLight(){

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
 
        var pointerLockChange = function () {

            var cameraActive = self.scene.activeCamera;

            _pointerLocked = document.mozPointerLockElement === _canvas || document.webkitPointerLockElement === _canvas || document.msPointerLockElement === _canvas || document.pointerLockElement === _canvas;

            if ( !_pointerLocked ) {

                cameraActive.detachControl( _canvas );

            } else {

                cameraActive.attachControl( _canvas );
            }
        };

        document.addEventListener( "pointerlockchange", pointerLockChange, false );
        document.addEventListener( "mspointerlockchange", pointerLockChange, false );
        document.addEventListener( "mozpointerlockchange", pointerLockChange, false );
        document.addEventListener( "webkitpointerlockchange", pointerLockChange, false );
    }
}