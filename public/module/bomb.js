function Bomb (x, y){
    this.power = 1;
    this.pos = {
        x:x,
        y:y
    };
    this.type ='bombs';
    this.countdown = 2000;
    this.exploded = false;
    this.duration = 800;
    this.destroy = function () {
        
    }

}