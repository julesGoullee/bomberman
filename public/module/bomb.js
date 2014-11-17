"use strict";

function Bomb ( x, y ) {

    var self = this;


    /*PUBLIC METHODS*/

    self.power = 1;

    self.pos = {
        x: x,
        y: y
    };

    self.type = "bombs";

    self.countdown = 2000;

    self.exploded = false;

    self.duration = 800;

    self.destroy = function () {

        self.exploded = true;
    };

    /*PRIVATE METHODS*/
}