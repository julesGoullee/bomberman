"use strict";
var mongoose = require("mongoose");
var config = require("../../config/config.js");

mongoose.connect( "mongodb://" + config.storage.mongo.ip + "/" + config.storage.mongo.base, function( err ){

  if( err ){
    log("Mongo connection [FAIL]: " + err.message );
  }
  else{
    log("Mongo connection [OK]");
  }
});

module.exports = {
  getConnection : function(){
    return mongoose.connection;
  }
};