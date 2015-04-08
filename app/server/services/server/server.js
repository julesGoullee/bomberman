"use strict";

var config = require( "../../config/config.js" );
var onListenStartCallbacks = [];
var https = require('https');
var io = require( "socket.io" );
var pem = require('pem');




module.exports = {

    start : function(app) {

        require( config.rootPath + "../../routes/router.js" )( app );

        app.set( "views", "app/server/routes" );

        app.set( "view engine", "ejs" );

        app.engine( "html", require( "ejs" ).renderFile );


        pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
            var httpsServer = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app);

            httpsServer.listen( config.port, function () {

                io = io( httpsServer );

                for ( var callback in onListenStartCallbacks ) {

                    if ( onListenStartCallbacks.hasOwnProperty( callback ) ) {

                        onListenStartCallbacks[callback]();
                    }
                }
            });
        });

    },
    onListenStart : function( callback ) {

        onListenStartCallbacks.push( callback );
    },
    getSocketIo : function() {
        return io;
    }
};
