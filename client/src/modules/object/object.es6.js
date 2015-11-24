'use strict';

const cfg = require('config.es6');
const utils = require("utils/utils");
const Assets = require('assets/assets.es6');

class Obj {

  constructor(id, type, position) {
    this.id = id;
    this.type = type;
    this.position = {
      x: position.x,
      y: 0,
      z: position.z
    };
  }

  _createMesh( assetsName ) {

    let mesh = Assets.get(assetsName)[0].clone();

    mesh.position = {x: this.position.x, y: 0, z: this.position.z};

    mesh.isVisible = true;

    mesh.checkCollisions = false;

    //meshBomb.setPhysicsState({ impostor : BABYLON.PhysicsEngine.SphereImpostor,move:true, mass:1, friction:0.5, restitution:0.5});

    this.meshs.shape = mesh;
  }

  _createMeshColision ( assetsName ) {


    let meshColision = Assets.get(assetsName)[0].clone();

    meshColision.position = {
      x: this.position.x,
      y: 0,
      z: this.position.z
    };

    meshColision.isVisible = cfg.showBlockColision;
    utils.onMeshsExitIntersect(meshColision, this.owner.meshs.colisionBlock, this._scene);

    this.meshs.colisionBlock = meshColision;

    this.position = meshColision.position;
  }

}

module.exports = Obj;
