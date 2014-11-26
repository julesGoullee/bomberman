"use strict";

describe( "Player", function() {

    var maps;

    var player;

    var spawnPoint = [50, -65];

    beforeEach( function() {

        maps = new Maps(gameMock);

        player = new Player( "testPlayer", spawnPoint , gameMock.assets );
    });

    it( "Peut creer un player a la bonne position", function() {

        var expectPosition = {
            x: spawnPoint[0],
            y: 0,
            z: spawnPoint[1]
        };

        expect(expectPosition).toEqual( player.position );
    });

    it( "Peut ajouter une bombe", function() {

        maps.setBomb( player );

        expect( player.listBombs.length ).toEqual( 1 );
    });

    it( "Ne peut depasser le nombre de bombe maximun", function() {

        var nbBombeMax = player.powerUp.bombs;

        for ( var i = 0; i < nbBombeMax; i++ ) {

            expect( maps.setBomb( player ) ).toEqual( true );
        }

        expect( player.listBombs.length ).toEqual( 2 );

        expect( maps.setBomb( player ) ).toEqual( false );

        expect( player.listBombs.length ).toEqual( 2 );
    });

    it( "Peut poser une bombe", function () {

        player.setBomb();

        expect( player.listBombs.length ).toEqual( 1 );
    });

    it( "Peut poser une bombe a la position du player", function () {

        player.setBomb();

        expect( player.listBombs[0].position.x ).toEqual( player.position.x );
        expect( player.listBombs[0].position.z ).toEqual( player.position.z );
    });

});