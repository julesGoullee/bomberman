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

    //instances
    var _scene = initScene();

    var _popup = new Popup();

    var _connector = new Connector();

    var _auth = new Auth( _connector, _popup );

    var _menuPlayers = new MenuPlayers();

    var _notifier = new Notifier();

    var _keyBinder = new KeyBinder();

    var _assets = {};

    var _cameraSwitcher = new CameraSwitcher( _scene, _canvas );
    var _map;
    var _timer;

    //PUBLIC METHODS//

    self.init = function () {

        _auth.ready( function( userProfil ) {

            var preloadFinish = false;
            var getMapFinish = false;

            var mapJson;

            var deadView = new DeadView( _scene );
            var freeCamera = new FreeCamera( _scene );

            _engine.displayLoadingUI();

            new Preloader( _scene, _meshPreload, _assets).onFinish( function() {

                _connector.ready();
                _engine.loadingUIText = "Recherche d'autre joueurs...";
                preloadFinish = true;
                render();
            });

            _connector.getMap( function( data ) {
                mapJson = data;
                getMapFinish = true;
                render();
            });


            function render(){

                if( !preloadFinish || !getMapFinish ){ return null; }

                _map = new Maps( _assets, _blockDim, mapJson.blockTemp, _scene, _menuPlayers );

                _timer = new Timer( _map );

                _timer.showTimerToStartParty( mapJson.timerToStart );

                // Creation des players
                for ( var i = 0; i < mapJson.players.length; i++ ) {

                    var playerJson = mapJson.players[i];
                    var player = new Player( playerJson.id, playerJson.name, playerJson.position, playerJson.powerUp, playerJson.alive, playerJson.kills, _assets, _blockDim );

                    if ( playerJson.isMine ) {

                        var myPlayer = new MyPlayer( _scene, playerJson.position, _connector, _cameraSwitcher );
                        myPlayer.player = player;
                    }

                    _map.addObject( player );
                    _menuPlayers.addPlayer( player );
                }

                _cameraSwitcher.showSwitchButton();
                _cameraSwitcher.deadView();

                var radius_step = 1;
                var alpha_step = .01;

                function myAnimation() {

                    var camera = _scene.activeCamera;
                    camera.radius -= radius_step;

                    if (camera.radius < 150) {
                        radius_step = 0;
                        camera.alpha -= alpha_step;
                        if ( _isInParty ) {
                            _scene.unregisterBeforeRender(myAnimation);

                            camera.keysUp = [90]; // Z

                            camera.keysLeft = [81]; // Q

                            camera.keysDown = [83]; // S

                            camera.keysRight = [68]; // D
                        }
                    }
                }
                _scene.registerBeforeRender(myAnimation);

                _keyBinder.onSwitchCamera( _cameraSwitcher.switchCamera );

                _map.create();

                //initLightDark( freeCamera.camera );
                //var restore = new Restore( notifier, map, myPlayer );
                //restore.showRestartButton();
                //keyBinder.onRestore( restore.run );

                _connector.onReady(function( timeParty ){

                    myPlayer.init();
                    _timer.startGame( timeParty );

                    _isInParty = true;
                });

                _keyBinder.onSetBomb( function() {

                    if ( _pointerLocked && _isInParty ) {

                        if ( myPlayer.player.shouldSetBomb() && !_map.getBombByPosition( myPlayer.player.roundPosition() ) ) {

                            var bombTempId = utils.guid();

                            var bombe = new Bombe( bombTempId, myPlayer.player, player.roundPosition() , _assets, _scene);

                            myPlayer.player.addBomb( bombe );
                            _connector.setBomb( bombe.id );
                        }
                    }
                });

                initPointerLock();

                _engine.runRenderLoop( function () {

                    _scene.render();

                    if( _isInParty ){
                        myPlayer.renderMyPlayer();
                    }
                    //map.playerLootPowerUp();

                    document.getElementById( "debug" ).innerHTML = "fps : " + (Math.round(_engine.getFps() * 100) / 100).toFixed(2) +
                        " <br>Position camera Player: x: " + ( Math.round( _scene.activeCamera.position.x * 100)/100).toFixed(2) +
                        " | z: " + (Math.round( _scene.activeCamera.position.z * 100)/100).toFixed(2);
                });

                _connector.onPlayerMove( function( id, position ) {

                    var player = _map.getPlayerById( id );

                    if( player) {

                        player.move( position );

                        var animable =  _scene.getAnimatableByTarget( player.meshs.shape);

                        if( player.timeOut ){

                            clearTimeout( player.timeOut );
                        }

                        if( player.lastAnimRun ){

                            animable && animable.stop();
                            delete player.lastAnimRun ;
                        }

                        if( !animable ) {

                            _scene.beginAnimation( player.meshs.shape, 0, 20, false, 1, function(){

                                if( player.timeOut ){
                                    clearTimeout(player.timeOut );
                                }

                                player.timeOut = setTimeout( function(){

                                    if( player.lastAnim ) {

                                        player.lastAnimRun = true;

                                        _scene.beginAnimation( player.meshs.shape,308, 458, true, 1 );

                                    }
                                },100);

                                player.lastAnim = true;
                            });

                        }
                    }
                });

                _connector.onPlayerSetBomb( function( playerId, bombeId, position ) {

                    var player = _map.getPlayerById( playerId );
                    var bombe = new Bombe( bombeId, player, position , _assets, _scene );
                    player.addBomb( bombe );

                });

                _connector.onExplosion( function( ownerId, bombesExplodedId, playersIdKilled, blocksIdDestroy ) {

                    for ( var i = 0; i < playersIdKilled.length; i++ ) {

                        var playerKilledId = playersIdKilled[i];
                        _map.killPlayerById( playerKilledId );
                        //todo score && menu
                    }

                    for ( var j = 0; j < blocksIdDestroy.length; j++ ) {

                        var blockIdDestroy = blocksIdDestroy[j];
                        _map.delBlockById( blockIdDestroy );
                    }

                    for ( var k = 0; k < bombesExplodedId.length; k++ ) {

                        var bombeExplodedId = bombesExplodedId[k];
                        var bombe = _map.getBombsById( bombeExplodedId );
                        if( !bombe ){
                            debugger;
                        }
                        bombe.destroy();
                        bombe.owner.delBombById( bombe.id );

                    }
                });

                _connector.onNewPlayer( function( id,  name, position, powerUp, alive, kills ){

                    var player = new Player( id, name, position, powerUp, alive, kills, _assets, _blockDim );

                    _menuPlayers.addPlayer( player );

                    _map.addObject( player );

                });

                _connector.onPlayerDisconnect( function( playerId ){


                    if( _isInParty ) {
                        _menuPlayers.changeStatus("disconnect Dead", playerId);
                        _map.killPlayerById( playerId );
                    }
                    else{
                        _menuPlayers.delPlayer( playerId );
                        _map.delPlayerById ( playerId );
                    }

                });

                _connector.setPermanentBombId( function( tempBombId, bombId ){

                    var bomb = _map.getBombsById( tempBombId );
                    bomb.id = bombId;

                });

                _timer.onTimerEnd( showEnd );

                //_connector.onEnd(showEnd);//TODO ICI!

                _engine.hideLoadingUI();


                //_scene.beginAnimation( _assets["explosionFlammes"][0], 0, 40, true, 1, function() {
                //
                //});
                //var bot = new Bot(playersSpawnPoint[2], maps, _scene, _blockDim, _assets);
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
        }, _scene, 1.0, camera);
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

            var cameraActive = _scene.activeCamera;

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

    function showEnd(){
        _isInParty = false;
        _cameraSwitcher.deadView();
        var header = "<h4 class='modal-title' >Partie Terminée!</h4>";

        var body = "<table class='table table-striped'>"+
            "<thead>"+
            "<tr>"+
            "<th>Kills</th>"+
            "<th>Nom</th>"+
            "<th>Statu</th>"+
            "</tr>"+
            "</thead>"+
            "<tbody id='table-score-body'>"+

            "</tbody>"+
            "</table>";

        var players = _map.getPlayers();
        var tablePlayers = "";

        players.sort(function( a, b ){
            return a.kills <= b.kills;
        });

        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            var statusString = player.alive ? "alive" : "dead";
            tablePlayers += "<tr>"+
                "<th>" + player.kills + "</th>"+
                "<td>" + player.name + "</td>"+
                "<td>" + statusString + "</td>"+
                "</tr>";
        }

        _popup.setContent( header, body );
        $("#table-score-body").append( tablePlayers );

        _popup.show();
    }
}