'use strict';
var _assets = {
  "ground" : [{}],
  "permanentBlocks": [{}],
  "permanentBlocksColision": [{}],
  "tour": [{}],
  "tourColision": [{}],
  "tempBlock": [{
    clone : () => {
      return { dispose : () => {} };
    }
  }],
  "tempBlockColision": [{
    clone : () => {
      return { actionManager: { registerAction: () => {}},dispose : () => {} };
    }
  }],
  "personnage" :[{
    clone : () => {
      return { dispose : () => {} };
    }
  }],
  "persocourse" :[{
    clone : () => {
      return {
        dispose : () => {},
        setPivotMatrix: () => {}
      };
    },
    skeleton : {
      clone : () => {
        return { dispose : () => {} };
      }
    }
  }],
  "personnageColision" :[{

    clone : () => {
      return { actionManager: { registerAction: () => {}},dispose : () => {} };
    }
  }],
  "bomb" :[{
    clone : () => {
      return { dispose : () => {} };
    }
  }],
  "bombColision" :[{
    actionManager: { registerAction: () => {}},
    clone : () => {
      return { actionManager: { registerAction: () => {}},dispose : () => {} };
    }
  }],
  "powerUpBallon" :[{
    clone : () => {
      return {
        dispose : () => {}
      };
    },
    skeleton : {
      clone : () => {
        return {};
      }
    }
  }]
};

class Assets {
  static add (name, data) {
    _assets[name] = data;
  }
  static get (name){
    //console.log(_assets[name]);
    //console.log(_assets[name] === void 0, "2");
    if (_assets[name] === void 0) {
      throw new Error('Mesh ' + name + ' is not preload[MOCK]');
    }

    return _assets[name];
  }
}

module.exports = Assets;
