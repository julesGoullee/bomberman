function Player(name, x, y){
    this.name = name;
    this.alive = true;
    this.pos = {
        x:x,
        y:y
    };
    this.power = {
        speed:0.45,
        shoot:false
    };
    this.type = 'player';
    this.listBomb = [];
    this.setBomb = function (bomb){
        this.listBomb.push(bomb);

    };
    this.kills = 0;
}