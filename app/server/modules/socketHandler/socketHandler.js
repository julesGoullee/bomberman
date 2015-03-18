"use strict";

var server = require("../../services/server/server.js");
var auth = require("../auth/auth.js");

var _callbackConnect = [];

module.exports = {

    launch : function() {

        var io = server.getSocketIo();

        auth.launch();

        io.on( "connection", function( socket ) {

            socket.on( "setUser", function( name ){

                auth.setUser( name, function( token, err ) {

                    if( token && !err ){

                        socket.emit( "setUser", { name: name, token: token , err: null } );

                        socket.on( "getMyPosition", function() {

                            for ( var i = 0; i < _callbackConnect.length; i++ ) {

                                _callbackConnect[i]( { name: name, socket: socket, token : token });
                            }
                        });

                    }
                    else{
                        socket.emit( "setUser", { err: err } );
                    }
                });
            });

            socket.on( "setToken", function( token ){

                auth.checkToken( token, function( name, err ) {

                    if ( token && !err ) {

                        socket.emit( "setToken", { name: name, token: token , err: null } );

                        socket.on( "getMyPosition", function() {

                            for ( var i = 0; i < _callbackConnect.length; i++ ) {

                                _callbackConnect[i]( { name: name, token: token, socket: socket } );
                            }
                        });

                    }
                    else{

                        socket.emit( "setToken", { err: err });
                    }
                });
            });
        });
    },
    newConnect: function( callback ) {

        _callbackConnect.push( callback );
    }
};
