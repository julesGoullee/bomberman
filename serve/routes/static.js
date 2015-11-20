"use strict";

var favicon = require("serve-favicon");
var express = require("express");
var config = require("../config/config");

module.exports = function(app) {
  var oneDay = 86400000;

  app.use(favicon(config.rootPathPublic + "/assets/favicon.ico"));

  //Common response BabylonjsManifest
  app.get( "/*babylon.manifest*", function ( req, res ) {
    res.sendFile( "/assets/common.manifest", { "root": config.rootPathPublic } );
  });

  //routes
  app.all("/", function(req, res){
    res.sendFile( "/index.html", { "root": config.rootPathPublic });
  });

  //Static files
  app.use(express.static( config.rootPathPublic , {
    maxage: oneDay
  }));
};
