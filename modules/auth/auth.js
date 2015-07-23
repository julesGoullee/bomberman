"use strict";

var crypto = require( "crypto" );

var _users;

module.exports = {

    launch: function(){

        _users = [];

        _users.nameIsUse = function( name ) {

            for ( var iUser = 0; iUser < _users.length ; iUser++ ) {

                if ( _users[iUser].name === name ){

                    return true;
                }

            }
            return false;
        };

        _users.getUserByToken = function( token, callback ) {


            for ( var iUser = 0; iUser < _users.length ; iUser++ ) {

                if ( _users[iUser].token === token ){

                    callback( _users[iUser], null );

                    return  true;
                }

            }

            callback( null, "Token invalide." );

            return false;
        };
    },
    setUser: function( name, callback ){

        if ( !_users.nameIsUse( name ) ) {

            var token = crypto.randomBytes(64).toString('hex');

            _users.push({
                name: name,
                token: token
            });

            callback( token , null );
        }
        else{

            callback( null, "Pseudo déjà utilisé." );
        }
    },
    checkToken: function( token, callback ){

        _users.getUserByToken( token, function( user, err ){

            if ( user && user.name && !err ) {

                callback( user.name, null );
            }
            else{

                if( err ){

                    callback( null, err );
                }
                else{
                    callback( null, "erreur M*" );
                }
            }
        });
    }
};