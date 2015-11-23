"use strict";

define(["config.es6", "utils/utils"], function(cfg, utils) {
  return function PowerUp(position, pouvoir, valeur, assets) {

    var self = this;

    // PUBLIC METHODS //

    self.id = utils.guid();

    self.type = "powerUp";

    self.position = position;

    self.pouvoir = pouvoir;

    self.valeur = valeur;

    self.meshs = {};

    self.destroy = function () {

      self.meshs.shape.dispose();

      self.meshs.colisionBlock.dispose();

    };

    self.init = function () {

      createMesh();

      createMeshColision();
    };

    // PRIVATE METHODS //

    function createMesh() {

      var meshPowerUp = assets.get('powerUpBallon')[0].clone();

      meshPowerUp.skeleton = assets.get('powerUpBallon')[0].skeleton.clone();

      meshPowerUp.checkCollisions = false;

      meshPowerUp.isVisible = false;

      meshPowerUp.position = {
        x: position.x,
        y: 0,
        z: position.z
      };

      self.meshs.shape = meshPowerUp;
    }

    function createMeshColision() {

      var meshTempColision = assets.get('tempBlockColision')[0].clone();

      meshTempColision.isVisible = cfg.showBlockColision;

      meshTempColision.checkCollisions = false;

      meshTempColision.position = {
        x: position.x,
        y: 0,
        z: position.z
      };

      self.meshs.colisionBlock = meshTempColision;
    }


    self.init();
  };
});
