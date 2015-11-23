'use strict';

const AssetsMock = require('testConfig/assetsMock.es6');
const utils = require('utils/utils');

const Block = require('inject!block/block.es6')({'assets/assets.es6': AssetsMock});

describe( 'Block' , function() {

  var block;

  beforeEach( function() {

    block = new Block( utils.guid(), { x: 1, z: 0} );
  });

  it( 'Peut créer un block temp a la bonne position', function() {
    expect( block.position ).toEqual( { x: 1, y: 0, z:0 } );
  });

  it( 'Peut créer un block ayant un shape et un block temp', function() {

    expect(block.meshs.shape).not.toBeUndefined();

    expect(block.meshs.colisionBlock).not.toBeUndefined();
  });
});
