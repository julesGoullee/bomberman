'use strict';

const Maps = require('maps/maps');
const MenuPlayers = require('menuPlayers/menuPlayers');
const GameMock = require('testConfig/gameMock.es6');

describe( 'PowerUp', () => {

  var maps;

  beforeEach ( () => {

    maps = new Maps( GameMock.assets, GameMock.blockDim, new MenuPlayers() );

  });

});
