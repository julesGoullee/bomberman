"use strict";

define(["babylon"], function(BABYLON) {
    return function Preloader(scene, meshList, assets) {

        var self = this;

        var _onFinishCallbacks = [];

        var _loader;


        /*PUBLIC METHODS*/

        self.onFinish = function (callback) {
            _onFinishCallbacks.push(callback);
        };


        /*PRIVATE METHODS*/

        function init() {

            _loader = new BABYLON.AssetsManager(scene);
            _loader.useDefaultLoadingScreen = false;

            scene._engine.loadingUIBackgroundColor = "#271204";
            scene._engine.loadingUIText = "Loading 0%";
            loopInitMeshs();

            _loader.load();

            _loader.onFinish = function () {
                //scene._engine.loadingUIText = "Loading 100%";
                for (var i = 0; i < _onFinishCallbacks.length; i++) {
                    _onFinishCallbacks[i]();
                }
            };

        }

        function loopInitMeshs() {

            function initMesh(task) {
                assets[task.name] = task.loadedMeshes;

                for (var i = 0; i < task.loadedMeshes.length; i++) {

                    var mesh = task.loadedMeshes[i];

                    mesh.useOctreeForCollisions = true;

                    mesh.checkCollisions = false;

                    mesh.isVisible = false;
                }
            }

            for (var iMesh = 0; iMesh < meshList.length; iMesh++) {
                var currentMeshs = _loader.addMeshTask(meshList[iMesh], "", "/content/", meshList[iMesh] + ".babylon");

                currentMeshs.onSuccess = function (task) {
                    var progression = 100 - ( ( _loader._waitingTasksCount / meshList.length ) * 100);
                    scene._engine.loadingUIText = "Loading " + Math.round(progression) + "%";
                    initMesh(task);
                };

                currentMeshs.onError = function (task) {

                    throw new Error("Mesh " + task.name + " as error on preloading.");
                }
            }
        }

        init();
    };
});