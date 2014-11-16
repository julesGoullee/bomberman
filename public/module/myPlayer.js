function MyPlayer ( game, name, spawnPoint ) {

    var self = this;

    self.scene = game.scene;

    self.game = game;

    //player speed
    self.speed = 1;

    //player inertia
    self.inertia = 0.9;

    //player angular inertia
    self.angularInertia = 0;

    //mouse sensibility (lower the better sensible)
    self.angularSensibility = 3000;



    //player
    self.player = new Player( name, spawnPoint );

    // player camera
    self.camera = self._initCamera();

    self.scene.activeCameras.push( self.camera );

    self.scene.activeCamera = self.camera;

}

MyPlayer.prototype = {

    _initCamera : function() {

        var camera = new BABYLON.FreeCamera(
            "cameraPlayer",
            //new BABYLON.Vector3(-46, 127, -70),
            new BABYLON.Vector3(0, 60, 0),
            this.scene
        );

        //var cam = new BABYLON.FreeCamera(
        //    'camera",
        //    new BABYLON.Vector3(this.position.x,this.position.y,this.position.z),
        //    this.scene
        //);

        camera.attachControl( this.scene.getEngine().getRenderingCanvas() );

        camera.setTarget( new BABYLON.Vector3( 0, 15, -65 ) );

        camera.ellipsoid = new BABYLON.Vector3( 2, 3.5, 2 );

        camera.keysUp = [90]; // Z

        camera.keysLeft = [81]; // Q

        camera.keysDown = [83]; // S

        camera.keysRight = [68]; // D


        camera.inertia = this.inertia;

        camera.speed = this.speed;

        camera.applyGravity = true;

        camera.checkCollisions = true;

        camera.angularSensibility = this.angularSensibility;

        //cam.angularInertia = this.angularInertia;

        //cam.layerMask = 2;

        return camera;
    }
};
