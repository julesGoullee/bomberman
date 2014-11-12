function Player(name, x, y){
    this.name = name;
    this.alive = true;
    this.pos = {
        x:x,
        y:y
    };
    this.powerUp = {
        speed:0.45,
        shoot:false,
        bombs:1
    };
    this.type = 'player';
    this.setBomb = function (bomb){
        if (this.powerUp.bombs > 0) {
            this.powerUp.bombs -= 1;
            if(bomb.exploded=true){
                this.powerUp.bomb +=1;
            }
        }
    };
    this.kills = 0;
}