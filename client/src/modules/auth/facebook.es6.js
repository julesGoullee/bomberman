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
        cb(res.authResponse);
      } else {
        this.showLogin(cb);
      }
    });
  }

  showLogin (cb) {
    FB.login( (res) => {
      if (res.status === 'connected') {
        cb(res.authResponse);
      }
      else{
        this.showLogin(cb);
      }
    }, {scope: 'user_friends, email'});
  }
}

module.exports = AuthFb;
