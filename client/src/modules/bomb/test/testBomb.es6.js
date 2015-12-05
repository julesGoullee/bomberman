'use strict';

require('testConfig/babylonMock.es6');

const utils = require('utils/utils');
const AssetsMock = require('testConfig/assetsMock.es6');

const Player = require('inject!player/player.es6')({'assets/assets.es6': AssetsMock});
const Obj = require('inject!object/object.es6')({'assets/assets.es6': AssetsMock});
const Bombe = require('inject!bomb/bomb.es6')({'object/object.es6': Obj});

const _sceneMock = {};

describe( 'Bombe', () => {

  let player;
  const spawnPoint = {x :50, z:-65};
  let bombe;

  beforeEach( () =>  {

    player = new Player(0, 'testPlayer', 'testUrl', spawnPoint, {'speed':0.45,'shoot':false,'bombs':2}, true, 0);

    bombe = new Bombe( utils.guid(), player, player.position, _sceneMock);
  });

  it( 'Peut creer une bombe a la bonne position', () =>  {

    let expectPosition = {
      x: spawnPoint.x,
      y: 0,
      z: spawnPoint.z
    };

    expect( expectPosition ).toEqual( bombe.position );
  });

  it( 'Peut détruire une bombe', () => {

    expect( bombe.exploded ).toEqual( false );

    bombe.destroy();

    expect( bombe.exploded ).toEqual( true );
  });
});
