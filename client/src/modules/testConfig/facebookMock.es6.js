'use strict';

class AuthFbMock {
  constructor(cb){
    this.cbLoadScript = cb;
  }

  connect(cb){
    this.cbConnect = cb;
  }
}

module.exports = AuthFbMock;
