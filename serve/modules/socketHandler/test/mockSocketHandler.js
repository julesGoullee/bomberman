'use strict';

var mockRequire = require('mock-require');
var _socketHandlerOnConnectCallbacks = [];


class MockSocketHandler {
  constructor(){
    _socketHandlerOnConnectCallbacks = [];
  }
  static newConnect(cb) {
    _socketHandlerOnConnectCallbacks.push(cb);
  }
  static get onConnectCallbacks(){
    return _socketHandlerOnConnectCallbacks;
  }
}

mockRequire('../../socketHandler/socketHandler.es6', MockSocketHandler);

module.exports = MockSocketHandler;