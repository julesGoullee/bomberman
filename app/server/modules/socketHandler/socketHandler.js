"use strict";

var server = require("../../services/server/server.js");
var _callbackConnect = [];

module.exports = {

    launch : function() {

        var io = server.getSocketIo();

        io.on( "connection", function( socket ) {

            var i;

            for ( i = 0; i < _callbackConnect.length; i++ ) {

                _callbackConnect[i](socket);
            }
        });
    },
    newConnect: function( callback ){

        _callbackConnect.push( callback );
    }
};
