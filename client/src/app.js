"use strict";

var Analitics = require("analitics/analitics");
var Game = require("game/game");

new Analitics();
new Game("renderCanvas").init();
