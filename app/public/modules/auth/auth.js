"use strict";

function Auth( connector ){

    var self = this;


    /*PUBLIC METHODS*/

    self.ready = function( callback ){

        var token = getTokenLS();

        if ( getTokenLS() ){

            connector.setTokenAndReturnUseProfil( token, function( userProfil){

                if( !userProfil.err ){
                    callback( userProfil.name );
                }else{

                }
            });

        }else{
            callback();
        }
    };

    /*PRIVATE METHODS*/

    function getTokenLS(){
        return localStorage.getItem( "token" );
    }
}