"use strict";

var cfg = require("./../../config/config.js");
var Block = require("../block/block.js");

function Maps(){

    var self = this;

    var _colLength = 10;

    var _lineLength = 16;

    var _blocksPermanent = [];

    var _positionMustFree = [];

    var _content = [];

    var _powerUp = [];

    var _blockDim = cfg.blockDim;

    //PUBLIC METHODS

    self.create = function () {

        createPositionMustFree();

        createPermanentBlock();

        if ( cfg.showBlockTemp ) {

            createTemporaireBlock();
        }

        if ( cfg.showPowerUp ) {

            //createPowerUp();
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

    self.getTempsBlocks =  function(){
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

    function createPowerUp () {

        var blocks = self.getBlocks();

        for ( var i = 0; i < cfg.nbPowerUp; i++ ) {

            var positionBlock = Math.floor(Math.random() * (blocks.length - 1));

            var position = blocks[positionBlock].position;

            blocks.splice(positionBlock, 1);

            _powerUp.push( new PowerUp( position, "", "", _assets ) );

        }
    }

    function positionHavePermBlock ( position ){

        for ( var i = 0; i < _blocksPermanent.length; i++ ) {

            if ( _blocksPermanent[i].x === position.x && _blocksPermanent[i].z === position.z ) {

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

                    _content.push( new Block( blockPosition ) );
                }
            }

        }
    }
}

module.exports = Maps;