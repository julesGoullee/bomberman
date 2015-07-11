"use strict";

var config = require( "../config/config.js" );
var staticRoutes = require( "./static/staticRoutes.js" );
var homeRoutes = require( "./home/homeRoutes.js" );

module.exports = function( app ){

    homeRoutes( app );
    staticRoutes( app );
};