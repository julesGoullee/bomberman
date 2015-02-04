"use strict";

var expect = require("expect.js");
var mock = require("../../../test/mock.js");
var config = require("../../../config/config.js");


describe("Gamee", function(){

    var _game;

    beforeEach( function() {

        _game = require( "../game.js" );
        _game.mockSocketHandler(mock.socketHandler);
        _game.launch();
    });

    it( "Peut creer une room quand premier player connect", function() {

        mock.socketHandlerOnConnectCallbacks[0]( mock.socket );

        expect( _game.getRoomList().length ).to.equal( 1 );
    });

    it( "Peut creer une seul room si max player peer party conencter", function() {

        for ( var i = 0 ; i < config.maxPlayerPeerParty; i ++ ) {

            mock.socketHandlerOnConnectCallbacks[0]( mock.socket );
        }

        expect(_game.getRoomList().length).to.equal( 1 );

    });

    it( "Peut creer deux rooms si PLUS max player peer room conencter", function() {

        for ( var i = 0 ; i <= config.maxPlayerPeerParty ; i ++ ) {

            mock.socketHandlerOnConnectCallbacks[0]( mock.socket );
        }

        expect( _game.getRoomList().length ).to.equal( 2 );

    });

});