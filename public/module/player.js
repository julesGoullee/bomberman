function Player(nom, x, y){
    this.nom = nom;
    this.alive = true;
    this.pos = {
        x:x,
        y:y
    };
    this.speed = 0.45;
    this.type = 'player';

}