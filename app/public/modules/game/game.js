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
        //"explosionFlammes",
        //"animBombTest",
        "bombColision",
        "powerUpBallon",
        "persocourse",
        "personnageColision",
        "tourColision"
    ];

    var _pointerLocked = false;

    var _isInParty = false;

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

            var preloadFinish = false;
            var getMapFinish = false;

            var mapJson;

            var notifier = new Notifier();
            var keyBinder = new KeyBinder();
            var cameraSwitcher = new CameraSwitcher( self.scene, _canvas );

            _engine.displayLoadingUI();

            new Preloader( self.scene, _meshPreload, self.assets).onFinish( function() {

                self.connector.ready();
                _engine.loadingUIText = "Recherche d'autre joueurs...";
                preloadFinish = true;
                render();
            });

            self.connector.getMap( function( data ) {
                mapJson = data;
                getMapFinish = true;
                render();
            });


            function render (){

                if( !preloadFinish || !getMapFinish ){ return null; }

                var map = new Maps( self.assets, _blockDim, mapJson.blockTemp, self.scene, self.menuPlayers );

                var timer = new Timer( map );

                timer.showTimerToStartParty( mapJson.timerToStart );

                // Creation des players
                for ( var i = 0; i < mapJson.players.length; i++ ) {

                    var playerJson = mapJson.players[i];
                    var player = new Player( playerJson.id, playerJson.name, playerJson.position, playerJson.powerUp, playerJson.alive, playerJson.kills, self.assets, _blockDim );

                    if ( playerJson.isMine ) {

                        var myPlayer = new MyPlayer( self.scene, playerJson.position, self.connector, cameraSwitcher );
                        myPlayer.player = player;
                    }

                    map.addObject( player );
                    self.menuPlayers.addPlayer( player );
                }

                var radius_step = 1;
                var alpha_step = .01;

                function myAnimation() {

                    var camera = myPlayer.camera;
                    camera.radius -= radius_step;

                    if (camera.radius < 150) {
                        radius_step = 0;
                        camera.alpha -= alpha_step;
                        if ( _isInParty ) {
                            self.scene.unregisterBeforeRender(myAnimation);

                            camera.keysUp = [90]; // Z

                            camera.keysLeft = [81]; // Q

                            camera.keysDown = [83]; // S

                            camera.keysRight = [68]; // D
                        }
                    }
                }

                self.scene.registerBeforeRender(myAnimation);

                cameraSwitcher.showSwitchButton();

                keyBinder.onSwitchCamera( cameraSwitcher.switchCamera );

                map.create();

                var freeCamera = new FreeCamera( self );

                //initLightDark( freeCamera.camera );
                //var restore = new Restore( notifier, map, myPlayer );
                //restore.showRestartButton();
                //keyBinder.onRestore( restore.run );

                self.connector.onReady(function( timeParty ){

                    myPlayer.init();
                    timer.startGame( timeParty );

                    _isInParty = true;
                });

                keyBinder.onSetBomb( function() {

                    if ( _pointerLocked && _isInParty ) {

                        if ( myPlayer.player.shouldSetBomb() && !map.getBombByPosition( myPlayer.player.roundPosition() ) ) {

                            var bombTempId = utils.guid();

                            var bombe = new Bombe( bombTempId, myPlayer.player, player.roundPosition() , self.assets, self.scene);

                            myPlayer.player.addBomb( bombe );
                            self.connector.setBomb( bombe.id );
                        }
                    }
                });

                initPointerLock();

                _engine.runRenderLoop( function () {

                    self.scene.render();

                    if( _isInParty ){
                        myPlayer.renderMyPlayer();
                    }
                    //map.playerLootPowerUp();

                    document.getElementById( "debug" ).innerHTML = "fps : " + (Math.round(_engine.getFps() * 100) / 100).toFixed(2) +
                        " <br>Position camera Player: x: " + ( Math.round( self.scene.activeCamera.position.x * 100)/100).toFixed(2) +
                        " | z: " + (Math.round( self.scene.activeCamera.position.z * 100)/100).toFixed(2);
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

                self.connector.onPlayerSetBomb( function( playerId, bombeId, position ) {

                    var player = map.getPlayerById( playerId );
                    var bombe = new Bombe( bombeId, player, position , self.assets, self.scene );
                    player.addBomb( bombe );

                });

                self.connector.onExplosion( function( ownerId, bombesExplodedId, playersIdKilled, blocksIdDestroy ) {

                    for ( var i = 0; i < playersIdKilled.length; i++ ) {

                        var playerKilledId = playersIdKilled[i];
                        map.killPlayerById( playerKilledId );
                        //todo score && menu
                    }

                    for ( var j = 0; j < blocksIdDestroy.length; j++ ) {

                        var blockIdDestroy = blocksIdDestroy[j];
                        map.delBlockById( blockIdDestroy );
                    }

                    for ( var k = 0; k < bombesExplodedId.length; k++ ) {

                        var bombeExplodedId = bombesExplodedId[k];
                        var bombe = map.getBombsById( bombeExplodedId );
                        if( !bombe ){
                            debugger;
                        }
                        bombe.destroy();
                        bombe.owner.delBombById( bombe.id );

                    }
                });

                self.connector.onNewPlayer( function( id,  name, position, powerUp, alive, kills ){

                    var player = new Player( id, name, position, powerUp, alive, kills, self.assets, _blockDim );

                    self.menuPlayers.addPlayer( player );

                    map.addObject( player );

                });

                self.connector.onPlayerDisconnect( function( playerId ){


                    if( _isInParty ) {
                        self.menuPlayers.changeStatus("disconnect Dead", playerId);
                        map.killPlayerById( playerId );
                    }
                    else{
                        self.menuPlayers.delPlayer( playerId );
                        map.delPlayerById ( playerId );
                    }

                });

                self.connector.setPermanentBombId( function( tempBombId, bombId ){

                    var bomb = map.getBombsById( tempBombId );
                    bomb.id = bombId;

                });

                _engine.hideLoadingUI();


                //self.scene.beginAnimation( self.assets["explosionFlammes"][0], 0, 40, true, 1, function() {
                //
                //});
                //var bot = new Bot(playersSpawnPoint[2], maps, self.scene, _blockDim, self.assets);
            }

        });
    };


    //PRIVATE METHODS//

    window.addEventListener( "resize", function () {

        _engine && _engine.resize();
    }, false);

    function initLightDark( camera ){

        var light = new BABYLON.HemisphericLight("omni", new BABYLON.Vector3(0, 1, 0.1), scene);
        light.diffuse = new BABYLON.Color3(0.1, 0.1, 0.17);
        light.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
        var light2 = new BABYLON.HemisphericLight("dirlight", new BABYLON.Vector3(1, -0.75, 0.25), scene);
        light2.diffuse = new BABYLON.Color3(0.95, 0.7, 0.4);
        light.specular = new BABYLON.Color3(0.7, 0.7, 0.4);

        var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
            edge_blur: 1.0,
            chromatic_aberration: 1.0,
            distortion: 1.0,
            dof_focus_distance: 50,
            dof_aperture: 6.0,			// set this very high for tilt-shift effect
            grain_amount: 1.0,
            dof_pentagon: true,
            dof_gain: 1.0,
            dof_threshold: 1.0,
            dof_darken: 0.25
        }, self.scene, 1.0, camera);
    }

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
                if( _isInParty ) {
                    cameraActive.attachControl(_canvas);
                }
            }
        };

        document.addEventListener( "pointerlockchange", pointerLockChange, false );
        document.addEventListener( "mspointerlockchange", pointerLockChange, false );
        document.addEventListener( "mozpointerlockchange", pointerLockChange, false );
        document.addEventListener( "webkitpointerlockchange", pointerLockChange, false );
    }
}