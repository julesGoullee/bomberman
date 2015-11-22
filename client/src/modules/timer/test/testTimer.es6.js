"use strict";
const Maps = require('maps/maps');
const MenuPlayers = require('menuPlayers/menuPlayers');
const Player = require('player/player');
const Timer = require('timer/timer');
var GameMock = require('testConfig/gameMock.es6');

describe( "timer", () => {

  var timer;
  var map;
  var timeToStartParty = 60000;//ms
  var timeInParty = 180000;//ms
  var limitToCheckNumberPlayer = 5000;
  var nbPlayersToStart = 2;

  beforeEach(() => {
    jasmine.clock().install();

    map = new Maps( GameMock.assets, GameMock.blockDim, new MenuPlayers() );
    var player = new Player(0, "testPlayer", {x :50, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, GameMock.assets, GameMock.blockDim );
    map.addObject( player );

    timer = new Timer(map);
    timer.timeToStartParty = timeToStartParty;
    timer.nbPlayersToStart = nbPlayersToStart;
    timer.limitToCheckNumberPlayer = limitToCheckNumberPlayer;

    timer.showTimerToStartParty();

  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe("decompteToStartParty", () => {

    it( "Peut demarrer le timer", () => {

      expect( timer.timeToStartParty ).toEqual( timeToStartParty );
      jasmine.clock().tick(timeToStartParty/3);
      expect( timer.timeToStartParty ).toEqual( timeToStartParty - timeToStartParty/3 );

    });

    it( "Peut bloquer le timer a la limite si le nombre min de player n'est pas atteind", () => {

      jasmine.clock().tick(timeToStartParty*3);
      expect( timer.timeToStartParty ).toEqual( limitToCheckNumberPlayer );
      expect($( "#timer-label").text() ).toEqual("En attente de 1 joueurs...");
    });

    it( "Peut se préparer au lancement de la partie si le nombre de joueur est suffisant", () => {

      var player2 = new Player(1, "testPlayer2", {x :0, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, GameMock.assets, GameMock.blockDim );
      map.addObject( player2 );

      jasmine.clock().tick(timeToStartParty*3);
      expect( timer.timeToStartParty ).toEqual( limitToCheckNumberPlayer );
      expect($( "#timer-label").text() ).toEqual("Prepare toi !");

    });

    it( "Peut bloquer le timer puis attendre si suffisament de joueurs", () => {

      jasmine.clock().tick(timeToStartParty*3);
      expect( timer.timeToStartParty ).toEqual( limitToCheckNumberPlayer );
      expect($( "#timer-label").text() ).toEqual("En attente de 1 joueurs...");

      var player2 = new Player(1, "testPlayer2", {x :0, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, GameMock.assets, GameMock.blockDim );
      map.addObject( player2 );
      jasmine.clock().tick(timeToStartParty*3);

      expect($( "#timer-label").text() ).toEqual("Prepare toi !");
    });

  });

  describe("decompteInparty", () => {

    beforeEach(() => {

      var player2 = new Player(1, "testPlayer2", {x :0, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, GameMock.assets, GameMock.blockDim );
      map.addObject( player2 );
      jasmine.clock().tick(timeToStartParty);
      timer.startGame( timeInParty );
    });

    it("Peut lancer la partie", () => {
      expect( timer.timeInParty ).toEqual( timeInParty - 1000 );
    });

    describe("end", () => {

      var spyCallback = jasmine.createSpy('spy');

      beforeEach( () => {
        timer.onTimerEnd( spyCallback );
        jasmine.clock().tick( timeInParty );
        jasmine.clock().tick( 1000 );
      });

      it( "Peut lancer le callback a la fin de la partie", () => {
        expect( spyCallback ).toHaveBeenCalled();
      });
    });
  });


});
