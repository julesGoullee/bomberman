"use strict";

var utils = require("../../utils/utils.js");
var Player = require("./../player.js");
var Bombe = require("./../../bomb/bomb.js");

describe( "Player", () => {

  var player;

  var spawnPoint = { x:48, z:-64};

  var mockRoom = {
    playersSpawnPoint: {
      getFreePosition: () => {}
    }
  };

  sinon.stub(mockRoom.playersSpawnPoint,"getFreePosition", () => {
    return spawnPoint;
  });

  beforeEach( () => {

    var mockSocket = {};
    var mockUser = {
      _id: {
        toString: () => {
          return "idP1";
        }
      },
      fb: {
        username: "testPlayer"
      }
    };

    player = new Player( mockSocket, mockUser, mockRoom );

  });

  it( "Peut créer un player a la bonne position", () =>{

    var expectPosition = { x: spawnPoint.x, z: spawnPoint.z};

    expect( expectPosition).to.deep.equal( player.position );
  });

  it( "Peut recuperer la position arrondie en dessus", () => {

    player.position.x = 26.456345;

    player.position.z = -10.557235;

    var expectedPosition = {
      x: 24,
      z: -8
    };

    expect( player.roundPosition() ).to.deep.equal( expectedPosition );
  });

  it( "Peut recuperer la position arrondie au dessus", () => {

    player.position.x = 28.456345;

    player.position.z = -13.557235;

    var expectedPosition = {
      x: 32,
      z: -16
    };

    expect( player.roundPosition() ).to.deep.equal( expectedPosition );
  });

  describe( "Bombe", () => {

    var bomb;

    beforeEach( () => {

      bomb = new Bombe( utils.guid(), player, player.roundPosition() );
    });

    it( "Peut ajouter une bombe", () => {

      player.addBomb( bomb );

      expect( player.listBombs.length ).to.equal( 1 );

      expect( player.totalNbBombe ).to.equal( 1 );

    });

    it( "Peut poser une bombe a la position du player", () => {

      player.addBomb( bomb );

      expect( player.listBombs[0].position.x ).to.equal( player.position.x);
      expect( player.listBombs[0].position.z ).to.equal( player.position.z);
    });

    it( "Peut poser une bombe a la position arrondie au dessus du player", () => {

      player.position.x = 28.456345;

      player.position.z = -13.557235;

      bomb = new Bombe( utils.guid(), player, player.roundPosition() );

      player.addBomb( bomb );

      expect( player.listBombs[0].position.x ).to.equal( 32 );
      expect( player.listBombs[0].position.z).to.equal( -16 );
    });

    it( "Peut poser une bombe a la position arrondie en dessous du player", () => {

      player.position.x = 26.456345;

      player.position.z = -10.557235;

      bomb = new Bombe( utils.guid(), player, player.roundPosition() );

      player.addBomb( bomb );

      expect( player.listBombs[0].position.x ).to.equal( 24 );
      expect( player.listBombs[0].position.z ).to.equal( -8 );
    });

    it( "Peut dire quand le nombre de bombe max est atteind", () => {

      var nbBombeMax = player.powerUp.bombs;

      for ( var i = 0; i < nbBombeMax; i++ ) {
        player.addBomb( bomb );
      }

      expect( player.listBombs.length ).to.equal( nbBombeMax );

      expect( player.shouldSetBomb() ).to.equal( false );

    });

    it( "Peut détruire une bombe par son id ", () => {

      player.addBomb( bomb );

      player.delBombById( bomb.id );

      expect( player.listBombs.length ).to.equal( 0 );
    });

    it( "Peut detruire toutes les bombes", () => {

      player.addBomb( bomb );

      var bomb2 = new Bombe( utils.guid(), player, player.roundPosition() );

      player.addBomb( bomb2 );
      var bomb3 = new Bombe( utils.guid(), player, player.roundPosition() );

      player.addBomb( bomb3 );
      player.delBombs();

      expect( player.listBombs.length ).to.equal( 0 );

    });

  });

  it( "Peut tuer un player", () =>{

    player.destroy();

    expect( player.alive ).to.equal( false );
  });


  //todo test myPlayer

});