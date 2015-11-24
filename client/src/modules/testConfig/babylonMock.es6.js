'use strict';

BABYLON.Mesh.CreateBox = () => { return {}; };
BABYLON.Texture = () => { return {}; };
BABYLON.ExecuteCodeAction = (params, cb) => { cb();};

BABYLON.ParticleSystem = () => {
  return {
    start: () => {},
    stop: () => {},
    clone : () => {
      return {
        dispose : () => {},
        start: () => {},
        stop: () => {}
      };
    }
  };
};

BABYLON.ActionManager = () => {
  return { registerAction: () => {} };
};
