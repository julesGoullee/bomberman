"use strict";
function Block(position){
    var self = this;
    self.position = position;
    var init = function(){
        self.mesh = _meshHelper.importMesh("tempBlock", true, {x: self.position.x, y: 0, z: self.position.z});
    };

    init()

}