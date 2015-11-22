'use strict';
const AuthFb = require('auth/facebook.es6');
const Cookies = require('js-cookie/src/js.cookie');

class Auth {

  constructor (connectors, cb) {
    this._connectors = connectors;
    this._authFb = new AuthFb(cb);
  }

  ready (cb) {
    this._authFb.connect( (data) => {
      const apiToken = Cookies.get('token');
      if( apiToken ){
        this._connectors.signIn( (userProfil) => {
          if (!userProfil) {
            this._connectors.signUp( data.accessToken, (userProfil) => {
              this._connectors.launch( () => { cb(userProfil); });
            });
          }else{
            this._connectors.launch( () => { cb(userProfil); });
          }
        });
      } else {
        this._connectors.signUp(data.accessToken, (userProfil) => {
          this._connectors.launch( () => { cb(userProfil); });
        });
      }
    });
  }
}

module.exports = Auth;
/*function getTokenLS(){

  return sessionStorage.getItem( "token" );
}

function setTokenLS( token ){

  sessionStorage.setItem( "token", token );
}

function showForm( callback ){

  var header = "<h4 class='modal-title' >Inscription</h4>";

  var body = "<form id='form-disclamer'>"+
    "<div class='form-group'>"+
    "<input type='text' class='form-control' id='input-pseudo' placeholder='Entre ton pseudo de guerrier' required='true'>"+
    "<span class='alert alert-warning' id='inscription-erreur' ></span>"+
    "</div>"+
    "<button type='submit' class='btn btn-default'>Jouer</button>"+
    "</form>";



  popup.setContent( header, body );

  var errorContainer = $("#inscription-erreur");

  popup.show();

  connector.onSetUser( function( userProfil ){

    if ( userProfil && !userProfil.err && userProfil.token && userProfil.name ) {

      setTokenLS( userProfil.token );

      callback( userProfil );
    }
    else{

      errorContainer.text( "Erreur: " + userProfil.err );

      errorContainer.show( "fast", function(){

        setTimeout(function(){

          errorContainer.hide("fast");

        },3000);

      });

    }

  });

  $("#form-disclamer").submit( function( e ) {

    e.preventDefault();

    connector.setUser( $("#input-pseudo").val());
  });
}*/
