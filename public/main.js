var playsersPosition = [
    [50, -65],
    [42, 72],
    [-50, 65],
    [-42, -72]
];

$(document).ready(function(){
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    // Create a hemisphericLight
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    // set the light intensity
    light.intensity = 0.7;

    var maps = new Maps(scene);
    maps.create();
    // Player
    var position = playsersPosition[3];
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(position[0], 15, position[1]), scene);
    camera.setTarget(new BABYLON.Vector3(0, 15, -65));
    camera.attachControl(canvas, false);
    //camera.checkCollisions = true;
    // create a sphere for the camera collision
    camera.ellipsoid = new BABYLON.Vector3(2,3,2);
    //camera.applyGravity = true;
    //camera.inertia = 0.4;
    //camera.angularSensibility = 1000;
    camera.speed = 1;

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        // Create octree
        scene.createOrUpdateSelectionOctree();
        // Render scene
        scene.render();
        // Show FPS rate
        document.getElementById("fps").innerHTML = BABYLON.Tools.GetFps().toFixed()+ " position: " + camera.position.toString();
    });

// Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
    engine.resize();

});
