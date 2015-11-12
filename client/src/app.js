"use strict";

define(["analitics/analitics", "game/game"],function ( Analitics, Game ) {
  new Analitics();

  new Game("renderCanvas").init();

});
