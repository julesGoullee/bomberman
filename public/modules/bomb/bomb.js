"use strict";

function Bombe ( owner, position, assets ) {
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
        y: 2.5,
        z: position.z
    };

    self.destroy = function () {

        self.exploded = true;
    };

    /*PRIVATE METHODS*/
    function init() {
        createMesh();
    }

    function createMesh () {
        self.mesh = assets["sphereBombe"][0].clone();
        self.mesh.position = self.position;
        self.mesh.isVisible = true;
    }

    init();
}