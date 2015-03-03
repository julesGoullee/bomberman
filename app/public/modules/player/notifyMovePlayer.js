"use strict";

function NotifyMovePlayer( connector, spawnPoint ){

    var self= this;

    var _currentPosition = {
        x: spawnPoint.x.toFixed(1),
        z: spawnPoint.z.toFixed(1)
    };

    self.notifyNewPosition = function( position ) {

        if( Math.abs( _currentPosition.x - position.x.toFixed(1) ).toFixed(1) > cfg.pasToSendPosition ||
            Math.abs( _currentPosition.z - position.z.toFixed(1) ).toFixed(1) > cfg.pasToSendPosition ){

            _currentPosition.z = position.z.toFixed(1);

            _currentPosition.x = position.x.toFixed(1);

            connector.sendMyPosition( _currentPosition );
        }


    };
}