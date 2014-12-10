"use strict";

var express = require( "express" );
var config = require( "../../config/config.js" );

function staticRoutes( app ) {
    
    var rootPathPublic = "app/public" ;

    app.use( express.static( rootPathPublic ) );
}

module.exports = function( app ) {
    return  staticRoutes( app );
};