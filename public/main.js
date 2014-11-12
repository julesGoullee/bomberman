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
    camera.checkCollisions = true;
    // create a sphere for the camera collision
    camera.ellipsoid = new BABYLON.Vector3(2,3,2);
    camera.applyGravity = true;
    camera.speed = 0.8;
    // block cassable
    BABYLON.SceneLoader.ImportMesh("", "/content/bloc/", "cubecassable.babylon", scene, function (newMeshes) {
        // for every mesh in the model
        for (var i in newMeshes) {
            // set the scale of the model
            //newMeshes[i].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
            // set the position of the model
            newMeshes[i].position = new BABYLON.Vector3(26, 0, 8);
            newMeshes[i].checkCollisions = true;
            // set relative referential, the model will follow your camera
            //newMeshes[i].parent = camera;
        }
    });

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

});
