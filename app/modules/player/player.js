"use strict";
var config = require( "../../config/config.js" );
var utils = require( config.rootPath + "/app/modules/utils/utils.js" );

function Player( name, socket ) {

    var self = this;


    /*PUBLIC METHODS*/

    self.id = utils.guid();

    self.socket = socket;

    self.kill = 0;

    self.alive = true;

    self.listBombs = [];

    self.position = {};

    self.powerUp = {
        speed: 0.45,
        shoot: false,
        bombs: 2
    };

    self.name = name;


    /*PRIVATE METHODS*/


}

module.exports = Player;