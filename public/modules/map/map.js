"use strict";

function Maps( assets, blockDim ) {

    var self = this;

    var _nbLine = 10;

    var _nbCol = 16;

    var _content = [];

    var _blockDim = blockDim;

    var _assets = assets;

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

    self.create = function () {

        createGroundAndPermanentBlock();

        //createTemporaireBlock();

    };

    self.addObject = function ( player ) {

        _content.push( player );

    };

    self.getPlayers = function () {

        var tabPlayer = [];

        var i = 0;

        var size = _content.length;

        for ( i; i < size; i++ ) {

            if ( _content[i].type == "player" ) {

                tabPlayer.push(_content[i]);
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

    self.setBomb = function ( player ) {

        var bomb = new Bombe ( player, player.roundPosition() , _assets);

        if ( player.shouldSetBomb() ) {

            player.listBombs.push( bomb );

            return true;
        }

        return false;
    };

    self.getBombs = function () {

        var tabBomb = [];

        var players = self.getPlayers();

        var size = players.length;

        var i = 0;
        var j = 0;

        for ( i; i < size; i++ ) {

            var player = players[i];

            for ( j= 0 ; j < player.listBombs.length; j++ ){

                tabBomb.push( player.listBombs[j] );
            }
        }

        return tabBomb;
    };

    self.getBombsByPlayerId = function ( playerId ) {

        var player = self.getPlayerById( playerId );

        return player.listBombs;
    };

    self.getBombsById = function ( id ) {

        var bombs = self.getBombs();

        var size = bombs.length;

        for ( var i = 0; i < size; i++ ) {

            if ( bombs[i].id == id ) {

                return bombs[i];
            }
        }
    };

    /*PRIVATE METHODS*/

    function createGroundAndPermanentBlock() {
        for ( var iMesh = 0 ; iMesh < self.meshsData.length ; iMesh++ ) {

            if ( _assets[self.meshsData[iMesh].name] === undefined ) {

                throw new Error( "Mesh is not preload" );
            }

            var mesh = _assets[self.meshsData[iMesh].name][0];

            mesh.checkCollisions = false;

            mesh.isVisible = true;

            self.meshGround.push( mesh );

            if ( self.meshsData[iMesh].colisionCase ) {

                var  meshColision = _assets[self.meshsData[ iMesh].name + "Colision" ][0];

                meshColision.isVisible = true;

                meshColision.checkCollisions = true;

                self.meshGround.push( meshColision );
            }

            else {
                mesh.checkCollisions = true;
            }
        }
    }

    function createTemporaireBlock (){

        //TODO retirer 3 block dans les coins
        //var block = new Block( assets, { x: 0, z: 0 } );

        for ( var iBlockLargeur = -_nbLine / 2 ; iBlockLargeur <= _nbLine / 2 ; iBlockLargeur++ ) {

            for ( var iBlockLongueur = - _nbCol / 2 ; iBlockLongueur <= _nbCol / 2 ; iBlockLongueur++ ) {

                var blockPosition = {

                    x: iBlockLargeur * _blockDim,

                    z: iBlockLongueur * _blockDim
                };

                if ( iBlockLargeur % 2 !== 0 ){

                   if ( (iBlockLargeur !== -5 || iBlockLongueur !== -8) && (iBlockLargeur !== 5 || iBlockLongueur !== -8) && (iBlockLargeur !== -5 || iBlockLongueur !== 8) && (iBlockLargeur !== 5 || iBlockLongueur !== 8) && (iBlockLargeur !== -5 || iBlockLongueur !== -7) && (iBlockLargeur !== 5 || iBlockLongueur !== -7) && (iBlockLargeur !== -5 || iBlockLongueur !== 7) && (iBlockLargeur !== 5 || iBlockLongueur !== 7) && (iBlockLargeur !== -4 || iBlockLongueur !== -8) && (iBlockLargeur !== 4 || iBlockLongueur !== -8) && (iBlockLargeur !== -4 || iBlockLongueur !== 8) && (iBlockLargeur !== 4 || iBlockLongueur !== 8)) {

                        _content.push( new Block( _assets, blockPosition ) );
                    }

                    //_content.push( new Block( _assets, blockPosition ) );
                }
                else if ( iBlockLongueur % 2 === 0 ) {

                   if ((iBlockLargeur !== -5 || iBlockLongueur !== -8) && (iBlockLargeur !== 5 || iBlockLongueur !== -8) && (iBlockLargeur !== -5 || iBlockLongueur !== 8) && (iBlockLargeur !== 5 || iBlockLongueur !== 8) && (iBlockLargeur !== -5 || iBlockLongueur !== -7) && (iBlockLargeur !== 5 || iBlockLongueur !== -7) && (iBlockLargeur !== -5 || iBlockLongueur !== 7) && (iBlockLargeur !== 5 || iBlockLongueur !== 7) && (iBlockLargeur !== -4 || iBlockLongueur !== -8) && (iBlockLargeur !== 4 || iBlockLongueur !== -8) && (iBlockLargeur !== -4 || iBlockLongueur !== 8) && (iBlockLargeur !== 4 || iBlockLongueur !== 8)  ) {

                        _content.push( new Block( _assets, blockPosition ) );
                   }

                    //_content.push( new Block( _assets, blockPosition ) );
                }
            }
            //console.log( _content.length );
        }
    }
}
