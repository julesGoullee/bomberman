"use strict";

describe( "Auth" , function() {

    var auth;
    var connectorMock ;
    var popupMock;

    beforeEach(function () {

        connectorMock = new ConnectorMock();

        popupMock = new PopupMock();

        auth = new Auth( connectorMock, popupMock );

    });

    it("Recuperer le token et le validiter", function () {

        sessionStorage.setItem("token", "tokenTest");

        var spyCallback = jasmine.createSpy('spy');

        auth.ready( spyCallback );

        expect( spyCallback ).toHaveBeenCalledWith( "player1" );
    });

    it("Ne peut executer le callback si pas de token", function(){

        sessionStorage.removeItem("token");

        var spyCallback = jasmine.createSpy('spy');

        auth.ready( spyCallback );

        expect( spyCallback ).not.toHaveBeenCalled();

    });

    afterEach( function(){
        sessionStorage.removeItem("token");
    });
});