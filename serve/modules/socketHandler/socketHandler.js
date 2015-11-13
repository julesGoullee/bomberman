"use strict";
/*jshint -W079 */
var auth = require("../auth/auth.js");
var ga = require("../analitics/analitics.js");
var _callbackConnect = [];

module.exports = {

    launch : function( io ) {

        auth.launch();

        io.on( "connection", function( socket ) {
            log("connection");
            socket.on( "setUser", function( name ){
                log("setUser");

                auth.setUser( name, function( token, err ) {

                    if( token && !err ){

                        socket.on( "ready", function() {

                            for ( var i = 0; i < _callbackConnect.length; i++ ) {

                                _callbackConnect[i]( { name: name, socket: socket, token : token });
                            }
                        });

                        socket.emit( "setUser", { name: name, token: token , err: null } );

                        ga.event("auth", "setUser").send();
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

                        socket.on( "ready", function() {

                            for ( var i = 0; i < _callbackConnect.length; i++ ) {

                                _callbackConnect[i]( { name: name, token: token, socket: socket } );
                            }
                        });

                        ga.event("auth", "setToken").send();
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