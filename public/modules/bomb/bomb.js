"use strict";

function Bombe ( owner, position, assets, scene) {

    var self = this;

    var _explodedCallback = [];

    //PUBLIC METHODS//

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

        launchExplosion();

        self.exploded = true;

        self.meshs.shape.dispose();

        self.meshs.colisionBlock.dispose();
    };

    self.onExploded = function ( callback ) {

        _explodedCallback.push( callback );
    };

    //PRIVATE METHODS//

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

        meshBomb.position = { x: position.x, y: 0, z:position.z};

        meshBomb.isVisible = true;

        meshBomb.checkCollisions = false;

        //meshBomb.setPhysicsState({ impostor : BABYLON.PhysicsEngine.SphereImpostor,move:true, mass:1, friction:0.5, restitution:0.5});

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

        utils.onMeshsExitIntersect( meshBombColision, self.owner.meshs.colisionBlock, scene );

        self.meshs.colisionBlock = meshBombColision;

        self.position = meshBombColision.position;

    }

    var launchExplosion = function (){

        if ( assets["animBombTest"] === undefined ) {

            throw new Error( "Mesh animBombTest is not preload" );
        }

        function animExplosion( partMeshExplosion ){

            scene.beginAnimation( partMeshExplosion, 0, 44, false, 0.1, function () {
                //partMeshExplosion.dispose();
                //partMeshExplosion.setPhysicsState({ impostor : BABYLON.PhysicsEngine.SphereImpostor, mass: 10 });

            });
        }

        for ( var i = 0; i < 500 ; i++ ) {
            var partMeshExplosion = assets["animBombTest"][i].clone();
            //a.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
            animExplosion(partMeshExplosion);
            partMeshExplosion.isVisible = true;
        }
    };

    init();
}