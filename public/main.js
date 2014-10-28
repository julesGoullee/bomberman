$(document).ready(function(){

// Get the canvas element from our HTML below
    var canvas = document.getElementById("renderCanvas");
// Load the BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);
// Create scene
    var scene = new BABYLON.Scene(engine);
// Create free camera at the position 0,11,-10
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, 0), scene);
// target 0,0,0
    camera.setTarget(new BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
// activate collision on camera
//    camera.checkCollisions = true;
// create a sphere for the camera collision
    camera.ellipsoid = new BABYLON.Vector3(10, 15, 10);
// apply the gravity on the camera
//    camera.applyGravity = true;
// set the move speed of the camera
    camera.speed = 2;

//
//// Create a hemisphericLight
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
    BABYLON.SceneLoader.ImportMesh("", "/content/scenes/map/", "map.babylon", scene, function (newMeshes) {

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
//
//    function CreateMonsters()
//    {
//        // creation 10 monster
//        for (var i = 0; i <10 ; i ++)
//        {
//            BABYLON.SceneLoader.ImportMesh("", "/content/scenes/", "merguns.babylon", scene, function (newMeshes) {
//                // create a random position
//                var pos = new BABYLON.Vector3(-Math.random() * 60, 0, Math.random() * 60);
//                // for each mesh in my model
//                for (var i in newMeshes) {
//                    // set the scale of the mesh
//                    newMeshes[i].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
//                    // set the position with the random position previously created
//                    newMeshes[i].position = pos;
//                    // set collision system on
//                    newMeshes[i].checkCollisions = true;
//                }
//            });
//        }
//    }
//
//    var bullet = function () {
//        // create the target of the ray
//        this.target = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 1), BABYLON.Matrix.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, camera.rotation.z));
//        this.create = function () {
//            // create a ray with position of the camera and with the target
//            var rayPick = new BABYLON.Ray(camera.position, new BABYLON.Vector3(this.target.x * 200, this.target.y * 200, this.target.z * 200));
//
//            // interation on every mesh intersecting the ray
//            var meshFound = scene.pickWithRay(rayPick, function (item) {
//                // if the model is a monster we return true
//                if (item.name.indexOf("Mesh") != -1)
//                    return true;
//                return false;
//            });
//            // if meshFound is not null
//            if (meshFound != null && meshFound.pickedPoint != null) {
//                // look for the monster which is in the ray and remove it
//                for (var i in scene.meshes) {
//                    if (scene.meshes[i] == meshFound.pickedMesh) {
//                        scene.meshes[i].dispose();
//                        scene.meshes[i - 1].dispose();
//                    }
//
//                }
//            }
//        };
//    };
});
