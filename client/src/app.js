"use strict";

define(["analitics/analitics", "game/game", "auth/facebook"],function ( Analitics, Game, AuthFb ) {
  new Analitics();
  new AuthFb();
  new Game("renderCanvas").init();
  
});
