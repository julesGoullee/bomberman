"use strict";
/*jshint -W083 */

const Assets = require('assets/assets.es6');

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

class Preloader {
  
  constructor (scene) {
    
    this._loader = null;
    this._scene = scene;
    this._onFinishCallbacks = [];
    
    this._loader = new BABYLON.AssetsManager(this._scene);
    this._loader.useDefaultLoadingScreen = false;

    this._scene._engine.loadingUIBackgroundColor = "#271204";
    this._scene._engine.loadingUIText = "Loading 0%";
    this._loopInitMeshs();

    this._loader.load();

    this._loader.onFinish = () => {
      //scene._engine.loadingUIText = "Loading 100%";
      for (var i = 0; i < this._onFinishCallbacks.length; i++) {
        this._onFinishCallbacks[i]();
      }
    };
  }
  
  onFinish (cb) {
    this._onFinishCallbacks.push(cb);
  }

  _loopInitMeshs() {
       
    for (var iMesh = 0; iMesh < meshPreload.length; iMesh++) {
      var currentMeshs = this._loader.addMeshTask(meshPreload[iMesh], "", "/assets/", meshPreload[iMesh] + ".babylon");

      currentMeshs.onSuccess = (task) => {
        var progression = 100 - ( ( this._loader._waitingTasksCount / meshPreload.length ) * 100);
        this._scene._engine.loadingUIText = "Loading " + Math.round(progression) + "%";
        Preloader._initMesh(task);
      };

      currentMeshs.onError = (task) => {
        throw new Error("Mesh " + task.name + " as error on preloading.");
      };
    }
  }
  
  static _initMesh(task) {
    Assets.add(task.name, task.loadedMeshes);

    for (var i = 0; i < task.loadedMeshes.length; i++) {

      var mesh = task.loadedMeshes[i];

      mesh.useOctreeForCollisions = true;

      mesh.checkCollisions = false;

      mesh.isVisible = false;
    }
  }
}

module.exports = Preloader;
