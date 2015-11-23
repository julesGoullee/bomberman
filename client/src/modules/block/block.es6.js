"use strict";
var cfg = require("config.es6");

class Block {

  constructor( id, positionSpawn, assets) {

    this.id = id;

    this._assets = assets;

    this._positionSpawn = positionSpawn;

    this.type = "block";

    this.position = {x: 0, y: 0, z: 0};

    this.meshs = {};

    this._createMeshColision();

    this._createMesh();

  }

  destroy () {

    this.meshs.shape.dispose();

    this.meshs.colisionBlock.dispose();

  }

  _createMesh () {

    const meshTemp = this._assets.tempBlock[0].clone();

    meshTemp.isVisible = true;

    meshTemp.checkCollisions = false;

    meshTemp.position =  {
      x: this._positionSpawn.x,
      y: 0,
      z: this._positionSpawn.z
    };

    this.meshs.shape = meshTemp;

    this.position = meshTemp.position;

  }

  _createMeshColision() {

    const meshTempColision = this._assets.tempBlockColision[0].clone();

    meshTempColision.isVisible = cfg.showBlockColision;

    meshTempColision.checkCollisions = true;

    meshTempColision.position = {
      x: this._positionSpawn.x,
      y: 0,
      z: this._positionSpawn.z
    };

    this.meshs.colisionBlock = meshTempColision;
  }
}

module.exports = Block;
