"use strict";

function Maps( assets, blockDim, blocksTemp, scene, menuPlayers ) {

    var self = this;

    var _colLength = 10;

    var _lineLength = 16;

    var _content = [];

    var _powerUps = [];

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

        createGroundMeshs();

        createPermanentBlock();

        createTemporaireBlock();

        createPowerUp();

    };

    self.addObject = function ( player ) {

        _content.push( player );

    };


    //Players

    self.getPlayers = function () {

        var tabPlayer = [];

        for ( var i = 0; i < _content.length; i++ ) {
            if( _content[i].type == "player") {
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

        return playersAlive
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

    self.killPlayerById = function( playerId ){
        for ( var i = 0; i < _content.length; i++ ) {

            if (_content[i].type === "player" && _content[i].id === playerId) {

                menuPlayers.changeStatus( "Mort", _content[i].id );

                (function( player ){

                    scene.beginAnimation( player.meshs.shape, 506, 550, false, 1, function() {

                        setTimeout(player.destroy, cfg.destroyPlayerTimer);
                    });

                })(_content[i]);

                return true;
            }
        }

        return false;
    };

    self.delPlayerById = function ( playerId ) {

        for ( var i = 0; i < _content.length; i++ ) {

            if( _content[i].type === "player" &&  _content[i].id === playerId ) {

                self.killPlayerById( playerId );

                _content.splice( i, 1);
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


    //Bombs

    //self.setBomb = f //    return false;
    //};

    self.explosion = function( ownerId, bombeId, playersIdKilled, blocksIdDestroy  ){

        var player = self.getPlayerById( ownerId );
        var bombe = self.getBlockById( bombeId);

        player.delBombById( bombeId );

        bombe.destroy();

        for (var i = 0; i < playersIdKilled.length; i++) {
            self.killPlayerById( playersIdKilled[i]);
        }

        for (var j = 0; i < blocksIdDestroy.length; i++) {
            self.delBlockById( blocksIdDestroy[j]);
        }
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

            if ( position.z == tabBombs[i].position.z && position.x == tabBombs[i].position.x ) {

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

    self.getFreeCases = function(){
        //todo test
        var iBlockPerm;
        var iBlockTemp;
        var currentBlock;
        var casesFree = [];
        var tempBlock = self.getBlocks();

        for ( var iBlockLargeur = -_colLength / 2 ; iBlockLargeur <= _colLength / 2 ; iBlockLargeur++ ) {

            for ( var iBlockLongueur = -_lineLength / 2; iBlockLongueur <= _lineLength / 2; iBlockLongueur++ ) {

                iBlockPerm = 0;
                iBlockTemp = 0;

                for (iBlockTemp; iBlockTemp < tempBlock.length ; iBlockTemp++ ) {

                    currentBlock = tempBlock[iBlockTemp];

                    if ( currentBlock.position.x ===  iBlockLargeur * blockDim && currentBlock.position.z === iBlockLongueur * blockDim) {

                        break;
                    }
                }

                for (iBlockPerm; iBlockPerm < _blocksPermanent.length ; iBlockPerm++ ) {

                    currentBlock = _blocksPermanent[iBlockPerm];
                    if ( currentBlock.x ===  iBlockLargeur * blockDim && currentBlock.z === iBlockLongueur * blockDim ) {

                        break;
                    }
                }

                if( iBlockTemp === tempBlock.length && iBlockPerm === _blocksPermanent.length ){

                    casesFree.push({
                        x: iBlockLargeur,
                        z: iBlockLongueur
                    });

                }
            }
        }

        return casesFree;
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

    self.getBlockById = function () {
        //TODO
    };

    self.delBlockById = function ( blockId ) {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if( _content[i].type === "block" &&  _content[i].id === blockId ) {

                var powerUp = self.getPowerUpsByPosition( _content[i].position);

                if ( powerUp ) {

                    powerUp.meshs.shape.isVisible = true;

                    scene.beginAnimation(powerUp.meshs.shape, 0, 200, true, 1);

                }

                _content[i].destroy();

                _content.splice( i, 1 );

                return true;
            }
        }
        return null;
    };

    self.delBlocks = function () {

        for ( var i = _content.length -1; i >= 0; i-- ) {

            if ( _content[i].type === "block" ) {

                _content[i].destroy();

                _content.splice( i, 1 );
            }
        }
    };

    self.restoreBlock = function ( ) {

        self.delBlocks();

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


    //PowerUp

    self.getPowerUps = function () {

        var tabPowerUps = [];

        var i = 0;

        var size = _powerUps.length;

        for ( i; i < size; i++ ) {

            tabPowerUps.push(_powerUps[i]);

        }

        return tabPowerUps;
    };

    self.getPowerUpsVisible = function () {

        var tabPowerUps = self.getPowerUps();

        var powerUpsVisible = [];

        for (var i = 0; i < tabPowerUps.length ; i++){

            if(tabPowerUps[i].meshs.shape.isVisible){

                powerUpsVisible.push(tabPowerUps[i]);

            }
        }

        return powerUpsVisible;

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

    self.getPowerUpsById = function ( id ) {

        var powerUps = self.getPowerUps();

        var size = powerUps.length;

        for ( var i = 0; i < size; i++ ) {

            if ( powerUps[i].id == id ) {

                return powerUps[i];
            }
        }

        return null;
    };

    self.delPowerUpsById = function ( powerUpId ) {

        for ( var i = 0; i < _powerUps.length; i++ ) {

            if( _powerUps[i].id === powerUpId ) {

                setTimeout(_powerUps[i].destroy,500);

                _powerUps.splice(i, 1);

                return true;
            }
        }

        return false;
    };


    //PRIVATE METHODS//

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

                var  meshColision = _assets[self.meshsData[ iMesh ].name + "Colision" ][0];

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

    function createTemporaireBlock (){

        for ( var i = 0; i < blocksTemp.length; i++ ) {

            var blockTemp = blocksTemp[i];
            _content.push( new Block( blockTemp.id, blockTemp.position, _assets ) );
        }
    }

    function createPowerUp () {

        var blocks = self.getBlocks();

        if ( blocks.length >= cfg.nbPowerUp ) {
            for (var i = 0; i < cfg.nbPowerUp; i++) {

                var positionBlock = Math.floor(Math.random() * (blocks.length - 1));

                var position = blocks[positionBlock].position;

                blocks.splice(positionBlock, 1);

                _powerUps.push(new PowerUp(position, "", "", _assets));

            }
        }
    }


    self.playerLootPowerUp = function ( ) {

        var players = self.getPlayersAlive();

        var powerUps = self.getPowerUpsVisible();

        for ( var i = 0; i < players.length ; i++){

            for( var j = 0 ; j < powerUps.length ; j++){

                if (players[i].meshs.shape.intersectsMesh(powerUps[j].meshs.shape, false)) {
                    self.delPowerUpsById( powerUps[j].id);

                    (function(i){scene.beginAnimation(players[i].meshs.shape, 60, 110, false, 2, function(){
                    });})(i);

                }

            }

        }

    }

}
