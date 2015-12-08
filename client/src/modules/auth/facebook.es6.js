'use strict';
const Popup = require('popup/popup.es6');

function loadSdk(cb){
 const ttlDetectAdBlocker = 1500;

  let fbLoadScriptTimerOut = setTimeout( () => {
    cb('Please disable your AD Blocker or just autorize facebook connect');
  }, ttlDetectAdBlocker);

    /* jshint ignore:start */
  // Load the SDK asynchronously
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  /* jshint ignore:end */

  window.fbAsyncInit = () => {

    FB.init({
      appId: '1562153034052094',
      cookie: false,
      xfbml: false,
      version: 'v2.2'
    });

    clearTimeout(fbLoadScriptTimerOut);
    cb();
  };
}

class AuthFb {

  constructor (cb) {
    loadSdk( (err) => {
      if (err) {
        Popup.setContent('Error', err).show();
      } else {
        cb();
      }
    });
  }

  connect (cb) {
    FB.getLoginStatus( (res) => {
      if (res.status === 'connected') {
        this._checkPermision(cb, res.authResponse);
      } else {
        this._showLogin(cb);
      }
    }, {scope: 'user_friends, email'});
  }

  _showLogin (cb) {
    FB.login( (res) => {
      if (res.status === 'connected') {
        this._checkPermision(cb, res.authResponse);
      }
      else{
        this._showLogin(cb);
      }
    }, {scope: 'user_friends, email'});
  }
  
  
  _checkPermision (cb, authResponse) {
    FB.api('/me/permissions', (res) => {
      if(Array.isArray(res.data) && !res.data.find( perm => perm.status !== "granted" )){
        cb(authResponse);
      }else{
        this._rerequest(cb);
      }
    });
  }
  
  _rerequest (cb){
    FB.login( (res) => {
        if (res.status === 'connected') {
          this._checkPermision(cb, res.authResponse);
        }
        else{
          this._rerequest(cb);
        }
      },
      {
        scope: 'user_friends, email',
        auth_type: 'rerequest'
      }
    );
  }
}

module.exports = AuthFb;
