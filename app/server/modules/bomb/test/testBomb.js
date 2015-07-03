"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );

var Player = require("./../../player/player.js");
var Bombe = require("./../bomb.js");

describe( "Bombe" ,function() {

    var player;
    var spawnPoint = {x :50, z:-65};
    var bombe;

    var clock;
    var mockRoom = {
        playersSpawnPoint: {
            getFreePosition: function(){}
        }
    };
    sinon.stub(mockRoom.playersSpawnPoint,"getFreePosition", function(){
        return spawnPoint;
    });

    beforeEach( function() {
        var mockSocket = {};
        var mockToken = "t1";

        clock = sinon.useFakeTimers();

        player = new Player( mockToken, mockSocket, "testPlayer", mockRoom );

        bombe = new Bombe( player, player.position );
    });

    afterEach(function() {

        clock.restore();
    });

    it( "Peut creer une bombe a la bonne position", function() {

        var expectPosition = {
            x: spawnPoint.x,
            y: 0,
            z: spawnPoint.z
        };

        expect( expectPosition ).to.deep.equal( bombe.position );
    });

    it( "Peut détruire une bombe", function () {

        expect( bombe.exploded ).to.equal( false );

        clock.tick( bombe.countDown );

        expect( bombe.exploded ).to.equal( true );
    });

    it( "Peut annuler la déstruction d'une bombe", function () {

        var callbackExploded = {
            call: function(){}
        };

        var callbackExplodedSpy = sinon.spy(callbackExploded,'call');

        bombe.onExploded( callbackExploded.call );

        bombe.cancelTimer();

        clock.tick( bombe.countDown );

        expect( bombe.exploded ).to.equal( false );

        expect( callbackExplodedSpy ).not.calledWith();

    });

    it( "Peut exectuer un callback apres l'explosion", function() {

        var callbackExploded = {
            call: function(){}
        };

        var callbackExplodedSpy = sinon.spy(callbackExploded,'call');

        bombe.onExploded( callbackExploded.call );

        expect( callbackExplodedSpy ).not.calledWith();

        clock.tick( bombe.countDown );

        expect( callbackExplodedSpy ).calledWith();

    });
});