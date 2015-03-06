"use strict";

describe( "Auth" , function() {

    var auth;
    var connectorMock ;
    beforeEach(function () {

        connectorMock = new ConnectorMock();

        localStorage.setItem("token", "tokenTest");

        auth = new Auth( connectorMock );

    });

    it("Recuperer le token et checker ça validiter", function () {

        auth.ready( function( name ){

            expect( name).toBe( "player1" );
        });
    });

    afterEach( function(){
        localStorage.removeItem("token");
    });
});