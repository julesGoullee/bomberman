'use strict';

const Analitics = require('analitics/analitics.es6');
//const checkWebGl = require('checkWebGL/checkWebGl.es6');
const Auth = require('auth/auth.es6');
const Game = require('game/game.es6');

new Analitics();

//checkWebGl( () => {
  var auth = new Auth( () => {
    auth.ready(() => {
      new Game('renderCanvas');
    });
  });
//});
