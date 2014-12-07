"use strict";

function Restore ( map, myPlayer ) {

    var self = this;

    //PUBLIC METHODS//

    self.showRestartButton = function () {

        $( "body" ).append( "<button class='btn' id='RestartButton'>Restart</button>" );

        $( "#RestartButton" ).click( function() {

            self.run();
        });
    };

    self.run = function () {

        myPlayer.camera.position =  new BABYLON.Vector3( myPlayer.spawnPoint[0], 13 , myPlayer.spawnPoint[1] );

        myPlayer.camera.setTarget( new BABYLON.Vector3( 0, 6.5, -65 ) );
    };

}