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

    beforeEach(function(){

        maps = new Maps();

        maps.create();
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

});