"use strict";

var config = require("./../../config/config.js");
var Block = require("../block/block.js");
var Bombe = require("../bomb/bomb.js");
var utils = require("../utils/utils.js");

function Maps(){

    var self = this;

    var _colLength = 10;

    var _lineLength = 16;

    var _blocksPermanent = [];

    var _positionMustFree = [];

    var _content = [];

    var _powerUp = [];

    var _blockDim = config.blockDim;

    //PUBLIC METHODS

    self.create = function () {

        createPositionMustFree();

        createPermanentBlock();

        if ( config.showBlockTemp ) {

            createTemporaireBlock();
        }

        if ( config.showPowerUp ) {

            //createPowerUp();
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

    self.getPlayersAlive = function() {

        var tabPlayers = self.getPlayers();

        var playersAlive = [];

        for ( var i = 0; i < tabPlayers.length; i++ ){

            if(tabPlayers[i].alive) {

                playersAlive.push(tabPlayers[i]);

            }
        }

        return playersAlive;
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

    self.getPlayerByPosition = function ( position ) {

        var players = self.getPlayers();

        for ( var i = 0; i < players.length; i++ ){
            if ( players[i].roundPosition().x === position.x && players[i].roundPosition().z === position.z ) {
                return players[i];
            }
        }

        return null;
    };

    self.delPlayerById = function ( playerId ) {

        for ( var i = 0; i < _content.length; i++ ) {
            if( _content[i].type === "player" &&  _content[i].id === playerId ) {

                _content[i].destroy();

                return true;
            }
        }

        return false;
    };

    self.delPlayers = function ( )  {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if ( _content[i].type === "player" ) {

                _content[i].destroy();

                _content.splice( i, 1 );
            }
        }

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

    self.delBlocks = function () {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if ( _content[i].type === "block" ) {

                _content.splice( i, 1 );
            }
        }
    };

    self.delBlockById = function ( blockId ) {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if( _content[i].type === "block" &&  _content[i].id === blockId ) {

                var powerUp = self.getPowerUpsByPosition( _content[i].position);

                if ( powerUp ) {

                    powerUp.meshs.shape.isVisible = true;

                }

                _content.splice( i, 1 );

                return true;
            }
        }
        return null;
    };

    self.getTempsBlocks =  function() {
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

    self.getBlockByPosition = function ( position ) {

        var blocks = self.getBlocks();

        for ( var i = 0; i < blocks.length ; i++ ) {

            var block = blocks[i];

            if ( block.position.x === position.x && block.position.z === position.z ) {

                return block;
            }
        }

        return null;

    };

    self.delBlocksByPosition = function ( position ) {

        for ( var i = 0;  i < _content.length; i++ ) {
            if ( _content[i].type === "block" && _content[i].position.x === position.x && _content[i].position.z === position.z) {

                _content.splice( i, 1 );

                return true;
            }
        }

        return null;
    };

    self.restoreBlock = function ( ) {

        self.delBlocks();

        createTemporaireBlock();
    };


    //Bombs

    self.setBomb = function ( player ) {

        if ( player.shouldSetBomb() && !self.getBombByPosition( player.roundPosition() ) ) {

            var bomb = new Bombe ( player, player.roundPosition());


            player.addBomb( bomb );

            bomb.onExploded( function() {

                player.delBombById( bomb.id );

                explosion( bomb, player );

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

    self.getBombByPosition = function( position ) {

        var tabBombs = self.getBombs();

        for ( var i = 0; i<tabBombs.length; i++ ) {

            if (position.z === tabBombs[i].position.z && position.x === tabBombs[i].position.x) {

                return tabBombs[i];

            }
        }

        return false;
    };

    self.delBombs = function () {

        var players = self.getPlayers();

        for ( var i = 0; i < players.length ; i++ ) {

            players[i].delBombs();
        }
    };


    //PowerUp

    self.getPowerUps = function () {

        var tabPowerUps = [];

        var i = 0;

        var size = _powerUp.length;

        for ( i; i < size; i++ ) {

            tabPowerUps.push(_powerUp[i]);

        }

        return tabPowerUps;
    };

    self.getPowerUpsByPosition = function ( position ) {

        var powerUps = self.getPowerUps();

        for ( var i = 0; i < powerUps.length ; i++ ) {

            var powerUp = powerUps[i];

            if ( powerUp.position.x === position.x && powerUp.position.z === position.z ) {

                return powerUp;

            }

        }

        return null;

    };


    //PRIVATE METHODS
    function createPositionMustFree (){

        _positionMustFree = [
            // pour les 4 angles la maps
            // angle 1
            {
                x: _colLength * _blockDim / 2,
                z: _lineLength * _blockDim / 2
            },
            {
                x: ( _colLength * _blockDim / 2 ) - _blockDim,
                z: ( _lineLength * _blockDim / 2 )
            },
            {
                x: ( _colLength * _blockDim / 2 ),
                z: ( _lineLength * _blockDim / 2 ) - _blockDim
            },
            //angle 2
            {
                x: -_colLength * _blockDim / 2,
                z: -_lineLength * _blockDim / 2
            },
            {
                x: ( -_colLength * _blockDim / 2 ) + _blockDim,
                z: ( -_lineLength * _blockDim / 2 )
            },
            {
                x: ( -_colLength * _blockDim / 2 ),
                z: ( -_lineLength * _blockDim / 2 ) + _blockDim
            },
            // angle 3
            {
                x: -_colLength * _blockDim / 2,
                z: _lineLength * _blockDim / 2
            },
            {
                x: ( -_colLength * _blockDim / 2 ) + _blockDim,
                z: ( _lineLength * _blockDim / 2 )
            },
            {
                x: ( -_colLength * _blockDim / 2 ),
                z: ( _lineLength * _blockDim / 2 ) - _blockDim
            },
            //angle 4
            {
                x: _colLength * _blockDim / 2,
                z: -_lineLength * _blockDim / 2
            },
            {
                x: ( _colLength * _blockDim / 2 ) - _blockDim,
                z: ( -_lineLength * _blockDim / 2 )
            },
            {
                x: ( _colLength * _blockDim / 2 ),
                z: ( -_lineLength * _blockDim / 2 ) + _blockDim
            }
        ];
    }

    function createPermanentBlock() {

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

    function positionHavePermBlock ( position ) {

        for ( var i = 0; i < _blocksPermanent.length; i++ ) {

            if ( _blocksPermanent[i].x === position.x && _blocksPermanent[i].z === position.z ) {

                return true;
            }

        }
        return false;
    }

    function createTemporaireBlock () {

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

                    _content.push( new Block( blockPosition ) );
                }
            }

        }
    }

    function explosion ( bomb, player ) {

        var degats = {
            players: [],
            blocks: []
        };

        var playerKills = false;

        utils.addUniqueArrayProperty(degats.players);
        utils.addUniqueArrayProperty(degats.blocks);

        calcDegat(degats, bomb, function(){

            // parcours les cases touché par la bombe pour les suprimmées
            for ( var iBlocks = 0; iBlocks < degats.blocks.length; iBlocks++ ) {

                self.delBlockById( degats.blocks[iBlocks].id );
            }

            // parcours les players touchés par la bombe pour les suprimmées
            for ( var iPlayer = 0; iPlayer < degats.players.length; iPlayer++ ) {

                if ( player.id !== degats.players[iPlayer].id ) {

                    player.kills ++;

                    playerKills = true;
                }

                self.delPlayerById( degats.players[iPlayer].id );

            }
        });

        if ( playerKills == true ) {

            //TODO notify

        }

        function calcDegat(tabDegats, bomb, callback){

            var caseAffectedByBomb = [];

            var playerAffectedByBomb = [];

            var bombAffectedByBomb = [];


            var blockInCurrentCase;

            var playerInCurrentCase;

            var bombInCurrentCase;

            var currentPosition;

            // parcours les cases X superieur la position de la bombe
            for ( var xPlus = bomb.position.x; xPlus <= bomb.position.x + ( bomb.power * _blockDim )  ; xPlus += 8 ) {

                currentPosition = { x: xPlus, z : bomb.position.z };

                if( xPlus <= _colLength * _blockDim && !positionHavePermBlock( currentPosition ) ){

                    blockInCurrentCase = self.getBlockByPosition( currentPosition );

                    playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                    bombInCurrentCase = self.getBombByPosition( currentPosition );

                    if( playerInCurrentCase ){

                        playerAffectedByBomb.push( playerInCurrentCase );

                    }

                    if( bombInCurrentCase  && !bombInCurrentCase.degatCheck){

                        bombInCurrentCase.degatCheck = true;

                        bombAffectedByBomb.push( bombInCurrentCase );
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

                    blockInCurrentCase = self.getBlockByPosition( currentPosition );

                    playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                    bombInCurrentCase = self.getBombByPosition( currentPosition );

                    if( playerInCurrentCase ){

                        playerAffectedByBomb.push( playerInCurrentCase );

                    }

                    if( bombInCurrentCase ){

                        bombAffectedByBomb.push( bombInCurrentCase );
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

                    blockInCurrentCase = self.getBlockByPosition( currentPosition );

                    playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                    bombInCurrentCase = self.getBombByPosition( currentPosition );

                    if( playerInCurrentCase ){

                        playerAffectedByBomb.push( playerInCurrentCase );

                    }

                    if( bombInCurrentCase ){

                        bombAffectedByBomb.push( bombInCurrentCase );
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

                    blockInCurrentCase = self.getBlockByPosition( currentPosition );

                    playerInCurrentCase = self.getPlayerByPosition( currentPosition );

                    bombInCurrentCase = self.getBombByPosition( currentPosition );

                    if( playerInCurrentCase ){
                        playerAffectedByBomb.push( playerInCurrentCase );

                    }

                    if( bombInCurrentCase ){

                        bombAffectedByBomb.push( bombInCurrentCase );
                    }

                    if ( blockInCurrentCase ) {
                        caseAffectedByBomb.push( blockInCurrentCase );

                        break;
                    }

                } else {

                    break;
                }

            }

            tabDegats.blocks = tabDegats.blocks.concat(caseAffectedByBomb);
            //tabDegats.blocks.unique();TODO

            tabDegats.players = tabDegats.players.concat(playerAffectedByBomb);
            //tabDegats.players.unique();TODO
            if(bombAffectedByBomb.length === 0 ){
                callback();
            }
            else {
                // parcours les players touchés par la bombe pour les suprimmées
                for (var iBombe = 0; iBombe < bombAffectedByBomb.length; iBombe++) {
                    bombAffectedByBomb[iBombe].exploded = true;
                    bombAffectedByBomb[iBombe].deleted();
                    player.delBombById(bomb.id);

                    calcDegat(tabDegats, bombAffectedByBomb[iBombe], callback);
                }
            }
        }
    }

}

module.exports = Maps;