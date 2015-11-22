'use strict';
/*jshint -W079 */
//var ga = require('../analitics/analitics.js');
var _callbackConnect = [];
var _activeConnection = [];
var authLog = require('../log/log').socket;

class SocketHandler{
  constructor(io){

    this.io = io;
    
    io.on('connection', (socket) => {
      authLog.info('Connection ' + socket.request.user.fb.username);
      if(!SocketHandler.haveActiveConnection(socket.request.user._id)){
        _activeConnection.push(socket.request.user._id);
        socket.on('ready', () => {
          for (var i = 0; i < _callbackConnect.length; i++) {
            _callbackConnect[i](socket);
          }
        });
      }else{
        authLog.info('Error connection already active for' + socket.request.user._id);
        socket.disconnect();
      }

      socket.on( 'disconnect', () => {
        authLog.info('Disconnect for' + socket.request.user._id);

        for (var iConnection = 0; iConnection < _activeConnection.length; iConnection++){
          if( _activeConnection[iConnection] === socket.request.user._id){
            _activeConnection.splice(iConnection, 1);
            break;
          }
        }
      });
    });
  }
  
  static newConnect( callback ) {

    _callbackConnect.push( callback );
  }
  
  static haveActiveConnection ( id ) {

    for ( var iConnection = 0; iConnection < _activeConnection.length ; iConnection++ ) {

      if ( _activeConnection[iConnection].toString() === id.toString() ){
        return true;
      }
    }
    return false;
  }
}

module.exports = SocketHandler;
