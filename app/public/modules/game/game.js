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

    var _isInParty = false;

    var _isFirstLoad = true;

    var _blockDim = 8;

    //Instances
    var _scene = initScene();

    var _popup = new Popup();

    var _connector = new Connector();

    var _auth = new Auth( _connector, _popup );

    var _menuPlayers = new MenuPlayers();

    var _keyBinder = new KeyBinder();

    var _cursorCapture = new CursorCapture( _scene, _canvas);

    var _cameraSwitcher = new CameraSwitcher( _scene, _canvas );

    var _assets = {};

    var _map;
    var _timer;
    var _myPlayer;


    //PUBLIC METHODS//

    self.init = function() {

        _auth.ready( function( userProfil ) {

            var preloadFinish = false;
            var getMapFinish = false;

            var mapJson;

            _engine.displayLoadingUI();

            new Preloader( _scene, _meshPreload, _assets).onFinish( function() {

                _connector.ready();
                _engine.loadingUIText = "Recherche d'autre joueurs...";
                preloadFinish = true;

                if ( preloadFinish && getMapFinish ) {
                    render( mapJson );
                }

            });

            _connector.getMap( function( data ) {
                mapJson = data;
                getMapFinish = true;
                if ( preloadFinish && getMapFinish ) {
                    render( mapJson );
                }
            });

            _connector.onReady(function( timeParty ){

                _timer.startGame( timeParty );
                _scene.unregisterBeforeRender( StandingStartAnimation );

                _cameraSwitcher.playerView( _myPlayer.player.position, function(){
                    _isInParty = true;

                    _cursorCapture.autoRequestCapture();
                    _myPlayer.attachControl();
                });

            });

            _keyBinder.onSetBomb( function() {

                if ( _cursorCapture.pointerLocked && _isInParty )  {

                    if ( _myPlayer.player.shouldSetBomb() && !_map.getBombByPosition( _myPlayer.player.roundPosition() ) ) {

                        var bombTempId = utils.guid();

                        var bombe = new Bombe( bombTempId, _myPlayer.player, _myPlayer.player.roundPosition() , _assets, _scene);

                        _myPlayer.player.addBomb( bombe );
                        _connector.setBomb( bombe.id );
                    }
                }
            });

            listenEvents();
        });
    };


    //PRIVATE METHODS//
    function render( mapJson ){

        _map = _map || new Maps( _assets, _blockDim, _scene, _menuPlayers );

        _timer = _timer || new Timer( _map );

        _timer.show();

        _timer.showTimerToStartParty( mapJson.timerToStart );

        // Creation des players
        for ( var i = 0; i < mapJson.players.length; i++ ) {

            var playerJson = mapJson.players[i];
            var player = new Player( playerJson.id, playerJson.name, playerJson.position, playerJson.powerUp, playerJson.alive, playerJson.kills, _assets, _blockDim );

            if ( playerJson.isMine ) {
                if ( _isFirstLoad ) {
                    _myPlayer = _myPlayer || new MyPlayer( _scene, playerJson.position, _connector, _cameraSwitcher );
                }
                else {
                    _myPlayer.position = playerJson.position;
                }
                _myPlayer.player = player;
            }

            _map.addObject( player );
            _menuPlayers.addPlayer( player );
        }

        if ( _isFirstLoad ) {

            _cameraSwitcher.deadView();

            _scene.registerBeforeRender(StandingStartAnimation);

            _keyBinder.onSwitchCamera( _cameraSwitcher.switchCamera );

            _map.create( mapJson.blockTemp );

            _engine.runRenderLoop( function () {

                _scene.render();

                if( _isInParty ){
                    _myPlayer.renderMyPlayer();
                }
                //map.playerLootPowerUp();

                document.getElementById( "debug" ).innerHTML = "fps : " + (Math.round(_engine.getFps() * 100) / 100).toFixed(2) +
                    " <br>Position camera Player: x: " + ( Math.round( _scene.activeCamera.position.x * 100)/100).toFixed(2) +
                    " | z: " + (Math.round( _scene.activeCamera.position.z * 100)/100).toFixed(2);
            });
        }
        else {
            _map.setTempBlocks( mapJson.blockTemp );
        }

        _engine.hideLoadingUI();

    }

    function initScene () {

        function enableLight() {

            var light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3( 0, 1, 0 ), scene );

            light.intensity = 0.8;
        }

        function enableSkybox() {

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

        function enableAutoResize() {
            window.addEventListener( "resize", function () {

                _engine && _engine.resize();
            }, false);
        }

        var scene = new BABYLON.Scene( _engine );

        //scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

        scene.collisionsEnabled = true;

        enableLight();

        enableSkybox();

        enableAutoResize();

        return scene;
    }

    var radius_step = 1;
    var alpha_step = .01;

    function StandingStartAnimation() {

        var camera = _scene.activeCamera;
        camera.radius -= radius_step;

        if ( camera.radius < 150) {
            radius_step = 0;
            camera.alpha -= alpha_step;
        }
    }

    function listenEvents() {

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

            var playerOwner = _map.getPlayerById( ownerId );
            for ( var i = 0; i < playersIdKilled.length; i++ ) {

                var playerKilledId = playersIdKilled[i];

                _map.killPlayerById( playerKilledId, true );

                if( playerOwner.id !== playerKilledId ){
                    playerOwner.kills ++;
                }
            }

            for ( var j = 0; j < blocksIdDestroy.length; j++ ) {

                var blockIdDestroy = blocksIdDestroy[j];
                _map.delBlockById( blockIdDestroy );
                playerOwner.nbBlocksDestroy++;
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
            _menuPlayers.changeScore( playerOwner.kills, playerOwner.id );

        });

        _connector.onNewPlayer( function( id,  name, position, powerUp, alive, kills ){

            var player = new Player( id, name, position, powerUp, alive, kills, _assets, _blockDim );

            _menuPlayers.addPlayer( player );

            _map.addObject( player );

        });

        _connector.onPlayerDisconnect( function( playerId ){


            if( _isInParty ) {
                _map.killPlayerById( playerId, true );
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

        _connector.onEnd(showEnd);
    }

    function replay(){
        _engine.displayLoadingUI();
        _engine.loadingUIText = "Recherche d'autre joueurs...";

        _isFirstLoad = false;
        _menuPlayers.delPlayers();
        _map.delPlayers();
        _map.delBlocks();
        _map.delBombs();
        _connector.ready();
    }

    function showEnd(){

        _isInParty = false;

        _cursorCapture.stopCapture();

        _cameraSwitcher.deadView();

        var header = "<h4 class='modal-title' >Partie Terminée!</h4>";

        var footer = "<button type='button' class='btn btn-primary' id='btn-rejouer'>Rejouer!</button>";

        var body = "<table class='table table-striped' id='table-score'>"+
            "<thead>"+
                "<tr>"+
                    "<th>Kills</th>"+
                    "<th>Nom</th>"+
                    "<th>Statu</th>"+
                    "<th>Total Bombes</th>"+
                    "<th>Total blocks</th>"+
                "</tr>"+
            "</thead>"+
            "<tbody id='table-score-body'></tbody>"+
        "</table>";

        var players = _map.getPlayers();
        var tablePlayers = "";

        players.sort(function( a, b ){
            return a.kills <= b.kills;
        });

        for ( var i = 0; i < players.length; i++ ) {
            var player = players[i];
            var statusString = player.alive ? "En vie" : "Mort";
            statusString = player.kamicat || statusString;
            var kills = player.kills > 0 ? player.kills : "-";
            var nbBombe = player.totalNbBombe > 0 ? player.totalNbBombe : "-";
            var nbBlocksDestroy = player.nbBlocksDestroy > 0 ? player.nbBlocksDestroy : "-";

            tablePlayers += "<tr>"+
                "<td>" + kills + "</td>"+
                "<td>" + player.name + "</td>"+
                "<td>" + statusString + "</td>"+
                "<td>" + nbBombe + "</td>"+
                "<td>" + nbBlocksDestroy + "</td>"+
                "</tr>";
        }

        _popup.setContent( header, body, footer );
        $("#table-score-body").append( tablePlayers );

        _popup.show();
        _timer.hide();

        $("#btn-rejouer").click(function(){
            _popup.hide();
            replay();
        });
    }
}