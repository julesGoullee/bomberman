'use strict';

const Bombe = require('bomb/bomb');
const Player = require('player/player');
const utils = require('utils/utils');
var GameMock = require('testConfig/gameMock.es6');

describe( 'Bombe', () => {

  var player;
  var spawnPoint = {x :50, z:-65};
  var bombe;

  beforeEach( () =>  {

    player = new Player(0, 'testPlayer', spawnPoint, {'speed':0.45,'shoot':false,'bombs':2}, true, 0, GameMock.assets, GameMock.blockDim );

    bombe = new Bombe( utils.guid(), player, player.position,  GameMock.assets, GameMock.blockDim );
  });

  it( 'Peut creer une bombe a la bonne position', () =>  {

    var expectPosition = {
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
