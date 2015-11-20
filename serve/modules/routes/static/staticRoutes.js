"use strict";

var express = require( "express" );
var compress = require("compression");

var contentTypeToCompress = [
  "application/octet-stream",
  "application/javascript",
  "text/css; charset=UTF-8",
  "application/json"
];

function shouldCompress(req, res) {

  if( res.statusCode === 200 ){
    var contentType = res.getHeader("Content-Type");
    console.log(contentType, req.url );
    return contentTypeToCompress.indexOf(contentType) !== -1;
  }
  else {
    return false;
  }
}

function staticRoutes( app ) {

  var rootPathPublic = "app/client" ;

  var oneDay = 86400000;

  app.use(compress({filter: shouldCompress}));



  app.use( express.static( rootPathPublic, {
    maxage: oneDay
  }));

}

module.exports = function( app ) {
  return  staticRoutes( app );
};
