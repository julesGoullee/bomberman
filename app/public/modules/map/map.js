"use strict";

function Maps( assets, blockDim, scene ) {

    var self = this;

    var _colLength = 10;

    var _lineLength = 16;

    var _positionMustFree = [];

    var _content = [];

    var _blocksPermanent = [];

    var _blockDim = blockDim;

    var _assets = assets;

    //PUBLIC METHODS//

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
        //_assets["ground"][0].setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});

        createGroundMeshs();

        createPositionMustFree();

        createPermanentBlock();

        if ( cfg.showBlockTemp) {

            createTemporaireBlock();
        }
    };

    self.addObject = function ( player ) {

        _content.push( player );

    };


    //Players
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

        return null;
    };

    self.delPlayerById = function ( playerId ) {

        for ( var i = 0; i < _content.length; i++ ) {

            if( _content[i].type === "player" &&  _content[i].id === playerId ) {

                _content[i].destroy();

                _content.splice( i, 1 );

                return true;
            }
        }

        return false;
    };

    self.delPlayers = function ( )  {
        //todo delPlayers
    };

    self.getPlayerByPosition = function ( position ) {

        var players = self.getPlayers();

        for ( var i = 0; i < players.length; i++ ){
            if ( players[i].roundPosition().x === position.x && players[i].roundPosition().z === position.z ) {
                return players[i];
            }
        }

        return null;
    };

    //Bombs
    self.setBomb = function ( player ) {

        if ( player.shouldSetBomb() && !self.hasBombByPosition( player.roundPosition() ) ) {

            var bomb = new Bombe ( player, player.roundPosition() , _assets, scene);


            player.addBomb( bomb );

            bomb.onExploded( function() {

                player.delBombById( bomb.id );

                explosion( bomb );

            });

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

        return player && player.listBombs ? player.listBombs : null;
    };

    self.getBombsById = function ( id ) {

        var bombs = self.getBombs();

        var size = bombs.length;

        for ( var i = 0; i < size; i++ ) {

            if ( bombs[i].id == id ) {

                return bombs[i];
            }
        }

        return null;
    };

    self.delBombs = function () {

        var players = self.getPlayers();

        for ( var i = 0; i < players.length ; i++ ) {

            players[i].delBombs();
        }
    };

    self.hasBombByPosition = function( position ) {

        var tabBombs = self.getBombs();

        var test = 0;

       for ( var i = 0; i<tabBombs.length; i++ ) {

           if (position.z === tabBombs[i].position.z && position.x === tabBombs[i].position.x) {

               return true;

           }
       }

        return false;
    };


    //Blocks
    self.getBlocks = function () {

        var tabBlocks = [];

        var i = 0;

        var size = _content.length;

        for ( i; i < size; i++ ) {

            if ( _content[i].type === "block" ) {

                tabBlocks.push( _content[i] );
            }
        }

        return tabBlocks;
    };

    self.getBlocksByPosition = function ( position ) {

        var blocks = self.getBlocks();

        for ( var i = 0; i < blocks.length ; i++ ) {

            var block = blocks[i];

            if ( block.position.x === position.x && block.position.z === position.z ) {

                return block;
            }
        }

        return null;

    };

    self.getBlockById = function () {
        //TODO
    };

    self.delBlockById = function ( blockId ) {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if( _content[i].type === "block" &&  _content[i].id === blockId ) {

                _content[i].destroy();

                _content.splice( i, 1 );

                return true;
            }
        }

        return null;
    };

    self.restoreBlock = function ( ) {

        delTempBlock();

        createTemporaireBlock();
    };

    self.delBlocksByPosition = function ( position ) {

        for ( var i = 0;  i < _content.length; i++ ) {
            if ( _content[i].type === "block" && _content[i].position.x === position.x && _content[i].position.z === position.z) {

                _content[i].destroy();

                _content.splice( i, 1 );

                return true;
            }
        }

        return null;
    };

    self.delPlayerById = function ( playerId ) {

        for ( var i = 0; i < _content.length; i++ ) {

            if( _content[i].type === "player" &&  _content[i].id === playerId ) {

                _content[i].destroy();

                _content.splice( i, 1 );

                return true;
            }
        }

        return false;
    };



    //PRIVATE METHODS//

    function createPositionMustFree (){

        _positionMustFree = [
            // pour les 4 angles la maps
            // angle 1
            {
                x: _colLength * blockDim / 2,
                z: _lineLength * blockDim / 2
            },
            {
                x: ( _colLength * blockDim / 2 ) - blockDim,
                z: ( _lineLength * blockDim / 2 )
            },
            {
                x: ( _colLength * blockDim / 2 ),
                z: ( _lineLength * blockDim / 2 ) - blockDim
            },
            //angle 2
            {
                x: -_colLength * blockDim / 2,
                z: -_lineLength * blockDim / 2
            },
            {
                x: ( -_colLength * blockDim / 2 ) + blockDim,
                z: ( -_lineLength * blockDim / 2 )
            },
            {
                x: ( -_colLength * blockDim / 2 ),
                z: ( -_lineLength * blockDim / 2 ) + blockDim
            },
            // angle 3
            {
                x: -_colLength * blockDim / 2,
                z: _lineLength * blockDim / 2
            },
            {
                x: ( -_colLength * blockDim / 2 ) + blockDim,
                z: ( _lineLength * blockDim / 2 )
            },
            {
                x: ( -_colLength * blockDim / 2 ),
                z: ( _lineLength * blockDim / 2 ) - blockDim
            },
            //angle 4
            {
                x: _colLength * blockDim / 2,
                z: -_lineLength * blockDim / 2
            },
            {
                x: ( _colLength * blockDim / 2 ) - blockDim,
                z: ( -_lineLength * blockDim / 2 )
            },
            {
                x: ( _colLength * blockDim / 2 ),
                z: ( -_lineLength * blockDim / 2 ) + blockDim
            }
        ];
    }

    function createGroundMeshs () {
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

                meshColision.isVisible = cfg.showBlockColision;

                meshColision.checkCollisions = true;

                self.meshGround.push( meshColision );
            }

            else {
                mesh.checkCollisions = true;
            }
        }
    }

    function createPermanentBlock(){

        for ( var iBlockLargeur = -_colLength / 2 ; iBlockLargeur <= _colLength / 2 ; iBlockLargeur++ ) {

            for ( var iBlockLongueur = - _lineLength / 2 ; iBlockLongueur <= _lineLength / 2 ; iBlockLongueur++ ) {

                if ( iBlockLargeur % 2 === 0 ) {

                    if ( iBlockLongueur % 2 !== 0 ) {

                        _blocksPermanent.push({

                            x: iBlockLargeur * _blockDim,

                            z: iBlockLongueur * _blockDim
                        });
                    }
                }
            }
        }
    }

    function positionHavePermBlock ( position ){
        for ( var i = 0; i < _blocksPermanent.length; i++ ) {

            if(_blocksPermanent[i].x === position.x && _blocksPermanent[i].z === position.z ) {

                return true;
            }

        }
        return false;
    }

    function createTemporaireBlock (){

        function thisPositionMustBeFree ( position ) {

            for ( var i = 0; i < _positionMustFree.length; i++ ) {

                if(_positionMustFree[i].x === position.x && _positionMustFree[i].z === position.z ) {

                    return true;
                }
            }

            return false;
        }

        for ( var iBlockLargeur = -_colLength / 2 ; iBlockLargeur <= _colLength / 2 ; iBlockLargeur++ ) {

            for ( var iBlockLongueur = - _lineLength / 2 ; iBlockLongueur <= _lineLength / 2 ; iBlockLongueur++ ) {

                var blockPosition = {

                    x: iBlockLargeur * _blockDim,

                    z: iBlockLongueur * _blockDim
                };

                if ( !positionHavePermBlock( blockPosition ) && !thisPositionMustBeFree( blockPosition ) ) {

                    _content.push( new Block( _assets, blockPosition ) );
                }


            }
        }
    }

    function explosion ( bomb ) {

        var caseAffectedByBomb = [];

        var blockInCurrentCase;

        var playerAffectedByBomb = [];

        var playerInCurrentCase;

        var currentPosition;

        // parcours les cases X superieur la position de la bombe
        for ( var xPlus = bomb.position.x; xPlus <= bomb.position.x + ( bomb.power * _blockDim )  ; xPlus += 8 ) {

            currentPosition = { x: xPlus, z : bomb.position.z };

            if( xPlus <= _colLength * _blockDim && !positionHavePermBlock( currentPosition ) ){

                blockInCurrentCase = self.getBlocksByPosition( currentPosition );

                playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                if( playerInCurrentCase ){

                    playerAffectedByBomb.push( playerInCurrentCase );

                }

                if ( blockInCurrentCase ) {

                    caseAffectedByBomb.push( blockInCurrentCase );

                    break;
                }

            } else {

                break;
            }

        }

        // parcours les cases z superieur la position de la bombe
        for ( var zPlus = bomb.position.z; zPlus <= bomb.position.z + ( bomb.power * _blockDim )  ; zPlus += 8 ) {

            currentPosition = { x: bomb.position.x , z : zPlus };

            if( zPlus <= _lineLength * _blockDim && !positionHavePermBlock( currentPosition ) ){

                blockInCurrentCase = self.getBlocksByPosition( currentPosition );

                playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                if( playerInCurrentCase ){

                    playerAffectedByBomb.push( playerInCurrentCase );

                }

                if ( blockInCurrentCase ) {

                    caseAffectedByBomb.push( blockInCurrentCase );

                    break;
                }

            } else {

                break;
            }

        }

        // parcours les cases x inférieur la position de la bombe
        for ( var xMoins = bomb.position.x; xMoins >= bomb.position.x - ( bomb.power * _blockDim )  ; xMoins -= 8 ) {

            currentPosition = { x: xMoins, z : bomb.position.z };

            if( xMoins >= -_colLength * _blockDim && !positionHavePermBlock( currentPosition ) ){

                blockInCurrentCase = self.getBlocksByPosition( currentPosition );

                playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                if( playerInCurrentCase ){

                    playerAffectedByBomb.push( playerInCurrentCase );

                }

                if ( blockInCurrentCase ) {

                    caseAffectedByBomb.push( blockInCurrentCase );

                    break;
                }

            } else {

                break;
            }

        }

        // parcours les cases z inférieur la position de la bombe
        for ( var zMoins = bomb.position.z; zMoins >= bomb.position.z - ( bomb.power * _blockDim )  ; zMoins -= 8 ) {

            currentPosition = { x: bomb.position.x, z: zMoins };

            if( zMoins >= -_lineLength * _blockDim && !positionHavePermBlock( currentPosition ) ){

                blockInCurrentCase = self.getBlocksByPosition( currentPosition );

                playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                if( playerInCurrentCase ){
                    playerAffectedByBomb.push( playerInCurrentCase );

                }

                if ( blockInCurrentCase ) {
                    caseAffectedByBomb.push( blockInCurrentCase );

                    break;
                }

            } else {

                break;
            }

        }


        // parcours les cases toucher par la bombe pour les suprimmées
        for ( var i = 0; i < caseAffectedByBomb.length; i++ ) {

            self.delBlockById( caseAffectedByBomb[i].id );

        }

        for ( var i = 0; i < playerAffectedByBomb.length; i++ ) {

            self.delPlayerById( playerAffectedByBomb[i].id );

        }

    }

    function delTempBlock () {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if( _content[i].type === "block") {

                _content[i].destroy();

                _content.splice( i, 1 );
            }
        }
    }
}
