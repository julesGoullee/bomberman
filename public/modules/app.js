"use strict";

define(["analitics/analitics", "game/game","cfg"],function ( Analitics, Game ) {
    new Analitics();

    new Game("renderCanvas").init();

});