var config = require( "../../config/config.js" );
var onListenStartCallbacks = [];
var http = require( "http" );

module.exports = {

    start : function(app) {

        require( config.rootPath + "/app/routes/router.js" )( app );

        app.set( "views", config.rootPath + "/app/routes" );

        app.set( "view engine", "ejs" );

        app.engine( "html", require( "ejs" ).renderFile );

        var httpServer = http.createServer( app );

        httpServer.listen( config.port, function () {

            for ( var callback in onListenStartCallbacks ) {

                if ( onListenStartCallbacks.hasOwnProperty( callback ) ) {

                    onListenStartCallbacks[callback]();
                }
            }
        });
    },
    onListenStart : function(callback){

        onListenStartCallbacks.push(callback);
    }
};
