"use strict";
var gameService = require( "../game.js" );
var assert = require("assert");

describe("Gamee", function(){

    var _game;

    var a;

    beforeEach(function(){
        _game = new gameService();
        a=2;
    });

    it("peut creer un game service", function(){
        a=1;
        assert.equal(1,a);
        a=0;
    });

    it("peut creer un game service", function(){
        assert.equal(2,a);
    });

});