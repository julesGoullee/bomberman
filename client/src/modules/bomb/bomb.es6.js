'use strict';

const cfg = require('config.es6');
const Obj = require('object/object.es6');

class Bomb extends Obj{

  constructor ( id, owner, position, scene ) {

    super(id, 'bomb', position);

    this.power = 2;

    this._scene = scene;

    this.countDown = cfg.bombCountDown;

    this.exploded = false;

    this.duration = 800;

    this.owner = owner;

    this.meshs = {};

    this._createMeshColision('bombColision');

    this._createMesh('bomb');

  }

  destroy () {

    this.meshs.shape.dispose();

    this._launchExplosion( () => {
      this.meshs.colisionBlock.dispose();
    });

    this.exploded = true;
  }

  deleted () {

    this.meshs.shape.dispose();

    this.meshs.colisionBlock.dispose();
  }

  _launchExplosion (cb) {

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem('particles', 50, this._scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture('assets/particule.png', this._scene);

    // Where the particles come from
    particleSystem.emitter = this.meshs.shape; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-4, 0, 4); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(4, 8, -4); // To...

    particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.8, 0.2, 0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0.3, 0.1, 0, 0.3);

    // Size of each particle (random between...
    particleSystem.minSize = 1;
    particleSystem.maxSize = 2;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 1;
    particleSystem.maxLifeTime = 2;

    // Emission rate
    particleSystem.emitRate = 1000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 1, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-6, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(6, 0, 0);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 14;
    particleSystem.maxEmitPower = 20;
    particleSystem.updateSpeed = 0.008;
    particleSystem.targetStopDuration = 0.5;

    // Start the particle system
    var ps2 = particleSystem.clone();
    ps2.direction1 = new BABYLON.Vector3(0, 0, 6);
    ps2.direction2 = new BABYLON.Vector3(0, 0, -6);

    var ps3 = particleSystem.clone();
    ps3.minEmitBox = new BABYLON.Vector3(-4, 0, 4);
    ps3.direction1 = new BABYLON.Vector3(0, 8, 0);
    ps3.direction2 = new BABYLON.Vector3(0, 8, 0);

    particleSystem.start();
    ps2.start();
    ps3.start();

    particleSystem.disposeOnStop = true;

    setTimeout( () =>{
      cb();
    }, 1500);
    //var i = 0;
    //scene.registerBeforeRender(function () {
    //    i = i + 5;
    //    particleSystem.maxEmitBox = new BABYLON.Vector3(i, 0, i);
    //    particleSystem.direction1 = new BABYLON.Vector3(-i, 1, -i);
    //    particleSystem.direction2 = new BABYLON.Vector3(i, i*10, i);
    //});
    //setTimeout(function( ){
    //    particleSystem.stop();
    //    callback();
    //},10000)
  }
}

module.exports = Bomb;
