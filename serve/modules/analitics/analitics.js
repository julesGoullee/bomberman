"use strict";

var config = require("../../config/config.js");
var ua = require("universal-analytics");

var mock = {

  event: function event(){
    return {
      send: function () {
      },
      event: function(){
        return mock;
      }
    };
  },
  send: function () {
  }
};



var appTracker =  config.analitics ? ua( "UA-65547748-3", "appTracker" ) : mock;

module.exports = appTracker;
