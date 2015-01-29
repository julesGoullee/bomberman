"use strict";
var server = require("../../services/server/server.js" );


function socketHandler(){
    var self = this;

    var io = server.getSocketIo();
}

module.exports = socketHandler();
