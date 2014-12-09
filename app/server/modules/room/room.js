"use strict";

var config = require( "../../config/config.js" );
var Player = require( config.rootPath + "../player/player.js" );

function Room() {

    var self = this;

    self.players = [];

    self.addPlayer = function( socket ) {

    };
}

module.exports = Room;