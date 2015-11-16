"use strict";
define(function() {
  function loadFbScript( callback ){
    /* jshint ignore:start */
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    /* jshint ignore:end */

    window.fbAsyncInit = function () {
      FB.init({
        appId: '1562153034052094',
        cookie: true,  // enable cookies to allow the server to access 
                       // the session
        xfbml: false,  // parse social plugins on this page
        version: 'v2.2' // use version 2.2
      });
      callback();
    };
  }

  function connect( callback ){
    FB.getLoginStatus(function(res) {
      if (res.status === 'connected') {
        callback(res.authResponse);
      } else {
        showLogin(callback);
      }
    });
  }

  function showLogin( callback ){
    FB.login(function(res) {
      if (res.status === 'connected') {
        callback(res.authResponse);
      }
      else{
        showLogin(callback);
      }
    }, {scope: 'user_friends, email'});
  }

  return {
    loadFbScript: loadFbScript,
    connect: connect
  };
});
