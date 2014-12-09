"use strict";

var config = require( "../config/config.js" );
var staticRoutes = require( config.rootPath + "./static/staticRoutes.js" );
var homeRoutes = require( config.rootPath + "./home/homeRoutes.js" );

module.exports = function( app ){

    homeRoutes( app );
    staticRoutes( app );
};