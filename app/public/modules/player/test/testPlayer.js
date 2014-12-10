"use strict";

describe( "Player", function() {

    var player;

    var spawnPoint = [48, -64];

    beforeEach( function() {

        player = new Player( "testPlayer", spawnPoint , gameMock.assets, gameMock.blockDim );
    });

    it( "Peut créer un player a la bonne position", function() {

        var expectPosition = {
            x: spawnPoint[0],
            y: 0,
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

    describe( "Bombe", function () {

        var bomb;

        beforeEach( function () {

            jasmine.clock().install();

            bomb = new Bombe ( player, player.roundPosition() , gameMock.assets);
        });

        it( "Peut ajouter une bombe", function () {

            player.addBomb( bomb );

            expect( player.listBombs.length ).toEqual( 1 );
        });

        it( "Peut poser une bombe a la position du player", function () {

            player.addBomb( bomb );

            expect( player.listBombs[0].position.x ).toEqual( player.position.x);
            expect( player.listBombs[0].position.z ).toEqual( player.position.z);
        });

        it( "Peut poser une bombe a la position arrondie au dessus du player", function () {

            player.position.x = 28.456345;

            player.position.z = -13.557235;

            bomb = new Bombe ( player, player.roundPosition() , gameMock.assets);

            player.addBomb( bomb );

            expect( player.listBombs[0].position.x ).toEqual( 32 );
            expect( player.listBombs[0].position.z).toEqual( -16 );
        });

        it( "Peut poser une bombe a la position arrondie en dessous du player", function () {

            player.position.x = 26.456345;

            player.position.z = -10.557235;

            bomb = new Bombe ( player, player.roundPosition() , gameMock.assets);

            player.addBomb( bomb );

            expect( player.listBombs[0].position.x ).toEqual( 24 );
            expect( player.listBombs[0].position.z ).toEqual( -8 );
        });

        it( "Peut dire quand le nombre de bombe max est atteind", function() {

            var nbBombeMax = player.powerUp.bombs;

            for ( var i = 0; i < nbBombeMax; i++ ) {
                player.addBomb( bomb );
            }

            expect( player.listBombs.length ).toEqual( nbBombeMax );

            expect( player.shouldSetBomb() ).toEqual( false );

        });

        it( "Peut détruire une bombe par son id ", function () {

            player.addBomb( bomb );

            player.delBombById( bomb.id );

            expect( player.listBombs.length ).toEqual( 0 );
        });

        it( "Peut detruire toutes les bombes", function() {

            player.addBomb( bomb );

            var bomb2 = new Bombe ( player, player.roundPosition() , gameMock.assets);

            player.addBomb( bomb2 );
            var bomb3 = new Bombe ( player, player.roundPosition() , gameMock.assets);

            player.addBomb( bomb3 );
            player.delBombs();

            expect( player.listBombs.length ).toEqual( 0 );

        });

    });

    it( "Peut tuer un player", function () {

        player.destroy();

        expect( player.alive).toEqual( false );
    });

});