"use strict";
function Player(name, position){
    
    var self = this;
    self.name = name;
    self.type = 'player';
    self.alive = true;
    self.kills = 0;
    self.listBombs = [];
    self.position = {
        x: position.x,
        y: position.y
    };
    self.powerUp = {
        speed: 0.45,
        shoot: false,
        bombs: 1
    };
    
    var init = function(){
        self.camera = new CameraPlayer(self.position);
    };

    self.setBomb = function (bomb){
        if (self.powerUp.bombs > 0) {
            self.powerUp.bombs -= 1;
            if(bomb.exploded = true) {
                self.powerUp.bomb += 1;
            }
        }
    };

    init();
}