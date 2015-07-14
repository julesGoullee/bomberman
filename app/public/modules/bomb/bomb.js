"use strict";

function Bombe ( id, owner, position, assets, scene) {

    var self = this;


    //PUBLIC METHODS//

    self.id = id;

    self.power = 2;

    self.type = "bombs";

    self.countDown = cfg.bombCountDown;

    self.exploded = false;

    self.duration = 800;

    self.owner = owner;

    self.position = { x: 0, y: 0, z: 0 };

    self.meshs = {};

    self.destroy = function () {

        launchExplosion(function(){
            self.meshs.shape.dispose();
            self.meshs.colisionBlock.dispose();
        });

        self.exploded = true;

    };

    self.deleted = function () {

        self.meshs.shape.dispose();

        self.meshs.colisionBlock.dispose();
    };


    //PRIVATE METHODS//

    function init() {

        createMeshColision();

        createMesh();

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

    var launchExplosion = function ( callback ){

            // Create a particle system
            var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

            //Texture of each particle
            particleSystem.particleTexture = new BABYLON.Texture("content/particule.png", scene);

            // Where the particles come from
            particleSystem.emitter = self.meshs.shape; // the starting object, the emitter
            particleSystem.minEmitBox = new BABYLON.Vector3(-8, 0, 8); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(8, 0, -8); // To...


            // Colors of all particles
            particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.8, 0.3, 0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0.2, 0.1, 0, 0.0);

            // Size of each particle (random between...
            particleSystem.minSize = 0.4;
            particleSystem.maxSize = 1.2;

            // Life time of each particle (random between...
            particleSystem.minLifeTime = 0.9;
            particleSystem.maxLifeTime = 1.5;

            // Emission rate
            particleSystem.emitRate = 1000;

            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

            // Set the gravity of all particles
            //particleSystem.gravity = new BABYLON.Vector3(0, -10, 0);

            // Direction of each particle after it has been emitted
            particleSystem.direction1 = new BABYLON.Vector3(-1, 6, 1);
            particleSystem.direction2 = new BABYLON.Vector3(1, 6, -1);
            // Angular speed, in radians
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;

            // Speed
            particleSystem.minEmitPower = 10;
            particleSystem.maxEmitPower = 20;
            particleSystem.updateSpeed = 0.01;

            // Start the particle system
            particleSystem.start();

            particleSystem.targetStopDuration = 1.5;
            particleSystem.disposeOnStop = true;
            setTimeout(function(){
                callback();
            },1500);
            //var i = 0;
            //scene.registerBeforeRender(function () {
            //    i = i + 5;
            //    particleSystem.maxEmitBox = new BABYLON.Vector3(i, 0, i);
            //    particleSystem.direction1 = new BABYLON.Vector3(-i, 1, -i);
            //    particleSystem.direction2 = new BABYLON.Vector3(i, i*10, i);
            //});
            //setTimeout(function( ){
            //    particleSystem.stop();
            //    callback();
            //},10000)
    };

    init();
}