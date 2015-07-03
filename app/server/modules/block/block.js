"use strict";

var utils = require("../utils/utils.js");

function Block ( position ) {

    var self = this;

    //PUBLIC METHODS//

    self.id = utils.guid();

    self.type = "block";

    self.position = { x: position.x, z: position.z };

    //PRIVATE METHODS//

    function init() {

    }

    init();
}

module.exports = Block;