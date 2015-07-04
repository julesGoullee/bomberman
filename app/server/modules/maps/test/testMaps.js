"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.sinon = require('sinon');
global.expect = chai.expect;
global.assert = chai.assert;
chai.use( sinonChai );

var config = require("../../../config/config.js");

var Maps = require("./../maps.js");
var Player = require("./../../player/player.js");
var Block = require("./../../block/block.js");

describe( "Maps", function() {

    var maps;

    var player;

    var spawnPoint = {x:40, z:-64};

    var mockRoom = {
        playersSpawnPoint: {
            getFreePosition: function(){}
        }
    };

    sinon.stub( mockRoom.playersSpawnPoint, "getFreePosition", function() {
        return spawnPoint;
    });

    beforeEach(function(){

        var mockSocket = {};
        var mockToken = "t1";

        maps = new Maps();

        maps.create();

        player = new Player( mockToken, mockSocket, "testPlayer", mockRoom );
    });

    describe( "Temps blocks methods", function() {

        it( "Peut remplir la maps de block en laissant les angles sans block temp", function () {

            expect(maps.getBlocks().length).to.equal(135);
        });

        it( "Peut suprimmer tout les blocks" , function () {

            maps.delBlocks();

            expect( maps.getBlocks().length).to.equal( 0 );
        });

        it( "Peut recuperer un block par sa position", function () {

            var position = { x: -24, z: -64 };

            expect( maps.getBlockByPosition( position ).position ).to.deep.equal( position );
        });

        it( "Peut suprimmer un block par son id", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlockById( block.id )).to.equal( true );

        });

        it( "Peut supprimer un block par sa position", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlocksByPosition( { x: -24, y: 0, z: -64 } )).to.equal( true );

            expect( maps.getBlockByPosition( block.position )).to.equal( null );

        });

        it ( "Peut supprimer un bloc et le restaurer", function () {

            var block = maps.getBlockByPosition( { x: -24, y: 0, z: -64 } );

            expect( maps.delBlocksByPosition( { x: -24, y: 0, z: -64 } )).to.equal( true );

            expect( maps.getBlockByPosition( block.position )).to.equal( null );

            expect( maps.getBlocks().length).to.equal( 134 );

            maps.restoreBlock();

            expect( maps.getBlocks().length).to.equal( 135 );

        });

        it ( "Peut supprimer plusieurs blocs et les restaurer", function () {

            expect( maps.delBlocksByPosition( {x: -24, y: 0, z: -64} )).to.equal ( true );

            expect( maps.delBlocksByPosition( {x: -16, y: 0, z: -64} )).to.equal ( true );

            expect( maps.delBlocksByPosition( {x: -8, y: 0, z: -64} )).to.equal ( true );

            expect( maps.getBlocks().length).to.equal( 132 );

            maps.restoreBlock();

            expect( maps.getBlocks().length).to.equal( 135 );

        });

    });

    describe( "Player methods", function () {

        beforeEach(function(){

            maps.addObject( player );

        });

        it( "Peut ajouter et recuperer player", function () {

            expect(maps.getPlayers().length ).to.equal( 1 );

        });

        it( "Peut récuperer les players alive", function () {

            var mockSocket2 = {};
            var mockToken2 = "t2";
            var player2 =  new Player( mockToken2, mockSocket2, "testPlayer", mockRoom);

            var tab1 = maps.getPlayersAlive();

            player2.alive = false;

            var tab2 = maps.getPlayersAlive();

            expect(tab1).not.to.equal(tab2);

        });

        it( "Peut ajouter un player et un block et récupérer uniquement le player", function () {

            var block = new Block( { x: 0, z: 0 } );

            maps.addObject( block );

            expect( maps.getPlayers().length ).to.equal( 1 );

        });

        it( "Peut recuperer un player avec son ID", function () {

            expect( maps.getPlayerById( player.id ) ).to.equal( player );

        });

        it( "Peut recuperer un player avec sa position", function () {

            expect( maps.getPlayerByPosition( player.roundPosition() ) ).to.equal( player );

        });

        it( "Peut supprimer un player", function () {

            expect( maps.getPlayers().length ).to.equal( 1 );

            assert( maps.delPlayerById( player.id ) );
            //expect( maps.getPlayers().length ).toEqual( 0 );
            //TODO pas suprimmer de content mais mesh destroy et player.alive false

        });

        it( "Peut supprimer tous les players", function () {

            var mockSocket2 = {};
            var mockToken2 = "t2";
            var player2 =  new Player( mockToken2, mockSocket2, "testPlayer", mockRoom);

            maps.addObject( player2 );

            maps.delPlayers();

            expect( maps.getPlayers().length ).to.equal( 0 );

        });

    });

    describe( "Bombs methods", function () {

        describe( "Get", function () {

            it( "Peut récupérer la bombe d'un player", function () {

                maps.addObject( player );

                maps.setBomb( player );

                expect( maps.getBombs().length ).to.equal( 1 );

            });

            it( "Peut récupérer deux bombes d'un player", function () {

                maps.addObject( player );

                maps.setBomb( player );

                player.position.x = 16;

                maps.setBomb( player );

                expect( maps.getBombs().length ).to.equal( 2 );

            });

            it( "Peut récupérer les bombes de deux players", function () {

                var spawnPoint2 = {x:0, z: 0};
                var mockSocket2 = {};
                var mockRoom2 = {
                    playersSpawnPoint: {
                        getFreePosition: function(){}
                    }
                };
                var mockToken2 = "t2";

                sinon.stub( mockRoom2.playersSpawnPoint, "getFreePosition", function() {
                    return spawnPoint2;
                });

                var player2 =  new Player( mockToken2, mockSocket2, "testPlayer2", mockRoom2);

                maps.addObject( player );

                maps.addObject( player2 );

                maps.setBomb( player );

                maps.setBomb( player2 );

                expect( maps.getBombs().length ).to.equal( 2 );

            });

            it( "Peut récupérer deux bombes de deux players", function () {
                var spawnPoint2 = {x:0, z: 0};
                var mockSocket2 = {};
                var mockRoom2 = {
                    playersSpawnPoint: {
                        getFreePosition: function(){}
                    }
                };
                var mockToken2 = "t2";
                sinon.stub( mockRoom2.playersSpawnPoint, "getFreePosition", function() {
                    return spawnPoint2;
                });

                var player2 =  new Player( mockToken2, mockSocket2, "testPlayer2", mockRoom2);

                maps.addObject( player );

                maps.addObject( player2 );

                maps.setBomb( player );

                maps.setBomb( player2 );

                player.position.x = 32;
                player2.position.x = 8;

                maps.setBomb( player );

                maps.setBomb( player2 );

                expect( maps.getBombs().length).to.equal( 4 );

            });

            it( "Peut récupérer une bombe avec son ID", function () {

                maps.addObject( player );

                maps.setBomb( player );

                expect ( maps.getBombsById( player.listBombs[0].id )).to.equal( player.listBombs[0] );

            });

        });

        describe( "Set", function () {

            it( "Ne peut depasser le nombre de bombe maximun", function() {

                maps.addObject( player );

                var nbBombeMax = player.powerUp.bombs;

                for ( var i = 0; i < nbBombeMax; i++ ) {
                    //le déplacer sinon pas possible de mettre plusieur bombe dans la mem ecase
                    player.position.x += i*4 ;
                    expect( maps.setBomb( player ) ).to.equal( maps.getBombs()[i] );
                }

                expect( player.listBombs.length ).to.equal( nbBombeMax );

                expect( maps.setBomb( player ) ).to.equal( false );

                expect( player.shouldSetBomb() ).to.equal( false );

                expect( player.listBombs.length ).to.equal( nbBombeMax );
            });

            it( "Une bombe est présente à la position", function () {

                maps.addObject( player );

                maps.setBomb( player );

                expect( maps.getBombByPosition( player.roundPosition() )).to.equal( player.listBombs[0] );

            });

            it( "Ne peut pas poser de bombe si il est mort", function () {

                maps.addObject( player );

                player.alive = false;

                expect( player.shouldSetBomb()).to.equal(false);

            });

        });

        describe( "Destroy", function () {

            var clock;

            beforeEach( function() {

                clock = sinon.useFakeTimers();

                maps.addObject( player );
            });

            afterEach(function() {

                clock.restore();

            });

            it( "Peut envoyer les degat dans le callabck setBomb", function( done ){
                player.position.x = 0;
                player.position.z = 0;

                maps.setBomb( player, function( degats ){
                    //TODO element different a cause des stubs donc on peu pas array.unique()
                    //expect( degats.blocks.length ).to.deep.equal(4);
                    //expect( degats.players.length ).to.deep.equal(4);
                    done();
                });
                clock.tick( config.bombCountDown*20 );

            });

            it( "Peut detruire les blocks en position superieur a la bombe lors de l'explosion", function () {

                player.position.x = -40;

                player.position.z = -64;


                assert( maps.setBomb( player ) );

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

                    expect( maps.getBlockByPosition( positionExpectedAffected[i] )).not.to.equal( null );
                }

                for ( var k = 0; k < positionNotExpectedAffected.length; k++ ) {

                    expect( maps.getBlockByPosition( positionNotExpectedAffected[k] )).not.to.equal( null );
                }

                clock.tick( config.bombCountDown*20 );

                for ( var j = 0; j < positionExpectedAffected.length ; j++ ) {
                    expect( maps.getBlockByPosition( positionExpectedAffected[j]) ).to.equal( null );
                }

                for ( var l = 0; l < positionNotExpectedAffected.length ; l++ ) {

                    expect( maps.getBlockByPosition( positionNotExpectedAffected[l] )).not.to.equal( null );
                }

            });

            it( "Peut detruire les blocks en position inférieur a la bombe lors de l'explosion", function () {

                player.position.x = 40;

                player.position.z = 64;

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

                    expect( maps.getBlockByPosition( positionExpectedAffected[i] )).not.to.equal( null );
                }

                for ( var k = 0; k < positionNotExpectedAffected.length; k++ ) {

                    expect( maps.getBlockByPosition( positionNotExpectedAffected[k] )).not.to.equal( null );
                }

                clock.tick( config.bombCountDown );

                for ( var j = 0; j < positionExpectedAffected.length ; j++ ) {
                    expect( maps.getBlockByPosition( positionExpectedAffected[j] )).to.equal( null );
                }

                for ( var l = 0; l < positionNotExpectedAffected.length ; l++ ) {

                    expect( maps.getBlockByPosition( positionNotExpectedAffected[l] )).not.to.equal( null );
                }
            });

            it( "Peux stopper une explosion si il y a un block permanent", function () {

                player.position.x = 32;

                player.position.z = 64;

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

                    expect( maps.getBlockByPosition( positionExpectedAffected[i] )).not.to.equal( null );
                }

                for ( var k = 0; k < positionNotExpectedAffected.length; k++ ) {

                    expect( maps.getBlockByPosition( positionNotExpectedAffected[k] )).not.to.equal( null );
                }

                clock.tick( config.bombCountDown );

                for ( var j = 0; j < positionExpectedAffected.length ; j++ ) {
                    expect( maps.getBlockByPosition( positionExpectedAffected[j] )).to.equal( null );
                }

                for ( var l = 0; l < positionNotExpectedAffected.length ; l++ ) {

                    expect( maps.getBlockByPosition( positionNotExpectedAffected[l] )).not.to.equal( null );
                }

            });

            it( "Peut annulé l'explosion d'une bombe d'un joueur", function () {

                maps.setBomb( player );

                maps.delBombs();

                expect( maps.getBombs().length ).to.equal( 0 );

            });

            it( "Peut annulé l'explosion de plusieur bombs d'un joueur", function () {

                maps.setBomb( player );

                maps.setBomb( player );

                maps.delBombs();

                expect( maps.getBombs().length ).to.equal( 0 );

            });

            it( "Peut annulé l'explosion de plusieur joueurs", function () {

                var spawnPoint2 = {x:0, z: 0};
                var mockSocket2 = {};
                var mockRoom2 = {
                    playersSpawnPoint: {
                        getFreePosition: function(){}
                    }
                };
                var mockToken2 = "t2";
                sinon.stub( mockRoom2.playersSpawnPoint, "getFreePosition", function() {
                    return spawnPoint2;
                });

                var player2 =  new Player( mockToken2, mockSocket2, "testPlayer2", mockRoom2);


                maps.addObject( player2 );

                maps.setBomb( player );

                maps.setBomb( player );

                maps.setBomb( player2 );
                maps.setBomb( player2 );


                maps.delBombs();

                expect( maps.getBombs().length ).to.equal( 0 );

            });

            it ( "Peut se tuer", function () {

                maps.setBomb( player );

                expect( player.kills ).to.equal( 0 );

                expect( player.alive ).to.equal( true );

                clock.tick( config.bombCountDown );

                expect( player.alive ).to.equal( false );

                expect( player.kills ).to.equal( 0 );

            });

            it ( "Peut tuer un deuxieme player et incrémenter son score", function () {

                player.position.x = 32;

                player.position.z = 64;

                var spawnPoint2 = {x:40, z:64};
                var mockSocket2 = {};
                var mockRoom2 = {
                    playersSpawnPoint: {
                        getFreePosition: function(){}
                    }
                };
                var mockToken2 = "t2";
                sinon.stub( mockRoom2.playersSpawnPoint, "getFreePosition", function() {
                    return spawnPoint2;
                });

                var player2 =  new Player( mockToken2, mockSocket2, "testPlayer2", mockRoom2);

                maps.addObject( player2 );

                expect( player2.alive ).to.equal( true );

                expect( player.kills).to.equal ( 0 );

                maps.setBomb( player );

                clock.tick( config.bombCountDown );

                expect( player.alive ).to.equal( false );

                expect( player2.alive ).to.equal( false );

                expect( player.kills ).to.equal( 1 );

                expect( player2.kills ).to.equal( 0 );

            });

            it ( "Peut tuer un player ne position superieur a la bombe ", function () {

                maps.setBomb( player );

                player.position.z = -56;

                clock.tick( config.bombCountDown );

                expect( player.alive ).to.equal( false );

            });

            it ( "Peut tuer un player ne position inferieur a la bombe ", function () {

                player.position.z = -56;

                maps.setBomb( player );

                player.position.z = -64;


                clock.tick( config.bombCountDown );

                expect( player.alive ).to.equal( false );

            });

            it ( "Ne peut pas tuer un player s'il il y un block temp entre lui et la bombe", function () {

                player.position.z = -56;

                maps.setBomb( player );

                player.position.z = -40;


                clock.tick( config.bombCountDown );

                expect( player.alive ).to.equal( true );

            });

            it ( "Ne peut pas tuer un player s'il y a un block permanent entre le player et la bombe ", function () {

                player.position.z = -56;

                maps.setBomb( player );

                player.position.x = 24;


                clock.tick( config.bombCountDown );

                expect( player.alive ).to.equal( true );

            });

        });

        describe("Reaction en chaine", function(){

            var clock;

            beforeEach( function() {

                clock = sinon.useFakeTimers();

                maps.addObject( player );

            });

            afterEach(function() {

                clock.uninstall();
            });

            it( "Peut detruire les blocks en position superieur a la bombe lors de l'explosion", function () {

                //1
                player.position.x = 32;
                player.position.z = -64;

                maps.setBomb( player );

                expect( maps.getBlockByPosition( {x: 24, z: -64} ) ).not.to.equal( null );

                player.position.x = 42;
                player.position.z = -54;

                clock.tick( config.bombCountDown );

                expect( maps.getBlockByPosition( {x: 24, z: -64} ) ).to.equal( null );

                // 2
                player.position.x = 24;
                player.position.z = -64;

                maps.setBomb( player );

                expect( maps.getBlockByPosition( {x: 24, z: -56} ) ).not.to.equal( null );
                expect( maps.getBlockByPosition( {x: 16, z: -64} ) ).not.to.equal( null );

                player.position.x = 42;
                player.position.z = -54;

                clock.tick( config.bombCountDown );

                expect( maps.getBlockByPosition( {x: 24, z: -56} )).to.equal( null );
                expect( maps.getBlockByPosition( {x: 16, z: -64} )).to.equal( null );

                // 3 deux bombe cote a cote ( 2 block sur deux axes different)

                player.position.x = 16;
                player.position.z = -64;

                maps.setBomb( player );

                clock.tick( config.bombCountDown / 2 );

                player.position.x = 24;
                player.position.z = -64;

                maps.setBomb( player );

                player.position.x = 42;
                player.position.z = -54;

                expect( maps.getBlockByPosition( {x: 8, z: -64} ) ).not.to.equal( null );
                expect( maps.getBlockByPosition( {x: 24, z: -48} ) ).not.to.equal( null );

                clock.tick( config.bombCountDown / 2 );

                expect( maps.getBlockByPosition( {x: 8, z: -64} ) ).to.equal( null );
                expect( maps.getBlockByPosition( {x: 24, z: -48} ) ).to.equal( null );

            });
        });

    });
});