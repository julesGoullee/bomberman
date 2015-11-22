"use strict";

BABYLON.Mesh.CreateBox = () => {
  return {};
};
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
  return {registerAction: () => {}};
};
BABYLON.ExecuteCodeAction = (params, cb) => { cb();};

BABYLON.Texture = () => {
  return {};
};
//function PopupMock() {
//
//  var self = this;
//
//  self.setContent = ( /*header, body*/ ) => {
//  };
//
//  self.show = () => {
//  };
//
//  self.hide = () => {
//  };
//}

var GameMock = {

  assets : {
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
  },
  blockDim: 8,
  scene : {
    beginAnimation : ( shape, from, to, loop, speed, callback ) => {
      return typeof callback  === "function" && callback();
    }
  },
  blocksTemp:[{"id":"1a219","position":{"x":-40,"z":-48}},{"id":"18a24","position":{"x":-40,"z":-40}},{"id":"180d6","position":{"x":-40,"z":-32}},{"id":"1519a","position":{"x":-40,"z":-24}},{"id":"1c546","position":{"x":-40,"z":-16}},{"id":"14046","position":{"x":-40,"z":-8}},{"id":"1fb87","position":{"x":-40,"z":0}},{"id":"1d112","position":{"x":-40,"z":8}},{"id":"17bf3","position":{"x":-40,"z":16}},{"id":"1965e","position":{"x":-40,"z":24}},{"id":"12e2d","position":{"x":-40,"z":32}},{"id":"123fa","position":{"x":-40,"z":40}},{"id":"1049a","position":{"x":-40,"z":48}},{"id":"17e62","position":{"x":-32,"z":-48}},{"id":"1126a","position":{"x":-32,"z":-32}},{"id":"18367","position":{"x":-32,"z":-16}},{"id":"16029","position":{"x":-32,"z":0}},{"id":"1f32c","position":{"x":-32,"z":16}},{"id":"1727b","position":{"x":-32,"z":32}},{"id":"1c168","position":{"x":-32,"z":48}},{"id":"14053","position":{"x":-24,"z":-64}},{"id":"19a60","position":{"x":-24,"z":-56}},{"id":"1304f","position":{"x":-24,"z":-48}},{"id":"161fa","position":{"x":-24,"z":-40}},{"id":"18332","position":{"x":-24,"z":-32}},{"id":"1af43","position":{"x":-24,"z":-24}},{"id":"121f7","position":{"x":-24,"z":-16}},{"id":"19075","position":{"x":-24,"z":-8}},{"id":"138cd","position":{"x":-24,"z":0}},{"id":"188f4","position":{"x":-24,"z":8}},{"id":"1a04a","position":{"x":-24,"z":16}},{"id":"16839","position":{"x":-24,"z":24}},{"id":"1794a","position":{"x":-24,"z":32}},{"id":"19819","position":{"x":-24,"z":40}},{"id":"1b24a","position":{"x":-24,"z":48}},{"id":"13e72","position":{"x":-24,"z":56}},{"id":"178e8","position":{"x":-24,"z":64}},{"id":"13951","position":{"x":-16,"z":-64}},{"id":"15067","position":{"x":-16,"z":-48}},{"id":"11802","position":{"x":-16,"z":-32}},{"id":"1bd2d","position":{"x":-16,"z":-16}},{"id":"12fbe","position":{"x":-16,"z":0}},{"id":"1fdbd","position":{"x":-16,"z":16}},{"id":"19cec","position":{"x":-16,"z":32}},{"id":"1302b","position":{"x":-16,"z":48}},{"id":"1590c","position":{"x":-16,"z":64}},{"id":"11efa","position":{"x":-8,"z":-64}},{"id":"12b8e","position":{"x":-8,"z":-56}},{"id":"1eb71","position":{"x":-8,"z":-48}},{"id":"198f5","position":{"x":-8,"z":-40}},{"id":"1297a","position":{"x":-8,"z":-32}},{"id":"1b7e0","position":{"x":-8,"z":-24}},{"id":"1d770","position":{"x":-8,"z":-16}},{"id":"1e4b4","position":{"x":-8,"z":-8}},{"id":"1d045","position":{"x":-8,"z":0}},{"id":"14ce9","position":{"x":-8,"z":8}},{"id":"1fd5b","position":{"x":-8,"z":16}},{"id":"151ec","position":{"x":-8,"z":24}},{"id":"1c510","position":{"x":-8,"z":32}},{"id":"131e7","position":{"x":-8,"z":40}},{"id":"13079","position":{"x":-8,"z":48}},{"id":"1fac3","position":{"x":-8,"z":56}},{"id":"12666","position":{"x":-8,"z":64}},{"id":"11c91","position":{"x":0,"z":-64}},{"id":"114a6","position":{"x":0,"z":-48}},{"id":"1e4dd","position":{"x":0,"z":-32}},{"id":"1087e","position":{"x":0,"z":-16}},{"id":"1698e","position":{"x":0,"z":0}},{"id":"1632c","position":{"x":0,"z":16}},{"id":"1e51a","position":{"x":0,"z":32}},{"id":"12080","position":{"x":0,"z":48}},{"id":"11061","position":{"x":0,"z":64}},{"id":"124d1","position":{"x":8,"z":-64}},{"id":"1eec2","position":{"x":8,"z":-56}},{"id":"14fc5","position":{"x":8,"z":-48}},{"id":"11f37","position":{"x":8,"z":-40}},{"id":"12b15","position":{"x":8,"z":-32}},{"id":"12ea9","position":{"x":8,"z":-24}},{"id":"1990c","position":{"x":8,"z":-16}},{"id":"15e8e","position":{"x":8,"z":-8}},{"id":"1607a","position":{"x":8,"z":0}},{"id":"17e97","position":{"x":8,"z":8}},{"id":"1f31d","position":{"x":8,"z":16}},{"id":"14c48","position":{"x":8,"z":24}},{"id":"12311","position":{"x":8,"z":32}},{"id":"115b6","position":{"x":8,"z":40}},{"id":"1bdbd","position":{"x":8,"z":48}},{"id":"155aa","position":{"x":8,"z":56}},{"id":"1d051","position":{"x":8,"z":64}},{"id":"17d93","position":{"x":16,"z":-64}},{"id":"193c8","position":{"x":16,"z":-48}},{"id":"199cb","position":{"x":16,"z":-32}},{"id":"1bc1f","position":{"x":16,"z":-16}},{"id":"10ba0","position":{"x":16,"z":0}},{"id":"1fc14","position":{"x":16,"z":16}},{"id":"112d1","position":{"x":16,"z":32}},{"id":"15e7a","position":{"x":16,"z":48}},{"id":"1a779","position":{"x":16,"z":64}},{"id":"11e30","position":{"x":24,"z":-64}},{"id":"1eee2","position":{"x":24,"z":-56}},{"id":"13a0c","position":{"x":24,"z":-48}},{"id":"19527","position":{"x":24,"z":-40}},{"id":"164f6","position":{"x":24,"z":-32}},{"id":"1a4cc","position":{"x":24,"z":-24}},{"id":"12172","position":{"x":24,"z":-16}},{"id":"17825","position":{"x":24,"z":-8}},{"id":"1d258","position":{"x":24,"z":0}},{"id":"13cd7","position":{"x":24,"z":8}},{"id":"1e91d","position":{"x":24,"z":16}},{"id":"16ff3","position":{"x":24,"z":24}},{"id":"11112","position":{"x":24,"z":32}},{"id":"19509","position":{"x":24,"z":40}},{"id":"1fc2b","position":{"x":24,"z":48}},{"id":"1a2d8","position":{"x":24,"z":56}},{"id":"1e227","position":{"x":24,"z":64}},{"id":"1af2e","position":{"x":32,"z":-48}},{"id":"1617c","position":{"x":32,"z":-32}},{"id":"184d4","position":{"x":32,"z":-16}},{"id":"13b82","position":{"x":32,"z":0}},{"id":"1bf4b","position":{"x":32,"z":16}},{"id":"15902","position":{"x":32,"z":32}},{"id":"17d18","position":{"x":32,"z":48}},{"id":"126e9","position":{"x":40,"z":-48}},{"id":"1802a","position":{"x":40,"z":-40}},{"id":"140c3","position":{"x":40,"z":-32}},{"id":"1c29f","position":{"x":40,"z":-24}},{"id":"1e94d","position":{"x":40,"z":-16}},{"id":"1f770","position":{"x":40,"z":-8}},{"id":"1127c","position":{"x":40,"z":0}},{"id":"1a9fa","position":{"x":40,"z":8}},{"id":"1c2e1","position":{"x":40,"z":16}},{"id":"16da5","position":{"x":40,"z":24}},{"id":"184db","position":{"x":40,"z":32}},{"id":"1328d","position":{"x":40,"z":40}},{"id":"16778","position":{"x":40,"z":48}}]
};

module.exports = GameMock;