'use strict';

var _tokenValue = null;

class CookieMock {
  static get (key){
    if( key === 'token'){
      return _tokenValue;
    }
  }
  
  static set (tokenValue){
    _tokenValue = tokenValue;
  }
  static remove(){
    _tokenValue = null;
  }
}

module.exports = CookieMock;
