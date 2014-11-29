"use strict";

describe( "Maps", function() {

    var maps;

    var player;

    var spawnPoint = [48, -64];

    beforeEach( function() {
        maps = new Maps( gameMock.assets, gameMock.blockDim );
        player = new Player( "testPlayer", spawnPoint , gameMock.assets, gameMock.blockDim );
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

    describe( "Generate tempBlock", function() {

        beforeEach( function() {


        });
        //TODO generattion des block temp
        //it("Peut importer un mesh sans son calque de colision", function () {
        //
        //    maps.nbCol = 2;
        //
        //    maps.nbLine = 4;
        //
        //    maps.create();
        //
        //    expect(maps.content.length).toEqual(1);
        //});

    });

    describe( "Player methods", function () {

        it( "Peut ajouter et recuperer player", function () {

            maps.addObject( player );

            expect(maps.getPlayers().length ).toEqual( 1 );

        });

        it( "Peut ajouter un player et un block et récupérer uniquement le player", function () {

            var block = new Block( gameMock.assets, { x: 0, z: 0 } );

            maps.addObject( player );

            maps.addObject( block );

            expect( maps.getPlayers().length ).toEqual( 1 );

        });

        it( "Peut recuperer un player avec son ID", function () {

            maps.addObject( player );

            expect( maps.getPlayerById( player.id ) ).toEqual( player );

        });

    });

    describe( "Bombs methods", function () {

        describe( "Get", function () {

            it( "Peut récupérer la bombe d'un player", function () {


                maps.addObject( player );

                maps.setBomb( player );

                expect( maps.getBombs().length ).toEqual( 1 );

            });

            it( "Peut récupérer deux bombes d'un player", function () {

                maps.addObject( player );

                maps.setBomb( player );

                maps.setBomb( player );

                expect( maps.getBombs().length ).toEqual( 2 );

            });

            it( "Peut récupérer les bombes de deux players", function () {

                var player2 = new Player( "testPlayer2", [0, 0], gameMock.assets );

                maps.addObject( player );

                maps.addObject( player2 );

                maps.setBomb( player );

                maps.setBomb( player2 );

                expect( maps.getBombs().length ).toEqual( 2 );

            });

            it( "Peut récupérer deux bombes de deux players", function () {
                var player2 = new Player( "testPlayer2", [0, 0], gameMock.assets );

                maps.addObject( player );

                maps.addObject( player2 );

                maps.setBomb( player );

                maps.setBomb( player );

                maps.setBomb( player2 );

                maps.setBomb( player2 );

                expect( maps.getBombs().length).toEqual( 4 );

            });

            it ( "Peut récupérer une bombe avec son ID", function () {

                maps.addObject( player );

                maps.setBomb( player );

                expect ( maps.getBombsById( player.listBombs[0].id )).toEqual( player.listBombs[0] );

            });
        });

        describe( "Set", function () {

            it( "Peut ajouter une bombe", function() {

                maps.setBomb( player );

                expect( player.listBombs.length ).toEqual( 1 );
            });

            it( "Peut poser une bombe a la position du player", function () {

                maps.setBomb( player );

                expect( player.listBombs[0].position.x ).toEqual( player.position.x);
                expect( player.listBombs[0].position.z ).toEqual( player.position.z);
            });

            it( "Peut poser une bombe a la position arrondie au dessus du player", function () {

                player.position.x = 28.456345;

                player.position.z = -13.557235;

                maps.setBomb( player );

                expect( player.listBombs[0].position.x ).toEqual( 32 );
                expect( player.listBombs[0].position.z).toEqual( -16 );
            });

            it( "Peut poser une bombe a la position arrondie en dessous du player", function () {

                player.position.x = 26.456345;

                player.position.z = -10.557235;

                maps.setBomb( player );

                expect( player.listBombs[0].position.x ).toEqual( 24 );
                expect( player.listBombs[0].position.z ).toEqual( -8 );
            });

            it( "Ne peut depasser le nombre de bombe maximun", function() {

                var nbBombeMax = player.powerUp.bombs;

                for ( var i = 0; i < nbBombeMax; i++ ) {

                    expect( maps.setBomb( player ) ).toEqual( true );
                }

                expect( player.listBombs.length ).toEqual( nbBombeMax );

                expect( maps.setBomb( player ) ).toEqual( false );

                expect( player.shouldSetBomb() ).toEqual( false );

                expect( player.listBombs.length ).toEqual( nbBombeMax );
            });

        });

    });

});