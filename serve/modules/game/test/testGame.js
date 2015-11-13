"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );
var mock = require("../../test/mock.js");
var utils = require("../../utils/utils.js");
var config = require("../../../config/config.js");


describe("Game", function() {

    var _game;
    var socket1 ;
    var socket2 ;
    var stubOnP1 ;
    var stubOnP2 ;
    var callbackDisconnectP1;
    var callbackDisconnectP2;

    beforeEach( function() {
        socket1 = utils.clone( mock ).socket;
        socket2 = utils.clone( mock ).socket;

        stubOnP1 = sinon.stub(socket1, "on", function( event, callback ){
            if( event === "disconnect" ){

                callbackDisconnectP1 = callback;

            }
        });

        stubOnP2 = sinon.stub( socket2, "on", function( event, callback ) {

          if( event === "disconnect"){

                callbackDisconnectP2 = callback;

            }
        });

        _game = require( "../game.js" );
        _game.mockSocketHandler( mock.socketHandler );

        _game.launch();
    });

    it( "Peut creer une room quand premier player connect", function() {

        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: socket1 } );

        expect( _game.getRoomList().length ).to.equal( 1 );
    });

    it( "Peut creer une seul room si max player peer party connecter", function() {

        for ( var i = 0 ; i < config.maxPlayerPeerParty; i ++ ) {

            mock.socketHandlerOnConnectCallbacks[0]( { name: "j"+i , socket: utils.clone( mock ).socket, token : "t"+i } );
        }

        expect( _game.getRoomList().length ).to.equal( 1 );

    });

    it( "Peut creer deux rooms si PLUS max player peer room connecter", function() {

        for ( var i = 0 ; i <= config.maxPlayerPeerParty + 1 ; i ++ ) {

            mock.socketHandlerOnConnectCallbacks[0]( { name: "j" + i, socket: socket1, token : "t"+i } );
        }

        expect( _game.getRoomList().length ).to.equal( 2 );

    });

    it( "Ne Peux ajouter le meme player dans la meme partis", function() {


        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: mock.socket, token : "t1" } );
        assert( _game.getRoomList()[0].alreadyJoined("t1") );

        expect( _game.getRoomList().length ).to.equal( 1 );

    });

    it( "Ne peux ajouter un player dans une partie commencé", function(){
        var clock = sinon.useFakeTimers();

        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: socket1, token : "t1" } );
        mock.socketHandlerOnConnectCallbacks[0]( { name: "j2", socket: socket2, token : "t2" } );

        clock.tick( config.timerToStartParty );
        expect( _game.getRoomList().length ).to.equal( 1 );

        mock.socketHandlerOnConnectCallbacks[0]( { name: "j3", socket: utils.clone( mock ).socket, token : "t3" } );

        clock.tick( 1 );
        expect( _game.getRoomList().length ).to.equal( 2 );
        clock.restore();
    });

    it( "Peux supprimer une room si onDestroy callback", function(){

        var clock = sinon.useFakeTimers();

        mock.socketHandlerOnConnectCallbacks[0]( { name: "j1", socket: socket1, token : "t1" } );
        clock.tick( config.timerToStartParty/2 );

        expect( _game.getRoomList().length ).to.equal( 1 );

        callbackDisconnectP1();

        clock.tick( config.timerToStartParty/2 );

        expect( _game.getRoomList().length ).to.equal( 0 );

        clock.restore();
    });
});
