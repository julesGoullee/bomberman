'use strict';

const config = require('../../../config/config');

const MockSocketHandler = require('../../socketHandler/test/mockSocketHandler');
const MockSocket = require('../../socketHandler/test/mockSocket');

const Game = require('../game.es6');

describe('Game', () => {
  var _clock;
  var _game;
  var _socket1 ;
  var _socket2 ;

  beforeEach( () => {
    new MockSocketHandler();
    _clock = sinon.useFakeTimers();
    _game = new Game({});
    _socket1 = new MockSocket('1');
    _socket2 = new MockSocket('2');
  });

  it('Peut creer une room quand premier player connect', () => {

    MockSocketHandler.onConnectCallbacks[0]( _socket1 );

    expect( _game.getRoomList().length ).to.equal( 1 );
  });

  it('Peut creer une seul room si max player peer party connecter', () => {

    for ( var i = 0 ; i < config.maxPlayerPeerParty; i ++ ) {
      let socket = new MockSocket(i);
      MockSocketHandler.onConnectCallbacks[0]( socket );
    }

    expect( _game.getRoomList().length ).to.equal( 1 );

  });

  it('Peut creer deux rooms si PLUS max player peer room connecter', () => {
    
    for ( var i = 0 ; i < config.maxPlayerPeerParty + 1; i ++ ) {
      let socket = new MockSocket(i);

      MockSocketHandler.onConnectCallbacks[0]( socket );
    }

    expect( _game.getRoomList().length ).to.equal( 2 );

  });

  it('Ne Peux ajouter le meme player dans la meme partis', () => {
    var socketDoublon = new MockSocket('1');

    MockSocketHandler.onConnectCallbacks[0]( socketDoublon );
    assert( _game.getRoomList()[0].alreadyJoined('1') );

    expect( _game.getRoomList().length ).to.equal( 1 );

  });

  it('Ne peux ajouter un player dans une partie commencé', () => {
    var clock = sinon.useFakeTimers();
    
    MockSocketHandler.onConnectCallbacks[0]( _socket1 );
   
    MockSocketHandler.onConnectCallbacks[0]( _socket2 );

    clock.tick( config.timerToStartParty );
    expect( _game.getRoomList().length ).to.equal( 1 );
    let socketAdd =  new MockSocket('3');
    
    MockSocketHandler.onConnectCallbacks[0]( socketAdd );

    clock.tick( 1 );
    expect( _game.getRoomList().length ).to.equal( 2 );
    clock.restore();
  });

  it('Peux supprimer une room si onDestroy callback', () => {

    var clock = sinon.useFakeTimers();
    
    MockSocketHandler.onConnectCallbacks[0]( _socket1 );
    clock.tick( config.timerToStartParty/2 );

    expect( _game.getRoomList().length ).to.equal( 1 );

    _socket1.callbackDisconnect();

    clock.tick( config.timerToStartParty/2 );

    expect( _game.getRoomList().length ).to.equal( 0 );

    clock.restore();
  });
  
  afterEach( ()=> {
    _clock.restore();
  });
});
