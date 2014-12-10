"use strict";

var config = require( "../../config/config.js" );
var onListenStartCallbacks = [];
var http = require( "http" );
var io = require( "socket.io" );

module.exports = {

    start : function(app) {

        require( config.rootPath + "../../routes/router.js" )( app );

        app.set( "views", "app/server/routes" );

        app.set( "view engine", "ejs" );

        app.engine( "html", require( "ejs" ).renderFile );

        var httpServer = http.createServer( app );

        httpServer.listen( config.port, function () {

            io = io( httpServer );

            for ( var callback in onListenStartCallbacks ) {

                if ( onListenStartCallbacks.hasOwnProperty( callback ) ) {

                    onListenStartCallbacks[callback]();
                }
            }
        });
    },
    onListenStart : function( callback ) {

        onListenStartCallbacks.push(callback);
    },
    getSocketIo : function() {
        return io;
    }
};
