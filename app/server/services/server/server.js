"use strict";

var config = require( "../../config/config.js" );
var onListenStartCallbacks = [];
var https = require('https');
var io = require( "socket.io" );
var fs = require('fs');
var privateKey  = fs.readFileSync("./app/server/ssl/bomberman-key.pem", "utf8");
var certificate = fs.readFileSync("./app/server/ssl/bomberman-cert.pem", "utf8");
var credentials = {key: privateKey, cert: certificate};


module.exports = {

    start : function(app) {

        require( config.rootPath + "../../routes/router.js" )( app );

        app.set( "views", "app/server/routes" );

        app.set( "view engine", "ejs" );

        app.engine( "html", require( "ejs" ).renderFile );


        var httpsServer = https.createServer( credentials, app);

        httpsServer.listen( config.port, function () {

            io = io( httpsServer );

            for ( var callback in onListenStartCallbacks ) {

                if ( onListenStartCallbacks.hasOwnProperty( callback ) ) {

                    onListenStartCallbacks[callback]();
                }
            }
        });

    },
    onListenStart : function( callback ) {

        onListenStartCallbacks.push( callback );
    },
    getSocketIo : function() {
        return io;
    }
};
