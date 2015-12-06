'use strict';

var config = require('./../../../config/config.js');

var utils = require('../../utils/utils.js');
const MockSocket = require('../../socketHandler/test/mockSocket');
var Room = require('../room.js' );


describe( 'Room', () => {

  var _room;
  var clock;
  var _socket1 ;
  var _socket2 ;
  var spyEmitP1 ;
  var spyEmitP2 ;

  beforeEach(() => {

    clock = sinon.useFakeTimers();
    _socket1 = new MockSocket('1');
    _socket2 = new MockSocket('2');
    spyEmitP1 = sinon.spy( _socket1, 'emit' );
    spyEmitP2 = sinon.spy( _socket2, 'emit' );
    _room =  new Room();
  });

  afterEach(() => {

    clock.restore();
  });

  describe('Timer', () => {

    it('Ne peut démarrer une partie sans player', () => {
      clock.tick( config.timerToStartParty );
      expect( _room.timerToStart ).to.equal( config.timerToStartParty - 1000 );
      expect( _room.isStartFrom ).to.equal( false );

    });

    it('Ne peut démarrer une partie avec un player', () => {
      _room.addPlayer( _socket1 );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart).to.equal( config.limitToCheckNumberPlayer );

      expect( _room.isStartFrom ).to.equal( false );

    });

    it('Peux démarrer une partie avec deux player', () => {

      _room.addPlayer( _socket1 );
      _room.addPlayer( _socket2 );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( 0 );

      expect( _room.isStartFrom ).to.equal( config.timerToPlaying );

    });

    it('Peux stoper le decompte puis le relancer', () => {

      _room.addPlayer( _socket1 );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( config.limitToCheckNumberPlayer  );

      _room.addPlayer( _socket2 );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart).to.equal( 0 );

      expect( _room.isStartFrom ).to.equal( config.timerToPlaying );

    });

    it('Peux stoper le decompte puis le relancer apres deconnection d\'un player', () => {

      _room.addPlayer( _socket1 );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart).to.equal( config.limitToCheckNumberPlayer  );

      _room.addPlayer( _socket2 );

      clock.tick( 2000 );

      _socket1.callbackDisconnect();

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( config.limitToCheckNumberPlayer );

      _room.addPlayer( (new MockSocket('3')) );

      clock.tick( config.timerToStartParty );

      expect( _room.timerToStart ).to.equal( 0 );

      expect( _room.isStartFrom ).to.equal( config.timerToPlaying );

    });

    it('Peux executer les callbacks onDestruction si plus personne', () => {

      let callbackDestroy = { call:() => {} };
      let spyDestroy = sinon.spy( callbackDestroy, 'call' );
      _room.onDestroy(callbackDestroy.call);
      _room.addPlayer( _socket1 );
      _socket1.callbackDisconnect();

      assert(spyDestroy.calledWith( _room ));
    });
  });

  it('Peut ajouter un player dans une room à la bonne position', () => {
    _room.addPlayer( _socket1 );
    expect( _room.players.length ).to.equal( 1 );

    expect( _room.players[0].position.x ).to.equal( _room.playersSpawnPoint[0].x );
    expect( _room.players[0].position.z ).to.equal( _room.playersSpawnPoint[0].z );
  });

  it('Peut notifier la map', () => {
    _room.addPlayer( _socket1 );
    expect(spyEmitP1.args[0][0]).to.equal('map');
    let jsonMap = spyEmitP1.args[0][1];
    expect(jsonMap.players.length).to.equal(1);
    expect(jsonMap.players[0].isMine).to.equal(true);
    expect(jsonMap.players[0].id).to.equal('1');
    expect(jsonMap.players[0].kills).to.equal(0);
    expect(jsonMap.players[0].alive).to.equal(true);
    expect(jsonMap.players[0].powerUp).to.deep.equal({ speed: 0.45, shoot: false, bombs: 2 });
    expect(jsonMap.players[0].name).to.equal(_socket1.request.user.fb.username);
    expect(jsonMap.players[0].picture).to.equal(_socket1.request.user.fb.photo.url);
    expect(jsonMap.blockTemp.length).to.equal(135);

  });

  describe( 'In game', () => {
  
    beforeEach(() => {
  
      _room.addPlayer( _socket1 );
  
      _room.addPlayer( _socket2 );
  
      clock.tick( config.timerToStartParty );
  
    });
  
    it('Peut notifier les players que la partie commence', () => {
      expect(spyEmitP1.args[2][0]).to.equal('ready');
      expect(spyEmitP1.args[2][1]).to.deep.equal({ partyTimer : config.timerToPlaying });
    });
  
    it('Peut notifier que la partie est finis suite a une explosion', () => {
  
      let tempId = utils.guid();
      _socket2.callbackSetBomb( tempId );
  
      clock.tick( config.bombCountDown );
  
      expect( spyEmitP1.args[3][0]).to.equal( 'setBomb');
  
      expect( spyEmitP1.args[5][0]).to.deep.equal('endPartie');
      expect( spyEmitP2.args[4][0]).to.deep.equal('endPartie');
  
    });
  
    it('notifier a tout les players la fin de la parti après deconnection', () => {
      _socket1.callbackDisconnect();
      expect( spyEmitP2.args[3][0]).to.deep.equal('endPartie');
  
    });
  
    it('notifier a tout les player la fin de la parti si le temps est écoulé', () => {
      clock.tick( config.timerToPlaying );
      expect(spyEmitP1.args[3][0]).to.equal('endPartie');
    });
  
    it('Peut cancel le timer de fin de partie si mort ou deconnect avant', () => {
      let tempId = utils.guid();
      _socket2.callbackSetBomb( tempId );
  
      clock.tick( config.bombCountDown );
  
      expect( spyEmitP1.args[5][0]).to.equal('endPartie');
  
      clock.tick( config.timerToPlaying );
      expect( spyEmitP1.args[6] && spyEmitP1.args[6][0]).not.to.equal( 'endPartie' );
  
    });
  
    it('Peut ajouter deux player a la bonne position et notifier le profil de l\'un a l\'autre', () => {
  
      expect(spyEmitP2.args[0][0]).to.equal('map');
      let jsonMap = spyEmitP2.args[0][1];
      expect(jsonMap.players.length).to.equal(2);
      
      //j2 reçoit la carte contenant les anciens players
        //P1
      expect(jsonMap.players[0].id).to.equal('1');
      expect(jsonMap.players[0].name).to.equal('testPlayer_1');
      expect(jsonMap.players[0].kills).to.equal(0);
      expect(jsonMap.players[0].alive).to.equal(true);
      expect(jsonMap.players[0].powerUp).to.deep.equal({ speed: 0.45, shoot: false, bombs: 2 });
      expect(jsonMap.players[0].name).to.equal(_socket1.request.user.fb.username);
      expect(jsonMap.players[0].picture).to.equal(_socket1.request.user.fb.photo.url);
        
        //ME (P2)
      expect(jsonMap.players[1].isMine).to.equal(true);
      expect(jsonMap.players[1].id).to.equal('2');
      expect(jsonMap.players[1].name).to.equal('testPlayer_2');
      expect(jsonMap.players[1].kills).to.equal(0);
      expect(jsonMap.players[1].alive).to.equal(true);
      expect(jsonMap.players[1].powerUp).to.deep.equal({ speed: 0.45, shoot: false, bombs: 2 });
      expect(jsonMap.players[1].name).to.equal(_socket2.request.user.fb.username);
      expect(jsonMap.players[1].picture).to.equal(_socket2.request.user.fb.photo.url);
      
      expect(jsonMap.blockTemp.length).to.equal(135);
  
      //J1 reçoit un event avec le nouveau player
      expect(spyEmitP1.args[1][0]).to.equal('newPlayer');
      expect(spyEmitP1.args[1][1].id).to.equal('2');
      expect(spyEmitP1.args[1][1].name).to.equal('testPlayer_2');      
      expect(spyEmitP1.args[1][1].kills).to.equal(0);
      expect(spyEmitP1.args[1][1].alive).to.equal(true);
      expect(spyEmitP1.args[1][1].powerUp).to.deep.equal({ speed: 0.45, shoot: false, bombs: 2 });
      expect(spyEmitP1.args[1][1].name).to.equal(_socket2.request.user.fb.username);
      expect(spyEmitP1.args[1][1].picture).to.equal(_socket2.request.user.fb.photo.url);
      
  
    });
  
    it('Peut ajouter deux player, deconnecter le premier et ajouter un troisieme 3 a la place du 1', () => {
  
      _socket1.callbackDisconnect();
  
      expect( _room.players[0].alive ).to.equal( false );
      let socket3 = new MockSocket('3');

      _room.addPlayer( socket3 );
  
      expect( _room.players[2].name ).to.equal( 'testPlayer_3');
  
      expect( _room.players[2].position.x ).to.equal( _room.playersSpawnPoint[0].x );
      expect( _room.players[2].position.z ).to.equal( _room.playersSpawnPoint[0].z );
  
      expect( _room.player);
    });
  
    it('Peut déplacer le player 1 et notifier au deuxieme', () => {
  
      _socket1.callbackOnMyPosition( _room.players[0].position );
  
      assert( spyEmitP2.calledWith( 'onPlayerMove',
        { id: _room.players[0].id, position: _room.players[0].position } ) );
    });
  
    it('Peut déplacer le player 2 et notifier le 1', () => {
  
      let newPosition = {
        x : ( _room.players[1].position.x + 10 ),
        z: ( _room.players[1].position.z + 10)
      };
  
      _socket2.callbackOnMyPosition( newPosition );
  
      assert( spyEmitP1.calledWith( 'onPlayerMove',
        { id: _room.players[1].id, position: newPosition } ) );
    });
  
    it('Peut suprimmer le player 1 et notifier le deuxieme a la deconnection', () => {
  
      let idP1 = _room.players[0].id;
  
      _socket1.callbackDisconnect();
  
      expect( _room.players[0].alive ).to.equal( false );
  
      assert( spyEmitP2.calledWith( 'playerDisconnect',
        { id: idP1 } ) );
    });
  
    it('Peut suprimmer le deuxieme player et notifier le premier a la deconnection', () => {
  
      let idP2 = _room.players[1].id;
  
      _socket2.callbackDisconnect();
  
      expect( _room.players[1].alive ).to.equal( false );
  
      assert( spyEmitP1.calledWith( 'playerDisconnect',
        { id: idP2 } ) );
    });
  
  
    it('Player deux peux poser une bombe et la notifier au premier player', () => {
  
      let tempId = utils.guid();
      _socket2.callbackSetBomb( tempId );
  
      expect( spyEmitP1.args[3][0]).to.equal( 'setBomb');
      expect( spyEmitP1.args[3][1]).to.deep.equal({
        ownerId: _room.players[1].id,
        bombeId : _room.players[1].listBombs[0].id,
        position: {
          x:_room.players[1].listBombs[0].position.x,
          z: _room.players[1].listBombs[0].position.z
  
        }
      });
  
    });
  
    it('Player 1 peut poser une bombe et etre notifier de son id permanent', () => {
  
      let tempId = utils.guid();
      _socket1.callbackSetBomb( tempId );
  
      expect( spyEmitP1.args[3][0]).to.equal( 'setPermanentBombId');
      expect( spyEmitP1.args[3][1]).to.deep.equal({
        tempId: tempId,
        id : _room.players[0].listBombs[0].id
      });
  
    });
  
    it('Player 1 peut poser une bombe et la notifier au deuxieme player', () => {
  
      let tempId = utils.guid();
      _socket1.callbackSetBomb( tempId );
  
      expect( spyEmitP2.args[2][0]).to.equal( 'setBomb');
      expect( spyEmitP2.args[2][1]).to.deep.equal({
        ownerId: _room.players[0].id,
        bombeId : _room.players[0].listBombs[0].id,
        position: {
          x:_room.players[0].listBombs[0].position.x,
          z: _room.players[0].listBombs[0].position.z
  
        }
      });
  
    });
  
    it('Bombe Player1 explose et les degats sont notifié a tout le monde', () => {
      let clock = sinon.useFakeTimers();
  
      let tempId = utils.guid();
      _socket1.callbackSetBomb( tempId );
  
      let bombeId = _room.players[0].listBombs[0].id;
  
      clock.tick( config.bombCountDown );
  
      expect( spyEmitP2.args[3][0]).to.equal( 'explosion');
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
