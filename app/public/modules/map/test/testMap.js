"use strict";

describe( "Maps", function() {

    cfg.showBlockColision = true;

    cfg.showBlockTemp = true;

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

    describe( "Temps blocks methods", function() {

        beforeEach( function () {

            maps.create();

        });

        it( "Peut remplir la map de block en laissant les angles sans block temp", function () {

            expect(maps.getBlocks().length).toEqual(135);
        });

        it( "Peut recuperer un block par sa position", function () {

            var position = { x: -24, y: 0, z: -64 };

            expect( maps.getBlocksByPosition( position ).position ).toEqual( position );
        });

        it( "Peut suprimmer un block par son id", function () {

            var block = maps.getBlocksByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlockById( block.id )).toEqual( true );

        });

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

            it( "Peut récupérer une bombe avec son ID", function () {

                maps.addObject( player );

                maps.setBomb( player );

                expect ( maps.getBombsById( player.listBombs[0].id )).toEqual( player.listBombs[0] );

            });

        });

        describe( "Set", function () {

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

        describe( "Destroy", function () {

            beforeEach( function() {

                maps.create();

                jasmine.clock().install();
            });

            afterEach(function() {

                jasmine.clock().uninstall();
            });

            it( "Peut detruire les blocks en position superieur a la bombe lors de l'explosion", function () {

                player.position.x = -40;

                player.position.z = -64;

                maps.addObject( player );

                maps.setBomb( player );

                var positionExpectedAffected = [
                    {
                        x: -24,
                        z: -64
                    },
                    {
                        x: -40,
                        z: -48
                    }
                ];

                var positionNotExpectedAffected = [
                    {
                        x: -16,
                        z: -64
                    },
                    {
                        x: -40,
                        z: -40
                    },
                    {
                        x: -24,
                        z: -48
                    }
                ];


                for ( var i = 0; i < positionExpectedAffected.length; i++ ) {

                    expect( maps.getBlocksByPosition( positionExpectedAffected[i] )).not.toEqual( false );
                }

                for ( var k = 0; k < positionNotExpectedAffected.length; k++ ) {

                    expect( maps.getBlocksByPosition( positionNotExpectedAffected[k] )).not.toEqual( false );
                }

                jasmine.clock().tick( cfg.bombCountDown );

                for ( var j = 0; j < positionExpectedAffected.length ; j++ ) {
                    expect( maps.getBlocksByPosition( positionExpectedAffected[j] )).toEqual( null );
                }

                for ( var l = 0; l < positionNotExpectedAffected.length ; l++ ) {

                    expect( maps.getBlocksByPosition( positionNotExpectedAffected[l] )).not.toEqual( null );
                }

            });

            it( "Peut detruire les blocks en position inférieur a la bombe lors de l'explosion", function () {

                player.position.x = 40;

                player.position.z = 64;

                maps.addObject( player );

                maps.setBomb( player );

                var positionExpectedAffected = [
                    {
                        x: 24,
                        z: 64
                    },
                    {
                        x: 40,
                        z: 48
                    }
                ];

                var positionNotExpectedAffected = [
                    {
                        x: 16,
                        z: 64
                    },
                    {
                        x: 40,
                        z: 40
                    },
                    {
                        x: 24,
                        z: 48
                    }
                ];


                for ( var i = 0; i < positionExpectedAffected.length; i++ ) {

                    expect( maps.getBlocksByPosition( positionExpectedAffected[i] )).not.toEqual( null );
                }

                for ( var k = 0; k < positionNotExpectedAffected.length; k++ ) {

                    expect( maps.getBlocksByPosition( positionNotExpectedAffected[k] )).not.toEqual( null );
                }

                jasmine.clock().tick( cfg.bombCountDown );

                for ( var j = 0; j < positionExpectedAffected.length ; j++ ) {
                    expect( maps.getBlocksByPosition( positionExpectedAffected[j] )).toEqual( null );
                }

                for ( var l = 0; l < positionNotExpectedAffected.length ; l++ ) {

                    expect( maps.getBlocksByPosition( positionNotExpectedAffected[l] )).not.toEqual( null );
                }

            });

            it( "Peux stopper une explosion si il y a un block permanent", function () {

                player.position.x = 32;

                player.position.z = 64;

                maps.addObject( player );

                maps.setBomb( player );

                var positionExpectedAffected = [
                    {
                        x: 24,
                        z: 64
                    }
                ];

                var positionNotExpectedAffected = [
                    {
                        x: 32,
                        z: 48
                    }
                ];


                for ( var i = 0; i < positionExpectedAffected.length; i++ ) {

                    expect( maps.getBlocksByPosition( positionExpectedAffected[i] )).not.toEqual( null );
                }

                for ( var k = 0; k < positionNotExpectedAffected.length; k++ ) {

                    expect( maps.getBlocksByPosition( positionNotExpectedAffected[k] )).not.toEqual( null );
                }

                jasmine.clock().tick( cfg.bombCountDown );

                for ( var j = 0; j < positionExpectedAffected.length ; j++ ) {
                    expect( maps.getBlocksByPosition( positionExpectedAffected[j] )).toEqual( null );
                }

                for ( var l = 0; l < positionNotExpectedAffected.length ; l++ ) {

                    expect( maps.getBlocksByPosition( positionNotExpectedAffected[l] )).not.toEqual( null );
                }

            });

            it( "Peut annulé l'explosion des bombes", function () {

                maps.addObject( player );

                maps.setBomb( player );

                maps.setBomb( player );

                maps.delBombs();

                expect( maps.getBombs().length ).toEqual( 0 );

            });
        });

    });
});