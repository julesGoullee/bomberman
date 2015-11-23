'use strict';

var _cbLoadScript = null;

class AuthFbMock {
  constructor(cb){
    _cbLoadScript = cb;
  }

  connect(cb){
    _cbLoadScript = cb;
  }

  static __test_cbLoadScript(accessToken){
    return _cbLoadScript(accessToken);
  }
}

module.exports = AuthFbMock;
