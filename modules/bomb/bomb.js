"use strict";
var config = require("./../../config/config.js");
var utils = require("../utils/utils.js");

function Bombe ( id, owner, position ) {

    var self = this;

    var _timeOutExploded;

    var _explodedCallback = [];

    //PUBLIC METHODS//

    self.id = id;

    self.power = 2;

    self.type = "bombs";

    self.countDown = config.bombCountDown;

    self.exploded = false;

    self.duration = 800;

    self.owner = owner;

    self.position = { x: position.x, y: 0, z:position.z};

    self.destroy = function () {

        for ( var i = 0; i < _explodedCallback.length; i++ ) {

            _explodedCallback[i](self);

        }

        self.exploded = true;

    };

    self.onExploded = function ( callback ) {

        _explodedCallback.push( callback );
    };

    self.deleted = function () {

        self.cancelTimer();

    };

    self.cancelTimer = function ( ) {

        clearTimeout( _timeOutExploded );
    };

    //PRIVATE METHODS//

    function init() {

        _timeOutExploded = setTimeout( function() {

            self.destroy();

        }, self.countDown );
    }

    init();
}

module.exports = Bombe;