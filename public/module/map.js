"use strict";

function Maps ( game ) {

    var self = this;

    self.nbLine = 10;

    self.nbCol = 16;

    self.blockDim = 8;

    self.content = [];

    self.meshGround = [];

    self.game = game;

    self.meshs = [
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

        for ( var iMesh = 0 ; iMesh < self.meshs.length ; iMesh++ ) {

            if ( self.game.assets[self.meshs[iMesh].name] === undefined ) {

                throw new Error( "Mesh is not preload" );
            }

            var mesh = self.game.assets[self.meshs[iMesh].name][0];

            mesh.checkCollisions = false;

            mesh.isVisible = true;

            self.meshGround.push( mesh );

            if ( self.meshs[iMesh].colisionCase ) {

                var  meshColision = self.game.assets[self.meshs[ iMesh].name + "Colision" ][0];

                meshColision.isVisible = true;

                meshColision.checkCollisions = true;

                self.meshGround.push( meshColision );
            }

            else {
                mesh.checkCollisions = true;
            }
        }

        self.createTemporaireBlock();
    };

    self.getPlayers = function() {

        var tabPlayer = [];

        var i = 0;

        var size = self.content.length;

        for ( i; i < size; i++ ) {

            if ( self.content[i].type == "player" ) {

                tabPlayer = self.content[i];
            }
        }
        return tabPlayer;
    };

    self.getPlayerById = function ( id ) {

        var players = self.getPlayers();

        var size = players.length;

        for ( var i = 0; i < size; i++) {

            if (players[i].id == id) {

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

        for ( i; i < size; i++){

            var player = players[i];

            for ( i = 0; i < player.listBombs.length; i++){

                tabBomb = player.listBombs[i];
            }
        }
        return tabBomb;
    };
}

Maps.prototype = {

    createTemporaireBlock : function(){
        //var block = new Block({x:0 , z:0});

        for ( var iBlockLargeur = -this.nbLine / 2 ; iBlockLargeur <= this.nbLine / 2 ; iBlockLargeur++ ) {

            for ( var iBlockLongueur = - this.nbCol / 2 ; iBlockLongueur <= this.nbCol / 2 ; iBlockLongueur++ ) {

                var blockPosition = {

                    x: iBlockLargeur * this.blockDim,

                    z: iBlockLongueur * this.blockDim
                };

                if ( iBlockLargeur % 2 !== 0 ){

                    this.content.push( new Block( this.game, blockPosition ) );
                }
                else if ( iBlockLongueur % 2 === 0 ) {

                    this.content.push( new Block( this.game, blockPosition ) );
                }
            }
            //console.log(this.content.length);

        }
    }
};