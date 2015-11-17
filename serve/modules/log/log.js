"use strict";

var manager = require('simple-node-logger').createLogManager();
var serveLogger = manager.createLogger('Serve');
var bddLogger = manager.createLogger('Serve');

module.exports = {
  serve: serveLogger,
  bdd: bddLogger
};
