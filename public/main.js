"use strict";
var _scene;
var _canvas;
var _engine;
var _meshHelper;
$(document).ready(function(){
    _canvas = document.getElementById("renderCanvas");
    _engine = new BABYLON.Engine(_canvas, true);
    _scene = new BABYLON.Scene(_engine);

    var playsersPosition = [
        [50, -65],
        [42, 72],
        [-50, 65],
        [-42, -72]
    ];

    _meshHelper = new MeshHelper();

    var maps = new Maps(_scene);
    var ligth = new Light();
    maps.create();
    // Player
    var position = playsersPosition[3];
    var player = new Player('myPlayer', position);

    _engine.runRenderLoop(function () {
        // Create octree
        _scene.createOrUpdateSelectionOctree();
        // Render scene
        _scene.render();

        /*DEBUG*/
        document.getElementById("debug").innerHTML = "fps : " + BABYLON.Tools.GetFps().toFixed() + " Position: " + player.camera.position.toString();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        _engine.resize();
    });
});
