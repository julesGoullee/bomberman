"use strict";

var config = require( "../config/config.js" );
var staticRoutes = require( config.rootPath + "/app/routes/static/staticRoutes.js" );
var homeRoutes = require( config.rootPath + "/app/routes/home/homeRoutes.js" );

module.exports = function( app ){

    homeRoutes( app );
    staticRoutes( app );
};