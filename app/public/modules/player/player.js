"use strict";

function Player( id, name, spawnPoint, powerUp, alive, kills, assets, blockDim ) {

    var self = this;

    var _blockDim = blockDim;

    var _isReadyForSetBomb = true;

    //PUBLIC METHODS//

    self.id = id;

    self.name = name;

    self.type = "player";

    self.alive = alive;

    self.kills = kills;

    self.listBombs = [];

    self.position = new BABYLON.Vector3( 0, 0, 0 );

    self.meshs = {};

    self.powerUp = powerUp;


    //self.animData = {
    //    isRunnning : false
    //};

    self.roundPosition = function () {

        function roundValue ( value ) {

            return Math.round( Math.round( value ) / _blockDim ) *  _blockDim;

        }

        return {
            x: roundValue( self.position.x ),
            z: roundValue( self.position.z )
        }
    };

    self.shouldSetBomb = function () {

        return ( self.alive == true ) && (self.listBombs.length < self.powerUp.bombs ) && _isReadyForSetBomb;

    };

    self.destroy = function () {

        self.alive = false;

        self.meshs.shape.dispose();

        self.meshs.colisionBlock.dispose();

    };

    self.move = function( position ) {

        var animNamePosition = "MoveAnim";

        var nextPos = new BABYLON.Vector3( parseFloat(  position.x ), 0, parseFloat( position.z ) );

        self.meshs.shape.lookAt( new BABYLON.Vector3( parseFloat( position.x ), 0, parseFloat( position.z ) ) );

        var animationPosition;

        for ( var iAnim = 0 ; iAnim < self.meshs.shape.animations.length ; iAnim ++ ) {

            if ( self.meshs.shape.animations[iAnim].name === animNamePosition ) {

                animationPosition = self.meshs.shape.animations[iAnim];
            }
        }

        if ( !animationPosition ) {

            animationPosition = new BABYLON.Animation( animNamePosition, "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT );

            self.meshs.shape.animations.push( animationPosition );
        }

        var keysAnimPosition = [];

        keysAnimPosition.push( { frame: 0, value: self.meshs.shape.position } );

        keysAnimPosition.push( { frame: 10, value: nextPos } );

        animationPosition.setKeys( keysAnimPosition );

        self.position.x = position.x;
        self.position.z = position.z;

        self.meshs.colisionBlock.position.x = self.position.x;
        self.meshs.colisionBlock.position.z = self.position.z;

    };

    self.addBomb = function ( bomb ) {

        _isReadyForSetBomb = false;

        setTimeout(function(){

            _isReadyForSetBomb = true;

        }, cfg.timeBetweenTwoBombe );

        self.listBombs.push( bomb );
    };

    self.delBombById = function ( Bombid ) {

        for ( var i = 0; i < self.listBombs.length ; i++ ) {

            if ( self.listBombs[i].id === Bombid ) {

                self.listBombs.splice( i, 1 );

                return true;
            }
        }

        return false;
    };

    self.delBombs = function ( ){

        for ( var i = 0; i < self.listBombs.length ; i++ ) {

            self.listBombs[i].deleted();
        }

        self.listBombs = [];

        return true;
    };

    self.init = function() {

        createMesh();

        createMeshColision();

    };

    //PRIVATE METHODS//

    function createMesh() {

        if ( assets["persocourse"] === undefined ) {

            throw new Error( "Mesh persocourse is not preload" );
        }

        var meshPlayer = assets["persocourse"][0].clone();

        meshPlayer.skeleton = assets["persocourse"][0].skeleton.clone();

        var pivot = BABYLON.Matrix.RotationY( -Math.PI/2 );

        meshPlayer.setPivotMatrix( pivot );

        meshPlayer.isVisible = true;

        meshPlayer.position = new BABYLON.Vector3( spawnPoint.x, 0, spawnPoint.z );

        self.meshs.shape = meshPlayer;

        self.position = meshPlayer.position;
    }

    function createMeshColision() {

        var meshTempColision = assets["tempBlockColision"][0].clone();

        meshTempColision.isVisible = cfg.showBlockColision;

        meshTempColision.checkCollisions = false;

        meshTempColision.position = {
            x: spawnPoint.x,
            y: 0,
            z: spawnPoint.z
        };

        self.meshs.colisionBlock = meshTempColision;
    }

    self.init();
}