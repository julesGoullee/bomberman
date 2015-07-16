"use strict";

describe( "timer", function() {

    cfg.nbPlayersToStart = 2;
    var timer;
    var map;
    var timeToStartParty = 60000;//ms
    var timeInParty = 180000;//ms

    beforeEach(function () {
        jasmine.clock().install();

        map = new Maps( gameMock.assets, gameMock.blockDim, new MenuPlayers() );
        var player = new Player(0, "testPlayer", {x :50, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );
        map.addObject( player );

        timer = new Timer(map);
        timer.showTimerToStartParty( timeToStartParty );

    });

    afterEach(function(){
        jasmine.clock().uninstall();
    });

    describe("decompteToStartParty", function(){

        it( "Peut demarrer le timer", function () {

            expect( timer.timeToStartParty ).toEqual( timeToStartParty );
            jasmine.clock().tick(timeToStartParty/3);
            expect( timer.timeToStartParty ).toEqual( timeToStartParty - timeToStartParty/3 );

        });

        it( "Peut bloquer le timer a la limite si le nombre min de player n'est pas atteind", function () {

            jasmine.clock().tick(timeToStartParty*3);
            expect( timer.timeToStartParty ).toEqual( cfg.limitToCheckNumberPlayer );
            expect($( "#timer-label").text() ).toEqual("En attente de 1 joueurs...");
        });

        it( "Peut se préparer au lancement de la partie si le nombre de joueur est suffisant", function () {

            var player2 = new Player(1, "testPlayer2", {x :0, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );
            map.addObject( player2 );

            jasmine.clock().tick(timeToStartParty*3);
            expect( timer.timeToStartParty ).toEqual( cfg.limitToCheckNumberPlayer );
            expect($( "#timer-label").text() ).toEqual("Prepare toi !");

        });

        it( "Peut bloquer le timer puis attendre si suffisament de joueurs", function () {

            jasmine.clock().tick(timeToStartParty*3);
            expect( timer.timeToStartParty ).toEqual( cfg.limitToCheckNumberPlayer );
            expect($( "#timer-label").text() ).toEqual("En attente de 1 joueurs...");

            var player2 = new Player(1, "testPlayer2", {x :0, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );
            map.addObject( player2 );
            jasmine.clock().tick(timeToStartParty*3);

            expect($( "#timer-label").text() ).toEqual("Prepare toi !");
        });

    });

    describe("decompteInparty", function(){

        beforeEach(function(){

            var player2 = new Player(1, "testPlayer2", {x :0, z:-65}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );
            map.addObject( player2 );
            jasmine.clock().tick(timeToStartParty);
            timer.startGame( timeInParty );
        });

        it("Peut lancer la partie", function(){
            expect( timer.timeInParty).toEqual( timeInParty );
        });

        describe("end", function(){

            var spyCallback = jasmine.createSpy('spy');

            beforeEach( function(){
                timer.onTimerEnd( spyCallback );
                jasmine.clock().tick( timeInParty );
            });

            it( "Peut lancer le callback a la fin de la partie", function(){
                expect( spyCallback ).toHaveBeenCalled();
            });
        });
    });


});