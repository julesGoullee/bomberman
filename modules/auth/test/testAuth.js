"use strict";

var chai = require('chai');
global.expect = chai.expect;


describe("Auth", function(){

    var _auth;

    beforeEach( function() {

        _auth = require( "../auth.js" );
        _auth.launch();

    });

    it( "Peut ajouter un utilisateur et recuperer son token", function() {
        var nameUser = "j1";

        _auth.setUser( nameUser, function( token, err ){

            expect( err).to.equal( null );

            expect( token.length ).to.equal( 128 );
        });
    });

    it( "Peut ajouter deux utilisateurs et recuperer des tokens différents", function() {

        var nameUser1 = "j1";
        var nameUser2 = "j2";

        _auth.setUser( nameUser1, function( token1, err1 ){

            _auth.setUser( nameUser2, function( token2, err2 ){

                expect( err1 ).to.equal( null );
                expect( token1.length ).to.equal( 128 );

                expect( err2 ).to.equal( null );
                expect( token2.length ).to.equal( 128 );

                expect( token2 ).not.to.equal( token1 );
            });
        });
    });

    it( "Ne peut ajouter deux personne avec le meme nom", function(){

        var nameUser = "nomDoublon";

        _auth.setUser( nameUser, function( token1, err1 ){

            _auth.setUser( nameUser, function( token2, err2 ){

                expect( err1 ).to.equal( null );
                expect( token1.length ).to.equal( 128 );

                expect( err2 ).to.equal(  "Pseudo déjà utilisé." );
                expect( token2 ).to.equal( null );

            });
        });

    });

    it( "Peut validé un token si l'user est présent", function() {

        var nameUser = "j1";

        _auth.setUser( nameUser, function ( token ) {

            _auth.checkToken( token, function( name, errToken ) {

                expect( name ).to.equal( nameUser );

                expect( errToken ).to.equal( null );
            });
        });
    });

    it( "Ne Peut validé un token si l'user est présent", function() {

        var nameUser = "j1";

        _auth.setUser( nameUser, function ( ) {

            _auth.checkToken( "egrbtgbbttbg", function( name, errToken ) {

                expect( name).to.equal( null );

                expect( errToken ).to.equal( "Token invalide." );
            });
        });
    });
});
