"use strict";

const Analitics = require("analitics/analitics.es6");
//var checkWebGl = require("checkWebGL/checkWebGl.es6");
const Auth = require("auth/auth.es6");
const Connector = require("connector/connector");
new Analitics();

//checkWebGl( () => {
  const connector = new Connector();

  const auth = new Auth(connector, () => {
    auth.ready( () => {
      var Game = require("game/game");

      new Game("renderCanvas").init();
    });
  });

//});
