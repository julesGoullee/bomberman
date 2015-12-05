'use strict';
require('testConfig/babylonMock.es6');
const cfg = require('config.es6');
//cfg.timerToStartParty = 5000;
//cfg.limitToCheckNumberPlayer = 4000;
//cfg.nbPlayersToStart = 2;
//cfg.analitics = false;

const AssetsMock = require('testConfig/assetsMock.es6');
const utils = require('utils/utils');

const Player = require('inject!player/player.es6')({'assets/assets.es6': AssetsMock});

const Obj = require('inject!object/object.es6')({'assets/assets.es6': AssetsMock});
const Bomb = require('inject!bomb/bomb.es6')({'object/object.es6': Obj});

const _sceneMock = {};

describe( 'Player', () => {

  let player;

  const spawnPoint = { x:48, z:-64};

  //var deathCam = { x : 65, y: 147, z: 0 };

  beforeEach( () => {

    player = new Player(0, 'testPlayer', 'testUrl', spawnPoint, {'speed':0.45,'shoot':false,'bombs':2}, true, 0);

  });

  it( 'Peut créer un player a la bonne position', () => {

    const expectPosition = new BABYLON.Vector3(spawnPoint.x, 0,spawnPoint.z);

    expect( expectPosition ).toEqual( player.position );
  });

  it( 'Peut recuperer la position arrondie en dessus', () => {

    player.position.x = 26.456345;

    player.position.z = -10.557235;

    const expectedPosition = {
      x: 24,
      z: -8
    };

    expect( player.roundPosition() ).toEqual( expectedPosition );
  });

  it( 'Peut recuperer la position arrondie au dessus', () => {

    player.position.x = 28.456345;

    player.position.z = -13.557235;

    const expectedPosition = {
      x: 32,
      z: -16
    };

    expect( player.roundPosition() ).toEqual( expectedPosition );
  });

  describe( 'Bomb', () => {

    let bombe;

    beforeEach( () => {
      bombe = new Bomb( utils.guid(), player, player.roundPosition(), _sceneMock);
    });

    it( 'Peut ajouter une bombe', () => {

      player.addBomb( bombe );

      expect( player.listBombs.length ).toEqual( 1 );

      expect( player.totalNbBombe ).toEqual( 1 );
    });

    it( 'Peut poser une bombe a la position du player', () => {

      player.addBomb( bombe );

      expect( player.listBombs[0].position.x ).toEqual( player.position.x);
      expect( player.listBombs[0].position.z ).toEqual( player.position.z);
    });

    it( 'Peut poser une bombe a la position arrondie au dessus du player', () => {

      player.position.x = 28.456345;

      player.position.z = -13.557235;

      bombe = new Bomb( utils.guid(), player, player.roundPosition(), _sceneMock);

      player.addBomb( bombe );

      expect( player.listBombs[0].position.x ).toEqual( 32 );
      expect( player.listBombs[0].position.z).toEqual( -16 );
    });

    it( 'Peut poser une bombe a la position arrondie en dessous du player', () => {

      player.position.x = 26.456345;

      player.position.z = -10.557235;

      bombe = new Bomb( utils.guid(), player, player.roundPosition(), _sceneMock);

      player.addBomb( bombe );

      expect( player.listBombs[0].position.x ).toEqual( 24 );
      expect( player.listBombs[0].position.z ).toEqual( -8 );
    });

    it( 'Ne peut pas poser deux bombe trop rapidement', () => {

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

    it( 'Peut dire quand le nombre de bombe max est atteind', () => {
      jasmine.clock().install();

      const nbBombMax = player.powerUp.bombs;

      for ( let i = 0; i < nbBombMax; i++ ) {
        jasmine.clock().tick( cfg.timeBetweenTwoBombe );

        if( player.shouldSetBomb() ) {
          player.addBomb(bombe);

        }
      }

      expect( player.listBombs.length ).toEqual( nbBombMax );

      expect( player.shouldSetBomb() ).toEqual( false );

      jasmine.clock().uninstall();

    });

    it( 'Peut détruire une bombe par son id ', () => {

      player.addBomb( bombe );

      player.delBombById( bombe.id );

      expect( player.listBombs.length ).toEqual( 0 );
    });

    it( 'Peut detruire toutes les bombes', () => {

      player.addBomb( bombe );

      const bombe2 = new Bomb( utils.guid(), player, player.roundPosition());


      player.addBomb( bombe2 );
      const bombe3 = new Bomb( utils.guid(), player, player.roundPosition());

      player.addBomb( bombe3 );
      player.delBombs();

      expect( player.listBombs.length ).toEqual( 0 );

    });

  });

  it( 'Peut tuer un player', () => {

    player.destroy();

    expect( player.alive ).toEqual( false );
  });

  /*it( 'Place le player au dessus de la maps à sa mort', () => {

   player.destroy();

   console.log( player.position );

   expect( player. position ).toEqual(deathCam);

   });*/

});
