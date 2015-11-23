'use strict';

class Environnement {
  
  constructor (engine) {
    this._scene = new BABYLON.Scene(engine);
    this._engine = engine;
    
    //this._scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

    this._scene.collisionsEnabled = true;

    this._enableLight();

    this._enableSkybox();

    this._enableAutoResize();
  }
  
  getScene (){
    return this._scene;
  }
  
  _enableLight () {

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);

    light.intensity = 0.8;
  }
  
  _enableSkybox () {

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, this._scene);

    skybox.position = new BABYLON.Vector3(0, 100, 0);

    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);

    skyboxMaterial.backFaceCulling = false;

    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", this._scene);

    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    skybox.material = skyboxMaterial;
  }
  
  _enableAutoResize () {
    window.addEventListener("resize",() => {
      return this._engine.resize();
    }, false);
  }
}

module.exports = Environnement;