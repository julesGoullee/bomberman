"use strict";
/*jshint -W079 */
//var ga = require("../analitics/analitics.js");
var _callbackConnect = [];
var _activeConnection = [];

var haveActiveConnection = function( id ) {

  for ( var iConnection = 0; iConnection < _activeConnection.length ; iConnection++ ) {

    if ( _activeConnection[iConnection].toString() === id.toString() ){
      return true;
    }
  }
  return false;
};

module.exports = {

  launch : function( io ) {

    io.on("connection", function( socket ) {
      log("Connection", "ws");
      if(!haveActiveConnection(socket.request.user._id)){
        _activeConnection.push(socket.request.user._id);
        socket.on( "ready", function() {
          for (var i = 0; i < _callbackConnect.length; i++) {
            _callbackConnect[i](socket);
          }
        });
      }else{
        log("Error connection already active for" + socket.request.user._id, "ws");
        socket.disconnect();
      }
      
      socket.on( "disconnect", function() {
        log("Disconnect for" + socket.request.user._id, "ws");

        for (var iConnection = 0; iConnection < _activeConnection.length; iConnection++){ 
          if( _activeConnection[iConnection] === socket.request.user._id){
            _activeConnection.splice(iConnection, 1);
            break;
          }
        }
      });
    });
  },
  newConnect: function( callback ) {

    _callbackConnect.push( callback );
  }
};
