"use strict";

function Auth( connector, popup ){

    var self = this;

    /*PUBLIC METHODS*/

    self.ready = function( callback ) {

        var token = getTokenLS();

        if ( getTokenLS() ){

            connector.setTokenAndReturnUseProfil( token, function( userProfil ) {

                if(  userProfil && !userProfil.err && userProfil.name && userProfil.token ) {

                    callback( userProfil );
                }
                else{
                    throw Error( "Token invalide. err: " + userProfil.err );
                }
            });

        }
        else{

            showForm( function( userProfil ){

                popup.hide();
                callback( userProfil );
            });

        }
    };

    /*PRIVATE METHODS*/

    function getTokenLS(){

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
                "<span class='alert alert-success' id='inscription-erreur' ></span>"+
            "</div>"+
            "<button type='submit' class='btn btn-default'>Jouer</button>"+
        "</form>";


        popup.setContent( header, body );

        popup.show();

        $("#form-disclamer").submit( function( e ) {

            e.preventDefault();

            connector.setUserAndReturnProfil( $("#input-pseudo").val(), function( userProfil ){

                if ( userProfil && !userProfil.err && userProfil.token && userProfil.name ) {

                    setTokenLS( userProfil.token );

                    callback( userProfil );
                }
                else{
                    $("#inscription-erreur").text( "Erreur: " + userProfil.err );
                }

            });
        });
    }
}