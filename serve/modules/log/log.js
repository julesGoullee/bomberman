"use strict";

var manager = require('simple-node-logger').createLogManager();
var serveLogger = manager.createLogger('Serve');
var bddLogger = manager.createLogger('Serve');
var authLogger = manager.createLogger('Auth');
var errorRequestHandlerLogger = manager.createLogger('Request handler');
var socketHandlerLogger = manager.createLogger('Socket handler');

module.exports = {
  serve: serveLogger,
  bdd: bddLogger,
  auth: authLogger,
  error: errorRequestHandlerLogger,
  socket: socketHandlerLogger
};
