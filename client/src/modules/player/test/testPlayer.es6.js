"use strict";

const cfg = require('config/config');
const Bombe = require('bomb/bomb');
var GameMock = require('testConfig/gameMock.es6');
const Player = require('player/player');
const utils = require('utils/utils');

describe( "Player", () => {

  var player;

  var spawnPoint = { x:48, z:-64};

  //var deathCam = { x : 65, y: 147, z: 0 };

  beforeEach( () => {

    player = new Player(0, "testPlayer", spawnPoint, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, GameMock.assets, GameMock.blockDim );
  });

  it( "Peut créer un player a la bonne position", () => {

    var expectPosition = new BABYLON.Vector3(spawnPoint.x, 0,spawnPoint.z);

    expect( expectPosition ).toEqual( player.position );
  });

  it( "Peut recuperer la position arrondie en dessus", () => {

    player.position.x = 26.456345;

    player.position.z = -10.557235;

    var expectedPosition = {
      x: 24,
      z: -8
    };

    expect( player.roundPosition() ).toEqual( expectedPosition );
  });

  it( "Peut recuperer la position arrondie au dessus", () => {

    player.position.x = 28.456345;

    player.position.z = -13.557235;

    var expectedPosition = {
      x: 32,
      z: -16
    };

    expect( player.roundPosition() ).toEqual( expectedPosition );
  });

  describe( "Bombe", () => {

    var bombe;

    beforeEach( () => {
      bombe = new Bombe( utils.guid(), player, player.roundPosition() , GameMock.assets, GameMock.scene);
    });

    it( "Peut ajouter une bombe", () => {

      player.addBomb( bombe );

      expect( player.listBombs.length ).toEqual( 1 );

      expect( player.totalNbBombe ).toEqual( 1 );
    });

    it( "Peut poser une bombe a la position du player", () => {

      player.addBomb( bombe );

      expect( player.listBombs[0].position.x ).toEqual( player.position.x);
      expect( player.listBombs[0].position.z ).toEqual( player.position.z);
    });

    it( "Peut poser une bombe a la position arrondie au dessus du player", () => {

      player.position.x = 28.456345;

      player.position.z = -13.557235;

      bombe = new Bombe( utils.guid(), player, player.roundPosition() , GameMock.assets, GameMock.scene);

      player.addBomb( bombe );

      expect( player.listBombs[0].position.x ).toEqual( 32 );
      expect( player.listBombs[0].position.z).toEqual( -16 );
    });

    it( "Peut poser une bombe a la position arrondie en dessous du player", () => {

      player.position.x = 26.456345;

      player.position.z = -10.557235;

      bombe = new Bombe( utils.guid(), player, player.roundPosition() , GameMock.assets, GameMock.scene);

      player.addBomb( bombe );

      expect( player.listBombs[0].position.x ).toEqual( 24 );
      expect( player.listBombs[0].position.z ).toEqual( -8 );
    });

    it( "Ne peut pas poser deux bombe trop rapidement", () => {

      jasmine.clock().install();

      for ( var i = 0; i < 9999; i++ ) {
        if( player.shouldSetBomb()){
          player.addBomb( bombe );
        }
      }
      jasmine.clock().tick(1);

      expect( player.listBombs.length ).toEqual( 1 );


      jasmine.clock().uninstall();

    });

    it( "Peut dire quand le nombre de bombe max est atteind", () => {
      jasmine.clock().install();

      var nbBombeMax = player.powerUp.bombs;

      for ( var i = 0; i < nbBombeMax; i++ ) {
        jasmine.clock().tick( cfg.timeBetweenTwoBombe );

        if( player.shouldSetBomb() ) {
          player.addBomb(bombe);

        }
      }

      expect( player.listBombs.length ).toEqual( nbBombeMax );

      expect( player.shouldSetBomb() ).toEqual( false );

      jasmine.clock().uninstall();

    });

    it( "Peut détruire une bombe par son id ", () => {

      player.addBomb( bombe );

      player.delBombById( bombe.id );

      expect( player.listBombs.length ).toEqual( 0 );
    });

    it( "Peut detruire toutes les bombes", () => {

      player.addBomb( bombe );

      var bombe2 = new Bombe( utils.guid(), player, player.roundPosition() , GameMock.assets, GameMock.scene);


      player.addBomb( bombe2 );
      var bombe3 = new Bombe( utils.guid(), player, player.roundPosition() , GameMock.assets, GameMock.scene);

      player.addBomb( bombe3 );
      player.delBombs();

      expect( player.listBombs.length ).toEqual( 0 );

    });

  });

  it( "Peut tuer un player", () => {

    player.destroy();

    expect( player.alive ).toEqual( false );
  });

  /*it( "Place le player au dessus de la maps à sa mort", () => {

   player.destroy();

   console.log( player.position );

   expect( player. position ).toEqual(deathCam);

   });*/

});
