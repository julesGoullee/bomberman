'use strict';
var _isValide = false;
const CookieMock = require('testConfig/cookieMock.es6');

class ConnectorsMock{
  constructor(){
    _isValide = false;
  }
  
  static signUp(accessToken, cb){

    if (accessToken === 'accessTokenValide') {
      _isValide = true;
      cb({
        id: '1',
        name: 'test1'
      });
    } else {
      _isValide = false;
      cb(false);
    }
  }

  static signIn(cb){
    if(CookieMock.get('token') === 'tokenValide'){
      _isValide = true;
      cb({
        id: '1',
        name: 'test1'
      });
    }else {
      _isValide = false;
    }
  }

  static launch(cb){
    if(_isValide){
      cb();
    }
  }

  static _test_isValide (){
    return _isValide;
  }
}

module.exports = ConnectorsMock;
