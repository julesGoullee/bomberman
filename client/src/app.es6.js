"use strict";

var Analitics = require("analitics/analitics");
var Game = require("game/game");
var checkWebGl = require("checkWebGL/checkWebGl.es6");

new Analitics();

checkWebGl( () => {
  new Game("renderCanvas").init();
});
