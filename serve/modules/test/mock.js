"use strict";

var config = require("../../config/config.js");

var _socketHandlerOnConnectCallbacks = [];

module.exports={

  socketHandler: {

    newConnect: function ( callback ) {
      _socketHandlerOnConnectCallbacks.push(callback);
    },
    launch: function(){

    }
  },
  socketHandlerOnConnectCallbacks : _socketHandlerOnConnectCallbacks,
  socket : {
    emit: function(){

    },
    on: function(){

    },
    removeAllListeners: function(){

    }
  }
};

config.timerToStartParty = 5000;
config.limitToCheckNumberPlayer = 4000;
config.nbPlayersToStart = 2;
config.analitics = false;
