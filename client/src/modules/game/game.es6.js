/*jshint -W083, latedef: nofunc*/
"use strict";
const MenuPlayers =   require("menuPlayers/menuPlayers");
const KeyBinder =   require("keyBinder/keyBinder");
const CursorCapture =   require("cursorCapture/cursorCapture");
const CameraSwitcher =   require("camera/cameraSwitcher");
const EndGame =   require("endGame/endGame");
const Preloader =   require("preloader/preloader");
const Maps =   require("maps/maps");
const Timer =   require("timer/timer");
const Player =   require("player/player.es6");
const MyPlayer =   require("player/myPlayer");
const Bombe =   require("bomb/bomb.es6");
const utils =   require("utils/utils");

function initScene(engine) {

  function enableLight() {

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 0.8;
  }

  function enableSkybox() {

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);

    skybox.position = new BABYLON.Vector3(0, 100, 0);

    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

    skyboxMaterial.backFaceCulling = false;

    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);

    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    skybox.material = skyboxMaterial;
  }

  function enableAutoResize() {
    window.addEventListener("resize",() => {
      return engine.resize();
    }, false);
  }

  var scene = new BABYLON.Scene(engine);

  //scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

  scene.collisionsEnabled = true;

  enableLight();

  enableSkybox();

  enableAutoResize();

  return scene;
}

class Game {
  constructor ( connector, canvasId ){
    const meshPreload = [
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
    this._blockDim = 8;
    this._radius_step = 0.8;
    this._alpha_step = 0.005;

    this._isInParty = false;
    this._isFirstLoad = true;
    this._map = null;
    this._mapJson = null;
    this._timer = null;
    this._myPlayer = null;
    this._assets = {};


    this._connector = connector;

    this._canvas = document.getElementById(canvasId);

    this._engine = new BABYLON.Engine(this._canvas, true);

    this._scene = initScene(this._engine);

    this._menuPlayers = new MenuPlayers();

    this._keyBinder = new KeyBinder();

    this._cursorCapture = new CursorCapture(this._scene, this._canvas);

    this._cameraSwitcher = new CameraSwitcher(this._scene, this._canvas);

    this._endGame = new EndGame();

    this._engine.displayLoadingUI();


    this._preloadFinish = false;
    this._getMapFinish = false;
    new Preloader(this._scene, meshPreload, this._assets).onFinish( () => {

      this._connector.ready();
      this._engine.loadingUIText = "Recherche d'autre joueurs...";
      this._preloadFinish = true;

      if (this._preloadFinish && this._getMapFinish) {
        this._render();
      }

    });

    this._connector.getMap( (data) => {
      this._mapJson = data;
      this._getMapFinish = true;
      if (this._preloadFinish && this._getMapFinish) {
        this._render();
      }
    });

    this._connector.onReady( (timeParty) => {

      this._timer.startGame(timeParty);

      this._scene.unregisterBeforeRender(() => { this._standingStartAnimation(); });

      this._cameraSwitcher.playerView(this._myPlayer.player.position,() => {
        this._isInParty = true;

        this._cursorCapture.autoRequestCapture();
        this._myPlayer.attachControl();
      });

    });

    this._keyBinder.onSetBomb( () =>{

      if (this._cursorCapture.pointerLocked && this._isInParty) {

        if (this._myPlayer.player.shouldSetBomb() && !this._map.getBombByPosition(this._myPlayer.player.roundPosition())) {

          var bombTempId = utils.guid();

          var bombe = new Bombe(bombTempId, this._myPlayer.player, this._myPlayer.player.roundPosition(), this._assets, this._scene);

          this._myPlayer.player.addBomb(bombe);
          this._connector.setBomb(bombe.id);
        }
      }
    });

    this._listenEvents();
  }

  _render() {

    this._map = this._map || new Maps(this._assets, this._blockDim, this._scene, this._menuPlayers);

    this._timer = this._timer || new Timer(this._map);
    this._timer.timeToStartParty = this._mapJson.timerToStart;
    this._timer.limitToCheckNumberPlayer = this._mapJson.limitToCheckNumberPlayer;
    this._timer.nbPlayersToStart = this._mapJson.nbPlayersToStart;

    this._timer.show();

    this._timer.showTimerToStartParty();

    // Creation des players
    for (var i = 0; i < this._mapJson.players.length; i++) {

      let playerJson = this._mapJson.players[i];
      let player = new Player(playerJson.id, playerJson.name, playerJson.picture, playerJson.position, playerJson.powerUp, playerJson.alive, playerJson.kills, this._assets, this._blockDim);

      if (playerJson.isMine) {
        if (this._isFirstLoad) {
          this._myPlayer = this._myPlayer || new MyPlayer(this._scene, playerJson.position, this._connector, this._cameraSwitcher);
        }
        else {
          this._myPlayer.position = playerJson.position;
        }
        this._myPlayer.player = player;
      }

      this._map.addObject(player);
      this._menuPlayers.addPlayer(player);
    }

    this._radius_step = 0.8;
    this._scene.registerBeforeRender( () => { this._standingStartAnimation(); });

    if (this._isFirstLoad) {

      this._cameraSwitcher.deadView();

      this._keyBinder.onSwitchCamera(this._cameraSwitcher.switchCamera);

      this._map.create(this._mapJson.blockTemp);

      this._engine.runRenderLoop( () => {

        this._scene.render();

        if (this._isInParty && this._myPlayer.player.alive) {
          this._myPlayer.renderMyPlayer();
        }
        //map.playerLootPowerUp();

        document.getElementById("debug").innerHTML = "fps : " + (Math.round(this._engine.getFps() * 100) / 100).toFixed(2) +
          " <br>Position camera Player: x: " + ( Math.round(this._scene.activeCamera.position.x * 100) / 100).toFixed(2) +
          " | z: " + (Math.round(this._scene.activeCamera.position.z * 100) / 100).toFixed(2);
      });
    }
    else {
      this._map.setTempBlocks(this._mapJson.blockTemp);
    }

    this._engine.hideLoadingUI();

  }

  _standingStartAnimation(){

    this._scene.activeCamera.radius -= this._radius_step;

    if (this._scene.activeCamera.radius < 150) {
      this._radius_step = 0;
      this._scene.activeCamera.alpha -= this._alpha_step;
    }
  }

  _listenEvents() {

    this._connector.onPlayerMove( (id, position) => {

      var player = this._map.getPlayerById(id);

      if (player) {

        player.move(position);

        var animable = this._scene.getAnimatableByTarget(player.meshs.shape);

        if (player.timeOut) {

          clearTimeout(player.timeOut);
        }

        if (player.lastAnimRun) {
          delete player.lastAnimRun;
          return typeof animable === "object" && animable.stop();
        }

        if (!animable) {

          this._scene.beginAnimation(player.meshs.shape, 0, 20, false, 1, () => {

            if (player.timeOut) {
              clearTimeout(player.timeOut);
            }

            player.timeOut = setTimeout( () => {

              if (player.lastAnim) {

                player.lastAnimRun = true;

                this._scene.beginAnimation(player.meshs.shape, 308, 458, true, 1);

              }
            }, 100);

            player.lastAnim = true;
          });

        }
      }
    });

    this._connector.onPlayerSetBomb((playerId, bombeId, position) => {

      var player = this._map.getPlayerById(playerId);
      var bombe = new Bombe(bombeId, player, position, this._assets, this._scene);
      player.addBomb(bombe);

    });

    this._connector.onExplosion( (ownerId, bombesExplodedId, playersIdKilled, blocksIdDestroy) => {

      var playerOwner = this._map.getPlayerById(ownerId);

      for (var i = 0; i < playersIdKilled.length; i++) {

        var playerKilledId = playersIdKilled[i];

        var isKamiCat = false;

        if (playerOwner.id === playerKilledId) {
          isKamiCat = true;
        }
        else {
          playerOwner.kills++;
        }

        this._map.killPlayerById(playerKilledId, isKamiCat);

        if (playerKilledId === this._myPlayer.player.id) {

          this._cameraSwitcher.animFromPlayerToDeadView(this._myPlayer.player.position, () => {
            this._cameraSwitcher.deadView();
            this._cursorCapture.stopCapture();
            this._radius_step = 0.8;
            this._scene.registerBeforeRender( () => { this._standingStartAnimation(); });
          });
        }
      }

      for (var j = 0; j < blocksIdDestroy.length; j++) {

        var blockIdDestroy = blocksIdDestroy[j];
        this._map.delBlockById(blockIdDestroy);
        playerOwner.nbBlocksDestroy++;
      }

      for (var k = 0; k < bombesExplodedId.length; k++) {

        var bombeExplodedId = bombesExplodedId[k];
        var bombe = this._map.getBombsById(bombeExplodedId);
        bombe.destroy();
        bombe.owner.delBombById(bombe.id);

      }

      this._menuPlayers.changeScore(playerOwner.kills, playerOwner.id);

    });

    this._connector.onNewPlayer( (id, name, picture, position, powerUp, alive, kills) => {

      var player = new Player(id, name, picture, position, powerUp, alive, kills, this._assets, this._blockDim);

      this._menuPlayers.addPlayer(player);

      this._map.addObject(player);

    });

    this._connector.onPlayerDisconnect( (playerId) => {


      if (this._isInParty) {
        this._map.killPlayerById(playerId, true);
      }
      else {
        this._menuPlayers.delPlayer(playerId);
        this._map.delPlayerById(playerId);
      }

    });

    this._connector.setPermanentBombId( (tempBombId, bombId) => {

      var bomb = this._map.getBombsById(tempBombId);
      bomb.id = bombId;

    });

    this._connector.onEnd( () => {

      this._isInParty = false;

      if (this._myPlayer.player.alive) {

        this._cursorCapture.stopCapture();
        this._cameraSwitcher.deadView();
      }

      this._timer.hide();

      this._endGame.showEndPopup(this._map);
    });

    this._endGame.onReplay( () => { this._replay(); });

  }

  _replay() {

    this._engine.displayLoadingUI();
    this._engine.loadingUIText = "Recherche d'autre joueurs...";

    this._isFirstLoad = false;
    this._menuPlayers.delPlayers();
    this._map.delPlayers();
    this._map.delBlocks();
    this._map.delBombs();
    this._scene.unregisterBeforeRender( () => { this._standingStartAnimation(); });
    this._connector.ready();
  }
}

module.exports = Game;
