"use strict";

describe( "Maps", function() {

    var maps;

    beforeEach( function() {
        maps = new Maps(gameMock);
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

            maps.meshsData = [
                {
                    name: "ground",
                    colisionCase: false
                }
            ];
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

    //TODO TEST getBombs

    it( "Peut ajouter et recuperer player", function () {

        var player = new Player( "testPlayer", [0,0], gameMock.assets);

        maps.addObject( player );

        expect(maps.getPlayers().length ).toEqual( 1 );

    });

    it( "Peut ajouter un player et un block et récupérer uniquement le player", function () {

        var player = new Player( "testPlayer", [0,0], gameMock.assets );

        var block = new Block( gameMock.assets, { x: 0, z: 0 } );

        maps.addObject( player );

        maps.addObject( block );

        expect( maps.getPlayers().length ).toEqual( 1 );

    });

    it( "Peut ajouter un player avec son ID", function () {

        var player = new Player( "testPlayer", [0, 0], gameMock.assets );

        maps.addObject( player );

        expect( maps.getPlayerById( player.id )).toEqual( player );

    });

});