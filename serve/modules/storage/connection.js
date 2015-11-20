"use strict";
var mongoose = require("mongoose");
var config = require("../../config/config.js");
var bddLog = require("../log/log").bdd;

mongoose.connect("mongodb://" + config.storage.mongo.ip + "/" + config.storage.mongo.base, function( err ){
  process.nextTick(function() {
    if (err) {
      bddLog.fatal("Connection mongo [FAIL]: " + err.message);
      throw err;
    }
    else {
      bddLog.info("Connection mongo [OK]");
    }
  });
});

module.exports = {
  getConnection : function(){
    return mongoose.connection;
  }
};
