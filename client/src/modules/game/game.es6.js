"use strict";/*jshint -W083, latedef: nofunc*/

const config = require('config.es6');
const Bombe = require("bomb/bomb.es6");
const CameraSwitcher = require("camera/cameraSwitcher");
const Connectors = require("connectors/connectors.es6");
const CursorCapture = require("cursorCapture/cursorCapture");
const EndGame = require("endGame/endGame");
const KeyBinder = require("keyBinder/keyBinder");
const Maps = require("maps/maps");
const MenuPlayers = require("menuPlayers/menuPlayers");
const MyPlayer = require("player/myPlayer");
const Player = require("player/player.es6");
const Preloader = require("preloader/preloader");
const Environnement = require("environnement/environnement.es6");
const Timer = require("timer/timer");
const utils = require("utils/utils");

const __BLOCK_DIM = 8;

class Game {
  constructor ( canvasId ){

    this._radius_step = 0.8;
    this._alpha_step = 0.005;

    this._isInParty = false;
    this._isFirstLoad = true;
    this._map = null;
    this._mapJson = null;
    this._timer = null;
    this._myPlayer = null;

    this._canvas = document.getElementById(canvasId);

    this._engine = new BABYLON.Engine(this._canvas, true);
    
    this.environnement = new Environnement(this._engine);
    
    this._scene = this.environnement.getScene();
    
    this._preloader = new Preloader(this._scene);
    
    this._menuPlayers = new MenuPlayers();

    this._keyBinder = new KeyBinder();

    this._cursorCapture = new CursorCapture(this._scene, this._canvas);

    this._cameraSwitcher = new CameraSwitcher(this._scene, this._canvas);

    this._endGame = new EndGame();

    this._engine.displayLoadingUI();


    Connectors.ready();

    this._preloadFinish = false;
    this._getMapFinish = false;
    this._preloader.onFinish( () => {
      this._engine.loadingUIText = "Recherche d'autre joueurs...";
      this._preloadFinish = true;

      if (this._preloadFinish && this._getMapFinish) {
        this._render();
      }

    });

    Connectors.getMap( (data) => {
      this._mapJson = data;
      this._getMapFinish = true;
      this._engine.loadingUIText = "Téléchargement du contenu...";
      if (this._preloadFinish && this._getMapFinish) {
        this._render();
      }
    });

    Connectors.onReady( (timeParty) => {

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
          Connectors.setBomb(bombe.id);
        }
      }
    });

    this._listenEvents();
  }

  _render() {

    this._map = this._map || new Maps(this._assets, __BLOCK_DIM, this._scene, this._menuPlayers);

    this._timer = this._timer || new Timer(this._map);
    this._timer.timeToStartParty = this._mapJson.timerToStart;
    this._timer.limitToCheckNumberPlayer = this._mapJson.limitToCheckNumberPlayer;
    this._timer.nbPlayersToStart = this._mapJson.nbPlayersToStart;

    this._timer.show();

    this._timer.showTimerToStartParty();

    // Creation des players
    for (var i = 0; i < this._mapJson.players.length; i++) {

      let playerJson = this._mapJson.players[i];
      let player = new Player(playerJson.id, playerJson.name, playerJson.picture, playerJson.position, playerJson.powerUp, playerJson.alive, playerJson.kills, this._assets, __BLOCK_DIM);

      if (playerJson.isMine) {
        if (this._isFirstLoad) {
          this._myPlayer = this._myPlayer || new MyPlayer(this._scene, playerJson.position, Connectors, this._cameraSwitcher);
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

    Connectors.onPlayerMove( (id, position) => {

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

    Connectors.onPlayerSetBomb((playerId, bombeId, position) => {

      var player = this._map.getPlayerById(playerId);
      var bombe = new Bombe(bombeId, player, position, this._assets, this._scene);
      player.addBomb(bombe);

    });

    Connectors.onExplosion( (ownerId, bombesExplodedId, playersIdKilled, blocksIdDestroy) => {

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

    Connectors.onNewPlayer( (id, name, picture, position, powerUp, alive, kills) => {

      var player = new Player(id, name, picture, position, powerUp, alive, kills, this._assets, __BLOCK_DIM);

      this._menuPlayers.addPlayer(player);

      this._map.addObject(player);

    });

    Connectors.onPlayerDisconnect( (playerId) => {


      if (this._isInParty) {
        this._map.killPlayerById(playerId, true);
      }
      else {
        this._menuPlayers.delPlayer(playerId);
        this._map.delPlayerById(playerId);
      }

    });

    Connectors.setPermanentBombId( (tempBombId, bombId) => {

      var bomb = this._map.getBombsById(tempBombId);
      bomb.id = bombId;

    });

    Connectors.onEnd( () => {

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
    Connectors.ready();
  }
}

module.exports = Game;
