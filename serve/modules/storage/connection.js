"use strict";
var mongoose = require("mongoose");
var config = require("../../config/config.js");

mongoose.connect( "mongodb://" + config.storage.mongo.ip + "/" + config.storage.mongo.base, function( err ){

  if( err ){
    log("Connection [FAIL]: " + err.message, "mongo" );
  }
  else{
    log("Connection [OK]", "mongo");
  }
});

module.exports = {
  getConnection : function(){
    return mongoose.connection;
  }
};