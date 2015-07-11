"use strict";

describe( "Player", function() {

    var player;

    var spawnPoint = { x:48, z:-64};

    var deathCam = { x : 65, y: 147, z: 0 };

    beforeEach( function() {

        player = new Player(0, "testPlayer", spawnPoint, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );
    });

    it( "Peut créer un player a la bonne position", function() {

        var expectPosition = new BABYLON.Vector3(spawnPoint.x, 0,spawnPoint.z);

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

        var bombe;

        beforeEach( function () {
            bombe = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);
        });

        it( "Peut ajouter une bombe", function () {

            player.addBomb( bombe );

            expect( player.listBombs.length ).toEqual( 1 );
        });

        it( "Peut poser une bombe a la position du player", function () {

            player.addBomb( bombe );

            expect( player.listBombs[0].position.x ).toEqual( player.position.x);
            expect( player.listBombs[0].position.z ).toEqual( player.position.z);
        });

        it( "Peut poser une bombe a la position arrondie au dessus du player", function () {

            player.position.x = 28.456345;

            player.position.z = -13.557235;

            bombe = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);

            player.addBomb( bombe );

            expect( player.listBombs[0].position.x ).toEqual( 32 );
            expect( player.listBombs[0].position.z).toEqual( -16 );
        });

        it( "Peut poser une bombe a la position arrondie en dessous du player", function () {

            player.position.x = 26.456345;

            player.position.z = -10.557235;

            bombe = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);

            player.addBomb( bombe );

            expect( player.listBombs[0].position.x ).toEqual( 24 );
            expect( player.listBombs[0].position.z ).toEqual( -8 );
        });

        it( "Peut dire quand le nombre de bombe max est atteind", function() {

            var nbBombeMax = player.powerUp.bombs;

            for ( var i = 0; i < nbBombeMax; i++ ) {
                player.addBomb( bombe );
            }

            expect( player.listBombs.length ).toEqual( nbBombeMax );

            expect( player.shouldSetBomb() ).toEqual( false );

        });

        it( "Peut détruire une bombe par son id ", function () {

            player.addBomb( bombe );

            player.delBombById( bombe.id );

            expect( player.listBombs.length ).toEqual( 0 );
        });

        it( "Peut detruire toutes les bombes", function() {

            player.addBomb( bombe );

            var bombe2 = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);


            player.addBomb( bombe2 );
            var bombe3 = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);

            player.addBomb( bombe3 );
            player.delBombs();

            expect( player.listBombs.length ).toEqual( 0 );

        });

    });

    it( "Peut tuer un player", function () {

        player.destroy();

        expect( player.alive ).toEqual( false );
    });

    /*it( "Place le player au dessus de la maps à sa mort", function () {

        player.destroy();

        console.log( player.position );

        expect( player. position ).toEqual(deathCam);

    });*/

});