"use strict";

describe( "User", function() {

    var player;

    var spawnPoint = [50, -65];

    beforeEach( function() {

        player = new Player( "testPlayer", spawnPoint );
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

        var bombe = new Bombe( player, player.position );

        player.setBomb( bombe );

        expect( player.listBombs.length ).toEqual( 1 );
    });

    it( "Ne peut depasser le nombre de bombe maximun", function() {

        var nbBombeMax = player.powerUp.bombs;

        for ( var i = 0; i < nbBombeMax; i++ ) {

            var bombePlayer = new Bombe( player, [0, i] );
            expect( player.setBomb( bombePlayer ) ).toEqual( true );
        }

        expect( player.listBombs.length ).toEqual( 2 );

        expect( player.setBomb( new Bombe( player, [1, 1] ) )).toEqual( false );

        expect( player.listBombs.length ).toEqual( 2 );
    });

});