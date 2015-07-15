"use strict";

describe( "Maps", function() {

    cfg.showBlockColision = true;

    cfg.showBlockTemp = true;

    var maps;

    var player;

    var spawnPoint = {x:40, z:-64};

    beforeEach( function() {

        maps = new Maps( gameMock.assets, gameMock.blockDim, gameMock.blocksTemp, gameMock.scene, new MenuPlayers() );

        player = new Player(0, "testPlayer", spawnPoint, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );
    });

    describe( "Create & import mesh", function() {

        it( "Peut importer un mesh sans son calque de colision", function () {

            maps.meshsData = [
                {
                    name: "ground",

                    colisionCase: false
                }

            ];

            maps.create();

            expect( maps.meshGround.length ).toEqual( 1 );
        });

        it( "Peut importer un mesh avec son calque de colision", function () {

            maps.meshsData = [
                {
                    name: "permanentBlocks",

                    colisionCase: true
                }

            ];

            maps.create();

            expect( maps.meshGround.length ).toEqual( 2 );
        });

        it( "Peut importer deux mesh sans calque", function () {

            maps.meshsData = [
                {
                    name: "ground",

                    colisionCase: false
                },
                {
                    name: "permanentBlocks",

                    colisionCase: false
                }

            ];

            maps.create();

            expect( maps.meshGround.length ).toEqual( 2 );
        });

        it( "Peut lever une erreur si mesh n'est pas preload", function () {

            maps.meshsData = [
                {
                    name: "meshNonLoad",

                    colisionCase: false
                }
            ];

            expect( maps.create ).toThrow( Error( "Mesh is not preload" ) );
        });

        it( "Peut rendre visible le mesh", function () {

            maps.meshsData = [
                {
                    name: "permanentBlocks",

                    colisionCase: false
                }
            ];

            maps.create();

            expect( maps.meshGround[0].isVisible ).toBe( true );
        });

        it( "Peut rendre visible le calque du mesh", function () {

            maps.meshsData = [
                {
                    name: "permanentBlocks",

                    colisionCase: true
                }
            ];

            maps.create();

            expect( maps.meshGround[1].isVisible ).toBe( true );
        });

        it( "Peut checkCollisions si mesh sans calque", function () {

            maps.meshsData = [
                {
                    name: "permanentBlocks",

                    colisionCase: false
                }
            ];

            maps.create();

            expect (maps.meshGround[0].checkCollisions ).toBe( true );
        });

        it( "Peut checkCollisions le calque du mesh", function () {

            maps.meshsData = [
                {
                    name: "permanentBlocks",

                    colisionCase: true
                },
                {
                    name: "tempBlock",

                    colisionCase: true
                }
            ];

            maps.create();


            expect( maps.meshGround[0].checkCollisions ).toBe( false );

            expect( maps.meshGround[1].checkCollisions ).toBe( true );
        });

    });

    describe( "Temps blocks methods", function() {

        beforeEach( function () {

            maps.create();

        });

        it( "Peut ajouter les blocks temp recuperer", function () {

            expect(maps.getBlocks().length).toEqual(135);
        });

        it( "Peut suprimmer tout les blocks" , function () {

            maps.delBlocks();

            expect( maps.getBlocks().length).toEqual( 0 );
        });

        it( "Peut recuperer un block par sa position", function () {

            var position = { x: -24, y: 0, z: -64 };

            expect( maps.getBlockByPosition( position ).position ).toEqual( position );
        });

        it( "Peut suprimmer un block par son id", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlockById( block.id )).toEqual( true );

        });

        it( "Peut supprimer un block par sa position", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlocksByPosition( { x: -24, y: 0, z: -64 } )).toEqual( true );

            expect( maps.getBlockByPosition( block.position )).toEqual( null );

        });

        it ( "Peut supprimer un bloc et le restaurer", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlocksByPosition( { x: -24, y: 0, z: -64 } )).toEqual( true );

            expect( maps.getBlockByPosition( block.position )).toEqual( null );

            expect( maps.getBlocks().length).toEqual( 134 );

            maps.restoreBlock();

            expect( maps.getBlocks().length).toEqual( 135 );

        });

        it ( "Peut supprimer plusieurs blocs et les restaurer", function () {

            expect( maps.delBlocksByPosition( {x: -24, y: 0, z: -64} )).toEqual ( true );

            expect( maps.delBlocksByPosition( {x: -16, y: 0, z: -64} )).toEqual ( true );

            expect( maps.delBlocksByPosition( {x: -8, y: 0, z: -64} )).toEqual ( true );

            expect( maps.getBlocks().length).toEqual( 132 );

            maps.restoreBlock();

            expect( maps.getBlocks().length).toEqual( 135 );

        });

    });

    describe( "Player methods", function () {

        it( "Peut ajouter et recuperer player", function () {

            maps.addObject( player );

            expect(maps.getPlayers().length ).toEqual( 1 );

        });

        it( "Peut récuperer les players alive", function () {

            maps.addObject( player );

            var player2 = new Player(0, "testPlayer", spawnPoint, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );

            maps.addObject( player2 );

            var tab1 = maps.getPlayersAlive();

            player2.alive = false;

            var tab2 = maps.getPlayersAlive();

            expect(tab1).not.toEqual(tab2);

        });

        it( "Peut ajouter un player et un block et récupérer uniquement le player", function () {

            var block = new Block( utils.guid(), { x: 0, z: 0}, gameMock.assets );

            maps.addObject( player );

            maps.addObject( block );

            expect( maps.getPlayers().length ).toEqual( 1 );

        });

        it( "Peut recuperer un player avec son ID", function () {

            maps.addObject( player );

            expect( maps.getPlayerById( player.id ) ).toEqual( player );

        });

        it( "Peut recuperer un player avec sa position", function () {

            maps.addObject( player );

            expect( maps.getPlayerByPosition( player.roundPosition() ) ).toEqual( player );

        });

        it( "Peut supprimer un player", function () {

            maps.addObject( player );

            maps.delPlayerById( player.id );

            expect( maps.getPlayers().length ).toEqual( 0 );

        });

        it( "Peut tuer un player", function () {
            jasmine.clock().install();

            maps.addObject( player );

            maps.killPlayerById( player.id );

            jasmine.clock().tick( cfg.destroyPlayerTimer );

            expect( maps.getPlayers().length ).toEqual( 1 );

            expect( player.alive ).toBeFalsy();

            jasmine.clock().uninstall();

        });

        it( "Peut supprimer tous les players", function () {

            var player2 = new Player(2, "testPlayer", spawnPoint, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );

            maps.addObject( player );

            maps.addObject( player2 );

            maps.delPlayers();

            expect( maps.getPlayers().length ).toEqual( 0 );

        } )

    });

    describe( "Bombs methods", function () {

        describe( "Get", function () {

            beforeEach( function() {

                maps = new Maps( gameMock.assets, gameMock.blockDim, gameMock.blocksTemp, gameMock.scene, new MenuPlayers() );
                var bombeP1_1 = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);

                maps.addObject( player );
                player.addBomb( bombeP1_1 );
            });

            it( "Peut récupérer la bombe d'un player", function () {

                expect( maps.getBombs().length ).toEqual( 1 );

            });

            it( "Peut récupérer deux bombes d'un player", function () {

                player.position.x = 16;

                var bombe = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);
                player.addBomb( bombe );

                expect( maps.getBombs().length ).toEqual( 2 );

            });

            it( "Peut récupérer les bombes de deux players", function () {

                var player2 = new Player(2, "testPlayer2", { x:0, z:0}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets );


                maps.addObject( player2 );
                var bombe = new Bombe( utils.guid(), player2, player2.roundPosition() , gameMock.assets, gameMock.scene);
                player2.addBomb( bombe );

                expect( maps.getBombs().length ).toEqual( 2 );

            });

            it( "Peut récupérer deux bombes de deux players", function () {
                var player2 = new Player(2, "testPlayer2", {x: 0, z:0}, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, gameMock.assets, gameMock.blockDim );

                maps.addObject( player2 );
                var bombeP2_1 = new Bombe( utils.guid(), player2, player2.roundPosition() , gameMock.assets, gameMock.scene);
                player2.addBomb( bombeP2_1 );

                var bombeP1_2 = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);
                player2.addBomb( bombeP1_2 );

                player.position.x = 32;
                player2.position.x = 8;

                var bombeP2_2 = new Bombe( utils.guid(), player2, player2.roundPosition() , gameMock.assets, gameMock.scene);
                player2.addBomb( bombeP2_2 );

                expect( maps.getBombs().length).toEqual( 4 );

            });

            it( "Peut récupérer une bombe avec son ID", function () {

                expect ( maps.getBombsById( player.listBombs[0].id )).toEqual( player.listBombs[0] );

            });

        });

        describe( "Set", function () {

            it( "Une bombe est présente à la position", function () {

                maps.addObject( player );

                var bombeP1_1 = new Bombe( utils.guid(), player, player.roundPosition() , gameMock.assets, gameMock.scene);

                player.addBomb( bombeP1_1 );

                expect( maps.getBombByPosition( player.roundPosition() )).toEqual( player.listBombs[0] );

            });

            it( "Ne peut pas poser de bombe si il est mort", function () {

                maps.addObject( player );

                player.alive = false;

                expect( player.shouldSetBomb()).toEqual(false);

            });

        });

    });

    //describe( "PowerUp methods", function () {
    //
    //    beforeEach ( function () {
    //
    //        maps.create();
    //
    //    });
    //
    //    it ( "Peut remplir la maps de quelques powerUp", function () {
    //
    //        expect(maps.getPowerUps().length).toEqual(cfg.nbPowerUp);
    //
    //    });
    //
    //    it ( "Evite la création de 2 powerUp à la même position", function() {
    //
    //        var tab1 = maps.getPowerUps();
    //
    //        utils.addUniqueArrayProperty( tab1 );
    //
    //        var tab2 = tab1.unique();
    //
    //        expect(tab1.length).toEqual(tab2.length);
    //
    //    });
    //
    //    it ( "Peut trouver les PowerUps visibles", function () {
    //
    //        var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );
    //
    //        maps.delBlockById( block.id );
    //
    //        var tab1 = maps.getPowerUpsVisible();
    //
    //        expect(tab1.length).toEqual(1);
    //
    //    });
    //
    //    it ( "Peut retrouver un PowerUp par son ID", function () {
    //
    //        var powerUps = maps.getPowerUps();
    //
    //        expect( maps.getPowerUpsById( powerUps[8].id ) ).toEqual( powerUps[8] );
    //
    //    });
    //
    //    it ( "Peut supprimer un powerUps par son ID", function() {
    //
    //        var powerUps = maps.getPowerUps();
    //
    //        maps.delPowerUpsById( powerUps[8].id );
    //
    //        var powerUps2 = maps.getPowerUps();
    //
    //        expect( powerUps ).not.toEqual( powerUps2 );
    //
    //    });
    //
    //})
});