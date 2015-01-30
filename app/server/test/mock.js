var _socketHandlerOnConnectCallbacks = [];

module.exports={
    socketHandler: {
        newConnect: function (callback) {
            _socketHandlerOnConnectCallbacks.push(callback);
        }
    },
    socketHandlerOnConnectCallbacks : _socketHandlerOnConnectCallbacks
};
