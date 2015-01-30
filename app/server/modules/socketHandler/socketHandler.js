"use strict";
var server = require("../../services/server/server.js" );
var io = server.getSocketIo();


var _callbackConnect = [];

io.on( "connection", function( socket ) {
    var i;
    for(i = 0; i < _callbackConnect.length; i++ ){
        _callbackConnect[i](socket);
    }
});


module.exports = {

    newConnect: function( callback){
        _callbackConnect.push(callback);
    }
};
