$(document).ready(function(){

// Get the canvas element from our HTML below
    var canvas = document.getElementById("renderCanvas");
// Load the BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);
// Create scene
    var scene = new BABYLON.Scene(engine);
// Create free camera at the position 0,11,-10
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, 0), scene);
// target 0,0,0
    camera.setTarget(new BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
// activate collision on camera
//    camera.checkCollisions = true;
// create a sphere for the camera collision
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
// apply the gravity on the camera
//    camera.applyGravity = true;
// set the move speed of the camera
    camera.speed = 1;
    console.log(camera.position.toString());
// Create a hemisphericLight
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
//// set the light intensity
    light.intensity = 0.7;
//
//// Create a box for the skybox
//    var skybox = BABYLON.Mesh.CreateBox("skybox", 500.0, scene);
//// create a texture for the skybox
//    var skyboxtexture = new BABYLON.StandardMaterial("skybox", scene);
//// allow texture on internal face of the cube
//    skyboxtexture.backFaceCulling = false;
//// apply the material created on the cube
//    skybox.material = skyboxtexture;
//// remove light effect and create a white light
//    skyboxtexture.diffuseColor = new BABYLON.Color3(0, 0, 0);
//// give textures for the cube
//    skyboxtexture.reflectionTexture = new BABYLON.CubeTexture("/content/img/skybox/skybox", scene);
//// give the texture mode
//    skyboxtexture.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//
//
// Load and import a mesh from babylon file
    BABYLON.SceneLoader.ImportMesh("", "/content/scenes/map/", "sol.babylon", scene, function (newMeshes) {

        // for every mesh in the model
        for(var i in newMeshes)
        {
            if(newMeshes.hasOwnProperty(i)) {
                //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);

                // set collision system on
                newMeshes[i].checkCollisions = true;
            }
        }
    });
    BABYLON.SceneLoader.ImportMesh("", "/content/scenes/map/", "block.babylon", scene, function (newMeshes) {

        // for every mesh in the model
        for(var i in newMeshes)
        {
            if(newMeshes.hasOwnProperty(i)) {
                //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);

                // set collision system on
                newMeshes[i].checkCollisions = true;
            }
        }
    });
    BABYLON.SceneLoader.ImportMesh("", "/content/scenes/map/", "cubesTransparents.babylon", scene, function (newMeshes) {

        // for every mesh in the model
        for(var i in newMeshes)
        {
            if(newMeshes.hasOwnProperty(i)) {
                //newMeshes[i].scaling = new BABYLON.Vector3(0.2,0.2,0.1);

                // set collision system on
                newMeshes[i].checkCollisions = true;
            }
        }
    });
//    BABYLON.SceneLoader.ImportMesh("", "/content/scenes/", "Colt.babylon", scene, function (newMeshes) {
//        // for every mesh in the model
//        for (var i in newMeshes) {
//            // set the scale of the model
//            newMeshes[i].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
//            // set the position of the model
//            newMeshes[i].position = new BABYLON.Vector3(0.42, -0.53, 1.1);
//            // set relative referential, the model will follow your camera
//            newMeshes[i].parent = camera;
//        }
//    });
//// call methode
//    CreateMonsters();
//
// Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        // Create octree
        scene.createOrUpdateSelectionOctree();
        // Render scene
        scene.render();
        // Show FPS rate
        document.getElementById("fps").innerHTML = BABYLON.Tools.GetFps().toFixed();
    });
//
//// Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
//
//// listen mouse down event
//    window.addEventListener("mousedown", function (e) {
//        // if left click
//        if(e.which == 1)
//        {
//            // create a bullet object and call his method create
//            //new bullet().create();
//        }
//    });

// Remove context menu
    document.addEventListener("contextmenu", function (e) { e.preventDefault(); });

});
