"use strict";
const cfg = require('config.es6');
const Assets = require('assets/assets.es6');

class Player{
  constructor(id, name, picture, spawnPoint, powerUp, alive, kills){

    this.id = id;
    this.name = name;
    this.type = 'player';
    this.picture = picture;
    this.powerUp = powerUp;
    this.alive = alive;
    this.kills = kills;
    this._spawnPoint = spawnPoint;
    this._isReadyForSetBomb = true;
    this.nbBlocksDestroy = 0;
    this.totalNbBombe = 0;
    this.listBombs = [];
    this.position = new BABYLON.Vector3(0, 0, 0);
    this.meshs = {};
    
    this._createMesh();
    this._createMeshColision();
  }

  roundPosition () {
    const roundValue = (value) => {
      return Math.round(Math.round(value) / cfg.blockDim) * cfg.blockDim;
    };
      
    return {
      x: roundValue(this.position.x),
      z: roundValue(this.position.z)
    };
  }

  shouldSetBomb () {

    return ( this.alive === true ) && (this.listBombs.length < this.powerUp.bombs ) && this._isReadyForSetBomb;

  }

  destroy () {

    this.alive = false;

    this.meshs.shape.dispose();

    this.meshs.colisionBlock.dispose();

  }

  move (position) {

    var animNamePosition = "MoveAnim";

    var nextPos = new BABYLON.Vector3(parseFloat(position.x), 0, parseFloat(position.z));

    this.meshs.shape.lookAt(new BABYLON.Vector3(parseFloat(position.x), 0, parseFloat(position.z)));

    var animationPosition;

    for (var iAnim = 0; iAnim < this.meshs.shape.animations.length; iAnim++) {

      if (this.meshs.shape.animations[iAnim].name === animNamePosition) {

        animationPosition = this.meshs.shape.animations[iAnim];
      }
    }

    if (!animationPosition) {

      animationPosition = new BABYLON.Animation(animNamePosition, "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

      this.meshs.shape.animations.push(animationPosition);
    }

    var keysAnimPosition = [];

    keysAnimPosition.push({frame: 0, value: this.meshs.shape.position});

    keysAnimPosition.push({frame: 10, value: nextPos});

    animationPosition.setKeys(keysAnimPosition);

    this.position.x = position.x;
    this.position.z = position.z;

    this.meshs.colisionBlock.position.x = this.position.x;
    this.meshs.colisionBlock.position.z = this.position.z;

  }

  addBomb (bomb) {

    this._isReadyForSetBomb = false;

    setTimeout( () => {

      this._isReadyForSetBomb = true;

    }, cfg.timeBetweenTwoBombe);

    this.listBombs.push(bomb);

    this.totalNbBombe++;
  }

  delBombById (Bombid) {

    for (var i = 0; i < this.listBombs.length; i++) {

      if (this.listBombs[i].id === Bombid) {

        this.listBombs.splice(i, 1);

        return true;
      }
    }

    return false;
  }

  delBombs () {

    for (var i = 0; i < this.listBombs.length; i++) {

      this.listBombs[i].deleted();
    }

    this.listBombs = [];

    return true;
  }

  //PRIVATE METHODS//

  _createMesh() {

    var meshPlayer = Assets.get('persocourse')[0].clone();

    meshPlayer.skeleton = Assets.get('persocourse')[0].skeleton.clone();

    var pivot = BABYLON.Matrix.RotationY(-Math.PI / 2);

    meshPlayer.setPivotMatrix(pivot);

    meshPlayer.isVisible = true;

    meshPlayer.position = new BABYLON.Vector3(this._spawnPoint.x, 0, this._spawnPoint.z);

    this.meshs.shape = meshPlayer;

    this.position = meshPlayer.position;
  }

  _createMeshColision() {

    var meshTempColision = Assets.get('tempBlockColision')[0].clone();

    meshTempColision.isVisible = cfg.showBlockColision;

    meshTempColision.checkCollisions = false;

    meshTempColision.position = {
      x: this._spawnPoint.x,
      y: 0,
      z: this._spawnPoint.z
    };

    this.meshs.colisionBlock = meshTempColision;
  }

  //self.init();
}

module.exports = Player;