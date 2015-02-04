"use strict";

var expect = require("expect.js");
var mock = require("../../../test/mock.js");
var config = require("../../../config/config.js");
//var Room = require("../room/room.js" );


describe("Room", function() {

    var _room;

    beforeEach(function () {

        _room = require("../room.js");
    });

    it("Peut ajouter un player dans une room", function () {

        mock.socketHandlerOnConnectCallbacks[0]( mock.socket );

        //expect(_room.getRoomList().length).to.equal(1);
    });
});