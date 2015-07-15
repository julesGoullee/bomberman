var config = require("./../config/config.js");

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

global.log = function(){};
config.nbPlayersToStart = 2;