'use strict';
var _assets = {};

class Assets {
  static add (name, data) {
    _assets[name] = data;
  }
  static get (name){
    if (isUndefined(_assets[name])) {
      throw new Error('Mesh ' + name + 'is not preload');
    }

    return _assets[name];
  }
}

module.exports = Assets;
