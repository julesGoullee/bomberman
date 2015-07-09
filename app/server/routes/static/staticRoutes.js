"use strict";

var express = require( "express" );
var config = require( "../../config/config.js" );
var compress = require('compression');

function staticRoutes( app ) {
    
    var rootPathPublic = "app/public" ;

    var oneDay = 86400000;
    app.use( compress() );
    app.use( express.static( rootPathPublic, { maxAge: oneDay } ) );
}

module.exports = function( app ) {
    return  staticRoutes( app );
};