'use strict';

const mock = require('../../test/mock.js');
const utils = require('../../utils/utils.js');
const config = require('../../../config/config.js');


describe('Game', function() {
  var _clock;
  var _game;
  var socket1 ;
  var socket2 ;
  var stubOnP1 ;
  var stubOnP2 ;
  var callbackDisconnectP1;
  var callbackDisconnectP2;

  beforeEach( () => {
    _clock = sinon.useFakeTimers();
    socket1 = utils.clone( mock ).socket;
    socket1.request = {
      user : {
        _id: {
          toString: () => {
            return 'idP1';
          }
        },
        fb: {
          username: 'testPlayer1'
        }
      }
    };
    stubOnP1 = sinon.stub(socket1, 'on', (event, callback) => {
      if( event === 'disconnect' ){
    
        callbackDisconnectP1 = callback;
    
      }
    });
    
    socket2 = utils.clone( mock ).socket;
    socket2.request = {
      user : {
        _id: {
          toString: () => {
            return 'idP2';
          }
        },
        fb: {
          username: 'testPlayer2'
        }
      }
    };
    stubOnP2 = sinon.stub( socket2, 'on', (event, callback) => {
    
      if( event === 'disconnect'){
    
        callbackDisconnectP2 = callback;
    
      }
    });

    _game = require( '../game.js' );
    _game.mockSocketHandler( mock.socketHandler );

    _game.launch();
  });

  it( 'Peut creer une room quand premier player connect', () => {

    mock.socketHandlerOnConnectCallbacks[0]( socket1 );

    expect( _game.getRoomList().length ).to.equal( 1 );
  });

  it( 'Peut creer une seul room si max player peer party connecter', () => {

    for ( var i = 0 ; i < config.maxPlayerPeerParty; i ++ ) {
      var socket = utils.clone( mock ).socket;
      
      socket.request = {
        user : {
          _id: {
            toString: () => {
              return 'idP' + i;
            }
          },
          fb: {
            username: 'testPlayer' + i
          }
        }
      };
      
      mock.socketHandlerOnConnectCallbacks[0]( socket );
    }

    expect( _game.getRoomList().length ).to.equal( 1 );

  });

  it( 'Peut creer deux rooms si PLUS max player peer room connecter', () => {
    
    for ( var i = 0 ; i < config.maxPlayerPeerParty + 1; i ++ ) {
      var socket = utils.clone( mock ).socket;

      socket.request = {
        user : {
          _id: {
            toString: () => {
              return 'idP_' + i;
            }
          },
          fb: {
            username: 'testPlayer_' + i
          }
        }
      };

      mock.socketHandlerOnConnectCallbacks[0]( socket );
    }

    expect( _game.getRoomList().length ).to.equal( 2 );

  });

  it( 'Ne Peux ajouter le meme player dans la meme partis', () => {
    var socketDoublon = utils.clone( mock ).socket;

    socketDoublon.request = {
      user : {
        _id: {
          toString: () => {
            return 'idP1';
          }
        },
        fb: {
          username: 'testPlayer1'
        }
      }
    };
    mock.socketHandlerOnConnectCallbacks[0]( socketDoublon );
    assert( _game.getRoomList()[0].alreadyJoined('idP1') );

    expect( _game.getRoomList().length ).to.equal( 1 );

  });

  it( 'Ne peux ajouter un player dans une partie commencé', () =>{
    var clock = sinon.useFakeTimers();
    
    mock.socketHandlerOnConnectCallbacks[0]( socket1 );
   
    mock.socketHandlerOnConnectCallbacks[0]( socket2 );

    clock.tick( config.timerToStartParty );
    expect( _game.getRoomList().length ).to.equal( 1 );
    let socketAdd = utils.clone( mock ).socket;

    socketAdd.request = {
      user : {
        _id: {
          toString: () => {
            return 'idP3';
          }
        },
        fb: {
          username: 'testPlayer3'
        }
      }
    };
    mock.socketHandlerOnConnectCallbacks[0]( socketAdd );

    clock.tick( 1 );
    expect( _game.getRoomList().length ).to.equal( 2 );
    clock.restore();
  });

  it( 'Peux supprimer une room si onDestroy callback', () => {

    var clock = sinon.useFakeTimers();
    
    mock.socketHandlerOnConnectCallbacks[0]( socket1 );
    clock.tick( config.timerToStartParty/2 );

    expect( _game.getRoomList().length ).to.equal( 1 );

    callbackDisconnectP1();

    clock.tick( config.timerToStartParty/2 );

    expect( _game.getRoomList().length ).to.equal( 0 );

    clock.restore();
  });
  
  afterEach( ()=> {
    _clock.restore();
  });
});
