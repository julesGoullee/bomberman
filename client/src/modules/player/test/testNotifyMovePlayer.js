//
//define(["player/notifyMovePlayer", "cfg"], function(NotifyMovePlayer, cfg) {
//    describe("notifyMovePlayer", function(){
//
//        var spawnPoint = { x:38.12208999479195, z:-59.94280235891238};
//        var notifyMovePlayer;
//        var connectorMock = {
//
//            sendMyPosition: function(position){
//
//            }
//        };
//
//        beforeEach(function(){
//
//            spyOn( connectorMock, 'sendMyPosition');
//            notifyMovePlayer = new NotifyMovePlayer(connectorMock,spawnPoint )
//
//        });
//
//        it( "Peut notifier si position change", function(){
//
//            cfg.pasToSendPosition = 0.4;
//            // arrondie en dessous
//
//            notifyMovePlayer.notifyNewPosition({x:38.62208999479, z: -59.94280235891238 });
//
//            expect(connectorMock.sendMyPosition).toHaveBeenCalledWith({x: '38.6', z: '-59.9' });
//
//            notifyMovePlayer.notifyNewPosition({x:37.92208999479, z: -59.94280235891238 });
//
//            expect(connectorMock.sendMyPosition).toHaveBeenCalledWith({x: '37.9', z: '-59.9' });
//
//
//            // arrondie au dessus
//            notifyMovePlayer.notifyNewPosition({x:38.36208999479, z: -59.94280235891238 });
//
//            expect(connectorMock.sendMyPosition).toHaveBeenCalledWith({x: '38.4', z: '-59.9' });
//
//            notifyMovePlayer.notifyNewPosition({x:37.87208999479, z: -59.94280235891238 });
//
//            expect(connectorMock.sendMyPosition).toHaveBeenCalledWith({x: '37.9', z: '-59.9' });
//
//        });
//
//        it( "Peut ne pas notifier si position superieur", function() {
//
//            // valeur superieur
//
//            notifyMovePlayer.notifyNewPosition({x: 38.22208999479, z: -59.94280235891238});
//
//            expect(connectorMock.sendMyPosition).not.toHaveBeenCalled();
//
//            notifyMovePlayer.notifyNewPosition({x: 38.16208999479, z: -59.94280235891238});
//
//            expect(connectorMock.sendMyPosition).not.toHaveBeenCalled();
//
//            // valeur inferieur
//
//            notifyMovePlayer.notifyNewPosition({x:38.02208999479, z: -59.94280235891238 });
//
//            expect(connectorMock.sendMyPosition).not.toHaveBeenCalled();
//
//            notifyMovePlayer.notifyNewPosition({x:37.97208999479, z: -59.94280235891238 });
//
//            expect(connectorMock.sendMyPosition).not.toHaveBeenCalled();
//        });
//
//    });
//});