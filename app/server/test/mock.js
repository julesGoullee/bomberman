var _socketHandlerOnConnectCallbacks = [];
module.exports={
    socketHandler: {
        newConnect: function ( callback ) {
            _socketHandlerOnConnectCallbacks.push(callback);
        },
        launch: function(){

        }
    },
    socketHandlerOnConnectCallbacks : _socketHandlerOnConnectCallbacks,
    socket : {
        emit: function(){

        },
        on: function(){

        }
    }
};
