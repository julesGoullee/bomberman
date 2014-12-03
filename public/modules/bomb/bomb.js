"use strict";

function Bombe ( owner, position, assets, scene) {

    var self = this;

    var _explodedCallback = [];

    /*PUBLIC METHODS*/

    self.id = utils.guid();

    self.power = 2;

    self.type = "bombs";

    self.countDown = cfg.bombCountDown;

    self.exploded = false;

    self.duration = 800;

    self.owner = owner;

    self.position = { x: 0, y: 0, z: 0 };

    self.meshs = {};

    self.destroy = function () {

        for ( var i = 0; i < _explodedCallback.length; i++ ) {

            _explodedCallback[i](self);

        }

        self.exploded = true;

        self.meshs.shape.dispose();

        self.meshs.colisionBlock.dispose();
    };

    self.onExploded = function ( callback ) {

        _explodedCallback.push( callback );
    };

    /*PRIVATE METHODS*/

    function init() {

        createMeshColision();

        createMesh();

        setTimeout( function() {

            self.destroy();

        }, self.countDown );
    }

    function createMesh () {

        if ( assets["bomb"] === undefined ) {

            throw new Error( "Mesh bomb is not preload" );
        }

        var meshBomb =  assets["bomb"][0].clone();

        meshBomb.position =  {
            x: position.x,
            y: 3,
            z: position.z + 2.5//todo erreur de position
        };

        meshBomb.isVisible = true;

        meshBomb.checkCollisions = false;

        self.meshs.shape = meshBomb;

    }

    function createMeshColision() {

        if ( assets["bombColision"] === undefined ) {

            throw new Error( "Mesh bombColision is not preload" );
        }

        var meshBombColision = assets["bombColision"][0].clone();

        meshBombColision.position = {
            x: position.x,
            y: 0,
            z: position.z
        };

        meshBombColision.isVisible = cfg.showBlockColision ;

        //scene.registerBeforeRender( function(){
        //   if(meshBombColision.intersectsMesh( self.owner.meshs.colisionBlock) ){
        //       console.log('ok');
        //   }
        //   console.log('naa');
        //
        //});
        //meshBombColision.checkCollisions = true;

        self.meshs.colisionBlock = meshBombColision;

        self.position = meshBombColision.position;

    }

    init();
}