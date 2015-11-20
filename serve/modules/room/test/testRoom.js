"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );
var config = require("./../../../config/config.js");

var utils = require("../../utils/utils.js");
var mock = utils.clone( require("../../test/mock.js") );
var Room = require("../room.js" );


describe( "Room", function() {

  var _room;
  var clock;
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

    clock = sinon.useFakeTimers();

    socket1 = utils.clone( mock ).socket;
    socket2 = utils.clone( mock ).socket;

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
  });

  afterEach(function() {

    clock.restore();
  });

  describe("Timer", function(){

    it("Ne peut démarrer une partie sans player", function(){
      clock.tick( config.timerToStartParty );
      expect( _room.timerToStart ).to.equal( config.timerToStartParty - 1000 );
      expect( _room.isStartFrom ).to.equal( false );

    });

    it("Ne peut démarrer une partie avec un player", function(){
      _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart).to.equal( config.limitToCheckNumberPlayer );

      expect( _room.isStartFrom ).to.equal( false );

    });

    it("Peux démarrer une partie avec deux player", function(){

      _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );
      _room.addPlayer( { socket : socket2, name: "player2", token: "t2" } );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( 0 );

      expect( _room.isStartFrom ).to.equal( config.timerToPlaying );

    });

    it("Peux stoper le decompte puis le relancer", function(){

      _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( config.limitToCheckNumberPlayer  );

      _room.addPlayer( { socket : socket2, name: "player2", token: "t2" } );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart).to.equal( 0 );

      expect( _room.isStartFrom ).to.equal( config.timerToPlaying );

    });

    it("Peux stoper le decompte puis le relancer apres deconnection d'un player", function(){

      _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart).to.equal( config.limitToCheckNumberPlayer  );

      _room.addPlayer( { socket : socket2, name: "player2", token: "t2" } );

      clock.tick( 2000 );

      callbackDisconnectP1();

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( config.limitToCheckNumberPlayer );

      _room.addPlayer( { socket : socket2, name: "player2", token: "t2" } );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( 0 );

      expect( _room.isStartFrom ).to.equal( config.timerToPlaying );

    });

    it("Peux executer les callbacks onDestruction si plus personne", function(){

      var callbackDestroy = { call:function(){} };
      var spyDestroy = sinon.spy( callbackDestroy, "call" );
      _room.onDestroy(callbackDestroy.call);
      _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );
      callbackDisconnectP1();

      assert(spyDestroy.calledWith( _room ));
    });
  });

  it( "Peut ajouter un player dans une room à la bonne position", function () {
    _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );
    expect( _room.players.length ).to.equal( 1 );

    expect( _room.players[0].position.x ).to.equal( _room.playersSpawnPoint[0].x );
    expect( _room.players[0].position.z ).to.equal( _room.playersSpawnPoint[0].z );
  });

  it( "Peut notifier la map au player", function(){
    _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );
    expect(spyEmitP1.args[0][0]).to.equal("map");
    var jsonMap = spyEmitP1.args[0][1];
    expect(jsonMap.players.length).to.equal(1);
    expect(jsonMap.players[0].isMine).to.equal(true);
    expect(jsonMap.blockTemp.length).to.equal(135);

  });

  describe( "deuxieme player", function() {

    beforeEach(function () {

      _room.addPlayer( { socket : socket1, name: "player1" , token: "t1"} );

      _room.addPlayer( { socket : socket2, name: "player2", token: "t2" } );

      clock.tick( config.timerToStartParty );

    });

    it("Peut notifier les players que la partie commence", function(){
      expect(spyEmitP1.args[2][0]).to.equal("ready");
      expect(spyEmitP1.args[2][1]).to.deep.equal({ partyTimer : config.timerToPlaying });
    });

    it("Peut notifier que la partie est finis suite a une explosion", function(){

      var tempId = utils.guid();
      callbackSetBombP2( tempId );

      clock.tick( config.bombCountDown );

      expect( spyEmitP1.args[3][0]).to.equal( "setBomb");

      expect( spyEmitP1.args[5][0]).to.deep.equal("endPartie");
      expect( spyEmitP2.args[4][0]).to.deep.equal("endPartie");

    });

    it("notifier a tout les players la fin de la parti après deconnection", function(){
      callbackDisconnectP1();
      expect( spyEmitP2.args[3][0]).to.deep.equal("endPartie");

    });

    it("notifier a tout les player la fin de la parti si le temps est écoulé", function(){
      clock.tick( config.timerToPlaying );
      expect(spyEmitP1.args[3][0]).to.equal("endPartie");
    });

    it("Peut cancel le timer de fin de partie si mort ou deconnect avant", function(){
      var tempId = utils.guid();
      callbackSetBombP2( tempId );

      clock.tick( config.bombCountDown );

      expect( spyEmitP1.args[5][0]).to.equal("endPartie");

      clock.tick( config.timerToPlaying );
      expect( spyEmitP1.args[6] && spyEmitP1.args[6][0]).not.to.equal( "endPartie" );

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

      expect( _room.player);
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


    it( "Player deux peux poser une bombe et la notifier au premier player", function(){

      var tempId = utils.guid();
      callbackSetBombP2( tempId );

      expect( spyEmitP1.args[3][0]).to.equal( "setBomb");
      expect( spyEmitP1.args[3][1]).to.deep.equal({
        ownerId: _room.players[1].id,
        bombeId : _room.players[1].listBombs[0].id,
        position: {
          x:_room.players[1].listBombs[0].position.x,
          z: _room.players[1].listBombs[0].position.z

        }
      });

    });

    it( "Player 1 peut poser une bombe et etre notifier de son id permanent", function(){

      var tempId = utils.guid();
      callbackSetBombP1( tempId );

      expect( spyEmitP1.args[3][0]).to.equal( "setPermanentBombId");
      expect( spyEmitP1.args[3][1]).to.deep.equal({
        tempId: tempId,
        id : _room.players[0].listBombs[0].id
      });

    });

    it( "Player 1 peut poser une bombe et la notifier au deuxieme player", function(){

      var tempId = utils.guid();
      callbackSetBombP1( tempId );

      expect( spyEmitP2.args[2][0]).to.equal( "setBomb");
      expect( spyEmitP2.args[2][1]).to.deep.equal({
        ownerId: _room.players[0].id,
        bombeId : _room.players[0].listBombs[0].id,
        position: {
          x:_room.players[0].listBombs[0].position.x,
          z: _room.players[0].listBombs[0].position.z

        }
      });

    });

    it( "Bombe Player1 explose et les degats sont notifié a tout le monde", function(){
      var clock = sinon.useFakeTimers();

      var tempId = utils.guid();
      callbackSetBombP1( tempId );

      var bombeId = _room.players[0].listBombs[0].id;

      clock.tick( config.bombCountDown );

      expect( spyEmitP2.args[3][0]).to.equal( "explosion");
      expect( spyEmitP2.args[3][1]).to.deep.equal({
        ownerId: _room.players[0].id,
        bombesExplodedId : [ bombeId ],
        playersIdKilled: [ _room.players[0].id ],
        blocksIdDestroy: []
      });

      clock.restore();

    });

    //TODO test multiplayer mort && block
  });

});
