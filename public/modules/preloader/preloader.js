"use strict";

function Preloader ( scene, meshList, assets ) {

    var self = this;

    var _onFinishCallbacks = [];

    var _loader;


    /*PUBLIC METHODS*/

    self.onFinish = function ( callback ) {
        _onFinishCallbacks.push( callback );
    };


    /*PRIVATE METHODS*/

    function init() {

        _loader = new BABYLON.AssetsManager( scene );

        _loader.useDefaultLoadingScreen = true;//todo creer un loader qui attend les webSockets

        loopInitMeshs();

        _loader.load();

        _loader.onFinish = function(){
            for ( var i = 0 ; i < _onFinishCallbacks.length ; i++ ){

                _onFinishCallbacks[i]();
            }
        };

    }

    function loopInitMeshs (){

        function initMesh ( task ) {
            assets[task.name] = task.loadedMeshes;

            for ( var i=0 ; i < task.loadedMeshes.length ; i++ ) {

                var mesh = task.loadedMeshes[i];

                mesh.checkCollisions = false;

                mesh.isVisible = false;
            }
        }

        for ( var iMesh = 0 ; iMesh < meshList.length ; iMesh++ ) {

            var currentMeshs = _loader.addMeshTask( meshList[iMesh], "", "/content/", meshList[iMesh] + ".babylon" );

            currentMeshs.onSuccess = function( task ) {

                initMesh( task );
            };
        }
    }

    init();
}