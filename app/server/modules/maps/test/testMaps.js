"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );

var Maps = require("./../maps.js");

describe( "Maps", function() {

    var maps;

    //var player;

    //var spawnPoint = {x:40, z:-64};

    beforeEach(function(){

        maps = new Maps();

        maps.create();

        //player = new Player(0, "testPlayer", spawnPoint , gameMock.assets, gameMock.blockDim );

    });

    describe( "Temps blocks methods", function() {

        it( "Peut remplir la maps de block en laissant les angles sans block temp", function () {

            expect(maps.getBlocks().length).to.equal(135);
        });

        it( "Peut suprimmer tout les blocks" , function () {

            maps.delBlocks();

            expect( maps.getBlocks().length).to.equal( 0 );
        });

        it( "Peut recuperer un block par sa position", function () {

            var position = { x: -24, y: 0, z: -64 };

            expect( maps.getBlockByPosition( position ).position ).to.deep.equal( position );
        });

        it( "Peut suprimmer un block par son id", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlockById( block.id )).to.equal( true );

        });

        it( "Peut supprimer un block par sa position", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlocksByPosition( { x: -24, y: 0, z: -64 } )).to.equal( true );

            expect( maps.getBlockByPosition( block.position )).to.equal( null );

        });

        it ( "Peut supprimer un bloc et le restaurer", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlocksByPosition( { x: -24, y: 0, z: -64 } )).to.equal( true );

            expect( maps.getBlockByPosition( block.position )).to.equal( null );

            expect( maps.getBlocks().length).to.equal( 134 );

            maps.restoreBlock();

            expect( maps.getBlocks().length).to.equal( 135 );

        });

        it ( "Peut supprimer plusieurs blocs et les restaurer", function () {

            expect( maps.delBlocksByPosition( {x: -24, y: 0, z: -64} )).to.equal ( true );

            expect( maps.delBlocksByPosition( {x: -16, y: 0, z: -64} )).to.equal ( true );

            expect( maps.delBlocksByPosition( {x: -8, y: 0, z: -64} )).to.equal ( true );

            expect( maps.getBlocks().length).to.equal( 132 );

            maps.restoreBlock();

            expect( maps.getBlocks().length).to.equal( 135 );

        });

    });

    //describe( "Player methods", function () {
    //
    //    it( "Peut ajouter et recuperer player", function () {
    //
    //        maps.addObject( player );
    //
    //        expect(maps.getPlayers().length ).toEqual( 1 );
    //
    //    });
    //
    //    it( "Peut récuperer les players alive", function () {
    //
    //        maps.addObject( player );
    //
    //        var player2 = new Player(0, "testPlayer", spawnPoint , gameMock.assets, gameMock.blockDim );
    //
    //        maps.addObject( player2 );
    //
    //        var tab1 = maps.getPlayersAlive();
    //
    //        player2.alive = false;
    //
    //        var tab2 = maps.getPlayersAlive();
    //
    //        expect(tab1).not.toEqual(tab2);
    //
    //    });
    //
    //    it( "Peut ajouter un player et un block et récupérer uniquement le player", function () {
    //
    //        var block = new Block( gameMock.assets, { x: 0, z: 0 } );
    //
    //        maps.addObject( player );
    //
    //        maps.addObject( block );
    //
    //        expect( maps.getPlayers().length ).toEqual( 1 );
    //
    //    });
    //
    //    it( "Peut recuperer un player avec son ID", function () {
    //
    //        maps.addObject( player );
    //
    //        expect( maps.getPlayerById( player.id ) ).toEqual( player );
    //
    //    });
    //
    //    it( "Peut recuperer un player avec sa position", function () {
    //
    //        maps.addObject( player );
    //
    //        expect( maps.getPlayerByPosition( player.roundPosition() ) ).toEqual( player );
    //
    //    });
    //
    //    it( "Peut supprimer tous les players", function () {
    //
    //        var player2 = new Player(2, "testPlayer", spawnPoint , gameMock.assets, gameMock.blockDim );
    //
    //        maps.addObject( player );
    //
    //        maps.addObject( player2 );
    //
    //        maps.delPlayers();
    //
    //        expect( maps.getPlayers().length ).toEqual( 0 );
    //
    //    } )
    //
    //});
});