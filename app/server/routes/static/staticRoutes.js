"use strict";

var express = require( "express" );
var config = require( "../../config/config.js" );
var compress = require('compression');

var contentTypeToCompress = [
    'application/octet-stream',
    'application/javascript',
    'text/css',
    'application/json'
];

function staticRoutes( app ) {

    var rootPathPublic = "app/public" ;

    var oneDay = 86400000;

    app.use(compress({filter: shouldCompress}));

    function shouldCompress(req, res) {

        var contentType = res.getHeader('Content-Type');
        //console.log(contentType, req.url );
        return contentTypeToCompress.indexOf(contentType) !== -1;
    }

    app.use( express.static( rootPathPublic, {
        CacheControl: 'public, max-age=' + oneDay
    }));

}

module.exports = function( app ) {
    return  staticRoutes( app );
};