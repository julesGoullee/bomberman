"use strict";
define(["auth/facebook"], function(authFb){
  return function Auth( connectors ){

    var self = this;

    /*PUBLIC METHODS*/

    self.ready = function( callback ) {
      authFb.loadFbScript(function(){
        authFb.connect(function(data) {
          connectors.signIn(function( userProfil ) {
            if( !userProfil ) {
              connectors.signUp(data.accessToken, function (userProfil) {
                connectors.launch(function(){
                  callback( userProfil );
                });
              });
            }
            else{
                connectors.launch(function(){
                  callback( userProfil );
                });
              }
            });
        });
      });
        //else{
        //  authFb.connect(function(data){
        //    connectors.signUp(data.accessToken, function(userProfil){
        //      if(userProfil){
        //        callback( userProfil );
        //      }
        //    });
        //showForm( function( userProfil ){
        //  popup.hide();
        //  callback( userProfil );
        //});
    };

    /*PRIVATE METHODS*/

    
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

  };
});
