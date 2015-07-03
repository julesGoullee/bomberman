"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
var mock = require("../../../test/mock.js");
var config = require("../../../config/config.js");


describe("Game", function() {

    var _game;

    beforeEach( function() {

        _game = require( "../game.js" );

        _game.mockSocketHandler( mock.socketHandler );

        _game.launch();
    });

    it( "Peut creer une room quand premier player connect", function() {

        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: mock.socket } );

        expect( _game.getRoomList().length ).to.equal( 1 );
    });

    it( "Peut creer une seul room si max player peer party conencter", function() {

        for ( var i = 0 ; i < config.maxPlayerPeerParty; i ++ ) {

            mock.socketHandlerOnConnectCallbacks[0]( { name: "j"+i , socket: mock.socket, token : "t"+i } );
        }

        expect( _game.getRoomList().length ).to.equal( 1 );

    });

    it( "Peut creer deux rooms si PLUS max player peer room connecter", function() {

        for ( var i = 0 ; i <= config.maxPlayerPeerParty ; i ++ ) {

            mock.socketHandlerOnConnectCallbacks[0]( { name: "j" + i, socket: mock.socket, token : "t"+i } );
        }

        expect( _game.getRoomList().length ).to.equal( 2 );

    });

    it( "Ne Peux ajouter le meme player dans la meme partis", function() {


        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: mock.socket, token : "t2" } );
        assert( _game.getRoomList()[0].alreadyJoined("t2") );

        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: mock.socket, token : "t2" } );
        expect( _game.getRoomList().length ).to.equal( 2 );

    });

});