"use strict";

describe( "Player", function() {

    var maps;

    var player;

    var spawnPoint = [48, -64];

    beforeEach( function() {

        maps = new Maps( gameMock.assets, gameMock.blockDim );

        player = new Player( "testPlayer", spawnPoint , gameMock.assets, gameMock.blockDim );
    });

    it( "Peut créer un player a la bonne position", function() {

        var expectPosition = {
            x: spawnPoint[0],
            y: 11.5,
            z: spawnPoint[1]
        };

        expect( expectPosition ).toEqual( player.position );
    });

    it( "Peut recuperer la position arrondie en dessus", function () {

        player.position.x = 26.456345;

        player.position.z = -10.557235;

        var expectedPosition = {
            x: 24,
            z: -8
        };

        expect( player.roundPosition() ).toEqual( expectedPosition );
    });

    it( "Peut recuperer la position arrondie au dessus", function () {

        player.position.x = 28.456345;

        player.position.z = -13.557235;

        var expectedPosition = {
            x: 32,
            z: -16
        };

        expect( player.roundPosition() ).toEqual( expectedPosition );
    });

});