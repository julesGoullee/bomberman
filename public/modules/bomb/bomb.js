"use strict";

function Bombe ( owner, position ) {
    var self = this;

    /*PUBLIC METHODS*/

    self.id = utils.guid();

    self.power = 1;

    self.type = "bombs";

    self.countdown = 2000;

    self.exploded = false;

    self.duration = 800;

    self.owner = owner;

    self.position = {
        x: position.x,
        y: 0,
        z: position.z
    };

    self.destroy = function () {

        self.exploded = true;
    };

    /*PRIVATE METHODS*/
}