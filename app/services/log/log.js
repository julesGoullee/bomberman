"use strict";

var config = require( "../../config/config.js" );

var server = require( config.rootPath + "/app/services/server/server.js" );

function log(app){

    //Dev log TODO
    server.onListenStart(function(){

        console.log( "server listen on 3000 ..." );
    });

    app.use(function( req, res, next ){
//        console.log(req.method, req.url);
        next();
    });

}

module.exports ={
    start : function( app ){

        log( app );
    }
};