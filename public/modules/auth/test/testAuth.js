"use strict";

define(["modules/auth/auth", "mock"],function( Auth,mock ) {

    describe("Auth", function () {
        var auth;
        var connectorMock;
        var popupMock;
    
        beforeEach(function () {
    
            connectorMock = new mock.Connector();
            
            popupMock = new mock.Popup();
            
            auth = new Auth(connectorMock, popupMock);
    
        });
    
        it("Recuperer le token et le validiter", function () {

            sessionStorage.setItem("token", "tokenTest");
            
            var spyCallback = jasmine.createSpy('spy');
            
            auth.ready(spyCallback);
            expect(spyCallback).toHaveBeenCalledWith({name: 'player1', err: null, token: 'tokenTest'});
        });
    
        it("Ne peut executer le callback si pas de token", function () {
    
            sessionStorage.removeItem("token");
    
            var spyCallback = jasmine.createSpy('spy');
    
            auth.ready(spyCallback);
    
            expect(spyCallback).not.toHaveBeenCalled();
    
        });
    
        afterEach(function () {
            sessionStorage.removeItem("token");
        });
    });
});