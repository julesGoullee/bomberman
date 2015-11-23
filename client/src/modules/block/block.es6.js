'use strict';
const cfg = require('config.es6');
const Assets = require('assets/assets.es6');

class Block {

  constructor( id, positionSpawn) {

    this.id = id;

    this._positionSpawn = positionSpawn;

    this.type = 'block';

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

    const meshTemp = Assets.get('tempBlock')[0].clone();

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

    const meshTempColision = Assets.get('tempBlockColision')[0].clone();

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
