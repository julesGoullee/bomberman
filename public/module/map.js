"use strict";

function Maps ( game ) {

    var self = this;

    var nbLine = 10;

    var nbCol = 16;

    var content = [];

    var blockDim = 8;

    var assets = game.assets;

    /*PUBLIC METHODS*/

    self.meshGround = [];

    self.meshsData = [
        {
            name: "ground",

            colisionCase: false
        },
        {
            name: "permanentBlocks",

            colisionCase: true
        },
        {
            name: "tour",

            colisionCase: true
        }
    ];

    self.create = function() {

        for ( var iMesh = 0 ; iMesh < self.meshsData.length ; iMesh++ ) {

            if ( assets[self.meshsData[iMesh].name] === undefined ) {

                throw new Error( "Mesh is not preload" );
            }

            var mesh = assets[self.meshsData[iMesh].name][0];

            mesh.checkCollisions = false;

            mesh.isVisible = true;

            self.meshGround.push( mesh );

            if ( self.meshsData[iMesh].colisionCase ) {

                var  meshColision = assets[self.meshsData[ iMesh].name + "Colision" ][0];

                meshColision.isVisible = true;

                meshColision.checkCollisions = true;

                self.meshGround.push( meshColision );
            }

            else {
                //mesh.checkCollisions = true;
            }
        }

        createTemporaireBlock();
    };

    self.getPlayers = function() {

        var tabPlayer = [];

        var i = 0;

        var size = content.length;

        for ( i; i < size; i++ ) {

            if ( content[i].type == "player" ) {

                tabPlayer = content[i];
            }
        }
        return tabPlayer;
    };

    self.getPlayerById = function ( id ) {

        var players = self.getPlayers();

        var size = players.length;

        for ( var i = 0; i < size; i++ ) {

            if ( players[i].id == id ) {

                return players[i];
            }
        }

        return false;
    };

    self.getBombs = function () {

        var tabBomb = [];

        var players = self.getPlayers();

        var size = players.length;

        var i = 0;

        for ( i; i < size; i++ ) {

            var player = players[i];

            for ( i = 0; i < player.listBombs.length; i++ ){

                tabBomb = player.listBombs[i];
            }
        }

        return tabBomb;
    };


    /*PRIVATE METHODS*/

    function createTemporaireBlock (){
        //var block = new Block( assets, { x: 0, z: 0 } );

        for ( var iBlockLargeur = -nbLine / 2 ; iBlockLargeur <= nbLine / 2 ; iBlockLargeur++ ) {

            for ( var iBlockLongueur = - nbCol / 2 ; iBlockLongueur <= nbCol / 2 ; iBlockLongueur++ ) {

                var blockPosition = {

                    x: iBlockLargeur * blockDim,

                    z: iBlockLongueur * blockDim
                };

                if ( iBlockLargeur % 2 !== 0 ){

                    content.push( new Block( assets, blockPosition ) );
                }
                else if ( iBlockLongueur % 2 === 0 ) {

                    content.push( new Block( assets, blockPosition ) );
                }
            }
            //console.log( content.length );

        }
    }
}
