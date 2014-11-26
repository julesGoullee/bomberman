"use strict";

var path = require( "path" );
var express = require( "express" );
var config = require( "../../config/config.js" );

function staticRoutes( app ) {
    
    var rootPathPublic = path.join( config.rootPath, "/public" );

    app.use( express.static( rootPathPublic ) );
}

module.exports = function( app ) {
    return  staticRoutes( app );
};