"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );
var config = require("./../../../config/config.js");

var utils = require("../../utils/utils.js");
var mock = utils.clone( require("../../../test/mock.js") );
var Room = require("../room.js" );


describe( "Room", function() {

    var _room;
    var socket1 ;
    var socket2 ;
    var spyEmitP1 ;
    var spyEmitP2 ;
    var stubOnP1 ;
    var stubOnP2 ;
    var callbackOnMyPositionP1;
    var callbackOnMyPositionP2;
    var callbackSetBombP1;
    var callbackSetBombP2;
    var callbackDisconnectP1;
    var callbackDisconnectP2;

    beforeEach(function () {

        socket1 = utils.clone( mock).socket;
        socket2 = utils.clone( mock).socket;

        stubOnP1 = sinon.stub(socket1, "on", function( event, callback ){

            if( event === "myPosition" ){

                callbackOnMyPositionP1 = callback;

            }else if( event === "disconnect" ){

                callbackDisconnectP1 = callback;

            }else if( event === "setBomb"){

                callbackSetBombP1 = callback;
            }
        });

        stubOnP2 = sinon.stub( socket2, "on", function( event, callback ) {

            if( event === "myPosition" ){

                callbackOnMyPositionP2 = callback;

            }else if( event === "disconnect"){

                callbackDisconnectP2 = callback;

            }else if( event === "setBomb"){

                callbackSetBombP2 = callback;
            }
        });


        spyEmitP1 = sinon.spy( socket1, "emit" );
        spyEmitP2 = sinon.spy( socket2, "emit" );
        _room =  new Room();
        _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );


    });

    it( "Peut ajouter un player dans une room à la bonne position", function () {

        expect( _room.players.length ).to.equal( 1 );

        expect( _room.players[0].position.x ).to.equal( _room.playersSpawnPoint[0].x );
        expect( _room.players[0].position.z ).to.equal( _room.playersSpawnPoint[0].z );
    });

    it( "Peut notifier la map au player", function(){

        expect(spyEmitP1.args[0][0]).to.equal("map");
        var jsonMap = spyEmitP1.args[0][1];
        expect(jsonMap.players.length).to.equal(1);
        expect(jsonMap.players[0].isMine).to.equal(true);
        expect(jsonMap.blockTemp.length).to.equal(135);

    });

    describe( "deuxieme player", function() {

        beforeEach(function () {

            _room.addPlayer( { socket : socket2, name: "player2", token: "t2" } );

        });

        it( "Peut ajouter deux player a la bonne position et notifier la presence de l'un a l'autre", function(){

            expect(spyEmitP2.args[0][0]).to.equal("map");
            var jsonMap = spyEmitP2.args[0][1];
            expect(jsonMap.players.length).to.equal(2);

            expect(jsonMap.players[0].isMine).to.equal(undefined);
            expect(jsonMap.players[0].name).to.equal("player1");
            expect(jsonMap.players[1].isMine).to.equal(true);
            expect(jsonMap.blockTemp.length).to.equal(135);


            expect(spyEmitP1.args[1][0]).to.equal("newPlayer");
            expect(spyEmitP1.args[1][1].name).to.equal("player2");

        });

        it( "Peut ajouter deux player, deconnecter le premier et ajouter un troisieme 3", function(){

            callbackDisconnectP1();

            expect( _room.players[0].alive ).to.equal( false );
            var socket3 = utils.clone( mock.socket );

            _room.addPlayer( { socket : socket3, name: "player3" , token: "t2"} );

            expect( _room.players[2].name ).to.equal( "player3");

            expect( _room.players[2].position.x ).to.equal( _room.playersSpawnPoint[2].x );
            expect( _room.players[2].position.z ).to.equal( _room.playersSpawnPoint[2].z );

            expect( _room.player)
        });

        it( "Peut déplacer le player 1 et notifier au deuxieme", function() {

            callbackOnMyPositionP1( _room.players[0].position );

            assert( spyEmitP2.calledWith( "onPlayerMove",
                { id: _room.players[0].id, position: _room.players[0].position } ) );
        });

        it( "Peut déplacer le player 2 et notifier le 1", function() {

            var newPosition = {
                x : ( _room.players[1].position.x + 10 ),
                z: ( _room.players[1].position.z + 10)
            };

            callbackOnMyPositionP2( newPosition );

            assert( spyEmitP1.calledWith( "onPlayerMove",
                { id: _room.players[1].id, position: newPosition } ) );
        });

        it( "Peut suprimmer le player 1 et notifier le deuxieme a la deconnection", function() {

            var idP1 = _room.players[0].id;

            callbackDisconnectP1();

            expect( _room.players[0].alive ).to.equal( false );

            assert( spyEmitP2.calledWith( "playerDisconnect",
                { id: idP1 } ) );
        });

        it( "Peut suprimmer le deuxieme player et notifier le premier a la deconnection", function() {

            var idP2 = _room.players[1].id;

            callbackDisconnectP2();

            expect( _room.players[1].alive ).to.equal( false );

            assert( spyEmitP1.calledWith( "playerDisconnect",
                { id: idP2 } ) );
        });

        it("Player deux peux poser une bombe et la notifier au premier player", function(){

            callbackSetBombP2();

            expect( spyEmitP1.args[2][0]).to.equal( "setBomb");
            expect( spyEmitP1.args[2][1]).to.deep.equal({
                playerId: _room.players[1].id,
                bombeId : _room.players[1].listBombs[0].id,
                position: {
                    x:_room.players[1].listBombs[0].position.x,
                    z: _room.players[1].listBombs[0].position.z

                }
            });

        });

        it("Player 1 peut poser une bombe et la notifier au deuxieme player", function(){

            callbackSetBombP1();

            expect( spyEmitP2.args[1][0]).to.equal( "setBomb");
            expect( spyEmitP2.args[1][1]).to.deep.equal({
                playerId: _room.players[0].id,
                bombeId : _room.players[0].listBombs[0].id,
                position: {
                    x:_room.players[0].listBombs[0].position.x,
                    z: _room.players[0].listBombs[0].position.z

                }
            });

        });

        it("Bombe Player1 explose et les degats sont notifié a tout le monde", function(){
            var clock = sinon.useFakeTimers();

            callbackSetBombP1();
            var bombeId = _room.players[0].listBombs[0].id;

            clock.tick( config.bombCountDown );

            expect( spyEmitP2.args[2][0]).to.equal( "explosion");
            expect( spyEmitP2.args[2][1]).to.deep.equal({
                owner: _room.players[0].id,
                bombeId : bombeId,
                playersIdKilled: [ _room.players[0].id ],
                blocksIdDestroy: []
            });

            clock.restore();

        });

        //TODO test multiplayer mort && block
    });

});