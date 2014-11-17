"use strict";

var config = require("./config/config.js");
var express = require("express");
var app = express();
var server = require(config.rootPath + "/app/module/server/server.js");

require(config.rootPath + "/app/module/log/log.js").start(app);
server.start(app);
server.onListenStart(function(){
});




